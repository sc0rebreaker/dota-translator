// Is this chat line Spanish?
//
// Russian and Chinese are told apart from English by their SCRIPT, which
// costs nothing and is never wrong. Spanish is written in the same letters
// as English, so it needs a real decision - and the decision is BIASED: an
// English line sent to the translator costs a model call and comes back
// unchanged, a Spanish line left alone is one the player could not read.
// Both are wrong, the first is money, so this errs towards "not Spanish"
// unless the words say otherwise. Words only: no model, no network.
//
// Why Spanish at all: US servers are full of it (the user, 2026-09-23:
// "what language problems do usa people have" - "Peruvians on US East" is
// the thread everybody has read), and it goes both ways with Ctrl+Enter.

// Words that are Spanish and not English - as people TYPE them in a game:
// no accents (nobody types them), chat shorthand (q, xq, pa, ta), the
// insults, and Latin American slang. A word in both languages (no, mid,
// gg, bro, ok, me, a, y, la...) is deliberately NOT here.
const SPANISH = new Set(`
que q xq pq porque porq si sii ese esa eso esta este esto estos estas
el los las un una unos unas del al lo le les mi tu su sus mis tus
es era eran esta estan estoy estas estamos soy eres somos hay
tengo tienes tiene tenemos tienen puedo puedes puede podemos pueden
quiero quieres quiere queremos quieren voy vas va vamos vamo van vayan ven vengan vienen viene vine vino
ir ire iremos ve vete vayanse espera esperen corre corran ayuda ayuden ayudame cuidado cuidao
para pero con sin sobre desde hasta entre porfa porfavor favor gracias hola chau chao adios
bien mal bueno buena buenas buenos malo mala ahora luego despues antes siempre nunca tambien tampoco
mucho mucha muchos muchas poco nada nadie todo todos toda todas algo alguien otro otra
aqui aca alla alli ahi donde cuando como cual quien
jaja jajaja jajajaja jeje jajaj jajajaj xd
puta puto putos putas mierda pendejo pendeja pendejos verga culo cabron cabrones idiota idiotas estupido estupida tonto tonta manco mancos
wey guey pinche chido chale nel nmms ptm ctm csm wn weon weones boludo pelotudo chucha huevon huevas
hermano mano amigo amigos compa carnal pana parce causa
juego jugar juega jugando jugador jugadores equipo enemigo enemigos aliado aliados torre torres
compra compren compro cura curar retro retrocede vuelve vuelvo vuelvan tira tiren ataca ataquen
rapido lento tarde temprano abajo arriba izquierda derecha
ganamos perdimos ganar perder ganaron perdieron ganando perdiendo
nose dale ta pa ke kien xfa
atras retirense retirada retrocedan acaba acabo termina defiendan defiende deja dejen hagan sigan pongan mejor apurense matenlo maten mata haces hace hacen hago hacer
`.split(/\s+/).filter(Boolean));

// Words that are English and not Spanish. Same idea, the other way - and
// NOT the game words both sides type (mid, gg, wards, rosh, noob, feed):
// "vamos mid" is Spanish.
const ENGLISH = new Set(`
the you your are is and why what how this that with for not dont cant just
go come back need have get was were will he she they them we it its im
u ur r pls please thanks thx ty lol wtf omg feeding care miss safe lane
game team enemy help wait stop run play playing player good bad nice yes
yeah nope ok okay guys guy man dude
`.split(/\s+/).filter(Boolean));

// Letters that only Spanish has, and the marks. One of these is nearly
// proof on its own.
const SPANISH_ONLY = /[ñÑ¿¡]|[áéíóú]/;

// Apostrophes stay inside a word: "i've" is not "i" + the Spanish "ve".
const words = (text) => String(text || '').toLowerCase().replace(/[^\p{L}\p{N}\s_']/gu, ' ').split(/\s+/).map((w) => w.replace(/^'+|'+$/g, '')).filter(Boolean);

// Half a vote: Spanish shorthand that English Dota chat types too (q is an
// ability key, xd is laughter everywhere). One of these alone is not Spanish.
const WEAK = new Set(['q', 'k', 'ke', 'ta', 'pa', 'na', 'xd']);

// English Dota verbs with a Spanish ending are Spanish: pusheen, farmear, deja de fedear.
const SPANISH_VERB = /^(push|farm|gank|feed|fed|stack)(e|ea|ean|een|ear|eo|eas|eamos|eando|eado)$/;

// Arabic typed in Latin letters (Arabizi) uses digits for sounds Latin lacks
// (3al, 7aywan, la2) and a few words no Spanish player types. Never Spanish.
const ARABIZI_WORDS = new Set(['wallah', 'walah', 'yalla', 'yallah', 'khalas', 'ya3ni', 'inshallah']);
// Numbered things that are not Arabizi: towers, levels, 1v1, timings, Spanish
// ordinals (2da, 3er, 5to), dota2, and the 7u7 face (a review, 2026-09-23).
const DOTA_NUMBERED = /^(t[1-4]|lvl?\d+|x\d+|\d+x|\d+v\d+|\d+(min|m|s|k|seg|sec|hs|h)?|dota\d|\d+u\d+)$/;
// Spanish ordinals, exactly: 1ro 2da 3er 4to ... 10mo - not any digit with any
// ending, which let Arabizi words through (3mo, 5ra, 2na: a review, 2026-09-23).
const ORDINAL = /^(?:[13](?:ro|ra|er|ero|era)|2(?:do|da)|[456](?:to|ta)|7(?:mo|ma)|8(?:vo|va)|9(?:no|na)|10(?:mo|ma))$/;
const arabizi = (w) => ARABIZI_WORDS.has(w) || (/[a-z]/.test(w) && /[23579]/.test(w) && !DOTA_NUMBERED.test(w) && !ORDINAL.test(w));
// Only Spanish's OWN marks outweigh an Arabizi word: accents are French too.
const SPANISH_MARKS = /[\u00f1\u00d1\u00bf\u00a1]/;
// An English contraction (that's, don't, i've); a Spanish elision (pa'l) is not one.
const CONTRACTION = /^[a-z]+'(s|t|re|ve|ll|d|m)$/;

export function looksSpanish(text) {
  const t = String(text || '');
  if (!t.trim()) return false;
  const ws = words(t);
  // Spanish's own letters (ñ ¿ ¡ accents) outweigh an Arabizi-looking word.
  if (!SPANISH_MARKS.test(t) && ws.some(arabizi)) return false;
  let es = 0, en = 0;
  // A contraction (that's, don't) is English: Spanish is typed with no apostrophes.
  for (const raw of ws) {
    if (CONTRACTION.test(raw)) { en++; continue; }
    const w = raw.replace(/'/g, '');
    if (SPANISH.has(w) || SPANISH_VERB.test(w) || w === 'pal' || w === 'palante') es += WEAK.has(w) ? 0.5 : 1;
    else if (ENGLISH.has(w)) en++;
  }
  if (SPANISH_ONLY.test(t)) es += 2;
  // A line with no English word and any Spanish one is Spanish - that is
  // where "hola" and "vamos" live. A mixed line has to be MORE Spanish
  // than English, and clearly.
  if (es < 1) return false;
  if (en === 0) return true;
  return es >= 2 && es > en;
}

// So it can sit in SCRIPTS beside the regular expressions.
export const spanish = { test: looksSpanish };
