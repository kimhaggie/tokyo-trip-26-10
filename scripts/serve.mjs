// 로컬 미리보기 서버 — GitHub Pages와 같은 하위 경로(/tokyo-trip-26-10/)로 dist/ 를 제공한다.
// 사용: npm run build && npm run serve  →  http://localhost:4173/tokyo-trip-26-10/
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, normalize, extname } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const BASE = '/tokyo-trip-26-10/';
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.json': 'application/json', '.svg': 'image/svg+xml' };

export function startServer(port = Number(process.env.PORT) || 4173) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/' || url.pathname === '/tokyo-trip-26-10') {
      res.writeHead(302, { Location: BASE });
      return res.end();
    }
    if (!url.pathname.startsWith(BASE)) { res.writeHead(404); return res.end('not found'); }
    let rel = decodeURIComponent(url.pathname.slice(BASE.length)) || 'index.html';
    const file = normalize(join(root, rel));
    if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
    try {
      const s = await stat(file);
      const target = s.isDirectory() ? join(file, 'index.html') : file;
      const body = await readFile(target);
      res.writeHead(200, { 'Content-Type': TYPES[extname(target)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end('not found');
    }
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const s = await startServer();
  console.log(`http://localhost:${s.address().port}${BASE}`);
}
