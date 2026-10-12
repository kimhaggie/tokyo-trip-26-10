import { TRIP, BOOKINGS, PREP, WISHLIST, DAYS, CHOICES, OPTION_GROUPS, EXCLUDED, MEAL_NOTES, TASTE } from '../data/trip.js';
import { PLACES } from '../data/places.js';
import { SOURCES, TAX_FREE_NOTE } from '../data/sources.js';
import {
  computeRoute, itemStatus, orderedItems, placeMap, hasCoords, formatDateKo, weekdayKo,
  mapsSearchUrl, mapsDirectionsUrl, routeLegs, currentPlanItem, shoppingEntries, saturdayShoppingCount,
  mealTable, jimbochoWarnings, mondayKapitalForRoute, kapitalUnresolved, KAPITAL_EBISU_IDS,
  exportPayload, parseImport, defaultState,
} from './logic.js';
import { loadState, saveState, clearState, storageStatus } from './state.js';
import { mapsAvailable, getMapElement, drawRoute, drawAirport, focusOnItem, invalidateAll } from './maps.js';

const PM = placeMap(PLACES);
const SM = Object.fromEntries(SOURCES.map((s) => [s.id, s]));
let state = loadState();
let currentTab = null;

// ---------- DOM 도우미 (innerHTML 미사용 — 사용자 메모도 텍스트로만 넣는다) ----------
function h(tag, attrs, ...children) {
  const n = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
      else if (k === 'dataset') Object.assign(n.dataset, v);
      else n.setAttribute(k, v === true ? '' : v);
    }
  }
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    n.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
  }
  return n;
}
function ext(href, text, cls = '') {
  return h('a', { href, target: '_blank', rel: 'noopener noreferrer', class: cls || null }, text);
}
function badge(text, cls) { return h('span', { class: `badge ${cls || ''}` }, text); }

function setState(patch) {
  state = { ...state, ...patch };
  saveState(state);
  rerender();
}
function setMapKey(key, id, value) {
  const next = { ...state[key] };
  if (value) next[id] = true; else delete next[id];
  setState({ [key]: next });
}

// ---------- 라벨 ----------
const RES_LABEL = {
  confirmed: ['예약 완료', 'b-confirmed'],
  walk_in: ['현장 방문', 'b-walkin'],
  not_reserved: ['예약 안 함', 'b-notres'],
};
const PRIORITY_LABEL = { core: ['본 일정', 'b-core'], optional: ['선택', 'b-optional'], backup: ['대안', 'b-backup'] };
const NATURE_LABEL = { fixed: ['고정', 'b-fixed'], target: ['목표 시간', 'b-target'], estimated: ['예상 시간', 'b-estimated'], flexible: ['유동', 'b-flexible'] };
const CONSTRAINT_LABEL = { soloReservationUnavailable: ['1인 예약 불가', 'b-solo'] };
const KIND_LABEL = { meal: '식사', cafe: '카페', shop: '쇼핑', event: '행사·공연', hotel: '숙소', airport: '공항', move: '이동', transit: '역·교통', flex: '유동 블록' };
const MEAL_LABEL = { lunch: '점심', dinner: '저녁', cafe: '카페' };

function statusText(status, checkedAt) {
  if (status === 'official_checked') return [`공식 확인${checkedAt ? ` (${checkedAt})` : ''}`, true];
  if (status === 'user_confirmed') return ['사용자 확인', true];
  if (status === 'third_party_checked') return [`공식 사이트 없음 · 타베로그/관광 안내 확인${checkedAt ? ` (${checkedAt})` : ''}`, true];
  return ['확인 필요', false];
}

const TABS = [
  { id: 'summary', label: '요약' },
  ...DAYS.map((d, i) => ({ id: `day-${i + 1}`, label: `${weekdayKo(d.date)}`, date: d.date })),
  { id: 'bookings', label: '예약' },
  { id: 'shopping', label: '쇼핑' },
  { id: 'meals', label: '식사·카페' },
  { id: 'prep', label: '준비·유의' },
];

// ---------- 공통 조각 ----------
function placeName(place) { return place ? (place.nameKo || place.nameJa) : ''; }

function sourceLinks(ids) {
  if (!ids || !ids.length) return null;
  return h('span', { class: 'src' }, ' 출처: ', ids.map((id, i) => {
    const s = SM[id];
    if (!s) return null;
    return [i ? ' · ' : '', s.url ? ext(s.url, s.title) : s.title];
  }));
}

function warningBox(w) {
  const cls = { important: 'notice-important', caution: 'notice-caution', info: 'notice-info' }[w.level] || '';
  return h('div', { class: `notice ${cls}` }, h('p', null, w.text, sourceLinks(w.sourceIds)));
}

function placeFacts(place) {
  if (!place) return null;
  const dl = h('dl', { class: 'facts' });
  const add = (k, ...v) => dl.append(h('dt', null, k), h('dd', null, ...v));
  if (place.nameJa) add('일본어', h('span', { lang: 'ja' }, place.nameJa));
  if (place.address) {
    const [t, ok] = statusText(place.addressStatus, place.checkedAt);
    add('주소', h('span', { lang: 'ja' }, place.address), h('div', { class: `status-line${ok ? ' ok' : ''}` }, t));
  } else add('주소', h('span', { class: 'status-line' }, '주소 확인 필요'));
  if (place.nearestStation) add('가까운 역', h('span', { lang: 'ja' }, place.nearestStation));
  if (place.hours) {
    const ok = place.hoursStatus === 'official_checked' || place.hoursStatus === 'third_party_checked';
    const src = place.hoursStatus === 'third_party_checked' ? '타베로그/관광 안내 기준' : '공식';
    add('영업시간', h('span', { lang: 'ja' }, place.hours),
      place.closedDays ? h('div', null, '휴무: ', h('span', { lang: 'ja' }, place.closedDays)) : null,
      h('div', { class: `status-line${ok ? ' ok' : ''}` }, ok ? `운영시간 ${src} 확인 (${place.checkedAt}) · 방문일 임시 변경은 미확인` : '영업시간 확인 필요'));
  } else if (place.category !== 'station' && place.category !== 'airport') {
    add('영업시간', h('span', { class: 'status-line' }, place.hoursNote || '확인 필요'));
  }
  if (place.hoursNote && place.hours) add('참고', place.hoursNote);
  if (place.phone && place.phoneStatus === 'official_checked') add('전화', h('a', { href: `tel:${place.phone.replace(/[^\d+]/g, '')}` }, place.phone));
  else if (place.phone) add('전화', place.phone, h('div', { class: 'status-line' }, '공식 사이트가 아닌 출처의 번호 — 전화 링크 없음'));
  if (place.taxFree && place.taxFree !== 'not_applicable') {
    add('면세', place.taxFree === 'yes' ? '면세 가능 (공식 안내)' : place.taxFree === 'no' ? '면세 불가 (공식 안내)' : '확인 필요');
  }
  if (!hasCoords(place)) add('지도', h('span', { class: 'status-line' }, '지도 위치 확인 필요 — 지도에 표시하지 않음'));
  else if (place.coordinatePrecision === 'area') add('지도', '행사 구역 대표 지점 (특정 매장 위치 아님)');
  else if (place.coordinatePrecision === 'facility') add('지도', '시설 대표 지점');
  else add('지도', h('span', { class: 'small' }, '공식 주소 기반 좌표 (번지 단위)'));
  for (const n of place.notes || []) add('메모', n);
  return dl;
}

