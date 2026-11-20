import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getKey } from '../get-key.mjs';

test('key service fails closed without disclosing provider details or using a fallback', async () => {
  const originalFetch = globalThis.fetch;
  const original = { ...process.env };
  process.env.OPENAI_API_KEY = 'fictional-unused-fallback';
  process.env.KEYGEN_URL = 'https://keys.example.test/key';
  process.env.KEYGEN_TOKEN = 'fictional-token';
  try {
    globalThis.fetch = async () => Response.json({ error: 'fictional-private-provider-detail' }, { status: 401 });
    await assert.rejects(getKey(), { message: 'key-service' });
    globalThis.fetch = async () => Response.json({ key: '' });
    await assert.rejects(getKey(), { message: 'key-service' });
    globalThis.fetch = async () => { throw new Error('fictional-private-provider-detail'); };
    await assert.rejects(getKey(), { message: 'key-service' });
    delete process.env.KEYGEN_TOKEN;
    globalThis.fetch = async () => { assert.fail('Missing configuration must not make a network request'); };
    await assert.rejects(getKey(), { message: 'configuration' });
    process.env.KEYGEN_TOKEN = 'fictional-token';
    process.env.KEYGEN_URL = 'http://keys.example.test/key';
    await assert.rejects(getKey(), { message: 'configuration' });
  } finally {
    globalThis.fetch = originalFetch;
    for (const name of ['KEYGEN_URL', 'KEYGEN_TOKEN', 'OPENAI_API_KEY']) {
      if (original[name] === undefined) delete process.env[name]; else process.env[name] = original[name];
    }
  }
});
