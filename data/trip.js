// 도쿄 4박 5일 일정 데이터 — 모든 화면(일정표·지도·예약·쇼핑·식사)이 이 파일 하나를 읽는다.
// 시간 성격(time.nature): fixed=예약/항공 고정, target=목표, estimated=예상, flexible=유동
// 방문 우선순위(priority): core=본 일정, optional=선택, backup=대안
// 예약 상태(reservation.status): confirmed, walk_in, not_reserved, not_applicable
// 장소 정보(주소·좌표·영업시간)는 data/places.js, 출처는 data/sources.js

export const TRIP = {
  title: '도쿄 4박 5일',
  subtitle: '가을의 도쿄 — 커피와 책, 옷과 생활용품, 음악과 야간 미술',
  startDate: '2026-10-29',
  endDate: '2026-11-02',
  nights: 4,
  timezone: 'Asia/Tokyo',
  utcOffset: '+09:00',
  party: '혼자 여행',
  hotelId: 'rose-stay-shiba-park',
  airportId: 'narita-airport',
  arrival: { date: '2026-10-29', time: '17:40', at: '2026-10-29T17:40:00+09:00', airportId: 'narita-airport' },
  departure: { date: '2026-11-02', time: '18:55', at: '2026-11-02T18:55:00+09:00', airportId: 'narita-airport' },
  // 항공사·편명·터미널은 제공되지 않았다. 임의로 채우지 않는다.
  flightDetails: null,
  transport: '대중교통·도보 중심, 심야에는 필요하면 택시 검토 (렌터카 없음)',
  source: 'user_confirmed',
};

// 실제 예약 완료 3건 — 사용자가 직접 확인한 사실. 시간·인원·좌석을 바꾸지 않는다.
export const BOOKINGS = [
  {
    id: 'bk-kawakamian',
    placeId: 'kawakamian-aoyama',
    date: '2026-10-30',
    time: '18:30',
    at: '2026-10-30T18:30:00+09:00',
    party: 1,
    method: '전화 예약',
    seat: null,
    status: 'confirmed',
    summary: '18:30 · 1명 · 전화 예약 완료',
    notes: [
      '카운터/창가 등 좌석은 확인되지 않음',
      '블루노트 이동을 위해 19:20~19:25경 나오는 것이 목표 — 식당이 이 시간까지 제공을 보장한 것은 아님',
    ],
    source: 'user_confirmed',
  },
  {
    id: 'bk-bluenote',
    placeId: 'bluenote-tokyo',
    date: '2026-10-30',
    time: '19:45',
    at: '2026-10-30T19:45:00+09:00',
    showTime: '20:30',
    showAt: '2026-10-30T20:30:00+09:00',
    party: null,
    method: null,
    seat: null,
    status: 'confirmed',
    summary: '19:45 입장 · 20:30 공연 · 예약 완료',
    notes: ['공연명·티켓 등급·좌석번호·종료 시각은 제공되지 않음', '식사는 가와카미안에서, 여기서는 음료 정도'],
    source: 'user_confirmed',
  },
  {
    id: 'bk-kikukawa',
    placeId: 'kikukawa-ebisu',
    date: '2026-10-31',
    time: '20:00',
    at: '2026-10-31T20:00:00+09:00',
    party: 1,
    method: '전화 예약',
    seat: '카운터석',
    status: 'confirmed',
    summary: '20:00 · 1명 · 카운터석 · 전화 예약 완료',
    notes: ['창가석 예약이 아님 — 카운터석에서 창가 전망이 보장되지 않음', '1인에게 창가를 배정하지 않은 사유는 확정되지 않음'],
    source: 'user_confirmed',
  },
];

// 여행 중 직접 사거나 예약할 것 / 확인할 것
export const PREP = [
  { id: 'prep-nex', title: "귀국 N'EX 예약", status: 'todo_during_trip', label: '여행 중 예약 예정', detail: '목표: 11/2 도쿄역 15:30~16:00 전후 탑승 후보. 열차는 아직 정하지 않음. 항공사·터미널·실제 도착 시각을 확인해 공항에 16:55보다 여유 있게 닿는 편을 우선 고른다.', placeId: 'tokyo-station', sourceIds: ['src-nex', 'src-narita-dep'] },
  { id: 'prep-museum', title: '신시내티 미술관전 입장권', status: 'buy_on_site', label: '현장 구매 (결정됨)', detail: '할인 이점이 없어 미리 사지 않고 현장에서 구매하기로 함. 날짜·시간 지정 예약이 필요 없다는 공식 안내 확인.', placeId: 'ueno-royal-museum', sourceIds: ['src-cincinnati-ticket'] },
  { id: 'prep-luggage', title: '도쿄역 짐 보관', status: 'undecided', label: '방식·장소 미정', detail: '11/2 오전에 맡기고 오후에 찾을 계획. 코인로커가 비어 있다고 가정하지 않음. 정해지면 아래 메모에 개찰구 안/밖·층·출구·반환 시각을 적어 둔다.', placeId: 'tokyo-station', sourceIds: ['src-gransta-cloak'] },
  { id: 'prep-sbth007', title: 'SEIKO SBTH007', status: 'unknown', label: '재고·구매 여부 미정', detail: '빅카메라 신주쿠 동쪽 출구점에서 실물 확인·구매 후보. 재고는 확인하지 않았음.', placeId: 'biccamera-shinjuku-east' },
  { id: 'prep-lolo', title: 'LOLO 10/31 영업', status: 'needs_verification', label: '해당일 영업 확인 필요', detail: '토요일 방문 전에 영업일·시간을 확인한다.', placeId: 'lolo' },
  { id: 'prep-goodon', title: 'Good On 여름 상품 재고', status: 'optional', label: '선택 준비', detail: '원하는 여름 상품이 있다면 미리 재고를 문의하면 도움이 됨. 시즌오프 재고는 확정할 수 없음.', placeId: 'good-on-flagship' },
  { id: 'prep-artnight', title: '롯폰기 아트 나이트', status: 'undecided', label: '볼 프로그램·귀환 방법 미정', detail: '실제로 볼 작품 3~4개는 아직 고르지 않음. 자정 이후 귀환은 당일 막차를 확인하거나 택시. 티켓 구매를 필수 준비로 두지 않는다.', placeId: 'roppongi-art-night', sourceIds: ['src-artnight'] },
];