function placeLinks(place, extra) {
  if (!place) return null;
  return h('div', { class: 'btn-row' },
    ext(mapsSearchUrl(place), 'Google 지도에서 보기', 'btn'),
    place.officialUrl ? ext(place.officialUrl, place.officialLabel || '공식 안내', 'btn') : null,
    place.phone && place.phoneStatus === 'official_checked' ? h('a', { class: 'btn', href: `tel:${place.phone.replace(/[^\d+]/g, '')}` }, '전화') : null,
    extra || null);
}

function itemBadges(item, day, opts = {}) {
  const b = [];
  const r = item.reservation || {};
  if (RES_LABEL[r.status]) b.push(badge(...RES_LABEL[r.status]));
  for (const c of r.constraints || []) if (CONSTRAINT_LABEL[c]) b.push(badge(...CONSTRAINT_LABEL[c]));
  if (item.important) b.push(badge('꼭 방문', 'b-important'));
  else if (PRIORITY_LABEL[item.priority] && item.kind !== 'move') b.push(badge(...PRIORITY_LABEL[item.priority]));
  if (item.time && NATURE_LABEL[item.time.nature]) b.push(badge(...NATURE_LABEL[item.time.nature]));
  if (item.time && item.time.crossesMidnight) b.push(badge('일요일 00:00까지', 'b-night'));
  if (item.placeId && state.visited[item.placeId] && (item.kind === 'shop' || item.shopping)) b.push(badge('방문 완료', 'b-visited'));
  if (item.shopping && item.shopping.mondayOk && day.date !== '2026-11-02') b.push(badge('월요일로 넘길 수 있음', 'b-monday'));
  if (opts.extra) b.push(...opts.extra);
  return h('div', { class: 'badges' }, b);
}

function visitedToggle(item) {
  if (!item.placeId) return null;
  const id = `v-${item.id}`;
  return h('label', { class: 'toggle', for: id },
    h('input', { type: 'checkbox', id, checked: !!state.visited[item.placeId], onchange: (e) => setMapKey('visited', item.placeId, e.target.checked) }),
    '방문 완료');
}

function kapitalMoveButton(item) {
  const moved = !!state.kapitalToMonday[item.placeId];
  return h('button', { type: 'button', class: 'btn', 'aria-pressed': moved ? 'true' : 'false', onclick: () => setMapKey('kapitalToMonday', item.placeId, !moved) },
    moved ? '토요일로 되돌리기' : '월요일로 넘기기');
}

function segmented(groupKey) {
  const c = CHOICES[groupKey];
  return h('div', { class: 'choice' },
    h('span', { class: 'choice-label', id: `lbl-${groupKey}` }, c.label),
    h('div', { class: 'segmented', role: 'group', 'aria-labelledby': `lbl-${groupKey}` },
      c.options.map((o) => h('button', { type: 'button', 'aria-pressed': state[groupKey] === o.value ? 'true' : 'false', onclick: () => setState({ [groupKey]: o.value }) }, o.label))));
}

// ---------- 일정 아이템 ----------
function renderItem(item, day, ctx) {
  const place = item.placeId ? PM[item.placeId] : null;
  const status = itemStatus(item, day, state);
  const label = ctx.labels.get(item.id);
  // 선택 일정이라도 동선에 넣었으면(active) 본 일정과 같은 모양으로 보인다
  const isOption = (item.priority === 'optional' || item.priority === 'backup') && status !== 'active';
  const cls = ['tl-item'];
  if (item.time && item.time.nature === 'fixed') cls.push('is-fixed');
  if (isOption) cls.push('is-option');
  if (item.kind === 'move') cls.push('is-move');
  if (item.kind === 'flex') cls.push('is-flex');
  if (status === 'floating' && !isOption) cls.push('is-floating');
  if (item.placeId && state.visited[item.placeId] && item.kind === 'shop') cls.push('is-visited');
  if (ctx.nowId === item.id) cls.push('is-now');

  const numEl = label ? h('span', { class: `num${label === 'H' ? ' h' : ''}${isOption ? ' opt' : ''}`, 'aria-label': label === 'H' ? '숙소' : `지도 ${label}번` }, label) : null;
  const card = h('div', { class: 'tl-card', id: `item-${item.id}` });
  card.append(h('div', { class: 'tl-kind' }, [KIND_LABEL[item.kind] || '', item.meal && item.kind === 'meal' ? ` · ${MEAL_LABEL[item.meal]}` : ''].join('')));
  card.append(h('div', { class: 'tl-name' }, numEl, item.title));
  if (ctx.nowId === item.id) card.append(h('p', { class: 'small' }, '⏱ 현재 시간대의 계획 (실제 위치와 무관)'));
  if (place && place.nameJa && item.kind !== 'move') card.append(h('div', { class: 'tl-ja', lang: 'ja' }, place.nameJa));
  const r = item.reservation || {};
  if (r.note) card.append(h('div', { class: `tl-res${r.status === 'confirmed' ? ' confirmed' : ''}` }, r.status === 'confirmed' ? `✓ ${r.note}` : r.note));
  if (item.kind !== 'move') card.append(itemBadges(item, day, { extra: status === 'floating' && item.choice ? [badge('선택 전', 'b-backup')] : [] }));

  const memo = item.memo && item.memo.length ? h('ul', { class: 'tl-memo' }, item.memo.map((m) => h('li', null, m))) : null;
  const actions = [];
  if ((item.kind === 'shop' || item.shopping) && item.placeId) actions.push(visitedToggle(item));
  if (item.kapitalEbisu) actions.push(kapitalMoveButton(item));
  if (item.priority === 'optional' && !item.choice) {
    const id = `o-${item.id}`;
    actions.push(h('label', { class: 'toggle', for: id },
      h('input', { type: 'checkbox', id, checked: !!state.selectedOptions[item.id], onchange: (e) => setMapKey('selectedOptions', item.id, e.target.checked) }),
      '동선에 넣기'));
  }
  if (label && hasCoords(place) && ctx.mapKey) {
    actions.push(h('button', { type: 'button', class: 'btn btn-small', onclick: () => { document.getElementById(`map-anchor-${day.date}`)?.scrollIntoView({ block: 'start' }); focusOnItem(ctx.mapKey, item.id); } }, '지도에서 보기'));
  }

  if (state.viewMode === 'detail') {
    if (memo) card.append(memo);
    if (actions.length) card.append(h('div', { class: 'controls' }, actions));
    if (place) card.append(placeFacts(place), placeLinks(place));
  } else {
    if (actions.length) card.append(h('div', { class: 'controls' }, actions));
    if (memo || place) {
      const det = h('details', null, h('summary', null, place ? '상세 · 주소 · 링크' : '상세'));
      if (memo) det.append(memo);
      if (place) det.append(placeFacts(place), placeLinks(place));
      card.append(det);
    }
  }
  if (item.kapitalMakeup) card.append(renderKapitalMakeup());
  if (item.flexBlock === 'jimbocho') {
    for (const w of jimbochoWarnings(state, new Date())) card.append(h('div', { class: 'notice notice-caution' }, w));
    card.append(segmented('jimbochoOrder'));
  }

  const li = h('li', { class: cls.join(' ') },
    h('div', { class: 'tl-time' }, item.time ? item.time.text : ''),
    card);
  return li;
}

