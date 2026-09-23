// The other direction: what the PLAYER wants to say, in the language the
// people they are playing with have been typing in.
//
// Asked for by the first people who saw the app ("no point in receiving
// messages in English if he doesn't understand me"). Nothing is sent to
// the game and nothing is typed into it: the translation goes on the
// CLIPBOARD and the player pastes it into the game's chat themselves. The
// app reads the game and never touches it; this does not change that.
//
// Which language is not a guess. The app reads every line the others
// type, so it knows what they write in: the script seen most recently
// decides, and Russian - what this is for - until anything has been seen.

import { SCRIPTS } from './chatlog.js';
import { askGeminiHedged } from './translate.js';

// A script is not a language - Cyrillic is also Ukrainian, Arabic script
// also Persian - but on the servers this is for, it is the right bet, and
// `replyLanguage` in config.json overrides it.
// Two languages told apart from their neighbours by letters only they use
// (a review, 2026-09-23: Ctrl+Enter answered a Ukrainian teammate in RUSSIAN,
// a Persian one in Arabic). Checked first; the gate itself is unchanged.
// Persian is told by the KEYBOARD, not by letters Iraqi and Gulf Arabic also
// write (a review, 2026-09-23: چ and گ flipped Iraqi players to Persian and
// missed most Persian): a Persian keyboard types ی and ک, an Arabic one ي, ك
// and ة - so Persian letters with none of the Arabic keyboard's.
const OWN_LETTERS = {
  ukrainian: /[\u0456\u0457\u0454\u0491\u0406\u0407\u0404\u0490]/,
  persian: { test: (t) => /[\u06CC\u06A9\u067E\u0698]/.test(t) && !/[\u064A\u0643\u0629\u0649]/.test(t) },
};
export const SCRIPT_LANGUAGE = {
  ukrainian: 'Ukrainian',
  cyrillic: 'Russian',
  han: 'Chinese',
  hangul: 'Korean',
  greek: 'Greek',
  persian: 'Persian',
  arabic: 'Arabic',
  thai: 'Thai',
  spanish: 'Spanish',       // last: a line with any other script is that script
};

export const MAX_SAY = 200;          // a chat line, not a letter

export function scriptOf(text) {
  const t = String(text || '');
  for (const name of Object.keys(SCRIPT_LANGUAGE)) if ((OWN_LETTERS[name] || SCRIPTS[name]).test(t)) return name;
  return '';
}

/** Remembers what the others last wrote in. */
export function createLanguageTracker({ fallback = 'Russian' } = {}) {
  // The fallback is the language the player SAID their teammates write
  // (theirLanguage in config), until somebody has written anything.
  let last = '';
  return {
    fallback,
    saw(text) { const s = scriptOf(text); if (s) last = s; },
    get language() { return SCRIPT_LANGUAGE[last] || this.fallback; },
    // The player just said what their teammates write: that wins over a line
    // seen before (a review, 2026-09-23: a Russian line seen in an EU game
    // kept Ctrl+Enter in Russian after Chinese was chosen for SEA).
    choose(language) { this.fallback = language; last = ''; },
  };
}

/** `replyLanguage` from config: "auto", or a language by name. */
export function targetLanguage(setting, tracker) {
  const s = String(setting || 'auto').trim();
  if (!s || s.toLowerCase() === 'auto') return tracker ? tracker.language : 'Russian';
  // It goes into a prompt: letters and spaces, and not many of them.
  const clean = s.replace(/[^\p{L} ]/gu, '').slice(0, 24).trim();
  return clean || 'Russian';
}

export function tidySay(text) {
  return String(text == null ? '' : text).replace(/\s+/g, ' ').trim().slice(0, MAX_SAY);
}

