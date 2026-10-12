// 장소 데이터 — 같은 매장은 한 번만 정의하고 일정(data/trip.js)에서 id로 참조한다.
// 조사일: 2026-10-12. 상태 값:
//   official_checked    공식 홈페이지를 열어 확인
//   third_party_checked 공식 사이트가 없어 타베로그(가게 등록 정보)·관광 안내로 확인
//   user_confirmed      사용자가 준 값 (웹에서 별도 확인 못 함)
//   needs_verification  확인 필요 — 화면에 “확인 필요”로 표시
// 좌표: 공식 주소를 국토지리원 주소 검색(msearch.gsi.go.jp)에 넣어 얻은 값 (대부분 번지 단위).
//   coordinatePrecision: block=번지 · chome=초메 · area=행사 구역 대표 · facility=시설 대표
// 전화 링크(tel:)는 phoneStatus 가 official_checked 인 번호에만 단다.

export const PLACES = [
  {
    "id": "rose-stay-shiba-park",
    "nameKo": "로즈스테이 도쿄 시바공원 (Rose Stay Tokyo Shiba Park)",
    "nameJa": "ローズステイ東京芝公園",
    "nameEn": "ROSE STAY tokyo shiba park",
    "category": "hotel",
    "area": "시바공원",
    "address": "〒105-0014 東京都港区芝2丁目20番12号",
    "addressStatus": "official_checked",
    "officialUrl": "https://rosestay-tsp.com/access/",
    "hours": "체크인 15:00 / 체크아웃 10:00",
    "closedDays": null,
    "hoursStatus": "official_checked",
    "phone": "03-3457-7411",
    "phoneStatus": "official_checked",
    "nearestStation": "都営三田線 芝公園駅 A1出口 徒歩約1分 / 都営浅草線・三田線 三田駅 A9出口 徒歩約4分 / JR田町駅 西口 徒歩約10分",
    "coordinates": [
      35.651657,
      139.749817
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "not_applicable",
    "checkedAt": "2026-10-12",
    "notes": [
      "체크인 15:00 · 체크아웃 10:00 (공식)"
    ]
  },
  {
    "id": "narita-airport",
    "nameKo": "나리타공항",
    "nameJa": "成田国際空港",
    "nameEn": "Narita International Airport",
    "category": "airport",
    "area": "나리타",
    "address": null,
    "addressStatus": "needs_verification",
    "officialUrl": "https://www.narita-airport.jp/",
    "hours": null,
    "closedDays": null,
    "hoursStatus": "needs_verification",
    "phone": null,
    "phoneStatus": null,
    "nearestStation": "成田空港駅（第1ターミナル）／空港第２ビル駅（第2・第3ターミナル）",
    "coordinates": [
      35.766301,
      140.378666
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_place_name",
    "coordinatePrecision": "facility",
    "taxFree": "not_applicable",
    "checkedAt": "2026-10-12",
    "notes": [
      "지도 점은 공항 대표 지점 — 터미널 위치 아님",
      "제1터미널 = 成田空港駅, 제2·3터미널 = 空港第２ビル駅 (터미널은 항공사에 따라 다름)"
    ],
    "mapsQuery": "成田国際空港"
  },
  {
    "id": "tokyo-station",
    "nameKo": "도쿄역",
    "nameJa": "東京駅",
    "nameEn": "Tokyo Station",
    "category": "station",
    "area": "도쿄역·마루노우치",
    "address": "東京都千代田区丸の内1-9-1",
    "addressStatus": "needs_verification",
    "officialUrl": "https://www.gransta.jp/news/info/cloakservice/",
    "hours": null,
    "closedDays": null,
    "hoursStatus": "needs_verification",
    "phone": null,
    "phoneStatus": null,
    "nearestStation": "東京駅",
    "coordinates": [
      35.681259,
      139.766217
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_place_name",
    "coordinatePrecision": "facility",
    "taxFree": "not_applicable",
    "checkedAt": "2026-10-12",
    "notes": [
      "지도 점은 역 대표 지점",
      "짐 보관 선택지는 준비·유의 탭 참고"
    ],
    "mapsQuery": "東京駅",
    "officialLabel": "도쿄역 짐 보관 안내"
  },
  {
    "id": "tekka",
    "nameKo": "Tekka 본점 (鉄火)",
    "nameJa": "鉄火 本店",
    "nameEn": "Tekka Honten",
    "category": "restaurant",
    "area": "시바",
    "address": "東京都港区芝5-23-15",
    "addressStatus": "third_party_checked",
    "officialUrl": "https://s.tabelog.com/en/tokyo/A1314/A131402/13026121/",
    "hours": "Mon-Fri 11:00-14:00 (food L.O. 13:30), 16:00-翌2:00 (food L.O. 1:00, drinks L.O. 1:30); Sat & public holidays 16:00-翌2:00 (food L.O. 1:00, drinks L.O. 1:30); Sun 16:00-23:00 (food L.O. 22:00, drinks L.O. 22:30)",
    "closedDays": "Open year-round (無休)",
    "hoursStatus": "third_party_checked",
    "phone": "03-5443-8899",
    "phoneStatus": "third_party_checked",
    "nearestStation": "JR田町駅 徒歩5分 / 三田駅 徒歩3分 (as stated on Tabelog)",
    "coordinates": [
      35.648144,
      139.745926
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "not_applicable",
    "checkedAt": "2026-10-12",
    "notes": [
      "현금만 (타베로그 가게 등록 정보)",
      "실내 흡연 가능 (점심 제외) — 타베로그 기준",
      "근처 鉄火 分店(芝5-26-5)과 다른 가게 — 분점 번호를 쓰지 않는다"
    ],
    "officialLabel": "타베로그에서 보기"
  },
  {
    "id": "aoki-ginza8",
    "nameKo": "아오키 긴자 8초메점",
    "nameJa": "とんかつ檍 銀座8丁目店",
    "nameEn": "Tonkatsu Aoki Ginza 8-chome",
    "category": "restaurant",
    "area": "긴자",
    "address": "〒104-0061 東京都中央区銀座８丁目８−７ 第３ソワレ・ドビルB1",
    "addressStatus": "official_checked",
    "officialUrl": "https://tonkatsu-aoki.com/shop/",
    "hours": "平日 11:00〜15:00 17:00〜21:00 / 土、日、祝日 11:00〜15:00 17:00〜20:00",
    "closedDays": "水曜日",
    "hoursStatus": "official_checked",
    "phone": "03-3573-1600",
    "phoneStatus": "official_checked",
    "nearestStation": null,
    "coordinates": [
      35.668106,
      139.761551
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "not_applicable",
    "checkedAt": "2026-10-12",
    "notes": [
      "정기휴무 수요일 — 금요일 방문은 해당 없음",
      "4초메점과 다른 지점"
    ]
  },
  {
    "id": "lambre",
    "nameKo": "카페 드 람브르",
    "nameJa": "カフェ・ド・ランブル",
    "nameEn": "Café de L'Ambre",
    "category": "cafe",
    "area": "긴자",
    "address": "〒104-0061 東京都中央区銀座 8-10-15",
    "addressStatus": "official_checked",
    "officialUrl": "https://cafedelambre.com/pages/contact",
    "hours": "平日 11:00 – 20:00（ラストオーダー 19:00）/ 日・祝 11:00 – 18:00（ラストオーダー 17:00）",
    "closedDays": "月曜日",
    "hoursStatus": "official_checked",
    "phone": "03 3571 1551",
    "phoneStatus": "official_checked",
    "nearestStation": null,
    "coordinates": [
      35.667957,
      139.762299
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "not_applicable",
    "checkedAt": "2026-10-12",
    "notes": [
      "정기휴무 월요일",
      "토요일 영업시간 구분은 공식 페이지에 명시 없음 (금요일 방문)"
    ]
  },
  {
    "id": "uniqlo-ginza",
    "nameKo": "유니클로 긴자점",
    "nameJa": "ユニクロ 銀座店",
    "nameEn": "UNIQLO Ginza",
    "category": "shop",
    "area": "긴자",
    "address": "〒104-0061 東京都中央区銀座6-9-5ギンザコマツ東館1－12F",
    "addressStatus": "official_checked",
    "officialUrl": "https://map.uniqlo.com/jp/ja/detail/10101397",
    "hours": "11:00-21:00 (毎日・祝日とも)",
    "closedDays": null,
    "hoursStatus": "official_checked",
    "phone": "050-3098-0754",
    "phoneStatus": "official_checked",
    "nearestStation": "東京メトロ銀座線「銀座」駅下車、A-2出口より徒歩4分",
    "coordinates": [
      35.670086,
      139.763626
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "yes",
    "checkedAt": "2026-10-12",
    "notes": [
      "면세 가능 (공식 매장 정보)"
    ]
  },
  {
    "id": "kapital-ginza",
    "nameKo": "KAPITAL 센추리 데님 긴자 고비키초",
    "nameJa": "キャピタル センチュリーデニム 銀座 木挽町",
    "nameEn": "KAPITAL CENTURY DENIM GINZA 木挽町",
    "category": "shop",
    "area": "긴자",
    "address": "〒104-0061 中央区銀座一丁目 21-12島春ビル1階・3階",
    "addressStatus": "official_checked",
    "officialUrl": "https://www.kapital.jp/shop/detail/18.html",
    "hours": "OPEN 12：00 / CLOSE 20：00",
    "closedDays": null,
    "hoursStatus": "official_checked",
    "phone": "03-6263-0485",
    "phoneStatus": "official_checked",
    "nearestStation": null,
    "coordinates": [
      35.672356,
      139.770493
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "unknown",
    "checkedAt": "2026-10-12",
    "notes": [
      "정오(12:00) 개점",
      "에비스 캐피탈 3곳과 다른 매장"
    ]
  },
  {
    "id": "steven-alan-yurakucho",
    "nameKo": "STEVEN ALAN 유라쿠초",
    "nameJa": "スティーブン アラン 有楽町（ルミネ有楽町 ルミネ2・4F）",
    "nameEn": "Steven Alan YURAKUCHO",
    "category": "shop",
    "area": "유라쿠초",
    "address": "東京都千代田区有楽町2-5-1 ルミネ有楽町 ルミネ2 4F",
    "addressStatus": "official_checked",
    "officialUrl": "https://www.lumine.ne.jp/yurakucho/floorguide/detail/?scd=002631",
    "hours": "平日 11:00 ~ 21:00 / 土日祝 11:00 ~ 21:00",
    "closedDays": null,
    "hoursStatus": "official_checked",
    "phone": "050-8893-9253",
    "phoneStatus": "official_checked",
    "nearestStation": "JR有楽町駅 銀座口より徒歩1分 (Lumine Yurakucho building access page)",
    "coordinates": [
      35.673576,
      139.762802
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "yes",
    "checkedAt": "2026-10-12",
    "notes": [
      "루미네 유라쿠초 공식 매장 안내 기준 (유나이티드 애로우즈 매장 페이지는 접속 차단)",
      "루미네 안내상 TAX FREE 표시"
    ],
    "officialLabel": "루미네 매장 안내에서 보기",
    "googleMapsUrl": "https://maps.app.goo.gl/YUtCFMa9g68sdDgE6"
  },
  {
    "id": "rrl-hankyu-mens",
    "nameKo": "RRL (더블알엘) 한큐 맨즈 도쿄",
    "nameJa": "ダブル アール エル（阪急メンズ東京 7F）",
    "nameEn": "DOUBLE RL (RRL) at HANKYU MEN'S TOKYO",
    "category": "shop",
    "area": "유라쿠초",
    "address": "〒100-8488 東京都千代田区有楽町2丁目5番1号 阪急メンズ東京 7F",
    "addressStatus": "official_checked",
    "officialUrl": "https://web.hh-online.jp/hankyu-mens/contents/tokyo/floor/7f",
    "hours": "平日 12:00〜20:00 / 土・日・祝 11:00〜20:00 (阪急メンズ東京)",
    "closedDays": null,
    "hoursStatus": "official_checked",
    "phone": "03-6252-5381",
    "phoneStatus": "official_checked",
    "nearestStation": "JR有楽町駅 銀座口（徒歩1分）/ 地下鉄銀座駅 C4出口（徒歩1分）/ 地下鉄日比谷駅 A0出口（徒歩0分）/ 地下鉄有楽町駅 D7出口（徒歩3分）",
    "coordinates": [
      35.673576,
      139.762802
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "yes",
    "checkedAt": "2026-10-12",
    "notes": [
      "한큐 맨즈 도쿄 7F (공식 층 안내)",
      "백화점 영업시간: 평일 12:00 개점 — 금요일은 12:00부터",
      "오모테산도 플래그십이 아님"
    ],
    "officialLabel": "한큐 맨즈 7F 안내에서 보기"
  },
  {
    "id": "beams-plus-marunouchi",
    "nameKo": "BEAMS PLUS 마루노우치",
    "nameJa": "ビームス プラス 丸の内",
    "nameEn": "BEAMS PLUS MARUNOUCHI",
    "category": "shop",
    "area": "마루노우치",
    "address": "東京都千代田区丸の内二丁目2番3号 丸の内仲通りビル 1F",
    "addressStatus": "needs_verification",
    "officialUrl": "https://www.beams.co.jp/shop/bpm/",
    "hours": null,
    "closedDays": "不定休",
    "hoursStatus": "needs_verification",
    "phone": "03-5220-3151",
    "phoneStatus": "needs_verification",
    "nearestStation": null,
    "coordinates": [
      35.680233,
      139.762222
    ],
    "coordinateStatus": "needs_verification",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "unknown",
    "checkedAt": "2026-10-12",
    "notes": [
      "BEAMS HOUSE 마루노우치와 다른 매장",
      "공식 페이지를 이 작업 환경에서 직접 열지 못함 — 주소·영업시간 확인 필요"
    ],
    "hoursNote": "영업시간 확인 필요 (조사 참고값: 11:00 - 20:00)"
  },
  {
    "id": "beams-men-shibuya",
    "nameKo": "BEAMS MEN 시부야",
    "nameJa": "ビームス メン 渋谷",
    "nameEn": "BEAMS MEN SHIBUYA",
    "category": "shop",
    "area": "시부야",
    "address": "東京都渋谷区神南1-15-1 1F・2F",
    "addressStatus": "needs_verification",
    "officialUrl": "https://www.beams.co.jp/shop/s/",
    "hours": null,
    "closedDays": "不定休",
    "hoursStatus": "needs_verification",
    "phone": "03-3780-5500",
    "phoneStatus": "needs_verification",
    "nearestStation": null,
    "coordinates": [
      35.663818,
      139.699783
    ],
    "coordinateStatus": "needs_verification",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "yes",
    "checkedAt": "2026-10-12",
    "notes": [
      "공식 페이지를 이 작업 환경에서 직접 열지 못함 — 주소·영업시간 확인 필요"
    ],
    "hoursNote": "영업시간 확인 필요 (조사 참고값: 11:00 - 20:00)"
  },
  {
    "id": "chatei-hatou",
    "nameKo": "차테이 하토우",
    "nameJa": "茶亭 羽當",
    "nameEn": "Chatei Hatou",
    "category": "cafe",
    "area": "시부야",
    "address": "東京都渋谷区渋谷1-15-19 二葉ビル 2F",
    "addressStatus": "third_party_checked",
    "officialUrl": "https://s.tabelog.com/en/tokyo/A1303/A130301/13001169/",
    "hours": "Mon-Sun 11:00-23:00 (L.O. 22:00)",
    "closedDays": null,
    "hoursStatus": "third_party_checked",
    "phone": "03-3400-9088",
    "phoneStatus": "third_party_checked",
    "nearestStation": "渋谷駅東口 徒歩3分 (as stated on Tabelog)",
    "coordinates": [
      35.660488,
      139.702469
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "not_applicable",
    "checkedAt": "2026-10-12",
    "notes": [
      "공식 사이트 없음 — 타베로그·Time Out 기준"
    ],
    "officialLabel": "타베로그에서 보기"
  },
  {
    "id": "satella",
    "nameKo": "킷사 사테라 (Satella)",
    "nameJa": "喫茶サテラ",
    "nameEn": "satella",
    "category": "cafe",
    "area": "시부야",
    "address": "東京都渋谷区渋谷1-7-5 青山セブンハイツ 1F",
    "addressStatus": "third_party_checked",
    "officialUrl": "https://s.tabelog.com/en/tokyo/A1303/A130301/13253683/",
    "hours": "Mon-Sun 10:00-22:00 (L.O. 21:30)",
    "closedDays": "不定休 (not fixed)",
    "hoursStatus": "third_party_checked",
    "phone": "080-8444-4243",
    "phoneStatus": "third_party_checked",
    "nearestStation": "渋谷駅B4出口 徒歩6分 / 表参道駅B2出口 徒歩8分 (as stated on Tabelog)",
    "coordinates": [
      35.660614,
      139.706284
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "not_applicable",
    "checkedAt": "2026-10-12",
    "notes": [
      "공식 사이트(satella.coffee)가 현재 열리지 않음 — 타베로그 기준",
      "다른 사이트에는 영업시간이 다르게 나옴 → 방문 전 Instagram 등 확인",
      "카페다 — 의류 매장이 아님"
    ],
    "officialLabel": "타베로그에서 보기"
  },
  {
    "id": "spiral-market",
    "nameKo": "스파이럴 마켓",
    "nameJa": "スパイラルマーケット 青山",
    "nameEn": "Spiral Market Aoyama",
    "category": "shop",
    "area": "아오야마",
    "address": "〒107-0062 東京都港区南青山5-6-23 スパイラル2F",
    "addressStatus": "official_checked",
    "officialUrl": "https://www.spiral.co.jp/shoplist/spiral_market",
    "hours": "11:00-19:00",
    "closedDays": "施設の休業に準ずる",
    "hoursStatus": "official_checked",
    "phone": "03-3498-5792",
    "phoneStatus": "official_checked",
    "nearestStation": "東京メトロ銀座線・半蔵門線・千代田線 表参道駅 B1出口前、もしくはB3出口より渋谷方面へ1分 (spiral.co.jp/access)",
    "coordinates": [
      35.663567,
      139.711945
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "unknown",
    "checkedAt": "2026-10-12",
    "notes": [
      "스파이럴 건물 2층",
      "휴무는 건물 휴관일에 따름"
    ]
  },
  {
    "id": "hakusan-shop",
    "nameKo": "HAKUSAN SHOP 백산도기 도쿄 쇼룸",
    "nameJa": "HAKUSAN SHOP 白山陶器東京ショールーム",
    "nameEn": "HAKUSAN SHOP Tokyo Showroom",
    "category": "shop",
    "area": "아오야마",
    "address": "〒107-0062 東京都港区南青山5-3-10 フロムファーストGフロア",
    "addressStatus": "official_checked",
    "officialUrl": "https://www.hakusan-shop-online.com/pages/showroom-tokyo",
    "hours": "11:00~19:00",
    "closedDays": "年末年始ほか不定休 ※2月と8月はビルのメンテナンスのため休館日がございます",
    "hoursStatus": "official_checked",
    "phone": "03-5774-8850",
    "phoneStatus": "official_checked",
    "nearestStation": null,
    "coordinates": [
      35.66317,
      139.715271
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "unknown",
    "checkedAt": "2026-10-12",
    "notes": [
      "백산도기(白山陶器) 쇼룸 — HAKUSAN MEGANE 안경점이 아님",
      "공식 페이지의 10/30~11/1 단축 영업 안내는 2023~2024년 것으로 보임 (요일 불일치) — 그대로 믿지 말 것"
    ]
  },
  {
    "id": "kawakamian-aoyama",
    "nameKo": "아오야마 가와카미안",
    "nameJa": "青山 川上庵",
    "nameEn": "Aoyama Kawakami-an",
    "category": "restaurant",
    "area": "아오야마",
    "address": "東京都港区南青山 3-14-1",
    "addressStatus": "official_checked",
    "officialUrl": "https://www.kawakamian.com/shops/aoyama.php",
    "hours": "昼 11:00～16:00 / 夜 16:00～23:00（22:00 LO）",
    "closedDays": "なし",
    "hoursStatus": "official_checked",
    "phone": "03-5411-7171",
    "phoneStatus": "official_checked",
    "nearestStation": "地下鉄「表参道」Ａ４出口より徒歩5分",
    "coordinates": [
      35.665279,
      139.714783
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "not_applicable",
    "checkedAt": "2026-10-12",
    "notes": [
      "KAWAKAMI-AN TOKYO / 기타아오야마 지점이 아님",
      "월 1회 16:30~18:00 직원 회의로 쉬는 날이 있을 수 있다는 안내 — 날짜 미공개 (18:30 예약과는 별개)"
    ]
  },
  {
    "id": "bluenote-tokyo",
    "nameKo": "블루노트 도쿄",
    "nameJa": "ブルーノート東京",
    "nameEn": "Blue Note Tokyo",
    "category": "venue",
    "area": "아오야마",
    "address": "〒107-0062 東京都港区南青山6-3-16",
    "addressStatus": "official_checked",
    "officialUrl": "https://www.bluenote.co.jp/jp/access/",
    "hours": null,
    "closedDays": null,
    "hoursStatus": "needs_verification",
    "phone": "03-5485-0088",
    "phoneStatus": "official_checked",
    "nearestStation": "東京メトロ表参道駅下車 徒歩約8分",
    "coordinates": [
      35.660877,
      139.716278
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "not_applicable",
    "checkedAt": "2026-10-12",
    "notes": [
      "영업시간은 공연마다 다름 — 공식 스케줄 확인",
      "에비스 BLUE NOTE PLACE가 아님"
    ]
  },
  {
    "id": "fuunji",
    "nameKo": "후운지 신주쿠 본점",
    "nameJa": "風雲児 新宿本店",
    "nameEn": "Fuunji Shinjuku Main Store",
    "category": "restaurant",
    "area": "신주쿠",
    "address": "東京都渋谷区代々木2-14-3 北斗第一ビル 1F",
    "addressStatus": "official_checked",
    "officialUrl": "https://www.fu-unji.com/",
    "hours": "11：00～15：00、17：00～21：00（スープ売り切れ次第終了）",
    "closedDays": "年中無休",
    "hoursStatus": "official_checked",
    "phone": null,
    "phoneStatus": null,
    "nearestStation": "【JR】新宿駅 南口から甲州街道に沿って徒歩5分 / 【都営 新宿線・大江戸線】新宿駅 6番出口から徒歩1分",
    "coordinates": [
      35.686668,
      139.696564
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "not_applicable",
    "checkedAt": "2026-10-12",
    "notes": [
      "15:00~17:00 휴식 · 수프 소진 시 종료",
      "예약 불가 · 전석 금연",
      "이름은 신주쿠지만 주소는 시부야구 요요기"
    ]
  },
  {
    "id": "tajimaya-honten",
    "nameKo": "다지마야커피 본점",
    "nameJa": "但馬屋珈琲店 本店",
    "nameEn": "Tajimaya Coffee Main Store",
    "category": "cafe",
    "area": "신주쿠",
    "address": "〒160-0023 東京都新宿区西新宿1-2-6",
    "addressStatus": "official_checked",
    "officialUrl": "https://tajimaya-coffeeten.com/locations",
    "hours": "10:00～23:00（ラストオーダー 22:30）",
    "closedDays": "元旦",
    "hoursStatus": "official_checked",
    "phone": "03-3342-0881",
    "phoneStatus": "official_checked",
    "nearestStation": "新宿駅西口より徒歩3分",
    "coordinates": [
      35.692703,
      139.699753
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "not_applicable",
    "checkedAt": "2026-10-12",
    "notes": [
      "전석 흡연 가능 (공식) — 담배 연기 주의",
      "예약 불가",
      "야마모토 커피(쇼핑)와 다른 곳"
    ]
  },
  {
    "id": "yamamoto-coffee-shinjuku",
    "nameKo": "야마모토 커피 (신주쿠)",
    "nameJa": "新宿 ヤマモトコーヒー店",
    "nameEn": null,
    "category": "shop",
    "area": "신주쿠",
    "address": "東京都新宿区新宿3丁目17番11号",
    "addressStatus": "official_checked",
    "officialUrl": "https://www.yamamoto-coffee.co.jp/",
    "hours": "１１：００～２０：００",
    "closedDays": "原則として元日のみ",
    "hoursStatus": "official_checked",
    "phone": "03-3352-5055",
    "phoneStatus": "official_checked",
    "nearestStation": "新宿駅東口より徒歩3分 (official site); 最寄りの出口B-7（紀伊国屋書店）から地上に出て右に回り込む (B-9 exit currently closed)",
    "coordinates": [
      35.692333,
      139.70285
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "unknown",
    "checkedAt": "2026-10-12",
    "notes": [
      "공식 이름은 新宿 ヤマモトコーヒー店 — 신주쿠 매장 1곳뿐",
      "원두·밀·사이펀 등 커피 도구 판매점",
      "출구 B-7(기노쿠니야)로 나와 돌아가기 — B-9 출구는 현재 폐쇄 (공식 안내)"
    ]
  },
  {
    "id": "biccamera-shinjuku-east",
    "nameKo": "빅카메라 신주쿠 동쪽 출구점",
    "nameJa": "ビックカメラ 新宿東口店",
    "nameEn": "Bic Camera Shinjuku East Exit",
    "category": "shop",
    "area": "신주쿠",
    "address": "〒160-0022 東京都新宿区新宿3-29-1",
    "addressStatus": "user_confirmed",
    "officialUrl": "https://www.biccamera.com/bc/i/shop/shoplist/shop116.jsp",
    "hours": null,
    "closedDays": "年中無休",
    "hoursStatus": "needs_verification",
    "phone": "03-3226-1111",
    "phoneStatus": "needs_verification",
    "nearestStation": "新宿三丁目駅（Ａ５出口）/ 新宿駅（東口）/ 新宿西口駅（Ａ５出口）/ 西武新宿駅（南口）",
    "coordinates": [
      35.691151,
      139.703278
    ],
    "coordinateStatus": "needs_verification",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "yes",
    "checkedAt": "2026-10-12",
    "notes": [
      "SBTH007 재고는 확인하지 않음",
      "공식 페이지를 이 작업 환경에서 직접 열지 못함 — 영업시간 확인 필요"
    ],
    "hoursNote": "영업시간 확인 필요 (조사 참고값: 10:00 ～ 22:00)"
  },
  {
    "id": "beams-japan-shinjuku",
    "nameKo": "BEAMS JAPAN 신주쿠",
    "nameJa": "ビームス ジャパン",
    "nameEn": "BEAMS JAPAN (Shinjuku)",
    "category": "shop",
    "area": "신주쿠",
    "address": "東京都新宿区新宿3-32-6 B1F - 5F",
    "addressStatus": "needs_verification",
    "officialUrl": "https://www.beams.co.jp/shop/j/",
    "hours": null,
    "closedDays": "不定休",
    "hoursStatus": "needs_verification",
    "phone": "03-5368-7300",
    "phoneStatus": "needs_verification",
    "nearestStation": null,
    "coordinates": [
      35.690388,
      139.703949
    ],
    "coordinateStatus": "needs_verification",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "yes",
    "checkedAt": "2026-10-12",
    "notes": [
      "B1F~5F — 여러 층을 다 보면 오래 걸림",
      "공식 페이지를 이 작업 환경에서 직접 열지 못함 — 영업시간 확인 필요"
    ],
    "hoursNote": "영업시간 확인 필요 (조사 참고값: 11:00-20:00（1F-5F）／11:30-15:00＜昼＞ 17:00-23:00＜夜＞（クラフトグリル）)"
  },
  {
    "id": "fenest",
    "nameKo": "FENEST",
    "nameJa": "FENEST（フェネスト）",
    "nameEn": "FENEST",
    "category": "shop",
    "area": "신주쿠",
    "address": "〒160-0022 東京都新宿区新宿2-4-2　カーサ御苑2階 #201",
    "addressStatus": "official_checked",
    "officialUrl": "https://www.fenest.jp/html/map.htm",
    "hours": "平日 13:00–21:00 / 土日 12:00–20:00",
    "closedDays": "月曜日",
    "hoursStatus": "official_checked",
    "phone": "03-6457-8624",
    "phoneStatus": "official_checked",
    "nearestStation": "新宿三丁目駅・新宿御苑駅から徒歩4分 / JR新宿駅（東口・南口）から徒歩9分",
    "coordinates": [
      35.688709,
      139.708115
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "unknown",
    "checkedAt": "2026-10-12",
    "notes": [
      "정기휴무 월요일 — 11/2에는 못 감",
      "평일은 13:00 개점 (토요일은 12:00)"
    ]
  },
  {
    "id": "lolo",
    "nameKo": "LOLO",
    "nameJa": "LOLO",
    "nameEn": "LOLO",
    "category": "shop",
    "area": "나카메구로",
    "address": "東京都目黒区青葉台3-22-1 102",
    "addressStatus": "user_confirmed",
    "officialUrl": null,
    "hours": null,
    "closedDays": null,
    "hoursStatus": "needs_verification",
    "phone": null,
    "phoneStatus": null,
    "nearestStation": null,
    "coordinates": [
      35.649841,
      139.691116
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "unknown",
    "checkedAt": "2026-10-12",
    "notes": [
      "공식 사이트·SNS를 찾지 못함 — 주소는 사용자 제공, 영업일·시간 확인 필요",
      "사용자 지도 링크의 위치가 이 주소와 약 25m 이내로 일치"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/WeuLLyB9zdJ93AJg7",
    "hoursNote": "영업일·시간 확인 필요"
  },
  {
    "id": "kinto-store-tokyo",
    "nameKo": "KINTO STORE Tokyo",
    "nameJa": "KINTO STORE Tokyo",
    "nameEn": "KINTO STORE Tokyo",
    "category": "shop",
    "area": "나카메구로",
    "address": "〒153-0042 東京都目黒区青葉台1-19-12",
    "addressStatus": "official_checked",
    "officialUrl": "https://kinto.co.jp/pages/kinto-store-tokyo",
    "hours": "月〜金 12:00-19:00、土日祝 12:00-18:00",
    "closedDays": "定休日なし（年末年始を除く）",
    "hoursStatus": "official_checked",
    "phone": null,
    "phoneStatus": null,
    "nearestStation": "東急東横線・東京メトロ 中目黒駅正面改札より徒歩6分",
    "coordinates": [
      35.647213,
      139.697556
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "unknown",
    "checkedAt": "2026-10-12",
    "notes": [
      "토·일·공휴일 12:00~18:00 — 토요일은 18시 폐점",
      "나카메구로역에서 도보 6분 — 에비스역 옆이 아님"
    ]
  },
  {
    "id": "sml",
    "nameKo": "SML",
    "nameJa": "SML",
    "nameEn": "SML",
    "category": "shop",
    "area": "다이칸야마·에비스니시",
    "address": "〒150-0021 東京都渋谷区恵比寿西1-33-3 光雲閣310",
    "addressStatus": "official_checked",
    "officialUrl": "https://sm-l.jp/",
    "hours": "12:00-19:00",
    "closedDays": null,
    "hoursStatus": "official_checked",
    "phone": "070-9428-3777",
    "phoneStatus": "official_checked",
    "nearestStation": "東急東横線代官山駅より徒歩２分（JR・東京メトロ恵比寿駅より徒歩約7分）",
    "coordinates": [
      35.647526,
      139.704208
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "unknown",
    "checkedAt": "2026-10-12",
    "notes": [
      "이전한 새 매장 (다이칸야마역 도보 2분) — 예전 나카메구로 주소가 아님"
    ]
  },
  {
    "id": "jackman-ebisu",
    "nameKo": "Jackman 에비스",
    "nameJa": "Jackman 恵比寿",
    "nameEn": "Jackman Ebisu",
    "category": "shop",
    "area": "에비스",
    "address": "〒150-0022 東京都渋谷区恵比寿南2-20-5",
    "addressStatus": "official_checked",
    "officialUrl": "https://www.jackman.jp/shop/pages/shops.aspx",
    "hours": "10:00-18:00",
    "closedDays": "月曜日（祝日の場合は営業）",
    "hoursStatus": "official_checked",
    "phone": "03-5773-5916",
    "phoneStatus": "official_checked",
    "nearestStation": null,
    "coordinates": [
      35.643311,
      139.709869
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "unknown",
    "checkedAt": "2026-10-12",
    "notes": [
      "18:00 폐점 — 토요일 에비스에서 먼저",
      "월요일 휴무 (공휴일 제외) — 11/2는 휴무"
    ]
  },
  {
    "id": "good-on-flagship",
    "nameKo": "Good On 플래그십 숍",
    "nameJa": "Good On -flagship shop-",
    "nameEn": "Good On Flagship Shop",
    "category": "shop",
    "area": "에비스",
    "address": "〒150-0022 東京都渋谷区恵比寿南2-23-2恵比寿NH第2ビル1階",
    "addressStatus": "official_checked",
    "officialUrl": "https://www.good-on.com/view/page/flagshipshop",
    "hours": "12:00〜19:00",
    "closedDays": null,
    "hoursStatus": "official_checked",
    "phone": "03-5725-5727",
    "phoneStatus": "official_checked",
    "nearestStation": null,
    "coordinates": [
      35.642334,
      139.709915
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "unknown",
    "checkedAt": "2026-10-12",
    "notes": [
      "영업일을 달마다 공지하는 경우가 있음 — 10월 말 공지 확인"
    ]
  },
  {
    "id": "yaeca-ebisu",
    "nameKo": "YAECA 에비스",
    "nameJa": "YAECA 恵比寿",
    "nameEn": "YAECA (Ebisu)",
    "category": "shop",
    "area": "에비스",
    "address": "東京都渋谷区恵比寿南2-20-15 1F",
    "addressStatus": "official_checked",
    "officialUrl": "https://www.yaeca.com/shop/",
    "hours": "12:00-20:00",
    "closedDays": "CLOSED ON MONDAY ※EXCEPT HOLIDAY",
    "hoursStatus": "official_checked",
    "phone": "+81 3 6426 7107",
    "phoneStatus": "official_checked",
    "nearestStation": null,
    "coordinates": [
      35.643761,
      139.70961
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "unknown",
    "checkedAt": "2026-10-12",
    "notes": [
      "월요일 휴무 (공휴일 제외) — 11/2는 휴무",
      "공식 주소는 영문 표기 — 일본어 표기는 옮겨 적은 것"
    ]
  },
  {
    "id": "kapital-naked",
    "nameKo": "KAPITAL TOKYO NAKED STORE",
    "nameJa": "KAPITAL TOKYO NAKED STORE",
    "nameEn": "KAPITAL TOKYO NAKED STORE",
    "category": "shop",
    "area": "에비스",
    "address": "〒150-0022 東京都渋谷区恵比寿南2-20-2ガイヤエビスビル１F",
    "addressStatus": "official_checked",
    "officialUrl": "https://www.kapital.jp/shop/detail/2.html",
    "hours": "OPEN 11:00 / CLOSE 20:00",
    "closedDays": null,
    "hoursStatus": "official_checked",
    "phone": "03-5725-3923",
    "phoneStatus": "official_checked",
    "nearestStation": null,
    "coordinates": [
      35.643707,
      139.709885
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "unknown",
    "checkedAt": "2026-10-12",
    "notes": [
      "에비스 캐피탈 3곳 중 하나 — 각각 다른 매장"
    ]
  },
  {
    "id": "kapital-legs",
    "nameKo": "KAPITAL Legs Craftsman Store",
    "nameJa": "KAPITAL Legs Craftsman Store",
    "nameEn": "Legs Craftsman Store",
    "category": "shop",
    "area": "에비스",
    "address": "〒150-0022 東京都渋谷区恵比寿南2-23-12エビスサニービル 1F",
    "addressStatus": "official_checked",
    "officialUrl": "https://www.kapital.jp/shop/detail/4.html",
    "hours": "OPEN 11:00 / CLOSE 20:00",
    "closedDays": null,
    "hoursStatus": "official_checked",
    "phone": "03-5773-8305",
    "phoneStatus": "official_checked",
    "nearestStation": null,
    "coordinates": [
      35.642155,
      139.709076
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "unknown",
    "checkedAt": "2026-10-12",
    "notes": [
      "에비스 캐피탈 3곳 중 하나 — 각각 다른 매장"
    ]
  },
  {
    "id": "kapital-duffle",
    "nameKo": "Duffle with KAPITAL",
    "nameJa": "Duffle with KAPITAL",
    "nameEn": "Duffle with KAPITAL",
    "category": "shop",
    "area": "에비스",
    "address": "〒150-0022 東京都渋谷区恵比寿南2-24-2ファニービル",
    "addressStatus": "official_checked",
    "officialUrl": "https://www.kapital.jp/shop/detail/3.html",
    "hours": "OPEN 11:00 / CLOSE 20:00",
    "closedDays": null,
    "hoursStatus": "official_checked",
    "phone": "03-5768-1965",
    "phoneStatus": "official_checked",
    "nearestStation": null,
    "coordinates": [
      35.642895,
      139.710114
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "unknown",
    "checkedAt": "2026-10-12",
    "notes": [
      "에비스 캐피탈 3곳 중 하나 — 각각 다른 매장"
    ]
  },
  {
    "id": "kikukawa-ebisu",
    "nameKo": "우나기 시다이메 기쿠카와 에비스 가든플레이스점",
    "nameJa": "うなぎ四代目菊川 恵比寿ガーデンプレイス店",
    "nameEn": "Unagi Yondaime Kikukawa Ebisu Garden Place",
    "category": "restaurant",
    "area": "에비스",
    "address": "〒150-0013 東京都渋谷区恵比寿4丁目20番 恵比寿ガーデンプレイスタワー 38F",
    "addressStatus": "official_checked",
    "officialUrl": "https://gardenplace.jp/shop/detail/11",
    "hours": "ランチ 11:00〜15:00(LO14:00) / ディナー 17:00〜22:00(LO21:00)",
    "closedDays": null,
    "hoursStatus": "official_checked",
    "phone": "03-6721-7636",
    "phoneStatus": "official_checked",
    "nearestStation": "JR山手線「恵比寿駅」東口 徒歩5分 / 東京メトロ日比谷線「恵比寿駅」1番出口 徒歩7分 (to Yebisu Garden Place, per gardenplace.jp/access)",
    "coordinates": [
      35.642971,
      139.713684
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "not_applicable",
    "checkedAt": "2026-10-12",
    "notes": [
      "에비스 가든플레이스 타워 38층",
      "공식 주소가 4丁目20番까지라 좌표는 가든플레이스 블록 기준",
      "서비스료 10%는 공식 메뉴에서 확인하지 못함"
    ],
    "officialLabel": "가든플레이스 매장 안내에서 보기"
  },
  {
    "id": "roppongi-art-night",
    "nameKo": "롯폰기 아트 나이트 2026",
    "nameJa": "六本木アートナイト2026",
    "nameEn": "Roppongi Art Night 2026",
    "category": "event",
    "area": "롯폰기",
    "address": "六本木ヒルズ、森美術館、東京ミッドタウン、サントリー美術館、21_21 DESIGN SIGHT、国立新美術館、六本木商店街、その他六本木地区の協力施設や公共スペース",
    "addressStatus": "official_checked",
    "officialUrl": "https://roppongiartnight.com/2026/about/",
    "hours": "10/31(土) 17:00 〜 11/1(日) 6:00 コアタイム",
    "closedDays": null,
    "hoursStatus": "official_checked",
    "phone": "050-5541-8600",
    "phoneStatus": "official_checked",
    "nearestStation": null,
    "coordinates": [
      35.660206,
      139.729202
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search (representative point: Roppongi Hills 六本木6-10-1)",
    "coordinatePrecision": "area",
    "taxFree": "not_applicable",
    "checkedAt": "2026-10-12",
    "notes": [
      "코어타임 10/31 17:00 ~ 11/1 06:00 (공식)",
      "기본 무료 — 일부 프로그램·미술관 기획전은 유료, 예약 불필요",
      "롯폰기 힐즈·도쿄 미드타운 등 여러 곳에서 열림 — 지도 점은 롯폰기 힐즈를 대표 지점으로 사용",
      "행사 문의 050-5541-8600 (헬로 다이얼 9:00~20:00)"
    ],
    "mapsQuery": "六本木ヒルズ"
  },
  {
    "id": "dote-no-iseya",
    "nameKo": "도테노 이세야",
    "nameJa": "土手の伊勢屋",
    "nameEn": "Dote no Iseya",
    "category": "restaurant",
    "area": "니혼즈츠미",
    "address": "〒111-0021 東京都台東区日本堤1-9-2",
    "addressStatus": "official_checked",
    "officialUrl": "http://www.dotenoiseya.jp/",
    "hours": "11:00～14:00（売り切れ次第終了） ※店舗情報表では「午前11時〜午後2時30分」と記載あり（ページ内で不一致）。夜の営業なし",
    "closedDays": "毎週火曜・水曜",
    "hoursStatus": "official_checked",
    "phone": "03-3872-4886",
    "phoneStatus": "official_checked",
    "nearestStation": "東京メトロ日比谷線 三ノ輪駅（公式: 722m）",
    "coordinates": [
      35.725098,
      139.797012
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "not_applicable",
    "checkedAt": "2026-10-12",
    "notes": [
      "정기휴무 화·수 — 일요일은 해당 없음",
      "같은 공식 페이지에 폐점 14:00(소진 시 종료)과 14:30이 함께 적혀 있음 → 14:00 기준으로 생각",
      "카드 불가 · 전화 예약 불가",
      "2026년 10~11월 임시휴업 공지는 확인하지 못함 — 당일 확인"
    ]
  },
  {
    "id": "ueno-royal-museum",
    "nameKo": "우에노의 숲 미술관 (신시내티 미술관전)",
    "nameJa": "上野の森美術館",
    "nameEn": "The Ueno Royal Museum",
    "category": "venue",
    "area": "우에노",
    "address": "〒110-0007 東京都台東区上野公園1-2",
    "addressStatus": "official_checked",
    "officialUrl": "https://www.cincinnati-art2026.jp/outline.html",
    "hours": "10:00～17:00（入館は閉館の30分前まで＝16:30）",
    "closedDays": "会期中無休（12/31・1/1も開館）",
    "hoursStatus": "official_checked",
    "phone": "050-5541-8600",
    "phoneStatus": "official_checked",
    "nearestStation": null,
    "coordinates": [
      35.710598,
      139.77356
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "not_applicable",
    "checkedAt": "2026-10-12",
    "notes": [
      "신시내티 미술관전 회기 중 무휴 · 입장 16:30까지",
      "일반 2,400엔 · 날짜·시간 지정 예약 불필요 — 현장 구매로 결정",
      "미국 신시내티 미술관이 아님"
    ]
  },
  {
    "id": "kanda-furuhon-matsuri",
    "nameKo": "칸다 고서축제 (진보초 고서점가)",
    "nameJa": "第66回 東京名物 神田古本まつり",
    "nameEn": "66th Kanda Used Book Festival (Jimbocho)",
    "category": "event",
    "area": "진보초",
    "address": "東京都千代田区神田神保町 神田神保町古書店街（靖国通り沿い・岩波中会場他）",
    "addressStatus": "official_checked",
    "officialUrl": "https://jimbou.info/news/20260908.html",
    "hours": "10:00～18:00（最終日11/1は～17:00）",
    "closedDays": "会期 2026-10-23(金)～11-01(日)（会期中の休みの記載なし）",
    "hoursStatus": "official_checked",
    "phone": null,
    "phoneStatus": null,
    "nearestStation": "神保町駅（GSI地名検索で駅点 35.696430,139.757948 も確認）",
    "coordinates": [
      35.696491,
      139.759079
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "area",
    "taxFree": "not_applicable",
    "checkedAt": "2026-10-12",
    "notes": [
      "10/23~11/1 · 10:00~18:00, 마지막 날 11/1은 17:00까지",
      "약 120개 고서점 참여 · 구역 행사",
      "지도 점은 진보초 1초메 대표 지점 — 특정 판매장 위치가 아님",
      "올해는 이와나미 진보초 빌딩 공사로 일부 장소 변경"
    ],
    "mapsQuery": "神保町 古書店街"
  },
  {
    "id": "milonga-nueva",
    "nameKo": "밀롱가 누오바",
    "nameJa": "ミロンガ・ヌオーバ",
    "nameEn": "Milonga Nueva",
    "category": "cafe",
    "area": "진보초",
    "address": "東京都千代田区神田神保町1-3-3",
    "addressStatus": "third_party_checked",
    "officialUrl": "https://visit-chiyoda.tokyo/app/spot/detail/882（千代田区観光協会）",
    "hours": "平日 11:30～22:30(L.O.22:00)／土日祝 11:30～19:00(L.O.18:30)",
    "closedDays": "水曜日",
    "hoursStatus": "third_party_checked",
    "phone": "03-3295-1716",
    "phoneStatus": "third_party_checked",
    "nearestStation": "神保町駅 徒歩2分（visit-chiyoda）",
    "coordinates": [
      35.695683,
      139.759888
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "not_applicable",
    "checkedAt": "2026-10-12",
    "notes": [
      "공식 사이트 없음 — 치요다구 관광 안내 기준",
      "토·일·공휴일 11:30~19:00 (LO 18:30) · 수요일 휴무 — 일요일 영업",
      "이전 후 진보초 매장 — 시부야·에비스가 아님"
    ],
    "officialLabel": "치요다구 관광 안내에서 보기"
  },
  {
    "id": "akiyoshi-ueno",
    "nameKo": "아키요시 우에노점",
    "nameJa": "やきとりの名門 秋吉 上野店",
    "nameEn": "Akiyoshi Ueno (yakitori)",
    "category": "restaurant",
    "area": "우에노",
    "address": "台東区上野6丁目8-8 POKKE 2F",
    "addressStatus": "official_checked",
    "officialUrl": "https://www.akiyoshi.co.jp/m/shop/shop_details/tokyo/ueno.html",
    "hours": "平日 17:00～22:30／土曜・日曜・祝日 16:00～22:00",
    "closedDays": "年中無休",
    "hoursStatus": "official_checked",
    "phone": "03-5807-0650",
    "phoneStatus": "official_checked",
    "nearestStation": null,
    "coordinates": [
      35.70969,
      139.775528
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "not_applicable",
    "checkedAt": "2026-10-12",
    "notes": [
      "토·일·공휴일 16:00~22:00 · 연중무휴",
      "라스트오더는 공식 페이지에 없음"
    ]
  },
  {
    "id": "marusho-hongo3",
    "nameKo": "마루쇼 혼고산초메점",
    "nameJa": "焼きそばのまるしょう 本郷三丁目店",
    "nameEn": "Yakisoba no Marusho Hongo-sanchome",
    "category": "restaurant",
    "area": "혼고",
    "address": "東京都文京区本郷3-42-7",
    "addressStatus": "official_checked",
    "officialUrl": "https://yakisobano-marusyo.com/shop/hongou3/",
    "hours": "月～土 昼11:00～16:00(L.O.15:30)・夜17:00～23:00(L.O.22:00)／日・祝 昼11:00～16:00(L.O.15:30)・夜17:00～21:00(L.O.20:00)",
    "closedDays": "年中無休（年末年始休業あり）",
    "hoursStatus": "official_checked",
    "phone": "03-3868-2827",
    "phoneStatus": "official_checked",
    "nearestStation": "東京メトロ丸ノ内線・都営大江戸線 本郷三丁目駅 2番/5番出口 徒歩5分",
    "coordinates": [
      35.707397,
      139.764175
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "not_applicable",
    "checkedAt": "2026-10-12",
    "notes": [
      "일요일 저녁 17:00~21:00 (LO 20:00) — 공식"
    ]
  },
  {
    "id": "tsujihan-nihonbashi",
    "nameKo": "츠지한 니혼바시 본점",
    "nameJa": "つじ半 日本橋本店",
    "nameEn": "Tsujihan Nihonbashi (main store)",
    "category": "restaurant",
    "area": "니혼바시",
    "address": "東京都中央区日本橋3-1-15 久栄ビル 1F",
    "addressStatus": "official_checked",
    "officialUrl": "https://www.tsujihan-jp.com/blank",
    "hours": "10:00～22:30(L.O.22:00)（曜日別の区分なし＝月曜も同じ）",
    "closedDays": "不定休（年末年始を除く）",
    "hoursStatus": "official_checked",
    "phone": "03-6262-0823",
    "phoneStatus": "official_checked",
    "nearestStation": null,
    "coordinates": [
      35.680725,
      139.771561
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "not_applicable",
    "checkedAt": "2026-10-12",
    "notes": [
      "부정기 휴무 — 11/2(월) 영업은 보장되지 않음",
      "현장 대기 · 예약 없음"
    ]
  },
  {
    "id": "itoya-ginza",
    "nameKo": "긴자 이토야 본점 (G.Itoya)",
    "nameJa": "銀座 伊東屋 本店（G.Itoya）",
    "nameEn": "Ginza Itoya main store (G.Itoya)",
    "category": "shop",
    "area": "긴자",
    "address": "〒104-0061 東京都中央区銀座2-7-15",
    "addressStatus": "official_checked",
    "officialUrl": "https://www.ito-ya.co.jp/ext/store/ginza/ginza/index.html",
    "hours": "平日 10:00～20:00／日曜・祝日 10:00～19:00（CAFE Stylo 11:30～21:00 L.O.20:00）",
    "closedDays": null,
    "hoursStatus": "official_checked",
    "phone": "03-3561-8311",
    "phoneStatus": "official_checked",
    "nearestStation": "東京メトロ銀座一丁目駅 8番出口 徒歩1分（約100m）／銀座駅 A13出口 徒歩3分",
    "coordinates": [
      35.673069,
      139.767181
    ],
    "coordinateStatus": "geocoded",
    "coordinateMethod": "gsi_address_search",
    "coordinatePrecision": "block",
    "taxFree": "unknown",
    "checkedAt": "2026-10-12",
    "notes": [
      "일요일·공휴일 10:00~19:00 / 평일 10:00~20:00 — 월요일은 평일"
    ]
  }
];
