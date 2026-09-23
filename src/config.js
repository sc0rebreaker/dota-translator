// Settings live in config.json beside the app. Missing file, missing
// keys and a file that will not parse all fall back to the defaults, so
// a first run works with nothing but a key pasted in.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// INSTALLED, the app lives inside an archive (resources/app.asar) under
// Program Files: nothing can be written there, and nothing outside the
// app - PowerShell, the browser - can read a file that is inside it.
//   DATA_DIR  where settings, the offsets cache and learn.log go: beside
//             the app when run from source, %APPDATA%/Dota Translator when
//             installed.
//   onDisk()  the real path of a file the OUTSIDE world must open (the
//             .ps1 helper, the key guide). The installer unpacks those
//             beside the archive; see "asarUnpack" in package.json.
export const PACKAGED = ROOT.includes('app.asar');
export const DATA_DIR = PACKAGED
  ? path.join(process.env.APPDATA || path.join(process.env.USERPROFILE || '.', 'AppData', 'Roaming'), 'Dota Translator')
  : ROOT;
if (PACKAGED) { try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch { /* it will say so when it cannot save */ } }
export const onDisk = (file) => file.replace('app.asar' + path.sep, 'app.asar.unpacked' + path.sep);
// DT_CONFIG points the app at another file: for trying the first-run
// window without touching the real settings or the real key.
export const CONFIG_PATH = process.env.DT_CONFIG || path.join(DATA_DIR, 'config.json');

export const DEFAULTS = {
  geminiApiKey: '',
  // The same key as the setup window saves it: encrypted by Windows for
  // this user (Electron safeStorage, which is DPAPI), base64. Only the app
  // can read it back - a terminal run (npm run watch) cannot, and wants the
  // plain field above or GEMINI_API_KEY.
  geminiApiKeyEnc: '',
  model: 'gemini-3.5-flash-lite',
  logPath: '',              // blank = find the Steam install
  // 'memory' reads the game; 'gsi' listens to Dota's own Game State
  // Integration feed instead - no memory is read for chat at all, but it
  // cannot name other players or say where the game's chat is (so: the
  // box). NEW 2026-09-21 and not the default until it has been through
  // whole games. 'log' reads console.log, which carries no chat.
  // 'gsi': chat from Dota's own Game State Integration feed. The app does
  // NOT read the game's memory (the user, 2026-09-22: "memory reading will
  // not stay"); a config.json that still says "memory" gets gsi too, and
  // the old reader is not in the installer. 'log' is the console.log reader.
  source: 'gsi',
  gsiPort: 47854,           // where Dota sends its feed on this PC (source 'gsi')
  gsiRowGrab: true,         // source 'gsi': name a speaker's hero from a small screen grab of the game's chat row
  // MEASURED on a live match: a poll of the allocations known to hold
  // chat reads ~710 MB in under half a second, and a sweep of the whole
  // 7.5 GB takes 3.8s. At a one-second poll the reader is busy half the
  // time, which is a lot to ask of a machine running a game; at two it is
  // a quarter, and a chat line is on screen for about seven seconds.
  //
  // That was when every poll read everything. Most polls are windowed
  // now - 50 to 150 MB, 100 to 200ms, one thread, below normal priority -
  // and the user's word on a live match at 2s was "the same as without
  // the translator", and that chat must be near enough instant to be
  // read in a fight. So one second. Every fifth poll is still the wide
  // one (~1.3 GB, ~1.6s); if the game hitches every six seconds or so,
  // that is the first thing to suspect.
  scanIntervalMs: 1000,     // how often to re-read the chat out of memory
  fullRescanMs: 120000,     // how often to sweep the whole process again
  // Most polls read only this many MB either side of where a line has
  // been seen, and every Nth reads the whole of the allocations that hold
  // chat. 0 MB turns windows off. NOT yet sized against a live game: the
  // 4 is a guess, and learn.log's "placement" lines are what replace it.
  scanWindowMb: 4,
  scanWideEvery: 5,
  // The biggest region a WIDE poll reads, in MB; 0 reads them all.
  // MEASURED with lines typed at known times: at 64, two all-chat lines in
  // ten were in regions no poll would read and turned up 19s and 23s late;
  // at 0 the worst of ten was 7.3s, and the wide poll went from ~1.0 GB /
  // 1.3s to ~2.8 GB / 3.3s. A line twenty seconds late is a line lost, so
  // the default is the one that finds them. 64 is the lighter setting.
  scanWideCapMb: 0,
  // Read the chat PANEL itself - a few KB a poll - whenever it can be
  // found, and scan only until it is or if it cannot be. MEASURED on the
  // live game; see CLAUDE.md. false is the scanner alone.
  chatPanel: true,
  // Where the app fetches the chat's memory offsets from at startup, so
  // that a Dota patch is fixed by one commit to offsets.json rather than
  // by everybody reinstalling. "" never fetches and uses the copy that
  // shipped. See src/offsets.js.
  offsetsUrl: 'https://raw.githubusercontent.com/sc0rebreaker/dota-translator/master/offsets.json',
  panelIntervalMs: 250,     // a panel poll is nearly free, so: often
  // How many calls a minute the key allows. 15 is the free tier of
  // gemini-3.5-flash-lite, MEASURED by running into it. As the minute's
  // calls are spent, lines wait a little longer and share a call.
  callsPerMinute: 15,
  // Which writing systems to translate. Russian is what this is FOR;
  // Chinese is on as well because so much of what is pasted into chat -
  // voice lines above all - is Chinese (the user, 2026-09-20).
  scripts: ['cyrillic', 'han'],
  // Lines said in the same breath go in one call. 400 was chosen before
  // anybody had played with it; in a fight every tenth of a second shows.
  // 80 since calls run three at a time: a burst no longer has to share
  // one call to be quick, so the wait only needs to catch lines said in
  // the same instant.
  batchMs: 80,             // how long to gather lines before one call
  holdSeconds: 14,          // how long a line stays on the overlay
  maxLines: 6,
  // Beside the game's own chat (display "above"), a line goes when the
  // game's line goes - MEASURED at 7.0-7.5s after it is said - and
  // holdSeconds is not used. false keeps lines for holdSeconds there too.
  fadeWithGame: true,
  // Where the English goes. "box" is the second chat box drawn over the
  // game, and is the only one BUILT. "replace" - the English written into
  // the game's own chat line as "english (original)" - is what the user
  // wants as the default, and is NOT built: it means writing to the
  // game's memory, and the one experiment that says whether the chat even
  // redraws has not been allowed to run. Until it exists, "replace" falls
  // back to the box and says so once.
  // "cover" is the read-only way to the same look, and IS built: the
  // English is laid over each line of the game's own chat, in its exact
  // place, read from where the game says the chat is. It needs the chat
  // panel; with the scanner fallback, or before a match, it is the box.
  // "above" is the default since the user watched "cover" on their own
  // chat and chose against overlapping: the same lines, as bare outlined
  // text like the game's own, in a box that ENDS where the game's chat
  // begins - placed from where the game says its chat is, so there is
  // still nothing to position. "box" is the old panel in a corner.
  display: 'above',
  showOriginal: true,
  // The speaker's hero portrait before their name, as in the game's chat.
  // The images come from Valve's public image server; false asks for none.
  showHeroes: true,
  fontSize: 16,
  opacity: 0.92,
  // chat = directly above the game's own chat; or a corner: top-left,
  // top-right, bottom-left, bottom-right
  position: 'chat',
  // Where the chat box goes, as fractions of the screen from its top-left
  // (0.02, 0.55 is low on the left). -1 leaves it in the `position` corner.
  boxX: -1,
  boxY: -1,
  boxWidth: 520,
  clickThrough: true,
  // The installed app updates itself from the project's GitHub releases:
  // checked at startup, installed when the app is next closed. false
  // never checks.
  autoUpdate: true,
  // Saying something BACK: type English into the game's own chat and press
  // this instead of Enter. The app presses Ctrl+A, Ctrl+C, translates what
  // it got, and presses Ctrl+A, Ctrl+V, Enter (src/sendchat.ps1) - keys,
  // as a keyboard sends them; nothing is written to the game. The key
  // exists only while Dota is the window in front. "" turns it all off,
  // and then the app sends the game no keys at all.
  sayHotkey: 'Control+Enter',
  // What to translate it into. "auto" is whatever the others were last
  // seen typing in, Russian until anything has been seen; or a language by
  // name ("Russian", "Ukrainian", "Chinese").
  replyLanguage: 'auto',
  // What the people on the player's servers write: Russian (EU), Spanish
  // (US) or Chinese (SEA). It picks which languages are read and which Ctrl+Enter goes into
  // until a line has been seen. The setup window's first choice.
  theirLanguage: 'Russian',
  // Where the tray's "Report a problem..." goes. Blank is the project's
  // GitHub issue chooser.
  feedbackUrl: '',
  // The hosted translator (server/): used when the player has NO key of their
  // own, so that the app works straight after installing. Blank = there is
  // none, and the app asks for a key as it always did. A key always wins.
  hostedUrl: 'https://translate.dotatranslator.live',
  // A random id for this install, made on first use: who is asking, until
  // the game's feed has said which player this is. Only its hash is sent.
  installId: '',
  learn: false,             // log unmatched lines to learn.log
};

