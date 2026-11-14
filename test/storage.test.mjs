import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadState, saveState, smokeFreeDays } from '../public/storage.js';
test('browser adapter saves and reloads records without fictional data', () => {
  const values = new Map();
  globalThis.localStorage = { getItem: k => values.get(k) ?? null, setItem: (k,v) => values.set(k,v) };
  assert.deepEqual(loadState(), { cravings: [], quitDate: '' });
  const state = { cravings: [{ trigger: 'Stress', note: 'Fictional test', intensity: 5 }], quitDate: '2026-11-10' };
  saveState(state); assert.deepEqual(loadState(), state);
  localStorage.setItem('ai-health-cigar-v1', 'damaged');
  assert.throws(loadState);
});
test('calendar-day count works across daylight-saving changes', () => {
  assert.equal(smokeFreeDays('2026-11-01', new Date(2026,10,3,0,1)), 2);
  assert.equal(smokeFreeDays('2026-11-10', new Date(2026,10,10,23)), 0);
  assert.equal(smokeFreeDays('2026-11-15', new Date(2026,10,10)), 0);
});
