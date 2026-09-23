// The overlay. A transparent, always on top, click-through window laid
// over the game. Dota must run in borderless windowed for anything to
// show above it: an exclusive fullscreen game owns the screen and no
// window can sit on it.

import { app, BrowserWindow, screen, ipcMain, globalShortcut, safeStorage, shell, Tray, Menu, nativeImage, clipboard } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadConfig, saveConfig, onDisk, CONFIG_PATH, DATA_DIR } from './config.js';
import { faces } from './heroface.js';
import { createPatchWatch, SLOW_TEXT } from './patchwatch.js';
import { uiSettings, settingsPatch, LANGUAGES } from './settings.js';
import { checkKey, tidyKey } from './keycheck.js';
import updater from 'electron-updater';
import { startWatching } from './watcher.js';
import { explainModelError } from './memwatcher.js';
import { startWatchingGsi } from './gsiwatcher.js';
import { loadOffsets, bundledOffsets } from './offsets.js';
import { createOutgoing, createLanguageTracker, targetLanguage } from './outgoing.js';
import { createKeySender, sayTranslated } from './sendchat.js';
import { createHosted, hashId } from './hosted.js';
import crypto from 'node:crypto';

const here = path.dirname(fileURLToPath(import.meta.url));
// The first start ever (no settings file yet) shows the window once: it says
// the app is ready and that Dota must be restarted once for its chat feed.
const firstRun = !fs.existsSync(CONFIG_PATH);
const cfg = loadConfig();
let win = null;
let watcher = null;
let hidden = false;
let inFront = true;

// Where the chat box goes. A corner by default; boxX / boxY, as fractions
// of the screen (0-1) from its top-left, put it anywhere - which is what
// laying it OVER the game's own chat will need, later.
function place(bounds, c = cfg) {
  const w = Math.round(c.boxWidth);
  const h = Math.min(bounds.height - 80, 40 + c.maxLines * 52);
  const pad = 24;
  const right = c.position.endsWith('right');
  const bottom = c.position.startsWith('bottom') || c.position === 'chat';
  if (c.position === 'chat' && !(c.boxX >= 0 && c.boxY >= 0)) {
    // Directly above the game's own chat, growing upwards, so the English
    // is read where the eye already goes for chat. MEASURED on a 5120x1440
    // screen: Dota lays its HUD out in a centred 16:9 area, and its chat
    // lines begin 0.31 of the way across that area and sit between 0.64
    // and 0.70 of the way down the screen. NOT checked at 16:9, 16:10 or
    // 4:3, nor with the HUD flipped (minimap on the right).
    const hudW = Math.min(bounds.width, Math.round(bounds.height * 16 / 9));
    const hudX = bounds.x + Math.round((bounds.width - hudW) / 2);
    return { x: hudX + Math.round(0.31 * hudW), y: bounds.y + Math.round(0.625 * bounds.height) - h, width: w, height: h };
  }
  if (c.boxX >= 0 && c.boxY >= 0) {
    return {
      x: Math.round(bounds.x + c.boxX * bounds.width),
      // Bottom-anchored, boxY is where the box ENDS: it grows upwards.
      y: Math.round(bounds.y + c.boxY * bounds.height - (bottom ? h : 0)),
      width: w,
      height: h,
    };
  }
  return {
    x: bounds.x + (right ? bounds.width - w - pad : pad),
    // 150 down, not 40: Dota keeps K/D/A and last hits in its top-left.
    y: bounds.y + (bottom ? bounds.height - h - pad : pad + 150),
    width: w,
    height: h,
  };
}

