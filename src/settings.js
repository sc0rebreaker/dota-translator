// The settings the setup window offers - six of the twenty-odd.
//
// The rest are engine tuning (scan timing, memory windows, the offsets
// URL, calls a minute) that a player should never need, and a panel of
// all of them would make the app look harder than it is. They stay in
// config.json, the window says so, and a button opens the folder.
//
// Whatever arrives from the window is made safe HERE before it is saved:
// the page is ours, but a settings file is no place for "whatever came".

import { SCRIPTS } from './chatlog.js';

// In the order the window lists them. Russian first: it is what this is for.
export const LANGUAGES = [
  ['cyrillic', 'Russian'],
  ['spanish', 'Spanish (Latin American, on US servers)'],
  ['han', 'Chinese'],
  ['hangul', 'Korean'],
  ['greek', 'Greek'],
  ['arabic', 'Arabic'],
  ['thai', 'Thai'],
];

// Russian for EU, Spanish for US, Chinese for SEA (the user, 2026-09-23: the
// most repeated SEA complaint is Chinese players who cannot use English -
// China's own servers are emptying and they queue on SEA).
export const THEIRS = ['Russian', 'Spanish', 'Chinese'];
const THEIR_SCRIPT = { Russian: 'cyrillic', Spanish: 'spanish', Chinese: 'han' };
const isEnglish = (s) => String(s || '').trim().toLowerCase() === 'english';

/** What the window is shown: only these, never the key. */
export function uiSettings(cfg) {
  return {
    scripts: (cfg.scripts || []).filter((s) => s in SCRIPTS),
    showOriginal: cfg.showOriginal !== false,
    showHeroes: cfg.showHeroes !== false,
    fontSize: cfg.fontSize,
    autoUpdate: cfg.autoUpdate !== false,
    // Which way Ctrl+Enter in Dota's chat translates what the player typed.
    sayInto: isEnglish(cfg.replyLanguage) ? 'english' : 'theirs',
    theirLanguage: THEIRS.includes(cfg.theirLanguage) ? cfg.theirLanguage : 'Russian',
  };
}

/**
 * What the window sent back, as a patch for config.json. Anything missing
 * or wrong is simply not in the patch, so it stays as it was.
 */
export function settingsPatch(raw, cfg = {}) {
  const patch = {};
  if (!raw || typeof raw !== 'object') return patch;
  if (Array.isArray(raw.scripts)) {
    const known = LANGUAGES.map(([id]) => id).filter((id) => raw.scripts.includes(id));
    // Nothing ticked would be an app that translates nothing and says
    // nothing about why. Not saved.
    if (known.length) patch.scripts = known;
  }
  for (const key of ['showOriginal', 'showHeroes', 'autoUpdate']) {
    if (typeof raw[key] === 'boolean') patch[key] = raw[key];
  }
  // Two choices in the window, and a third kept out of their way: a language
  // set BY NAME in config.json ("Ukrainian") is somebody's own choice of
  // "their language", and saving the window must not flatten it to auto.
  // Their language: one of two, and the language's script is switched on
  // with it (the other one is left as it was - a player on both servers
  // can keep both ticked).
  if (THEIRS.includes(raw.theirLanguage) && raw.theirLanguage !== cfg.theirLanguage) {
    patch.theirLanguage = raw.theirLanguage;
    const have = patch.scripts || cfg.scripts || [];
    const need = THEIR_SCRIPT[raw.theirLanguage];
    // In the window's own order: a list in another order reads as "the
    // languages changed" at the next save and restarts the reader for nothing.
    if (!have.includes(need)) patch.scripts = LANGUAGES.map(([id]) => id).filter((id) => id === need || have.includes(id));
  }
  if (raw.sayInto === 'english') patch.replyLanguage = 'English';
  else if (raw.sayInto === 'theirs' && isEnglish(cfg.replyLanguage)) patch.replyLanguage = 'auto';
  const size = Number(raw.fontSize);
  if (Number.isFinite(size)) patch.fontSize = Math.min(28, Math.max(11, Math.round(size)));
  return patch;
}
