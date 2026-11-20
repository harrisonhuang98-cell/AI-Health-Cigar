// Server-only. Never import this module from public/.
export async function getKey() {
  const token = process.env.KEYGEN_TOKEN?.trim();
  let url;
  try { url = new URL(process.env.KEYGEN_URL); } catch { throw new Error('configuration'); }
  if (url.protocol !== 'https:' || url.username || url.password || !token) throw new Error('configuration');
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) throw new Error('key-service');
    const data = await response.json();
    const key = data?.key ?? data?.apiKey ?? data?.api_key;
    if (typeof key !== 'string' || !key.trim() || /\s/.test(key.trim())) throw new Error('key-service');
    return key.trim();
  } catch { throw new Error('key-service'); }
}