export function mergeConfig(raw) {
  const out = { ...DEFAULTS };
  if (!raw || typeof raw !== 'object') return out;
  for (const key of Object.keys(DEFAULTS)) {
    if (raw[key] === undefined || raw[key] === null) continue;
    const want = typeof DEFAULTS[key];
    if (Array.isArray(DEFAULTS[key])) {
      if (Array.isArray(raw[key])) out[key] = raw[key].slice();
      continue;
    }
    if (typeof raw[key] === want) out[key] = raw[key];
  }
  // An env var wins, so a key need never be written to disk.
  if (process.env.GEMINI_API_KEY) out.geminiApiKey = process.env.GEMINI_API_KEY;
  return out;
}

/**
 * Change some settings in config.json and leave the rest of the file as
 * the player wrote it: their own keys, their own order. A file that is
 * missing or will not parse is started afresh rather than failed on -
 * this is what the setup window saves through, and it is there for
 * people who should never have to see the file.
 */
export function saveConfig(patch, file = CONFIG_PATH) {
  let raw = {};
  try { const was = JSON.parse(fs.readFileSync(file, 'utf8')); if (was && typeof was === 'object' && !Array.isArray(was)) raw = was; } catch { /* afresh */ }
  const next = { ...raw, ...patch };
  fs.writeFileSync(file, JSON.stringify(next, null, 2) + '\n');
  return mergeConfig(next);
}

export function loadConfig(file = CONFIG_PATH) {
  let raw = null;
  try { raw = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { /* defaults */ }
  return mergeConfig(raw);
}
