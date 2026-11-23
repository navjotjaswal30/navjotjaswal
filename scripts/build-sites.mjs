import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';

const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon',
  '.pdf': 'application/pdf', '.woff': 'font/woff', '.woff2': 'font/woff2',
};
const assets = {};
for (const entry of await readdir('out', { recursive: true, withFileTypes: true })) {
  if (!entry.isFile()) continue;
  const source = entry.parentPath + '/' + entry.name;
  const path = '/' + source.slice('out/'.length);
  const key = path.endsWith('/index.html') ? path.slice(0, -'index.html'.length) : path;
  assets[key] = [types[extname(entry.name)] ?? 'application/octet-stream', (await readFile(source)).toString('base64')];
}
await mkdir('dist/server', { recursive: true });
await writeFile('dist/server/index.js', 'const assets = Object.assign(Object.create(null), ' + JSON.stringify(assets) + ');\n' +
  (await readFile('worker/index.mjs', 'utf8')).replace("import { assets } from './assets.mjs';\n", ''));
await mkdir('dist/.openai', { recursive: true });
await cp('.openai/hosting.json', 'dist/.openai/hosting.json');
await cp('drizzle', 'dist/drizzle', { recursive: true });
