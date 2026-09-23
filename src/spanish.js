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

const words = (text) => String(text || '').toLowerCase().replace(/[^\p{L}\p{N}\s_]/gu, ' ').split(/\s+/).filter(Boolean);

export function looksSpanish(text) {
  const t = String(text || '');
  if (!t.trim()) return false;
  const ws = words(t);
  let es = 0, en = 0;
  for (const w of ws) { if (SPANISH.has(w)) es++; else if (ENGLISH.has(w)) en++; }
  if (SPANISH_ONLY.test(t)) es += 2;
  // A line with no English word and any Spanish one is Spanish - that is
  // where "hola" and "vamos" live. A mixed line has to be MORE Spanish
  // than English, and clearly.
  if (es === 0) return false;
  if (en === 0) return true;
  return es >= 2 && es > en;
}

// So it can sit in SCRIPTS beside the regular expressions.
export const spanish = { test: looksSpanish };