function renderKapitalMakeup() {
  const ids = mondayKapitalForRoute(state);
  const box = h('div', { class: 'controls', style: 'display:block' });
  if (!ids.length) {
    box.append(h('p', { class: 'small' }, '월요일로 넘긴 에비스 캐피탈이 없습니다. 토요일 일정에서 “월요일로 넘기기”를 누르면 여기에 모입니다.'));
  } else {
    box.append(h('p', null, '보충할 매장:'));
    box.append(h('ul', { class: 'dots' }, ids.map((id) => h('li', null, placeName(PM[id]), ' ', ext(mapsSearchUrl(PM[id]), '지도')))));
  }
  const pending = kapitalUnresolved(DAYS, state);
  if (pending.length) box.append(h('p', { class: 'small' }, `토요일에 아직 체크하지 않은 매장: ${pending.map((id) => placeName(PM[id])).join(', ')} — 자동으로 넣지 않습니다.`));
  return box;
}

function legRow(leg) {
  const a = leg.from.place;
  const b = leg.to.place;
  return h('li', { class: 'leg', 'aria-label': `${placeName(a)}에서 ${placeName(b)}까지 길찾기` },
    h('span', null, `→ ${placeName(b)}까지`),
    ext(mapsDirectionsUrl(a, b, 'transit'), '대중교통 길찾기'),
    ext(mapsDirectionsUrl(a, b, 'walking'), '도보 길찾기'));
}

// ---------- 날짜 패널 ----------
function renderDay(day, index) {
  const route = computeRoute(day, state, PLACES);
  const mapKey = `day-${day.date}`;
  const labels = new Map();
  for (const s of route.stops) labels.set(s.item.id, s.label);
  for (const m of route.markers) if (m.kind === 'floating') for (const it of m.items) labels.set(it.id, '?');
  const now = currentPlanItem(DAYS, state, new Date());
  const ctx = { labels, mapKey, nowId: now && now.item && now.day.date === day.date ? now.item.id : null };

  const wrap = h('section', { class: 'day' });
  wrap.append(h('div', { class: 'day-head' },
    h('div', { class: 'day-date' }, `DAY ${index + 1} · ${formatDateKo(day.date)} · ${day.date}`),
    h('h2', { class: 'panel-title' }, day.title),
    h('p', { class: 'day-route' }, day.route)));
  for (const w of day.warnings) wrap.append(warningBox(w));
  if (day.notes.length) wrap.append(h('ul', { class: 'day-notes' }, day.notes.map((n) => h('li', null, n))));

  // 선택 컨트롤
  const ctrls = h('div');
  if (day.date === '2026-10-31') ctrls.append(segmented('artNight'));
  if (day.date === '2026-11-01') ctrls.append(segmented('sundayDinner'));
  if (day.date === '2026-11-02') {
    ctrls.append(segmented('mondayPlan'));
    const pending = kapitalUnresolved(DAYS, state);
    const moved = mondayKapitalForRoute(state);
    const hint = moved.length
      ? `토요일에 넘긴 캐피탈 ${moved.length}곳 → B안이 맞습니다.`
      : pending.length ? `토요일 캐피탈 중 ${pending.length}곳이 아직 체크되지 않았습니다.` : '토요일 에비스 캐피탈을 모두 봤다면 A안.';
    ctrls.append(h('p', { class: 'choice-hint' }, hint, ' (자동으로 바꾸지 않습니다)'));
  }
  const hasOptions = day.items.some((i) => i.priority === 'optional' && !i.choice);
  if (hasOptions) {
    const id = `so-${day.date}`;
    ctrls.append(h('label', { class: 'toggle', for: id },
      h('input', { type: 'checkbox', id, checked: !!state.showOptions[day.date], onchange: (e) => setMapKey('showOptions', day.date, e.target.checked) }),
      '선택 일정 위치를 지도에 표시'));
  }
  wrap.append(ctrls);

  // 지도
  const mapBlock = h('div', { class: 'map-block', id: `map-anchor-${day.date}` });
  if (mapsAvailable()) {
    mapBlock.append(getMapElement(mapKey));
  } else {
    mapBlock.append(h('div', { class: 'map-wrap' }, h('p', { class: 'map-fallback' }, '지도를 불러오지 못했습니다. 아래 일정과 길찾기 링크는 그대로 사용할 수 있어요.')));
  }
  mapBlock.append(h('div', { class: 'legend' },
    h('span', null, h('i', { class: 'lg lg-hotel' }, 'H'), '숙소'),
    h('span', null, h('i', { class: 'lg lg-core' }, '1'), '방문 순서 번호'),
    h('span', null, h('i', { class: 'lg lg-float' }, '?'), '선택 전 (연결 안 함)'),
    h('span', null, h('i', { class: 'lg lg-line' }), '방문 순서 (동선에 넣은 선택 일정 포함)')));
  mapBlock.append(h('p', { class: 'map-caption' }, h('strong', null, '선은 방문 순서 연결선이며 실제 도로·철도 경로가 아닙니다.'), ' 거리·시간은 아래 구간별 길찾기로 확인하세요.'));
  // 번호가 뭉치는 구역을 위해 — 번호 목록을 누르면 그 장소로 확대
  const chips = [];
  const seenLabel = new Set();
  for (const st of route.stops) {
    if (st.label === 'H' || seenLabel.has(st.label)) continue;
    seenLabel.add(st.label);
    chips.push(h('button', { type: 'button', class: 'stop-chip', onclick: () => focusOnItem(mapKey, st.item.id) },
      h('b', null, st.label), placeName(st.place)));
  }
  if (chips.length && mapsAvailable()) mapBlock.append(h('div', { class: 'stop-chips', 'aria-label': '지도 번호 목록 — 누르면 확대' }, chips));
  if (route.missing.length) {
    mapBlock.append(h('p', { class: 'missing-list' }, `지도 위치 확인 필요 (지도에 없음): ${[...new Set(route.missing.map((m) => placeName(m.place) || m.item.title))].join(', ')}`));
  }
  const body = h('div', { class: 'day-body' });
  const side = h('div', { class: 'day-side' }, mapBlock);

  if (route.airportLegs.length) {
    const key = `air-${day.date}`;
    const airport = route.airportLegs[0];
    const other = airport.other ? airport.other.place : null;
    const card = h('div', { class: 'card airport-card' },
      h('div', null,
        h('h3', { class: 'section-title', style: 'margin-top:0' }, '나리타 이동 개요'),
        h('p', null, day.date === TRIP.arrival.date ? `나리타 17:40 도착 → ${placeName(other)}` : `${placeName(other)} → 나리타 18:55 출발`),
        h('p', { class: 'small' }, '공항은 도심 지도와 축척이 달라 따로 표시합니다. 항공사·터미널은 미확인.'),
        other ? h('div', { class: 'btn-row' }, day.date === TRIP.arrival.date
          ? ext(mapsDirectionsUrl(PM[TRIP.airportId], other, 'transit'), '공항 → 숙소 대중교통 길찾기', 'btn')
          : ext(mapsDirectionsUrl(other, PM[TRIP.airportId], 'transit'), '도쿄역 → 공항 길찾기', 'btn'),
        ext(PM[TRIP.airportId].officialUrl, '나리타공항 공식', 'btn')) : null),
      mapsAvailable() ? getMapElement(key, true) : null);
    side.append(card);
  }
  body.append(side);
  const main = h('div', { class: 'day-main' });
  body.append(main);
  wrap.append(body);

  // 보기 전환
  main.append(h('div', { class: 'view-switch' },
    h('div', { class: 'segmented', role: 'group', 'aria-label': '보기 방식' },
      h('button', { type: 'button', 'aria-pressed': state.viewMode === 'timeline' ? 'true' : 'false', onclick: () => setState({ viewMode: 'timeline' }) }, '일정표'),
      h('button', { type: 'button', 'aria-pressed': state.viewMode === 'detail' ? 'true' : 'false', onclick: () => setState({ viewMode: 'detail' }) }, '상세 설명'))));

  main.append(renderTimeline(day, route, ctx));
  return { node: wrap, route, mapKey };
}

