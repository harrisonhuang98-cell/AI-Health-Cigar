// All browser persistence lives here, ready to replace with a database adapter.
const KEY = 'ai-health-cigar-v1';
export function loadState() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return { cravings: [], quitDate: '' };
  const value = JSON.parse(raw);
  if (!Array.isArray(value.cravings) || typeof value.quitDate !== 'string') throw new Error('Invalid saved data');
  return value;
}
export function saveState(state) { localStorage.setItem(KEY, JSON.stringify(state)); }
export function smokeFreeDays(date, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 0;
  const [y, m, d] = date.split('-').map(Number);
  return Math.max(0, Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(y, m - 1, d)) / 86400000));
}
