export type ThemeId = "classic" | "horror" | "movie" | "space" | "anime" | "cartoon";

export interface Theme {
  id: ThemeId;
  name: string;
  tagline: string;
  player: string;
  target: string;
  enemy: string;
  invader: string;
  projectile: string;
  intruder: [string, string][];
  memory: string[];
  collect: string[];
  bomb: string;
  levelNames: string[];
  story: string[];
}

export const LEVEL_RULES = [
  "Vai dal punto A al punto B. Tieni premuto → (o il pulsante). Tutto qui. Open world.",
  "Sparano da soli. Tu muoviti (mouse / ← →). Elimina tutti gli invasori.",
  "Ti arrivano addosso. Cliccali prima che ti tocchino. Fermane 15.",
  "Scappa! Muovi il puntatore (o le frecce). Sopravvivi 15 secondi.",
  "Trova l'intruso. 3 round, massimo 3 errori.",
  "Memory. Trova tutte le coppie. Nessuna fretta, il dio ha l'eternità.",
  "SPAM! Clicca il pulsante 50 volte in 10 secondi.",
  "Costruisci la torre: clicca (o spazio) per far cadere il blocco. Arriva a 10.",
  "Raccogli più oggetti possibile: 20 in 30 secondi. Evita le bombe.",
  "Cutscene. Non puoi saltarla. Ovviamente.",
];

const godStory = [
  "Lassù, sopra le nuvole, un dio si annoiava.",
  "Miliardi di umani. Tutti liberi. Tutti a fare… niente di interessante.",
  "Poi vide un ragazzino giocare a un open world: 400 ore, 3 missioni completate.",
  "«Libertà? Sopravvalutata» pensò il dio. «Vediamo se sanno andare DRITTO.»",
  "E così creò The Linear Game. Un corridoio. Dieci prove. Nessuna mappa.",
  "«Bravo, mortale. Ma la noia è eterna. Ricominciamo… con un tema diverso.»",
];

