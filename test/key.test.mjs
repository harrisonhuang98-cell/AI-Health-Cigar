import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getKey, invalidateKey } from '../get-key.mjs';

test('MindDo POST caches until expiry, shares requests, invalidates and handles errors without retries', async () => {
  const originalFetch = globalThis.fetch, originalError = console.error;
  const original = { ...process.env };
  process.env.KEYGEN_URL = 'https://keys.example.test/';
  process.env.KEYGEN_TOKEN = 'fictional-token';
  let calls = 0, now = Date.now(), clock = Date.now;
  const logs = [];
  Date.now = () => now;
  console.error = (...args) => logs.push(args.join(' '));
  globalThis.fetch = async (url, options) => {
    calls++;
    assert.equal(String(url), 'https://keys.example.test/api/lookup-key');
    assert.equal(options.method, 'POST');
    assert.equal(options.headers.Authorization, 'Bearer fictional-token');
    assert.equal(options.redirect, 'error');
    return Response.json({ apiKey: 'fictional-ai-key', expiresAt: new Date(now + 1000).toISOString() });
  };
  try {
    invalidateKey();
    assert.deepEqual(await Promise.all([getKey(), getKey()]), ['fictional-ai-key', 'fictional-ai-key']);
    assert.equal(calls, 1);
    await getKey(); assert.equal(calls, 1);
    now += 1001;
    await getKey(); assert.equal(calls, 2);
    invalidateKey('fictional-ai-key');
    await getKey(); assert.equal(calls, 3);
    invalidateKey();
    globalThis.fetch = async () => { calls++; return Response.json({ error: { message: 'Please renew fictional-token', fix: 'Replace fictional-token in server settings' } }, { status: 401 }); };
    await assert.rejects(getKey(), error => error.publicMessage === 'Please renew [redacted]');
    assert.equal(calls, 4);
    assert.ok(logs.some(line => line.includes('Replace [redacted]')));
    assert.ok(!logs.join().includes('fictional-token'));
    globalThis.fetch = async () => Response.json({ apiKey: 'fictional-ai-key', expiresAt: 'invalid' });
    await assert.rejects(getKey());
    delete process.env.KEYGEN_TOKEN;
    globalThis.fetch = async () => assert.fail('No request without configuration');
    await assert.rejects(getKey());
  } finally {
    invalidateKey(); globalThis.fetch = originalFetch; console.error = originalError; Date.now = clock;
    for (const name of ['KEYGEN_URL', 'KEYGEN_TOKEN']) {
      if (original[name] === undefined) delete process.env[name]; else process.env[name] = original[name];
    }
  }
});
