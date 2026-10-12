// 정적 사이트 산출물을 dist/ 로 복사한다. 테스트·문서·스크립트는 넣지 않는다.
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
for (const entry of ['index.html', 'assets', 'data']) {
  const src = join(root, entry);
  if (!existsSync(src)) throw new Error(`빌드 대상 없음: ${entry}`);
  cpSync(src, join(dist, entry), { recursive: true });
}
writeFileSync(join(dist, '.nojekyll'), '');
console.log('dist/ 생성 완료');