function renderTimeline(day, route, ctx) {
  const legs = routeLegs(route);
  const legAfter = new Map();
  for (const leg of legs) legAfter.set(leg.from.item.id, leg);
  const ol = h('ol', { class: 'timeline', 'aria-label': `${formatDateKo(day.date)} 일정` });
  const items = orderedItems(day, state);
  const isMonday = day.date === '2026-11-02';

  const pushItem = (target, item) => {
    const st = itemStatus(item, day, state);
    if (item.choice && st === 'hidden') return;
    if (isMonday && item.variant && st === 'hidden') return;
    if (item.kapitalEbisu && state.kapitalToMonday[item.placeId]) {
      target.append(h('li', { class: 'tl-item is-option' }, h('div', { class: 'tl-time' }, '→ 월'),
        h('div', { class: 'tl-card' }, h('div', { class: 'tl-name' }, item.title), h('p', { class: 'small' }, '월요일 B안으로 넘김'), h('div', { class: 'controls' }, kapitalMoveButton(item)))));
      return;
    }
    target.append(renderItem(item, day, ctx));
    const leg = legAfter.get(item.id);
    if (leg) target.append(legRow(leg));
  };

  let i = 0;
  while (i < items.length) {
    const item = items[i];
    if (item.optionGroup) {
      const g = item.optionGroup;
      const groupItems = [];
      while (i < items.length && items[i].optionGroup === g) { groupItems.push(items[i]); i++; }
      if (isMonday && groupItems[0].variant && itemStatus(groupItems[0], day, state) === 'hidden') continue;
      const meta = OPTION_GROUPS[g] || {};
      const box = h('li', { class: 'option-group' },
        h('div', { class: 'option-group-title' }, `선택 · ${meta.label || ''}`),
        h('div', { class: 'option-group-when' }, [meta.when, meta.note].filter(Boolean).join(' — ')));
      const inner = h('ol', { class: 'timeline', style: 'margin-top:8px' });
      for (const gi of groupItems) pushItem(inner, gi);
      box.append(inner);
      ol.append(box);
      continue;
    }
    if (isMonday && item.variant && state.mondayPlan === 'undecided') {
      const v = item.variant;
      const sec = h('li', { class: 'option-group' }, h('div', { class: 'option-group-title' }, v === 'A' ? 'A안 — 토요일 에비스 캐피탈을 다 봤다면' : 'B안 — 토요일 에비스 캐피탈을 못 봤다면'),
        h('div', { class: 'option-group-when' }, '대안입니다. 둘을 이어서 하는 일정이 아닙니다.'));
      const inner = h('ol', { class: 'timeline', style: 'margin-top:8px' });
      while (i < items.length && items[i].variant === v) {
        const it = items[i];
        if (it.optionGroup) {
          const meta = OPTION_GROUPS[it.optionGroup] || {};
          inner.append(h('li', { class: 'small option-sub' }, `선택 · ${meta.label || ''}`));
        }
        inner.append(renderItem(it, day, ctx));
        i++;
      }
      sec.append(inner);
      ol.append(sec);
      continue;
    }
    pushItem(ol, item);
    i++;
  }
  return ol;
}

