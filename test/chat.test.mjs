import { test } from 'node:test';
import assert from 'node:assert/strict';
import chat from '../api/chat.js';

test('Vercel handler validates requests and reads the key from server environment', async () => {
  const originalFetch = globalThis.fetch, originalKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = 'fictional-test-key';
  let calls = 0;
  globalThis.fetch = async (url, options) => {
    calls++;
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
    assert.equal(calls,1);
    globalThis.fetch = async () => { throw new Error('Do not expose provider details'); };
    const failed = await request();
    assert.equal(failed.statusCode,502);
    assert.ok(failed.body.error.includes('check the OpenAI key'));
    assert.ok(!JSON.stringify(failed).includes('fictional-test-key'));
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = originalKey;
  }
});
