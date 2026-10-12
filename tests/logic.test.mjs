// 상태·동선 계산 테스트
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DAYS } from '../data/trip.js';
import { PLACES } from '../data/places.js';
import {
  defaultState, sanitizeState, parseStoredState, parseImport, exportPayload, computeRoute, itemStatus,
  mondayKapitalForRoute, mapsDirectionsUrl, mapsSearchUrl, currentPlanItem, tokyoDateOf, shoppingEntries, mealTable, placeMap,
} from '../assets/logic.js';

const PM = placeMap(PLACES);
const day = (date) => DAYS.find((d) => d.date === date);
const S = (patch = {}) => ({ ...defaultState(), ...patch });
const stopIds = (r) => r.stops.map((s) => s.item.id);

test('손상된 저장 데이터는 기본값으로 복구', () => {
  assert.deepEqual(parseStoredState('{not json').state, defaultState());
  assert.equal(parseStoredState('{not json').recovered, true);
  assert.equal(parseStoredState(JSON.stringify({ version: 99 })).recovered, true);
  const s = sanitizeState({ version: 1, mondayPlan: 'C', sundayDinner: 'akiyoshi', visited: { lolo: true, '<img>': true, sml: 'yes' }, notes: { general: 123, luggage: 'B1' } });
  assert.equal(s.mondayPlan, 'undecided');
  assert.equal(s.sundayDinner, 'akiyoshi');
  assert.deepEqual(s.visited, { lolo: true });
  assert.deepEqual(s.notes, { luggage: 'B1' });
  assert.deepEqual(parseStoredState(null).state, defaultState());
});

test('가져오기 형식 검증', () => {
  assert.equal(parseImport('[]').ok, false);
  assert.equal(parseImport('nope').ok, false);
  assert.equal(parseImport(JSON.stringify({ app: 'other', state: {} })).ok, false);
  const good = parseImport(JSON.stringify(exportPayload(S({ artNight: 'go' }))));
  assert.equal(good.ok, true);
  assert.equal(good.state.artNight, 'go');
});

test('Day1: 공항은 별도, 도심 동선은 호텔 → Tekka → 호텔', () => {
  const r = computeRoute(day('2026-10-29'), S(), PLACES);
  assert.deepEqual(r.stops.map((s) => s.place.id), ['rose-stay-shiba-park', 'tekka', 'rose-stay-shiba-park']);
  assert.equal(r.airportLegs.length, 1);
  assert.equal(r.airportLegs[0].other.place.id, 'rose-stay-shiba-park');
  assert.equal(r.markers.filter((m) => m.place.id === 'rose-stay-shiba-park').length, 1, '호텔 마커 하나');
});

test('Day2: 옵션은 기본 동선에 없고, 넣으면 점선으로 들어간다', () => {
  const d = day('2026-10-30');
  const base = computeRoute(d, S(), PLACES);
  assert.ok(!stopIds(base).includes('d2-opt-kapital-ginza'));
  assert.ok(base.segments.every((s) => !s.dashed));
  assert.equal(base.floating.length, 0, '옵션 표시 꺼짐');
  const shown = computeRoute(d, S({ showOptions: { '2026-10-30': true } }), PLACES);
  assert.ok(shown.floating.length >= 6);
  const sel = computeRoute(d, S({ selectedOptions: { 'd2-opt-kapital-ginza': true } }), PLACES);
  const ids = stopIds(sel);
  assert.ok(ids.indexOf('d2-lambre') < ids.indexOf('d2-opt-kapital-ginza'));
  assert.ok(ids.indexOf('d2-opt-kapital-ginza') < ids.indexOf('d2-steven-alan'));
  assert.ok(sel.segments.some((s) => s.dashed));
  assert.deepEqual(ids.slice(-3), ['d2-kawakamian', 'd2-bluenote', 'd2-return']);
});

test('Day3: 아트 나이트 선택 / 캐피탈 월요일 이월', () => {
  const d = day('2026-10-31');
  assert.ok(!stopIds(computeRoute(d, S(), PLACES)).includes('d3-artnight'));
  assert.ok(computeRoute(d, S(), PLACES).floating.some((f) => f.item.id === 'd3-artnight'));
  const go = stopIds(computeRoute(d, S({ artNight: 'go' }), PLACES));
  assert.ok(go.indexOf('d3-kikukawa') < go.indexOf('d3-artnight'));
  assert.ok(!computeRoute(d, S({ artNight: 'skip' }), PLACES).floating.some((f) => f.item.id === 'd3-artnight'));
  const moved = S({ kapitalToMonday: { 'kapital-legs': true } });
  assert.ok(!stopIds(computeRoute(d, moved, PLACES)).includes('d3-kapital-legs'));
  assert.ok(stopIds(computeRoute(d, moved, PLACES)).includes('d3-kapital-naked'));
});

test('월요일 B안: 넘긴 매장 중 미방문만, 토요일 방문 매장은 중복하지 않음', () => {
  const s = S({ kapitalToMonday: { 'kapital-legs': true, 'kapital-naked': true }, visited: { 'kapital-naked': true } });
  assert.deepEqual(mondayKapitalForRoute(s), ['kapital-legs']);
  const r = computeRoute(day('2026-11-02'), { ...s, mondayPlan: 'B' }, PLACES);
  const places = r.stops.map((x) => x.place.id);
  assert.ok(places.includes('kapital-legs'));
  assert.ok(!places.includes('kapital-naked'));
  assert.ok(!places.includes('kapital-duffle'));
  assert.ok(!places.includes('tsujihan-nihonbashi'), 'B안에 츠지한 없음');
  assert.equal(places[0], 'rose-stay-shiba-park');
  assert.equal(places.filter((p) => p === 'rose-stay-shiba-park').length, 1, '호텔 재방문 없음');
  assert.equal(places.at(-1), 'tokyo-station');
  assert.equal(r.airportLegs[0].other.place.id, 'tokyo-station');
  // 빈 보충 목록도 정상
  const empty = computeRoute(day('2026-11-02'), S({ mondayPlan: 'B' }), PLACES);
  assert.ok(empty.stops.length >= 3);
});

