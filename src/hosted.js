// The hosted translator's client (server/): for a player with no Gemini key
// of their own. Download, run, nothing to sign up for.
//
// What is sent: the chat lines that need translating (as to Google before),
// and an id. The id is a HASH - of the player's Steam id once the game's feed
// has said it, of a random install id until then - so an allowance belongs
// to a player, not to an install, and the server never holds a Steam id.
// A player's own key, when they have one, is always used instead.

import crypto from 'node:crypto';

export const hashId = (kind, value) => crypto.createHash('sha256').update('dota-translator|' + kind + '|' + String(value)).digest('hex');

// What the server refused with, in the player's words.
export function explainHosted(code) {
  if (code === 'allowance') return 'Today\'s translations are used up - they come back tomorrow.';
  if (code === 'budget') return 'The translator has reached its limit for this month - it is back on the 1st.';
  return null;
}

export function createHosted({ url, id, version = '', fetchImpl = globalThis.fetch, timeoutMs = 20000 } = {}) {
  const post = async (route, body) => {
    const base = String(typeof url === 'function' ? url() : url || '').replace(/\/+$/, '');
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), timeoutMs);
    let res, data = null;
    try {
      res = await fetchImpl(base + route, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'user-agent': 'dota-translator/' + version },
        body: JSON.stringify({ id: id(), ...body }),
        signal: ctl.signal,
      });
      try { data = await res.json(); } catch { /* not JSON: a proxy's error page */ }
    } catch (err) {
      throw new Error(ctl.signal.aborted ? 'the translator took too long' : 'could not reach the translator');
    } finally { clearTimeout(timer); }
    if (!res.ok) {
      const code = data && data.error;
      throw new Error(explainHosted(code) || (code === 'model' ? String(data.detail || 'http 502') : 'http ' + res.status));
    }
    return data;
  };
  return {
    // The same promise as translateBatch: one row back per row in, everything
    // the caller handed in carried through.
    async translate(items) {
      const data = await post('/v1/translate', { lines: items.map((it) => ({ name: String(it.name || ''), text: String(it.text || '') })) });
      const rows = Array.isArray(data && data.lines) ? data.lines : [];
      return items.map((it, n) => {
        const r = rows[n];
        const ok = Boolean(r && r.translated && typeof r.en === 'string' && r.en.trim());
        return { ...it, en: ok ? r.en : it.text, translated: ok };
      });
    },
    // Once a minute while Dota is in front: 'somebody is in a game'. The id
    // and nothing else; a failure is nobody's business.
    // It answers which prompt version writes each language now, so a line an
    // older prompt wrote is not pasted again from said.json.
    async ping() { try { const d = await post('/v1/ping', {}); return d && d.say && typeof d.say === 'object' ? d.say : null; } catch { return null; } },
    async say(text, into) {
      const data = await post('/v1/say', { text, into });
      return { out: typeof (data && data.out) === 'string' ? data.out : '', v: typeof (data && data.v) === 'string' ? data.v : '' };
    },
  };
}
