import { loadState, saveState, smokeFreeDays } from './storage.js';
const $ = id => document.getElementById(id);
let state = { cravings: [], quitDate: '' }, storageReady = true;
try { state = loadState(); } catch { storageReady = false; $('storage-status').textContent = 'Saved data could not be read. Browser storage may be blocked or damaged. Your existing data has not been overwritten.'; }
const messages = [];
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
const today = new Date(); $('quit-date').max = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
$('date-form').addEventListener('submit', e => { e.preventDefault(); const date = $('quit-date').value; if (date > $('quit-date').max) { $('date-status').textContent = 'Choose today or an earlier date.'; return; } persist({ ...state, quitDate: date }, 'date-status'); });
$('intensity').addEventListener('input', () => { $('strength').value = $('intensity').value; });
$('log-form').addEventListener('submit', e => { e.preventDefault(); if (persist({ ...state, cravings: [...state.cravings, { id: crypto.randomUUID(), trigger: $('trigger').value, intensity: Number($('intensity').value), note: $('note').value.trim(), time: new Date().toISOString() }] }, 'log-status')) $('note').value = ''; });
function bubble(role, text) { const article = document.createElement('article'); article.className = `message ${role}`; const speaker = document.createElement('span'); speaker.className = 'speaker'; speaker.textContent = role === 'user' ? 'YOU' : 'AI COMPANION'; const p = document.createElement('p'); p.textContent = text; article.append(speaker, p); $('conversation').append(article); article.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
$('chat-form').addEventListener('submit', async e => {
  e.preventDefault(); if ($('ask').disabled) return;
  const content = $('message').value.trim(); if (!content) return;
  $('ask').disabled = true; $('ask').textContent = 'Thinking…'; $('chat-status').textContent = 'Thinking…';
  bubble('user', content);
  try {
    const recent = [...messages.slice(-10), { role: 'user', content }];
    const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: recent, adult: $('adult').checked }), signal: AbortSignal.timeout(70000) });
    const data = await response.json(); if (!response.ok) throw new Error(data.error);
    bubble('assistant', data.reply); messages.push({ role: 'user', content }, { role: 'assistant', content: data.reply }); $('message').value = ''; $('chat-status').textContent = 'One step at a time.';
  } catch (error) { $('chat-status').textContent = error.message.startsWith('I couldn’t') || error.message.startsWith('Please') ? error.message : 'Couldn’t reach the AI. Please check your key in .env and your internet connection, then try again.'; }
  finally { $('ask').disabled = false; $('ask').textContent = 'Ask AI ↗'; }
});
render();
