import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { loadEnvFile } from 'node:process';
import chat from './api/chat.js';
// Only the local launcher reads .env. Vercel runs api/chat.js directly.
try { loadEnvFile(new URL('.env', import.meta.url)); } catch (error) { if (error.code !== 'ENOENT') throw new Error('Could not load local configuration.'); }
const port = Number(process.env.PORT || 3000);
const files = { '/': ['index.html', 'text/html'], '/app.js': ['app.js', 'text/javascript'], '/storage.js': ['storage.js', 'text/javascript'], '/style.css': ['style.css', 'text/css'] };
createServer(async (req,res) => {
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
  if (![ `127.0.0.1:${port}`, `localhost:${port}` ].includes(req.headers.host)) { res.writeHead(403); return res.end(); }
  if (req.url === '/api/chat') return chat(req,res);
  if (req.method !== 'GET' || !files[req.url]) { res.writeHead(404); return res.end(); }
  const [file,type] = files[req.url];
  try { const content = await readFile(new URL(`public/${file}`,import.meta.url)); res.writeHead(200,{'Content-Type':`${type}; charset=utf-8`}); res.end(content); }
  catch { res.writeHead(500); res.end('Could not load page.'); }
}).listen(port,'127.0.0.1',()=>console.log(`AI Health Cigar ready at http://127.0.0.1:${port}`));
