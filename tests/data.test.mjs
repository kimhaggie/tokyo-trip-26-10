// §18 데이터 검증 — 여행 결정이 데이터에 정확히 들어 있는지
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TRIP, BOOKINGS, DAYS, EXCLUDED } from '../data/trip.js';
import { PLACES } from '../data/places.js';
import { weekdayKo, saturdayShoppingCount, placeMap } from '../assets/logic.js';

const PM = placeMap(PLACES);
const day = (date) => DAYS.find((d) => d.date === date);
const item = (id) => DAYS.flatMap((d) => d.items).find((i) => i.id === id);

test('5일 · 10/29 목 ~ 11/2 월', () => {
  assert.deepEqual(DAYS.map((d) => d.date), ['2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02']);
  assert.deepEqual(DAYS.map((d) => weekdayKo(d.date)), ['목', '금', '토', '일', '월']);
  assert.equal(TRIP.startDate, '2026-10-29');
  assert.equal(TRIP.endDate, '2026-11-02');
});

test('항공: 나리타 17:40 도착 / 18:55 출국', () => {
  assert.equal(TRIP.arrival.time, '17:40');
  assert.equal(TRIP.departure.time, '18:55');
  assert.equal(TRIP.arrival.airportId, 'narita-airport');
  assert.equal(TRIP.departure.airportId, 'narita-airport');
  assert.equal(TRIP.flightDetails, null, '항공사·편명은 만들지 않는다');
  const text = JSON.stringify(DAYS);
  assert.ok(!/하네다|羽田|haneda/i.test(text.replace(/하네다 아님/g, '')), '하네다가 일정에 없다');
});

test('예약 완료는 정확히 3건', () => {
  assert.equal(BOOKINGS.length, 3);
  assert.ok(BOOKINGS.every((b) => b.status === 'confirmed'));
  const confirmedItems = DAYS.flatMap((d) => d.items).filter((i) => i.reservation && i.reservation.status === 'confirmed');
  assert.deepEqual(confirmedItems.map((i) => i.bookingId).sort(), ['bk-bluenote', 'bk-kawakamian', 'bk-kikukawa']);
});

test('가와카미안 10/30 18:30 1명', () => {
  const b = BOOKINGS.find((x) => x.id === 'bk-kawakamian');
  assert.equal(b.date, '2026-10-30'); assert.equal(b.time, '18:30'); assert.equal(b.party, 1);
  assert.equal(b.placeId, 'kawakamian-aoyama');
  assert.match(PM['kawakamian-aoyama'].address, /南青山\s?3-14-1/);
});

test('Blue Note 10/30 19:45 입장 / 20:30 공연', () => {
  const b = BOOKINGS.find((x) => x.id === 'bk-bluenote');
  assert.equal(b.date, '2026-10-30'); assert.equal(b.time, '19:45'); assert.equal(b.showTime, '20:30');
  assert.equal(b.seat, null, '좌석은 미제공');
});

test('기쿠카와 10/31 20:00 1명 카운터', () => {
  const b = BOOKINGS.find((x) => x.id === 'bk-kikukawa');
  assert.equal(b.date, '2026-10-31'); assert.equal(b.time, '20:00'); assert.equal(b.party, 1); assert.equal(b.seat, '카운터석');
});

test('아키요시: 1인 예약 불가 · 현장 방문 · 예약 완료 아님', () => {
  const a = item('d4-akiyoshi');
  assert.equal(a.reservation.status, 'walk_in');
  assert.ok(a.reservation.constraints.includes('soloReservationUnavailable'));
  assert.equal(a.bookingId, undefined);
  assert.equal(a.time.nature, 'target');
});

test('첫날 도쿄 점심 없음 · 쇼핑 없음', () => {
  const d1 = day('2026-10-29');
  assert.equal(d1.items.filter((i) => i.meal === 'lunch').length, 0);
  assert.equal(d1.items.filter((i) => i.kind === 'shop').length, 0);
  assert.equal(d1.items.filter((i) => i.meal === 'dinner').map((i) => i.placeId).join(), 'tekka');
});

test('금·토 모두 점심 → 커피 순서', () => {
  for (const [date, lunch, cafe] of [['2026-10-30', 'd2-aoki', 'd2-lambre'], ['2026-10-31', 'd3-fuunji', 'd3-tajimaya']]) {
    const ids = day(date).items.map((i) => i.id);
    assert.ok(ids.indexOf(lunch) < ids.indexOf(cafe), `${date} 점심이 커피보다 먼저`);
    assert.equal(ids.indexOf(cafe), ids.indexOf(lunch) + 1);
  }
});

test('금요일 RRL은 한큐 · STEVEN ALAN · BEAMS PLUS · BEAMS MEN 포함', () => {
  const fri = day('2026-10-30').items;
  const core = fri.filter((i) => i.priority === 'core').map((i) => i.placeId);
  for (const id of ['rrl-hankyu-mens', 'steven-alan-yurakucho', 'beams-plus-marunouchi', 'beams-men-shibuya']) assert.ok(core.includes(id), id);
  assert.ok(!JSON.stringify(fri).includes('omotesando-flagship'));
});