function createWindow() {
  // The whole display, not the work area: a borderless game covers the
  // taskbar, and the box is placed against the game.
  const area = screen.getPrimaryDisplay().bounds;
  win = new BrowserWindow({
    ...place(area),
    frame: false,
    transparent: true,
    resizable: false,
    skipTaskbar: true,
    focusable: false,
    hasShadow: false,
    alwaysOnTop: true,
    webPreferences: { preload: path.join(here, 'preload.cjs'), contextIsolation: true },
  });
  // "screen-saver" is the level that stays above a borderless game; the
  // default "floating" loses to it.
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  if (cfg.clickThrough) win.setIgnoreMouseEvents(true, { forward: true });
  win.loadFile(path.join(here, 'overlay.html'));
  // On every load, not once: changing the look in the setup window reloads
  // this page, and a fresh page knows nothing.
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('config', {
      holdSeconds: cfg.holdSeconds,
      maxLines: cfg.maxLines,
      showOriginal: cfg.showOriginal,
      showHeroes: cfg.showHeroes,
      fontSize: cfg.fontSize,
      opacity: cfg.opacity,
      position: cfg.position,
      display: cfg.display,
      fadeWithGame: cfg.fadeWithGame,
      textLeft: TEXT_LEFT,
    });
    if (lastFonts) win.webContents.send('fonts', lastFonts);
    if (!started) { started = true; start(); }
  });
}

let started = false;
let lastFonts = '';
// The game's own hero portraits, from the player's install (src/heroface.js).
// Until the game's folder is known, and for any hero it cannot give, the
// overlay uses the picture on Valve's web server - which is NOT the same one.
const patchWatch = createPatchWatch({
  onSlow: () => {
    send('status', { kind: 'error', text: SLOW_TEXT });
    if (tray) tray.setToolTip('Dota Translator ' + app.getVersion() + ' - slow mode: waiting for a fix for the new Dota build');
  },
  onFast: () => { if (tray) tray.setToolTip('Dota Translator ' + app.getVersion()); },
});
let faceOf = () => null;
const withFace = (row) => (cfg.showHeroes && row && row.hero ? { ...row, face: faceOf(row.hero) } : row);

// The look changed in the setup window: put the window back where that
// look wants it and start its page again, clean.
function applyDisplay(display) {
  if (display === cfg.display || !win || win.isDestroyed()) { cfg.display = display; return; }
  cfg.display = display;
  coverAt = '';
  win.setBounds(place(screen.getPrimaryDisplay().bounds));
  win.reload();
}

// DT_DEBUG=1 prints everything sent to the chat box, for the day it shows
// nothing and the question is whether it was ever told anything.
const DEBUG = Boolean(process.env.DT_DEBUG);

// COVER mode: the window is laid exactly over the game's own chat lines,
// from where the GAME says they are. MEASURED on 5120x1440 (scale 1.33):
// the line box begins 42px right of HudChat's x and the newest line ends
// 187px below HudChat's y - 31.5 and 140 in the 1080-high units Dota's
// layout is written in, which is why they are multiplied by the scale
// the game reports rather than kept as pixels. NOT checked on any other
// screen; that they are layout constants is the bet.
// The three that were calibrated by eye live in offsets.json with the
// memory offsets, for the same reason: if a patch restyles the chat they
// are fixed by a commit there. These are what shipped, until it is read.
let { chatLeft: CHAT_LEFT, chatBottom: CHAT_BOTTOM, chatHigh: CHAT_HIGH, textLeft: TEXT_LEFT } = bundledOffsets().layout;
const LINE_BOX = 1000, ROWS_HIGH = 340;
// ABOVE mode: the same place, one chat-height higher. The game draws its
// chat in a window 216px high at scale 1.33 (162 units: six lines, which
// is also what it shows when the chat is OPENED), so a box that ends
// where that window begins has nothing of the game's under it, ever -
// which is the whole reason for it. Laying English OVER the lines worked
// but needed a strip to hide the Russian, a guess at when the game's line
// fades (wrong once already), and a signal for the opened chat that was
// not found.
const GAP = 4;
let coverAt = '';

function coverBounds(l) {
  const lift = cfg.display === 'above' ? CHAT_HIGH + GAP : 0;
  const px = {
    x: Math.round(l.x + CHAT_LEFT * l.scale),
    y: Math.round(l.y + (CHAT_BOTTOM - ROWS_HIGH - lift) * l.scale),
    width: Math.round(LINE_BOX * l.scale),
    height: Math.round(ROWS_HIGH * l.scale),
  };
  // The game speaks in screen pixels and Electron in scaled ones; they
  // differ whenever Windows display scaling is not 100%.
  return screen.screenToDipRect ? screen.screenToDipRect(null, px) : px;
}

