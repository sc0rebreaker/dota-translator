# Dota Translator

Translates Russian Dota 2 chat into English, live, on a transparent
Electron overlay above the game. Free for players, source available,
runs on the player's own Gemini key. Windows only.

The user plays EU servers with Russian teammates who will not or cannot
use English. That is the whole point of it.

---

## >>> MEMORY READING IS GONE (the user, 2026-09-22: "memory reading will not stay") <<<

READ THIS FIRST; much of what is below it describes the memory reader and is
HISTORY now. **RELEASED AS v0.4.0 (2026-09-22 01:10; the user: "push")** -
master pushed and tagged together, because the site alone going live beside
v0.3.7 would have described a download that did not exist. CHECKED: one
release, three files, the 80.5 MB installer answers 200, latest.yml says
0.4.0, the live page says "does not read Dota's memory". Installed copies
update themselves and then need Dota restarted ONCE (the overlay says so):
NOT seen on an updating copy. The probe cfg is deleted from Dota's folder.
NOT done before it: the Electron 33 -> 44 bump. What was decided and done:

- `DEFAULTS.source` is `'gsi'`; `main.js` starts the feed reader for anything
  but `'log'` and does not import the memory watcher; `src/memscan.ps1` is
  excluded from the installer (`build.files`). A test holds all three, and
  another that no file gsi mode uses can open or read a process. SEEN at run
  time: the app spawned `rowgrab.ps1` and `focuswatch.ps1`, no `memscan.ps1`.
  The memory reader's CODE (memscan.ps1, memsource's spawn, offsets, the
  scanner's tests and tools) is still in the repo: removing it is a separate
  clean-up, NOT done. `memwatcher.js` stays: it is the chain behind any source.
  `npm run watch` still drives the memory reader from source: NOT looked at.
- README, SECURITY.md, docs/index.html and docs/download.html are rewritten
  for a no-memory app: what it does INSTEAD (one cfg file in Dota's folder,
  two small screen captures, Windows asked for the front window, keys on
  Ctrl+Enter), that versions up to 0.3.7 read memory and why that ended
  (February 2023 kept, as history), "Valve has not approved it", "at your
  own risk". The page's numbers are the FEED's: once a second, translation
  0.7-0.9s, about two seconds said -> English. The old 0.2s / 0.3% of a core
  are gone; CPU cost of gsi mode is NOT measured. `npm test` holds the new
  wording and still forbids "safe". **The live site is unchanged until
  master is pushed, which is right: it must not describe a download that
  does not exist yet.** Decisions that fell with this: "not on an account
  you would mind losing" and "unsanctioned third-party tool" are no longer
  required wording. NAME NO OTHER PRODUCT still stands.
- **THE WEBSITE DOES NOT TALK ABOUT MEMORY READING (the user, after v0.4.0:
  "this is past ... u can only keep the one It does not read Dota's
  memory").** One sentence, the catch's first item; no February 2023, no
  0.3.7, no history anywhere in `docs/`. A test counts the word. The README
  keeps the history - it is where a reviewer looks. Do not put it back.
- A setup-window checkbox for choosing the reader was built and removed
  within the hour: there is nothing left to choose.
- An installer of this state is in `dist/` for the user's friend, who plays
  a lot and will test it (REBUILD before handing it over if anything changed
  since; it says 0.3.7 like the public one but is newer). The user does not
  want to play more test games unless something is seen not working.
- BEFORE THE RELEASE: bump the version (0.4.0), the Electron 33 -> 44 PR
  tried in a match, delete the probe cfg from Dota's folder, names for
  strangers decided (the recommendation given: portrait + colour is enough),
  then tag and push.

## THE HOSTED TRANSLATOR (built 2026-09-22; NOT deployed, NOT switched on)

**DECIDED by the user, reversing "no hosted shared API key":** the Reddit
post reached 490 upvotes in nine hours, and the key step is what stands
between "download" and "it works". Their key on a server, everyone uses it;
if it gets traction and the bill is real, a small subscription later; if
not, fine. The translator stays free and THE OWN-KEY PATH STAYS: a player's
key is always used instead of the server.

- **THE SERVER IS A SEPARATE, PRIVATE REPOSITORY:
  `sc0rebreaker/dota-translator-server`, checked out at
  `../dota-translator-server`. Its code, prompts, limits and notes are NOT to
  be copied into this public one** (a test fails if a `server/` folder
  appears here). The user asked how to protect the project while it is free:
  the app stays open - that is why strangers trust an unsigned exe beside
  their Steam account - and the server is where it is protected. Everything
  about how it works, what was measured and what is not done is in THAT
  repo's CLAUDE.md. The server commit was taken out of this repo's history
  before it was ever pushed.
- This repo has only the CLIENT, `src/hosted.js`: `POST /v1/translate`
  `{id, lines:[{name,text}]}` and `POST /v1/say` `{id, text, into}`. The
  `id` is sha256 of the player's Steam id (the feed's `player.steamid`:
  `onSteamId` through gsisource -> gsiwatcher -> main) or of a random
  `installId` until the game has said who they are; a Steam id never leaves
  the PC as itself. Refusals `allowance` and `budget` are said in words that
  point at the own-key window.
