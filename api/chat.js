import { askAI } from '../ask-ai.mjs';
export default async function chat(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const json = (status, body) => { res.statusCode = status; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(body)); };
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return json(405, { error: 'Please use Ask AI.' }); }
  let origin;
  try { origin = new URL(req.headers.origin); } catch { return json(403, { error: 'Please use the app.' }); }
  if (!['https:', 'http:'].includes(origin.protocol) || origin.host !== req.headers.host || !req.headers['content-type']?.startsWith('application/json')) return json(403, { error: 'Please use the app.' });
  try {
    let body = req.body;
    if (body === undefined) {
      let raw = '';
      for await (const chunk of req) { raw += chunk; if (Buffer.byteLength(raw) > 24000) return json(413, { error: 'Please send a shorter conversation.' }); }
      body = JSON.parse(raw);
    } else {
      if (Buffer.byteLength(typeof body === 'string' ? body : JSON.stringify(body)) > 24000) return json(413, { error: 'Please send a shorter conversation.' });
      if (typeof body === 'string') body = JSON.parse(body);
    }
    const { adult, messages } = body ?? {};
    if (adult !== true || !Array.isArray(messages) || !messages.length || messages.length > 12 || messages.at(-1)?.role !== 'user' || messages.some(m => !m || !['user','assistant'].includes(m.role) || typeof m.content !== 'string' || !m.content.trim() || m.content.length > 4000)) return json(400, { error: 'Confirm you are 18 or older and enter a short message.' });
    try { return json(200, { reply: await askAI(messages.map(({role,content}) => ({role,content}))) }); }
    catch { return json(502, { error: 'I couldn’t connect to the AI. Please check the OpenAI key and internet connection, then try again. The site owner can check OPENAI_API_KEY in Vercel, or .env locally. For quitting support, visit https://www.cdc.gov/tobacco/about/how-to-quit.html' }); }
  } catch { return json(400, { error: 'Please send a valid, short message.' }); }
}