// ---------- 요약 ----------
function renderSummary() {
  const hotel = PM[TRIP.hotelId];
  const wrap = h('section');
  const now = currentPlanItem(DAYS, state, new Date());
  if (now) {
    const idx = DAYS.indexOf(now.day);
    wrap.append(h('div', { class: 'now-banner' },
      h('strong', null, `오늘은 DAY ${idx + 1} · ${formatDateKo(now.day.date)}`),
      now.item ? h('p', null, '현재 시간대의 계획: ', now.item.title, ' (계획 기준 — 실제 위치와 무관)') : null,
      h('a', { href: `#day-${idx + 1}` }, '오늘 일정 보기')));
  }
  wrap.append(h('h2', { class: 'panel-title' }, '여행 요약'));
  wrap.append(h('p', { class: 'panel-lead' }, `${formatDateKo(TRIP.startDate)} ~ ${formatDateKo(TRIP.endDate)} · ${TRIP.nights}박 ${TRIP.nights + 1}일 · ${TRIP.party}`));

  wrap.append(h('div', { class: 'grid grid-2' },
    h('div', { class: 'card' },
      h('h3', { class: 'section-title', style: 'margin-top:0' }, '항공 · 숙소'),
      h('dl', { class: 'kv' },
        h('dt', null, '도착'), h('dd', null, `10/29 목 17:40 · ${placeName(PM[TRIP.airportId])}`),
        h('dt', null, '출국'), h('dd', null, `11/2 월 18:55 · ${placeName(PM[TRIP.airportId])}`),
        h('dt', null, '항공편'), h('dd', { class: 'small' }, '항공사·편명·터미널 미제공'),
        h('dt', null, '숙소'), h('dd', null, hotel.nameKo, h('div', { class: 'tl-ja', lang: 'ja' }, hotel.nameJa)),
        h('dt', null, '주소'), h('dd', { lang: 'ja' }, hotel.address),
        hotel.hours ? [h('dt', null, '체크인/아웃'), h('dd', null, hotel.hours, h('div', { class: 'status-line ok' }, `공식 확인 (${hotel.checkedAt})`))] : null,
        h('dt', null, '이동'), h('dd', null, TRIP.transport)),
      placeLinks(hotel)),
    h('div', { class: 'card' },
      h('h3', { class: 'section-title', style: 'margin-top:0' }, '예약 완료 ', h('span', { class: 'count' }, `${BOOKINGS.length}건`)),
      h('ul', { class: 'plain' }, BOOKINGS.map((b) => h('li', { style: 'padding:6px 0;border-bottom:1px solid var(--line)' },
        h('span', { class: 'booking-date' }, formatDateKo(b.date)), ' ',
        h('strong', null, placeName(PM[b.placeId])), h('br'), b.summary))),
      h('p', { class: 'small', style: 'margin-top:8px' }, '나머지 식당·카페는 현장 방문입니다. ', h('a', { href: '#bookings' }, '예약 모아보기')))));

  wrap.append(h('h3', { class: 'section-title' }, '날짜별 한 줄 요약'));
  wrap.append(h('div', { class: 'card' }, h('ul', { class: 'summary-days' }, DAYS.map((d, i) => h('li', null,
    h('span', { class: 'd' }, formatDateKo(d.date)),
    h('div', null, h('a', { href: `#day-${i + 1}` }, d.title), h('div', { class: 'small' }, d.summary)))))));

  wrap.append(h('h3', { class: 'section-title' }, '이번 여행의 기준'));
  wrap.append(h('div', { class: 'card' }, h('ul', { class: 'dots' }, TASTE.map((t) => h('li', null, t)))));
  wrap.append(storageNotice());
  return wrap;
}

function storageNotice() {
  const s = storageStatus();
  return h('div', { class: 'notice notice-info' },
    h('p', null, '체크·선택·메모는 이 브라우저(localStorage)에만 저장되며 기기 간 자동 동기화되지 않습니다. 다른 기기로 옮기려면 준비·유의 탭의 내보내기/가져오기를 쓰세요.'),
    !s.ok ? h('p', null, h('strong', null, '이 브라우저에서는 저장이 되지 않습니다 (사생활 보호 모드 등). 새로고침하면 선택이 초기화됩니다.')) : null,
    s.recovered ? h('p', null, '저장된 데이터가 손상되어 기본값으로 복구했습니다.') : null);
}

// ---------- 예약 ----------
function renderBookings() {
  const wrap = h('section');
  wrap.append(h('h2', { class: 'panel-title' }, '예약 모아보기'));
  wrap.append(h('p', { class: 'panel-lead' }, '실제 예약은 3건뿐입니다. “방문 예정”은 예약 완료가 아닙니다.'));
  wrap.append(h('h3', { class: 'section-title' }, '예약 완료 ', h('span', { class: 'count' }, `${BOOKINGS.length}건`)));
  wrap.append(h('div', { class: 'grid grid-3' }, BOOKINGS.map((b) => {
    const p = PM[b.placeId];
    return h('div', { class: 'card booking' },
      h('div', { class: 'booking-date' }, `${formatDateKo(b.date)}`),
      h('div', { class: 'booking-time' }, b.showTime ? `${b.time} 입장 · ${b.showTime} 공연` : b.time),
      h('div', { class: 'booking-name' }, placeName(p)),
      h('div', { class: 'tl-ja', lang: 'ja' }, p.nameJa),
      h('div', { class: 'badges', style: 'margin:8px 0' }, badge('예약 완료', 'b-confirmed'), b.party ? badge(`${b.party}명`, 'no-dot') : null, b.seat ? badge(b.seat, 'no-dot') : null, b.method ? badge(b.method, 'no-dot') : null),
      h('ul', { class: 'dots small' }, b.notes.map((n) => h('li', null, n))),
      h('dl', { class: 'facts' }, h('dt', null, '주소'), h('dd', { lang: 'ja' }, p.address || '확인 필요'),
        p.phone && p.phoneStatus === 'official_checked' ? [h('dt', null, '전화'), h('dd', null, h('a', { href: `tel:${p.phone.replace(/[^\d+]/g, '')}` }, p.phone))] : null),
      placeLinks(p));
  })));
  wrap.append(h('p', { class: 'small', style: 'margin-top:8px' }, '예약번호·예약자 이름·개인 연락처는 이 사이트에 넣지 않습니다. 이미 한 전화 예약을 다시 할 필요는 없습니다.'));

  const groups = { walk_in: [], solo: [], not_reserved: [] };
  for (const d of DAYS) for (const it of d.items) {
    if (!it.placeId || it.bookingId) continue;
    const r = it.reservation || {};
    if ((r.constraints || []).includes('soloReservationUnavailable')) groups.solo.push({ d, it });
    else if (r.status === 'walk_in') groups.walk_in.push({ d, it });
    else if (r.status === 'not_reserved' && it.kind !== 'transit') groups.not_reserved.push({ d, it });
  }
  const list = (arr) => h('div', { class: 'card' }, h('ul', { class: 'plain' }, arr.map(({ d, it }) => h('li', { style: 'padding:6px 0;border-bottom:1px solid var(--line)' },
    h('span', { class: 'booking-date' }, formatDateKo(d.date)), ' ', h('strong', null, it.title), it.priority !== 'core' ? [' ', badge(PRIORITY_LABEL[it.priority][0], PRIORITY_LABEL[it.priority][1])] : null,
    it.reservation.note ? h('div', { class: 'small' }, it.reservation.note) : null))));

  wrap.append(h('h3', { class: 'section-title' }, '1인 예약 불가 → 현장 방문'), list(groups.solo));
  wrap.append(h('p', { class: 'small' }, '1인 예약이 안 된다는 뜻이지, 혼자 식사할 수 없다는 뜻이 아닙니다.'));
  wrap.append(h('h3', { class: 'section-title' }, '현장 방문 · 오픈런 ', h('span', { class: 'count' }, `${groups.walk_in.length}곳`)), list(groups.walk_in));
  wrap.append(h('h3', { class: 'section-title' }, '일부러 예약하지 않음'), list(groups.not_reserved));

  wrap.append(h('h3', { class: 'section-title' }, '현장 구매 · 여행 중 예약 · 미정'));
  wrap.append(h('div', { class: 'grid grid-2' }, PREP.filter((p) => ['buy_on_site', 'todo_during_trip', 'undecided'].includes(p.status)).map(prepCard)));
  return wrap;
}

