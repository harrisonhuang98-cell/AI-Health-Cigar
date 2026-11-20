// Server-only: cached credentials never leave this module except to the AI caller.
let cached, pending;
export function invalidateKey(key) {
  if (!key || cached?.key === key) cached = undefined;
}
function safeText(value, token) {
  if (typeof value !== 'string') return '';
  let text = value.slice(0, 2000);
  for (const secret of [token, cached?.key]) if (secret) text = text.split(secret).join('[redacted]');
  return text.replace(/Bearer\s+\S+|sk-[\w-]+|gh[pousr]_[\w]+/gi, '[redacted]');
}
export async function getKey() {
  const token = process.env.KEYGEN_TOKEN?.trim();
  let url;
  try {
    url = new URL(process.env.KEYGEN_URL);
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || !token || token === 'paste-here') throw new Error();
    url.pathname = url.pathname.replace(/\/$/, '') + '/api/lookup-key';
  } catch { throw new Error('Please configure KEYGEN_URL and KEYGEN_TOKEN on the server.'); }
  const identity = url.href + '\n' + token;
  if (cached?.identity === identity && cached.expiresAt > Date.now()) return cached.key;
  if (pending?.identity === identity) return pending.promise;
  const promise = (async () => {
    try {
      const response = await fetch(url, {
        method: 'POST', headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(10000)
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        const message = safeText(data.error?.message, token) || 'MindDo could not provide an AI key.';
        const fix = safeText(data.error?.fix, token) || 'Check the MindDo URL and token in server settings.';
        console.error('MindDo fix:', fix);
        const error = new Error(message);
        error.publicMessage = message;
        throw error;
      }
      const key = data.apiKey;
      const expiresAt = typeof data.expiresAt === 'number'
        ? (data.expiresAt < 1e12 ? data.expiresAt * 1000 : data.expiresAt)
        : Date.parse(data.expiresAt);
      if (typeof key !== 'string' || !key.trim() || /\s/.test(key.trim()) || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) throw new Error();
      cached = { key: key.trim(), expiresAt, identity };
      return cached.key;
    } catch (error) {
      if (error.publicMessage) throw error;
      console.error('MindDo fix: Check the direct HTTPS base URL, token, network connection and key expiry response.');
      throw new Error('Please check the server’s MindDo settings and try again.');
    }
  })();
  pending = { identity, promise };
  try { return await promise; } finally { if (pending?.promise === promise) pending = undefined; }
}
