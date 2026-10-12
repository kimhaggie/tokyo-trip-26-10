// DOM 없이 동작하는 일정 계산 함수 — 브라우저와 Node 테스트가 함께 쓴다.

export const STORAGE_KEY = 'tokyo-trip-26-10:state:v1';
export const STATE_VERSION = 1;

const ALLOWED = {
  sundayDinner: ['undecided', 'akiyoshi', 'marusho'],
  jimbochoOrder: ['undecided', 'cafe-first', 'books-first'],
  mondayPlan: ['undecided', 'A', 'B'],
  artNight: ['undecided', 'go', 'skip'],
  viewMode: ['timeline', 'detail'],
};

export function defaultState() {
  return {
    version: STATE_VERSION,
    sundayDinner: 'undecided',
    jimbochoOrder: 'undecided',
    mondayPlan: 'undecided',
    artNight: 'undecided',
    viewMode: 'timeline',
    showOptions: {}, // date -> bool (지도·일정표에 옵션 표시)
    selectedOptions: {}, // visitId -> bool (옵션을 동선에 넣음)
    visited: {}, // placeId -> bool (방문 완료)
    purchased: {}, // wishId -> bool (구매 완료 — 방문 완료와 별개)
    kapitalToMonday: {}, // placeId -> bool
    notes: {}, // key -> string (일반 텍스트)
  };
}

const MAX_NOTE = 2000;
const ID_RE = /^[a-z0-9][a-z0-9-]{0,80}$/i;

function boolMap(input) {
  const out = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return out;
  for (const [k, v] of Object.entries(input)) {
    if (ID_RE.test(k) && v === true) out[k] = true;
  }
  return out;
}

// 저장된 값·가져온 JSON을 검증해 안전한 상태로 만든다. 모르는 값은 기본값으로 되돌린다.
export function sanitizeState(raw) {
  const base = defaultState();
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return base;
  for (const [key, allowed] of Object.entries(ALLOWED)) {
    if (allowed.includes(raw[key])) base[key] = raw[key];
  }
  base.showOptions = boolMap(raw.showOptions);
  base.selectedOptions = boolMap(raw.selectedOptions);
  base.visited = boolMap(raw.visited);
  base.purchased = boolMap(raw.purchased);
  base.kapitalToMonday = boolMap(raw.kapitalToMonday);
  if (raw.notes && typeof raw.notes === 'object' && !Array.isArray(raw.notes)) {
    for (const [k, v] of Object.entries(raw.notes)) {
      if (ID_RE.test(k) && typeof v === 'string' && v.trim()) base.notes[k] = v.slice(0, MAX_NOTE);
    }
  }
  return base;
}

export function parseStoredState(text) {
  if (typeof text !== 'string' || !text) return { state: defaultState(), recovered: false };
  try {
    const raw = JSON.parse(text);
    if (!raw || raw.version !== STATE_VERSION) return { state: defaultState(), recovered: true };
    return { state: sanitizeState(raw), recovered: false };
  } catch {
    return { state: defaultState(), recovered: true };
  }
}

// 가져오기: 형식이 틀리면 오류를 돌려주고 기존 상태를 건드리지 않는다.
export function parseImport(text) {
  let raw;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: 'JSON 형식이 아닙니다.' };
  }
  if (!raw || typeof raw !== 'object' || raw.app !== 'tokyo-trip-26-10' || !raw.state) {
    return { ok: false, error: '이 사이트에서 내보낸 파일이 아닙니다.' };
  }
  if (raw.state.version !== STATE_VERSION) return { ok: false, error: '지원하지 않는 버전입니다.' };
  return { ok: true, state: sanitizeState(raw.state) };
}

export function exportPayload(state, now = new Date()) {
  return { app: 'tokyo-trip-26-10', exportedAt: now.toISOString(), state };
}

// ---- 날짜 ----
const WEEKDAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];