function onLayout(l) {
  if ((cfg.display !== 'cover' && cfg.display !== 'above') || !win || win.isDestroyed()) return;
  const b = coverBounds(l);
  const key = [b.x, b.y, b.width, b.height].join();
  if (key !== coverAt) { coverAt = key; win.setBounds(b); }
  // The renderer works in ITS pixels: the scale it needs is the game's
  // scale shrunk by whatever Windows scaling stretched the window by.
  const dip = b.width / Math.round(LINE_BOX * l.scale);
  send('layout', { rows: l.rows.map((r) => ({ ...r, height: r.height * dip, width: r.width * dip })), scale: l.scale * dip });
}

function send(channel, payload) {
  if (DEBUG && channel !== 'seen' && (channel !== 'status' || payload.text)) console.log(new Date().toISOString().slice(11, 23), channel, JSON.stringify(payload));
  if (win && !win.isDestroyed()) win.webContents.send(channel, payload);
}

function restartWatcher() {
  if (watcher) { watcher.stop(); watcher = null; }
  start();
}

async function start() {
  // A few seconds at most, and never fatal: see src/offsets.js.
  if (!cfg.offsets) cfg.offsets = await loadOffsets({ url: cfg.offsetsUrl });
  ({ chatLeft: CHAT_LEFT, chatBottom: CHAT_BOTTOM, chatHigh: CHAT_HIGH, textLeft: TEXT_LEFT } = cfg.offsets.layout);
  send('config', { textLeft: TEXT_LEFT });
  if (DEBUG) console.log('offsets', cfg.offsets.source, 'v' + cfg.offsets.version, cfg.offsets.updated);
  cfg.geminiApiKey = storedKey();
  if (firstRun || (!hostedOn() && !cfg.geminiApiKey)) {
    // Not an error to be read off an overlay: a window that asks for it.
    openSetup();
    return;
  }
  if (cfg.display === 'replace') {
    send('status', { kind: 'error', text: 'Replacing the game chat in place is not built yet - using the chat box.' });
  }
  // 'memory' reads the running game, which is the only place the chat
  // actually is; 'log' is the old console.log reader, kept as a fallback.
  // Never the memory reader: see DEFAULTS.source.
  const start = cfg.source === 'log' ? startWatching : startWatchingGsi;
  watcher = start(cfg, {
    onStatus: (s) => {
      // The one thing about how the app is getting on that IS the player's
      // business: a Dota patch has put it into slow mode (src/patchwatch.js).
      if (s && s.kind === 'find' && s.find) patchWatch.find(s.find.panels);
      if (s && s.kind === 'waiting') patchWatch.reset();
      send('status', s);
    },
    onPending: (row) => { spoken.saw(row.text); itsMe(row); send('pending', withFace(row)); },
    onLayout,
    // No key of the player's own: the hosted translator does the asking.
    ...(hostedOn() ? { translate: (batch) => hosted.translate(batch) } : {}),
    onSteamId: (steamid) => { playerId = hashId('steam', steamid); },
    // GSI mode only: where the game's window is. The dark box is then placed
    // in IT, not on the screen (a windowed game had the box on the desktop).
    onWindow: (w) => {
      if (cfg.display === 'above' || cfg.display === 'cover' || !win || win.isDestroyed()) return;
      const px = { x: w.x, y: w.y, width: w.w, height: w.h };
      const b = place(screen.screenToDipRect ? screen.screenToDipRect(null, px) : px);
      const key = [b.x, b.y, b.width, b.height].join();
      if (key !== coverAt) { coverAt = key; win.setBounds(b); }
    },
    onSeen: (s) => { if (cfg.display === 'cover') send('seen', s); },
    // The game's chat is set in Valve's Radiance, which is not on anybody's
    // machine except inside the game. It is loaded from THERE - the
    // player's own copy - and never copied into this repo.
    onGamePath: (exe) => {
      // dota2.exe is in game/bin/win64; the fonts are in game/dota/panorama/fonts.
      const dir = path.resolve(path.dirname(exe), '..', '..', 'dota', 'panorama', 'fonts');
      faceOf = faces(path.resolve(path.dirname(exe), '..', '..', 'dota'));
      if (fs.existsSync(path.join(dir, 'radiance-bold.otf'))) { lastFonts = pathToFileURL(dir).href; send('fonts', lastFonts); }
    },
    // Up only while the game is the window in front.
    onFocus: (on) => {
      setSayHotkey(on);
      inFront = on;
      heartbeat(on);
      if (!win || win.isDestroyed() || hidden) return;
      if (on) win.showInactive(); else win.hide();
    },
    onResult: (row) => { spoken.saw(row.text); itsMe(row); send('line', withFace(row)); },
  });
}