// 사용자가 사거나 찾고 싶은 품목 — "방문 완료"와 별개로 "구매 완료"를 체크한다.
export const WISHLIST = [
  { id: 'wish-sbth007', title: 'SEIKO SBTH007 (시계)', placeIds: ['biccamera-shinjuku-east'], note: '실물 확인·구매 후보. 재고 미확인.' },
  { id: 'wish-mug', title: '회사용 머그컵 / 커피용품', placeIds: ['kinto-store-tokyo', 'yamamoto-coffee-shinjuku', 'sml', 'hakusan-shop', 'spiral-market'], note: '꼭 한 곳에서 살 필요는 없음.' },
  { id: 'wish-yukiguni', title: '가와바타 야스나리 『雪国』 일본어판', placeIds: ['kanda-furuhon-matsuri'], note: '현행 신초문고 표지도, 상태 좋은 구판도 좋음. 특정 판본·가격은 조건이 아님.' },
];

// 하루 단위 일정. items 배열 순서가 곧 일정표 순서다.
// time.at / time.endAt 은 정렬·“현재 시간대 계획” 판단용 ISO(+09:00). 값이 없으면 시간 미정.
export const DAYS = [
  {
    date: '2026-10-29',
    title: '도착 · 시바 · Tekka',
    summary: '나리타 17:40 도착 → 숙소 체크인 → Tekka 본점 저녁',
    areas: ['나리타', '시바공원', '시바'],
    route: '나리타공항 → 숙소 체크인 → Tekka 본점 → 숙소',
    notes: [
      '도쿄 점심 없음 · 첫날 쇼핑 없음 · 하네다 아님',
      'Tekka가 이날의 이자카야 저녁이다. Tekka 후 다른 이자카야로 옮기는 일정이 아니다.',
    ],
    warnings: [],
    items: [
      { id: 'd1-arrive', placeId: 'narita-airport', kind: 'airport', title: '나리타공항 도착', time: { text: '17:40', at: '2026-10-29T17:40:00+09:00', nature: 'fixed' }, priority: 'core', reservation: { status: 'not_applicable' }, memo: ['사용자 항공 일정 (항공사·편명·터미널 미제공)'] },
      { id: 'd1-transfer', placeId: null, kind: 'move', title: '입국·수하물 → 도쿄 이동 → 체크인', time: { text: '도착 이후', nature: 'estimated' }, priority: 'core', reservation: { status: 'not_applicable' }, memo: ['이동시간 미확정. 입국 심사·수하물 상황에 따라 달라짐.'] },
      { id: 'd1-checkin', placeId: 'rose-stay-shiba-park', kind: 'hotel', title: '숙소 체크인', time: { text: '이동 후', nature: 'estimated' }, priority: 'core', reservation: { status: 'not_applicable' }, memo: [] },
      { id: 'd1-tekka', placeId: 'tekka', kind: 'meal', meal: 'dinner', title: 'Tekka 본점 저녁', time: { text: '20:30~21:00 전후부터', at: '2026-10-29T20:30:00+09:00', nature: 'target' }, priority: 'core', reservation: { status: 'not_reserved', note: '항공·입국·체크인 때문에 도착 시각이 애매해 예약하지 않기로 함' }, memo: ['꼬치·모츠야키·내장구이·조림 같은 안주와 맥주 한 잔 — 이번 여행의 주요 음주 계획', '다른 후보를 검토한 뒤 “그냥 Tekka가 제일 좋아 보인다”고 고른 곳'] },
      { id: 'd1-return', placeId: 'rose-stay-shiba-park', kind: 'hotel', title: '숙소 복귀', time: { text: '식사 후', nature: 'flexible' }, priority: 'core', reservation: { status: 'not_applicable' }, memo: [] },
    ],
  },
  {
    date: '2026-10-30',
    title: '긴자 · 유라쿠초 · 마루노우치 · 시부야 · 아오야마',
    summary: '아오키 오픈런 → 람브르 → 쇼핑 → 가와카미안 18:30 → 블루노트 20:30',
    areas: ['긴자', '유라쿠초', '마루노우치', '시부야', '아오야마'],
    route: '숙소 → 아오키 긴자8초메 → 람브르 → [긴자 옵션] → STEVEN ALAN → RRL 한큐 → BEAMS PLUS → BEAMS MEN → [카페·아오야마 옵션] → 가와카미안 → Blue Note → 숙소',
    notes: [
      '옵션을 하나도 넣지 않은 기준 시간표다. 옵션을 넣으면 뒤 시간이 밀린다.',
      '점심(아오키) → 커피(람브르) 순서.',
      '아오키 대기나 람브르 입장이 늦어지면 옵션부터 줄인다.',
      'RRL 오모테산도 플래그십을 일부러 들르지 않는다. BEAMS 쇼핑보다 우선하지 않는다.',
      '이토야는 월요일로 옮긴 상태.',
    ],
    warnings: [
      { id: 'w-halloween-fri', level: 'caution', text: '10/30 저녁 시부야 할로윈 혼잡·교통 대책 가능성. 시부야 → 아오야마 이동에 여유를 둔다.', sourceIds: ['src-shibuya-halloween'] },
    ],
    items: [
      { id: 'd2-depart', placeId: 'rose-stay-shiba-park', kind: 'hotel', title: '숙소 출발', time: { text: '이동 확인 후', nature: 'flexible' }, priority: 'core', reservation: { status: 'not_applicable' }, memo: ['출발 시각은 아오키 10:20~10:30 도착 목표에 맞춰 당일 확인'] },
      { id: 'd2-aoki', placeId: 'aoki-ginza8', kind: 'meal', meal: 'lunch', title: '아오키 긴자 8초메 — 돈카츠', time: { text: '10:20~10:30 도착 목표 · 11:00~11:50 전후 식사', at: '2026-10-30T10:20:00+09:00', endAt: '2026-10-30T11:50:00+09:00', nature: 'target' }, priority: 'core', reservation: { status: 'walk_in', note: '오픈런 현장 대기 (예약 아님)' }, memo: ['4초메점과 다른 지점', '관심 메뉴: 林SPF 로스 계열 + 소금 (주문 확정 아님)', '첫 회차 입장을 가정한 시간 — 보장 아님'] },
      { id: 'd2-lambre', placeId: 'lambre', kind: 'cafe', meal: 'cafe', title: '카페 드 람브르 — 커피·독서', time: { text: '12:00~13:00 전후', at: '2026-10-30T12:00:00+09:00', endAt: '2026-10-30T13:00:00+09:00', nature: 'estimated' }, priority: 'core', reservation: { status: 'walk_in' }, memo: ['점심 후 커피. 한 시간 정도 읽는 것이 목표', '만석·이용 규칙은 현장 변수', '오전 조식 카페로 앞당기지 않는다'] },
      { id: 'd2-opt-uniqlo', placeId: 'uniqlo-ginza', kind: 'shop', title: '유니클로 긴자', time: { text: '시간이 남으면', nature: 'flexible' }, priority: 'optional', optionGroup: 'fri-ginza', reservation: { status: 'not_applicable' }, shopping: { purpose: '꼭 볼 상품이 있을 때만', mondayOk: true }, memo: ['안 보면 월요일 또는 생략'] },
      { id: 'd2-opt-kapital-ginza', placeId: 'kapital-ginza', kind: 'shop', title: 'KAPITAL 긴자 (센추리 데님)', time: { text: '시간이 남으면', nature: 'flexible' }, priority: 'optional', optionGroup: 'fri-ginza', reservation: { status: 'not_applicable' }, shopping: { purpose: '센추리 데님 중심 매장 구경', mondayOk: true }, memo: ['금요일엔 선택. 시간이 없으면 월요일', '에비스 캐피탈 3곳과 다른 네 번째 매장'] },
      { id: 'd2-steven-alan', placeId: 'steven-alan-yurakucho', kind: 'shop', title: 'STEVEN ALAN 유라쿠초', time: { text: '13:00~14:20 (RRL 포함, 이동 포함)', at: '2026-10-30T13:00:00+09:00', nature: 'estimated' }, priority: 'core', reservation: { status: 'not_applicable' }, shopping: { purpose: '여름 상의·셔츠·가벼운 팬츠', mondayOk: false }, memo: ['의류 쇼핑 본 일정 — 빼먹지 않기', '매장당 20~30분 기준'] },
      { id: 'd2-rrl', placeId: 'rrl-hankyu-mens', kind: 'shop', title: 'RRL — 한큐 맨즈 도쿄', time: { text: '~14:20', endAt: '2026-10-30T14:20:00+09:00', nature: 'estimated' }, priority: 'core', reservation: { status: 'not_applicable' }, shopping: { purpose: '옷과 분위기 먼저 보기', mondayOk: false }, memo: ['오모테산도 플래그십을 경유하지 않는다', '정말 마음에 들면 다른 날 오모테산도를 생각해 볼 수 있다는 정도', '층수·면세 절차는 현장 확인'] },
      { id: 'd2-beams-plus', placeId: 'beams-plus-marunouchi', kind: 'shop', title: 'BEAMS PLUS 마루노우치', time: { text: '14:35~15:05', at: '2026-10-30T14:35:00+09:00', endAt: '2026-10-30T15:05:00+09:00', nature: 'estimated' }, priority: 'core', important: true, reservation: { status: 'not_applicable' }, shopping: { purpose: '꼭 방문 — 셔츠·팬츠', mondayOk: false }, memo: ['매우 높은 우선순위', 'BEAMS HOUSE 마루노우치와 다른 매장'] },
      { id: 'd2-move-shibuya', placeId: null, kind: 'move', title: '시부야 방향 이동', time: { text: '15:05~15:50', at: '2026-10-30T15:05:00+09:00', endAt: '2026-10-30T15:50:00+09:00', nature: 'estimated' }, priority: 'core', reservation: { status: 'not_applicable' }, memo: ['전철·도보 포함 여유'] },
      { id: 'd2-beams-men', placeId: 'beams-men-shibuya', kind: 'shop', title: 'BEAMS MEN 시부야', time: { text: '15:50~16:20', at: '2026-10-30T15:50:00+09:00', endAt: '2026-10-30T16:20:00+09:00', nature: 'estimated' }, priority: 'core', important: true, reservation: { status: 'not_applicable' }, shopping: { purpose: '꼭 방문 — 의류', mondayOk: false }, memo: ['매우 높은 우선순위'] },
      { id: 'd2-free-block', placeId: null, kind: 'flex', title: '선택 카페·생활용품 + 아오야마 이동', time: { text: '16:20~18:15', at: '2026-10-30T16:20:00+09:00', endAt: '2026-10-30T18:15:00+09:00', nature: 'flexible' }, priority: 'core', reservation: { status: 'not_applicable' }, memo: ['아래 옵션은 하나도 안 해도 된다', '18:30 예약을 밀면서까지 전부 방문하지 않는다'] },
      { id: 'd2-opt-hatou', placeId: 'chatei-hatou', kind: 'cafe', meal: 'cafe', title: '차테이 하토우', time: { text: '자리가 있으면', nature: 'flexible' }, priority: 'optional', optionGroup: 'fri-cafe', reservation: { status: 'walk_in' }, memo: ['하토우·Satella 중 하나 또는 둘 다 생략 — 둘 다 가는 일정이 아님', '조용한 독서가 가능하다고 보장하지 않음'] },
      { id: 'd2-opt-satella', placeId: 'satella', kind: 'cafe', meal: 'cafe', title: '킷사 사테라 (Satella)', time: { text: '자리가 있으면', nature: 'flexible' }, priority: 'optional', optionGroup: 'fri-cafe', reservation: { status: 'walk_in' }, memo: ['지난 방문이 좋았던 카페', '카페다 — 의류 매장 아님'] },
      { id: 'd2-opt-spiral', placeId: 'spiral-market', kind: 'shop', title: 'Spiral Market', time: { text: '저녁 전 시간이 남으면', nature: 'flexible' }, priority: 'optional', optionGroup: 'fri-aoyama', reservation: { status: 'not_applicable' }, shopping: { purpose: '생활용품 구경', mondayOk: false }, memo: ['스파이럴 건물 2층 생활용품 매장'] },
      { id: 'd2-opt-hakusan', placeId: 'hakusan-shop', kind: 'shop', title: 'HAKUSAN SHOP (백산도기 쇼룸)', time: { text: '저녁 전 시간이 남으면', nature: 'flexible' }, priority: 'optional', optionGroup: 'fri-aoyama', reservation: { status: 'not_applicable' }, shopping: { purpose: '도자기·그릇 구경', mondayOk: false }, memo: ['白山陶器 도쿄 쇼룸 — HAKUSAN MEGANE 안경점이 아님'] },
      { id: 'd2-kawakamian', placeId: 'kawakamian-aoyama', bookingId: 'bk-kawakamian', kind: 'meal', meal: 'dinner', title: '아오야마 가와카미안 — 닭 숯불구이 + 세이로', time: { text: '18:30', at: '2026-10-30T18:30:00+09:00', nature: 'fixed' }, priority: 'core', reservation: { status: 'confirmed', note: '18:30 · 1명 · 전화 예약 완료' }, memo: ['닭다리 숯불구이 + 세이로 계획', '술은 필수 주문 아님', '19:20~19:25경 출발 목표 — 예약된 퇴장 시간이 아님'] },
      { id: 'd2-bluenote', placeId: 'bluenote-tokyo', bookingId: 'bk-bluenote', kind: 'event', title: 'Blue Note Tokyo', time: { text: '19:45 입장 · 20:30 공연', at: '2026-10-30T19:45:00+09:00', nature: 'fixed' }, priority: 'core', reservation: { status: 'confirmed', note: '19:45 입장 · 20:30 공연 · 예약 완료' }, memo: ['음료 정도 (식사 추가 없음, 음료 종류는 정하지 않음)', '공연명·좌석·종료 시각 미제공', '에비스 BLUE NOTE PLACE가 아님'] },
      { id: 'd2-return', placeId: 'rose-stay-shiba-park', kind: 'hotel', title: '숙소 복귀', time: { text: '공연 후', nature: 'flexible' }, priority: 'core', reservation: { status: 'not_applicable' }, memo: ['공연 종료 시각 미확정'] },
    ],
  },
  {
    date: '2026-10-31',
    title: '신주쿠 · 나카메구로 · 다이칸야마 · 에비스 · 롯폰기',
    summary: '후운지 오픈런 → 다지마야 → 쇼핑 13곳 → 기쿠카와 20:00 → (아트 나이트)',
    areas: ['신주쿠', '나카메구로', '다이칸야마', '에비스', '롯폰기'],
    route: '숙소 → 후운지 → 다지마야 → 신주쿠 4곳 → LOLO → KINTO → SML → Jackman → Good On → YAECA → KAPITAL 에비스 3곳 → 기쿠카와 → (아트 나이트) → 숙소',
    notes: [
      '가장 촘촘한 날. 시간표는 확정 도착 시각이 아니라 목표다.',
      '점심(후운지) → 커피·독서(다지마야) 순서.',
      '쇼핑 총 13곳 (캐피탈 3곳 제외 10곳). 식당·킷사텐·야간 행사는 개수에 넣지 않음.',
      '폐점이 빠른 KINTO·Jackman과 월요일 휴무일 수 있는 매장을 우선한다.',
      '시간이 모자라면 먼저 캐피탈을 월요일로 넘긴다. 필수 매장을 임의로 지우지 않는다.',
    ],
    warnings: [
      { id: 'w-sat-close', level: 'caution', text: '토요일 일부 매장은 18시 전후에 닫는다(공식 영업시간은 각 카드 참고). 늦어지면 캐피탈부터 월요일로 넘긴다.' },
      { id: 'w-halloween-sat', level: 'caution', text: '10/31 밤 시부야 일대 할로윈 교통 대책 가능성. 에비스·롯폰기 이동에 여유를 둔다.', sourceIds: ['src-shibuya-halloween'] },
      { id: 'w-route-unverified', level: 'info', text: '신주쿠 → 나카메구로 등 실제 이동 경로·소요 시간은 확인하지 않았다. 구간별 길찾기 링크로 당일 확인.' },
    ],
    items: [
      { id: 'd3-depart', placeId: 'rose-stay-shiba-park', kind: 'hotel', title: '숙소 출발', time: { text: '이동 확인 후', nature: 'flexible' }, priority: 'core', reservation: { status: 'not_applicable' }, memo: [] },
      { id: 'd3-fuunji', placeId: 'fuunji', kind: 'meal', meal: 'lunch', title: '후운지 신주쿠 본점 — 츠케멘', time: { text: '10:30 전후 대기 · 11:00~11:50 전후 식사', at: '2026-10-31T10:30:00+09:00', endAt: '2026-10-31T11:50:00+09:00', nature: 'target' }, priority: 'core', reservation: { status: 'walk_in', note: '오픈런 (예약 없음)' }, memo: ['첫 회차 입장 가정 — 보장 아님', '멘야무사시로 바꾸지 않음'] },
      { id: 'd3-tajimaya', placeId: 'tajimaya-honten', kind: 'cafe', meal: 'cafe', title: '다지마야커피 본점 — 식후 독서', time: { text: '12:10~13:00 전후', at: '2026-10-31T12:10:00+09:00', endAt: '2026-10-31T13:00:00+09:00', nature: 'estimated' }, priority: 'core', reservation: { status: 'walk_in' }, memo: ['람브르 대신 고른 토요일 카페', '조용함을 보장하지 않음', '야마모토 커피(쇼핑)와 다른 곳'] },
      { id: 'd3-yamamoto', placeId: 'yamamoto-coffee-shinjuku', kind: 'shop', title: '야마모토 커피 — 원두·커피 도구', time: { text: '13:00~15:00 (신주쿠 4곳)', at: '2026-10-31T13:00:00+09:00', nature: 'target' }, priority: 'core', reservation: { status: 'not_applicable' }, shopping: { purpose: '원두·커피 도구 쇼핑', mondayOk: false, saturdayCount: true }, memo: ['쇼핑 매장 — 다지마야 커피 한 잔으로 대체하지 않음'] },
      { id: 'd3-bic', placeId: 'biccamera-shinjuku-east', kind: 'shop', title: '빅카메라 신주쿠 동쪽 출구점 — SBTH007', time: { text: '신주쿠 4곳 중', nature: 'target' }, priority: 'core', reservation: { status: 'not_applicable' }, shopping: { purpose: 'SEIKO SBTH007 실물 확인·구매 후보', mondayOk: false, saturdayCount: true, wishId: 'wish-sbth007' }, memo: ['재고 미확인 — 구매 확정 아님', '면세·밴드 조정·결제까지 하면 30분보다 더 걸릴 수 있음', '금요일 유라쿠초점으로 바꾸지 않음'] },
      { id: 'd3-beams-japan', placeId: 'beams-japan-shinjuku', kind: 'shop', title: 'BEAMS JAPAN 신주쿠', time: { text: '신주쿠 4곳 중', nature: 'target' }, priority: 'core', reservation: { status: 'not_applicable' }, shopping: { purpose: '의류·공예·생활잡화', mondayOk: false, saturdayCount: true }, memo: ['여러 층을 다 보면 일반 매장보다 오래 걸릴 수 있음'] },
      { id: 'd3-fenest', placeId: 'fenest', kind: 'shop', title: 'FENEST', time: { text: '~15:00 목표', endAt: '2026-10-31T15:00:00+09:00', nature: 'target' }, priority: 'core', reservation: { status: 'not_applicable' }, shopping: { purpose: '필수 방문', mondayOk: false, saturdayCount: true }, memo: ['신주쿠교엔 방향 — 교엔 산책·입장을 추가하는 뜻이 아님'] },
      { id: 'd3-move-nakameguro', placeId: null, kind: 'move', title: '나카메구로 · LOLO 쪽 이동', time: { text: '15:00~15:40·45', at: '2026-10-31T15:00:00+09:00', nature: 'estimated' }, priority: 'core', reservation: { status: 'not_applicable' }, memo: ['실제 경로 확인 필요'] },
      { id: 'd3-lolo', placeId: 'lolo', kind: 'shop', title: 'LOLO', time: { text: '15:40·45~16:30 (KINTO 포함)', at: '2026-10-31T15:40:00+09:00', nature: 'estimated' }, priority: 'core', reservation: { status: 'not_applicable' }, shopping: { purpose: '예전에 사서 만족한 브랜드', mondayOk: false, saturdayCount: true }, memo: ['해당일 영업 확인 필요'] },
      { id: 'd3-kinto', placeId: 'kinto-store-tokyo', kind: 'shop', title: 'KINTO STORE Tokyo', time: { text: '~16:30 전후', endAt: '2026-10-31T16:30:00+09:00', nature: 'estimated' }, priority: 'core', reservation: { status: 'not_applicable' }, shopping: { purpose: '회사용 머그·커피용품·생활용품', mondayOk: false, saturdayCount: true, wishId: 'wish-mug' }, memo: ['나카메구로 쪽 — 에비스역 옆 아님', '토요일 폐점이 이른 편 — 우선'] },
      { id: 'd3-sml', placeId: 'sml', kind: 'shop', title: 'SML (이전한 다이칸야마·에비스니시 매장)', time: { text: '16:45~17:05 전후', at: '2026-10-31T16:45:00+09:00', endAt: '2026-10-31T17:05:00+09:00', nature: 'estimated' }, priority: 'core', reservation: { status: 'not_applicable' }, shopping: { purpose: '그릇·민예·생활공예', mondayOk: false, saturdayCount: true }, memo: ['예전 나카메구로 매장이 아님'] },
      { id: 'd3-jackman', placeId: 'jackman-ebisu', kind: 'shop', title: 'Jackman 에비스', time: { text: '17:20~ (Good On 포함 ~18:10)', at: '2026-10-31T17:20:00+09:00', nature: 'estimated' }, priority: 'core', reservation: { status: 'not_applicable' }, shopping: { purpose: '의류', mondayOk: false, saturdayCount: true }, memo: ['에비스 도착 후 우선 — 폐점이 이른 편'] },
      { id: 'd3-goodon', placeId: 'good-on-flagship', kind: 'shop', title: 'Good On 플래그십', time: { text: '~18:10 전후', endAt: '2026-10-31T18:10:00+09:00', nature: 'estimated' }, priority: 'core', reservation: { status: 'not_applicable' }, shopping: { purpose: '티셔츠 등 기본 의류', mondayOk: false, saturdayCount: true }, memo: ['혼잡하면 응대 대기 가능', '여름 상품 재고 확정 아님'] },
      { id: 'd3-yaeca', placeId: 'yaeca-ebisu', kind: 'shop', title: 'YAECA 에비스', time: { text: '18:10~18:35 전후', at: '2026-10-31T18:10:00+09:00', endAt: '2026-10-31T18:35:00+09:00', nature: 'estimated' }, priority: 'core', reservation: { status: 'not_applicable' }, shopping: { purpose: '의류', mondayOk: false, saturdayCount: true }, memo: ['다른 YAECA 지점과 혼동 금지'] },
      { id: 'd3-kapital-naked', placeId: 'kapital-naked', kind: 'shop', title: 'KAPITAL TOKYO NAKED STORE', time: { text: '18:35~19:30 (캐피탈 3곳)', at: '2026-10-31T18:35:00+09:00', nature: 'estimated' }, priority: 'core', kapitalEbisu: true, reservation: { status: 'not_applicable' }, shopping: { purpose: '방문 목표 · 못 보면 월요일로', mondayOk: true, saturdayCount: true }, memo: ['억지로 완주하지 않는다 — 못 본 매장만 월요일로'] },
      { id: 'd3-kapital-legs', placeId: 'kapital-legs', kind: 'shop', title: 'KAPITAL Legs Craftsman Store', time: { text: '캐피탈 3곳 중', nature: 'estimated' }, priority: 'core', kapitalEbisu: true, reservation: { status: 'not_applicable' }, shopping: { purpose: '방문 목표 · 못 보면 월요일로', mondayOk: true, saturdayCount: true }, memo: [] },
      { id: 'd3-kapital-duffle', placeId: 'kapital-duffle', kind: 'shop', title: 'Duffle with KAPITAL', time: { text: '~19:30', endAt: '2026-10-31T19:30:00+09:00', nature: 'estimated' }, priority: 'core', kapitalEbisu: true, reservation: { status: 'not_applicable' }, shopping: { purpose: '방문 목표 · 못 보면 월요일로', mondayOk: true, saturdayCount: true }, memo: [] },
      { id: 'd3-move-garden', placeId: null, kind: 'move', title: '에비스 가든플레이스로 이동', time: { text: '19:30~20:00', at: '2026-10-31T19:30:00+09:00', nature: 'estimated' }, priority: 'core', reservation: { status: 'not_applicable' }, memo: ['38층 — 엘리베이터 포함 여유'] },
      { id: 'd3-kikukawa', placeId: 'kikukawa-ebisu', bookingId: 'bk-kikukawa', kind: 'meal', meal: 'dinner', title: '우나기 시다이메 기쿠카와 — 히츠마부시', time: { text: '20:00', at: '2026-10-31T20:00:00+09:00', nature: 'fixed' }, priority: 'core', reservation: { status: 'confirmed', note: '20:00 · 1명 · 카운터석 · 전화 예약 완료' }, memo: ['메뉴는 당일 선택 (잇폰 히츠마부시가 관심 메뉴 — 확정 아님)', '카운터석 — 창가 전망 보장 없음'] },
      { id: 'd3-move-roppongi', placeId: null, kind: 'move', title: '롯폰기로 이동 (아트 나이트 갈 때)', time: { text: '21:30~22:00 전후', at: '2026-10-31T21:30:00+09:00', nature: 'estimated' }, priority: 'optional', choice: { group: 'artNight', value: 'go' }, reservation: { status: 'not_applicable' }, memo: [] },
      { id: 'd3-artnight', placeId: 'roppongi-art-night', kind: 'event', title: '롯폰기 아트 나이트 2026', time: { text: '22:00 ~ 일요일 00:00 전후', at: '2026-10-31T22:00:00+09:00', endAt: '2026-11-01T00:00:00+09:00', nature: 'flexible', crossesMidnight: true }, priority: 'optional', choice: { group: 'artNight', value: 'go' }, reservation: { status: 'not_applicable', note: '예약된 일정이 아님 — 체력이 남으면' }, memo: ['기쿠카와 식사 후 약 2시간 경험 (밤샘 완주 아님 — 다음날 이세야 오픈런)', '롯폰기 힐즈·미드타운 주변 설치미술/프로그램. 볼 작품은 아직 미선정', '모든 프로그램이 06시까지 열리거나 전부 무료라고 보장하지 않음', '모리미술관·시티뷰 입장은 자동으로 넣지 않음'] },
      { id: 'd3-return', placeId: 'rose-stay-shiba-park', kind: 'hotel', title: '숙소 복귀', time: { text: '자정 전후 이후', nature: 'flexible' }, priority: 'core', reservation: { status: 'not_applicable' }, memo: ['자정 이후 지하철이 당연히 다닌다고 가정하지 않음 — 당일 막차 확인 또는 택시'] },
    ],
  },
  {
    date: '2026-11-01',
    title: '우에노 · 진보초 고서축제 · 저녁 양자택일',
    summary: '도테노 이세야 오픈런 → 신시내티전 → 진보초 고서축제·밀롱가 → 아키요시 또는 마루쇼',
    areas: ['미노와·니혼즈츠미', '우에노', '진보초', '우에노/혼고'],
    route: '숙소 → 도테노 이세야 → 우에노의 숲 미술관 → 진보초 (고서축제·밀롱가) → 아키요시 또는 마루쇼 → 숙소',
    notes: [
      '토요일에 못 본 캐피탈을 일요일에 넣지 않는다 — 월요일 보충.',
      '진보초는 “책 먼저 / 카페 먼저”를 내가 고른다. 자동 판단하지 않는다.',
      '저녁은 아키요시와 마루쇼 중 한 곳. 둘 다 먹는 계획이 아니다.',
    ],
    warnings: [
      { id: 'w-festival-end', level: 'important', text: '고서축제는 11/1이 마지막 날, 17시 종료. 진보초 도착이 늦으면 축제를 먼저.', sourceIds: ['src-furuhon-jimbou', 'src-furuhon-chiyoda'] },
      { id: 'w-festival-rain', level: 'info', text: '야외 판매는 비의 영향을 받을 수 있다 — 공식 공지 확인.', sourceIds: ['src-furuhon-jimbou'] },
    ],
    items: [
      { id: 'd4-depart', placeId: 'rose-stay-shiba-park', kind: 'hotel', title: '숙소 출발', time: { text: '이동 확인 후', nature: 'flexible' }, priority: 'core', reservation: { status: 'not_applicable' }, memo: [] },
      { id: 'd4-iseya', placeId: 'dote-no-iseya', kind: 'meal', meal: 'lunch', title: '도테노 이세야 — 텐동', time: { text: '10:30 전후 도착 목표 · 11:00~12:00 전후 식사', at: '2026-11-01T10:30:00+09:00', endAt: '2026-11-01T12:00:00+09:00', nature: 'target' }, priority: 'core', reservation: { status: 'walk_in', note: '오픈런 현장 대기 (예약 아님)' }, memo: ['긴자 텐쿠니 대신 고른 곳', '첫 회차 입장 보장 없음'] },
      { id: 'd4-museum', placeId: 'ueno-royal-museum', kind: 'event', title: '신시내티 미술관전 — 우에노의 숲 미술관', time: { text: '12:40~14:10·14:30', at: '2026-11-01T12:40:00+09:00', endAt: '2026-11-01T14:30:00+09:00', nature: 'estimated' }, priority: 'core', reservation: { status: 'not_reserved', note: '입장권 현장 구매로 결정' }, memo: ['シンシナティ美術館展 ～アメリカに渡ったヨーロッパの至宝～', '약 1.5~2시간', '미리 사지 않기로 최종 결정 — 할인 이점 없음'] },
      { id: 'd4-jimbocho', placeId: null, kind: 'flex', flexBlock: 'jimbocho', title: '진보초 유동 블록 — 고서축제 · 밀롱가', time: { text: '15:00 전후 ~ 18:00·18:30 전후', at: '2026-11-01T15:00:00+09:00', endAt: '2026-11-01T18:30:00+09:00', nature: 'flexible' }, priority: 'core', reservation: { status: 'not_applicable' }, memo: ['밀롱가에 자리가 있고 축제 볼 시간이 남으면 카페 먼저 가능', '만석이면 고서축제부터', '도착이 늦었으면 17시에 끝나는 축제를 우선', '끝내 카페에 못 들어가면 커피 생략/현장 판단 — 다른 카페를 자동으로 넣지 않음'] },
      { id: 'd4-festival', placeId: 'kanda-furuhon-matsuri', kind: 'event', flexMember: 'jimbocho', title: '칸다 고서축제 (제66회)', time: { text: '15:00 전후 ~ 17:00 (종료)', at: '2026-11-01T15:00:00+09:00', endAt: '2026-11-01T17:00:00+09:00', nature: 'flexible' }, priority: 'core', reservation: { status: 'not_applicable' }, shopping: { purpose: '『雪国』 일본어 원서 찾기', mondayOk: false, wishId: 'wish-yukiguni' }, memo: ['점포 하나가 아니라 진보초 고서점가 구역 행사', '특정 판본·가격·재고는 조건이 아님'] },
      { id: 'd4-milonga', placeId: 'milonga-nueva', kind: 'cafe', meal: 'cafe', flexMember: 'jimbocho', title: '밀롱가 누오바 — 커피·독서', time: { text: '진보초 체류 중 ~ 18:00·18:30 전후', nature: 'flexible' }, priority: 'core', reservation: { status: 'walk_in', note: '예약 없음 · 만석일 수 있음' }, memo: ['탱고 음악이 있는 킷사텐 — 이전 후 진보초 매장', '매장 앞 대기를 허용하지 않는다는 방문 사례 — 기다리면 들어간다는 보장 없음'] },
      { id: 'd4-akiyoshi', placeId: 'akiyoshi-ueno', kind: 'meal', meal: 'dinner', title: '아키요시 우에노 — 야키토리', time: { text: '19:00 전후 방문 목표', at: '2026-11-01T19:00:00+09:00', nature: 'target' }, priority: 'core', choice: { group: 'sundayDinner', value: 'akiyoshi' }, reservation: { status: 'walk_in', constraints: ['soloReservationUnavailable'], note: '전화 확인 결과 1인 예약 불가 → 예약 없이 현장 방문' }, memo: ['1인 예약이 안 될 뿐, 혼자 식사가 안 되는 것은 아님', '관심 메뉴: 純けい(준케이), 若どり 등 — 주문량·맥주는 정하지 않음', '지금 느낌으로는 이쪽이 더 끌림'] },
      { id: 'd4-marusho', placeId: 'marusho-hongo3', kind: 'meal', meal: 'dinner', title: '마루쇼 혼고산초메 — 특제 소스 야키소바', time: { text: '19:00 전후', at: '2026-11-01T19:00:00+09:00', nature: 'target' }, priority: 'backup', choice: { group: 'sundayDinner', value: 'marusho' }, reservation: { status: 'not_reserved', note: '1인 온라인 예약 안내는 있었지만 예약하지 않음 — 당일 선택' }, memo: ['아키요시와 다른 장소', '아키요시가 만석이면 생각해 볼 수 있지만 이동·마감 시간이 필요'] },
      { id: 'd4-return', placeId: 'rose-stay-shiba-park', kind: 'hotel', title: '숙소 복귀', time: { text: '식사 후', nature: 'flexible' }, priority: 'core', routeNeeds: ['sundayDinner'], reservation: { status: 'not_applicable' }, memo: [] },
    ],
  },
  {
    date: '2026-11-02',
    title: '체크아웃 · 도쿄역 · 니혼바시/에비스/긴자 옵션 · 출국',
    summary: '체크아웃 → 도쿄역 짐 보관 → 넣고 싶은 옵션만 (츠지한·에비스 캐피탈·긴자) → 짐 회수 → N\'EX → 나리타 18:55',
    areas: ['도쿄역', '니혼바시', '에비스', '긴자', '나리타'],
    route: '숙소 체크아웃 → 도쿄역 짐 보관 → [옵션: 츠지한 → 에비스 캐피탈 → 유니클로 → 캐피탈 긴자 → 이토야] → 도쿄역 짐 회수 → N\'EX → 나리타',
    notes: [
      '18:55 나리타 출발 항공편이 최우선.',
      '호텔로 돌아가지 않는다 — 짐은 도쿄역에서 회수.',
      '고정은 짐 보관·회수·N\'EX뿐. 나머지는 모두 옵션 — 갈 곳만 “동선에 넣기”.',
      '옵션 순서: 반대 방향인 에비스를 앞에, 도쿄역에서 가까운 긴자(캐피탈 긴자·이토야)를 마지막에 — 마지막 장소가 짐과 가까워 시간이 모자라면 바로 접고 짐을 찾으러 갈 수 있다.',
      '에비스는 도쿄역과 반대 방향이라 왕복 이동이 크다. 이동 시간은 구간별 길찾기로 확인.',
      '월요일 킷사텐 없음 · 카파바시는 넣지 않는 낮은 우선순위 서브.',
      '쇼핑은 대략 14:30~15:00에 끝낸다. “도쿄에서 16시 출발”은 16시에 매장에서 나온다는 뜻이 아니다.',
    ],
    warnings: [
      { id: 'w-flight', level: 'important', text: '국제선은 출발 최소 2시간 전 공항 도착 안내 — 16:55보다 여유 있게 도착하는 열차를 우선 확인.', sourceIds: ['src-narita-dep'] },
      { id: 'w-terminal', level: 'info', text: '항공사·터미널 미확인. N\'EX 정차역과 터미널이 다르면 도보/셔틀 이동이 더 필요하다.', sourceIds: ['src-nex'] },
    ],
    items: [
      { id: 'd5-checkout', placeId: 'rose-stay-shiba-park', kind: 'hotel', title: '체크아웃 (짐을 가지고 나옴)', time: { text: '오전', nature: 'flexible' }, priority: 'core', reservation: { status: 'not_applicable' }, memo: [] },
      { id: 'd5-luggage-drop', placeId: 'tokyo-station', kind: 'transit', luggage: 'drop', title: '도쿄역 짐 보관', time: { text: '오전', nature: 'flexible' }, priority: 'core', reservation: { status: 'not_reserved', note: '방식·장소 미정' }, memo: ['코인로커가 비어 있다고 가정하지 않음', '맡긴 뒤 위치를 준비 탭 메모에 적어 두기'] },
      // 옵션 — 모두 꺼진 상태로 시작. 순서는 개점 시간·방향 기준 (츠지한 10시 → 에비스 11시 → 캐피탈 긴자 12시 → 도쿄역 근처로 마무리)
      { id: 'd5-tsujihan', placeId: 'tsujihan-nihonbashi', kind: 'meal', meal: 'lunch', title: '츠지한 니혼바시 본점 — 해산물 덮밥', time: { text: '10:00 개점 · 이른 점심', nature: 'target' }, priority: 'optional', optionGroup: 'mon-options', reservation: { status: 'walk_in', note: '현장 대기 · 예약 없음' }, memo: ['마지막에 도미 육수', '대기가 길면 생략 — 출국일을 줄서기로 채우지 않음', '넣지 않으면 점심은 동선에서'] },
      { id: 'd5-kapital-naked', placeId: 'kapital-naked', kind: 'shop', title: 'KAPITAL TOKYO NAKED STORE (에비스)', time: { text: '11:00 개점', nature: 'flexible' }, priority: 'optional', optionGroup: 'mon-options', mondayKapital: true, reservation: { status: 'not_applicable' }, shopping: { purpose: '토요일에 못 봤거나 다시 보고 싶을 때', mondayOk: true }, memo: ['토요일 상태와 상관없이 고를 수 있음'] },
      { id: 'd5-kapital-legs', placeId: 'kapital-legs', kind: 'shop', title: 'KAPITAL Legs Craftsman Store (에비스)', time: { text: '11:00 개점', nature: 'flexible' }, priority: 'optional', optionGroup: 'mon-options', mondayKapital: true, reservation: { status: 'not_applicable' }, shopping: { purpose: '토요일에 못 봤거나 다시 보고 싶을 때', mondayOk: true }, memo: [] },
      { id: 'd5-kapital-duffle', placeId: 'kapital-duffle', kind: 'shop', title: 'Duffle with KAPITAL (에비스)', time: { text: '11:00 개점', nature: 'flexible' }, priority: 'optional', optionGroup: 'mon-options', mondayKapital: true, reservation: { status: 'not_applicable' }, shopping: { purpose: '토요일에 못 봤거나 다시 보고 싶을 때', mondayOk: true }, memo: [] },
      { id: 'd5-uniqlo', placeId: 'uniqlo-ginza', kind: 'shop', title: '유니클로 긴자', time: { text: '11:00 개점', nature: 'flexible' }, priority: 'optional', optionGroup: 'mon-options', reservation: { status: 'not_applicable' }, shopping: { purpose: '꼭 볼 상품이 있을 때만', mondayOk: true }, memo: [] },
      { id: 'd5-kapital-ginza', placeId: 'kapital-ginza', kind: 'shop', title: 'KAPITAL 긴자 (센추리 데님)', time: { text: '12:00 개점', nature: 'flexible' }, priority: 'optional', optionGroup: 'mon-options', reservation: { status: 'not_applicable' }, shopping: { purpose: '금요일에 못 봤고 아직 관심 있을 때', mondayOk: true }, memo: ['에비스 캐피탈과 다른 매장 — 도쿄역에서 가까움'] },
      { id: 'd5-itoya', placeId: 'itoya-ginza', kind: 'shop', title: '긴자 이토야 — 문구', time: { text: '마지막 (도쿄역 근처)', nature: 'flexible' }, priority: 'optional', optionGroup: 'mon-options', reservation: { status: 'not_applicable' }, shopping: { purpose: '문구 구경 (금요일에서 옮김)', mondayOk: true }, memo: ['다른 Itoya 지점이 아님', '긴자 1~2초메 — 끝나고 바로 도쿄역으로'] },
      { id: 'd5-luggage-pick', placeId: 'tokyo-station', kind: 'transit', luggage: 'pick', title: '도쿄역 짐 회수', time: { text: '쇼핑 종료 14:30~15:00 후', nature: 'target' }, priority: 'core', reservation: { status: 'not_applicable' }, memo: ['호텔에 다시 가지 않음'] },
      { id: 'd5-nex', placeId: 'tokyo-station', kind: 'transit', title: "N'EX 탑승 → 나리타", time: { text: '15:30~16:00 전후 탑승 목표 (후보 범위)', at: '2026-11-02T15:30:00+09:00', nature: 'target' }, priority: 'core', reservation: { status: 'not_reserved', note: '여행 중 예약 예정 — 열차 미정' }, memo: ['정확한 열차 번호·시간·운임·승강장은 예약할 때 확인', '16:55보다 여유 있게 공항에 닿는 편 우선'] },
      { id: 'd5-depart', placeId: 'narita-airport', kind: 'airport', title: '나리타공항 출국', time: { text: '18:55 출발', at: '2026-11-02T18:55:00+09:00', nature: 'fixed' }, priority: 'core', reservation: { status: 'not_applicable' }, memo: ['항공사·편명·터미널 미제공'] },
    ],
  },
];