export function weekdayKo(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return WEEKDAYS_KO[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

export function formatDateKo(isoDate) {
  const [, m, d] = isoDate.split('-').map(Number);
  return `${m}/${d} ${weekdayKo(isoDate)}`;
}

// ISO(+09:00) → 도쿄 현지 날짜 'YYYY-MM-DD'
export function tokyoDateOf(isoOrDate) {
  const t = typeof isoOrDate === 'string' ? Date.parse(isoOrDate) : isoOrDate.getTime();
  const shifted = new Date(t + 9 * 3600 * 1000);
  return shifted.toISOString().slice(0, 10);
}

export function tokyoTimeOf(isoOrDate) {
  const t = typeof isoOrDate === 'string' ? Date.parse(isoOrDate) : isoOrDate.getTime();
  return new Date(t + 9 * 3600 * 1000).toISOString().slice(11, 16);
}

// ---- 일정 상태 계산 ----
export function placeMap(places) {
  return Object.fromEntries(places.map((p) => [p.id, p]));
}

export function hasCoords(place) {
  return !!(place && Array.isArray(place.coordinates) && place.coordinates.length === 2 &&
    Number.isFinite(place.coordinates[0]) && Number.isFinite(place.coordinates[1]) &&
    !(place.coordinates[0] === 0 && place.coordinates[1] === 0));
}

export function kapitalEbisuVisits(days) {
  const sat = days.find((d) => d.date === '2026-10-31');
  return sat ? sat.items.filter((i) => i.kapitalEbisu) : [];
}

// 월요일 B안 보충 대상: 토요일에 “월요일로 넘기기”했고 아직 방문 완료가 아닌 에비스 캐피탈.
export function mondayKapitalPlaceIds(days, state) {
  return kapitalEbisuVisits(days)
    .map((i) => i.placeId)
    .filter((id) => state.kapitalToMonday[id] && !state.visited[id]);
}

// 토요일에 아직 체크되지 않은(방문 완료도, 이월도 아닌) 에비스 캐피탈 — 안내용.
export function kapitalUnresolved(days, state) {
  return kapitalEbisuVisits(days)
    .map((i) => i.placeId)
    .filter((id) => !state.visited[id] && !state.kapitalToMonday[id]);
}

// 아이템이 현재 선택 상태에서 어떤 상태인지:
//  'active'   — 동선에 포함
//  'floating' — 위치만 보여 주고 선으로 잇지 않음 (미정 선택지, 미선택 옵션)
//  'hidden'   — 표시하지 않음 (생략·다른 안 선택·이월)
export function itemStatus(item, day, state) {
  if (item.variant) {
    if (state.mondayPlan === 'undecided') return 'floating';
    if (state.mondayPlan !== item.variant) return 'hidden';
  }
  if (item.kapitalEbisu && state.kapitalToMonday[item.placeId]) return 'hidden';
  if (item.choice) {
    const v = state[item.choice.group];
    if (item.choice.group === 'artNight') {
      if (v === 'skip') return 'hidden';
      if (v === 'undecided') return 'floating';
      return 'active';
    }
    if (v === 'undecided') return 'floating';
    return v === item.choice.value ? 'active' : 'hidden';
  }
  if (item.flexMember && state.jimbochoOrder === 'undecided') return 'floating';
  if (item.priority === 'optional') {
    if (state.selectedOptions[item.id]) return 'active';
    return state.showOptions[day.date] ? 'floating' : 'hidden';
  }
  return 'active';
}

// 화면·지도에 쓸 순서대로 정렬한 아이템 목록 (진보초 순서 반영).
export function orderedItems(day, state) {
  const items = day.items.slice();
  if (day.date === '2026-11-01' && state.jimbochoOrder !== 'undecided') {
    const fest = items.findIndex((i) => i.id === 'd4-festival');
    const cafe = items.findIndex((i) => i.id === 'd4-milonga');
    if (fest > -1 && cafe > -1) {
      const [a, b] = state.jimbochoOrder === 'cafe-first' ? [items[cafe], items[fest]] : [items[fest], items[cafe]];
      const start = Math.min(fest, cafe);
      items.splice(start, 2, a, b);
    }
  }
  return items;
}

// 지도 동선. 공항은 도심 지도와 분리해 airportLegs 로 돌려준다.
export function computeRoute(day, state, places) {
  const pm = placeMap(places);
  const stops = []; // 선으로 잇는 순서
  const floating = []; // 위치만
  const missing = []; // 좌표 미확인
  const airportLegs = [];
  let lastCityStop = null;

  const items = orderedItems(day, state);
  const expanded = [];
  for (const item of items) {
    if (item.kapitalMakeup) {
      const st = itemStatus(item, day, state);
      for (const pid of mondayKapitalForRoute(state)) {
        expanded.push({ item: { ...item, id: `${item.id}-${pid}`, placeId: pid }, status: st });
      }
      continue;
    }
    let status = itemStatus(item, day, state);
    // 앞선 선택이 미정이면 그 뒤 구간은 잇지 않는다 (예: 일요일 저녁·숙소 복귀)
    if (status === 'active' && item.routeNeeds && item.routeNeeds.some((g) => state[g] === 'undecided')) status = 'floating';
    expanded.push({ item, status });
  }

  for (const { item, status } of expanded) {
    if (status === 'hidden' || !item.placeId) continue;
    const place = pm[item.placeId];
    if (!hasCoords(place)) {
      missing.push({ item, place });
      continue;
    }
    if (place.category === 'airport') {
      airportLegs.push({ item, place, other: lastCityStop });
      continue;
    }
    if (status === 'floating') {
      floating.push({ item, place });
      continue;
    }
    const dashed = item.priority !== 'core';
    stops.push({ item, place, dashed });
    lastCityStop = { item, place };
  }

  // 공항 구간의 상대 지점: 도착은 다음 도심 지점, 출국은 직전 도심 지점
  for (const leg of airportLegs) {
    if (!leg.other) leg.other = stops[0] || null;
  }

  // 같은 장소(호텔·도쿄역)는 마커 하나에 번호를 모은다
  const markers = [];
  const byPlace = new Map();
  let n = 0;
  // 같은 건물(좌표 동일)도 한 마커로 합친다 — 예: 루미네·한큐 맨즈 유라쿠초
  const keyOf = (place) => place.coordinates.join(',');
  for (const s of stops) {
    const isHotel = s.place.category === 'hotel';
    const label = isHotel ? 'H' : String(++n);
    s.label = label;
    if (byPlace.has(keyOf(s.place))) {
      const m = byPlace.get(keyOf(s.place));
      if (!isHotel) m.labels.push(label);
      m.items.push(s.item);
    } else {
      const m = { place: s.place, labels: isHotel ? ['H'] : [label], items: [s.item], kind: isHotel ? 'hotel' : (s.dashed ? 'option' : 'core') };
      byPlace.set(keyOf(s.place), m);
      markers.push(m);
    }
  }
  for (const f of floating) {
    const k = keyOf(f.place);
    if (byPlace.has(k)) { byPlace.get(k).items.push(f.item); continue; }
    const m = { place: f.place, labels: ['?'], items: [f.item], kind: 'floating' };
    byPlace.set(k, m);
    markers.push(m);
  }

  const segments = [];
  for (let i = 1; i < stops.length; i++) {
    const a = stops[i - 1];
    const b = stops[i];
    if (a.place.id === b.place.id) continue;
    segments.push({ from: a.place.coordinates, to: b.place.coordinates, dashed: a.dashed || b.dashed });
  }
  return { stops, floating, missing, markers, segments, airportLegs };
}

// B안 보충 매장 (가상의 days 없이 placeId 목록만 필요)
const KAPITAL_EBISU_IDS = ['kapital-naked', 'kapital-legs', 'kapital-duffle'];
export function mondayKapitalForRoute(state) {
  return KAPITAL_EBISU_IDS.filter((id) => state.kapitalToMonday[id] && !state.visited[id]);
}
export { KAPITAL_EBISU_IDS };

// 구간별 길찾기용 연속 쌍 (같은 장소 연속은 건너뜀)
export function routeLegs(route) {
  const legs = [];
  for (let i = 1; i < route.stops.length; i++) {
    const a = route.stops[i - 1];
    const b = route.stops[i];
    if (a.place.id === b.place.id) continue;
    legs.push({ from: a, to: b });
  }
  return legs;
}

// ---- Google Maps URL (공식 Maps URLs 형식, 2지점 구간) ----
export function placeQuery(place) {
  const addr = place.address ? place.address.replace(/\s+/g, ' ').trim() : '';
  return [place.mapsQuery || place.nameJa || place.nameKo, place.mapsQuery ? '' : addr].filter(Boolean).join(' ');
}

export function mapsSearchUrl(place) {
  if (place.googleMapsUrl) return place.googleMapsUrl; // 사용자가 준 지도 링크
  const u = new URL('https://www.google.com/maps/search/');
  u.searchParams.set('api', '1');
  u.searchParams.set('query', placeQuery(place));
  return u.toString();
}

export function mapsDirectionsUrl(fromPlace, toPlace, travelmode = 'transit') {
  const u = new URL('https://www.google.com/maps/dir/');
  u.searchParams.set('api', '1');
  u.searchParams.set('origin', placeQuery(fromPlace));
  u.searchParams.set('destination', placeQuery(toPlace));
  u.searchParams.set('travelmode', travelmode);
  return u.toString();
}

// ---- “현재 시간대의 계획” ----
// 확정 표시가 아니라 계획상 지금 시간대에 해당하는 아이템을 찾는다.
export function currentPlanItem(days, state, now = new Date()) {
  const today = tokyoDateOf(now);
  const t = now.getTime();
  let candidate = null;
  for (const day of days) {
    for (const item of orderedItems(day, state)) {
      const st = itemStatus(item, day, state);
      if (st !== 'active' || !item.time || !item.time.at) continue;
      const start = Date.parse(item.time.at);
      const end = item.time.endAt ? Date.parse(item.time.endAt) : start + 60 * 60 * 1000;
      if (t >= start && t < end) candidate = { day, item };
    }
  }
  if (candidate) return candidate;
  const day = days.find((d) => d.date === today);
  return day ? { day, item: null } : null;
}

// ---- 쇼핑 ----
export function shoppingEntries(days, state) {
  const out = [];
  const seen = new Set();
  for (const day of days) {
    for (const item of day.items) {
      if (item.kind !== 'shop' && !item.shopping) continue;
      if (!item.placeId) continue;
      const key = `${day.date}:${item.placeId}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ day, item, status: itemStatus(item, day, state) });
    }
  }
  return out;
}

export function saturdayShoppingCount(days) {
  const sat = days.find((d) => d.date === '2026-10-31');
  return sat ? sat.items.filter((i) => i.shopping && i.shopping.saturdayCount).length : 0;
}

// ---- 식사 표 ----
export function mealTable(days, state) {
  return days.map((day) => {
    const row = { date: day.date, lunch: [], dinner: [], cafe: [] };
    for (const item of orderedItems(day, state)) {
      if (!item.meal) continue;
      const st = itemStatus(item, day, state);
      if (st === 'hidden') continue;
      row[item.meal].push({ item, status: st });
    }
    return row;
  });
}

// 진보초 경고: 카페 먼저인데 축제 종료(17시) 이후까지 카페에 머물 위험
export function jimbochoWarnings(state, now = null) {
  const out = [];
  if (state.jimbochoOrder === 'cafe-first') {
    out.push('카페 먼저를 골랐다면 17시 축제 종료 전에 나와 책을 볼 시간을 남긴다.');
  }
  if (now) {
    const t = now.getTime();
    const s = Date.parse('2026-11-01T15:00:00+09:00');
    const e = Date.parse('2026-11-01T17:00:00+09:00');
    if (t >= s && t < e) out.push(`지금 ${tokyoTimeOf(now)} — 축제 종료 17:00까지 ${Math.round((e - t) / 60000)}분.`);
  }
  return out;
}