// ---- SAYING SOMETHING BACK -------------------------------------------
// Asked for by the first players who saw the app: their own English, in
// the language the others type in (src/outgoing.js).
//
// The player types English into the game's OWN chat field and presses
// this key instead of Enter. The app then presses keys, as a keyboard
// would (src/sendchat.ps1): Ctrl+A, Ctrl+C to take what was typed;
// it is translated; Ctrl+A, Ctrl+V, Enter to put the translation in its
// place and say it. Team or all chat is whichever the player opened.
//
// It is INPUT and nothing else. Nothing is written to the game's memory,
// and the game's process is not even opened for this. (The user asked
// about writing the field in memory instead, 2026-09-21; it would not
// have been quicker - the game sends on Enter, the model needs a second -
// and it is the one thing this app has never done.) A first version was a
// window of its own and the clipboard only; the user found that five
// keypresses and two waits for one line, and it took the keyboard off the
// game besides.
//
// The key exists ONLY while Dota is the window in front. Ctrl+Enter is
// "send" in half the programs on a PC, and a global shortcut swallows the
// key from whatever has the keyboard.
// ---- THE HOSTED TRANSLATOR (src/hosted.js, server/) --------------------
// The translating goes through it whenever there is an address (the user,
// 2026-09-22: only through the server). A key of the player's own is used
// only with hostedUrl blank - SEEN: a key saved by an older version sent the
// user's own copy to Google's free tier during one of its bad spells, past
// the server that was answering fine.
const hostedOn = () => /^(https:\/\/[^\s]+|http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/\S*)?)$/.test(String(cfg.hostedUrl || ''));
let playerId = '';
function installHash() {
  if (!/^[a-f0-9]{32}$/.test(String(cfg.installId || ''))) {
    cfg.installId = crypto.randomBytes(16).toString('hex');
    try { saveConfig({ installId: cfg.installId }); } catch { /* a new one next time */ }
  }
  return hashId('install', cfg.installId);
}
const hosted = createHosted({ url: () => cfg.hostedUrl, id: () => playerId || installHash(), version: app.getVersion() });

// While the game is in front and the hosted translator is in use, tell it
// once a minute that a player is in a game (players.now on its /health).
let beat = null;
function heartbeat(on) {
  if (beat) { clearInterval(beat); beat = null; }
  if (!on || !hostedOn()) return;
  hosted.ping();
  beat = setInterval(() => hosted.ping(), 60000);
  beat.unref?.();
}

const spoken = createLanguageTracker({ fallback: cfg.theirLanguage === 'Spanish' ? 'Spanish' : 'Russian' });
// What has been said before is said the same way again: said.json, beside
// the settings, English -> what was sent. The player can read and correct it.
const SAID_PATH = path.join(DATA_DIR, 'said.json');
const sayIt = createOutgoing({
  apiKey: () => cfg.geminiApiKey, model: cfg.model,
  remote: () => (hostedOn() ? (text, into) => hosted.say(text, into) : null),
  store: { read: () => JSON.parse(fs.readFileSync(SAID_PATH, 'utf8')), write: (all) => fs.writeFileSync(SAID_PATH, JSON.stringify(all, null, 2)) },
});
const keys = createKeySender();
let sayKeyOn = false;
let saying = false;
// WHO the player is, learnt from the game: a line that comes back out of
// the chat with the words the app has just sent for them is THEIR line,
// and carries their name, colour slot and hero. Known from their first
// translated message of a match; a new hero next match replaces it.
let me = null;
const sentForMe = new Set();
function itsMe(row) {
  if (!row || !sentForMe.has(row.text)) return;
  me = { name: row.name, slot: row.slot, hero: row.hero };
}

