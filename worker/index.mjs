import { assets } from './assets.mjs';

const notesPath = '/api/guestbook';
const json = (value, status = 200) => Response.json(value, {
  status,
  headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
});

async function guestbook(request, env, url) {
  if (!env.DB) return json({ error: 'The sign-in sheet is temporarily unavailable.' }, 503);
  if (request.method === 'GET') {
    const before = url.searchParams.get('before');
    if (before && (!/^\d{1,16}$/.test(before) || !Number.isSafeInteger(Number(before)))) {
      return json({ error: 'Invalid page.' }, 400);
    }
    const rows = await env.DB.prepare(
      'SELECT id, message FROM guestbook_notes WHERE id < ? ORDER BY id DESC LIMIT 25',
    ).bind(before ? Number(before) : Number.MAX_SAFE_INTEGER).all();
    return json({ notes: rows.results, next: rows.results.length === 25 ? rows.results.at(-1).id : null });
  }
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  if (request.headers.get('Origin') !== url.origin || !request.headers.get('Content-Type')?.startsWith('application/json')) {
    return json({ error: 'Invalid request.' }, 403);
  }
  const reader = request.body?.getReader();
  if (!reader) return json({ error: 'Write a note first.' }, 400);
  let size = 0;
  const decoder = new TextDecoder();
  let body = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 4096) {
      await reader.cancel();
      return json({ error: 'This note is too long.' }, 413);
    }
    body += decoder.decode(value, { stream: true });
  }
  body += decoder.decode();
  let input;
  try { input = JSON.parse(body); } catch { return json({ error: 'Invalid note.' }, 400); }
  const message = typeof input?.message === 'string' ? input.message.trim() : '';
  const key = input?.requestId;
  if (!message || message.length > 400 || typeof key !== 'string' || !/^[a-f0-9-]{36}$/.test(key)) {
    return json({ error: 'Write a note between 1 and 400 characters.' }, 400);
  }
  const identity = request.headers.get('oai-authenticated-user-id') ?? request.headers.get('CF-Connecting-IP') ?? 'guest';
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(identity));
  const writer = Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
  const now = Date.now();
  await env.DB.prepare(`INSERT INTO guestbook_notes (request_id, writer_key, message, created_at)
    SELECT ?, ?, ?, ? WHERE NOT EXISTS (
      SELECT 1 FROM guestbook_notes WHERE writer_key = ? AND created_at > ?
    ) ON CONFLICT(request_id) DO NOTHING`).bind(key, writer, message, now, writer, now - 15000).run();
  const note = await env.DB.prepare('SELECT id, message FROM guestbook_notes WHERE request_id = ? AND writer_key = ?').bind(key, writer).first();
  return note ? json({ note }, 201) : json({ error: 'Wait a moment before signing again.' }, 429);
}

const workshop = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === notesPath) {
      try { return await guestbook(request, env, url); }
      catch (error) { console.error(error); return json({ error: 'The sign-in sheet is temporarily unavailable.' }, 503); }
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response(null, { status: 405 });
    const path = url.pathname;
    const asset = assets[path] ?? assets[path + '/'] ?? assets['/404.html'];
    if (!asset) return new Response(null, { status: 404 });
    const [type, base64] = asset;
    return new Response(request.method === 'HEAD' ? null : Uint8Array.from(atob(base64), symbol => symbol.charCodeAt(0)), {
      status: asset === assets['/404.html'] ? 404 : 200,
      headers: { 'Content-Type': type, 'Cache-Control': path.startsWith('/_next/static/') ? 'public, max-age=31536000, immutable' : 'no-cache' },
    });
  },
};

export default workshop;
