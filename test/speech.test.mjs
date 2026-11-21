import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

test('speaker uses English voice, stops, resets after failure, and handles unsupported browsers', () => {
  const source = readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  const speech = source.slice(source.indexOf('let activeSpeech;'), source.indexOf("window.addEventListener('pagehide'"));
  const element = () => ({ attrs: {}, children: [], setAttribute(k,v) { this.attrs[k] = v; }, addEventListener(k,fn) { this[k] = fn; }, append(...items) { this.children.push(...items); } });
  let spoken, cancels = 0;
  const voice = { name: 'Natural English', lang: 'en-US', localService: true };
  const window = {
    SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } },
    speechSynthesis: { getVoices: () => [{ name: 'French', lang: 'fr-FR' }, voice], cancel() { cancels++; }, speak(item) { spoken = item; } }
  };
  const context = { window, document: { createElement: element } };
  runInNewContext(speech + ';this.attach = addSpeaker;', context);
  const article = element(); context.attach(article, 'Try a walk. https://example.test');
  const [button, status] = article.children;
  button.click();
  assert.equal(spoken.voice, voice); assert.equal(spoken.rate, 0.95);
  assert.ok(!spoken.text.includes('https://'));
  assert.equal(button.attrs['aria-pressed'], 'true');
  button.click(); assert.equal(button.attrs['aria-pressed'], 'false'); assert.ok(cancels >= 2);
  button.click(); spoken.onerror({ error: 'audio-busy' });
  assert.equal(button.attrs['aria-pressed'], 'false'); assert.ok(status.textContent.includes('could not play'));
  delete window.speechSynthesis;
  const unsupported = element(); context.attach(unsupported, 'Still readable.');
  assert.equal(unsupported.children[0].disabled, true);
});