test('토요일 쇼핑 13곳 = 신주쿠 4 + 오후 9 (캐피탈 3 포함)', () => {
  assert.equal(saturdayShoppingCount(DAYS), 13);
  const sat = day('2026-10-31').items.filter((i) => i.shopping && i.shopping.saturdayCount);
  assert.deepEqual(sat.slice(0, 4).map((i) => i.placeId), ['yamamoto-coffee-shinjuku', 'biccamera-shinjuku-east', 'beams-japan-shinjuku', 'fenest']);
  assert.equal(sat.filter((i) => i.kapitalEbisu).length, 3);
});

test('에비스 KAPITAL 3곳과 긴자 KAPITAL은 각각 별개 장소', () => {
  const ids = ['kapital-naked', 'kapital-legs', 'kapital-duffle', 'kapital-ginza'];
  const addrs = ids.map((id) => PM[id] && PM[id].address);
  assert.equal(new Set(ids).size, 4);
  assert.ok(addrs.every(Boolean));
  assert.equal(new Set(addrs).size, 4, '주소가 서로 달라야 한다');
});

test('일요일: 축제 17시 종료 경고 · 아키요시/마루쇼 양자택일 · 미술관 현장 구매', () => {
  const sun = day('2026-11-01');
  assert.ok(sun.warnings.some((w) => /17시/.test(w.text)));
  const f = item('d4-festival');
  assert.equal(f.time.endAt, '2026-11-01T17:00:00+09:00');
  const dinners = sun.items.filter((i) => i.meal === 'dinner');
  assert.deepEqual(dinners.map((i) => i.choice.value).sort(), ['akiyoshi', 'marusho']);
  assert.equal(item('d4-museum').reservation.status, 'not_reserved');
  assert.match(item('d4-museum').reservation.note, /현장 구매/);
  assert.ok(!sun.items.some((i) => i.kapitalEbisu || /KAPITAL/i.test(i.title)), '일요일에 캐피탈 없음');
});

test('월요일: 고정은 짐 보관·회수·N\'EX, 나머지는 모두 꺼진 옵션 · 호텔 재방문 없음', () => {
  const mon = day('2026-11-02').items;
  const hotelVisits = mon.filter((i) => i.placeId === 'rose-stay-shiba-park');
  assert.equal(hotelVisits.length, 1, '체크아웃만');
  assert.equal(hotelVisits[0].id, 'd5-checkout');
  assert.ok(mon.some((i) => i.luggage === 'drop' && i.placeId === 'tokyo-station'));
  assert.ok(mon.some((i) => i.luggage === 'pick' && i.placeId === 'tokyo-station'));
  assert.ok(!mon.some((i) => i.variant), 'A/B안 없음');
  const opts = mon.filter((i) => i.priority === 'optional').map((i) => i.placeId);
  assert.deepEqual(opts, ['tsujihan-nihonbashi', 'kapital-naked', 'kapital-legs', 'kapital-duffle', 'uniqlo-ginza', 'kapital-ginza', 'itoya-ginza'], '옵션 순서: 츠지한 → 에비스 → 긴자');
  const core = mon.filter((i) => i.priority === 'core').map((i) => i.id);
  assert.deepEqual(core, ['d5-checkout', 'd5-luggage-drop', 'd5-luggage-pick', 'd5-nex', 'd5-depart']);
  assert.ok(!mon.some((i) => i.kind === 'cafe'), '월요일 킷사텐 없음');
  assert.equal(item('d5-nex').reservation.status, 'not_reserved');
});

test('아트 나이트: 토요일 밤 선택 일정, 자정 종료는 11/1 00:00', () => {
  const a = item('d3-artnight');
  assert.ok(day('2026-10-31').items.includes(a));
  assert.equal(a.priority, 'optional');
  assert.equal(a.time.endAt, '2026-11-01T00:00:00+09:00');
  assert.ok(a.time.crossesMidnight);
  assert.ok(!day('2026-11-01').items.some((i) => i.placeId === 'roppongi-art-night'));
});

test('제외한 장소가 일정에 없다', () => {
  const text = JSON.stringify(DAYS.map((d) => d.items.map((i) => [i.title, i.placeId])));
  for (const bad of ['ZABOU', 'PORTER', '빈티지 시계', '돈코츠', '스시', '나폴리탄', '도쿄타워', '코스프레', 'DESIGNART', '카파바시', '후지야', '코빈초', '멘야무사시', '텐쿠니']) {
    assert.ok(!text.includes(bad), `제외 항목이 일정에 있음: ${bad}`);
  }
  assert.ok(EXCLUDED.length >= 9);
});

test('혼동 금지: Satella 카페 · HAKUSAN 쇼룸 · 다지마야≠야마모토', () => {
  assert.equal(PM.satella.category, 'cafe');
  assert.match(PM['hakusan-shop'].nameJa, /白山陶器/);
  assert.notEqual(PM['tajimaya-honten'].address, PM['yamamoto-coffee-shinjuku'].address);
  assert.equal(PM['tajimaya-honten'].category, 'cafe');
  assert.equal(PM['yamamoto-coffee-shinjuku'].category, 'shop');
  assert.match(PM.sml.address || '', /恵比寿西/);
});

test('좌표가 있는 장소는 (0,0)이 아니고 미확인 좌표는 null', () => {
  for (const p of PLACES) {
    if (p.coordinates) assert.ok(!(p.coordinates[0] === 0 && p.coordinates[1] === 0), p.id);
    else assert.equal(p.coordinates, null, p.id);
  }
});
