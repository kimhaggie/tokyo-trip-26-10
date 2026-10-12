// 데이터 무결성 검사 — 실패하면 exit 1 (CI에서 배포를 막는다)
import { TRIP, BOOKINGS, DAYS, CHOICES, PREP, WISHLIST } from '../data/trip.js';
import { PLACES } from '../data/places.js';
import { SOURCES } from '../data/sources.js';

const errors = [];
const fail = (m) => errors.push(m);
const ids = new Set();
const placeIds = new Set();
const sourceIds = new Set(SOURCES.map((s) => s.id));

const PLACE_STATUS = ['official_checked', 'third_party_checked', 'user_confirmed', 'needs_verification'];
for (const p of PLACES) {
  if (placeIds.has(p.id)) fail(`장소 id 중복: ${p.id}`);
  placeIds.add(p.id);
  if (!p.nameKo && !p.nameJa) fail(`${p.id}: 이름 없음`);
  if (!p.category) fail(`${p.id}: category 없음`);
  for (const k of ['addressStatus', 'hoursStatus']) {
    if (!PLACE_STATUS.includes(p[k])) fail(`${p.id}: ${k} 값 이상 (${p[k]})`);
  }
  if (p.coordinates != null) {
    const [lat, lng] = p.coordinates;
    if (!(lat > 35.4 && lat < 35.9 && lng > 139.5 && lng < 140.5)) fail(`${p.id}: 도쿄·나리타 범위 밖 좌표 ${p.coordinates}`);
    if (!p.coordinateMethod) fail(`${p.id}: 좌표 산출 방법 누락`);
  }
  if (p.hours && p.hoursStatus === 'needs_verification') fail(`${p.id}: 미확인 영업시간을 확정처럼 보유`);
  if (p.officialUrl && !/^https?:\/\//.test(p.officialUrl)) fail(`${p.id}: URL 형식`);
  for (const u of [p.officialUrl, p.googleMapsUrl]) if (u && /utm_source=chatgpt/.test(u)) fail(`${p.id}: chatgpt utm 링크`);
}

for (const d of DAYS) {
  for (const it of d.items) {
    if (ids.has(it.id)) fail(`아이템 id 중복: ${it.id}`);
    ids.add(it.id);
    if (it.placeId && !placeIds.has(it.placeId)) fail(`${it.id}: 없는 장소 ${it.placeId}`);
    if (!it.time || !it.time.nature) fail(`${it.id}: time.nature 누락`);
    if (it.time && it.time.at && !/\+09:00$/.test(it.time.at)) fail(`${it.id}: 시각은 +09:00`);
    if (it.time && it.time.at && it.time.at.slice(0, 10) !== d.date) fail(`${it.id}: 시작 날짜가 일정 날짜와 다름`);
    if (it.bookingId && !BOOKINGS.some((b) => b.id === it.bookingId)) fail(`${it.id}: 없는 예약 ${it.bookingId}`);
    if (it.reservation && it.reservation.status === 'confirmed' && !it.bookingId) fail(`${it.id}: 예약 기록 없이 confirmed`);
    if (it.choice && !CHOICES[it.choice.group]) fail(`${it.id}: 없는 선택 그룹`);
  }
  for (const w of d.warnings) for (const s of w.sourceIds || []) if (!sourceIds.has(s)) fail(`경고 ${w.id}: 없는 출처 ${s}`);
}
for (const b of BOOKINGS) if (!placeIds.has(b.placeId)) fail(`예약 ${b.id}: 없는 장소`);
for (const p of PREP) for (const s of p.sourceIds || []) if (!sourceIds.has(s)) fail(`준비 ${p.id}: 없는 출처 ${s}`);
for (const w of WISHLIST) for (const id of w.placeIds) if (!placeIds.has(id)) fail(`품목 ${w.id}: 없는 장소 ${id}`);
if (!placeIds.has(TRIP.hotelId) || !placeIds.has(TRIP.airportId)) fail('숙소/공항 장소 누락');

if (errors.length) {
  console.error(`데이터 검증 실패 ${errors.length}건:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
const noCoords = PLACES.filter((p) => !p.coordinates).map((p) => p.id);
console.log(`데이터 검증 통과 — 장소 ${PLACES.length}곳, 일정 아이템 ${ids.size}개${noCoords.length ? `, 좌표 미확인: ${noCoords.join(', ')}` : ''}`);
