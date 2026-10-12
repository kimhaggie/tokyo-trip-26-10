# 도쿄 4박 5일 여행 노트 (2026.10.29 – 11.02)

여행 중 스마트폰으로 보는 정적 웹사이트. 날짜별 일정·지도·예약·쇼핑·식사·준비사항을 한 데이터로 보여 준다.

- 배포: https://kimhaggie.github.io/tokyo-trip-26-10/ (GitHub Pages, 공개)
- 빌드 도구 없음 — HTML/CSS/JS(ES 모듈) + Leaflet(저장소에 포함) + 국토지리원 지도 타일

## 구조

```text
index.html              페이지 뼈대
assets/app.js           화면 렌더링 (탭·일정표·예약·쇼핑·식사·준비)
assets/logic.js         DOM 없는 계산 — 동선, 선택 상태, 링크, 저장 데이터 검증 (테스트 대상)
assets/maps.js          Leaflet 지도
assets/state.js         localStorage 저장
assets/styles.css
assets/vendor/leaflet/  Leaflet 1.9.4 (BSD-2, LICENSE 포함)
data/trip.js            일정·예약·선택지·준비 목록  ← 일정 수정은 여기
data/places.js          장소(주소·영업시간·좌표·출처)  ← 매장 정보 수정은 여기
data/sources.js         장소 외 사실의 출처
scripts/validate-data.mjs  데이터 검사
scripts/build.mjs       dist/ 생성 (index.html, assets, data만 복사)
scripts/serve.mjs       로컬 서버 (Pages와 같은 /tokyo-trip-26-10/ 경로)
tests/*.test.mjs        데이터·로직 테스트 (node:test)
tests/e2e/run.mjs       브라우저 화면 테스트 (로컬 전용, 설치된 Chrome 사용)
docs/verification.md    확인한 것 / 남은 확인 사항
```

## 로컬 실행

```sh
npm install          # 개발용 (playwright-core, leaflet 원본)
npm test             # 데이터 검사 + 단위 테스트
npm run build        # dist/ 생성
npm run serve        # http://localhost:4173/tokyo-trip-26-10/
npm run test:e2e     # 360/390/1440px 스크린샷·기능 검사 → test-results/
```

ES 모듈을 쓰므로 `index.html`을 파일로 바로 열면 동작하지 않는다. 로컬 서버로 연다.

## 데이터 수정

- 일정 아이템은 `data/trip.js`의 `DAYS[].items` 순서대로 표시된다. 장소는 `placeId`로 `data/places.js`를 참조한다 — 같은 매장을 두 번 정의하지 않는다.
- 상태 값
  - `priority`: `core`(본 일정) / `optional`(선택) / `backup`(대안)
  - `reservation.status`: `confirmed`(예약 완료 — `bookingId` 필수) / `walk_in` / `not_reserved` / `not_applicable`
  - `time.nature`: `fixed` / `target` / `estimated` / `flexible`, 시각은 `+09:00` ISO
  - 장소 `*Status`: `official_checked` / `third_party_checked` / `user_confirmed` / `needs_verification`
- 좌표는 공식 주소를 국토지리원 주소 검색에 넣어 얻는다. 모르면 `null` — 지도에 찍히지 않고 “지도 위치 확인 필요”로 표시된다.
- 수정 후 `npm test`로 검사한다. 예약 3건·날짜·제외 목록 등이 깨지면 테스트가 실패하고 배포되지 않는다.

## 배포

`main`에 push하면 GitHub Actions(`.github/workflows/deploy.yml`)가 테스트 → 빌드 → Pages 배포를 한다. 테스트가 실패하면 배포하지 않는다. Actions 탭에서 수동 실행(`workflow_dispatch`)도 된다.

저장소 Settings → Pages의 Source는 **GitHub Actions**여야 한다.

## 브라우저 저장 데이터

체크·선택·메모는 브라우저 localStorage(`tokyo-trip-26-10:state:v1`)에만 저장되고 기기 간 동기화되지 않는다.

- 다른 기기로 옮기기: 준비·유의 탭 → JSON 내보내기 / 가져오기
- 초기화: 준비·유의 탭 → 상태 초기화 (확인 후 삭제), 또는 브라우저 개발자 도구에서 위 키 삭제

## 공개 범위

GitHub Pages 사이트는 누구나 열 수 있다 (`noindex`만 설정). 예약번호·예약자 이름·개인 연락처·항공권 정보는 넣지 않는다. 화면에서 숨겨도 HTML/JS에는 남는다는 점에 주의.
