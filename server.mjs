import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { askAI } from './ask-ai.mjs';

const port = 3000;
const origin = `http://127.0.0.1:${port}`;
const files = { '/': ['index.html', 'text/html'], '/app.js': ['app.js', 'text/javascript'], '/storage.js': ['storage.js', 'text/javascript'], '/style.css': ['style.css', 'text/css'] };
let busy = false;
const server = createServer(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
  const json = (status, body) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };
  if (req.headers.host !== `127.0.0.1:${port}` && req.headers.host !== `localhost:${port}`) return json(403, { error: 'Local access only.' });
  if (req.method === 'POST' && req.url === '/api/chat') {
    if (![origin, `http://localhost:${port}`].includes(req.headers.origin) || !req.headers['content-type']?.startsWith('application/json')) return json(403, { error: 'Please use the local app.' });
    if (busy) return json(429, { error: 'Please wait for the current answer, then try again.' });
    try {
      let raw = '';
      for await (const chunk of req) { raw += chunk; if (Buffer.byteLength(raw) > 24000) return json(413, { error: 'Please send a shorter conversation.' }); }
      const { messages, adult } = JSON.parse(raw);
      if (adult !== true || !Array.isArray(messages) || messages.length < 1 || messages.length > 12 || messages.at(-1).role !== 'user' || messages.some(m => !['user', 'assistant'].includes(m.role) || typeof m.content !== 'string' || !m.content.trim() || m.content.length > 4000)) return json(400, { error: 'Confirm you are 18 or older and enter a short message.' });
      busy = true;
      try { return json(200, { reply: await askAI(messages.map(({ role, content }) => ({ role, content }))) }); }
      catch { return json(502, { error: 'I couldn’t connect to the AI. Please check the key in .env and your internet connection, then try again. For quitting support, visit https://www.cdc.gov/tobacco/about/how-to-quit.html' }); }
      finally { busy = false; }
    } catch { return json(400, { error: 'Please send a valid, short message.' }); }
  }
  if (req.method !== 'GET' || !files[req.url]) return json(404, { error: 'Not found' });
  const [file, type] = files[req.url];
  try { res.writeHead(200, { 'Content-Type': `${type}; charset=utf-8` }); res.end(await readFile(new URL(`public/${file}`, import.meta.url))); }
  catch { res.end(); }
});
server.listen(port, '127.0.0.1', () => console.log(`AI Health Cigar ready at ${origin}`));
