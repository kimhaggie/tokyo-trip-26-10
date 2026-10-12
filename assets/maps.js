// Leaflet 지도 — 지도가 실패해도 일정·링크는 그대로 쓸 수 있게 모든 호출을 감싼다.

const TILE_URL = 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION = '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener noreferrer">地理院タイル</a>';

const instances = new Map();

export function mapsAvailable() {
  return typeof window !== 'undefined' && !!window.L && typeof window.L.map === 'function';
}

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

// 지도 컨테이너는 날짜별로 한 번만 만들고, 다시 그릴 때는 레이어만 바꾼다.
export function getMapElement(key, small = false) {
  let inst = instances.get(key);
  if (inst) return inst.wrap;
  const wrap = el('div', 'map-wrap');
  const mapEl = el('div', small ? 'map map-small' : 'map');
  mapEl.setAttribute('role', 'region');
  mapEl.setAttribute('aria-label', small ? '공항 이동 개요 지도' : '방문 순서 지도');
  wrap.appendChild(mapEl);
  inst = { key, wrap, mapEl, map: null, layer: null, tileErrors: 0, tileLoads: 0, notice: null };
  instances.set(key, inst);
  return wrap;
}

function ensureMap(inst) {
  if (inst.map || !mapsAvailable()) return inst.map;
  const L = window.L;
  try {
    inst.map = L.map(inst.mapEl, { scrollWheelZoom: false, tap: true, zoomSnap: 0.5 });
    const tiles = L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION, maxZoom: 18, minZoom: 5 });
    tiles.on('tileerror', () => {
      inst.tileErrors += 1;
      if (inst.tileErrors >= 4 && inst.tileLoads === 0) showTileNotice(inst);
    });
    tiles.on('tileload', () => { inst.tileLoads += 1; });
    tiles.addTo(inst.map);
    inst.layer = L.layerGroup().addTo(inst.map);
  } catch (err) {
    console.warn('지도 초기화 실패', err);
    inst.map = null;
  }
  return inst.map;
}

function showTileNotice(inst) {
  if (inst.notice) return;
  inst.notice = el('p', 'map-fallback notice notice-caution', '지도 타일을 불러오지 못했습니다. 일정·예약·길찾기 링크는 그대로 사용할 수 있어요.');
  inst.notice.style.position = 'absolute';
  inst.notice.style.left = '8px';
  inst.notice.style.right = '8px';
  inst.notice.style.top = '8px';
  inst.notice.style.zIndex = '600';
  inst.wrap.appendChild(inst.notice);
}

function pinIcon(text, kind) {
  const L = window.L;
  const multi = text.length > 2;
  const cls = `pin pin-${kind}${multi ? ' multi' : ''}`;
  const width = multi ? 12 + text.length * 7 : 28;
  const node = el('div', cls, text);
  return L.divIcon({ html: node.outerHTML, className: '', iconSize: [width, 28], iconAnchor: [width / 2, 14], popupAnchor: [0, -12] });
}

function popupNode(marker, onSelect) {
  const box = el('div');
  box.appendChild(el('div', 'popup-title', marker.place.nameKo || marker.place.nameJa));
  if (marker.place.nameJa && marker.place.nameKo) box.appendChild(el('div', 'popup-sub', marker.place.nameJa));
  const names = [...new Set(marker.items.map((i) => i.placeId).filter(Boolean))];
  if (names.length > 1) box.firstChild.textContent = '같은 건물 · 여러 일정';
  const lines = marker.items.map((i) => i.title);
  const uniq = [...new Set(lines)];
  for (const t of uniq) box.appendChild(el('div', 'popup-sub', `· ${t}`));
  if (marker.kind === 'floating') box.appendChild(el('div', 'popup-sub', '선택 전 — 동선에 연결하지 않음'));
  if (marker.place.coordinatePrecision === 'area') box.appendChild(el('div', 'popup-sub', '행사 구역 대표 지점'));
  if (onSelect) {
    const b = el('button', 'btn', '일정에서 보기');
    b.type = 'button';
    b.style.marginTop = '6px';
    b.addEventListener('click', () => onSelect(marker.items[0].id));
    box.appendChild(b);
  }
  return box;
}

// route: logic.computeRoute 결과
export function drawRoute(key, route, { onSelect } = {}) {
  const inst = instances.get(key);
  if (!inst) return false;
  const map = ensureMap(inst);
  if (!map) return false;
  const L = window.L;
  inst.layer.clearLayers();
  const bounds = [];
  for (const seg of route.segments) {
    L.polyline([seg.from, seg.to], seg.dashed
      ? { color: '#3b4675', weight: 2.5, dashArray: '6 6', opacity: 0.9 }
      : { color: '#a8461f', weight: 3, opacity: 0.85 }).addTo(inst.layer);
  }
  inst.markerById = new Map();
  for (const m of route.markers) {
    const text = m.kind === 'hotel' ? 'H' : m.labels.join('·');
    const kind = m.kind === 'hotel' ? 'hotel' : m.kind;
    const mk = L.marker(m.place.coordinates, { icon: pinIcon(text, kind), title: m.place.nameKo || m.place.nameJa, keyboard: true, zIndexOffset: m.kind === 'floating' ? -100 : 0 });
    mk.bindPopup(() => popupNode(m, onSelect));
    mk.addTo(inst.layer);
    for (const it of m.items) inst.markerById.set(it.id, mk);
    bounds.push(m.place.coordinates);
  }
  if (bounds.length === 1) map.setView(bounds[0], 15);
  else if (bounds.length > 1) map.fitBounds(bounds, { padding: [28, 28], maxZoom: 16 });
  else map.setView([35.6762, 139.7503], 12);
  setTimeout(() => map.invalidateSize(), 0);
  return true;
}

export function drawAirport(key, legs) {
  const inst = instances.get(key);
  if (!inst) return false;
  const map = ensureMap(inst);
  if (!map) return false;
  const L = window.L;
  inst.layer.clearLayers();
  const pts = [];
  for (const leg of legs) {
    L.marker(leg.place.coordinates, { icon: pinIcon('공항', 'airport'), title: leg.place.nameKo }).addTo(inst.layer)
      .bindPopup(() => popupNode({ place: leg.place, items: [leg.item], kind: 'core' }));
    pts.push(leg.place.coordinates);
    if (leg.other) {
      const isHotel = leg.other.place.category === 'hotel';
      L.marker(leg.other.place.coordinates, { icon: pinIcon(isHotel ? 'H' : '역', isHotel ? 'hotel' : 'core'), title: leg.other.place.nameKo }).addTo(inst.layer);
      L.polyline([leg.place.coordinates, leg.other.place.coordinates], { color: '#3b4675', weight: 2.5, dashArray: '6 6' }).addTo(inst.layer);
      pts.push(leg.other.place.coordinates);
    }
  }
  if (pts.length > 1) map.fitBounds(pts, { padding: [44, 44] });
  else if (pts.length === 1) map.setView(pts[0], 10);
  setTimeout(() => map.invalidateSize(), 0);
  return true;
}

export function focusOnItem(key, itemId) {
  const inst = instances.get(key);
  if (!inst || !inst.map || !inst.markerById) return false;
  const mk = inst.markerById.get(itemId);
  if (!mk) return false;
  inst.map.setView(mk.getLatLng(), Math.max(inst.map.getZoom(), 15));
  mk.openPopup();
  return true;
}

export function invalidateAll() {
  for (const inst of instances.values()) {
    if (inst.map && inst.wrap.isConnected) inst.map.invalidateSize();
  }
}
