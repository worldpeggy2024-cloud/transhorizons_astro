/*
 * URL resolution check (opt-in, network) — used by validate-country-citations.cjs
 * under the --check-urls flag. It exists because the LLM-level "open the URL
 * before you cite it" discipline is unreliable: a model will flag a link
 * "unchecked" and then rationalise never checking it. A fetch does not negotiate.
 *
 * It answers only ONE question — does the URL resolve to a live document? — not
 * whether that document is the RIGHT one (semantic match still needs a reader).
 * Classification is deliberately asymmetric so government/stats sites that block
 * bots never read as failures:
 *   ok:true   2xx                                  → resolves. Silent.
 *   ok:false  404 / 410 / DNS-fail / refused / bad → SUSPECT: dead or constructed.
 *                                                     THE catch — a constructed link
 *                                                     is a right-host/wrong-path 404
 *                                                     or a wrong-host DNS failure.
 *   ok:null   401/403/429 (bot-blocked), 5xx,      → UNCONFIRMED: a human opens it.
 *             timeout, redirect loop                  Never treated as failure.
 */

'use strict';

async function checkUrl(url, timeoutMs = 10000) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeoutMs);
  const headers = {
    'User-Agent': 'Mozilla/5.0 (compatible; TransHorizons-linkcheck/1.0; sources-audit)',
    Accept: 'text/html,application/xhtml+xml,application/pdf,*/*',
  };
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctl.signal, headers });
    const status = res.status;
    try { await res.body?.cancel(); } catch { /* body unread — fine */ }
    if (status >= 200 && status < 300) return { ok: true, status, note: 'resolves' };
    if (status === 404 || status === 410) return { ok: false, status, note: 'not found' };
    if (status === 401 || status === 403 || status === 429) return { ok: null, status, note: 'blocked (bot) — open manually' };
    if (status >= 500) return { ok: null, status, note: 'server error — retry / open manually' };
    if (status >= 300 && status < 400) return { ok: null, status, note: 'unresolved redirect — open manually' };
    return { ok: false, status, note: `unexpected status ${status}` };
  } catch (e) {
    if (e && e.name === 'AbortError') return { ok: null, status: 0, note: 'timeout — open manually' };
    const code = String((e && (e.cause?.code || e.code)) || (e && e.message) || 'network error');
    // DNS miss / refused / malformed URL / TLS = strong "wrong or dead host" signal
    const strong = /ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ECONNRESET|ERR_INVALID_URL|CERT|ERR_TLS/i.test(code);
    return { ok: strong ? false : null, status: 0, note: code };
  } finally {
    clearTimeout(timer);
  }
}

// Concurrency-limited map (no external deps). Preserves input order.
async function mapPool(items, concurrency, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const idx = next++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, Math.min(concurrency, items.length)) }, worker));
  return results;
}

module.exports = { checkUrl, mapPool };
