import { loadState, saveState, smokeFreeDays } from './storage.js';
const $ = id => document.getElementById(id);
let state = { cravings: [], quitDate: '' }, storageReady = true;
try { state = loadState(); } catch { storageReady = false; $('storage-status').textContent = 'Saved data could not be read. Browser storage may be blocked or damaged. Your existing data has not been overwritten.'; }
const messages = [];
let activeSpeech;
function addSpeaker(article, text) {
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'listen-button';
  const status = document.createElement('span'); status.className = 'speech-status'; status.setAttribute('role', 'status');
  const picker = document.createElement('select'); picker.className = 'voice-picker'; picker.setAttribute('aria-label', 'Reading voice');
  const score = voice => (/natural|neural|enhanced|premium/i.test(voice.name) ? 100 : 0) + (/google/i.test(voice.name) ? 50 : 0) + (/zira/i.test(voice.name) ? 10 : 0) + (voice.default ? 1 : 0);
  const englishVoices = () => window.speechSynthesis.getVoices().filter(voice => /^en(?:-|$)/i.test(voice.lang)).sort((a,b) => score(b) - score(a));
  const updateVoices = () => {
    const selected = picker.value || 'auto';
    picker.replaceChildren();
    const automatic = document.createElement('option'); automatic.value = 'auto'; automatic.textContent = 'Voice: best available'; picker.append(automatic);
    const voices = englishVoices();
    for (const voice of voices) {
      const option = document.createElement('option'); option.value = voice.voiceURI || voice.name;
      option.textContent = `${voice.name}${voice.localService ? ' (on device)' : ' (online)'}`; picker.append(option);
    }
    picker.value = voices.some(voice => (voice.voiceURI || voice.name) === selected) ? selected : 'auto';
  };
  const reset = () => { button.textContent = '🔊 Listen'; button.setAttribute('aria-label', 'Read AI reply aloud'); button.setAttribute('aria-pressed', 'false'); };
  reset();
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    button.disabled = true; status.textContent = 'Read-aloud is unavailable in this browser.';
    picker.hidden = true;
  } else {
    updateVoices();
    picker.addEventListener('focus', updateVoices);
    window.speechSynthesis.addEventListener?.('voiceschanged', updateVoices);
  }
  button.addEventListener('click', () => {
    const wasActive = activeSpeech?.button === button;
    window.speechSynthesis.cancel();
    if (activeSpeech) { activeSpeech.reset(); activeSpeech = undefined; }
    if (wasActive) { status.textContent = 'Stopped.'; return; }
    const utterance = new window.SpeechSynthesisUtterance(text.replace(/https?:\/\/\S+/g, 'the linked resource'));
    const voices = englishVoices();
    // Natural/neural voices and Chrome's Google voices outrank older desktop voices.
    const selected = voices.find(voice => (voice.voiceURI || voice.name) === picker.value) || voices[0];
    if (selected) utterance.voice = selected;
    utterance.lang = utterance.voice?.lang || 'en-US'; utterance.rate = 1; utterance.pitch = 1; utterance.volume = 1;
    const finish = () => { if (activeSpeech?.utterance === utterance) { reset(); activeSpeech = undefined; } };
    utterance.onend = () => { finish(); status.textContent = ''; };
    utterance.onerror = event => { finish(); if (!['canceled','interrupted'].includes(event.error)) status.textContent = 'Audio could not play. Check your browser voice and sound settings.'; };
    button.textContent = '■ Stop'; button.setAttribute('aria-label', 'Stop reading AI reply'); button.setAttribute('aria-pressed', 'true');
    status.textContent = 'Reading aloud.'; activeSpeech = { button, utterance, reset };
    try { window.speechSynthesis.speak(utterance); } catch { finish(); status.textContent = 'Audio is unavailable. You can still read the reply.'; }
  });
  article.append(button, status, picker);
}
window.addEventListener('pagehide', () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); });
function persist(next, status) {
  if (!storageReady) { $(status).textContent = 'Saving is unavailable. Check browser storage settings.'; return false; }
  try { saveState(next); state = next; $(status).textContent = 'Saved on this computer.'; render(); return true; }
  catch { $(status).textContent = 'Couldn’t save. Browser storage may be full or blocked. Please try again.'; return false; }
}
function render() {
  $('quit-date').value = state.quitDate;
  $('days').textContent = smokeFreeDays(state.quitDate);
  $('progress-copy').textContent = state.quitDate ? 'Every smoke-free day is a step forward.' : 'Set your smoke-free start date to begin.';
  $('entries').replaceChildren();
  if (!state.cravings.length) { const p = document.createElement('p'); p.className = 'muted'; p.textContent = 'Your journal starts here. Save a craving above to capture the moment.'; $('entries').append(p); }
  for (const entry of state.cravings.slice().reverse()) {
    const row = document.createElement('article'); row.className = 'entry';
    const title = document.createElement('strong'); title.textContent = `${entry.trigger} · ${entry.intensity}/10`;
    const time = document.createElement('small'); time.textContent = new Date(entry.time).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    const note = document.createElement('p'); note.textContent = entry.note || 'A moment noticed. That matters.';
    row.append(title, time, note); $('entries').append(row);
  }
}
function refreshDayCount() {
  const today = new Date();
  $('quit-date').max = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  $('days').textContent = smokeFreeDays(state.quitDate, today);
}
refreshDayCount();
// Update an open page across midnight and when returning from a sleeping tab.
setInterval(refreshDayCount, 30000);
window.addEventListener('focus', refreshDayCount);
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshDayCount(); });
$('date-form').addEventListener('submit', e => { e.preventDefault(); const date = $('quit-date').value; if (date > $('quit-date').max) { $('date-status').textContent = 'Choose today or an earlier date.'; return; } persist({ ...state, quitDate: date }, 'date-status'); });
$('intensity').addEventListener('input', () => { $('strength').value = $('intensity').value; });
$('log-form').addEventListener('submit', e => { e.preventDefault(); if (persist({ ...state, cravings: [...state.cravings, { id: crypto.randomUUID(), trigger: $('trigger').value, intensity: Number($('intensity').value), note: $('note').value.trim(), time: new Date().toISOString() }] }, 'log-status')) $('note').value = ''; });
function bubble(role, text) {
  const article = document.createElement('article'); article.className = `message ${role}`;
  const speaker = document.createElement('span'); speaker.className = 'speaker'; speaker.textContent = role === 'user' ? 'YOU' : 'AI COMPANION';
  const p = document.createElement('p');
  if (role === 'assistant') {
    const split = text.indexOf('\n');
    const lead = document.createElement('strong'); lead.textContent = split < 0 ? text : text.slice(0, split);
    p.append(lead);
    if (split >= 0) p.append(document.createTextNode(text.slice(split)));
  } else p.textContent = text;
  article.append(speaker, p);
  if (role === 'assistant') addSpeaker(article, text);
  $('conversation').append(article); article.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
$('chat-form').addEventListener('submit', async e => {
  e.preventDefault(); if ($('ask').disabled) return;
  const content = $('message').value.trim(); if (!content) return;
  $('ask').disabled = true; $('ask').textContent = 'Thinking…'; $('chat-status').textContent = 'Thinking…';
  bubble('user', content);
  try {
    const recent = [...messages.slice(-10), { role: 'user', content }];
    const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: recent, adult: $('adult').checked }), signal: AbortSignal.timeout(70000) });
    const data = await response.json(); if (!response.ok) throw Object.assign(new Error(data.error), { fromServer: true });
    bubble('assistant', data.reply); messages.push({ role: 'user', content }, { role: 'assistant', content: data.reply }); $('message').value = ''; $('chat-status').textContent = 'One step at a time.';
  } catch (error) { $('chat-status').textContent = error.fromServer ? error.message : 'Couldn’t reach the AI. Please check your key in .env and your internet connection, then try again.'; }
  finally { $('ask').disabled = false; $('ask').textContent = 'Ask AI ↗'; }
});
render();