function prepCard(p) {
  const cls = { buy_on_site: 'b-walkin', todo_during_trip: 'b-monday', undecided: 'b-verify', needs_verification: 'b-verify', unknown: 'b-verify', optional: 'b-optional' }[p.status] || '';
  return h('div', { class: 'card' },
    h('div', { class: 'badges' }, badge(p.label, cls)),
    h('h4', { style: 'margin-top:8px' }, p.title),
    h('p', null, p.detail),
    p.sourceIds ? h('p', { class: 'small' }, sourceLinks(p.sourceIds)) : null);
}

// ---------- 쇼핑 ----------
let shopSort = 'day';
function renderShopping() {
  const wrap = h('section');
  const sat = saturdayShoppingCount(DAYS);
  wrap.append(h('h2', { class: 'panel-title' }, '쇼핑 목록'));
  wrap.append(h('p', { class: 'panel-lead' }, `토요일 쇼핑 ${sat}곳 (에비스 캐피탈 3곳 제외 ${sat - 3}곳). “방문 완료”는 구매했다는 뜻이 아닙니다.`));
  wrap.append(h('div', { class: 'choice' }, h('span', { class: 'choice-label', id: 'lbl-sort' }, '정렬'),
    h('div', { class: 'segmented', role: 'group', 'aria-labelledby': 'lbl-sort' },
      [['day', '날짜'], ['area', '지역'], ['priority', '우선순위']].map(([v, l]) => h('button', { type: 'button', 'aria-pressed': shopSort === v ? 'true' : 'false', onclick: () => { shopSort = v; rerender(); } }, l)))));

  wrap.append(h('h3', { class: 'section-title' }, '찾는 품목 — 구매 완료 체크'));
  wrap.append(h('div', { class: 'card' }, WISHLIST.map((w) => h('div', { class: `shop-row${state.purchased[w.id] ? ' is-done' : ''}` },
    h('div', null, h('div', { class: 'shop-name' }, w.title), h('div', { class: 'shop-purpose' }, w.note)),
    h('div', { class: 'shop-purpose' }, '볼 곳: ', w.placeIds.map((id) => placeName(PM[id])).join(', ')),
    h('label', { class: 'toggle', for: `p-${w.id}` }, h('input', { type: 'checkbox', id: `p-${w.id}`, checked: !!state.purchased[w.id], onchange: (e) => setMapKey('purchased', w.id, e.target.checked) }), '구매 완료')))));

  let entries = shoppingEntries(DAYS, state).filter((e) => !(e.item.variant && state.mondayPlan !== 'undecided' && state.mondayPlan !== e.item.variant));
  const prioRank = (e) => (e.item.important ? 0 : e.item.priority === 'core' ? 1 : e.item.priority === 'optional' ? 2 : 3);
  let groups;
  if (shopSort === 'area') {
    groups = new Map();
    for (const e of entries) {
      const area = (PM[e.item.placeId] || {}).area || '기타';
      if (!groups.has(area)) groups.set(area, []);
      groups.get(area).push(e);
    }
  } else if (shopSort === 'priority') {
    entries = entries.slice().sort((a, b) => prioRank(a) - prioRank(b));
    groups = new Map([['꼭 방문', []], ['본 일정', []], ['선택', []]]);
    for (const e of entries) groups.get(['꼭 방문', '본 일정', '선택', '선택'][prioRank(e)]).push(e);
  } else {
    groups = new Map();
    for (const e of entries) {
      const k = `${formatDateKo(e.day.date)} · ${e.day.title}`;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(e);
    }
  }
  for (const [title, arr] of groups) {
    if (!arr.length) continue;
    wrap.append(h('h3', { class: 'section-title' }, title, ' ', h('span', { class: 'count' }, `${arr.length}`)));
    wrap.append(h('div', { class: 'card' }, arr.map((e) => shopRow(e))));
  }
  return wrap;
}

function shopRow({ day, item }) {
  const place = PM[item.placeId];
  const moved = item.kapitalEbisu && state.kapitalToMonday[item.placeId];
  const done = !!state.visited[item.placeId];
  const tags = [];
  if (item.important) tags.push(badge('꼭 방문', 'b-important'));
  else tags.push(badge(...PRIORITY_LABEL[item.priority]));
  if (item.variant) tags.push(badge(`${item.variant}안`, 'b-monday'));
  if (moved) tags.push(badge('월요일로 넘김', 'b-monday'));
  else if (item.shopping && item.shopping.mondayOk && day.date !== '2026-11-02') tags.push(badge('월요일로 넘길 수 있음', 'b-monday'));
  if (done) tags.push(badge('방문 완료', 'b-visited'));
  if (place && place.hoursStatus !== 'official_checked') tags.push(badge('영업 확인 필요', 'b-verify'));
  return h('div', { class: `shop-row${done ? ' is-done' : ''}` },
    h('div', null,
      h('div', { class: 'shop-name' }, item.title),
      h('div', { class: 'shop-purpose' }, `${formatDateKo(day.date)} · ${(place && place.area) || ''} · ${item.shopping ? item.shopping.purpose : ''}`),
      h('div', { class: 'badges', style: 'margin-top:6px' }, tags)),
    h('div', { class: 'shop-purpose' }, place && place.hours ? h('span', { lang: 'ja' }, place.hours) : '영업시간 확인 필요'),
    h('div', { class: 'shop-actions' },
      h('label', { class: 'toggle', for: `sv-${day.date}-${item.id}` }, h('input', { type: 'checkbox', id: `sv-${day.date}-${item.id}`, checked: done, onchange: (e) => setMapKey('visited', item.placeId, e.target.checked) }), '방문 완료'),
      item.kapitalEbisu ? kapitalMoveButton(item) : null,
      place ? ext(mapsSearchUrl(place), '지도', 'btn') : null));
}