export function outSystem(language) {
  return [
    // "from whatever language": the second key sends a line in ENGLISH, for
    // the player who types Russian (or anything) to English speakers - the
    // same tool pointed the other way (the user, 2026-09-21).
    `You translate what a Dota 2 player wants to type in the in-game chat, from whatever language they wrote it in (usually English or Russian, sometimes Russian typed in Latin letters), into ${language}.`,
    'The input is JSON: {"text": "..."}. Answer with JSON: {"out": "..."}.',
    'Rules:',
    `- Write it the way a ${language}-speaking Dota player would actually type it in a match: short, informal, no formal register.`,
    // REAL OUTPUT before this rule: "hello" -> "Здарова", "play safe" ->
    // "играйте сейвовенько". Right, and natural - and the player, who cannot
    // read it, wondered what had been said in their name (the user, first
    // try in a game). Game terms stay slang; everything else stays plain.
    '- Everyday words stay plain and common: the ordinary informal word, not heavy slang, abbreviations, diminutives or jokes (in Russian, "hello" is "привет" - not "ку", not "здарова"). The player cannot read what you write and must be able to trust it.',
    `- Game terms are different: use the Dota slang that players of that language really use. Hero, item and ability names as those players write them; leave a name in Latin letters when they would.`,
    // REAL OUTPUT before this rule: "i'm going top" -> "иду хард" (the hard
    // lane), which is the wrong lane for half the players who type it.
    '- top, mid and bot are places on the map: say exactly that lane. Never turn one into "safe lane", "off lane" or "hard lane".',
    '- Keep the tone exactly: a friendly line stays friendly, a blunt one stays blunt. Do not soften, censor, or add politeness that was not there.',
    '- Numbers, timings and item counts stay exactly as typed.',
    '- One line, no line breaks, no quotation marks, no notes, no transliteration, no explanation.',
    `- If the text is already in ${language}, return it unchanged.`,
  ].join('\n');
}

export function buildOutRequest(text, language) {
  return {
    systemInstruction: { parts: [{ text: outSystem(language) }] },
    contents: [{ role: 'user', parts: [{ text: JSON.stringify({ text: tidySay(text) }) }] }],
    generationConfig: {
      // 0, not the 0.2 the incoming chat uses: the same English should come
      // out as the same line tomorrow (the user asked). SEEN at 0.2: "play
      // safe" three different ways in three runs. Not a guarantee - a model
      // is not a dictionary - but as near to one as it offers.
      temperature: 0,
      maxOutputTokens: 256,
      responseMimeType: 'application/json',
      responseSchema: { type: 'OBJECT', properties: { out: { type: 'STRING' } }, required: ['out'] },
    },
  };
}

/** The line to paste, or '' when the reply is not one. */
export function outFrom(replyText) {
  let parsed = null;
  try { parsed = JSON.parse(String(replyText || '')); } catch { return ''; }
  const out = parsed && typeof parsed.out === 'string' ? parsed.out : '';
  // It is going to be pasted into a one-line chat field.
  return out.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 400);
}

/**
 * One translator for the app's lifetime: it keeps what it has already
 * translated ("go rosh", "buy wards" - a player says the same twenty
 * things), so a repeat costs no call and no second.
 *
 * And it keeps them ON DISK (`store`), because that is the only thing that
 * makes the same English come out as the same line tomorrow (the user
 * asked whether it always would). MEASURED at temperature 0, three fresh
 * calls each: "nice play" -> "хорошая игра" | "хорошо сыграно" | "найс
 * плей"; "play safe" three ways too. All fine, none the same: the model
 * cannot be made to repeat itself, so the first answer is remembered. It
 * is a plain JSON file the player can read and correct.
 */
// What comes back from anywhere is made one chat line before it is pasted.
const tidyOut = (s) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim().slice(0, 400);

