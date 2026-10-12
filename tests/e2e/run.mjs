// 브라우저 화면 검증 (로컬 전용) — 설치된 Chrome을 playwright-core로 구동한다.
// 사용: npm run test:e2e   (스크린샷은 test-results/ 에 저장, 커밋하지 않음)
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { startServer } from '../../scripts/serve.mjs';

const OUT = new URL('../../test-results/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const server = await startServer(0);
const BASE = `http://127.0.0.1:${server.address().port}/tokyo-trip-26-10/`;
const browser = await chromium.launch({ channel: process.env.E2E_CHANNEL || 'chrome', headless: true });

const failures = [];
const check = (cond, msg) => { if (!cond) failures.push(msg); };

async function newPage(width, height = 900, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, locale: 'ko-KR', timezoneId: 'Asia/Tokyo', ...opts });
  const page = await ctx.newPage();
  const errors = [];
  const bad = [];
  const external = [];
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('response', (r) => {
    if (r.status() < 400) return;
    if (r.url().startsWith(BASE)) bad.push(`${r.status()} ${r.url()}`);
    else external.push(`${r.status()} ${r.url()}`);
  });
  return { ctx, page, errors, bad, external };
}

async function noHorizontalScroll(page, label) {
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(over <= 1, `${label}: 가로 스크롤 ${over}px`);
}

const TABS = ['summary', 'day-1', 'day-2', 'day-3', 'day-4', 'day-5', 'bookings', 'shopping', 'meals', 'prep'];

for (const width of [360, 390, 1440]) {
  const { ctx, page, errors, bad, external } = await newPage(width);
  await page.goto(BASE + '#summary', { waitUntil: 'networkidle' });
  for (const tab of TABS) {
    await page.click(`#tab-${tab}`);
    await page.waitForTimeout(tab.startsWith('day') ? 1200 : 200);
    await noHorizontalScroll(page, `${width}px ${tab}`);
    await page.screenshot({ path: `${OUT}${width}-${tab}.png`, fullPage: tab !== 'day-3' || width === 1440 });
  }
  check(errors.length === 0, `${width}px 콘솔 오류: ${errors.join(' | ')}`);
  check(bad.length === 0, `${width}px 404 등: ${bad.join(' | ')}`);
  if (external.length) console.log(`${width}px 외부 리소스 실패 (사이트 파일 아님): ${[...new Set(external)].slice(0, 5).join(' | ')}`);
  await ctx.close();
}

// 기능: 선택·체크·새로고침 유지
{
  const { ctx, page, errors } = await newPage(390);
  await page.goto(BASE + '#day-3', { waitUntil: 'networkidle' });
  const tiles = await page.locator('#app .leaflet-tile-loaded').count();
  check(tiles > 0, '지도 타일 로드 안 됨');
  check(await page.locator('#app .leaflet-control-attribution').count() === 1, '지도 출처 표시 없음');
  check((await page.locator('#app .leaflet-marker-icon').count()) >= 14, '토요일 마커 수 부족');
  // 캐피탈 이월
  await page.locator('#item-d3-kapital-legs').getByRole('button', { name: '월요일로 넘기기' }).click();
  await page.getByRole('button', { name: '간다' }).click();
  await page.reload({ waitUntil: 'networkidle' });
  check(await page.getByText('토요일 동선에서 뺌 — 월요일 옵션에서 고를 수 있어요').count() === 1, '이월 상태가 새로고침 후 유지되지 않음');
  check(await page.getByRole('button', { name: '간다', pressed: true }).count() === 1, '아트 나이트 선택 유지 안 됨');
  await page.click('#tab-day-5');
  const monPins = () => page.$$eval('#app .leaflet-marker-icon .pin', (e) => e.map((x) => x.textContent));
  const before = await monPins();
  check(!before.some((t) => t === '2' || t === '?'), `월요일 기본은 옵션 없이 시작해야 함: ${before}`);
  await page.locator('#item-d5-tsujihan').getByLabel('동선에 넣기').check();
  await page.locator('#item-d5-kapital-legs').getByLabel('동선에 넣기').check();
  const after = await monPins();
  check(after.includes('2') && after.includes('3'), `월요일 옵션을 넣어도 번호가 생기지 않음: ${after}`);
  await page.screenshot({ path: `${OUT}flow-monday.png`, fullPage: true });
  // 일요일 분기
  await page.click('#tab-day-4');
  for (const id of ['d4-akiyoshi', 'd4-marusho']) {
    const dashed = await page.locator(`#item-${id} .num`).evaluate((e) => e.classList.contains('opt') && e.textContent === '?');
    check(dashed, `일요일 저녁 미정인데 ${id}가 점선 ?가 아님`);
  }
  await page.getByRole('button', { name: '아키요시' }).first().click();
  await page.getByRole('button', { name: '책 먼저' }).click();
  check(await page.locator('#app').getByText('마루쇼 혼고산초메 — 특제 소스 야키소바').count() === 0, '아키요시 선택 후 마루쇼 표시');
  await page.screenshot({ path: `${OUT}flow-sunday.png`, fullPage: true });
  // 식사 표가 같은 상태
  await page.click('#tab-meals');
  check(await page.locator('table').getByText('아키요시 우에노').count() === 1, '식사 표 반영 안 됨');
  // 손상된 저장 데이터
  await page.evaluate(() => localStorage.setItem('tokyo-trip-26-10:state:v1', '{broken'));
  await page.reload({ waitUntil: 'networkidle' });
  check(await page.locator('.tab').count() === 10, '손상 데이터에서 앱 복구 실패');
  // XSS: 메모는 텍스트로만
  await page.click('#tab-prep');
  await page.fill('#n-general', '<img src=x onerror="window.__xss=1">');
  await page.locator('#n-general').blur();
  await page.reload({ waitUntil: 'networkidle' });
  check(await page.evaluate(() => window.__xss) === undefined, 'XSS 실행됨');
  check(await page.inputValue('#n-general') === '<img src=x onerror="window.__xss=1">', '메모 유지 안 됨');
  check(errors.length === 0, `기능 테스트 콘솔 오류: ${errors.join(' | ')}`);
  // 외부 링크 rel
  const unsafe = await page.evaluate(() => [...document.querySelectorAll('a[target=_blank]')].filter((a) => !/noopener/.test(a.rel)).length);
  check(unsafe === 0, `rel 없는 외부 링크 ${unsafe}개`);
  await ctx.close();
}

// 지도 타일·Leaflet 실패에도 일정 조회 가능
{
  const { ctx, page } = await newPage(390);
  await ctx.route(/cyberjapandata\.gsi\.go\.jp|leaflet\.js/, (r) => r.abort());
  await page.goto(BASE + '#day-2', { waitUntil: 'networkidle' });
  check(await page.getByText('아오야마 가와카미안 — 닭 숯불구이 + 세이로').count() === 1, '지도 실패 시 일정이 안 보임');
  check(await page.getByText('지도를 불러오지 못했습니다').count() >= 1, '지도 실패 안내 없음');
  await page.screenshot({ path: `${OUT}map-failure.png`, fullPage: false });
  await ctx.close();
}

await browser.close();
server.close();
if (failures.length) {
  console.error(`E2E 실패 ${failures.length}건:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`E2E 통과 — 스크린샷: ${OUT}`);
