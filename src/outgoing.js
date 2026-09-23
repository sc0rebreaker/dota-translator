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
export const SCRIPT_LANGUAGE = {
  cyrillic: 'Russian',
  han: 'Chinese',
  hangul: 'Korean',
  greek: 'Greek',
  arabic: 'Arabic',
  thai: 'Thai',
  spanish: 'Spanish',       // last: a line with any other script is that script
};

export const MAX_SAY = 200;          // a chat line, not a letter

export function scriptOf(text) {
  for (const name of Object.keys(SCRIPT_LANGUAGE)) if (SCRIPTS[name].test(String(text || ''))) return name;
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

export function createOutgoing({ apiKey, model, ask = askGeminiHedged, cacheSize = 500, store = null, remote = null } = {}) {
  const cache = new Map();
  if (store) {
    try {
      const was = store.read();
      if (was && typeof was === 'object' && !Array.isArray(was)) {
        for (const [k, v] of Object.entries(was)) if (typeof v === 'string' && v.trim()) cache.set(k, v.replace(/\s+/g, ' ').trim().slice(0, 400));
      }
    } catch { /* no file yet, or not JSON: start afresh */ }
  }
  const keep = () => { if (store) { try { store.write(Object.fromEntries(cache)); } catch { /* a read-only disk costs the memory, not the line */ } } };
  return async function say(text, language) {
    const clean = tidySay(text);
    if (!clean) throw new Error('nothing to translate');
    const key = language + '|' + clean.toLowerCase();
    if (cache.has(key)) return { out: cache.get(key), language, cached: true };
    // Two tries, not three: the incoming chat lives on the same 15 calls a minute.
    // `remote()` answers a function when the hosted translator is in use (no
    // key of the player's own): it is sent the line, never a prompt.
    const hosted = remote ? remote() : null;
    const out = hosted
      ? tidyOut(await hosted(clean, language))
      : outFrom(await ask({ apiKey: typeof apiKey === 'function' ? apiKey() : apiKey, model, request: buildOutRequest(clean, language) }, { attempts: 2 }));
    if (!out) throw new Error('the model gave no translation');
    cache.set(key, out);
    if (cache.size > cacheSize) cache.delete(cache.keys().next().value);
    keep();
    return { out, language, cached: false };
  };
}