function setSayHotkey(on) {
  if (!cfg.sayHotkey || on === sayKeyOn) return;
  try {
    if (on) { sayKeyOn = globalShortcut.register(cfg.sayHotkey, sayKey); keys.warm(); }
    else { globalShortcut.unregister(cfg.sayHotkey); sayKeyOn = false; }
  } catch { sayKeyOn = false; /* not a key Electron knows: no hotkey, and nothing else breaks */ }
}

// One key, and a SETTING for which way it goes (the user: "better with
// setting, but same hotkeys"): replyLanguage "auto" sends the line in the
// language the others type in, Russian by default; "English" sends it in
// English whatever it was typed in - for the player on the other side of
// the same problem, typing Russian to English speakers. Read at each press,
// so changing it in the setup window needs no restart.
async function sayKey() {
  if (saying || (!hostedOn() && !cfg.geminiApiKey)) return;
  saying = true;
  try {
    const into = targetLanguage(cfg.replyLanguage, spoken);
    const r = await sayTranslated({
      keys, clipboard, into, explain: explainModelError,
      // The line comes back out of the chat within a moment: it means what was typed.
      learned: (out, typed) => {
        // SEEN 2026-09-22: Russian pasted and sent with this key goes out
        // unchanged, and "it means what was typed" then told the reader that
        // Russian means Russian - the player's own line was never translated.
        if (watcher && watcher.know && out.trim() !== typed.trim()) watcher.know(out, typed);
        sentForMe.add(out);
        if (sentForMe.size > 50) sentForMe.delete(sentForMe.values().next().value);
      },
      who: () => me,
      translate: (typed) => sayIt(typed, into),
      note: (s) => send('status', withFace(s)),
    });
    if (DEBUG) console.log('say', JSON.stringify(r));
  } finally { saying = false; }
}

// ---- UPDATES ---------------------------------------------------------
// The INSTALLED app keeps itself up to date from the project's GitHub
// releases (the user asked: "the app should auto update when start"). It
// looks once at startup, downloads a newer version quietly in the
// background and installs it when the app is next closed - never in the
// middle of a match, and never with a dialog over the game. Run from
// source there is nothing to update and nothing is asked.
// What the settings window shows about it (the user, 2026-09-22: an
// indicator that this copy is up to date). `status`: source (run from
// source, nothing to check), off (autoUpdate false), checking, latest,
// downloading, ready (installs when the app quits), error.
const updateState = { status: app.isPackaged ? (cfg.autoUpdate === false ? 'off' : 'checking') : 'source', version: app.getVersion(), latest: '', checked: 0 };
function setUpdate(patch) {
  Object.assign(updateState, patch);
  if (setupWin && !setupWin.isDestroyed()) setupWin.webContents.send('update', updateState);
}
let lookForUpdate = () => {};
function checkForUpdates() {
  if (!app.isPackaged || cfg.autoUpdate === false) return;
  const { autoUpdater } = updater;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('checking-for-update', () => setUpdate({ status: 'checking' }));
  autoUpdater.on('update-not-available', (info) => setUpdate({ status: 'latest', latest: info && info.version || app.getVersion(), checked: Date.now() }));
  autoUpdater.on('update-available', (info) => setUpdate({ status: 'downloading', latest: info.version, checked: Date.now() }));
  autoUpdater.on('download-progress', (p) => setUpdate({ status: 'downloading', percent: Math.round(p.percent || 0) }));
  autoUpdater.on('error', (err) => { setUpdate({ status: 'error', checked: Date.now() }); if (DEBUG) console.log('update:', String((err && err.message) || err)); });
  autoUpdater.on('update-downloaded', (info) => {
    setUpdate({ status: 'ready', latest: info.version, checked: Date.now() });
    if (tray) tray.setToolTip('Dota Translator - version ' + info.version + ' installs when you quit');
  });
  const look = () => autoUpdater.checkForUpdates().catch(() => { /* offline, or no release yet: next time */ });
  lookForUpdate = look;
  look();
  // And again every few hours. It used to look ONCE, at startup - and the
  // user's own copy, started before three releases came out and left
  // running, never heard of any of them. An app that lives in the tray is
  // started once a day at most, or once a week.
  setInterval(look, 4 * 60 * 60 * 1000).unref();
}

