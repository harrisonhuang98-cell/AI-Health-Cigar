import { test } from 'node:test';
import assert from 'node:assert/strict';
import chat from '../api/chat.js';

test('Vercel handler validates requests and gets the key through server-only key service', async () => {
  const originalFetch = globalThis.fetch, originalUrl = process.env.KEYGEN_URL, originalToken = process.env.KEYGEN_TOKEN;
  process.env.KEYGEN_URL = 'https://keys.example.test/key';
  process.env.KEYGEN_TOKEN = 'fictional-test-token';
  let calls = 0;
  globalThis.fetch = async (url, options) => {
    calls++;
    if (String(url) === 'https://keys.example.test/key') {
      assert.equal(options.headers.Authorization, 'Bearer fictional-test-token');
      assert.equal(options.redirect, 'error');
      return Response.json({ key: 'fictional-test-key' });
    }
    assert.equal(url, 'https://api.openai.com/v1/responses');
    assert.equal(options.headers.Authorization, 'Bearer fictional-test-key');
    const payload = JSON.parse(options.body);
    assert.equal(payload.model, 'gpt-5.6-luna');
    assert.ok(payload.instructions.includes('Never invent nicotine doses'));
    return Response.json({ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: 'Try a short walk.' }] }] });
  };
  async function request(overrides = {}) {
    const req = { method: 'POST', headers: { host: 'demo.vercel.app', origin: 'https://demo.vercel.app', 'content-type': 'application/json' }, body: { adult: true, messages: [{ role:'user', content:'Fictional craving' }] }, ...overrides };
    const res = { headers: {}, setHeader(k,v) { this.headers[k] = v; }, end(data) { this.body = JSON.parse(data); } };
    await chat(req,res); return res;
  }
  try {
    assert.equal((await request()).body.reply,'Try a short walk.');
    assert.equal((await request({ method:'GET' })).statusCode,405);
    assert.equal((await request({ headers:{ host:'demo.vercel.app', origin:'https://other.example', 'content-type':'application/json' } })).statusCode,403);
    assert.equal((await request({ body:{ adult:false, messages:[] } })).statusCode,400);
    assert.equal((await request({ body:{ adult:true, messages:[null] } })).statusCode,400);
    assert.equal(calls,2);
    globalThis.fetch = async () => { throw new Error('Do not expose provider details'); };
    const failed = await request();
    assert.equal(failed.statusCode,502);
    assert.ok(failed.body.error.includes('key-service settings'));
    assert.ok(!JSON.stringify(failed).includes('fictional-test-key'));
  } finally {
    globalThis.fetch = originalFetch;
    if (originalUrl === undefined) delete process.env.KEYGEN_URL; else process.env.KEYGEN_URL = originalUrl;
    if (originalToken === undefined) delete process.env.KEYGEN_TOKEN; else process.env.KEYGEN_TOKEN = originalToken;
  }
});