// A line the hosted translator wrote carries the prompt version (v) that
// wrote it; when the server says a language's prompt has changed, the old
// line is asked again instead of pasted (a review, 2026-09-23: a player who
// had once sent "going top help" kept pasting the wrong line after the fix).
// A plain string - an own-key answer, or a line the player corrected by hand -
// is kept for good.
const VERSIONS = '#versions';
// A short fingerprint of a line as the server wrote it: when the text no longer
// matches, the player corrected it by hand, and that line is kept for good.
const mark = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; } return h.toString(16); };
export function createOutgoing({ apiKey, model, ask = askGeminiHedged, cacheSize = 500, store = null, remote = null } = {}) {
  const cache = new Map();
  let latest = {};
  let broken = false;
  if (store) {
    try {
      const was = store.read();
      if (was && typeof was === 'object' && !Array.isArray(was)) {
        // A file from before versions (0.6.3 and older): its lines were written
        // by an older prompt, so each is asked once more when the server says
        // which prompt is current - the "going top help" lines included.
        const legacy = !(VERSIONS in was);
        for (const [k, v] of Object.entries(was)) {
          if (k === VERSIONS) { if (v && typeof v === 'object') latest = { ...v }; continue; }
          if (typeof v === 'string' && v.trim()) cache.set(k, legacy ? { out: tidyOut(v), v: 'legacy' } : { out: tidyOut(v) });
          else if (v && typeof v.out === 'string' && v.out.trim()) {
            const edited = typeof v.h === 'string' && v.h !== mark(v.out);
            cache.set(k, edited ? { out: tidyOut(v.out) } : { out: tidyOut(v.out), v: typeof v.v === 'string' ? v.v : '' });
          }
        }
      }
    } catch (err) {
      // No file yet: start afresh. A file that is THERE but will not parse
      // (a hand edit gone wrong) is left alone - never written over.
      if (!(err && err.code === 'ENOENT')) broken = true;
    }
  }
  const keep = () => {
    if (!store || broken) return;
    const all = {};
    for (const [k, e] of cache) all[k] = e.v ? { out: e.out, v: e.v, h: mark(e.out) } : e.out;
    all[VERSIONS] = latest;
    try { store.write(all); } catch { /* a read-only disk costs the memory, not the line */ }
  };
  const stale = (e, language) => Boolean(e.v && latest[language] && e.v !== latest[language]);
  // The first save writes the file in the new form, with the legacy marks, so
  // an old file is converted once and a hand edit made after it is detected.
  async function say(text, language) {
    const clean = tidySay(text);
    if (!clean) throw new Error('nothing to translate');
    const key = language + '|' + clean.toLowerCase();
    const had = cache.get(key);
    if (had && !stale(had, language)) return { out: had.out, language, cached: true };
    // Two tries, not three: the incoming chat lives on the same 15 calls a minute.
    // `remote()` answers a function when the hosted translator is in use (no
    // key of the player's own): it is sent the line, never a prompt.
    const hosted = remote ? remote() : null;
    let out, v = '';
    if (hosted) {
      let r;
      // A stale line is still better than nothing: if the server cannot answer
      // now, the old line is said (a review, 2026-09-23).
      try { r = await hosted(clean, language); } catch (err) { if (had) return { out: had.out, language, cached: true }; throw err; }
      if (!(r && (typeof r === 'string' ? r.trim() : r.out)) && had) return { out: had.out, language, cached: true };
      out = tidyOut(typeof r === 'string' ? r : r && r.out);
      v = r && typeof r.v === 'string' ? r.v : '';
      if (v) latest[language] = v;
    } else {
      out = outFrom(await ask({ apiKey: typeof apiKey === 'function' ? apiKey() : apiKey, model, request: buildOutRequest(clean, language) }, { attempts: 2 }));
    }
    if (!out) throw new Error('the model gave no translation');
    cache.delete(key);
    cache.set(key, v ? { out, v } : { out });
    if (cache.size > cacheSize) cache.delete(cache.keys().next().value);
    keep();
    return { out, language, cached: false };
  }
  // The heartbeat's answer: which prompt version writes each language now.
  say.learn = (versions) => {
    if (!versions || typeof versions !== 'object') return;
    let changed = false;
    for (const [lang, v] of Object.entries(versions)) if (/^[A-Za-z]{3,20}$/.test(lang) && /^[0-9a-f]{8}$/.test(String(v)) && latest[lang] !== v) { latest[lang] = v; changed = true; }
    if (changed) keep();
  };
  return say;
}
