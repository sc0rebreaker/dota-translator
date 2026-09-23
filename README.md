# Dota Translator

Translates Russian Dota 2 chat into English, live, on a transparent overlay
above the game. Free for players, source available, nothing to sign up for:
download, restart Dota once, play.

```
[all]  unc status: hello everyone
       привет всем
[team] Иван: go mid
       иди мид
```

## Read this before you install it

**It does not read the game's memory.** Chat comes from Dota's own Game
State Integration feed - the interface Valve built into the game for
overlays and stream tools, where the GAME sends data to a program on your
PC that asked for it. The app never opens the Dota process, never injects
anything and never changes a file of the game's. `npm test` fails if any of
that stops being true.

What it does do, all of it:

- **Writes one small file into Dota's folder**:
  `game/dota/cfg/gamestate_integration/gamestate_integration_dotatranslator.cfg`.
  That is how anybody asks Dota for its feed. It tells the game to send
  chat events to `127.0.0.1` - your own PC, nowhere else. Delete the file
  and the feed stops. Dota reads it only when it starts, so the first time
  you are asked to restart Dota once.
- **Looks at two small spots of the game's picture.** The feed says which
  SEAT spoke, not which hero. So when somebody new speaks, the app captures
  the portrait beside the newest chat line (about 56 x 40 pixels at 1080p)
  and, if that is not clear, that player's tile in the top bar, compares it
  with the hero portraits in your own Dota install, and throws it away.
  Only while Dota is the window in front; nothing is saved or sent
  anywhere. It is one file, [`src/rowgrab.ps1`](src/rowgrab.ps1).
  `"gsiRowGrab": false` turns it off: no capture at all, and other players
  are then shown by their colour only.
- **Asks Windows which window is in front**, and where the game's window
  is, so the text sits above the game's chat and hides when you alt-tab
  ([`src/focuswatch.ps1`](src/focuswatch.ps1)).
- **Presses keys for you - only if you use it.** When you press
  `Ctrl+Enter` in the game's chat to [send a line translated](#saying-something-back),
  the app presses select, copy, paste and Enter through Windows, as a macro
  key would ([`src/sendchat.ps1`](src/sendchat.ps1)). `"sayHotkey": ""`
  turns it off.
- **Sends the chat lines that need translating to this project's own
  translator** (`translate.dotatranslator.live`), which passes them to
  Google's Gemini and returns the English. Nothing that is said is logged
  there; it keeps a short-lived cache of text and translation, with nothing
  about who said it, and counts how many players used it each day. Lines already in English never leave your PC. There is
  a fair daily allowance per player that normal play never reaches.

What nobody can promise you: Valve has not reviewed or approved this app,
and the Steam Subscriber Agreement does not bless third-party tools in
general. The feed is Valve's own interface and nothing here gives an
advantage in the game - but a tool that captures bits of the screen and can
press keys is still yours to judge. **Use it at your own risk**, as with
any third-party program.

### Why it does not read the game's memory

