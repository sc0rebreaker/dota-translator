// Reading Dota 2's chat out of the console log.
//
// Dota writes every console line to console.log when the game is started
// with -condebug, chat included. Nothing here touches the game: it is a
// file Valve writes and we only read it.
//
// Pure helpers live at the top so test.js can cover them; the tail at the
// bottom is the only part that talks to the disk.

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spanish } from './spanish.js';

// Which scripts count as "not something I can read". Cyrillic is the one
// that matters here; the others are there so the config can widen it
// without a code change.
// Spanish is not a script - it shares ours - so it is a word test (spanish.js)
// with the same `.test` face as the regular expressions.
export const SCRIPTS = {
  cyrillic: /[\u0400-\u04FF]/,
  greek: /[\u0370-\u03FF]/,
  han: /[\u4E00-\u9FFF]/,
  // Syllables AND the bare consonants chat is typed in (ㅈㅅ sorry, ㄱㄱ go go) -
  // but a line of nothing but laughter or crying (ㅋㅋㅋ, ㅠㅠ) costs no call.
  hangul: { test: (t) => /[\uAC00-\uD7AF\u3131-\u318E]/.test(t) && !/^[\s\u314B\u314E\u3160\u315C.,!?~^]*$/.test(t) },
  // Letters only: a line of Arabic-Indic digits or a lone ؟ is not a line to translate.
  arabic: /[\u0620-\u064A\u066E-\u06D3\u06FA-\u06FF]/,
  thai: /[\u0E00-\u0E7F]/,
  spanish,
};

export function needsTranslation(text, scripts = ['cyrillic']) {
  return scripts.some((name) => {
    const re = SCRIPTS[name];
    return re ? re.test(text) : false;
  });
}

// Lines the engine writes that happen to have a colon in them. The name
// half of a chat line is a player name, so it never looks like these.
const ENGINE_PREFIX = /^(\[|\s|#)/;
const ENGINE_NAME = /(^[A-Z][A-Za-z]*_)|(\.(dll|so|vpk|txt|cfg|vcss|vjs)$)|^(Error|Warning|Info|Msg|ConVar|CDOTA|CUtl|Host|Network|Steam|VSND|VConsole|Failed|Loaded|Loading|Initializing|Shutdown|Received|Sending)$/;

// A chat line is "<name>: <message>". The name is at most 32 characters
// (Steam's own limit) and carries no colon of its own, so the split is on
// the FIRST colon and the length is what rejects a stray engine line.
export function parseChatLine(line) {
  const raw = String(line == null ? '' : line).replace(/\r$/, '');
  if (!raw || ENGINE_PREFIX.test(raw)) return null;
  const at = raw.indexOf(': ');
  if (at < 1 || at > 32) return null;
  const name = raw.slice(0, at);
  const text = raw.slice(at + 2).trim();
  if (!text) return null;
  if (ENGINE_NAME.test(name)) return null;
  return { name, text };
}

// A chat line worth acting on: one we can read as chat AND cannot read as
// language. The script test is what makes the parser's guesswork safe -
// the engine's own output is ASCII, so it can never pass this.
export function chatToTranslate(line, scripts) {
  const msg = parseChatLine(line);
  if (!msg) return null;
  return needsTranslation(msg.text, scripts) ? msg : null;
}

// Steam's library list, so a Dota on a second drive is still found.
export function libraryPaths(vdfText) {
  const out = [];
  const re = /"path"\s+"([^"]+)"/g;
  let m;
  // The vdf escapes its separators, so a doubled one collapses back.
  const BS = String.fromCharCode(92);
  while ((m = re.exec(String(vdfText || '')))) out.push(m[1].split(BS + BS).join(BS));
  return out;
}

export const LOG_SUFFIX = path.join('steamapps', 'common', 'dota 2 beta', 'game', 'dota', 'console.log');

export function logCandidates(steamPath, vdfText) {
  const roots = [steamPath, ...libraryPaths(vdfText)].filter(Boolean);
  const seen = new Set();
  const out = [];
  for (const root of roots) {
    const full = path.join(root, LOG_SUFFIX);
    const key = full.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(full);
  }
  return out;
}

function steamRoot() {
  if (process.platform === 'win32') {
    // Forward slashes on purpose: Windows takes them everywhere and
    // path.join normalizes them, so nothing here needs an escape.
    return ['C:/Program Files (x86)/Steam', 'C:/Steam', 'D:/Steam', 'E:/Steam'];
  }
  if (process.platform === 'darwin') {
    return [path.join(os.homedir(), 'Library/Application Support/Steam')];
  }
  return [path.join(os.homedir(), '.steam/steam'), path.join(os.homedir(), '.local/share/Steam')];
}

// Finds the log by looking, so a moved install needs no config.
//
// An INSTALL with no log yet is not a failure and must not be reported as
// one: the log does not exist until Dota has run once with -condebug, so
// the honest answer there is the path it WILL appear at, and the caller
// waits for it. Only a machine with no Dota at all gives null.
export function findDotaLog() {
  let expected = null;
  for (const root of steamRoot()) {
    let vdf = '';
    try { vdf = fs.readFileSync(path.join(root, 'steamapps', 'libraryfolders.vdf'), 'utf8'); } catch { /* no list */ }
    for (const candidate of logCandidates(root, vdf)) {
      if (fs.existsSync(candidate)) return { path: candidate, exists: true, installed: true };
      // game/dota is the folder the log lands in; its presence is the
      // install, whatever state the log is in.
      if (!expected && fs.existsSync(path.dirname(candidate))) expected = candidate;
    }
  }
  return expected ? { path: expected, exists: false, installed: true } : { path: null, exists: false, installed: false };
}

export function findLogPath() {
  return findDotaLog().path;
}

// Follows a file the way `tail -f` does, by polling: the log is appended
// to by another process and a watcher misses writes on Windows often
// enough to matter. Starts at the END, so launching mid-game does not
// replay the whole session.
export class LogTail {
  constructor(file, { intervalMs = 250, fromStart = false } = {}) {
    this.file = file;
    this.intervalMs = intervalMs;
    this.fromStart = fromStart;
    this.offset = null;
    this.rest = '';
    this.timer = null;
    this.onLine = () => {};
    this.onError = () => {};
  }

  start() {
    if (this.timer) return this;
    this.timer = setInterval(() => this.poll(), this.intervalMs);
    this.poll();
    return this;
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  poll() {
    let size;
    try {
      size = fs.statSync(this.file).size;
    } catch (err) {
      this.offset = null;            // the game has not written it yet
      this.onError(err);
      return;
    }
    if (this.offset === null) {
      this.offset = this.fromStart ? 0 : size;
      this.rest = '';
    }
    // Dota truncates the log on every launch, so a smaller file is a new
    // game rather than an error.
    if (size < this.offset) {
      this.offset = 0;
      this.rest = '';
    }
    if (size === this.offset) return;
    let chunk = '';
    try {
      const fd = fs.openSync(this.file, 'r');
      try {
        const buf = Buffer.alloc(size - this.offset);
        const read = fs.readSync(fd, buf, 0, buf.length, this.offset);
        chunk = buf.slice(0, read).toString('utf8');
        this.offset += read;
      } finally {
        fs.closeSync(fd);
      }
    } catch (err) {
      this.onError(err);
      return;
    }
    const lines = (this.rest + chunk).split('\n');
    this.rest = lines.pop() || '';   // a write can land mid-line
    for (const line of lines) this.onLine(line);
  }
}