test('월요일 미정이면 A/B를 이어 그리지 않는다', () => {
  const r = computeRoute(day('2026-11-02'), S(), PLACES);
  const places = r.stops.map((x) => x.place.id);
  assert.ok(!places.includes('tsujihan-nihonbashi'));
  assert.ok(!places.includes('itoya-ginza'));
  assert.ok(r.floating.some((f) => f.place.id === 'tsujihan-nihonbashi'));
  const a = computeRoute(day('2026-11-02'), S({ mondayPlan: 'A' }), PLACES).stops.map((x) => x.place.id);
  assert.deepEqual(a.slice(0, 4), ['rose-stay-shiba-park', 'tokyo-station', 'tsujihan-nihonbashi', 'itoya-ginza']);
});

test('일요일 저녁: 미정이면 두 곳을 잇지 않고, 고르면 그곳으로 끝난다', () => {
  const d = day('2026-11-01');
  const u = computeRoute(d, S(), PLACES);
  assert.ok(!stopIds(u).includes('d4-akiyoshi') && !stopIds(u).includes('d4-marusho'));
  assert.equal(u.floating.filter((f) => f.item.meal === 'dinner').length, 2);
  const a = stopIds(computeRoute(d, S({ sundayDinner: 'akiyoshi', jimbochoOrder: 'books-first' }), PLACES));
  assert.ok(a.includes('d4-akiyoshi') && !a.includes('d4-marusho'));
  assert.deepEqual(a.slice(-2), ['d4-akiyoshi', 'd4-return']);
});

test('진보초 순서가 지도 순서에 반영', () => {
  const d = day('2026-11-01');
  const cafe = stopIds(computeRoute(d, S({ jimbochoOrder: 'cafe-first' }), PLACES));
  assert.ok(cafe.indexOf('d4-milonga') < cafe.indexOf('d4-festival'));
  const books = stopIds(computeRoute(d, S({ jimbochoOrder: 'books-first' }), PLACES));
  assert.ok(books.indexOf('d4-festival') < books.indexOf('d4-milonga'));
  const und = computeRoute(d, S(), PLACES);
  assert.ok(!stopIds(und).includes('d4-milonga'));
  assert.ok(!stopIds(und).includes('d4-return'), '미정이면 숙소 복귀 선도 잇지 않음');
  assert.ok(!stopIds(computeRoute(d, S({ sundayDinner: 'akiyoshi' }), PLACES)).includes('d4-akiyoshi'), '진보초 순서 미정이면 저녁도 잇지 않음');
});

test('Google Maps 2지점 링크 인코딩', () => {
  const url = new URL(mapsDirectionsUrl(PM['aoki-ginza8'], PM.lambre, 'walking'));
  assert.equal(url.origin + url.pathname, 'https://www.google.com/maps/dir/');
  assert.equal(url.searchParams.get('api'), '1');
  assert.equal(url.searchParams.get('travelmode'), 'walking');
  assert.ok(url.searchParams.get('origin').includes('とんかつ檍'));
  assert.ok(!url.searchParams.has('waypoints'));
  const s = new URL(mapsSearchUrl({ nameJa: 'A&B 喫茶', address: '東京都 1-2' }));
  assert.equal(s.searchParams.get('query'), 'A&B 喫茶 東京都 1-2');
});

test('현재 시간대 계획: 자정 넘는 아트 나이트는 토요일 일정', () => {
  const s = S({ artNight: 'go' });
  const r = currentPlanItem(DAYS, s, new Date('2026-10-31T23:30:00+09:00'));
  assert.equal(r.item.id, 'd3-artnight');
  assert.equal(r.day.date, '2026-10-31');
  assert.equal(tokyoDateOf('2026-11-01T00:00:00+09:00'), '2026-11-01');
  assert.equal(currentPlanItem(DAYS, s, new Date('2026-10-01T12:00:00+09:00')), null);
  const notGo = currentPlanItem(DAYS, S(), new Date('2026-10-31T23:30:00+09:00'));
  assert.ok(!notGo.item || notGo.item.id !== 'd3-artnight', '선택하지 않은 일정을 현재로 표시하지 않음');
});

test('쇼핑·식사 목록이 같은 상태를 따른다', () => {
  const entries = shoppingEntries(DAYS, S());
  assert.ok(entries.some((e) => e.item.placeId === 'kapital-ginza' && e.day.date === '2026-10-30'));
  const meals = mealTable(DAYS, S({ sundayDinner: 'marusho' }));
  const sun = meals.find((m) => m.date === '2026-11-01');
  assert.deepEqual(sun.dinner.map((x) => x.item.placeId), ['marusho-hongo3']);
  const und = mealTable(DAYS, S()).find((m) => m.date === '2026-11-01');
  assert.equal(und.dinner.length, 2);
  assert.ok(und.dinner.every((x) => x.status === 'floating'));
  assert.equal(itemStatus(DAYS[4].items.find((i) => i.id === 'd5a-tsujihan'), DAYS[4], S({ mondayPlan: 'B' })), 'hidden');
});