Because Valve treats that as cheating, whatever is read. In February 2023
Valve [banned over 40,000 accounts](https://www.dota2.com/newsentry/3677788723152833273)
for software that read data out of the Dota client - caught by a trap, a
piece of memory that normal play never touches - and wrote that running any
application that reads data from the client while you play can get an
account "permanently banned". The sentence makes no exception for a tool
that only reads the chat already on your screen. Earlier versions of this
app did read memory, because nothing gentler was then known to work; once
the game's own feed turned out to carry chat, the memory reader was taken
out. It is not in the app and not in the installer.

What the program does on your PC, how to check the download against the
source, and how to report a problem: [SECURITY.md](SECURITY.md).

## How the chat is read, and what was tried first

- **Game State Integration carries chat, and it is the right way.** Dota's
  own feed for overlays and stream tools sends, in its `events` section,
  `chat_message` events with the text, the channel and the speaker's seat.
  Seen: own and others' lines, team and all chat, Cyrillic intact, live
  games and replays. Nothing of the game's is touched. What it does not
  carry is who the seat IS - no name, no hero - which is what the two
  screen spots are for.

Before that was found, every other route was tried and measured:

- **`console.log` does not contain chat.** Dota draws chat with Panorama and
  never sends it to the engine console. Tested with `-condebug` on, in a
  match: the log grew 2 KB while a typed test message appeared nowhere in it.
- **The `DOTA_CHAT` log channel cannot be switched on.**
  `log_level DOTA_CHAT default` answers **"Log verbosity levels are
  locked"** - in a match and in the main menu alike.
- **Reading the whole screen with a vision model works, but not for free**:
  roughly 1,200 API calls a game.
- **Reading memory worked** - 0.2 seconds from said to shown - and is gone,
  for the reason above.

[NOTES.md](NOTES.md) and
[NOTES-2026-09-20-memory.md](NOTES-2026-09-20-memory.md) hold the older
measurements.

## Setup

You need Windows and Dota 2. The app's small helpers run through PowerShell,
which Windows already has.

1. **Run Dota in Borderless Window or Windowed mode.** Settings, Video,
   Display Mode; either works. Not Exclusive Fullscreen: that owns the screen
   and no overlay can sit on it.

2. **Install it.** [Download `Dota-Translator-Setup.exe`](https://github.com/sc0rebreaker/dota-translator/releases/latest/download/Dota-Translator-Setup.exe)
   (always the latest release) and run it. It installs for your user only (no
   administrator needed), adds a shortcut and starts the app. The installer
   is not code-signed, so Windows SmartScreen asks first: *More info*, then
   *Run anyway*.

   From source instead: `npm install`, then `npm start`. `npm run dist`
   builds the installer into `dist/`.

3. **Restart Dota once, and play.** The window that opens says so: Dota
   reads its chat-feed setting only when it starts. The same window is behind
   the tray icon later, for the settings.

`-condebug` is **not** needed. That was for the old log reader.

## Ways to run it

- `npm start` - the overlay.
- `npm run demo` - drives the whole chain from a fake source, with no Dota
  running at all.

## Above the game's own chat

By default the translated lines appear just above Dota's chat, in the same
type and lined up with it, as `name: english (what was said)` - each one
the moment it is said, in Russian, turning into English about a second
later. Other players are shown with their hero portrait and called by their
colour (`Pink`, `Teal`) - the feed has no names for them; your own lines carry
your name. Nothing is drawn over the game's own lines. The overlay hides
itself whenever Dota is not the window in front.

`"display": "box"` is the other look: a dark panel instead of bare text.

## How quick it is

Dota sends its feed about once a second, so a line reaches the app up to a
second after it is said; the translation takes about another second.
Measured over a whole matchmade game: every line in English 0.7-0.9 seconds
after the app heard it. A line somebody has said before costs no call.

## Keys

- `Alt+D` hides and shows the overlay.
- `Alt+Shift+D` quits.
- `Ctrl+Enter`, in Dota's chat, sends what you typed translated (below).

## Saying something back

Open the game's chat as you always do (`Enter`, or `Shift+Enter` for all
chat), type what you want to say in English, and press **`Ctrl+Enter`
instead of `Enter`**. About a second later it is said, in their language.
Plain `Enter` still sends exactly what you typed.

- **How: the app presses keys for you, and you should know that it does.**
  `Ctrl+A`, `Ctrl+C` to take what you typed; then, with the translation,
  `Ctrl+A`, `Ctrl+V`, `Enter`. They go through Windows, as a keyboard's or
  a macro key's do. It happens once, when you press the key, and never
  unless Dota is the window in front. Valve has said
  nothing about it either way: at your own risk.
  `"sayHotkey": ""` turns it off, and then the app sends no keys at all.
- **Nothing is written to the game's memory, or read from it, for this or
  for anything.** The app never opens the game's process, and `npm test`
  fails if that ever changes.
- **It goes the other way too.** In the settings window, "Your own messages"
  can be set to *Russian -> English*: type Russian and your teammates read
  English. Same key; the choice is saved as you click it.
- The language is whatever the others were last seen typing in - and Russian until anybody has typed.
  `replyLanguage` in `config.json` fixes it (`"Ukrainian"`).
- If the translation fails, NOTHING is sent: your line is still in the
  chat, and the overlay says why. Your clipboard is put back afterwards.
- Each new line is one call on the same free 15 a minute as the incoming
  chat. A line you have said before costs nothing.
- **The same English is always the same line.** A model asked twice answers
  two ways, so the first answer is kept, in `said.json` beside your
  settings. It is plain text: if somebody who speaks the language tells you
  a line is off, correct it there.
- With the chat CLOSED the key finds nothing to copy and says nothing -
  but the game does see a `Ctrl+A` and a `Ctrl+C`, whatever you have
  bound to those.

## Settings (`config.json`)

| key | what it does |
|---|---|
| `model` | `gemini-3.5-flash-lite` by default |
| `gsiPort` | the port on your own PC that Dota sends its feed to (47854) |
| `gsiRowGrab` | name a speaker's hero from a small capture of the game's chat row and top bar. `false` captures nothing; other players are then shown by colour only (true) |
| `scripts` | which writing systems to translate. `["cyrillic", "han"]` by default - Russian, which is what this is built for, and Chinese, because so many pasted voice lines are. `spanish` (Latin American, US servers - told apart from English by its words, not its script), `greek`, `hangul`, `arabic` and `thai` are also known |
| `theirLanguage` | `"Russian"` or `"Spanish"`: what your teammates write. The settings window's first choice; it switches that language on and is what Ctrl+Enter writes until somebody has typed anything |
| `batchMs` | how long to gather lines before one call (80) |
| `holdSeconds` | how long a line stays on screen (14) |
| `fadeWithGame` | in `above` mode a translated line disappears when Dota's own line does, about 7 seconds after it is said, and `holdSeconds` is ignored. `false` keeps it for `holdSeconds` (true) |
| `maxLines` | how many lines the overlay holds (6) |
| `showHeroes` | the speaker's hero portrait before their name, as Dota's chat has it. The pictures are the game's own, read from your Dota install on disk; only if one cannot be read there is it fetched from Valve's public image server instead. `false` shows and fetches none (true) |
| `showOriginal` | show what was actually said, in brackets after the English: `go mid (иди мид)`. Nothing is added when the line was English already (true) |
| `display` | `above` (the default): the translated lines as plain outlined text, like the game's own, directly above Dota's chat - placed from where the game's window is, so there is nothing to position. `box`: a dark panel (see `position`) |
| `position` | where the chat box goes. `chat` (the default) is directly above Dota's own chat, growing upwards; or a corner: `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| `boxX`, `boxY` | put the box anywhere instead: fractions of the screen from its top-left, e.g. `0.02` and `0.5`. `-1` (the default) leaves it to `position` |
| `boxWidth` | how wide the box is, in pixels (520) |
| `clickThrough` | clicks pass through to the game (true) |

## What it costs

Almost nothing. Only lines containing Cyrillic are sent, and lines arriving
together go in one call, so Dota's own chat wheel ("Pushing mid", already in
your language) never costs anything at all. A normal game is a handful of
calls carrying a few dozen short lines - well inside a player's daily allowance.


