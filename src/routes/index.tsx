import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { THEMES, THEME_ORDER, LEVEL_RULES, type ThemeId } from "@/game/themes";
import { LEVELS } from "@/game/levels";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Linear Game — l'open world, ma dritto" },
      { name: "description", content: "Un gioco a livelli che prende in giro gli open world: 10 prove lineari, 6 temi, un dio annoiato." },
      { property: "og:title", content: "The Linear Game" },
      { property: "og:description", content: "10 livelli lineari, 6 temi, un dio annoiato. Niente mappa. Solo dritto." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Game,
});

type Screen = "home" | "levels" | "play" | "themes" | "quit";
type Phase = "intro" | "playing" | "won" | "lost";
interface Save {
  theme: ThemeId;
  unlocked: Record<string, number>;
  completed: ThemeId[];
}
const KEY = "linear-game-save";
const fresh: Save = { theme: "classic", unlocked: { classic: 1 }, completed: [] };

function Game() {
  const [save, setSave] = useState<Save>(fresh);
  const [screen, setScreen] = useState<Screen>("home");
  const [level, setLevel] = useState(0);
  const [phase, setPhase] = useState<Phase>("intro");
  const [count, setCount] = useState(3);
  const [attempt, setAttempt] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) setSave({ ...fresh, ...JSON.parse(s) });
    } catch {}
  }, []);
  const persist = (s: Save) => {
    setSave(s);
    localStorage.setItem(KEY, JSON.stringify(s));
  };

  const theme = THEMES[save.theme];
  const unlocked = save.unlocked[save.theme] ?? 1;

  const start = (l: number) => {
    setLevel(l);
    setPhase("intro");
    setCount(3);
    setAttempt((a) => a + 1);
    setPaused(false);
    setScreen("play");
  };

  useEffect(() => {
    if (screen !== "play" || phase !== "intro" || paused) return;
    if (count <= 0) return setPhase("playing");
    const t = setTimeout(() => setCount(count - 1), 700);
    return () => clearTimeout(t);
  }, [screen, phase, count, paused]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.key === "Escape" || e.key === "p") && screen === "play") setPaused((p) => !p);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [screen]);

  const win = () => {
    if (phase !== "playing") return;
    setPhase("won");
    const last = level === 9;
    const s: Save = {
      ...save,
      unlocked: { ...save.unlocked, [save.theme]: Math.max(unlocked, Math.min(10, level + 2)) },
      completed: last && !save.completed.includes(save.theme) ? [...save.completed, save.theme] : save.completed,
    };
    persist(s);
    setTimeout(() => (last ? setScreen("themes") : start(level + 1)), 1600);
  };
  const lose = (r: string) => {
    if (phase !== "playing") return;
    setReason(r);
    setPhase("lost");
  };

  const pickTheme = (id: ThemeId) => {
    persist({ ...save, theme: id, unlocked: { ...save.unlocked, [id]: save.unlocked[id] ?? 1 } });
  };
  const themesOpen = save.completed.length > 0;

  const Level = LEVELS[level]!;

  return (
    <main data-theme={save.theme} className="game-root">
      <div className="scanlines" />
      {screen === "home" && (
        <section className="screen">
          <p className="font-pixel text-xs text-muted-foreground">un dio si annoia presenta</p>
          <h1 className="title">THE<br />LINEAR<br />GAME</h1>
          <p className="text-2xl text-accent">Un open world. Ma dritto. →</p>
          <p className="text-lg text-muted-foreground">Tema attuale: {theme.name} — {theme.tagline}</p>
          <div className="menu">
            <button className="pixel-btn" onClick={() => start(Math.min(unlocked, 10) - 1)}>
              {unlocked > 1 ? "Continua" : "Gioca"}
            </button>
            <button className="pixel-btn pixel-btn-ghost" onClick={() => setScreen("levels")}>Selezione livelli</button>
            {themesOpen && <button className="pixel-btn pixel-btn-ghost" onClick={() => setScreen("themes")}>Cambia tema</button>}
            <button className="pixel-btn pixel-btn-ghost" onClick={() => setScreen("quit")}>Esci dal gioco</button>
          </div>
        </section>
      )}

      {screen === "levels" && (
        <section className="screen">
          <h2 className="font-pixel text-xl text-primary">Selezione livelli</h2>
          <p className="text-xl text-muted-foreground">Tema: {theme.name}</p>
          {themesOpen && (
            <div className="flex flex-wrap justify-center gap-2">
              {THEME_ORDER.map((id) => (
                <button key={id} className={`chip ${id === save.theme ? "chip-on" : ""}`} onClick={() => pickTheme(id)}>{THEMES[id].name}</button>
              ))}
            </div>
          )}
          <div className="level-path">
            {theme.levelNames.map((n, i) => {
              const locked = i >= unlocked;
              return (
                <button key={i} disabled={locked} className="level-node" onClick={() => start(i)}>
                  <span className="font-pixel text-lg">{locked ? "🔒" : i + 1}</span>
                  <span className="text-lg leading-tight">{locked ? "???" : n}</span>
                </button>
              );
            })}
          </div>
          <button className="pixel-btn pixel-btn-ghost" onClick={() => setScreen("home")}>← Home</button>
        </section>
      )}

      {screen === "themes" && (
        <section className="screen">
          <h2 className="font-pixel text-xl text-primary">Il dio vuole di più</h2>
          <p className="text-2xl">Scegli il prossimo mondo. Sarà lineare uguale.</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {THEME_ORDER.map((id) => {
              const t = THEMES[id];
              return (
                <button key={id} className="theme-card" onClick={() => { pickTheme(id); setScreen("levels"); }}>
                  <span className="text-4xl">{t.player}{t.target}</span>
                  <span className="font-pixel text-sm text-primary">{t.name}</span>
                  <span className="text-base text-muted-foreground">{t.tagline}</span>
                  {save.completed.includes(id) && <span className="text-sm text-accent">✔ completato</span>}
                </button>
              );
            })}
          </div>
          <button className="pixel-btn pixel-btn-ghost" onClick={() => setScreen("home")}>← Home</button>
        </section>
      )}

      {screen === "quit" && (
        <section className="screen">
          <h2 className="title text-3xl">GAME OVER?</h2>
          <p className="text-2xl">Il dio torna ad annoiarsi. Puoi chiudere la scheda.</p>
          <button className="pixel-btn" onClick={() => setScreen("home")}>No, aspetta, torno</button>
        </section>
      )}

      {screen === "play" && (
        <section className="play">
          <header className="play-bar">
            <div>
              <div className="font-pixel text-xs text-muted-foreground">LIV {level + 1}/10 · {theme.name}</div>
              <div className="text-2xl leading-none text-primary">{theme.levelNames[level]}</div>
            </div>
            <button className="pixel-btn pixel-btn-sm" onClick={() => setPaused(true)}>❚❚ Pausa</button>
          </header>
          <div className="relative">
            <Level key={`${save.theme}-${level}-${attempt}`} theme={theme} active={phase === "playing" && !paused} onWin={win} onLose={lose} />
            {phase === "intro" && (
              <div className="overlay">
                <p className="max-w-md text-center text-2xl">{LEVEL_RULES[level]}</p>
                <p className="font-pixel text-5xl text-primary">{count || "VIA!"}</p>
              </div>
            )}
            {phase === "won" && (
              <div className="overlay">
                <p className="font-pixel text-2xl text-primary">COMPLETATO!</p>
                <p className="text-xl">{level === 9 ? "Il ciclo ricomincia…" : "Prossimo livello in arrivo (non hai scelta)."}</p>
              </div>
            )}
            {phase === "lost" && (
              <div className="overlay">
                <p className="font-pixel text-2xl text-destructive">FALLITO</p>
                <p className="text-xl">{reason}</p>
                <button className="pixel-btn" onClick={() => start(level)}>Riprova</button>
              </div>
            )}
          </div>
          {paused && (
            <div className="overlay overlay-full">
              <h2 className="font-pixel text-2xl text-primary">PAUSA</h2>
              <div className="menu">
                <button className="pixel-btn" onClick={() => setPaused(false)}>Continua</button>
                <button className="pixel-btn pixel-btn-ghost" onClick={() => { setPaused(false); setScreen("levels"); }}>Selezione livelli</button>
                <button className="pixel-btn pixel-btn-ghost" onClick={() => { setPaused(false); setScreen("home"); }}>Torna alla home</button>
                <button className="pixel-btn pixel-btn-ghost" onClick={() => { setPaused(false); setScreen("quit"); }}>Esci dal gioco</button>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