// 사용자가 직접 고르는 선택지. 값은 브라우저에 저장된다.
export const CHOICES = {
  sundayDinner: {
    label: '일요일 저녁',
    options: [
      { value: 'undecided', label: '미정' },
      { value: 'akiyoshi', label: '아키요시' },
      { value: 'marusho', label: '마루쇼' },
    ],
    default: 'undecided',
  },
  jimbochoOrder: {
    label: '진보초 순서',
    options: [
      { value: 'undecided', label: '미정' },
      { value: 'cafe-first', label: '카페 먼저' },
      { value: 'books-first', label: '책 먼저' },
    ],
    default: 'undecided',
  },
  artNight: {
    label: '아트 나이트',
    options: [
      { value: 'undecided', label: '체력 보고' },
      { value: 'go', label: '간다' },
      { value: 'skip', label: '생략' },
    ],
    default: 'undecided',
  },
};

export const OPTION_GROUPS = {
  'fri-ginza': { label: '긴자에서 시간이 남을 때', when: '람브르 이후, 유라쿠초로 가기 전에 판단', note: '옵션을 넣으면 뒤 시간이 밀린다.' },
  'fri-cafe': { label: '시부야에서 커피가 당기고 자리가 있을 때', when: '시부야 → 아오야마 이동 중 위치에 맞춰', note: '둘 중 하나 또는 둘 다 생략.' },
  'fri-aoyama': { label: '아오야마에서 저녁 전 시간이 남을 때', when: '18:30 예약 전', note: '예약을 밀면서까지 전부 가지 않는다.' },
  'mon-options': { label: '월요일 옵션 — 갈 곳만 동선에 넣기', when: '짐을 맡긴 뒤 · 쇼핑은 14:30~15:00 마무리', note: '전부 넣으면 빠듯하다. 츠지한 대기 등으로 밀리면 반대 방향인 에비스부터 빼는 것이 안전하다.' },
};