## How it works

Worth knowing if you are reviewing the code:

- [`src/gsiconfig.js`](src/gsiconfig.js) finds Dota through Steam's
  registry key and writes the feed's config file.
  [`src/gsisource.js`](src/gsisource.js) listens on `127.0.0.1:47854` and
  turns each payload's `chat_message` events into lines. An event stays in
  the feed for about half a minute, so each is said once; the first payload
  only **primes**, so starting the app mid-game does not dump the match so
  far onto your screen.
- Only lines in the languages you ticked go to the model, several to a
  call when the chat is busy.
- The text is placed from the game window's position and size alone
  ([`src/gsilayout.js`](src/gsilayout.js)): Dota lays its chat out at a
  fixed place in 1080-high units. Seen on 5120x1440; if it sits wrong on
  your screen, set `"display": "box"` and send a screenshot.
- In a lobby with bots Dota numbers chat by join order, not by seat, so the
  first line there can carry the wrong colour; the chat-row capture
  corrects it from the second. Real games number by seat.

## If chat is not picked up

- **Restart Dota once** after the app's first start. The game reads the
  feed's config only at launch.
- If the overlay says it could not find Dota, the config file was not
  written: [open an issue](https://github.com/sc0rebreaker/dota-translator/issues)
  with where your Steam library is.
- **Steam running as administrator** stops the `Ctrl+Enter` key (Windows
  does not deliver a normal program's keys to an elevated one). Start Steam
  normally.
- An emoticon on its own arrives as an empty message and is not shown. A
  bot's canned phrases were seen NOT to arrive in the feed at all.

## Testing

```bash
npm test
```

Plain Node assert, no runner, and none of it needs Dota running: the feed
reader is fed payloads recorded from real games.

## Feedback

Tell me what worked and what did not: the [feedback form](https://forms.gle/4UwGB5drooGT4mUB9)
is one box, needs no account, and is also in the app's tray menu. A wrong
or odd translation is the most useful thing to report - include the
original line and what the app showed. If you prefer GitHub,
[issues](https://github.com/sc0rebreaker/dota-translator/issues/new/choose)
have forms for a bad translation, a bug and an idea, and pull requests are
welcome.

## Supporting it

It is free and stays free. If it helped and you feel like it:
[ko-fi.com/sc0rebreaker](https://ko-fi.com/sc0rebreaker). Donors get nothing
extra - there is nothing extra to get.

## Licence

**[PolyForm Noncommercial 1.0.0](LICENSE.md)** - free for players, not for
products.

In plain terms:

- **If you play Dota, it is yours.** Use it, change it, share it, fork it,
  build on it. You owe nothing and there is nothing to sign up for.
- **If you sell software, you need permission.** A paid tool cannot bundle
  this as a feature - not a subscription app, not an overlay platform, not
  anyone else charging for it. Ask, and we can talk.
- Charities, schools, research and public bodies are covered as
  noncommercial, whatever funds them.

This is **source-available**, not open source in the OSI sense - that
definition requires allowing commercial use, and this deliberately does not.
Calling it open source would be wrong, so it is not called that here.

Note what the licence does *not* restrict: your own use is noncommercial
whether or not you happen to stream, and nothing here limits fair use.

No subscription, no licence key, no paid tier. The translating runs on the
project's own server so that there is nothing to set up.