// One copy only: two would translate every line twice on one key (the
// 15-a-minute limit), and a player who cannot find the tray icon starts
// the app again - which should show them the window, not a second app.
const onlyCopy = app.requestSingleInstanceLock();
if (!onlyCopy) app.quit();
app.on('second-instance', openSetup);

app.whenReady().then(() => {
  if (!onlyCopy) return;
  createWindow();
  checkForUpdates();
  // Alt+D hides and shows it, for a screenshot or a clear view of a fight.
  globalShortcut.register('Alt+D', toggleHidden);
  makeTray();
  globalShortcut.register('Alt+Shift+D', quitApp);});

// ---- THE SETUP WINDOW ------------------------------------------------
// Where a player gives the app its key without ever seeing config.json
// (the user, 2026-09-20: "simpler for non techie user to just enter api
// key in the ui"). It opens by itself when there is no key, and from the
// tray icon after that. The key is TRIED before it is saved - one real
// translation - so "saved" means "works", and it is stored encrypted by
// Windows for this user (safeStorage = DPAPI) rather than in plain text.
// A form anybody can fill in with no account (the user's, made 2026-09-21);
// it points at GitHub's issues and pull requests for those who prefer them.
const FEEDBACK_URL = 'https://forms.gle/4UwGB5drooGT4mUB9';
let setupWin = null;
let tray = null;
// The balloon's picture is OUR icon, said outright: left to Windows it showed
// the icon it had cached from an older install (the user, 2026-09-22: 'the
// old translator logo is used').
const balloonIcon = () => nativeImage.createFromPath(path.join(here, 'balloon.png'));

function storedKey() {
  if (cfg.geminiApiKey) return cfg.geminiApiKey;            // config.json or GEMINI_API_KEY, in plain
  if (!cfg.geminiApiKeyEnc || !safeStorage.isEncryptionAvailable()) return '';
  try { return safeStorage.decryptString(Buffer.from(cfg.geminiApiKeyEnc, 'base64')); } catch { return ''; }
}

// The window on TOP, whatever is in front. Windows refuses a background app
// the focus (the user, 2026-09-22: it opened behind Chrome, and they had to
// minimise Chrome to find it), so it is made topmost for a moment.
function surface(w) {
  w.show();
  w.setAlwaysOnTop(true);
  w.moveTop();
  w.focus();
  app.focus({ steal: true });
  // And it STAYS on top while it is open. A timer was not enough (SEEN: up
  // for a blink, then behind Chrome again), nor was until-blur (the user:
  // 'it goes back the moment I move my mouse towards the browser'). It is
  // small and has a Close button.
}

function openSetup() {
  if (setupWin && !setupWin.isDestroyed()) { surface(setupWin); return; }
  setupWin = new BrowserWindow({
    // Wide enough that nothing wraps awkwardly; the HEIGHT is whatever the
    // page turns out to need (fitSetup) - a fixed one was a guess, and the
    // guess was short: the window scrolled.
    width: 680, height: 720, useContentSize: true, resizable: false, maximizable: false, fullscreenable: false,
    title: 'Dota Translator', backgroundColor: '#0a0d10', autoHideMenuBar: true, show: false,
    webPreferences: { preload: path.join(here, 'setup-preload.cjs'), contextIsolation: true, sandbox: true },
  });
  setupWin.removeMenu();
  setupWin.loadFile(path.join(here, 'setup.html'));
  setupWin.once('ready-to-show', async () => { await fitSetup(); if (setupWin && !setupWin.isDestroyed()) surface(setupWin); });
  // Nothing in this window goes anywhere but the page it was given.
  setupWin.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  setupWin.webContents.on('will-navigate', (e) => e.preventDefault());
  // Closing the window is not quitting: say where the app went (the user
  // asked, 2026-09-22), unless the close IS a quit.
  setupWin.on('close', () => {
    if (quitting || !tray) return;
    tray.displayBalloon({ iconType: 'custom', icon: balloonIcon(), title: 'Still running in the tray', content: 'Dota Translator keeps working by the clock (behind the ^ arrow). Click its icon for settings, right-click to quit.' });
  });
  setupWin.on('closed', () => { setupWin = null; });
}