export const THEMES: Record<ThemeId, Theme> = {
  classic: {
    id: "classic",
    name: "Classico",
    tagline: "Il corridoio originale",
    player: "🧍",
    target: "🏁",
    enemy: "👹",
    invader: "👾",
    projectile: "🪨",
    intruder: [["😀", "😃"], ["🍎", "🍏"], ["🌲", "🌳"]],
    memory: ["🗡️", "🛡️", "🗺️", "💎", "🍄", "⭐"],
    collect: ["🪙", "💎", "⭐"],
    bomb: "💣",
    levelNames: [
      "Il Viaggio (100 metri)",
      "Invasori Lineari",
      "Pioggia di Sassi",
      "Il Mostro del Tutorial",
      "Uno di Questi Non C'entra",
      "Memoria Corta",
      "Dito Veloce",
      "La Torre Storta",
      "Loot Infinito (quasi)",
      "Il Dio Annoiato",
    ],
    story: godStory,
  },
  horror: {
    id: "horror",
    name: "Horror",
    tagline: "Silent Corridor",
    player: "🔦",
    target: "🚪",
    enemy: "🤡",
    invader: "🧟",
    projectile: "🦇",
    intruder: [["💀", "☠️"], ["🎃", "🍊"], ["🕷️", "🦂"]],
    memory: ["🔪", "🪓", "🎃", "👁️", "🕯️", "🧛"],
    collect: ["🕯️", "🔑", "🧄"],
    bomb: "🩸",
    levelNames: [
      "Silent Hall (corridoio nebbioso)",
      "Resident Invaders",
      "Pipistrelli dal Buio",
      "Pennywise ti Vede",
      "L'Intruso nella Cripta",
      "Five Nights at Memory's",
      "Spam Evil",
      "La Torre di Outlast",
      "Raccogli le Candele (Amnesia)",
      "Il Dio nell'Ombra",
    ],
    story: [
      "Il dio spense la luce. «Vediamo se urlano.»",
      "Nebbia, corridoi, una porta. Sempre la stessa porta.",
      "«Ogni horror è lineare» sussurrò. «Hanno solo paura di ammetterlo.»",
      "Hai sopravvissuto. Il dio è quasi spaventato. Quasi.",
    ],
  },
  movie: {
    id: "movie",
    name: "Movie",
    tagline: "Ciak, si corre dritti",
    player: "🤠",
    target: "🏆",
    enemy: "🦖",
    invader: "🛸",
    projectile: "🍅",
    intruder: [["🦈", "🐬"], ["🧙", "🧝"], ["🚗", "🚕"]],
    memory: ["🎬", "🦈", "🦇", "💍", "🧙", "🚀"],
    collect: ["🍿", "🎟️", "🏆"],
    bomb: "🎞️",
    levelNames: [
      "Il Signore dei Corridoi",
      "Independence Day (dritto)",
      "Pomodori Marci della Critica",
      "Jurassic Fuga",
      "Il Sesto Intruso",
      "Memento",
      "Fast & Spammous",
      "Inception Tower",
      "Popcorn Hunter",
      "Titoli di Coda Divini",
    ],
    story: [
      "Il dio prese i popcorn. «Facciamo un film. Un solo binario.»",
      "Ogni eroe segue un copione. Tu non fai eccezione.",
      "«Colpo di scena: non c'era nessun colpo di scena.»",
      "Fine. Il dio applaude lentamente. Sequel in arrivo.",
    ],
  },
  space: {
    id: "space",
    name: "Spazio",
    tagline: "Spazio infinito, percorso unico",
    player: "👨‍🚀",
    target: "🪐",
    enemy: "👽",
    invader: "🛸",
    projectile: "☄️",
    intruder: [["⭐", "🌟"], ["🌑", "🌚"], ["🚀", "🛰️"]],
    memory: ["🚀", "🌍", "🌙", "☀️", "🛰️", "🪐"],
    collect: ["⭐", "🌟", "💫"],
    bomb: "🕳️",
    levelNames: [
      "No Man's Corridor",
      "Space Invaders (l'originale, quasi)",
      "Pioggia di Meteore",
      "Alien: Fuga dalla Nave",
      "L'Impostore (Among Us)",
      "Interstellar Memory",
      "Houston, Spammiamo",
      "Torre Orbitale",
      "Polvere di Stelle",
      "Il Dio tra le Galassie",
    ],
    story: [
      "Il dio guardò l'universo: 2 trilioni di galassie, tutte noiose.",
      "«Esplorazione libera? Vi do un solo pianeta. Sulla destra.»",
      "Nel vuoto nessuno può sentirti… andare dritto.",
      "Atterraggio riuscito. Il dio sbadiglia in modo cosmico.",
    ],
  },
  anime: {
    id: "anime",
    name: "Anime",
    tagline: "Episodio 1 di 1000",
    player: "🥷",
    target: "🍜",
    enemy: "👺",
    invader: "🐉",
    projectile: "🌀",
    intruder: [["🍙", "🍘"], ["🌸", "💮"], ["🐱", "🐈"]],
    memory: ["🍙", "⛩️", "🎴", "🌸", "🐉", "🗡️"],
    collect: ["🍙", "🍡", "🌸"],
    bomb: "💢",
    levelNames: [
      "Corsa Naruto verso il Ramen",
      "Dragon Invaders Z",
      "Rasengan in Arrivo",
      "Fuga dal Titano",
      "Trova il Filler",
      "Memory no Jutsu",
      "Spam-Spam-Spam! (ORA ORA ORA)",
      "Torre di Babel-chan",
      "Raccogli le Sfere",
      "Flashback di 3 Episodi",
    ],
    story: [
      "Il dio si sistemò gli occhiali. Riflesso drammatico.",
      "«Questo non è nemmeno il mio potere finale.»",
      "Flashback: il ragazzino, il videogioco, la noia. Di nuovo.",
      "«Omae wa mou… completato.» Continua nel prossimo episodio.",
    ],
  },
  cartoon: {
    id: "cartoon",
    name: "Cartoon",
    tagline: "Th-th-that's linear, folks!",
    player: "🐭",
    target: "🧀",
    enemy: "🐱",
    invader: "🦆",
    projectile: "🔨",
    intruder: [["🐰", "🐇"], ["🦆", "🐤"], ["🍩", "🥯"]],
    memory: ["🍩", "🥕", "🧀", "🐿️", "🦆", "🐾"],
    collect: ["🧀", "🥕", "🍩"],
    bomb: "🧨",
    levelNames: [
      "Bip Bip Corridoio",
      "Paperi Invasori",
      "Incudini ACME",
      "Tom ti Insegue",
      "Chi ha Incastrato l'Intruso?",
      "Memory Toons",
      "Spam-Spam Doo",
      "La Torre ACME",
      "Ciambelle di Homer",
      "Th-th-that's all, Dio!",
    ],
    story: [
      "Il dio indossò dei guanti bianchi. Quattro dita.",
      "«Un buco dipinto sul muro? No. Solo un corridoio.»",
      "Un'incudine cadde. Il dio rise per la prima volta in mille anni.",
      "Th-th-that's all folks! …per ora.",
    ],
  },
};

export const THEME_ORDER: ThemeId[] = ["classic", "horror", "movie", "space", "anime", "cartoon"];