// 본 일정에서 제외한 것 — 기본 일정에 다시 들어오면 안 된다 (데이터 검증에서 확인).
export const EXCLUDED = [
  { id: 'ex-zabou', name: 'ZABOU', reason: '스타일이 맞지 않음' },
  { id: 'ex-porter-classic', name: 'PORTER CLASSIC', reason: '제외' },
  { id: 'ex-vintage-watch', name: '긴자 빈티지 시계 매장', reason: '제외' },
  { id: 'ex-rrl-omotesando', name: 'RRL 오모테산도 플래그십', reason: '한큐에서 보고 정말 끌릴 때만 재검토' },
  { id: 'ex-meals', name: '돈코츠 라멘 · 스시 · 나폴리탄', reason: '별도 식사 슬롯 없음' },
  { id: 'ex-events', name: '도쿄타워 할로윈 · 이케부쿠로 코스프레 · DESIGNART AUTOBAHN · 클럽 행사', reason: '끌리지 않음' },
  { id: 'ex-monday-kissa', name: '월요일 킷사텐', reason: '제외' },
  { id: 'ex-kappabashi', name: '카파바시', reason: '낮은 우선순위 서브 — 월요일 옵션에도 넣지 않음' },
  { id: 'ex-tekka-alt', name: 'Tekka 대체 식당 (후지야·코빈초 등)', reason: '선택되지 않음' },
  { id: 'ex-haneda', name: '하네다', reason: '도착·출국 모두 나리타' },
];

// 일정 문서의 식사 계획 요약 — 식사 표는 items 에서 계산하고, 이 문장은 설명으로만 쓴다.
export const MEAL_NOTES = [
  '돈코츠·스시·나폴리탄을 별도 식사로 넣지 않는다.',
  '금·토 모두 점심을 먹고 커피를 마시는 순서.',
  '술은 많이 마시지 않는다. 첫날 Tekka의 맥주 한 잔이 주요 음주 계획.',
];

export const TASTE = [
  '음식, 조용한 킷사텐에서 커피·독서, 의류와 생활용품 쇼핑이 중심',
  '의류 매장은 보통 20~30분 — 이동·면세·피팅·결제·줄서기는 별도 시간',
  '여름 상의·셔츠·가벼운 팬츠/쇼츠 · 정핏~세미 릴랙스 (과한 오버핏 X)',
  '아우터·데님 재킷·레더 재킷 추가 구매는 목표가 아님',
  '브랜드를 보러 가는 것과 반드시 사는 것은 다르다',
];