// Make the setup window exactly as tall as its page, capped to the screen.
// Asked again when the page says its content changed (a result appearing).
async function fitSetup() {
  if (!setupWin || setupWin.isDestroyed()) return;
  try {
    const want = await setupWin.webContents.executeJavaScript('Math.ceil(document.body.getBoundingClientRect().height)');
    const room = screen.getPrimaryDisplay().workAreaSize.height - 60;
    const [w] = setupWin.getContentSize();
    setupWin.setContentSize(w, Math.max(400, Math.min(want, room)));
    // DT_SHOT=<file>: the window photographs itself - the only way to look
    // at it while a game covers the screen.
    if (process.env.DT_SHOT_MORE && !fitSetup.opened) { fitSetup.opened = true; setupWin.webContents.executeJavaScript('document.getElementById("more").open = true'); return; }
    if (process.env.DT_SHOT) setTimeout(async () => { try { fs.writeFileSync(process.env.DT_SHOT, (await setupWin.webContents.capturePage()).toPNG()); } catch { /* closed */ } }, 600);
    if (DEBUG) console.log('setup window: page needs', want, 'screen allows', room, '-> content', setupWin.getContentSize().join('x'));
    setupWin.center();
  } catch { /* closed meanwhile */ }
}
ipcMain.handle('setup:fit', fitSetup);

function makeTray() {
  // The app's own icon: an amber square with a D (docs/logo.svg, rendered
  // by tools/makeicons.mjs) - NOT Dota's logo, which is Valve's trademark
  // and not ours to use.
  tray = new Tray(nativeImage.createFromPath(path.join(here, 'tray.png')).resize({ width: 16, height: 16 }));
  tray.setToolTip('Dota Translator ' + app.getVersion());
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Settings and key...', click: openSetup },
    { label: 'Hide or show the translations (Alt+D)', click: toggleHidden },
    ...(cfg.sayHotkey ? [{ label: cfg.sayHotkey.replace('Control', 'Ctrl') + ' in Dota\'s chat sends it translated', enabled: false }] : []),
    // The way a player says anything back: one big box and an optional
    // e-mail, no account needed. cfg.feedbackUrl (https only) overrides it.
    { label: 'Send feedback, or report a bad translation...', click: () => shell.openExternal(String(cfg.feedbackUrl || '').startsWith('https://') ? cfg.feedbackUrl : FEEDBACK_URL) },
    { label: 'Support the developer (Ko-fi)', click: () => shell.openExternal('https://ko-fi.com/sc0rebreaker') },
    { label: 'Version ' + app.getVersion(), enabled: false },
    { type: 'separator' },
    { label: 'Quit', click: quitApp },
  ]));
  tray.on('click', openSetup);
  // With a key there is no window at all at startup, and Windows hides a
  // new tray icon behind the ^ arrow: say where the app went. A balloon
  // takes no focus, and Windows holds it back itself over a fullscreen game.
  if (storedKey() || hostedOn()) {
    tray.displayBalloon({ iconType: 'custom', icon: balloonIcon(), title: 'Dota Translator is running', content: 'It sits here by the clock (behind the ^ arrow) and shows translations above the chat in Dota. Click the icon for settings.' });
    tray.on('balloon-click', openSetup);
  }
}

function toggleHidden() {
  if (!win || win.isDestroyed()) return;
  hidden = !hidden;
  if (hidden) win.hide(); else if (inFront) win.showInactive();
}

ipcMain.handle('setup:state', () => ({ version: app.getVersion(), update: updateState, hasKey: Boolean(storedKey()), display: cfg.display, settings: uiSettings(cfg), languages: LANGUAGES }));
ipcMain.handle('setup:folder', () => {
  // The file may not exist yet on a fresh install: make it, so that there
  // is something in the folder to find.
  if (!fs.existsSync(CONFIG_PATH)) saveConfig({});
  shell.showItemInFolder(CONFIG_PATH);
});

