import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { smokeFreeDays } from '../public/storage.js';

test('open page updates across midnight without overwriting drafts or saving data', () => {
  let current = new Date(2026, 10, 20, 23, 59), tick;
  const handlers = {}, elements = new Map();
  const element = () => ({ value: '', textContent: '', addEventListener() {}, replaceChildren() {}, append() {} });
  const document = {
    hidden: false,
    getElementById(id) { if (!elements.has(id)) elements.set(id, element()); return elements.get(id); },
    createElement: element,
    addEventListener(name, fn) { handlers[name] = fn; }
  };
  class Clock extends Date { constructor(...args) { super(...(args.length ? args : [current])); } }
  const source = readFileSync(new URL('../public/app.js', import.meta.url), 'utf8').replace(/^import .*;\r?\n/, '');
  runInNewContext(source, {
    document, Date: Clock, smokeFreeDays,
    loadState: () => ({ cravings: [], quitDate: '2026-11-19' }),
    saveState() { assert.fail('Clock updates must not write storage'); },
    setInterval(fn) { tick = fn; },
    window: { addEventListener(name, fn) { handlers[name] = fn; } }
  });
  assert.equal(elements.get('days').textContent, 1);
  elements.get('quit-date').value = '2026-11-18';
  document.getElementById('note').value = 'Unfinished note';
  current = new Date(2026, 10, 21, 0, 1);
  tick();
  assert.equal(elements.get('days').textContent, 2);
  assert.equal(elements.get('quit-date').max, '2026-11-21');
  assert.equal(elements.get('quit-date').value, '2026-11-18');
  assert.equal(elements.get('note').value, 'Unfinished note');
  current = new Date(2026, 10, 22, 8);
  handlers.visibilitychange();
  assert.equal(elements.get('days').textContent, 3);
});
