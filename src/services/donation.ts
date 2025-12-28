export async function registerPaymentWithBackend(saleId: string) {
  try {
    const userRaw = localStorage.getItem('user') || '';
    let userId = '';
    if (userRaw) {
      try { const u = JSON.parse(userRaw); userId = u?.id || u?.user?.id || ''; } catch {console.warn('donation.registerPaymentWithBackend: error parsing user from localStorage'); }
    }
    const token = localStorage.getItem('token') || localStorage.getItem('swas_auth_token') || '';
    let backendBase = (import.meta.env.VITE_BACKEND_URL || '').trim();
    if (!backendBase) return { ok: false, error: 'no-backend-configured' };
    backendBase = backendBase.replace(/\/$/, '');
    let url = '';
    if (backendBase.endsWith('/api')) url = `${backendBase}/payments/register`;
    else url = `${backendBase}/api/payments/register`;
    const headers: Record<string,string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    // No longer send or verify VITE_PROJECT_ID from the client — backend should determine project context if needed
    const bodyPayload = { saleId, userId };
    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(bodyPayload) });
    let json = null;
    try { json = await res.json(); } catch { console.warn('donation.registerPaymentWithBackend: error parsing JSON response'); }
    if (!res.ok) return { ok: false, status: res.status, body: json };
    return { ok: true, status: res.status, body: json };
  } catch (err) {
    console.warn('donation.registerPaymentWithBackend', err);
    return { ok: false, error: String(err) };
  }
}

export function extractUserId(): string {
  try {
    const raw = localStorage.getItem('user') || '';
    if (raw) { const u = JSON.parse(raw); return u?.id || u?.user?.id || ''; }
    const token = localStorage.getItem('token') || localStorage.getItem('swas_auth_token') || '';
    if (!token) return '';
    const parts = token.split('.'); if (parts.length < 2) return '';
    let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/'); while (b64.length % 4 !== 0) b64 += '=';
    const decoded = atob(b64);
    const json = decodeURIComponent(Array.prototype.map.call(decoded, (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    const obj = JSON.parse(json);
    return (obj && (obj.sub || obj.user_id || obj.uid)) || '';
  } catch {
    return '';
  }
}