// The five settings the window offers, applied to the running app: the
// overlay's page is reloaded (it is told its settings on every load) and
// the reader restarted if WHICH LANGUAGES changed, since that is decided
// where the lines are read.
function applySettings(patch) {
  const languagesChanged = patch.scripts && JSON.stringify(patch.scripts) !== JSON.stringify(cfg.scripts);
  // Another reader altogether: the watcher starts again with it.
  const sourceChanged = Boolean(patch.source) && patch.source !== cfg.source;
  Object.assign(cfg, patch);
  if (win && !win.isDestroyed()) win.reload();
  return languagesChanged || sourceChanged;
}
// Which way Ctrl+Enter translates is saved THE MOMENT IT IS CLICKED, not on
// Save. The user picked "in English", closed the window, and Russian kept
// coming out as Russian "with both settings": config.json had not been
// written since the day before. A choice that looks made should be made.
ipcMain.handle('setup:sayInto', (_e, which) => {
  const patch = settingsPatch({ sayInto: which }, cfg);
  if (Object.keys(patch).length) { saveConfig(patch); Object.assign(cfg, patch); }
  return { sayInto: uiSettings(cfg).sayInto };
});
ipcMain.handle('setup:theirs', (_e, which) => {
  const patch = settingsPatch({ theirLanguage: which }, cfg);
  if (Object.keys(patch).length) {
    saveConfig(patch); Object.assign(cfg, patch);
    spoken.fallback = cfg.theirLanguage;
    if (patch.scripts) restartWatcher();
  }
  return uiSettings(cfg);
});
ipcMain.handle('setup:update', () => { lookForUpdate(); return updateState; });
ipcMain.handle('setup:quitInstall', quitApp);
ipcMain.handle('setup:close', () => { if (setupWin && !setupWin.isDestroyed()) setupWin.close(); });
ipcMain.handle('setup:guide', () => {
  // The live page, not the copy that came with the app: a file:// address
  // in the browser looks wrong, and a key is no use offline anyway.
  shell.openExternal('https://dotatranslator.live/key.html');
});
ipcMain.handle('setup:save', async (_e, payload) => {
  const display = payload && payload.display === 'box' ? 'box' : 'above';
  const typed = tidyKey(payload && payload.key);
  const patch = settingsPatch(payload && payload.settings, cfg);
  // The window has had no key field since v0.5.0 (the hosted translator);
  // a key typed by an old page, or in config.json by hand, still works.
  if (!typed) {
    saveConfig({ display, ...patch });
    const restart = applySettings(patch);
    applyDisplay(display);
    if (restart) restartWatcher();
    return { ok: true, checked: false };
  }
  const r = await checkKey(typed, { model: cfg.model });
  if (!r.ok) return r;
  const canEncrypt = safeStorage.isEncryptionAvailable();
  saveConfig(canEncrypt
    ? { geminiApiKeyEnc: safeStorage.encryptString(r.key).toString('base64'), geminiApiKey: '', display, ...patch }
    : { geminiApiKey: r.key, display, ...patch });
  applySettings(patch);
  cfg.geminiApiKey = r.key;
  applyDisplay(display);
  restartWatcher();
  // The key itself does not go back to the page.
  return { ok: true, checked: true, sample: r.sample, en: r.en };
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  keys.stop();
  if (watcher) watcher.stop();
});

app.on('window-all-closed', () => app.quit());
ipcMain.on('quit', quitApp);

// Quitting with an update ready INSTALLS it and STARTS the new version. Left
// to electron-updater's own quit handler the install is silent and the app
// stays closed (SEEN: the user's copy 'just closed after updating and I had
// to manually reopen').
let quitting = false;
function quitApp() {
  quitting = true;
  if (updateState.status === 'ready') {
    try { updater.autoUpdater.quitAndInstall(true, true); return; } catch { /* then a plain quit */ }
  }
  app.quit();
}