- The app uses it only when `hostedUrl` is set (https, or http://localhost)
  AND there is no key: no setup window opens, incoming chat goes through
  `hosted.translate`, Ctrl+Enter through `hosted.say` (createOutgoing's
  `remote`); said.json and the local cache work as before. `hostedUrl` is
  BLANK in the defaults: nothing has changed for anybody yet.
- **SEEN WORKING, 2026-09-22 (bot match, dev copy with a config holding NO key
  and `hostedUrl` = https://translate.dotatranslator.live):** no key window,
  straight to "Reading chat."; incoming Russian translated and shown with
  portrait and name; Ctrl+Enter said "how are we doing today" as "как дела
  сегодня" through the server; the server's /health counted the lines. The
  user: "seems to be working". The setup window still shows a key field
  (the user asked; told it goes with the next change).
- **SWITCHED ON, v0.5.0 (2026-09-22; the user: "ok go with those and build the
  release", allowance 200 lines a player a day, ceiling 100000 a month):**
  `hostedUrl` defaults to https://translate.dotatranslator.live; the setup
  window has NO key field any more ("Ready to play ... restart Dota once";
  Save saves the settings); the first start ever (no config file yet) opens
  it once; the tray balloon comes with or without a key; refusals say
  "used up, back tomorrow" / "back on the 1st" with no key mentioned. An own
  key in config.json / GEMINI_API_KEY still wins and is documented as the
  option. Site: "Two steps, two minutes", no key step, the FAQ says where the
  chat goes (the server, nothing logged) and that an own key is possible;
  download.html: "talks to three places" starts with the translator. README
  likewise. `docs/key.html` stays, unlinked from the steps. A test fails if
  the landing page asks for a key again. SEEN (DT_SHOT): the first-run
  window - Ready to play, the two looks, the direction, More settings, Save.
- **A HEARTBEAT (v0.5.3):** while Dota is in front and the hosted translator
  is in use, `main.js` posts `/v1/ping` (the id, nothing else) at once and
  every minute, so the server's /health can say how many players are in a
  game NOW (the user asked for live users). A failed ping is silent.
- **THE SERVER WINS OVER A SAVED KEY (v0.5.4).** SEEN the same evening: the
  user's installed copy still held the key it had saved before 0.5.0, so it
  went to Google's free tier directly - which was in a bad spell ("high
  demand", timeouts) - while the server, on the paid key, answered in 0.8s.
  "Translation is very slow" was that. Now hostedUrl set = the server, full
  stop; a key is used only with hostedUrl blank. The user's installed
  config had its saved key blanked by hand the same evening.
- **THE SETTINGS WINDOW IS ALWAYS ON TOP while open (v0.5.8).** The user: it
  opened behind Chrome and "goes back the moment I move my mouse towards the
  browser" - and so did Windows Settings, so something on their PC keeps
  Chrome topmost (PowerToys Always On Top or the hover-activate option;
  told). v0.5.6 tried topmost-for-400ms and v0.5.7 topmost-until-blur;
  neither held. SEEN in a 25-frame screen recording: 0.5.6's window behind
  Chrome in every frame with Chrome up. The user: "this way its better".
- **SPANISH, v0.6.0 (2026-09-23; the user: US servers - "Peruvians on US East" - and "the spanish back and forth with same eng -> rus and rus -> eng setting").** The one language told apart by WORDS, not script: `src/spanish.js` (`looksSpanish`: Spanish-only chat words incl. LatAm slang and insults, minus every word both languages share and minus the game terms - "vamos mid" is Spanish; accents/ñ/¿¡ count double; biased to "not Spanish" when English words outnumber). It sits in `SCRIPTS` as `spanish` with a `.test` face; the SAME file is copied to the server (`lib/spanish.js`) because the server gate refuses "not chat" otherwise - KEEP THEM IDENTICAL. New setting `theirLanguage` (Russian | Spanish): the window's "Your teammates write" pair, saved on click (`setup:theirs`), switches that script on, relabels the direction radios, and is the language tracker's fallback (`spoken.fallback`). REAL OUTPUT through the live server: "q haces wey ayuda abajo" -> "what are you doing dude help bot"; "cuidado vienen 3 por mid" -> "careful 3 coming mid"; "ese sniper es un manco" -> "that sniper is a noob"; say into Spanish: "buy wards please" -> "compra wards porfa", "stop feeding" -> "deja de fedear", "sorry my bad" -> "perdon mi error"; Spanish -> English: "compren wards porfa" -> "buy wards please". SEEN (DT_SHOT): the window with the new pair. NOT seen in a game; nobody who speaks Spanish has read the output. The 49-line detector test is the spec.
- **NO SAVE BUTTON (v0.6.1, 2026-09-23; the user: "remove the save button").** Every choice in the settings window saves the moment it changes (`saveNow` in setup.js -> the same `setup:save`), the slider when released; a small "Saved." beside Close. Unticking the last language is refused on the spot. Before: half the window saved on click, half only on Save. SEEN (DT_SHOT): Close alone. NOT exercised: a click saving against a running match.
- **CHINESE FOR SEA SERVERS, v0.6.2 + v0.6.3 (2026-09-23; the user: "ok add chinese for sea", after research ranked it first - the most repeated SEA complaint, 2023-24 Steam threads, is Chinese players who cannot use English, China's servers emptying).** A third "Your teammates write" choice (`THEIRS` Russian | Spanish | Chinese, `THEIR_SCRIPT` Chinese = han); the Ctrl+Enter pair relabels to English -> Chinese / Chinese -> English. A workflow tested it LIVE (30 SEA lines in, 26 says) with three judges per set (meaning / Dota register / rules): 29/30 and 23/26 right at first; the server prompts were then tuned on what they found (my bad = 我的锅, a trailing "help" is a request, 菜 = bad not "noob", short hero names SF/AM/ogre, lowercase chat English) and every flagged line re-checked right, Russian unchanged. The same workflow's code review found, and refuters CONFIRMED, three client faults fixed in v0.6.3: (1) picking a language did not reset the tracker, so a Cyrillic line seen earlier kept Ctrl+Enter in Russian after Chinese was chosen (Spanish too, since 0.6.0) - now `spoken.choose()` clears it; (2) the direction's "Saved: ..." note kept the old language; (3) the new script was prepended, so the next save saw a changed list and restarted the reader - now kept in the window's order. SEEN (DT_SHOT): three choices on one row. NOT seen in a game on SEA; nobody who reads Chinese natively has checked the output - the judges were models.
- **EVERY LANGUAGE AND SWITCH TESTED, v0.6.4 (2026-09-23; the user: "research more what players might say commonly in all different languages ... run a decent amount of simulations ... make sure the translation works correctly with every single language and language switch").** Eight languages (Russian, Spanish, Chinese, Korean, Greek, Arabic, Thai, Ukrainian), ~420 researched chat lines with meanings, all three directions, run FOUR times through a SANDBOX copy of the server (see the server's CLAUDE.md) with three model judges per language each round. Meaning judge, first run -> final: Russian 48->50/50, Chinese 49->50, Greek 46->50, Ukrainian 48->50, Spanish 44->49, Korean 46->55/56, Arabic 58->62/65, Thai 45->48. Nobody who speaks these languages has checked the output: the judges were models.
  - Client changes: `src/chatlog.js` Korean gate takes the bare consonants chat is typed in (ㅈㅅ sorry, ㄱㄱ) but not a line of only ㅋ/ㅎ/ㅠ/ㅜ/; ; Arabic gate is letters only (٢٥ alone costs no call). `src/spanish.js` (KEEP IDENTICAL to the server's): WEAK half-votes (q k ke ta pa na xd), English verbs with Spanish endings (pusheen, fedear), an Arabizi veto (digits 2/3/5/7/9 inside a word, wallah/yalla) that exact Spanish ordinals (2da, 3er), dota2, 7u7, salu2 and ñ¿¡ override, English contractions count as English, pa'l only with its apostrophe. `src/outgoing.js` scriptOf: Ukrainian by і ї є ґ (Ctrl+Enter answered Ukrainians in RUSSIAN before), Persian by KEYBOARD letters (ی ک پ ژ with none of ي ك ة ى - dialect letters چ گ flipped Iraqi players). said.json: hosted lines carry the prompt version `v` and a fingerprint `h`; the heartbeat (/v1/ping) tells the app each language's current version and a stale line is asked again (a file from 0.6.3 or older is marked 'legacy' and refreshed once); a line the player edited (fingerprint no longer matches) is kept for good; a stale line is the fallback when the server fails; a file that will not parse is copied to said.broken.json and the app starts afresh. Settings: each "Saved." under its own block, reserving its line (no resize), and the window is centred only when it opens.
  - DT_DEBUG prints `say-into {into, why, ...}` whenever the language Ctrl+Enter would write changes - how the switches were tested with no game. **THE END-TO-END SWITCH TEST PASSED 12/12 on the real app** (driven over the DevTools protocol, `--remote-debugging-port=9333`, GSI payloads POSTed to 47854, sandbox as hostedUrl): every "Your teammates write" and direction click, language ticks, Korean/Arabic/Greek/Thai lines, Ukrainian, persistence. A code-level matrix of 243 combinations passed. NOT seen: Ctrl+Enter itself in a game after a switch.
  - **A BLUE SCREEN happened during the first E2E run**: bugcheck 0x113 VIDEO_DXGKRNL_FATAL_ERROR (NVIDIA, RTX 3080) ~40 s after the user started Dota while the test's DEV COPY ran beside it. Cause not known; the user was told to update the NVIDIA driver. RULE: never run a dev copy beside Dota. The E2E driver is in the session scratchpad (e2e.mjs), not the repo.
- NOT done: a privacy page of its own (one FAQ answer and one README bullet
  say what is kept); the first-run path seen on a clean install.
- OLD, done: the default `hostedUrl` and the release that switches it
  on; the setup window's first-run wording; the SITE and README, which the
  user said to LEAVE until the server has been seen working ("hold on with
  changing readmes") - and whose claims ("no server of ours", the three
  steps starting with a key) become false the day it is on, with the tests
  that hold them; a privacy note; the app itself seen running on it.

## >>> GSI CARRIES CHAT. SEEN 2026-09-21 21:10, bot match, GSI version 48 <<<

The redditor was right and the old note ("GSI carries no chat") is DEAD.
The user typed one line in each channel; both arrived in the `events`
section of the payload, Cyrillic intact:

```
"events": [ { "game_time": 79, "event_type": "chat_message", "player_id": 0,
              "channel_type": 11, "message": "проверка zebra" },
            { "game_time": 74, "event_type": "chat_message", "player_id": 0,
              "channel_type": 12, "message": "zebra gsitest" } ]
```

- `channel_type` 12 = allies, 11 = all (one sample each). Newest first.
- An event STAYS in the list payload after payload (seen for 15s+), so a
  reader must dedupe: game_time + player_id + message. How long it stays
  is NOT measured.
- There is NO NAME and no hero, only `player_id` (the slot). `player` holds
  only the local player; `allplayers` did not arrive for a player. Where
  names/heroes for other slots come from is NOT solved.
- Sections that really arrived for a PLAYER: provider map player hero
  abilities items draft wearables buildings league events couriers
  neutralitems roshan minimap (+ added/previously). `allplayers`, `chat`,
  `messages`: nothing.
- NOT SEEN YET: another player's line (a bot's, a teammate's, an enemy's
  all chat) - only the local player's own; say -> payload latency (payloads
  came ~1/s with the probe's cfg; throttle/buffer can go lower); whether
  the overlay's position can still come from anywhere without memory (it
  cannot - `above`/`cover` need HudChat's layout; the `box` look does not).
- **A bot's "I'm retreating" (seen in the game's chat by the user, ~21:14)
  did NOT arrive**: no `chat_message` with a player_id other than 0 in 262
  payloads, though bots' purchases, kills and rune pickups did (as
  `generic_event` CHAT_MESSAGE_ITEM_PURCHASE / HERO_KILL / FIRSTBLOOD and
  `bounty_rune_pickup`, player ids 3-8). That line is a canned, localised
  bot phrase, not typed text, so this does NOT settle whether another
  HUMAN's typed line arrives. It needs a second human in a lobby.
- **OTHER PLAYERS' TYPED LINES DO ARRIVE. SEEN ~21:20 in a real match
  (matchid 9010147157; the user left the bot game and queued):** all chat
  from player_id 5 ("hello", "whats up guya", "guys", "no hellos?"), 4
  ("hi2u2") and 8, all `channel_type` 11, same shape as the user's own.
  Player 8's was an emoticon/smiley and arrived as `"message": ""` - an
  empty message is an emoticon, not a fault. NOT SEEN: an ALLY's team-chat
  line (12 from someone other than player 0), and a Cyrillic line from
  another player (no reason to doubt it; the user's own came intact).
- **The redditor confirmed the same limit (told to the user, 21:27):** works
  in live games, replays are the easiest to test with, and there is no way
  they found to tell WHO player "8" is. LOOKED in our payloads: `player`
  is the local player only (name, steamid); `minimap` lists heroes by
  `unitname` and `team` with NO player id; kill events give player ids
  with no hero. So GSI alone gives: slot number -> the slot's COLOUR
  (fixed per slot in Dota) and team (0-4 / 5-9), not name or hero.
- **REPLAYS ARE A TEST BENCH. SEEN 21:45, replay of match 9009919633:**
  chat arrives there as in a live game (`player_id` 8 "U LUCKY IM LAGGING",
  `player_id` 0 "gg ez", both `channel_type` 11), and a SPECTATOR's payload
  names everybody: `player.team2.player0..4` / `team3.player5..9` with
  `name`, `steamid`, and `hero.teamN.playerN.name` = `npc_dota_hero_*`.
  So in a replay slot -> name -> hero is all there; for a PLAYER in a live
  game it is not. A GSI reader can be built and tested against a replay of
  a game with Russian chat, with nobody playing. NOT seen in a replay:
  team chat (a replay may only hold all chat - unknown).
- An event stays ~27-28 payloads (~30s at ~1/s). Dota's JSON is sometimes
  MALFORMED there: two events merged into one object with duplicate keys.
- The probe cfg is still in the game's folder and `gsiprobe.mjs` was left
  running: the test is not over until another player's line is seen.

**WHERE THE EVENING ENDED (2026-09-21, 23:40).** Everything stopped, no
strays (checked): probe listener, dev copy, grab rig. Left as they are: the
repo's `config.json` on `"source": "gsi"`; BOTH cfgs in the game's
`cfg/gamestate_integration` folder (the app's, and the probe's - harmless
with no listener, and it saves a Dota restart next time the log is wanted;
delete `gamestate_integration_dtprobe.cfg` when the probing is over);
`gsiprobe.log` (~210 MB, gitignored) and `grabs/`, `grabs-match1/`. All
commits LOCAL, nothing pushed, v0.3.7 still what players get. The user
posted a Reddit EDIT saying the translator is being rebuilt on GSI.
NEXT: build the chat-row grab into gsi mode (DONE, below), say in the README that it captures small
regions of the screen, place the text above the game's chat from the
window's size alone (DONE, below), and find out why the SETUP WINDOW opened by itself
when the dev copy started with a key saved (seen in the log, 22:35).

### THE CHAT-ROW GRAB IS IN GSI MODE (built 2026-09-21, late; NOT seen in a game)

- `src/rowgrab.ps1` (kept warm; ready 0.6s after start with 143 portraits
  loaded) + `src/rowgrab.js`. When the feed brings a line from a seat whose
  hero is not known, `gsisource` asks it `row <id>`: it asks WINDOWS where
  the front window is, refuses unless that is Dota ("the game is not in
  front" - SEEN, with the desktop in front), copies ONE rectangle off the
  screen (the newest chat row's portrait plus 8px of slack: ~56 x 40 px at
  1080p), matches it against the game's own portraits and keeps nothing.
  The tile is placed from the game window's client area (origin + size), so
  a windowed game should work: NOT seen. Nothing is saved, no process opened,
  no keys (a test holds all three). `gsiRowGrab: false` never captures.
- The portraits to compare with are written ONCE from the player's pak01
  into `%TEMP%/dota-translator-faces` (0.36s) - never into the repo.
- Rules in `createGsiChat`: only when a payload brought exactly ONE new chat
  event (an emoticon is a row too; with two, the newest row is the second
  one's); an ENGLISH line is not shown but still teaches its speaker's hero;
  a hero already known in another seat is not believed; score under 0.8, no
  answer in 700ms, or a throw = the line goes out unnamed as before and the
  next line from that seat tries again; lines keep their order while one
  waits; a new match forgets. With no `identify` the source is synchronous,
  exactly as it was.
- **MEASURED, the app's own matcher on last night's saved grabs
  (`node tools/rowcheck.mjs [grabs|grabs-match1]`): 18 of 18** - marci
  0.965-0.969, alchemist 0.895-0.906, meepo 0.942, shredder 0.908-0.917,
  the next best hero 0.51-0.67; **19-37ms a match**. So a line waits ~30ms
  for its portrait, not the 700ms cap.
- **THE TOP-BAR FALLBACK (built the same night; NOT seen in a game):** when
  the row is not sure, `identify(seat)` asks the helper `seat <id> <0-9>`:
  ONE tile of the top bar - the speaker's seat, since `player_id` = seat in
  a real game - top 60% only, against the top 60% of every portrait. A dead
  hero's grey tile scores low: nobody is named and the next line tries
  again. Worst case a line waits two timeouts (1.4s); a real answer is
  ~30ms each. **MEASURED with the app's matcher on the saved top grabs
  (`rowcheck.mjs`, which now does both): match 1, 14 grabs, 87 of 140 tiles
  sure; the replay, 64 grabs (most outside the game), 215 of 640 - and
  NEVER two heroes sure for one seat, every seat that spoke agreeing with
  its chat row (0 meepo, 3 alchemist, 4 marci, 8 shredder).** Seat 7 of
  match 1, the cosmetic Phantom Assassin, was never sure: unnamed, not
  wrong. IN A LOBBY WITH BOTS player_id is NOT the seat, so there the
  fallback can name the wrong hero (the row grab cannot); only the "one
  hero, one seat" rule stands in the way. Not the case that matters.
- The colour still comes from the seat (`player_id` = seat in real games).
  NOT built: reading the row's COLOUR (the fix for bot
  lobbies), names. NOT seen: any of it over the live game; a wrapped newest
  line (the portrait is a row higher: it will score low and stay unnamed); a
  cosmetic portrait; a flipped HUD. The README does not yet say the app
  captures the screen - it must, before gsi mode is released.

### GSI MODE: THE TEXT ABOVE THE GAME'S CHAT, FROM THE WINDOW ALONE (built 2026-09-21, late; NOT seen in a game)

- `focuswatch.ps1` now also prints `{"t":"window","x","y","w","h"}` while
  the game is in front: the client area of the front window, real pixels
  (DPI-aware), on a change and every 5s (a reloaded overlay page has
  forgotten it). Still asks only Windows: no process opened, no capture (a
  test holds that). `src/gsilayout.js` turns it into the same `layout` the
  memory helper sent, and `gsiwatcher` hands it to `onLayout` - ONLY for
  `display: "above"`; `cover` needs the game's real rows and stays the box.
- The numbers: HudChat is 400.5 units LEFT of the picture's centre line and
  620.25 down, in 1080-high units, scale = height / 1080, row 25.5 units
  (floored: 34 at 1440, 25 at 1080 - what the game itself reported). Derived
  from what the GAME said on 5120x1440 ((2026, 827), scale 1.33); a test
  holds that the module gives back exactly that. It agrees with the row
  grab's portrait position found by screenshot.
- SEEN: the helper run by hand against the browser: a window line at once
  and again 5s later. NOT seen: any of it over the game (Dota was running;
  nothing was started against it), 16:10 / 4:3 (the game may scale by
  width there), a HUD-scale setting, a game rendering below the desktop's
  resolution, a dragged window (the helper reports the move; untried).

- **SEEN OVER THE GAME (bot match, 2026-09-22 00:06, 5120x1440, dev copy):**
  the feed-free layout arrived as scale 1.333, rows 34 - what the memory
  reader used to be told - and our row sat directly above the game's chat,
  `[Allies]` at the SAME left edge as the game's own line, 224px above it
  (221 expected). Alt-tabbed, nothing of ours was over the browser. In an
  earlier run the same evening NO row of ours was on screen in two frames
  though the log had sent it (lines answered from the cache, English equal
  to the Russian): NOT explained, not seen again after a restart.
- **A FAULT FOUND IN IT, fixed:** Russian pasted and sent with Ctrl+Enter
  goes out unchanged, and `know(out, typed)` then taught the reader that
  Russian means Russian - "it also doesnt translate" (the user). A line
  that went out exactly as typed teaches nothing now. SEEN after: "Алло,
  Спирит? Я перезвоню" -> "Hello, Spirit? I will call back". (Ctrl still
  held from Ctrl+V when Enter is pressed IS Ctrl+Enter - likely how a plain
  paste-and-send ends up on the say key.)
- **THE BOT-LOBBY SEAT, FIXED FROM THE CHAT ROW (same night):** the row
  said "Blue" with no portrait where the game wrote the player's name in
  PINK (seat 5: dire, team_slot 0 - team + team_slot is right in a bot lobby
  too; the user called it purple, the screenshot says pink) with Pudge. The
  row grab HAD seen Pudge, and "a hero already known in another seat is not
  believed" threw it away. Now (`seatOf` in `createGsiChat`): when the ROW
  grab - never the top bar, which looks at the seat the number names - shows
  a hero the roster has in another seat, TWICE running for that chat id,
  lines with that id are said as that seat: name, hero, colour. Once is not
  believed (the newest row may be somebody else's). SEEN in the log, twice:
  first line "Blue" slot 0, from the second on "unc status", pudge, slot 5;
  the user: "it only missed for the first one, the others were correct".
  NOT caught in a screenshot (the user alt-tabs between lines). A WRONG
  TURN, reverted before commit: colouring by player_slot (2) there.
- **A BUG IN IT, found by the user on 0.5.1 (bot game, Muerta): shown as
  Vengeful Spirit, blue, for the whole game.** The row grab was not sure of
  Muerta, so the TOP-BAR fallback looked at seat 0 - the feed's number for
  the user in that lobby - which held a BOT (Vengeful Spirit), wrote that
  down as seat 0's hero, and with a hero known the seat was never looked at
  again: the re-seating could not happen. FIXED (v0.5.2): a top-bar hero is
  `tentative`; a seat with a tentative hero is still grabbed on every line;
  a sure ROW answer overrules it (and re-seats as before); a top answer
  never overrules anything. Tested; NOT seen in a game. Why the row was not
  sure of Muerta is NOT known (her portrait? the user alt-tabbed?) - the
  installed app has no log; the dev copy with DT_DEBUG prints every grab.
  SEEN with the dev copy right after (bot game, Muerta): the ROW was sure
  both times (muerta 0.918, next best grimstroke 0.54), first line Blue,
  from the second "unc status", muerta, seat 5 - so the Muerta portrait is
  fine, and the earlier failure was the row being unsure for some other
  reason (alt-tab is the likely one), then the top bar naming the bot.

- **A WHOLE MATCHMADE GAME IN GSI MODE (9010363907, 2026-09-22 00:24-00:40,
  the user Furion, dire seat 5, dev copy; a recorder shot the chat area at
  every row):** 7 rows, all translated in 0.7-0.9s. SEEN in a screenshot:
  our row - the game's own Furion portrait, the name in PINK as the game
  writes it (seat 5 = chat player_id 5: the numbers agree in a real game,
  second sample), the game's font - at the SAME left edge as the game's
  lines and directly above its six-line chat window, all chat with no tag
  as the game has it. The placement from the window alone held all game.
  - The one STRANGER's Cyrillic line (seat 4, all chat, an enemy or ally not
    known) went out as "Orange" with no portrait: the user was ALT-TABBED at
    that moment (the shot shows the browser), so the grab rightly refused
    ("the game is not in front"). So a stranger's portrait from the row
    grab is STILL NOT SEEN live. An English line teaches the hero too, but
    nothing logs that: add a debug line for grabs before the next game.
  - ODD, by design: a CHINESE voice line sent with Ctrl+Enter went out in
    Russian and came back shown as the Chinese that was typed ("what was
    typed" is what the row means) - reads strangely in a box of English.
  - Everything stopped after, no strays (checked).

- **After that game (built, NOT seen):** with `DT_DEBUG` every answer of the
  row-grab helper is printed as it came (`grab {...}`: hero, score, second
  best, or why not), so the next game says which lines were looked at. And
  in gsi mode the dark `box` look is placed in the game's WINDOW (the same
  window event, through `place()`), not on the primary screen. The memory
  reader's box is still placed against the screen.

### THE GSI READER: BUILT the same evening, OPT-IN (`"source": "gsi"`)

**NOT TO BE RELEASED YET (the user, 2026-09-21 22:45): "we dont need to
relese it before we get it fully working the same way as memory reader."**
So: no tag, no push of a version that offers it, nothing on the site or
README about it, until GSI mode matches the memory reader - names,
portraits and colours for other players, and the text above the game's
chat rather than in the box - all WITHOUT reading memory. Commits to master
stay local until then (master = released; pushing would not ship it, since
a release is a tag, but `offsets.json` is fetched from master - harmless -
and the site is built from `docs/`, untouched). The gaps are listed below.

The user: "ok do it, keep the original one while we don't [know] if this
still works". So the memory reader is STILL THE DEFAULT and nothing about
it changed; a test holds `DEFAULTS.source` to `'memory'`.

- `src/gsisource.js` listens on `127.0.0.1:47854` (`gsiPort`) and turns
  payloads into the same `onMessage({name, text, channel, slot, hero})` as
  `memsource.js`; `src/gsiwatcher.js` puts memwatcher's chain behind it;
  `src/gsiconfig.js` finds Dota (Steam's registry key, then
  `libraryfolders.vdf`) and writes
  `cfg/gamestate_integration/gamestate_integration_dotatranslator.cfg`
  (provider map player hero events; throttle and buffer 0.1s). A NEWLY
  written cfg puts "Restart Dota once" on the overlay - Dota reads these
  files only at launch.
- Each event is said once (key: game_time|slot|channel_type|message; an
  identical line twice in ONE second would be one); the first payload only
  primes; a new matchid forgets the old one's people and chat; an emoticon
  (a private-use character, SEEN U+E0B8) is stripped and a line of nothing
  else dropped; an unknown `channel_type` is SHOWN as all chat and reported
  once; a body that will not parse still gives up its chat by regex.
- **Names:** the player's own slot is `player.player_slot` (SEEN equal to
  the chat's `player_id`: 4, in the live match) so their own lines carry
  name and hero; a spectator's payload names everybody; anybody else is
  called by their slot's colour (`Pink`, `Green`...), painted in it.
- **What this mode does NOT have:** the chat's position (so `above` and
  `cover` get no layout and the lines go in the box), the focus signal (the
  overlay stays up when alt-tabbed, and the Ctrl+Enter key - registered on
  focus - is NEVER registered: saying something back does not work in gsi
  mode yet), and other players' names and portraits.
- PROVEN: `node tools/gsireplay.mjs [--all]` plays `gsiprobe.log` through
  the reader - tonight's 1,300 payloads gave exactly the 13 worded lines
  said, right names in the replay, the emoticon dropped. And END TO END
  with the real model (`watch`, source gsi, recorded payloads POSTed at
  it): "проверка zebra" -> "zebra check" in 2s, and the cfg landed in the
  game's folder.
- **SEEN OVER THE LIVE GAME (bot match, 21:55, dev copy, `source: gsi`,
  Dota restarted so it read the app's cfg):** Dota connected to 47854 and
  to the probe's 47853 at once (`netstat`: two cfgs, two feeds). Five lines
  typed by `saychat.ps1`: the box came up above the game's chat with the
  player's portrait, `[Allies]`/`[All]`, name in the slot's colour, italic
  while waiting, then `english (original)`. Timed by screenshot from the
  rig's Enter: NOT up at +1.1s, English up at +2.8s ("good game, thanks
  everyone"). So said -> English is between 1.1 and 2.8s, against ~1.1s
  for the panel reader; say -> SHOWN was not pinned down (one shot at
  +2.0s had a line still pending). GSI's own delay is the unknown part.
  All five lines reached the probe too (28 payloads each).
- **THE FOCUS SIGNAL FOR GSI MODE (built 22:25):** `src/focuswatch.ps1` +
  `focuswatch.js` ask WINDOWS which window is in front and what program
  owns it (the owner's name looked up only when the owner changes), and
  print `{"t":"focus","on":0|1}` per change; `gsiwatcher` feeds it to the
  same `onFocus` the memory helper fed, so the overlay hides on alt-tab and
  the Ctrl+Enter key is registered in gsi mode too. It never opens the
  game (a test holds that). SEEN: run by hand it said 0, then 1 when the
  user went back to the game. NOT seen: the overlay hiding on it, nor
  Ctrl+Enter in gsi mode.
- **The redditor's advice on the cfg (he built this once): "it sends
  events way too frequently ... only need events 1 in data".** MEASURED on
  the probe's cfg (EVERY section, throttle and buffer 0.1): 462 payloads in
  462 seconds - exactly ONE a second, 26.7 KB each. So Dota did not send
  faster than 1/s here whatever the throttle said, which also bounds chat
  latency at about a second before the model. The app's cfg asks for five
  sections, not fifteen; `events` ALONE would lose the matchid (map) and
  the player's own name, slot and hero (player, hero). NOT tried: whether
  an events-only cfg is sent SOONER after a line (it might be - then a
  second, events-only cfg beside the first is the trick).
- **A TEAMMATE'S LINES, SEEN 22:05 (a second human in the user's lobby,
  match 9010203548, the user radiant slot 2, the tester slot 1):** allies
  chat from ANOTHER player arrives, `channel_type` 12, Cyrillic intact
  ("го рошан", "всем привет"), and their all chat as 11. On the overlay:
  `[All] Teal: hello everyone all (всем привет all)` - named by slot colour,
  in teal, no portrait, as designed. The tester's English lines arrived in
  the feed and were rightly left alone. That closes the GSI test: own and
  others', both channels, live and replay.
- **ON DIRE TOO (22:12, match 9010209601, both humans on dire):** a
  teammate's allies chat is `channel_type` 12 there as well ("го мид"), all
  chat 11. So 12 = "my team", whichever team.
- **A DOUBT THIS RAISED, NOT CHECKED:** in that lobby the user was
  `team_name: dire, player_slot: 2` and the tester `player_id` 1 - NOT 5-9,
  as in the first live match (dire, slot 4). In a lobby with bots the ids
  seem to follow join order, not the side. The reader paints a name in
  `SLOT_COLOURS[player_id]`; if the GAME colours a dire player by their
  seat (5-9), our colour - and the colour NAME we call a stranger by - is
  wrong in such lobbies. **CONFIRMED WRONG THERE (the user): the tester,
  `player_id` 1 on dire, was "rather yellow" in the game's chat; we would
  have said Teal.** ("Not the brighter yellow that opponents are": so
  OLIVE, seat 6 - the game colours by SEAT, radiant 0-4 / dire 5-9, and an
  opponent in seat 3 is the bright Yellow.) In the radiant lobby the same id 1 WAS teal in the
  game (screenshot). `team_slot` is no help: it read 0 for the user in all
  three live matches, whatever their `player_slot` (4, 2, 2). So in a
  bot lobby on dire, player_id -> colour is not known; whether a MATCHMADE
  game numbers 0-4 / 5-9 (and is then right) is the thing to check in the
  first real game: screenshot our row beside the game's. Compare a screenshot of our row with the game's
  own line before trusting the colour names. Matchmade games may well be
  0-4 / 5-9 and fine: NOT seen either.
- **AND THE PLAYER'S OWN LINE, SAME LOBBY (the user: "I am purple and it
  shows blue"):** their chat events carried `player_id` 0 while `player`
  said `player_slot` 2 - and purple IS colour 2. So in that lobby the game
  colours by `player_slot`, and the chat's `player_id` is a DIFFERENT
  number (it looks like the order the humans joined: user 0, tester 1).
  The reader keys its roster by player_slot and looks up by player_id, so
  the user's own line lost its name and hero too and was called "Blue".
  Where the two numbers AGREED: the bot game alone (0/0) and the one
  matchmade game (4/4). So the working theory is "they agree when nobody
  shares the lobby with bots", i.e. in real games - ONE matchmade sample.
  Ctrl+Enter in gsi mode WAS seen working in this run ("hi" -> "привет").
- **HERO PORTRAITS FOR OTHERS IN GSI MODE - wanted (the user: "we also need
  to get hero avatars anyway later ... thats fine, if no memory reading").
  DECIDED: whatever route, it must NOT read memory.** A player's payload
  ties no hero to a speaker (hero/player: self only; minimap: heroes by
  name and team, no player id; draft: empty outside CM; kill events: ids,
  no heroes). Routes: (a) a web API for the live match - CHECKED 22:40:
  OpenDota's public `/api/live` is the TOP 100 games only (lowest average
  MMR in the list 6069, 120s delay, the user's match not in it), so it is
  no use for an ordinary pub; Valve's own GetRealtimeStats needs a Steam
  Web API key and a `server_steam_id`, which GSI does not give - NOT
  tried; (b) inferring slot -> hero from kill events against the minimap -
  slow, guessy, not built. Neither is a quick win. And all of it waits on
  the numbering question above: a portrait by slot is only as good as the
  slot.
- **THE USER'S IDEA FOR (a)-(b)'s gap: ONE SCREEN GRAB A GAME** ("since it
  is only 1 per game"). LOOKED AT in a screenshot already taken (5120x1440,
  crop x1960-3160, y0-70): the game's TOP BAR shows all ten hero portraits
  in SEAT order, five a side, each with its seat's COLOUR as a strip above
  it. So one grab gives seat -> hero AND seat -> colour, with no memory
  read (Electron's desktopCapturer, or CopyFromScreen, which is known to
  capture the game). Matching is small: each of ten tiles against the
  heroes `minimap` has named (or all 143 from `heroface.js`, which already
  decodes the game's own portraits from disk - the top bar's drawing may
  be a different crop of them: NOT compared). What it does NOT solve: which
  SEAT a chat `player_id` is, where those differ (bot lobbies), and names.
  A second grab would: when a line arrives, the game's own chat row shows
  that speaker's portrait and coloured name at a known place - match that
  one tile against the ten and the speaker's hero and colour are known
  whatever the numbering. NOT built. It is screen capture of the player's
  own game, which the README would have to say.
- **THE SCREEN-GRAB TEST RIG (built 23:10; the user: "test script ok"):**
  `tools/grabtest.mjs` (run DURING a game, beside `gsiprobe.mjs`: grabs the
  top bar every 30s and the game's chat window 0.3s and 1.2s after the feed
  reports a line, into `grabs/`, gitignored; `tools/grab.ps1` does the
  capture) and `tools/grabmatch.mjs` (AFTERWARDS: seat -> hero per top
  grab, and per chat line the hero beside the game's newest row, hence the
  speaker's seat and colour; `tools/grabmatch.ps1` compares 16x9 thumbnails
  by zero-mean normalised correlation against ALL 143 of the game's own
  portraits from `heroface.js`).
  - **MEASURED on tonight's screenshots, before any game:** top bar 10 of
    10 right against all 143 heroes, scores 0.87-0.97, the best WRONG hero
    0.51-0.77; the chat-row portrait 2 of 2 (0.90, 0.93; next best 0.66).
    The same picture shrunk to 1080p size (tiles 60x35, chat portrait
    40x24 - the user: "normal player has 1920 x 1080"): 10 of 10 and the
    chat tile again, scores within 0.02. A grab of the BROWSER (the user
    had alt-tabbed) scored 0.29-0.55 everywhere: below the 0.8 line, so it
    says "not sure" rather than naming a hero. The app must still only grab
    with Dota in front.
  - Geometry, in 1080-high units from the screen's centre line, ONE screen:
    top-bar tile 60 x 34.5, pitch 62.25, radiant's first at -416.25, dire's
    first at +107.25, 4.5 down; the newest chat row's portrait 39.75 x 24
    at -362.25, 735.75 down. A real 16:9 screen, a flipped HUD, a HUD-scale
    setting, a wrapped newest line, the pick screen: NOT seen.
  - The PowerShell case trap bit again: `$refs` IS the `$Refs` parameter.
  - **IN A REAL MATCHMADE GAME (9010254778, 22:40, the user Marci):**
    - **THE NUMBERING, SETTLED FOR REAL GAMES: the chat's `player_id` IS
      the seat.** The user sat in the top bar's seat 4, the game wrote
      their name in ORANGE (colour 4), and their lines came as `player_id`
      4. What is WRONG is `player.player_slot`: it said 5. `team_name:
      radiant, team_slot: 4` was right. `readRoster` now takes the player's
      own seat as team + team_slot (dire: 5 +), player_slot only as a last
      resort; before this their own line would have gone unnamed and seat
      5's speaker been given THEIR name. (Re-read with this, the first
      matchmade game fits too: dire, team_slot 0 = seat 5, and "hello /
      whats up guya" from player 5 were the user's; "hi2u2" was somebody
      else's.) Bot lobbies stay odd (purple with player_id 0) - not the case
      that matters.
    - Top bar: at the start of a game ICONS sit over the bottom of every
      tile (5 of 10 sure); comparing the TOP 60% only gives 9 of 10, scores
      0.84-0.97. The tenth, seat 7, is Phantom Assassin wearing a cosmetic
      that changes her PORTRAIT (best guess 0.56-0.58): an arcana/persona
      portrait is not in `heroface.js`'s set. The app need not care: the
      feed's `minimap` names the ten heroes, nine match, the tenth is who
      is left.
    - The game's chat row in a REAL game has a rank/medal icon BEFORE the
      portrait; the portrait is still where it was measured.
    - "A fault in the rig" that was not one: TWO copies of `grabtest.mjs`
      were running (a `timeout 8` trial run had not died with its timeout),
      so every grab was taken twice.
    - **THE WHOLE MATCH, COUNTED (24 minutes, 110 top grabs of which every
      8th was matched, all chat grabs):**
      - **Speakers: 3 of 3 right, 16 of 16 grabs** - player_id 4 -> marci,
        3 -> alchemist, 0 -> meepo, scores 0.89-0.92 with the next best hero
        at 0.51-0.59, the same at +0.3s and +1.2s. Each is the hero in that
        SEAT of the top bar: seat = player_id held for all three. A quiet
        game: five lines in all, none Cyrillic.
      - **Top bar: 6-9 of 10 sure in any ONE grab, never a WRONG hero above
        the 0.8 line.** A tile drops below it when its hero is dead (the
        portrait is greyed with a timer over it), or has something drawn on
        it; which tiles dip changes from grab to grab, so a vote per seat
        over a few grabs has all nine, and the feed's hero list gives the
        tenth (PA's cosmetic portrait never matched: 0.56 every time).
        After the match ended: 0 of 10, nothing above 0.43 - rightly unsure.
      - **A REPLAY, SCORED AGAINST THE FEED'S OWN ROSTER (9009673223, 23:12;
        a spectator's payload names every seat's hero, so this is truth, not
        eyeballing):** six in-game top grabs = 60 tiles: **60 of 60 best
        guesses RIGHT, 57 above the 0.8 line**, the three below it (0.58,
        0.76, 0.78) still the right hero; the ten grabs outside the game
        (loading, menus, the desktop) had NOTHING above 0.73 - no false
        "sure" anywhere. The one chat line (player 8, all chat): shredder
        0.90/0.91 = seat 8, and the feed says seat 8 IS shredder. The
        spectator HUD's top bar and chat row are where the player's are
        (bars under the portraits do not reach the top 60%). Replays seem
        to carry ALL chat only - one line is no proof. A LIVE spectated
        game hung on a black screen (Valve's coordinator timing out, in
        Dota's own log) and sent only empty heartbeats: not our doing.
      - So the design that follows: the CHAT-ROW grab is the strong signal
        (it names the speaker directly and was never wrong); the top bar is
        the fallback and the seat -> colour check. NOT built into the app.
      - NOT seen: an enemy speaker, a wrapped newest line, two lines
        arriving within a second (the newest row would be the second one's),
        a 16:9 screen, a speaker whose portrait is a cosmetic one.
- **"No better option than a screen grab?" (the user). LOOKED, 22:55:
  `console.log` is NOT one.** It does hold exactly what is wanted -
  `[Server] PR:SetSelectedHero 7:[I:0:0] npc_dota_hero_sniper(35)`, player
  id, steam id, hero - but every `PR:` line is `[Server]`: they are written
  only when the game HOSTS the match itself (the solo bot game, 21:54). The
  two lobby games on Valve's servers (22:05, 22:12) logged not one `PR:`
  line, no hero and no other player's name. So for a real game the log has
  nothing, as the old notes said of chat. Nothing else without memory is
  known: the feed (player view), the log, the public APIs are all checked.
- NOT SEEN: a whole game, the ENEMY team's allies chat NOT arriving (it
  must not; nothing suggests it does), the alt-tab behaviour.

What follows is the probe's setup, as written before the result:

**A redditor told the user they could read chat from GSI.** The notes
(NOTES-2026-09-20-memory.md, "GSI does NOT carry chat - confirmed") say no -
provider, map, player, hero, abilities, items, buildings, draft, wearables,
"no chat, no messages, no event log" - but they do NOT say whether that was
SEEN in a real payload or read somewhere, and the same round of research
produced the wrong claim about Valve. Newer builds may have an `events`
section that was not on that list. So it is being TESTED, not repeated. If
the redditor is right it is the best news the project could get: no memory
reading, no ban question, no antivirus flag - move the app to GSI at once.

**What is set up, and was CHECKED:**
- `...\dota 2 beta\game\dota\cfg\gamestate_integration\gamestate_integration_dtprobe.cfg`
  (the folder did not exist; made it). Labelled "safe to delete". Posts to
  `http://127.0.0.1:47853/`, asks for every section anybody has named:
  provider map player hero abilities items draft wearables buildings league
  events couriers neutralitems roshan minimap, and three hoped-for ones
  (allplayers chat messages) - Dota ignores names it does not know.
- `tools/gsiprobe.mjs [needle ...]`: the listener. Writes every payload to
  `gsiprobe.log` (gitignored), prints each NEW top-level section once, and
  shouts when a payload contains a needle. CHECKED with a fake POST: it
  caught "zebra". It was left running in the background of the cleared
  session with needles `zebra gsitest проверка`; **it has probably died with
  that session - start it again first:**
  `node tools/gsiprobe.mjs zebra gsitest проверка`
- Dota was NOT running when this was written. **Dota reads GSI configs only
  at LAUNCH**, so it must be started AFTER the cfg existed (it was not yet).

**What the user was asked to do:** start Dota, start a bot match, type
`zebra gsitest` in allies chat and `проверка zebra` in all chat
(Shift+Enter), then say so.

**How to read the result:**
- a `*** FOUND ...` line, or `grep -c zebra gsiprobe.log` > 0: GSI CARRIES
  CHAT. Note the exact field path from the payload, whether BOTH channels
  and OTHER players' lines are there (type as the player; have a bot or the
  rig say something too), and whether it arrives promptly. Then plan the
  move of the reader to GSI.
- payloads arrive, sections are listed, no needle: GSI does not carry chat
  for a PLAYER. Write the list of sections that really arrived into this
  file, replace the old note's "confirmed" with "SEEN, <date>", ask the
  redditor which field they meant and whether they were SPECTATING (some
  GSI data is spectator/caster only), and DELETE the probe cfg.
- no payloads at all: Dota was started before the cfg existed, or the
  listener is not running. `curl -X POST -d "{}" http://127.0.0.1:47853/`
  tests the listener.
- Whatever the answer: delete `gamestate_integration_dtprobe.cfg` unless
  the app is going to use GSI.

**Also open at the clear:** a dev copy of the app (`DT_DEBUG=1 npx electron
.`, log in the old session's scratchpad) may still be running - check
`tasklist` for electron.exe and stop it before starting another (single
instance, one key). v0.3.7 is the released version; master = released.

---

# WHERE THIS STANDS (2026-09-20, night)

**It works end to end.** In a live bot match, Russian typed into chat was
read out of the game's memory and translated in the terminal, and the
overlay drew it over the game. Nothing about the *approach* is unproven
any more.

```
[17:26:52] [team] unc status: let's do roshan
                              давай рошан
[17:27:08] [all]  unc status: я иду топ, помогите
```

Team chat and all chat both read, both channels right, the match backlog
primed away rather than dumped on screen. The second line went up
untranslated - that was a model call that timed out, which is what the
retry described below is for.

**And since 2026-09-20 (late) it reads the chat's own CONTAINER**, not
the process: a few KB four times a second instead of 340-490 MB every
second. In a bot match, lines typed by the rig at known times:

| | found | say -> found | read per poll |
|---|---|---|---|
| scanning, best configuration | 10/10 | median 1.3-2.7s, worst 7.3-23s | 340-490 MB, plus a 1-2.8 GB wide poll |
| **the chat panel** | **12/12** | **60-290ms, median ~200ms** | **~1 KB idle, ~3 KB with a new line, 0ms** |

Team and all chat alike. The price is one search for the panel per match
(two sweeps of private memory: 9.0-13.0s, 13.3 GB, two threads,
BelowNormal), and fragility: seven hard-coded offsets. The scanner is
still there underneath and takes over by itself when the panel cannot be
found or stops validating. Details under "THE CONTAINER" below.

**And the whole chain, reader + model + chat box, MEASURED end to end
(`tools/e2e.mjs`, two bot matches, 2026-09-20 19:11 and 19:22):**

| | lines | said -> SHOWN in the box | said -> ENGLISH |
|---|---|---|---|
| match 1, calls one at a time, retry after 2.5s | 9/9 | median 196ms, worst 294ms | median 1216ms, worst 1381ms |
| match 2, three calls at once, hedged | 15/15 | median 187ms, worst 295ms | median 1114ms, worst 1337ms |

- **A line is shown TWICE**: at once as `pending` (as said, dimmed,
  italic), then the English replaces it in the same row, by `id`. The
  reader is 0.2s and the model 1s, so this is what makes the box keep
  pace with the game. `memwatcher` gives every line an id; the pipeline
  carries it through; `overlay.js` swaps the row.
- **Calls run three at a time and a slow one is RACED, not retried**
  (`askGeminiHedged`: a second identical call after 1.3s, a third after
  2.6s, first answer wins). Why: in the overlay's first live run one
  line lost BOTH tries and went up untranslated at +10.6s. With one call
  at a time that would also have held every line behind it; it did not,
  the other three came through in ~1s each while it hung.
- **THE FREE TIER IS 15 CALLS A MINUTE, and it was run into (20:18).**
  `generate_content_free_tier_requests, limit: 15, model:
  gemini-3.5-flash-lite` - five lines in a row "quota exceeded" and up
  untranslated. That run doubled the load (the overlay and `e2e.mjs` were
  both translating the same lines), but a line per call plus hedging
  gets there alone in a loud game. The limit is per CALL, so the pipeline
  now governs calls, not lines (`callsPerMinute`, default 15, one kept
  back): the first half of the minute's budget is spent at once - that is
  the allowance for a fight - and after it calls are SPACED so the rest
  lasts until the oldest call ages out, everything said in between
  sharing the next call, unhedged. A line that has waited 10s is shown as
  said. MEASURED, 21 lines in 45s, one consumer:

  | | translated | say -> English |
  |---|---|---|
  | gather window widened with use (first attempt) | 15/21, six lost to the clock | 1.0-2.3s, then 10-11s and untranslated |
  | calls paced once half the budget is spent | **21/21**, no quota error | first 7: 0.9-1.3s; then 1.4-6.7s, median 2.2s |

  Do not run `e2e.mjs` with the overlay up: two consumers, one key.
- **A repeat is answered from a cache** (text -> English, 500 entries):
  55ms and 283ms measured, no call.
- **The chat box** (`overlay.html/js`): one dark panel, `[Allies]`/`[All]`,
  names in Dota's slot colours (dark ones lifted to be readable), original
  beneath. `position: "chat"` (default) puts it directly above the game's
  own chat, growing upwards. MEASURED on 5120x1440: Dota lays its HUD out
  in a centred 16:9 area; chat starts 0.31 across that area, 0.64-0.70
  down the screen. **NOT checked at 16:9/16:10/4:3 or with a flipped HUD**
  - `boxX`/`boxY`/`boxWidth` are the escape. Seen over the game by
  screenshot (`CopyFromScreen` does capture it), aligned with the game's
  chat; nobody has PLAYED with it there.
- **Cost, MEASURED** (12s windows, share of ONE core): idle with a panel
  found - overlay 0.0-1.0%, reader **0.3%** (it was 3.3% until the helper
  stopped calling `Get-Process -Name` every poll: that walks every
  process on the machine, and the reads themselves were "0ms"). Four
  lines in 10s - overlay 5.8%, reader 0.2%. Electron holds ~315-340 MB.
  Scanning was 46-63% of a core.
- **The match boundary, SEEN once:** the bot match ended while testing.
  On the dashboard there were 3 panels, not 4 - the HUD's was gone - and
  the next match had new addresses for all of DotaHud's. So panels are
  per match, as assumed. What was NOT seen is the reader living THROUGH
  it: each time it was a fresh start that found 3 panels within 8.6-12.8s.
- **`saychat.ps1` types wherever Dota is.** After the match ended, 15
  test lines went into the DASHBOARD's party chat (a party of one, so to
  nobody). It cannot tell a match from a menu. Look at the screen first.
- `DT_DEBUG=1 npm start` prints every row sent to the chat box.

**ABOVE MODE is the DEFAULT now (`display: "above"`, 2026-09-20 20:05).**
The user watched cover mode on their own chat and said overlapping was
"maybe not the best idea ... your choice". The choice: the same lines as
BARE OUTLINED TEXT (no panel - the user had asked for no black box, and
with nothing of the game's underneath none is needed), in a window that
ENDS where the game's chat window BEGINS: one chat-height (162 units =
the 216px the game shows, six lines, also when the chat is opened) above
the newest line. Placed from the game's own HudChat position and scale,
as cover is, so there is still nothing to position. Text starts where the
game's text starts; rows use the game's own row pitch. A line shows at
once, as said, italic, and turns into `english (original)`.

- SEEN over the live match in two screenshots 2s apart: three lines, the
  third still pending in the first and English in the second. Row spacing
  was a third too loose (a height already in screen pixels was scaled
  again); fixed after the screenshots and NOT seen since.
- **The font is the game's own, from the game's own folder.** The user
  said the fonts did not match: Dota's chat is Valve's Radiance, which
  exists only inside the install (`game/dota/panorama/fonts/radiance-*.otf`).
  The helper reports the exe path with its `attached` status, `main.js`
  derives the fonts folder and the renderer adds `@font-face` rules for
  it. NEVER copy those files into the repo. SEEN: third screenshot, same
  face as the game's lines below it, rows at the game's pitch. In this
  mode all chat carries no tag and names use Dota's exact slot colours,
  as the game does (the last of these changed after the screenshot).
- **"It worked at start, then stopped" (the user, 20:08). What was found,
  and what was NOT:**
  - The app had not stopped: Electron and its reader were alive, the
    window came back visible and topmost when Dota was brought to the
    front, and a line typed then was translated on screen.
  - **The likely cause is that the user re-pasted the same test lines.**
    A line whose words had been shown before was dropped, by design, and
    "gg" twice was one "gg". FIXED with the chat list itself: a child
    APPENDED to the end of the panel's array since the last poll is new
    whatever it says (the helper sends `n:1`, `memsource` lets it past
    the tracker). After a trim nothing can be told apart, EXCEPT that the
    newest line is still new if it is not the line that was newest
    before - which matters, because a trim usually arrives WITH the line
    that caused it, and a repeated line was lost exactly so. SEEN: the
    same line twice, 4s apart, delivered twice. The trim case is NOT seen.
  - **A WRONG DIAGNOSIS, written down so it is not believed later:** for
    ten minutes the log seemed to show translations never coming back,
    and that was reported to the user as a hang in the model call. They
    were coming back. The grep was for `"line"` in quotes and the debug
    log prints `line {` without them. Check the filter against a line
    known to be there before believing an absence.
  - What that goose chase left behind is still right and is tested: the
    model call's clock now runs until the BODY is read (it stopped at the
    headers, so a stalled body would have been waited for for ever), the
    hedge has an overall deadline, and the pipeline gives a call 12s
    before taking its place back. No hang was ever actually observed.
- **The colours were dimmer than the game's (the user, v0.2.6), white and
  names alike.** Two causes: `opacity` (0.92) was set on the BODY, so it
  dimmed everything in every mode, and the text was the box's off-white
  `#e8e6df`. From v0.2.7 `opacity` is the dark box's only, and bare text
  is `#fff` at full opacity with the exact slot colours. NOT seen over
  the game since; if it still looks dull, the game may draw its chat
  brighter than sRGB white on an HDR screen, which a window cannot match.
- **The text was BIGGER than the game's (the user, v0.2.8) though both
  say 18.** The game's real stylesheet was read out of `pak01` on disk
  (`panorama/styles/chat.vcss_c`; a VPK directory is easy to parse and
  compiled CSS is plain text inside): `DOTAChat#HudChat .ChatLine` 18px
  bold, shadow `1px 1.5px 0 #000`; `.ChatPersona` 20px; `.ChatTarget` 18px
  `#fbe6b9`; `.HeroIcon` 40x23, 4 right, 1px black border; `.Expired` is
  how a line goes; `chat_colors.vcss_c`: team and all chat TEXT is
  `#FAEAC9`, cream, NOT white.
  - **A WRONG THEORY, shipped in v0.2.9-0.2.11:** that Valve sizes a font
    by its cell (Radiance: 1.2 em) and so 18 means 15. It made the text
    13% too SMALL. Do not reason about Panorama's font sizing; measure.
  - **MEASURED, v0.2.12** (the user offered their bot match; four rounds
    of: `saychat` one line, screenshot at +2.6s, ours beside the game's
    copy of the same line, 4x zoom): the width of `[Allies]` matches at
    **17.4 units**; the name is **1.017** of the text, not 20/18; portrait
    **39.5 x 24** units starting 6.25 in, text 3.2 after it; tag -> name
    3.7 units; the colon is WHITE-cream, not the name's colour, 0.5 after
    the name and 4.3 before the text; shadow down-right only (an outline
    all round made letters look bigger). SEEN: the two rows line up to
    the pixel at tag and name. One screen, one scale (1.33).
  - **The portrait is the GAME'S OWN FILE from v0.2.13** (the user: "ours
    is bigger and shows a bit differently" - it was the same SIZE and a
    different DRAWING: the web server's picture shows Monkey King's staff,
    the game's is older and tighter on the face). `src/heroface.js` reads
    `panorama/images/heroes/npc_dota_hero_<name>_png.vtex_c` out of the
    player's `pak01` (directory parse 69ms once; a picture per hero,
    cached) and hands the overlay a data: URL with each row; the web
    picture is the fallback. 143 of 143 decoded on this install, in three
    pixel formats: DXT5 holding YCoCg (103; read as plain colour they come
    out orange and green - told apart by alpha not being flat 255), an
    embedded PNG (fmt 16), raw BGRA (fmt 28). SEEN at 10x beside the
    game's: the same picture; drawn 4% darker (`brightness(0.96)`,
    measured as mean colour) to match. Disk only, never the process, and
    nothing of it is in the repo.
  - Still different, knowingly: `(original)` is smaller and
    regular weight by design; all chat was not compared, only team.
  - A dev copy (`npm start`) CANNOT read the installed app's encrypted
    key (`DT_CONFIG` at it just opens the setup window - which steals
    focus from the game; it did, twice). The repo's own `config.json`
    has a plain key: run the dev copy with no `DT_CONFIG`, after closing
    the installed app (one key, one consumer, and the single-instance lock).
- The setup window's key guide opens the LIVE page
  (`sc0rebreaker.github.io/dota-translator/key.html`) from v0.2.7; it
  opened the bundled copy, and a `file:///C:/Users/...` address looked
  like a wrong link to the user.
- **The line goes when the game's line goes** (`fadeWithGame`, default
  true, `above` mode only; the user asked for it). MEASURED with
  half-second screenshots from the rig's Enter: the game's line is fully
  there at 7.0s and gone at 7.5s - a cut, not a fade. Ours is held 7000ms
  from when it was first SHOWN (as said, ~0.2s in), not from when the
  English arrived, then 250ms of fade; a translation that arrives very
  late still gets 2.5s. SEEN: at 7.2s the game's line half faded and ours
  up, at 7.8s both gone. That leaves ~6s of English after a 1.1s model.
- **Hero portraits before the name, as the game has them** (the user
  asked; `showHeroes`, default true). Each line's markup begins with
  `<img class="HeroIcon" src="...npc_dota_hero_furion.png" />`, long before
  the 48 bytes that are passed on, so the panel reader pulls the name out
  (`HeroIn`, line event `h`) - the SCANNER fallback cannot, and leaves the
  space empty so names still line up. The game's own portraits are inside
  its VPK archives, so they come from Valve's public image server,
  `cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/<name>.png`
  (256x144, the same internal name; checked: 200 for furion and centaur).
  It is the app's only network use besides the model, and the README and
  the landing page say so. Sized from the game: 7 units of padding, 43.5
  wide, 16:9, text at 49. `parseEvent` only takes `[a-z_]` for a hero - it
  goes into a URL. SEEN over the live match: same portrait, size and
  place as the game's own line beneath it.
- **AFTER A MATCH, IN THE MAIN MENU (the user, in the installed app): the
  overlay said "Finding the chat in memory..." and then flashed the last
  lines of the finished game.** Three faults, all fixed in v0.2.5, and
  REPRODUCED first: `tools/fakechat.ps1 -EndAfter 7` ends the stand-in's
  match while the process stays open (the HUD panel stops validating, its
  strings stay in memory) and copies the chat, a line at a time, into a
  ChatLinesPanel under `DotaDashboard`. The released helper put five
  "copied" lines out and ran a full sweep; the fixed one, none and none.
  1. **Only a MATCH's panel is read** (`InMatch`: under DotaHud). The
     menu's and the post-game's panels are watched - they are how a new
     match is noticed - and never read. The game copies the match's chat
     into them, and an APPENDED line counts as new whatever it says, which
     is exactly the rule that made repeats work.
  2. **Once the panel reader has worked in a game, the scanner never runs
     again in it** (`$panelEverFound`). With the match over it swept the
     process and dug the finished game's chat up out of freed memory. It
     is for the day the panel cannot be found AT ALL. After the panel goes
     there is one search at once, then only when the game's memory moves.
  3. **The overlay shows errors and nothing else.** How the app is getting
     on is for `npm run watch` and `DT_DEBUG`, not for the player's screen.
  NOT seen on the real game yet: only on the stand-in.
- What it gives up: the English is up to six rows above the line it
  translates when the chat is nearly empty. What it avoids is everything
  that went wrong with cover: the strip, the guess at when the game's
  line fades, the opened chat.
- **The overlay hides when Dota is not the window in front** (helper sends
  `{"t":"focus","on":0|1}` on change; Electron cannot see other apps'
  windows). Built for every display mode. NOT yet seen working.
- `cover` and `box` remain as settings.

**COVER MODE: BUILT, and seen working over the live game (2026-09-20,
19:40). It was the default for half an hour; see ABOVE MODE.** The read-only route was
tried first, as the user chose, and it was enough: the English is laid
over each line of the game's own chat, in that line's exact slot, as
`[Allies] name: english (original)`, portrait left showing. A screenshot
of three lines (team, all, team) shows every strip on its row.

- **Where the chat is comes from the game, not from constants per
  screen** (`tools/panellayout.ps1` found the fields): a UI panel keeps
  its size at +0x50/+0x54 and its position in its parent at
  +0x1b0/+0x1b4, in SCREEN PIXELS, and the UI scale at +0x1e0 (1.33 =
  1440/1080). Up the chat's ancestors only `HudChat` has a position,
  (2026, 827); the rest are 0,0. A line's panel has its height at +0x54
  (34; more when wrapped) and its TEXT width at +0x1a0. **A line's own y
  is not kept anywhere found** (0, with FLT_MAX beside it, even while
  visible): lines are simply stacked, newest lowest, so the overlay
  stacks them itself from the heights.
- **Two calibration constants, from ONE screenshot on ONE screen**
  (`main.js`): the line box starts 31.5 units right of HudChat's x and
  the newest line ends 140 units below HudChat's y, in 1080-high layout
  units, times the scale the game reports. Text starts 49 units into the
  line (7 padding + the portrait). That these are layout constants that
  hold at 16:9 / 16:10 / 4:3 / a flipped HUD is a BET, not a measurement.
  If strips are off on another screen, these three numbers are why.
- The helper sends `{"t":"layout", x, y, s, rows:[{a,h,w}]}` - newest
  first, 10 rows, `a` = address of the row's text (0 for a row that is
  not a chat line: it still takes its place) - when the stack changes and
  for two polls after, because a line's width is not there until the game
  has laid it out. Before the lines of the same poll, not after.
- `memsource` reports EVERY sighting of a line (`onSeen`), repeats too:
  the panel remakes all its children at new addresses when it trims, the
  tracker rightly drops those, and without the sightings the cover would
  lose every strip at the first trim. The overlay keys English by
  channel|name|text and maps address -> key. NOT yet seen across a trim.
- **The game shows a chat line for about 5 seconds** (strip of timed
  screenshots: there at 4s, gone by 7s), and a faded line KEEPS ITS SLOT
  (the next line appears at the bottom with the gap above it). So a strip
  stays put and outlasts the Russian under it, for `holdSeconds`.
- **The dark strip is only there while it has something to hide.** The
  user asked for no box, as Dota's chat has none; but without a write to
  the game the Russian is still drawn under the English, so for the
  game's own ~5s (`GAME_SHOWS_MS` 6000 from first sighting) there is a
  soft strip fading out to the right, and after that bare outlined text.
  SEEN in two screenshots 7s apart: strip then bare; a bot's English line
  between two translated ones left alone in its slot; and the strips moved
  up a row with the game's stack when a new line arrived. A chat with no
  box at all from the first moment needs replace-in-place (below).
- **WATCHING THE USER'S OWN CHAT (19:48-19:55), what was seen:** eleven
  of their pasted Russian lines translated and laid on the right rows,
  rows moving up with the stack. THREE FAULTS, the first fixed:
  (1) the strip went bare at 6s while the game still showed its line -
  English printed over Russian, twice; now 8.5s. (2) NOT FIXED: the
  overlay stays on top when the user alt-tabs - English drawn over their
  browser. Hide the window when Dota is not the foreground window.
  (3) NOT FIXED: with the chat OPENED (Enter) the game shows old lines
  again and a bare strip lands on top of one. Needs a "chat is open"
  signal. NOT in the nine UI panels from ChatLinesPanel up to HudChat:
  every byte of +0x40..+0x300 was the same open and closed. The float at
  +0x58 is not visibility either (static per line; on the wrapper it
  spikes and decays like a scroll). The client-side objects (+0x8 of each)
  were the next place to look; the user stopped that experiment, which
  presses Enter and Escape in their game - ASK before running it again.
  Until then the honest fallback is to never go bare.
- Chinese lines (voice-line pastes) are ignored by design: `scripts` is
  ["cyrillic"]. `"han"` exists; the prompt is written for Russian.
- Pending rows are not drawn in cover mode (the line is already on
  screen, in Russian, where the English will go), nor are lines that
  failed to translate. With no layout - scanner fallback, no match yet -
  cover mode IS the box.
- NOT handled: the chat OPENED (Enter) shows the scrollable history, where
  this stacking is wrong; a wrapped line's strip (`.wrap`) has never been
  seen; the electron window is 1333x453 over the middle of the game and
  click-through, which has not been played with.

## SAYING SOMETHING BACK (v0.3.0, 2026-09-21): RELEASED

Asked for by the first strangers who saw the app (a Reddit thread:
"no point in receiving messages in English if he says he doesnt
understand me"). Built on a branch (`say-back`) because the user wanted to
try it in a game before it reached anybody; they played with it that
morning, found four faults (all below, all fixed), said "I think it works
as it should", and it was merged and tagged v0.3.0 the same day.
**Installed copies get it by themselves, with the key ON: every player
who updates now has an app that can press keys in their game when they
press Ctrl+Enter.** That is said in the README and in the page's catch.

- **What it is:** the player types English into the game's OWN chat field
  and presses `Ctrl+Enter` (`sayHotkey`) instead of Enter. The app presses
  `Ctrl+A`, `Ctrl+C` (what was typed is now on the clipboard), translates
  it (`src/outgoing.js`), and presses `Ctrl+A`, `Ctrl+V`, `Enter`. Team or
  all chat is whichever the player opened. Plain Enter is untouched.
  `src/sendchat.ps1` presses the keys; `src/sendchat.js` keeps it running
  and holds the whole act (`sayTranslated`, tested with fakes). The
  player's clipboard is put back. The overlay says `Translating: ...`, and
  on a failed translation NOTHING is sent - the line is still in the chat
  and the overlay says why.
- **THREE DESIGNS IN ONE EVENING, and why this one:**
  1. *A say window + clipboard only* (built, commit 0d5ff49, the window is
     in that commit if it is ever wanted back). The user: "I don't know if
     its best ux" - five keypresses and two waits for a line, and it took
     the keyboard off the game, which was never seen to work.
  2. *Writing the translation into the chat field in MEMORY* (the user
     asked). Not built, on purpose: the game sends on Enter and the model
     needs ~0.7s, so it would not even be quicker without hooking the send;
     Russian is twice the bytes, and a wrong capacity is a crash; and
     writing to the game is the one thing this app has never done.
  3. *Keys* - this. The user asked "and this wouldnt write to the memory
     then?" - no: keys go through Windows (`keybd_event`), the game's
     process is not opened for it at all. Then: "ok go, build it that way".
- **It is still a new kind of thing for the app: it SENDS INPUT to the
  game.** Once per press of the key, never unless Dota is in front (asked
  before every group of keys, and again before the Enter that sends -
  Enter in the wrong window SENDS something to somebody). The README says
  so up front, in "Read this before you install it". `sayHotkey: ""` is
  off, and then no keys are ever sent. `npm test` holds the line: keys are
  sent from `sendchat.ps1` and nowhere else; nothing in `src/` declares or
  calls WriteProcessMemory / VirtualAllocEx / CreateRemoteThread / a hook;
  every `OpenProcess` is `VM_READ | QUERY`; the helper opens no process.
- **No "EN->RU mode" where plain Enter translates** (the user's first
  idea): Enter also OPENS the chat, the app cannot tell whether the chat
  is open (looked for on 2026-09-20, not found), and it would swallow
  every Enter and press keys blind into the game.
- **The helper is kept WARM**: started when Dota first comes to the front,
  then blocked on stdin. MEASURED: ready 1.3s after start (the C# compile),
  then a word is answered in 5-90ms. A cold start on the keypress would
  have been a second of nothing. It exits when the app's pipe closes.
  SEEN: with Dota running but NOT in front, `copy` and `send` both
  answered "the game is not in front" and pressed nothing; no stray after.
- **The hotkey exists only while Dota is in front** (registered on the
  helper's `focus` event). Ctrl+Enter is "send" in half the programs on a
  PC and a global shortcut swallows the key.
- **Which language** is not a guess: the app reads what the others type,
  so the script most recently seen decides (`createLanguageTracker`, fed
  from every pending and translated row), Russian until anything is seen.
  `replyLanguage` overrides by name; only letters of it reach the prompt.
- **REAL OUTPUT** (gemini-3.5-flash-lite, 11 calls, **0.56-0.93s each**):
  "buy wards please" -> "купите варды плз"; "smoke gank mid at 10:30" ->
  "смок в мид на 10:30 давай"; "you are trash, uninstall" -> "ты мусор,
  удаляй игру"; "gg wp" -> "гг вп"; "pudge missing, care bot" -> "пудж
  мисс, осторожно бот". FIXED from it: "i'm going top" came back as "иду
  хард" (the hard lane - wrong for half the players), so the prompt now
  says top/mid/bot are places; after: "иду топ, помогите". Nobody who
  speaks Russian has read these. "play safe" comes out oddly ("играйте
  сейвовенько").
- **The note while a line is away** (the user: the "Translating.." label
  was "misplaced randomly sometimes", "maybe the same color as text"). It
  WAS a small green line at the box's left edge - under the portraits'
  column, not where text starts - and stayed 8s whatever happened. Now it
  is a chat row: the player's own words, the chat's cream, italic and
  dimmed as a pending line is, starting where every row's text starts,
  followed by "-> Russian..." (the language it is going into). Only ever
  one; taken down the moment the line is said (an empty note clears it),
  because the game's own chat then shows the line. SEEN: in headless Edge
  with a stand-in for the preload bridge (a generated page that loads
  `src/overlay.js` and calls the handlers - the quick way to look at the
  overlay with no game), lined up under two chat rows. NOT seen over Dota.
- **THE OTHER WAY TOO, by a SETTING on the same key** (the user: "we should
  do russian to eng option as well ... better with setting ... but same
  hotkeys ... in the first window"). A second key (Ctrl+Shift+Enter) was
  half built and taken out again for that. It is `replyLanguage`, which
  already existed: `"auto"` = their language (Russian by default),
  `"English"` = English, whatever was typed - the player on the other side
  of the same problem. The setup window has it on its FIRST screen, under
  where the translations go, as two choices (`sayInto` in
  `src/settings.js`); a language set BY NAME in config.json ("Ukrainian")
  counts as "theirs" and saving the window does not flatten it. Read at
  each press: no restart. The prompt now says "from whatever language".
  REAL OUTPUT into English: "го рошан после драки" -> "rosh after fight";
  "купите варды пожалуйста" -> "buy wards please"; "иду топ, помогите" ->
  "going top, help"; "privet vsem, udachi" -> "hello everyone, gl hf" (the
  "hf" is the model's own); "go mid" unchanged. SEEN: the window's page in
  the browser pane, as a static snapshot. NOT seen: the real window, nor
  saving the choice - the user's dev copy was running against Dota, and a
  second copy would have opened their settings window over the game.
  **TWO FAULTS THE USER FOUND IN IT WITHIN MINUTES, both fixed:** (1)
  "russian one currently still keeps it russian, with both settings" -
  the choice had never been SAVED: config.json was last written the day
  before, and every key in said.json began "Russian|". They had picked the
  option and closed the window; only Save applied it. It is now saved the
  moment it is clicked (`setup:sayInto`), and the window says "Saved:
  Russian -> English". (2) "too difficult to read. It should be English ->
  Russian or Russian -> English" - the labels are exactly that now, not
  "...in their language". Look at config.json's mtime and said.json's keys
  FIRST when the direction seems wrong.
  NOT done for that player: their INCOMING chat is still translated into
  English only; a Russian speaker reading English teammates gets nothing.
- **"Is it always the same translation?" (the user). It was not, and
  temperature cannot make it so.** MEASURED at temperature 0, three fresh
  calls each: "nice play" -> "хорошая игра" | "хорошо сыграно" | "найс
  плей"; "dont feed, play safe" three ways; "come help me top" two. All
  fine Russian, none the same. So the first answer is REMEMBERED ON DISK:
  `said.json` beside the settings (DATA_DIR; gitignored), 500 lines,
  `"Russian|nice play": "..."`. The same English is the same line from
  then on, a repeat costs no call, and the player (or a Russian-speaking
  friend) can correct a line in the file by hand - it is read at startup
  and made one line before it is ever pasted. Temperature stays 0 anyway.
- A repeat is answered from that cache: no call.
  A new line is ONE call, two tries at most, made directly - NOT through
  the pipeline's 15-a-minute governor, which keeps one call back but does
  not know about these. In a loud minute an outgoing line can be the call
  that gets "quota exceeded" (then nothing is sent, and the overlay says
  so). Not seen; if it is, route it through the pipeline's budget.
- **FIRST TRY IN THE GAME (the user, 2026-09-21): IT WORKED** - "hello",
  typed in Dota's chat and sent with Ctrl+Enter, was said in Russian. So
  Dota's chat field DOES do Ctrl+A, Ctrl+C and Ctrl+V, and Ctrl+Enter
  reached the app. It came out as "Здарова" (which the user read as
  "Едарова" and asked whether it was standard): right, natural, and
  unreadable to the person it was said for. The prompt now keeps everyday
  words plain and only GAME terms slang, with the example in it - without
  the example "hello" got WORSE ("ку"). After: "hello" -> "привет", "hi
  guys, good luck" -> "привет всем, удачи", "sorry my bad" -> "сорян моя
  вина" (still slang; left). The user also did not understand the flow
  from its description ("how do I switch to russian again?") - whatever
  explains this to players must say: type, then Ctrl+Enter INSTEAD of
  Enter, and nothing else.
- **NOT SEEN BY ME, and partly answered by the above - the user tests this themselves:**
  - **that Dota's chat field does Ctrl+A and Ctrl+C at all.** Only PASTE
    is known to work (`saychat.ps1`). If select-all does not, Ctrl+V
    appends the Russian to the English; if copy does not, the key does
    nothing. The 30-second check: type in chat, Ctrl+A, Ctrl+C, paste into
    Notepad. If it fails, design 1's window is the fallback.
  - that Ctrl+Enter is free in Dota (believed unbound, NOT checked), and
    that the hotkey comes and goes with focus;
  - the timing of the keys (30ms taps, 60-120ms between groups: guesses
    from `saychat.ps1`, which used 40 and 200-250 and worked);
  - what Ctrl+A and Ctrl+C do with the chat CLOSED (they reach the game
    as whatever the player has bound);
  - the notes on the overlay; the clipboard being put back.
- **The landing page says it too** (the user, after playing with it: "I
  think it works as it should. update landing page too"): a section "And
  now you can answer" (`#back`) straight after the hero, before the numbers
  (the user moved it there from between what it does and the three steps) -
  three cards, every translation on them REAL OUTPUT from today - a line
  in the hero, a bullet in the catch ("it presses keys for you ... input,
  not memory ... can be switched off"), and a question in the FAQ that
  asks Russian speakers to report bad lines in an issue. `npm test` holds
  the page to "it presses keys for you" and "Nothing is written to the
  game". SEEN: desktop 1280 (a full-page headless Edge render, cropped
  with System.Drawing - `#hash` URLs rendered BLANK in headless Edge, the
  bare URL did not) and 375 wide in the browser pane, no sideways scroll.
  **Two PICTURES in it, not three cards** (the user: "it would be better
  with some screenshots like in hero section. The one with eng -> rus and
  one with rus -> eng"). They are the hero's scene again, smaller
  (`.shots` / `.shot`): a teammate's line, the game's chat field with what
  was typed and amber Ctrl + Enter keycaps, and the line as it was then
  said, highlighted. DRAWN in CSS like the hero - not screenshots of the
  game - with the portraits linked from Valve's server; the face-loading
  script now covers every `.face[data-player]` on the page, not only the
  slider's. The lines in them are real output ("go rosh after this fight"
  -> "идем рошана после этой драки"; "го рошан после драки" -> "rosh after
  fight"); the teammate's English line in the second is not a translation.
  SEEN at 1280 (headless Edge, cropped) with portraits loaded; at 375
  MEASURED rather than seen: no sideways scroll, rows and the typing bar
  7-14px inside their frames.
  It is on the BRANCH: the live site is master's `docs/`, so it goes live
  with the merge, not before - which is right, the page must not offer
  what the download does not have.
- NOT done: the key guide (`docs/key.html`) and `download.html` do not
  mention it, and do not need to.

## REPLACE IN PLACE: asked for as the DEFAULT, not built, one experiment blocked

**What the user asked for (2026-09-20, during the second bot match):**
rather than a second box positioned for every screen size, put the
English in the game's OWN chat, where the line already is, as
`english (original russian)` - and nothing in brackets when the line was
English already. Two modes the user can choose, **replace the default**,
the extra chat box the other. `display: "box" | "replace"` exists in
config; only `box` is built, and `replace` falls back to it and says so.
The chat box already uses the `english (original)` format, on one line.

**Where it stopped:** the first experiment - overwrite the bytes of one
of our OWN test lines in a bot match and see whether the chat redraws -
was DENIED by Claude Code's permission classifier ("Modify Shared
Resources") before anything was written. Nothing has ever been written
to the game. Do not work around that; the user has to allow it (a Bash
permission rule) or run the probe themselves.

**What is known without writing, for whoever picks this up:**

- The text object (vtable `panorama.dll+0x4674b0`): +0x10 -> the string;
  **+0x38 and +0x40 both held 0x4c1 (1217) for a 327-byte line** - not
  the length, not yet understood (a capacity? a hash?). A write longer
  than the original cannot be done by overwriting alone.
- `english (russian)` is ALWAYS longer than the original, so in-place
  overwriting can never be the whole answer: a new string has to be
  allocated in the game or the pointer at text+0x10 swung to memory we
  own in the game's address space (`VirtualAllocEx`) - a bigger step than
  a byte write, and whatever frees the string later will free OURS.
- The label almost certainly does not re-lay-out because its source
  bytes changed; Panorama lays text out once. But **the panel throws all
  its children away and rebuilds them at 24 lines** - from what source is
  exactly what the experiment would show. If the rebuild reads the
  strings we changed, replace is "write, then wait for / provoke a
  rebuild"; if it re-runs the template from the message data, the place
  to write is the dialog variable, not the markup.
- **A read-only way to get the same look, worth trying FIRST:** cover the
  game's chat instead of changing it. A chat line's UI panel carries its
  own layout: child +0x50 held the floats 1000.0 and 34.0 (0x447a0000,
  0x42080000) - very likely the line's width and height - so the
  position is probably in there too. Read that, and the box can be laid
  exactly over each line on any screen size with no per-resolution
  numbers, which was the user's objection to a second box - and with no
  write to the game at all, so the ban-risk story does not change.
  NOT verified: which floats are x/y, and whether they are screen pixels.

## Open issues, in the order they matter

### 0. What the panel reader has NOT been through

- **Anything but one bot match on one evening.** Not a whole match, not
  a match boundary, not the menu -> loading -> hero pick -> game path,
  which is where `Settled` and the 20s re-find either work or do not.
  Nothing about that path has been SEEN; it is designed from the four
  panels that exist mid-match.
- **How the game feels.** Nobody has played with it. The read is ~3 KB,
  but the FIND is 9-13s of sweeping, and if it lands in a fight it may
  be felt. It should land in the loading screen. Frame time is still the
  measurement that decides, and has still never been taken.
- **WHEN A DOTA PATCH BREAKS IT** (the user asked for this to be in the
  notes; it has NOT happened yet, so everything below is design, not
  experience):
  - **What breaks:** the fast reader depends on seven memory offsets and
    four layout numbers, measured on ONE game build (2026-09-20). They
    belong to Dota's UI ENGINE (Panorama), not to gameplay: a balance patch
    should not touch them, an engine update could. **How often is
    UNKNOWN** - there is one build's worth of data. Do not guess a rate.
  - **What the player sees until it is fixed:** the app does not go dark.
    `find` reports 0 panels, and because the panel reader has then never
    worked in that game, the old SCANNER takes over: it needs no offsets,
    but lines arrive in seconds rather than 0.2s, it costs half a core
    rather than 0.3% of one, and a repeated line is shown once. With no
    layout from the game, the translations move to the dark box in a
    corner (`above` and `cover` both need the same offsets). No hero
    portraits either: the scanner cannot see them.
  - **The fix is ONE COMMIT, not a new version:** re-derive the offsets -
    about an hour with `tools/ptrscan.ps1` (the chain is string -> text
    object -> client panel -> UI panel; `-Parents` prints the tree above
    any panel once +0x10/+0x18/+0x28 are right) and
    `tools/panellayout.ps1` for the layout fields - then change
    `offsets.json` AND the matching constants in `memscan.ps1` (a test
    fails if they differ), bump its `version`, push to master. Every copy
    of the app fetches that file at startup, so players get the fix at
    their next launch with NOTHING to reinstall.
  - **When one commit is not enough:** if a patch changes the SHAPE and
    not just the numbers - the text more hops away, the children no longer
    an array - the reader's code has to change, and that is a new release.
    Installed copies then update themselves (see "Releases, auto-update").
  - **How anyone would know (built 2026-09-21, v0.2.14; the user had
    thought it already was):** the PLAYER is told - `src/patchwatch.js`:
    two searches in a row that find no panel, in a game where none was
    ever found, put one line on the overlay ("Dota was updated ... slow
    mode ... Nothing to do") and in the tray tooltip; any panel found
    later takes it back. The MAINTAINER is told -
    `.github/workflows/dota-build-watch.yml` asks api.steamcmd.net for
    Dota's public build number every six hours and opens an issue for a
    build it has no issue for (GitHub emails the owner); most will need
    nothing. Logic tested; NEITHER has met a real patch, and the notice
    has not been seen on screen. Before that: nothing reported it. `npm run watch` prints
    `looked for the chat panel: 0 found`, and a player notices the dark
    box and the delay. A way for the app to SAY "the fast reader is not
    working on this Dota build" is not built.
  - Self-calibration (the app re-deriving the offsets by itself) would
    remove the manual hour entirely: noted as LATER, under "Offsets come
    from the repo".
- Identical lines: FIXED for the panel reader (see "It worked at start,
  then stopped"); still shown once under the scanner fallback, which has
  no chat list to ask.
- A line whose text is REWRITTEN in place, same panel and same string
  address, would be missed. Not seen to happen.

### 1. Scanning, which is now the FALLBACK: it finds every line, but cannot be both instant and light

User-reported the first time the overlay was ever left running while
actually playing: *"my game seems laggy"*. Believe it; it is not
imagination. What it was then: **~710 MB read every 2 seconds across
three threads**, roughly 350 MB/s of memory bandwidth, at normal
priority, plus a leftover scanner from testing doing the same beside it.

**The lesson, which is the part worth keeping:** a poll's WALL time is
not its cost to the game. 470ms looked cheap all afternoon, nothing here
had measured a frame time, and the player noticed before any number did.
The measurement that decides anything is frame time in the game, not
milliseconds in the scanner.

**What was built on 2026-09-20 (night), all tested against the stand-in
and NONE of it yet against Dota:**

- **Three kinds of scan** (`mode` in the stat): `full` sweeps the
  process, `wide` reads the hot allocations (the old poll, ~710 MB), and
  `win` reads only `scanWindowMb` (4) either side of every address a line
  has been seen at. Every `scanWideEvery`th (5th) poll is wide, so a line
  written somewhere new is late by at most five polls, not lost. Windows
  follow the chat: every hit, from any scan, adds one; a full sweep
  starts them again. `scanWindowMb: 0` is exactly the old behaviour.
- **Polls run on one thread, sweeps on two, and the whole helper at
  BelowNormal priority**, so it only gets a core nothing else wants.
- **The worst case is known and is tolerable:** if windows turn out
  worthless, this is a 10-second poll at a fifth of the old bandwidth.
  If they work, it is a 2-second poll at a few percent of it.

**THE ONE THING ONLY A LIVE GAME CAN SAY: how far a new line lands from
the nearest old one.** The 4 MB is a guess. The measurement is built in:
with `"learn": true`, every new line writes a `placement` row to
`learn.log` - the scan mode that found it, whether a window covered it,
and its distance in bytes from the nearest hit of any EARLIER scan (not
this scan's: every line is in memory twice, a few hundred bytes apart,
and measuring against its own second copy would make any window look
perfect). Read it like this:

- rows mostly `mode=win` -> windows work; size `scanWindowMb` to cover
  the larger distances and stop.
- rows mostly `mode=wide inWindow=0` -> the distances say how big a
  window would have to be. If that is hundreds of MB, windows are dead
  for Dota: write that down here and go to option 2 below.

**FIRST LIVE RESULT (bot match, 2026-09-20 18:01, 90 seconds, 12 new
lines). Team chat: windows work. All chat: they do not, on two samples.**

| | found by | inside a window | distance from nearest earlier hit |
|---|---|---|---|
| team chat, 10 lines | windowed poll (9), wide (1) | 10 of 10 | 1.5 KB to 2.6 MB, most under 50 KB |
| all chat, 2 lines | wide poll only | 0 of 2 | 98.8 MB and 14.7 MB |

- Team lines came up on the next windowed poll. All-chat lines waited
  for the wide poll, so they are up to `scanWideEvery` polls late.
- The second all-chat line was 14.7 MB from everything, INCLUDING the
  window the first all-chat line had just made. So all chat is not
  simply "a second place" that one hit teaches. Two samples is not
  enough to size anything on; the raw rows are in the notes.
- **Costs in this match were higher than the table below:** 5 hot
  allocations, not 2. Wide poll 1,170-1,350 MB in 1.5-1.7s on one
  thread. Windowed poll 50 MB / 100ms at first, growing to 145 MB /
  200ms as windows pile up until the next full sweep clears them.
  Full sweep 6.6s / 7,533 MB on two threads.
- **The helper died with its parent against the real game**: node was
  force-killed and the scanner was gone within 5 seconds.
- Two translations took 6s and 14s to appear after the line was FOUND.
  That is the model (a timeout and its retry), not the reader.
- How the game felt: see the next paragraph.

**What the user said after that match, and what was changed for it
(2026-09-20 evening):** the game felt *"ok, the same as without
translator"* at a 2s poll with a wide poll every fifth. And: chat must
be *"pretty much instant"* - a delayed message is never seen in a fight
- and **team and all chat matter equally**. So late all chat is a fault
to fix, not a trade to accept. Changed, NOT yet played with:

- `scanIntervalMs` 2000 -> 1000. Wide poll still every fifth, so all
  chat is up to ~6.5s late until it can be windowed too. If the game now
  hitches every six seconds or so, suspect the wide poll first.
- **The model was most of the worst delays.** MEASURED, six single-line
  calls: 0.7-1.0s five times, and once no answer at all. A call is quick
  or lost, so the first try gets 2.5s (was 12s) and the retry 8s. A lost
  call now costs ~3.5s, not ~13s. `thinkingConfig` is REJECTED by
  gemini-3.5-flash-lite ("invalid argument") - do not try it again.
- `batchMs` 400 -> 150.
- Every placement row now carries `addr`, `region`, `regionMb` and
  `alloc`. **The next match's job is all chat:** a dozen all-chat lines,
  then see whether they share an allocation, a region size, or a
  distance from EACH OTHER. If they do, give all chat its own windows.
  If they do not, the windowed route cannot make all chat instant and
  the chat container (below) is the way.

**SECOND LIVE MATCH (18:10-18:12, 1s poll): all chat is fine, and
something worse turned up - LINES ARE SOMETIMES NOT FOUND WHEN SAID.**

- All chat is NOT inherently far: 6 of 6 all-chat lines were inside a
  window and found by windowed polls. Over both matches 17 of 20 new
  lines were in a window; the three that were not were 14.7, 98.8 and
  214 MB away, the last in a different allocation. Do not build
  per-channel windows; that theory is dead.
- **Five lines surfaced in ONE poll at 18:11:59**, two of them typed 20
  to 35 seconds earlier (they come before lines found at 18:11:24 and
  18:11:37 in the list the user typed from). One line, the first, never
  appeared. Six wide polls ran in between and found none of them.
- Those five sat at evenly spaced addresses (~0x2500 apart) in one
  region, and earlier placements there had distance 0 and 4: the SAME
  SLOTS, reused. That looks like a chat panel laying its lines out again
  (opening the chat box to type is the suspect), not a line being said.
  So some of what has been read all along may be a REDRAW, and the copy
  made when the line is said is sometimes somewhere no poll looks: a
  region over the 64 MB poll cap, or an allocation that was not hot at
  the last sweep. The first match shows the same signature (three lines
  displayed together at 18:02:13-14).
- The same region changed size between polls (13.6 MB, then 2.6 MB), so
  the chat heap is being split and merged under us. A region that merges
  past 64 MB drops out of every poll. One placement was in a 54.2 MB
  region. UNPROVEN that this is the cause; it is the first suspect.
- `tools/whereis.mjs` is the experiment for it: nothing but full sweeps,
  back to back, every copy of every Cyrillic line written to
  `whereis.log` with region size, allocation and whether a poll could
  have seen it. Heavy on purpose; bot match only. **Not yet run on Dota.**
- Cost at a 1s poll, 4 hot allocations: windowed 50-170 MB / 75-220ms,
  wide 760-970 MB / 0.9-1.3s, full sweep 4.4s. The model failed both
  tries once (2.5s + 8s) and the line went up untranslated at +10s.
- How the game felt at the 1s poll, from the user: "ok I think".

**THE CAUSE WAS THE 64 MB POLL CAP, and scanning has now shown its
ceiling (2026-09-20, 18:18-18:32, four harness runs on a bot match).**

Lines are typed INTO the game by `tools/saychat.ps1` now (focus, Enter or
Shift+Enter, paste, Enter - input, not memory), so every line has a send
time to the millisecond. `tools/latency.mjs` runs the real reader beside
it and prints say -> found per line plus processor use;
`tools/whereis.mjs` does back-to-back full sweeps and logs every copy.

- **A team line is in memory 4-5 times over (plain and markup); an
  all-chat line only once or twice, markup only.** Of three all-chat
  lines, two had NO copy in any region under 64 MB, ever: they sat in
  regions of 64.8 MB and 160 MB. Team lines always had one small copy.
  That is the whole of "all chat is late", and the old note that "every
  chat line yet measured was in a small region" is dead: the chat heap
  grows through a match and its regions merge past any cap.
- Windowed polls ignore the cap now (they read a few MB of a region
  however big it is). The wide poll's cap is `scanWideCapMb`, default 0.

| 10 lines, 7s apart, 1s poll | found | median | worst | windowed poll | wide poll |
|---|---|---|---|---|---|
| wide cap 64 MB, run 1 | 10/10 | 1.3s | 7.3s | 366 MB / 465ms | 1,064 MB / 1.4s |
| wide cap 64 MB, run 2 | 10/10 | 2.5s | **23.0s** (and 18.7s) | 336 MB / 428ms | 1,035 MB / 1.3s |
| no cap | 10/10 | 2.7s | 7.3s | 487 MB / 597ms | 2,758 MB / 3.3s |

- Team lines: 0.4-2.7s. All chat: 0.7s when in a window, 5-7s when not.
  About 3 lines in 10 are outside every window.
- With no cap nothing is lost, but the 3.3s wide poll BLOCKS the windowed
  polls behind it, which is why the median got worse.
- **Windows are no longer small.** With giant regions included they add
  up to 340-490 MB per poll, every second.
- **Processor** (Ryzen 9 5900X, 12 cores / 24 threads, 32 GB at 3200):
  the reader is 46-63% of ONE core. The game used 307% of a core with
  the reader and 307% with no reader at all (the control run), so the
  reader does not make the GAME work harder. The first two runs seemed
  to show the game doubling; that was Dota waking up after being brought
  to the front, which is why the control exists. Memory bandwidth is not
  in any of these numbers.
- **The user's requirement, stated this evening: it must feel fine on a
  WORSE PC than this one, and chat must be near instant.** Half a core
  and ~0.5-0.8 GB/s of reads is nothing here and is a real share of a
  four-core laptop. Scanning cannot be both instant and light: every gain
  in latency above was bought with more reading.

**So the next piece of work WAS the chat container (option 2), not more
tuning - and it is done; see THE CONTAINER below.** Read the chat log's own structure - a few KB per poll - and
both problems go at once. The tools above make that tractable: type a
line at a known time, find every copy, and look at what POINTS to them.
The plain copies (team) and the markup copies sit in different places;
the container is whatever holds the pointers, and `whereis.log` addresses
are where to start looking for it.

**THE CONTAINER HUNT: tools built and proven on a stand-in, NOT yet run
on Dota (2026-09-20, late).**

- `tools/ptrscan.ps1` finds every chat line, then every pointer into
  one (level 1), then every pointer at what HOLDS those (level 2), and
  so on; rows with the surrounding bytes go to `ptrscan.log`.
  `tools/ptrview.mjs` counts what repeats in it. `-Dump 0xADDR` prints
  annotated qwords; `-Targets` starts from addresses instead of strings.
- `tools/fakechat.ps1` compiles a NATIVE stand-in (fakedota.exe, in the
  temp folder) with a real container: panel -> reallocating array ->
  labels -> text. The node stand-in cannot do this; node does not know
  its own addresses. **Its layout is invented.** Against it the tools
  recovered, blind: label class with text at +0x98, 21 of 24 followed
  pointers; and at level 3 the array start held at panel +0x58.
- Two things the stand-in taught, so they are not relearned on the game:
  **walking back to a null does not find where a string starts** (heap
  headers are not zeros), so level 1 takes any pointer INSIDE a line and
  follows the ones at the commonest beginning; and **a range search
  above level 1 drowns** (840 then 7,370 rows from 12 lines), so higher
  levels look for exact pointers to candidate object starts (every
  module address - a vtable - in the 0x200 before the holder) and to
  array starts. A class is named by MODULE OFFSET, which survives a
  restart where an address does not.
- Cost on the game, MEASURED: see "Cost of the hunt itself" below.
- What to read from the live run: does one class @ offset repeat once
  per line at level 1 (the label)? Is there an array start at level 2-3,
  and what class holds it? Is anything held in module data (a ROOT -
  then no sweep is ever needed to find the panel again)? Run it twice, a
  minute and a few lines apart: what stayed put is the container.
- The reader was deliberately not written until the game had been
  looked at, and that was right: the real chain is three hops, not one,
  and the stand-in's first layout was wrong in every offset.

**THE CONTAINER, MEASURED ON THE LIVE GAME (bot match, 2026-09-20
18:46-18:55; six lines typed by the rig, three team and three all).**

```
ChatLinesPanel (a panorama UI panel)
  +0x00 vtable  panorama.dll+0x45ca68     (every UI panel has this one)
  +0x08 -> its client panel
  +0x10 -> its id, a plain C string: "ChatLinesPanel"
  +0x18 -> its parent UI panel
  +0x28 int   child count        (15)
  +0x30 -> array of child UI panels, IN ORDER SAID
  +0x38 int   capacity           (16)
child UI panel  +0x08 -> client panel    vtable client.dll+0x4fafcf0
client panel    +0x90 -> text object     vtable panorama.dll+0x4674b0
text object     +0x10 -> the line: UTF-8, null-terminated, the markup
```

- **13 live lines, 13 text objects, 14 client panels, 14 UI panels, one
  array.** Team and all chat, the rig's lines and the bots', no
  exceptions: there is no second place for all chat here. 15 children
  against 14 lines: the first child is something else (3 children of
  its own, no chat text); a reader must skip what has no line in it.
- The whole line is `<span class="GameAlliesChat Sent Visitor"><panel
  class="HeroBadge" /><img class="HeroIcon" src=...hero_furion.png" />
  <span class="ChatTarget">[Allies] <span class="ChatPersona">...` - so
  the CHANNEL IS ALSO IN THE FIRST CLASS (`GameAllChat` /
  `GameAlliesChat`), and `Sent` / `Received` says whose line it is.
- Re-read ten minutes of tool-building later: same panel, same array,
  same count. Stable while nothing is said.
- **A poll is 24 bytes of panel + 8 bytes per line**, and ~1 KB per NEW
  line. Against 340-490 MB.
- **How to find it with no vtable offset and no chat yet:** find the
  string `ChatLinesPanel`, find what points at it, take holder - 0x10,
  and validate (its parent at +0x18 and its children all begin with the
  same 8 bytes it does). Offsets +0x08/+0x10/+0x18/+0x28/+0x30, +0x90
  and +0x10 are the patch-fragile part; the scanner stays as the
  fallback for the day they move.
- Also seen, not followed: every text object is pointed at from a table
  around 0x551f212xxxx (entries 0x40 apart, no class nearby) - some
  registry of them. And the markup TEMPLATE (`{s:target_class}
  {s:sender_class}...{g:dota_filtered_string:message}`) is in memory ten
  times: the message is a dialog variable, which is where REPLACE IN
  PLACE will have to look.
- Cost of the hunt itself: strings 7.6s / 6.7 GB (private only), each
  pointer level 2.7-4.8s / 7.8 GB, two threads, BelowNormal.
- **There are FOUR ChatLinesPanels, under three roots** (`ptrscan
  -Parents`): `HudChat` and the hero pick's `PreGame > ... > Chat`, both
  under `DotaHud`; `LoadingScreenChat` under `DotaLoadingScreen`; and
  the menu's under `DotaDashboard`. Every one has the same six wrappers
  above it (ChatLinesWrapper, ChatLinesContainer, ChatChannelArea,
  ChatLinesArea, ChatMainPanel, two unnamed). Mid-match only HudChat had
  children. Each panel has its OWN copy of the id string, so a re-find
  cannot skip the string sweep.
- **So finding A panel is not finding THE panel.** In the menu the
  dashboard's exists and the match's does not yet. The reader is
  `Settled` only when a panel is under `DotaHud` or has children; until
  then it sweeps again every 20s (`-PanelRefindMs`) - in the menu, where
  a sweep costs nobody a frame. While settled it never sweeps.
- **AT 24 CHILDREN THE PANEL TRIMS TO 16 AND MAKES EVERY CHILD AGAIN**
  (seen three times: 23 -> 16 with "15 new"). Same panel, same address;
  new child panels, new strings. That is the "five lines surfaced in ONE
  poll ... the SAME SLOTS, reused" of the second live match, explained:
  it was never a redraw on opening the chat box, it was the trim. A line
  said in the same poll as a trim still came through (60ms).
- The three roots sit together in a 3-entry vector (count 3, capacity 4)
  at a heap address with no class near it, and nothing in any module's
  data points at it; three stale copies of the vector header exist with
  counts 1, 2, 3. A static root was NOT found. Not needed now: the
  re-find rule above covers it. Worth another look only if the 9-13s
  find ever has to go.

**THE PANEL READER (`src/memscan.ps1`, "THE CHAT PANEL"), and what it
did on the live game:**

- Find: sweep private memory for `ChatLinesPanel\0`, sweep again for
  aligned pointers to any hit, holder - 0x10 is a candidate, `Valid`
  decides. Poll: header (0x40), child array, three pointer reads per
  child; a child is re-read only when its string POINTER changes; a
  child with no chat line in it is asked 8 times and then left alone.
- The line it emits is cut exactly as the scanner cuts one (48 bytes
  before `class="ChatPersona"` to the null), so `chatmem.js` and
  everything after it did not change at all.
- A search is a `find` event, NOT a `stat`: the first stat ends priming,
  and a find arriving as one would put the whole backlog on the overlay.
- Settings: `chatPanel` (true), `panelIntervalMs` (250).
  `tools/panelwatch.mjs [process] [seconds] [--no-panel]` is the reader
  with no model, timestamps to the ms; `tools/fakechat.ps1` is the
  stand-in it was proven on first (found in 20ms, lines out in ~160ms).
- Live, run 1 (8 lines, 4s apart): 181, 164, 277, 290, 116, 117, 226,
  231ms. Run 2 (4 lines): 103, 275, 60, 254ms. Send time is the rig's
  Enter; found time is node receiving the line. Idle poll 0.7-1 KB, a
  new line ~3 KB, a trim ~31 KB, every one "0ms".
- No strays after any run (checked, excluding the query's own pid).

**Then measure frame time in the game**, windows on against
`scanWindowMb: 0`, before believing any of it.

What the stand-in's frame proxy said (`tools/fakedota.js`, a timed 32 MB
copy per "frame"; a PROXY, and a weak one - Dota is not a memcpy loop):

| reader | frame p50 | frame p99 |
|---|---|---|
| none | 2.1-2.3ms | 3.5-4.4ms |
| 1.27 GB swept back to back, 3 threads, normal priority | 2.4-2.8ms | 4.6-6.1ms, rising |
| same, 1 thread, BelowNormal (half the read rate) | 2.6ms | 4.4ms, steady |
| new defaults (windowed, 45 MB polls) | 2.4ms | 3.7-4.9ms |

It agrees in direction and proves nothing about Dota. At ~250 MB/s the
proxy could not tell any configuration from the baseline at all, which is
itself worth knowing: it does not reproduce whatever the player felt.

Still open if windows fail: **find the chat log container and read it
directly** - a few KB per poll, nearly free, the most fragile across
patches.

### 2. Never run against the live game without asking

The game belongs to the person playing it. Do not start a scanner, the
watcher or the overlay against a running Dota without the user's say-so,
and stop everything when the measurement is done.

Check for strays before and after: list `powershell.exe` processes whose
command line contains `-File` and `memscan`, with their
`ParentProcessId`, **and exclude the query's own pid** - a query whose
command line contains those words matches its own filter, and that has
now cost a round of confusion twice.

**The helper dies with its parent now.** It is passed `-ParentPid`, holds
that process as an object (a pid is reused; a handle is not) and exits at
the top of the next loop once it has gone. MEASURED, writing to a file so
no broken pipe could help: watching a 4-second process, the scanner was
gone by 10s; the control given no pid was still running. NOT reproduced:
the original stray itself. Force-killing a node parent in this harness
ended the scanner even with no pid passed, game or no game, so whatever
kept the first stray alive (Electron as the parent is the obvious
suspect) has not been seen again. The check costs nothing either way.

### 3. Not yet seen

- **A whole match**, and two matches in one process launch: whether the
  hot allocations stay the right ones, and what happens at a match
  boundary when the process does not restart.
- **Spectator and coach channel tags are guesses.** An unknown tag is
  reported and written to `learn.log` rather than failing silently - set
  `"learn": true` and that file is the answer to what changed.
- **Replace-in-place** - decided, wanted, not started. See the decisions
  below before designing it.

---

## Offsets come from the repo, not from the build (2026-09-20, late)

The user asked whether a Dota patch needs a manual update. It did: seven
memory offsets and four layout numbers were constants, and there is no
installer or updater, so a fix meant everybody pulling a new version.

- **`offsets.json`** (repo root) holds them all. **`src/offsets.js`**
  fetches it from `raw.githubusercontent.com/.../master/offsets.json` at
  startup (3s at most, never fatal), and believes, in order: what it just
  fetched; the last good fetch (`offsets.cache.json`, gitignored - so a
  fix survives being offline); the copy that shipped. The higher
  `version` of fetched and shipped wins, so a stale CDN cannot roll a
  newer build back. `offsetsUrl: ""` never fetches.
- **All or nothing.** `parseOffsets` rejects the whole file if any offset
  is missing, not a number, not aligned (8 for pointers, 4 for the rest),
  over 0x2000, or a layout number is out of range. They only ever say
  where to READ; nothing in the app writes to the game.
- The helper takes them as `-Offsets "uiClient=8;uiId=16;..."` and sets
  the C# statics by reflection; names it does not know and values that
  are not plain digits are skipped. `scannerArgs` refuses anything that
  is not names and digits - it is a command line. The panel header read
  grows to fit whatever the offsets ask for.
- `npm test` fails if `offsets.json` and the constants compiled into
  `memscan.ps1` ever differ: two copies of one measurement must not drift.
- PROVEN on the stand-in (`panelwatch.mjs fakedota --offsets ...`): the
  shipped offsets read 4 lines in 7s; the same with `clientText` moved by
  8 read none. A real fetch answered 404 in 0.3s and fell back to the
  bundled copy, as it should - because:
- The repo was private when this was built and went public later the same
  evening. The fetch still answers 404 until `offsets.json` is PUSHED:
  master was 20-odd commits ahead of origin, and pushing is the user's.
- **AFTER A PATCH:** re-derive with `tools/ptrscan.ps1` /
  `tools/panellayout.ps1` (see THE CONTAINER), change `offsets.json` AND
  the constants in `memscan.ps1`, bump `version` and `updated`, commit,
  push. Nothing else.

**LATER, NOT NOW (the user's words: "mark this to the notes to do later
maybe"): self-calibration.** The app re-derives the offsets itself by
automating the pointer chase done by hand on 2026-09-20 - find a chat
line's string, find what points at it, climb to the panel whose id is
`ChatLinesPanel`, read the offsets off the distances - and caches the
result per game build. No manual update at all, ever. It is a real piece
of work (the chase needed a human to tell signal from noise at each
level), and it must be proven against `tools/fakechat.ps1` with a
DIFFERENT layout than the one it expects before it is trusted on the game.

(The app updating itself was "later, not now" on 2026-09-20 and was built
the same evening, with the installer: see "Releases, auto-update and the
icon".)

## Releases, auto-update and the icon (2026-09-20, v0.2.0)

- **A release is a TAG.** `.github/workflows/release.yml` runs on any
  `v*` tag: windows-latest, `npm ci`, `npm test`, checks the tag equals
  `package.json`'s version, then `npm run release` (electron-builder
  `--publish always`), which uploads the installer, its blockmap and
  **`latest.yml`** to a GitHub release. The only credential is the
  workflow's own `GITHUB_TOKEN` - chosen over driving the API with the
  user's stored git credential, which would have meant handling their
  token. To cut one: `npm version patch` then
  `git push origin master --follow-tags`.
  `package-lock.json` is COMMITTED now (it was gitignored; `npm ci` needs it).
- **v0.2.0 WAS BROKEN, and why the workflow does not let electron-builder
  publish:** its uploader raced itself and made TWO releases for the one
  tag, the installer in one and the blockmap in the other, so the download
  link was a 404 while the API said all was well. The workflow now builds
  with `--publish never` and makes ONE release with `gh release create`
  (deleting any earlier attempt under the same tag first). v0.2.1 was made
  that way and CHECKED: one release, three files, the 80 MB installer
  downloads, `latest.yml` names it. Check the DOWNLOAD, not the API.
- **From v0.2.10 the installer can be CHECKED against the build** (the
  user asked how anybody knows the exe is what is on GitHub; before this,
  they could not). The workflow attests it
  (`actions/attest-build-provenance`: GitHub signs "this workflow built
  this file from this commit") and writes its SHA-256 into the release
  notes; `download.html` says how to check both. SEEN for v0.2.10: the
  notes carry the hash, and GitHub's public API returns 1 attestation for
  it. NOT run: `gh attestation verify` itself - `gh` is not installed
  here. It does not remove the SmartScreen warning; only a paid
  certificate does.
- The installer has a version-less name from v0.2.2
  (`Dota-Translator-Setup.exe`), so the site links straight to
  `releases/latest/download/Dota-Translator-Setup.exe`.
- **The installed app updates itself, USUALLY - and here is when it does
  not.** The rule: it looks for a newer release at startup and every four
  hours, downloads it quietly, and installs it when the app is next
  CLOSED (and says so in the tray tooltip). The edge cases:
  - **A copy that is never restarted never updated** - FOUND on the user's
    own install, 2026-09-20: v0.2.2, started 21:56, still v0.2.2 with
    nothing downloaded while v0.2.3, .4 and .5 came out, because it looked
    ONCE, at startup. Fixed in v0.2.6 (the four-hourly look) - but a copy
    OLDER than v0.2.6 still only looks at startup, so it needs one restart
    to get there. After that it keeps itself current.
  - **It installs on a CLEAN quit only** (tray > Quit, Alt+Shift+D). Killed
    from Task Manager, or Windows shut down under it, the downloaded update
    waits for the next clean quit.
  - **A copy installed from the very first local build, v0.1.0, has no
    updater at all.** Reinstall from the website.
  - The installer is unsigned; updates still work (no publisherName is
    set to verify), but SmartScreen warned on the first install.
  - `autoUpdate: false`, and any run from source, never looks.
  To check a machine: the exe's version is in
  `%LOCALAPPDATA%\Programs\dota-translator\Dota Translator.exe`, a
  downloaded update waits in `%LOCALAPPDATA%\dota-translator-updater\pending`,
  and the tray menu shows the running version.
- How it is built: `electron-updater`, GitHub provider, `checkForUpdates`
  in `main.js`; downloads in the background - never a
  dialog over a match. `autoUpdate: false` never checks; run from source
  it never checks. The tray tooltip says when a version is waiting, and
  the tray menu shows the running version. SEEN in the packaged build:
  it reached GitHub and answered "No published versions", which was true.
  **NOT seen: an actual update** - that needs two releases. Unsigned
  builds update fine on Windows (no publisherName is set to verify).
- **The icon is ours. FROM v0.5.1 (2026-09-22, the user: the tray icon "looks
  weird ... full orange with letter D on it, without using the black
  background"): an amber rounded square with a dark D, nothing else.**
  `docs/logo.svg` is the drawing; `npx electron tools/makeicons.mjs` renders
  EVERY icon file from it (Electron is the only rasteriser here; the .ico
  files are PNG-entry ICOs written by the script). Before: two chat bubbles,
  a grey "Я" behind an amber "A"
  (`build/icon-source.html` was the drawing; `build/icon.ico` 16-256,
  `src/tray.png`, `docs/logo-{64,192,512}.webp`, `docs/logo.svg`,
  `docs/favicon.ico`). The user asked for "something with dota logo (if
  they allow it)": they do not - it is Valve's trademark - so nothing of
  Valve's is in it. On the site's nav, as favicon and og:image, in the
  setup window, the tray, the exe and the installer. The WebP files were
  encoded by a headless browser's canvas (`toDataURL('image/webp')` read
  back with `--dump-dom`): there is no image tool on this machine.

## The installer (2026-09-20)

The user: "too complicated for non techie users ... pretty much plug and
play, except for adding the api key ... download -> installs the app".

- **`npm run dist`** (electron-builder, NSIS, x64) builds
  `dist/Dota-Translator-Setup-<version>.exe`, ~80 MB: one click, installs
  for the current user only (no administrator), Desktop and Start menu
  shortcuts, starts the app when it finishes. `dist/` is gitignored.
- **What had to change for an installed app**, all in `src/config.js`:
  the app then lives in `resources/app.asar`, which cannot be written to
  and which nothing OUTSIDE the app can read. So `DATA_DIR` - settings,
  `offsets.cache.json`, `learn.log` - is `%APPDATA%/Dota Translator` when
  packaged (beside the source otherwise), and the two files the outside
  world opens are unpacked by the installer (`asarUnpack`): `src/*.ps1`
  for PowerShell and `docs/key.html` for the browser; `onDisk()` and
  `memsource.SCRIPT` point at `app.asar.unpacked`.
- PROVEN on the packaged build (`dist/win-unpacked`, run against the live
  match with `DT_CONFIG` pointing at the real settings so no setup window
  opened): offsets fetched, the reader ran from
  `...app.asar.unpacked\src\memscan.ps1`, the chat layout was found, and
  the helper exited within ~9s of the app being force-killed.
- **NOT done / NOT seen:** running the INSTALLER itself (it installs and
  launches, and a first launch with no key opens the setup window over
  whatever is in front - the user said they would run it themselves); the
  uninstaller; a machine without Node. **It is NOT code-signed**, so
  SmartScreen warns ("More info" -> "Run anyway"); the page and README say
  so. It uses Electron's default icon - there is no app icon yet.
- **No release exists yet.** The landing page's buttons and the README
  point at `releases/latest`, which is EMPTY until the user uploads the
  exe to a GitHub release (`gh` is not installed here, and publishing a
  binary under their name is theirs to do). Until then those buttons lead
  to an empty page.
- Auto-update and releases: see "Releases, auto-update and the icon".

## A player who cannot find the app (v0.2.8, 2026-09-20)

The user: with a key saved the app starts straight into the tray, "a non
tech user may not find it", and the SmartScreen warning "might be scary".

- **One copy only** (`requestSingleInstanceLock`). There was NO lock
  before: starting it twice meant two readers and two consumers of one
  key. Starting it again now opens the settings window of the copy that
  is running - which is what somebody who cannot find the icon does.
- **A tray balloon at startup when there is a key** says where it went
  ("by the clock, behind the ^ arrow"); clicking it opens settings. The
  setup window's "It works" message says the same. NOT seen: the balloon
  itself, nor the second-launch path - neither was run here (the user's
  installed copy was running, and a dev copy beside it is two consumers).
- **It is `docs/download.html` from v0.2.9, and EVERY download button on
  the landing page goes to it.** NOTHING downloads by itself there: a
  first version auto-started the download and the user had it removed the
  same evening - the visitor presses Download for Windows on that page.
  `install.html` is a redirect. It asks GitHub's API for the latest
  version and shows it.
- **The version is shown** (the user could not find it): settings window
  title bar and foot, tray tooltip, tray menu, the download page. The
  installer keeps its version-less NAME - the site's link depends on it.
- **`docs/install.html`** (as it was first called): the blue warning DRAWN twice (before and after
  More info, the button ringed), why it appears (unsigned = no paid
  certificate, not a finding; built on GitHub from public source), and a
  drawing of the tray with the ^ flyout. Linked from the landing page's
  steps. SEEN at phone width in the browser pane only.

## A game running as administrator cannot be read (found 2026-09-21, v0.3.2)

Found by accident, while trying to check the layout at 1920x1080 for the
wave of players a Reddit thread was about to send (94 upvotes in 32
minutes, no link posted yet - the user is waiting for the subreddit's mods
to allow one; do NOT put the link or the name in a public comment for them).

- **SEEN: `OpenProcess failed: 5` (access denied), once a second, printed
  on the player's screen for as long as the game ran.** The user's STEAM
  was running elevated that day, so Dota was too, and a normal program may
  not open an elevated one even to read it. Told apart from outside
  without any rights: a non-elevated shell cannot read `Path` or the
  command line of `steam.exe` / `dota2.exe`, and can of `explorer.exe`.
  Every earlier session worked, so Steam had been started normally then.
- FIXED in `src/memsource.js`: `explainReaderError` turns error 5 into what
  to DO ("Close Steam and start it normally ... or start Dota Translator as
  administrator too"), and any identical error is said at most once a
  minute (`ERROR_REPEAT_MS`). The helper still retries every second,
  quietly. Tested with a fake helper. The README's "If chat is not picked
  up" says it too. NOT seen on screen since: the user's game was still
  elevated and nothing could be run against it.
- **The same wall stops the app's KEYS** (Windows will not deliver input
  from a normal program to an elevated window), so `Ctrl+Enter` would copy
  nothing and say nothing there. And it stops `tools/saychat.ps1`.
- **THE 1080p CHECK, DONE (the same evening, once Steam was restarted
  normally) - and it found the bug that was suspected.** Bot match, the
  game in a 1920x1080 WINDOW at (1600,180) on the 5120x1440 desktop, the
  minimap on the RIGHT (flipped HUD). The game reported scale 1.0 and rows
  25 high (34 / 1.33), the chat found in 9.3s.
  - **SEEN, FIRST RUN: the English was drawn OUTSIDE the game**, on the
    desktop to its left - at screen (598,580), which is exactly where it
    belongs counted from the corner of the GAME'S picture. The game says
    where its chat is in its own pixels; the overlay was placed as if they
    were the screen's. They are the same only when the game covers the
    screen from its top-left corner, which was all that had ever been run.
    The user saw it too: "the translation was on the left, outside the dota
    screen".
  - **FIXED (v0.3.3), in the helper:** `DotaMem.SetOrigin` asks Windows
    where the game window's client area begins (`ClientToScreen`, with the
    helper made DPI-aware first so the answer is in real pixels like the
    game's), once a second, adds it to the layout's x and y, and marks the
    layout dirty when the window moves so a dragged window is followed.
    SEEN AFTER: our line inside the game, portrait / `[Allies]` / name at
    the same left edge as the game's own copy of the line beneath it, same
    text size, 166px above it (162 units + the 4 gap at scale 1). So the
    layout numbers DO hold at 1920x1080 and with the HUD flipped. The line
    was read in 0.2s; the English took 4s that time (the model).
  - Also seen there: the user's own "hello" + Ctrl+Enter went out as
    "привет" in that window, so the keys work windowed at 1080p.
  - STILL NOT SEEN: a dragged window being followed (built, not tried);
    Windows display scaling other than 100%; 16:10 and 4:3; and a
    BORDERLESS game rendering BELOW the desktop's resolution, where the
    game's pixels are not the screen's pixels at all and adding an origin
    is not enough - the position would need scaling too. Suspected, not
    seen. The dark `box` look, which has no layout from the game, is still
    placed against the SCREEN, not the game's window.

- **v0.3.3's FIRST release run FAILED at `npm run dist`**, fifteen minutes
  after v0.3.2's had passed, with nothing about the build changed. The
  same build passed locally, and passed on GitHub when the run was
  repeated - a download on the runner, most likely (electron-builder
  fetches Electron and NSIS every time). GitHub's public API gives the
  failing STEP but not its log. **How to repeat a release run without
  GitHub's buttons:** delete the tag on the remote and push it again
  (`git push origin :refs/tags/vX.Y.Z && git push origin vX.Y.Z`); the
  workflow removes any half-made release under that tag itself. CHECKED
  after: one release for v0.3.3, three files, `latest.yml` says 0.3.3 (it
  said 0.3.2 for half a minute - a cache), the notes have the VirusTotal
  link.

## When Google is slow or down (2026-09-21, v0.3.4)

The user, testing the dev copy: "did you change colors again? our
translated section seems darker", then "the faded messages look weird".
Nothing had changed: **Google's free tier was failing for an hour.**
MEASURED on the user's key, that evening: `gemini-3.5-flash-lite` 6 of 8
answered, two of those in 7-9s, two never (normal is 0.6-1.0s);
3.1-flash-lite 503 / 3.8s / 503; flash-lite-latest none / 1.0s / 1.0s;
3.6-flash three 503s; 3.8-flash 7.8s / 503 / none. "503 UNAVAILABLE ...
currently experiencing high demand", and hung calls. The key was fine
(listing models: 200 in 0.1s); 2.5-flash and 2.5-flash-lite answer "no
longer available to new users".
- So every line sat in the WAITING look (75% brightness, italic) for
  seconds instead of a blink, and then in the NOT-TRANSLATED look (dimmed)
  for good. FIXED: a waiting line is full brightness and only italic; a
  line that could not be translated is full brightness (it is what was
  said, and all the player will get); and the player is told ONCE a minute,
  in words, that Google's translator is not answering and there is nothing
  to do (`explainModelError` in `memwatcher.js`) - it was the raw error
  under every failed line. The user, of the new look: "the colors look
  better". The page's FAQ says it too.
- **A fallback to another model was considered and NOT built**: that
  evening every Flash model the key could reach was failing together.
- **A different free key would not help** (capacity, not quota - quota says
  "quota exceeded", as it did on 2026-09-20). **A paid key probably would**
  (paying traffic is normally served first; NOT verified - no paid key
  here) and would cost cents: ~300 tokens in and ~30 out a line at $0.30 /
  $2.50 per million is ~$0.00017 a line, ~2-3 cents for a loud game. The
  trap: a prepaid project with no credit FAILS rather than falling back to
  free.
- **"It changed my name at the top to christian" (the user, testing the dev
  copy).** Nothing had changed their name in the game. The LOG said what
  happened: "my name is kristjan" went out as "меня зовут кристьян" (fine -
  a name written as it sounds, in their letters), and then the app read the
  player's OWN line back out of the chat like anybody's, asked the model
  what it meant, and showed "my name is christian" above the chat. Two
  fixes (v0.3.5): (1) after a line is sent translated, `main.js` tells the
  watcher what it MEANS (`watcher.know(out, typed)`), so the row that comes
  back shows exactly what was typed, from the cache - no call, no second
  opinion; (2) the incoming prompt says a name inside the text is written
  as it sounds and never swapped for an English one. REAL OUTPUT after:
  "меня зовут кристьян" -> "my name is Kristjan"; "иван, иди мид" -> "Ivan,
  go mid"; "где саша? он афк" -> "where is Sasha? he is afk". The backslash
  trap bit an EIGHTH time doing it (an escaped apostrophe through a heredoc
  broke `translate.js`; `node --check` caught it). Look at the debug log's
  `say` and `line` rows FIRST when a translation looks wrong: they show
  both directions.
  **v0.3.5's fix (1) DID NOT WORK, and the user found it within the hour**
  ("how often do u shower" -> at the top, "how often do you wash
  yourself"). The meaning was handed to the watcher AFTER `sayTranslated`
  returned, which is after the paste has settled - and the reader had
  already found the line: `pending` at 16:12:48.483, `say` logged after it.
  A reader that is quick is a reader that wins races. FIXED in v0.3.6:
  `sayTranslated` calls `learned(out, typed)` BEFORE `keys.send()`, and a
  test holds the ORDER. Tested with fakes only; NOT yet seen in the game.
  (The Russian itself was fine: "как часто ты моешься" is how it is asked.)
- **The row shown while a line is away is the player's OWN chat row**
  (the user, watching it: "it doesn't start from the same line as dota
  chat ... maybe it is just me"). It was not just them: every row of the
  game's starts at one left edge with a portrait, and ours kept an EMPTY
  place for a portrait it did not have, so its text began ~45px further
  in. SEEN in a 36-frame recording of their window (`burst.ps1` in the
  scratchpad: the chat's neighbourhood every 0.8s - the way to "watch the
  screen"). Now `main.js` learns WHO the player is from the game: a line
  that comes back out of the chat with the words just sent for them is
  theirs, and carries their name, colour slot and hero (`itsMe`). From
  their second translated message of a match the row is portrait + name +
  text; before that it has no gap and starts at the edge. No tag on it: the
  app cannot tell which chat they opened. SEEN in headless Edge, both
  versions, text at x=49 beside a game-style row / at the edge; NOT yet seen
  over the game. **The same recording SHOWED v0.3.6's fix working**: "how
  is it going" went out as "как дела" and came back above the chat as "how
  is it going (как дела)", from the cache.
- ASKED AND NOT DONE: pulling our lines DOWN so they sit on the game's
  lowest visible line instead of one chat-height above it (in the
  recording ours is six rows up with nothing between). It would need the
  app to know how many of the game's lines are showing, and it would
  overlap the history whenever the chat is opened - the overlap the user
  did not like in `cover`. They were told, and did not ask again.
- Also in v0.3.5: a failed OUTGOING line says "Google's translator is not
  answering right now ... Your line is still in the chat" instead of the
  raw "the model took too long".
- **"Wouldn't this need some kind of VAC protection?" (the user). NO, and
  it will not be built**: the only thing that could mean is hiding from
  the anti-cheat, which is what makes software a cheat whatever it does,
  and is not something Claude builds. What lowers the risk honestly was
  said again: a mode that does not read memory at all (screen capture,
  priced above), reading less, and saying plainly what it does.
- **"Is the free model made slower on purpose, and do paid users get
  priority?" (the user). Google's docs, read 2026-09-21, do NOT say either.**
  The rate-limits page and the troubleshooting page say nothing about free
  requests being lower priority, best-effort or first to get a 503; 503 is
  just "retry with backoff". What the docs DO describe is tiers of
  "criticality" you choose per request: Standard ("standard criticality",
  the default), **Priority** ("highest criticality", "strictly
  non-sheddable", overflow is downgraded to Standard instead of failing
  with 503/429; 75-100% dearer; ONLY for paid Tier 2 and Tier 3 accounts;
  rate limit 0.3x standard), Flex and Batch (sheddable, half price, minutes
  to a day - useless for chat). Moving from Free to Tier 1 is "set up
  billing" and is "typically instant". So: that paying Standard traffic is
  served ahead of free traffic is what everybody assumes and what would
  make sense, and it is NOT documented - it would have to be MEASURED, a
  paid key beside a free one during a bad spell (`sample.mjs` in the
  scratchpad was the free half: eight lines, 4.5s apart, 10s timeout).
  Priority is out of reach for a single player (Tier 2 needs real spend)
  and is exactly what a hosted key serving many players could buy.
- v0.3.4 CHECKED: release run passed first time, one release,
  `latest.yml` says 0.3.4, the installer answers 200.
- **An idea the user floated and half dismissed, NOT decided: one paid key
  of theirs behind a small subscription, instead of every player getting
  their own.** What was said about it: the money works (a typical player is
  well under a dollar a month of model cost); the key can never ship in the
  app, so it needs a small server that holds it, builds the prompt ITSELF
  (or it is a free chatbot for strangers), knows who has paid, and rate
  limits; players' chat would then pass through the user's server (a
  privacy policy, GDPR); Stripe has already refused the user, so a merchant
  of record (Lemon Squeezy, Paddle) or Ko-fi memberships; and taking money
  for a tool that reads Valve's game is a bigger step than giving it away.
  It would REVISE "no hosted shared API key" under Decisions - theirs to
  revise. The measurement that should decide it is already being taken:
  the site counts `download_click` and `aistudio_click`; if most people who
  download never get a key, the key step is what is losing them.

## Feedback: where a player can say anything back (2026-09-21)

The user: "can someone leave me feedback somewhere after using right now
or no?" - hardly: the only route was a link to GitHub Issues inside one FAQ
answer on the site, nothing in the app, and GitHub needs an account most
players do not have.
- BUILT: the tray menu has "Report a problem or a bad translation...",
  which opens GitHub's issue chooser; `.github/ISSUE_TEMPLATE/` has three
  forms - a bad translation (what was said / what the app showed / what it
  should have been / which way), a bug (version, screen and display mode,
  antivirus, a screenshot), an idea - and security problems are pointed at
  the private advisory form. `feedbackUrl` in config.json overrides where
  the tray item goes (https only). NOT seen: the tray item clicked, nor
  the forms on GitHub (they appear once pushed; GitHub shows a form's
  errors only there).
- **DONE the same evening: the form.** A Google Form, "Dota Translator
  feedback", built in the user's own Chrome at their asking and PUBLISHED
  with their yes: https://forms.gle/4UwGB5drooGT4mUB9 . One required big
  box ("Your feedback"), one optional short answer ("Your email
  (optional)" - "Only if you'd like a reply. It's used for nothing else."),
  a description that points at GitHub issues and pull requests, a thank-you
  message. Settings: e-mail collection "Do not collect", "Limit to 1
  response" off - so nobody signs in. CHECKED from outside the browser
  (curl, as a stranger): 200, the title and both questions are there, no
  sign-in redirect, and neither the user's name nor an address appears in
  the page. It is the tray item ("Send feedback, or report a bad
  translation..."), in the site's FAQ and in the README; `FEEDBACK_URL` in
  `main.js`. Responses arrive in the form's Responses tab in the user's
  Google account; whether they turned on e-mail notifications is NOT known.
  E-mail VALIDATION on the optional field (Text > Email, with a friendly
  error) was added at the second attempt and CHECKED on the live form. How
  Forms' dropdowns are driven, since it cost a dozen tries: open the list,
  WAIT a second for its animation, click the option (it only highlights),
  then press Enter. The user wanted NO e-mail notifications for responses.
- (Earlier the same day, before the form existed:) **NOT built, and the user's to make: a route that needs NO account** - a
  Google Form, or a Discord server (where Dota players already are). Either
  is a link; when there is one, put it in `FEEDBACK_URL` in `main.js`, the
  site's FAQ and the README. Until then expect to hear only from the few
  who have GitHub, plus whatever is said in the Reddit thread.

## Trust in the exe: what was looked at (2026-09-21)

The user: strangers "cant trust me very much and .exe file might seem
suspicous". Already in place: built on GitHub, attested, SHA-256 in the
release notes. Offered and NOT yet built: a VirusTotal report per release
(needs the user's free API key as a repo secret), an "is this safe?" block
on download.html, CodeQL + an OpenSSF Scorecard badge, winget. Signing is
the only thing that touches the SmartScreen warning, and unsigned, every
release is a new unknown file with no reputation.

**BUILT the same day (the user: "add the things we can do now ... I will
think about certificate"):**
- `docs/download.html` has "Is it safe to run?" (`#safe`) before the steps:
  built in public, no administrator rights, the three places it talks to,
  reads and never writes, scanning is on - and THIS release's SHA-256, read
  live from the release notes. A VirusTotal line is in the page but HIDDEN
  until the notes of the latest release carry a report for that same hash;
  the link is built from the hash, never taken from the notes. The landing
  page's FAQ has "Is the download safe?" pointing at it. `npm test` holds
  the page to those words and to never saying "virus-free" / "100% safe".
- `release.yml` uploads the installer to VirusTotal **only if a repo secret
  `VT_API_KEY` exists** (the user has to make a free account and add it:
  repo Settings > Secrets and variables > Actions). Big files go to an
  upload address VirusTotal hands out. It can never fail a release. RAN
  for the first time on v0.3.1 and uploaded; see below.
  Expect one to three false alarms from small engines on an unsigned
  Electron installer; report them to those vendors.
- `codeql.yml` (GitHub's scanner, JavaScript, push + weekly),
  `scorecard.yml` (OpenSSF), `.github/dependabot.yml` (npm + actions,
  weekly PRs - they will arrive by email), `SECURITY.md`. Every action in
  every workflow is pinned to a commit SHA (looked up with `git ls-remote`
  on 2026-09-21); Dependabot moves the pins.
- **The Scorecard badge is deliberately NOT shown anywhere.** A days-old,
  one-person repo scores low on code review and branch protection, and a
  low number beside a download button says the wrong thing. Look at the
  score (Security tab, or scorecard.dev) before adding it.
- **Scorecard's first score: 4.2 / 10** (2026-09-21) - so the badge stays
  off. Tens for: no dangerous workflows, no binaries in the repo,
  Dependabot, SECURITY.md, CodeQL; 7 for pinning. Zeros that are just what
  a new one-person repo IS: Maintained (under 90 days old), Code-Review,
  Contributors, Fuzzing, the OpenSSF badge. Zeros worth something:
  - **Vulnerabilities: 35 known - nearly all of them Electron 33**, which
    is long out of support. Dependabot opened the bump at once (33 -> 44,
    PR #3). NOT merged: eleven major versions under a transparent,
    always-on-top, click-through window over a game is a thing to TRY in a
    match, not to take on faith. It is the most real safety item on this
    list - the app ships a browser engine with known holes, even if it
    only ever loads its own pages and hero portraits.
  - Token-Permissions: fixed the same day - every workflow now has
    `permissions: {}` and its one job is given exactly what it needs. The
    same grants as before, moved; release.yml and pages.yml have NOT run
    since (they run on a tag and on a docs change).
  - Signed-Releases: it does not see the attestation (it looks for
    signature files beside the release). Branch-Protection: off, and with
    one person pushing to master it would only be in the way.
  - scorecard-action v2.4.0 FAILED on its first run: it pulls its image
    from gcr.io, which no longer serves it. v2.4.4 (ghcr.io) works.
- Dependabot's other first PRs are major bumps of the pinned actions
  (#2, #4, #5, #6). None merged; none urgent.
- For the USER to do, because they are account settings:
  - DONE 2026-09-21: "Private vulnerability reporting" is on (CHECKED: the
    public API answers `"enabled": true`, and SECURITY.md's link opens).
  - DONE 2026-09-21: the `VT_API_KEY` secret (the user pasted the key into
    the chat first; it was NOT used, stored or committed - they added it
    through GitHub's own page). PROVEN by cutting **v0.3.1** for it: one
    release, three files, the download answers, `latest.yml` says 0.3.1,
    and the notes carry the VirusTotal link for that exact SHA-256. That
    was also the first release.yml run since its permissions moved to the
    job: it passed. **NOT SEEN: a verdict.** Ten minutes after the upload
    the report still read 0 / 0 - no engine had answered for an 80 MB file
    - and "No security vendors flagged this file" on a 0 / 0 report means
    nothing. So the page says the file is SENT there and to judge the
    report for yourself, not that it "was scanned by 70 engines". Look at
    the report for the latest release before quoting a number anywhere. (A
    report page is a web component tree: `get_page_text` returns nothing,
    walk the shadow roots.)
    **THE VERDICT, read a few hours later (v0.3.1): 6 of 67 flag it - and
    the six are TWO.** Arcabit, BitDefender, Emsisoft, GData and VIPRE all
    say `CMD:Heur.BZC.PZQ.Boxter.441.BC0915DB` - they all run BitDefender's
    engine, so that is ONE detection shown five times - and CTX says
    `Exe.unknown.boxter`. "Boxter" is BitDefender's HEURISTIC family for
    PowerShell command lines: a guess from behaviour, not a signature. And
    the behaviour is real: the app starts `powershell.exe -ExecutionPolicy
    Bypass -File ...` for scripts that compile C# at run time, P/Invoke
    `OpenProcess`/`ReadProcessMemory` on another process (`memscan.ps1`) and
    send keys with `keybd_event` (`sendchat.ps1`). That is what this app IS,
    and it is also the shape of PowerShell malware. CLEAN: Microsoft,
    Kaspersky, ESET, Malwarebytes, Sophos, Symantec, CrowdStrike, Google,
    Avast/AVG, McAfee, TrendMicro and ~50 more; 7 could not process the
    file or timed out. No earlier release was ever uploaded, so whether
    `sendchat.ps1` (v0.3.0) made it worse than `memscan.ps1` alone is NOT
    known.
    - The page USED to say false alarms come "from small engines; the big
      names are what to look at". BitDefender is a big name, so that was
      no longer honest: the page now names who found nothing, names
      BitDefender's heuristic, says why it fires, and warns that those
      products may block the app. No number is quoted as a verdict.
    - **A practical consequence, NOT seen:** a player running BitDefender,
      GData, Emsisoft or VIPRE may have the installer quarantined, or the
      helper blocked at run time - and then the app reads no chat and says
      nothing useful about why.
    - What would help, NOT done: report the false positive to BitDefender
      (their form wants the submitter's own details - the user's to send:
      bitdefender.com/consumer/support/answer/29358). What would remove the
      trigger rather than argue with it: ship the two helpers as one small
      compiled .exe instead of PowerShell + `Add-Type`. That trades this
      heuristic for whatever an unsigned exe that reads another process
      draws, and it is a real piece of work; a signing certificate would
      help more with both.
  - NOT KNOWN: whether two-factor authentication is on for the account (a
    stolen account is how this project would ship malware).
- **The trap, a SEVENTH time, and a new test for it:** a word-boundary
  escape in a regex on download.html, written through a quoted heredoc
  into a template literal, landed as a BACKSPACE character (twice), and the
  other regex lost its escapes and became a `//` comment. `npm test` now
  fails on any control character in `docs/` or `src/`. That test at once
  found an OLD one: `src/chatmem.js` had literal NUL/control bytes inside
  `UNPRINTABLE` and two literal NULs in `keyOf` (why grep called it
  binary). Rewritten as escapes and CHECKED over all 65,536 code units:
  the old and new expression agree on every one (the first rewrite missed
  DEL, 0x7f - the check caught it).

**SignPath Foundation's free signing: checked (signpath.org/terms), and a
licence change alone would NOT get this project in.** Three things stand
in the way, not one:
1. Licence: "an OSI-approved Open Source license without commercial
   dual-licensing for all components". PolyForm Noncommercial is not one.
   Going open source means giving up "a paid product may not bundle it" -
   a decision the user made on purpose. GPL-3.0 is the OSI licence nearest
   that intent (a product that bundles it must publish its own source).
2. Reputation: they verify it, and projects with no established user base
   are declined and told to reapply later - another new project was, in so
   many words. This one is days old.
3. What the software does: "must not include features designed to ...
   circumvent security measures". A tool that reads another program's
   memory and sends keys into a game is what a reviewer may read that
   against. Not tested; it is their call.
Also: the certificate is issued to SignPath Foundation - THEIR name is the
publisher Windows shows, not the user's - and they require MFA, named
roles, a "Code signing policy" section on the site, and a privacy policy.
So: do not relicense FOR this. Revisit when there are real users. Until
then the realistic route for an individual in the EU is a paid certificate
in their own name (Certum's open-source developer one was the cheap one
named; terms NOT checked).

## Donations (2026-09-20)

Ko-fi, paid out through PayPal: `https://ko-fi.com/sc0rebreaker`. Stripe
REJECTED the user for having no business number; do not suggest it again.
The link is in the landing page's footer and its "Is it really free?"
answer, the README, `.github/FUNDING.yml` (the repo's Sponsor button) and
the tray menu (from v0.2.11); clicks on the site are `donate_click`.
Worded as supporting the developer, never as payment, and donors get
nothing extra: it is a fan tool on Valve's game under a noncommercial
licence. GitHub Sponsors was suggested as a second route; not set up.

## The website counts visits (2026-09-20)

The user wanted to see "if anyone even went there". `docs/analytics.js`
(GA4, `G-RX1LXWKFZD`, the user's property) is loaded by every page in
`docs/`, does nothing on localhost or from a file, and sends events a page
view cannot: `download_click`, `aistudio_click`, `github_click`,
`guide_click`, `slider_used`. The footer said so at first; the user had
that sentence removed the same evening - do not put it back. `npm
test` fails if a page in `docs/` lacks it or if anything like it turns up
in `src/` - the APP has no analytics and must not get any. NOT done: a
cookie consent banner, which GA strictly wants for EU visitors; the user
was told, and chose GA.

## The setup window: the key goes in through the app (2026-09-20)

The user: "simpler for non techie user to just enter api key in the ui ...
some window with similar ui as dota translator page". Editing
`config.json` in Notepad was the step most likely to lose somebody, and a
missing quote there failed silently.

- **`src/setup.html` + `setup.js` + `setup-preload.cjs`**, opened by
  `main.js`: by itself when no key can be found, and from a **tray icon**
  ("Settings and key...", hide/show, Quit) after that. The tray icon is
  drawn in code (16x16 BGRA, amber with a dark T) - there is no image
  file in the app.
- **The key is TRIED before it is saved** (`src/keycheck.js`): one real
  translation of "гг вп". Saved means works. When it does not, the reason
  is turned into something to DO - the 402 (billing project) and 403 (new
  project refused) traps this project lost an hour each to, a mistyped
  key, quota, no internet. Pasted keys are tidied first (quotes, a
  trailing comma, a line break: people copy them out of config files).
- **Stored encrypted**, `geminiApiKeyEnc` in config.json, by Electron
  `safeStorage` (DPAPI: this Windows user only); plain `geminiApiKey` is
  blanked when that works and used only if encryption is unavailable.
  `GEMINI_API_KEY` and a plain `geminiApiKey` still work and still win.
  **`npm run watch` CANNOT read the encrypted key** (no Electron) and says
  so. `saveConfig` changes only what it is given and keeps the rest of the
  player's file, their own extra keys included.
- The page has a CSP of `default-src 'none'`, no web fonts and no URLs at
  all (`npm test` checks), cannot navigate or open windows, and is never
  handed the saved key back - only whether one exists.
- It also picks the look (`above` or `box`); changing it re-places the
  overlay window and reloads its page, which is why the overlay now sends
  its config on every `did-finish-load` rather than once.
- `DT_CONFIG=<file>` points the app at another config: how the first-run
  window was looked at without touching the real settings or key.
- SEEN: the window opening by itself against an empty config, on screen,
  looking as designed. **NOT exercised by me: pasting a real key and
  saving it** - typing credentials into a field is not something I do;
  the check-and-save path is covered by tests with a stand-in translator,
  and the user's own paste is the first real run of it. Also not seen:
  the tray icon itself.
- **The window sizes itself to its page** (the user: "currently the window
  is scrollable - just have it fit the content"): 680 wide, and `fitSetup`
  sets the height to the BODY's measured height (561 with no message),
  again whenever a result appears, capped to the screen. Measure the body,
  not `documentElement.scrollHeight`: a page never reports itself shorter
  than its window, so that can grow a window but never shrink one.
  `DT_SHOT=<file>` makes the window photograph itself - the way to look at
  it while a game covers the screen (a screen capture showed Dota, and a
  search by window title found the USER'S installed copy, not the dev one).
- **"More settings", a fold in the same window, shut by default** (the
  user asked whether the other settings belonged in the UI; the answer
  was FIVE of the twenty-five): which languages, the original in brackets,
  hero portraits, update automatically, text size for the box. The rest
  is engine tuning and stays in config.json - the fold says so and has an
  "Open its folder" button (the file is made first if it does not exist).
  `src/settings.js` decides what the window is SHOWN (never the key) and
  makes safe what it sends back: unknown languages dropped, NO language
  ticked is not saved (an app that translates nothing and does not say
  why), sizes clamped 11-28, anything of the wrong type or not one of the
  five ignored. Saving applies at once: the overlay page reloads, and the
  reader restarts only if the languages changed. With a key already
  saved the button reads "Save" and does not call Google. SEEN by the
  window's own snapshot, fold open (`DT_SHOT_MORE=1`). NOT exercised:
  pressing Save with changed settings against a running match.
- It STOLE FOCUS from the user's game when the test copy opened it. In
  real use it only opens unasked when there is no key, i.e. before the
  first match ever - but do not open it from code while a match is on.

**Chinese is on by default beside Russian** (`scripts: ["cyrillic",
"han"]`; the user: "a lot of chat wheels are chinese ... but main selling
point is russian"). The prompt says most chat is Russian and some Chinese,
and that a pasted Chinese voice line is translated briefly, not explained.
REAL OUTPUT: 夸张哦~ -> "Exaggerated~", 漂亮! -> "Nice!", 打得不错 -> "Well
played". The user's own config.json listed only cyrillic and was given
`han` too. The landing page still leads with Russian; its FAQ says
Chinese works out of the box.

## The key guide (`docs/key.html`, 2026-09-20)

The user asked for "a guide how to get api key with pictures". Linked from
the landing page's first step and from the README's setup.

- **The pictures are DRAWINGS, made in HTML on the page, and say so.** A
  real screenshot of Google AI Studio needs somebody's signed-in account
  and shows a live key. Three browser-window drawings (the API keys page,
  the create dialog with a no-billing project ringed, the copy button)
  and one of `config.json` with the part to change highlighted.
  `npm test` fails if anything shaped like a real Google key is on it.
- The steps follow Google's own page, read 2026-09-20
  (ai.google.dev/gemini-api/docs/api-key): a NEW user gets a default
  project AND a key made for them on accepting the terms; everybody else
  uses Create API key on Dashboard > API keys and picks a project.
- **From that same page, and not yet dealt with:** since 2026-05-28 new
  AI Studio keys are "authorization keys", and Google says the Gemini API
  will REJECT the older "standard" keys "on September 2026". The user's
  key was still working on 2026-09-20. If translation suddenly fails with
  an auth error, a new key from AI Studio is the first thing to try. NOT
  verified: that an authorization key works with the `x-goog-api-key`
  header this app sends (it is still an API key, so it should).
- Troubleshooting on the page is the two key traps this project hit (402
  prepayment depleted, 403 denied on a brand-new project) plus quota and
  a mistyped key.
- **Borderless Window** (the user asked whether it is a hard requirement):
  for the overlay, yes as far as is known - it is a separate window and
  an exclusive-fullscreen game lets nothing on top of it; drawing inside
  the game would mean injecting into its renderer, which this does not do.
  Plain Windowed works too, and the memory reader does not care. ONLY
  borderless has ever been tested. How Dota's "Exclusive Fullscreen"
  behaves under Windows' fullscreen optimisations is NOT known, so the
  page says "use Borderless" and does not claim the other is impossible.

## The landing page (`docs/index.html`, 2026-09-20)

The user asked for a page "to make it sell (even though it's free)",
like Paperbook's (`Desktop/paperbook/web/src/WelcomeV3.jsx`) but shorter,
with a slider. What was built, and the rules it follows:

- **THE SITE IS https://dotatranslator.live FROM 2026-09-22** (the user bought the
  domain; GitHub Pages custom domain via `docs/CNAME`, four A records at the
  registrar for the root and `www` CNAME to sc0rebreaker.github.io; the old
  address redirects). Every absolute URL in the site and the app uses it.
  LIVE ON HTTPS since 2026-09-22 evening: the DNS is at CLOUDFLARE (the
  user moved the zone there; root A x4 and www CNAME DNS-only, `translate`
  proxied with SSL Full (strict) - Flexible would loop with Caddy). GitHub's
  "DNS check" sat for two hours because it ran before the nameservers had
  switched; Remove + re-add of the domain in Settings > Pages fixed it in a
  minute. Before that it was
- LIVE at https://sc0rebreaker.github.io/dota-translator/ (since
  2026-09-20; the user asked for Pages to be turned on). It is served from
  the `gh-pages` BRANCH, which is nothing but `docs/` of master:
  pushing a branch of that name switched Pages on by itself, with no
  repository setting changed and no credential handled (`git subtree
  split --prefix docs -b gh-pages`, force-pushed; `has_pages` went true
  and the site answered 200 within three minutes).
  `.github/workflows/pages.yml` rebuilds that branch whenever `docs/`
  changes on master - do not edit gh-pages by hand. CHECKED live: /,
  /key.html, the WebP logos and the favicon all 200. Look at it locally with `node tools/serve-docs.mjs` (http://localhost:4173; also the
  `landing` entry in `.claude/launch.json`).
- Same bones as Paperbook's: serif headline with an italic accent, a demo
  in the hero, the numbers in a window card, what it does, three steps,
  **"The catch, up front"**, questions, a closing call. Its own colours
  (amber on near-black) so the two do not look like one product.
- **The slider is the hero**: one chat, drawn twice, the top layer clipped
  at a handle - without / with. Every row has a hero PORTRAIT before the
  name, on both sides (the user asked: "random hero images in front of
  players too, not color, also for the translated side") - four heroes
  drawn at random from sixteen on each visit, the same one for a player
  on both sides of the handle, with the old coloured block behind as the
  fallback. They are LINKED from Valve's image server, as the app's own
  are; all sixteen URLs checked 200. It is a real `<input type="range">` laid
  over the scene, so drag, tap and keyboard all work with no code, and it
  sways once on load to show that it moves. **The scene is drawn in CSS: no screenshot of
  the game and no Valve font, and the portraits are hot-linked, so
  nothing of Valve's is IN THE REPO.** Keep it that way.
- **Every number is a measurement from this file and every translation
  shown is what the model actually answered** (run through
  `translateBatch` before being written down - the first draft had
  invented ones, "go rosh" for what is really "let's rosh"). 45 lines =
  the three `e2e.mjs` runs, 9 + 15 + 21. Two claims were softened because
  they were designed, not seen: that the ten-second search lands in the
  loading screen, and the fallback after a patch.
- `npm test` holds the page to the project's decisions: "at your own
  risk" in so many words, never "safe"/"undetectable", no other product named,
  source-available not open source, and no dead in-page links.
- SEEN: desktop (1280, headless Edge screenshots of every section) and a
  298px-wide phone view in the browser pane. Headless Edge will not go
  narrower than ~500px, so a "phone" screenshot from it is cropped, not
  overflowing - that cost a few minutes. NOT seen: a real phone, Safari,
  or the fonts failing to load (it falls back to Georgia / system UI).
- The call to action is now a DOWNLOAD (`releases/latest`); see "The
  installer" - and note that no release has been uploaded yet.

## Read these first

- `NOTES-2026-09-20-memory.md` - the memory-reading route, the decisions
  already made, and everything measured. **It supersedes NOTES.md's
  conclusion.**
- `NOTES.md` - the original handoff. Every measurement in it still
  stands; sections 2 and 4 ("the only route left is OCR") do not.

Both are committed, and they hold the reasoning behind almost everything
below. Do not re-run an experiment they record.

## Running and testing

```bash
npm start        # the overlay (Electron)
npm run watch    # the same chain in a terminal - use this first
npm run demo     # drives the chain from a fake source, no Dota needed
npm run doctor   # no-key diagnostic
npm test         # 131 tests, plain node assert, no runner
```

Keep `npm test` green. It needs no game running and no API key.

- Commit trailer: `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`
- Working branch is `master`, pushed to `sc0rebreaker/dota-translator`.
  **The GitHub username changed on 2026-09-20 from `KristjanRanna` to
  `sc0rebreaker`, and the repo went PUBLIC the same evening.** GitHub
  redirects the old repo URLs (web, git, and raw answered 200 under the old
  name that night) but NOT Pages sites or the profile, and a redirect dies
  if anybody takes the old name - so every URL in the app, the page and
  the licence uses the new one. Pages, when it is switched on, will be
  `sc0rebreaker.github.io/dota-translator`. Before it went public the
  whole history was searched for a Google API key (`AIza...`) and for
  `config.json` ever being tracked: neither, on any branch.
- `tools/` holds the test rig: `fakedota.js` (stand-in game),
  `saychat.ps1` (types lines into the real game), `latency.mjs` (say ->
  found, and processor use), `whereis.mjs` (where every copy of a line
  is), `fakechat.ps1` (native stand-in with a real chat container),
  `ptrscan.ps1` + `ptrview.mjs` (what points at a chat line; `-Dump`,
  `-Parents`), `panelwatch.mjs` (the reader with no model, to the ms), `e2e.mjs` (the
  whole chain with the real model: said -> shown -> English),
  `serve-docs.mjs` (the landing page on localhost:4173), `panellayout.ps1`
  (where a UI panel keeps its size and position).
  saychat, latency, whereis, ptrscan, panelwatch and e2e touch the live game: bot matches, with
  say-so.
- **PowerShell variables ignore case**: `$targets` IS the `[string]$Targets`
  parameter, and assigning an array to it joins it into one string. Cost
  a run in ptrscan.
- Source files are LF. There is no build step and nothing compiled.
- The Gemini key is pasted into the app's setup window (saved encrypted
  in `config.json`, which is gitignored), or lives there in plain as
  `geminiApiKey`, or in `GEMINI_API_KEY`.

### Testing the reader with no Dota running

Copy `node.exe` to `fakedota.exe` (anywhere outside the repo), run
`fakedota.exe tools/fakedota.js`, and start the source with
`processName: 'fakedota'`. The stand-in holds the chat strings verbatim
in both forms, says a new one every three seconds - alternately NEAR the
last and FAR from all of them, so windowed and wide polls each have
something only they can find - and times a memory-heavy "frame" as a
proxy for what the reader costs. It has found real faults every time it
has been used. **Do this before touching the live game.**

Two things the stand-in itself got wrong, so they are not rediscovered:
going through `Buffer.from()` or printing a line leaves a second UTF-8
copy of it in node's own buffers, right beside the last one, which made
every "far" line look near; and ballast nothing reads is given back by
V8 - a "1 GB" stand-in swept as 246 MB.

`npm test` also parses every `.ps1` through PowerShell's own parser, with
a deliberately broken script as a control first. The scanner is one file
that nothing else would notice being broken: a syntax error there is not
an error anybody sees, it is a tool that silently never reads a line.

### Testing it by hand, in a game

The first sweep only **primes** - it remembers what has already been said
without showing it - so a line typed *before* the app starts will never
appear. Type something new, and only Cyrillic counts: the Cyrillic gate
deliberately ignores English, so Dota's own localised chat wheel never
costs a model call. Allow a few seconds end to end (up to
`scanIntervalMs` to see it, `batchMs` to gather, about a second for the
model).

## How it works

`src/memscan.ps1` reads the running game's memory - the chat panel when
it can find it, a search of the process when it cannot - and prints one
JSON object per line it finds; `src/memsource.js` keeps that helper alive and
turns its findings into `{name, text, channel}`; `src/chatmem.js` decides
what is a real line; `src/pipeline.js` batches; `src/translate.js` makes
one Gemini call; `src/main.js` + `overlay.*` draw it.

**Nothing downstream of the source cares where a line came from.**
`src/watcher.js` (the old `console.log` reader) is kept for that reason,
though it cannot see chat.

### Facts that cost real time to establish

- **Dota keeps each chat line complete and pre-formatted** as one
  null-terminated UTF-8 string, and a second time as Panorama markup
  carrying the player's colour slot. Nothing has to reassemble fields.
- **All-chat has NO channel tag.** Team chat is `[Allies] name: text`;
  all-chat is just `name: text`, far too common a shape to scan 4 GB for.
  So the anchor is `class="ChatPersona"` (the markup form, which every
  channel has) and the channel is read from what precedes it. Anchoring
  on the tag read team chat perfectly and missed every word of all-chat,
  silently. The real markup also carries the hero portrait before the
  tag - `hero_juggernaut.png" /><span class="ChatTarget">[Allies] <span
  class="ChatPersona">` - and the 48-byte look-back still reaches it.
- **The hot set is ALLOCATIONS, not regions, and that is the whole
  trick.** A new chat line does NOT land in the region the last sweep
  found one in: measured over 95 polls of hot regions, not one new line
  ever appeared in them, and both times chat turned up it was a full
  sweep that found it. It does land in the same heap RESERVATION.
- **Only PRIVATE memory becomes hot.** A line is written; an image is
  static. The one thing the anchor matches in image memory is Panorama's
  own template, `<span class="ChatPersona">%s</span>`, whose 29 MB
  resource region would otherwise have every poll read a quarter of a
  gigabyte of module for nothing.
- **Some hits are freed or half-overwritten memory.** A hit is validated,
  never trusted. `chatmem.js` takes only what parses, is printable, is
  inside the length caps and carries a channel tag it knows.
- **Regions bigger than the buffer used to be skipped whole**: 20 of
  them, 2,972 MB, two fifths of the process, silently. They are read in
  overlapping chunks now, and a string running to a seam is left to the
  next chunk rather than emitted truncated - a truncated line can still
  PARSE, which would put half a sentence on the overlay.
- **A buffer that does not begin where a region begins skips its first
  48 bytes.** The channel tag lives in the look-back before the anchor,
  and a hit that has lost its look-back parses perfectly well as ALL
  chat. A later chunk's first bytes are overlap the chunk before saw
  whole; a window's are a radius away from whatever made it a window.
  Likewise a string running to the end of a WINDOW is not whole, only
  one running to the end of a region is.
- The scan is **one pass** over the buffer, gated on a `bool[256]` of
  bytes that can start an anchor. It used to be one pass per anchor -
  seven passes over everything, six times slower.
- **Reading is memory bandwidth as much as processor.** The region walk
  is sequential (each `VirtualQueryEx` asks about the address after the
  last region); the reading runs on up to three threads.
- While there is nothing to find at all, fruitless sweeps **back off 1s
  to 10s** rather than running back to back.
- **A call to the model that never arrived is made once more.** One of
  the two lines in the first live game timed out at 12s. A refusal, a bad
  key or a quota answer is the model's word and is not asked twice.

### The numbers, measured on the live game

| | cost |
|---|---|
| full sweep | **3.8s**, 7,463 MB, 7,213 regions, three threads |
| full sweep, one thread | 12.6s |
| poll of the hot allocations | **410-780ms**, ~710 MB, ~255 regions |
| poll before the 64 MB region cap | 4.1s |
| windowed poll | NOT measured on the game; 45 MB / ~80ms on the stand-in |
| a sweep, single pass vs one per anchor | 1.5s vs 8.5s per gigabyte |

Defaults are a 2s poll and a 2-minute sweep. **With every poll wide and
three threads, those defaults are what the user called laggy.** Polls are
windowed and single-threaded now (open issue 1); whether that is enough
is not known.

### Routes that are dead, with the measurement

Do not revisit these without reading the notes; a web search will tell
you the first two are open questions, and they are not.

- **`console.log` carries no chat.** The log is written live (the
  widely-cited issue saying otherwise is wrong), but chat is drawn by
  Panorama and never reaches the engine console.
- **`DOTA_CHAT` verbosity is LOCKED.** `log_level DOTA_CHAT default`
  answers "Log verbosity levels are locked", in a match and in the menu.
- **GSI carries no chat.** Map, hero, items, abilities, draft. No
  messages of any kind.
- **Vision works and costs too much** - exact Cyrillic transcription,
  ~1,200 calls a game, which exhausts the free tier in one match. Local
  change-detection does not rescue it: the terrain animates under the
  text, so the region changes every frame anyway.

## Decisions already made - do not re-litigate

- **WHAT VALVE HAS ACTUALLY SAID - CORRECTED 2026-09-21. The notes, the
  README and the live site were WRONG for a day and a half.** They said
  "Valve has never said whether that is allowed" and "no documented ban for
  read-only access". The user asked for the first to be confirmed, and it
  could not be:
  - **February 2023, Valve's own post ("Cheaters Will Never Be Welcome in
    Dota", dota2.com/newsentry/3677788723152833273; wording checked against
    two news reports that quote it, the post itself would not load for the
    fetch tool):** over 40,000 accounts permanently banned for third-party
    software that read data from the client that is not visible in normal
    play. Caught by a HONEYPOT: a patch added "a section of data inside the
    game client that would never be read during normal gameplay", and every
    banned account had read it. And the sentence that matters here: running
    ANY application that reads data from the Dota client while you play can
    get the account permanently banned. No exception for what is read.
  - So: Valve HAS spoken, and there IS a documented mass ban for reading
    memory. What is true is narrower: those were cheats reading HIDDEN
    information; no ban is known for a tool that reads only chat.
  - The GitHub issue (ValveSoftware/Dota2-Gameplay#15007) is real and was
    CHECKED through the API: opened 2024-01-17, "Is reading game memory data
    that the client can see allowed?", a Valve developer @-mentioned, NO
    reply from Valve, closed 2025-08-21 by github-actions as stale ("not
    planned"). "Closed without an answer" was right; "in 2024" was not.
  - The page's catch, its FAQ and the README now say all of this, and
    `npm test` fails if either says "Valve has never said", says no ban is
    documented, or leaves out February 2023 / "permanently banned" / "makes
    no exception". NOTES-2026-09-20-memory.md's VAC section still has the
    old claim: it is a dated note, left as written, and THIS supersedes it.
  - **RE-ACCEPTED, KNOWING THIS (the user, 2026-09-21): "no its fine, let
    is be as is."** Told of the 2023 bans and of the sweep worry, they chose
    to ship as it is and NOT to have the panel find reworked. Their
    reasoning: long-running, openly sold tools that read the game's memory
    far more heavily have gone years without bans, and a chat translator is
    a much lighter case. That is their judgement of the risk and it stands;
    do not re-open it. Two things it does NOT establish, so neither goes on
    the site or into anything posted: that such tools have had no bans at
    all (not verifiable from here), and that Valve is fine with them (taking
    card payments shows a lawful business, not Valve's approval). The
    public wording stays as corrected above. Still NAME NO OTHER PRODUCT.
  - **DECIDED (the user, 2026-09-21): do NOT ask Valve.** "I would rather not
    poke valve - I might want to build another product around it, but the
    translator will remain free for everyone who wants to risk." So: no
    issue on Valve's tracker, no support ticket, and do not suggest it
    again. The drafts below were never posted.
  - A reviewer on Reddit suggested asking Valve. Drafts were written for
    the user (a new issue on ValveSoftware/Dota2-Gameplay asking for chat
    in GSI, and a Steam Support ticket); nothing was posted by me, and the
    user has not said whether they posted either. Valve's contact page
    lists no e-mail for game teams: Steam Support is the only route given.
  - **A TECHNICAL WORRY THIS RAISES, NOT INVESTIGATED - and, by the
    user's decision above, NOT TO BE WORKED ON unless they ask:** how the honeypot
    noticed a read is not public. One known way to notice an OUTSIDE
    process reading is a page that the game itself never touches: read it
    with ReadProcessMemory and it becomes resident, which the game can see.
    The panel READER touches only the chat panel's few KB and would not
    trip that. But the panel FIND sweeps all private memory twice per match
    (13 GB), and the scanner fallback sweeps the whole process - either
    WOULD read such a page, whatever is in it. If that is how the trap
    works, this app walks into it while looking for chat. UNVERIFIED in
    both directions. What would shrink the exposure: find the panel without
    a sweep (a static root was looked for on 2026-09-20 and not found; walk
    from a module's data instead), and never run the scanner fallback.
- **Ban risk is accepted by the user, explicitly.** Ship at their own
  risk with a clear notice. Never word it as *safe* - and no longer as
  *undocumented* either: see the correction above, Valve has documented it.
  Describe it as an *unsanctioned third-party tool*, and NOT as one of the
  overlays Valve permits, which do not read memory. **NAME NO OTHER
  PRODUCT, anywhere public - the page, the README, the notes, this file**
  (the user, 2026-09-20: "I dont want to promote it"). Two were named
  everywhere until then, as the fair comparison and the unfair one;
  `npm test` now fails if either name comes back.
- **Licence is PolyForm Noncommercial 1.0.0** - free for players, a paid
  product may not bundle it. That makes this **source-available, not open
  source**; do not call it open source.
- **Replacing the chat text in place is WANTED, as an option**, after the
  overlay. Argued against once on risk; the user's answer stands. It is
  also genuinely harder: the translation will not fit the original
  allocation, and the text exists in two representations, so which buffer
  the renderer actually reads decides whether a write shows at all.
- Free, own key, donations. No subscription and **no hosted shared API
  key** - with public source that would be strangers' bills.

## Traps that have each cost an hour

- **Never put a backslash escape through a bash heredoc into a patch.**
  It has silently mangled a string literal three times in this project
  and in the user's other one, twice inside the very test written to
  catch the first instance. Twice more on 2026-09-20, both through a
  QUOTED heredoc feeding a node patch script: a newline escape inside a
  template literal arrived as a real newline, and a null escape in a
  match string stopped it matching. Use the Edit tool for any line with
  a backslash in it. **And a sixth time on 2026-09-20 (late), through
  `node -e "..."`, which is the same trap without the heredoc:** a `\0`
  in a C# string arrived in `memscan.ps1` as a real NUL byte. It PARSED.
  `grep` calling the file "binary" was the only sign. `npm test` now
  fails on a NUL or a non-ASCII byte in the code of any `.ps1`.
- **An escape typed into a tool call is a letter by the time it is
  saved.** `И` written into `fakechat.ps1` landed as the Cyrillic
  letter, PowerShell read the BOM-less file as ANSI, and the stand-in
  spoke double-encoded Russian - which the reader, correctly, did not
  take for Russian. An hour of "why does the reader drop every line".
  Cyrillic in a `.ps1` is hex code points (`U("0418 ...")`), nothing else.
- **Never read a test result through a pipe.** `npm test | tail` exits
  with tail's status, so `&& git commit` after it commits a red suite.
  It did, once (af2a78f, fixed in the next commit). Send the output to a
  file and check the exit code.
- **Never have two modules whose names differ only by case**
  (`lateResult.js` beside `LateResult.jsx`). Windows ignores case, the
  import resolves to the wrong file, and the failure looks like anything
  but a filename.