// ---------- 식사 ----------
function renderMeals() {
  const wrap = h('section');
  wrap.append(h('h2', { class: 'panel-title' }, '식사 · 카페'));
  wrap.append(h('p', { class: 'panel-lead' }, '일요일 저녁과 월요일 점심은 선택에 따라 바뀝니다.'));
  const rows = mealTable(DAYS, state);
  const cell = (arr, slot, date) => {
    if (date === '2026-10-29' && slot === 'lunch') return h('span', { class: 'sub' }, '도쿄 점심 없음 (비행)');
    if (date === '2026-11-02' && slot === 'cafe') return h('span', { class: 'sub' }, '별도 킷사텐 없음');
    if (date === '2026-10-29' && slot === 'cafe') return h('span', { class: 'sub' }, '—');
    if (!arr.length) return h('span', { class: 'sub' }, '—');
    const floating = arr.filter((x) => x.status === 'floating');
    const active = arr.filter((x) => x.status === 'active');
    return h('div', null,
      active.map(({ item }) => h('div', null, item.title.split(' — ')[0], item.reservation && item.reservation.status === 'confirmed' ? [' ', badge(`예약 ${item.time.text}`, 'b-confirmed')] : null,
        item.priority === 'optional' ? [' ', badge('선택', 'b-optional')] : null,
        item.title.includes(' — ') ? h('span', { class: 'sub' }, item.title.split(' — ')[1]) : null)),
      floating.length ? h('div', null, h('span', { class: 'sub' }, date === '2026-11-01' && slot === 'dinner' ? '하나만 (미정):' : date === '2026-11-02' ? '계획 미정 — 후보:' : floating.every((x) => x.item.flexMember) ? '본 일정 · 진보초 순서 미정:' : '선택:'), floating.map(({ item }) => h('div', null, '· ', item.title.split(' — ')[0], item.variant ? ` (${item.variant}안)` : ''))) : null);
  };
  const table = h('table', { class: 'stack' },
    h('thead', null, h('tr', null, h('th', null, '날짜'), h('th', null, '점심'), h('th', null, '카페'), h('th', null, '저녁·밤'))),
    h('tbody', null, rows.map((r) => h('tr', null,
      h('td', { 'data-label': '날짜' }, h('strong', null, formatDateKo(r.date))),
      h('td', { 'data-label': '점심' }, cell(r.lunch, 'lunch', r.date)),
      h('td', { 'data-label': '카페' }, cell(r.cafe, 'cafe', r.date)),
      h('td', { 'data-label': '저녁·밤' }, cell(r.dinner, 'dinner', r.date), r.date === '2026-10-30' ? h('span', { class: 'sub' }, '→ Blue Note 19:45 입장 (음료 정도)') : null)))));
  wrap.append(h('div', { class: 'table-wrap' }, table));
  wrap.append(h('div', { class: 'grid grid-2', style: 'margin-top:14px' },
    h('div', { class: 'card' }, h('h4', { style: 'margin-top:0' }, '일요일 저녁 (하나만)'), segmented('sundayDinner'),
      h('p', { class: 'small' }, '아키요시: 1인 예약 불가 → 현장 방문 (19:00 전후 목표). 마루쇼: 예약하지 않음, 당일 선택. 지금 느낌으로는 아키요시가 더 끌림.')),
    h('div', { class: 'card' }, h('h4', { style: 'margin-top:0' }, '월요일 점심'), segmented('mondayPlan'),
      h('p', { class: 'small' }, 'A안이면 츠지한 후보 (대기가 길면 생략). B안이면 동선에서 해결 — 츠지한을 포기해도 됨.'))));
  wrap.append(h('ul', { class: 'dots', style: 'margin-top:14px' }, MEAL_NOTES.map((m) => h('li', null, m))));
  return wrap;
}

// ---------- 준비·유의 ----------
const LUGGAGE_FIELDS = [
  ['luggage-method', '방식 (코인로커 / 클로크 등)'],
  ['luggage-where', '위치 — 개찰구 안/밖 · 층 · 가까운 출구'],
  ['luggage-deadline', '반환 마감 시각'],
  ['luggage-memo', '기타 메모 (번호 등은 화면 공유 시 주의)'],
];
function noteField(key, label, multiline) {
  const id = `n-${key}`;
  const input = multiline
    ? h('textarea', { id, maxlength: '2000' })
    : h('input', { type: 'text', id, maxlength: '200' });
  input.value = state.notes[key] || '';
  input.addEventListener('change', (e) => {
    const notes = { ...state.notes };
    const v = e.target.value;
    if (v.trim()) notes[key] = v.slice(0, 2000); else delete notes[key];
    state = { ...state, notes };
    saveState(state);
  });
  return [h('label', { class: 'field', for: id }, label), input];
}

function renderPrep() {
  const wrap = h('section');
  wrap.append(h('h2', { class: 'panel-title' }, '준비 · 유의사항'));
  wrap.append(h('p', { class: 'panel-lead' }, '확인하지 못한 정보는 “확인 필요”로 남겨 두었습니다.'));

  wrap.append(h('h3', { class: 'section-title' }, '꼭 기억할 시간 제약'));
  for (const d of DAYS) for (const w of d.warnings) {
    const box = warningBox(w);
    box.prepend(h('strong', null, `${formatDateKo(d.date)} `));
    wrap.append(box);
  }
  wrap.append(h('div', { class: 'notice notice-caution' }, h('p', null, h('strong', null, '10/31 토 '), '롯폰기 아트 나이트 후 귀환: 자정 이후 지하철이 다닌다고 가정하지 않는다. 당일 막차를 확인하거나 택시.', sourceLinks(['src-artnight']))));

  wrap.append(h('h3', { class: 'section-title' }, '남은 준비'));
  wrap.append(h('div', { class: 'grid grid-2' }, PREP.map(prepCard)));

  wrap.append(h('h3', { class: 'section-title' }, '도쿄역 짐 보관 메모 (11/2)'));
  wrap.append(h('div', { class: 'card' },
    h('p', { class: 'small' }, '맡긴 뒤 적어 두세요. 이 브라우저에만 저장됩니다.'),
    LUGGAGE_FIELDS.map(([k, l]) => noteField(k, l, k === 'luggage-memo')),
    h('p', { class: 'small', style: 'margin-top:8px' }, '참고: ', sourceLinks(['src-gransta-cloak'])),
    h('p', { class: 'small' }, SM['src-gransta-cloak'].notes)));

  wrap.append(h('h3', { class: 'section-title' }, TAX_FREE_NOTE.title));
  wrap.append(h('div', { class: 'card' }, h('ul', { class: 'dots' }, TAX_FREE_NOTE.points.map((p) => h('li', null, p))), h('p', { class: 'small' }, sourceLinks(TAX_FREE_NOTE.sourceIds))));

  wrap.append(h('h3', { class: 'section-title' }, '자유 메모'));
  wrap.append(h('div', { class: 'card' }, noteField('general', '메모', true)));

  wrap.append(h('h3', { class: 'section-title' }, '본 일정에서 뺀 것 — 다시 넣지 않음'));
  wrap.append(h('div', { class: 'card' }, h('ul', { class: 'dots' }, EXCLUDED.map((e) => h('li', null, h('strong', null, e.name), ` — ${e.reason}`)))));

  wrap.append(h('h3', { class: 'section-title' }, '저장 데이터'));
  wrap.append(storageNotice());
  const fileInput = h('input', { type: 'file', accept: 'application/json,.json', class: 'visually-hidden', id: 'import-file' });
  const msg = h('p', { class: 'small', role: 'status' });
  fileInput.addEventListener('change', async () => {
    const f = fileInput.files && fileInput.files[0];
    if (!f) return;
    if (f.size > 200000) { msg.textContent = '파일이 너무 큽니다.'; return; }
    const res = parseImport(await f.text());
    if (!res.ok) { msg.textContent = `가져오기 실패: ${res.error}`; return; }
    if (!window.confirm('가져온 데이터로 현재 체크·선택·메모를 덮어쓸까요?')) return;
    state = res.state;
    saveState(state);
    rerender();
  });
  wrap.append(h('div', { class: 'card' },
    h('div', { class: 'btn-row', style: 'margin-top:0' },
      h('button', { type: 'button', class: 'btn', onclick: () => {
        const blob = new Blob([JSON.stringify(exportPayload(state), null, 2)], { type: 'application/json' });
        const a = h('a', { href: URL.createObjectURL(blob), download: 'tokyo-trip-state.json' });
        document.body.append(a); a.click(); a.remove();
      } }, 'JSON 내보내기'),
      h('label', { class: 'btn', for: 'import-file' }, 'JSON 가져오기'), fileInput,
      h('button', { type: 'button', class: 'btn btn-danger', onclick: () => {
        if (!window.confirm('모든 체크·선택·메모를 지울까요? 되돌릴 수 없습니다.')) return;
        state = clearState();
        rerender();
      } }, '상태 초기화')),
    msg));

  wrap.append(h('h3', { class: 'section-title' }, '출처'));
  wrap.append(h('div', { class: 'card' }, h('ul', { class: 'dots' }, SOURCES.map((s) => {
    const [t, ok] = statusText(s.status, s.checkedAt);
    return h('li', null, s.url ? ext(s.url, s.title) : s.title, ' ', badge(t, ok ? 'b-checked' : 'b-verify'), s.notes ? h('div', { class: 'small' }, s.notes) : null);
  }))));
  wrap.append(h('p', { class: 'small', style: 'margin-top:8px' }, '장소별 주소·영업시간 출처는 각 장소 카드의 “공식 안내” 링크에 있습니다. 이 사이트는 예약·취소·구매를 하지 않습니다.'));
  return wrap;
}

// ---------- 탭·라우팅 ----------
const tablist = document.getElementById('tablist');
const app = document.getElementById('app');

function buildTabs() {
  tablist.textContent = '';
  for (const t of TABS) {
    const b = h('button', { type: 'button', role: 'tab', class: 'tab', id: `tab-${t.id}`, 'aria-controls': 'app', 'aria-selected': 'false', tabindex: '-1', onclick: () => go(t.id) },
      t.label, t.date ? h('span', { class: 'tab-date' }, t.date.slice(5).replace('-', '/')) : null);
    tablist.append(b);
  }
  tablist.addEventListener('keydown', (e) => {
    const idx = TABS.findIndex((t) => t.id === currentTab);
    let next = null;
    if (e.key === 'ArrowRight') next = TABS[(idx + 1) % TABS.length];
    if (e.key === 'ArrowLeft') next = TABS[(idx - 1 + TABS.length) % TABS.length];
    if (e.key === 'Home') next = TABS[0];
    if (e.key === 'End') next = TABS[TABS.length - 1];
    if (next) { e.preventDefault(); go(next.id); document.getElementById(`tab-${next.id}`).focus(); }
  });
}

function go(id) {
  if (location.hash !== `#${id}`) history.replaceState(null, '', `#${id}`);
  show(id, true);
}

function defaultTab() {
  const now = currentPlanItem(DAYS, defaultState(), new Date());
  if (now) return `day-${DAYS.indexOf(now.day) + 1}`;
  return 'summary';
}

function show(id, scroll) {
  if (!TABS.some((t) => t.id === id)) id = defaultTab();
  const changed = currentTab !== id;
  currentTab = id;
  for (const t of TABS) {
    const b = document.getElementById(`tab-${t.id}`);
    const sel = t.id === id;
    b.setAttribute('aria-selected', sel ? 'true' : 'false');
    b.tabIndex = sel ? 0 : -1;
    if (sel && changed) b.scrollIntoView({ block: 'nearest', inline: 'center' });
  }
  app.setAttribute('role', 'tabpanel');
  app.setAttribute('aria-labelledby', `tab-${id}`);
  rerender();
  if (scroll && changed) window.scrollTo({ top: document.querySelector('.tabs').offsetTop, behavior: 'auto' });
}

function rerender() {
  const y = window.scrollY;
  let draw = null;
  app.textContent = '';
  try {
    if (currentTab.startsWith('day-')) {
      const idx = Number(currentTab.slice(4)) - 1;
      const day = DAYS[idx];
      const r = renderDay(day, idx);
      app.append(r.node);
      draw = () => {
        drawRoute(r.mapKey, r.route, { onSelect: (itemId) => {
          const el = document.getElementById(`item-${itemId}`);
          if (el) { el.scrollIntoView({ block: 'center' }); const d = el.querySelector('details'); if (d) d.open = true; }
        } });
        if (r.route.airportLegs.length) drawAirport(`air-${day.date}`, r.route.airportLegs);
      };
    } else if (currentTab === 'bookings') app.append(renderBookings());
    else if (currentTab === 'shopping') app.append(renderShopping());
    else if (currentTab === 'meals') app.append(renderMeals());
    else if (currentTab === 'prep') app.append(renderPrep());
    else app.append(renderSummary());
  } catch (err) {
    console.error(err);
    app.append(h('div', { class: 'notice notice-important' }, h('p', null, '화면을 그리는 중 오류가 났습니다. 준비·유의 탭에서 상태 초기화를 해 보세요.')));
  }
  window.scrollTo(0, y);
  if (draw) {
    try { draw(); } catch (err) { console.warn('지도 그리기 실패', err); }
  }
}

window.addEventListener('hashchange', () => show(location.hash.slice(1), true));
window.addEventListener('resize', () => invalidateAll());
window.addEventListener('storage', (e) => { if (e.key && e.key.startsWith('tokyo-trip-26-10')) { state = loadState(); rerender(); } });

buildTabs();
show(location.hash.slice(1) || defaultTab(), false);

// 테스트용 — 상태와 데이터 노출 (읽기 전용으로 사용)
window.__trip = { get state() { return state; }, KAPITAL_EBISU_IDS };
