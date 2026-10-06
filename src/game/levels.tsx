import { useEffect, useMemo, useRef, useState } from "react";
import type { Theme } from "./themes";
import { Arena, Hud, Sprite, dist, shuffle, useKeys, useLoop, useRerender } from "./engine";

export interface LevelProps {
  theme: Theme;
  active: boolean;
  onWin: () => void;
  onLose: (reason: string) => void;
}

/* 1 — A to B */
function AtoB({ theme, active, onWin }: LevelProps) {
  const keys = useKeys();
  const s = useRef({ x: 6, hold: false, left: false });
  const r = useRerender();
  const quips = ["Hai scoperto: un prato.", "Punto di interesse: nessuno.", "Missione secondaria: continua.", "Quasi… ma che fatica."];
  useLoop((dt) => {
    const st = s.current;
    if (keys.current["ArrowRight"] || keys.current["d"] || st.hold) st.x += 14 * dt;
    st.left = !!(keys.current["ArrowLeft"] || keys.current["a"]);
    if (st.x >= 90) return onWin();
    r();
  }, active);
  const st = s.current;
  return (
    <Arena>
      <Hud>{st.left ? "Lì non c'è niente. Davvero." : quips[Math.min(3, Math.floor((st.x - 6) / 21))]}</Hud>
      <div className="track" />
      <Sprite x={6} y={42} size={5}>🅰️</Sprite>
      <Sprite x={92} y={42} size={8}>{theme.target}</Sprite>
      <Sprite x={st.x} y={50} size={9}>{theme.player}</Sprite>
      <button
        className="pixel-btn absolute bottom-[6%] left-1/2 -translate-x-1/2 select-none"
        onPointerDown={() => (s.current.hold = true)}
        onPointerUp={() => (s.current.hold = false)}
        onPointerLeave={() => (s.current.hold = false)}
      >
        TIENI PREMUTO →
      </button>
    </Arena>
  );
}

/* 2 — Space invaders */
function Invaders({ theme, active, onWin, onLose }: LevelProps) {
  const keys = useKeys();
  const r = useRerender();
  const s = useRef({
    px: 50,
    ox: 0,
    dir: 1,
    fire: 0,
    lives: 3,
    enemies: Array.from({ length: 24 }, (_, i) => ({ x: 18 + (i % 6) * 11, y: 10 + Math.floor(i / 6) * 8, alive: true })),
    bullets: [] as { x: number; y: number }[],
    eb: [] as { x: number; y: number }[],
  });
  useLoop((dt) => {
    const st = s.current;
    if (keys.current["ArrowLeft"]) st.px -= 60 * dt;
    if (keys.current["ArrowRight"]) st.px += 60 * dt;
    st.px = Math.max(5, Math.min(95, st.px));
    const alive = st.enemies.filter((e) => e.alive);
    if (!alive.length) return onWin();
    const speed = 8 + (24 - alive.length) * 0.8;
    st.ox += st.dir * speed * dt;
    if (alive.some((e) => e.x + st.ox > 94 || e.x + st.ox < 6)) {
      st.dir *= -1;
      st.ox += st.dir * speed * dt * 2;
      st.enemies.forEach((e) => (e.y += 3));
    }
    if (alive.some((e) => e.y > 82)) return onLose("Ti hanno raggiunto.");
    st.fire -= dt;
    if (st.fire <= 0) {
      st.bullets.push({ x: st.px, y: 86 });
      st.fire = 0.35;
    }
    st.bullets.forEach((b) => (b.y -= 90 * dt));
    st.bullets = st.bullets.filter((b) => {
      if (b.y < 0) return false;
      const hit = st.enemies.find((e) => e.alive && Math.abs(e.x + st.ox - b.x) < 4 && Math.abs(e.y - b.y) < 4);
      if (hit) hit.alive = false;
      return !hit;
    });
    if (Math.random() < dt * 1.2) {
      const e = alive[Math.floor(Math.random() * alive.length)];
      st.eb.push({ x: e.x + st.ox, y: e.y });
    }
    st.eb.forEach((b) => (b.y += 40 * dt));
    st.eb = st.eb.filter((b) => {
      if (b.y > 100) return false;
      if (b.y > 86 && b.y < 94 && Math.abs(b.x - st.px) < 4) {
        st.lives--;
        return false;
      }
      return true;
    });
    if (st.lives <= 0) return onLose("Abbattuto. In linea retta.");
    r();
  }, active);
  const st = s.current;
  return (
    <Arena onMove={(p) => (s.current.px = p.x)}>
      <Hud>Vite: {"❤️".repeat(Math.max(0, st.lives))} · Rimasti: {st.enemies.filter((e) => e.alive).length}</Hud>
      {st.enemies.map((e, i) => e.alive && <Sprite key={i} x={e.x + st.ox} y={e.y} size={6}>{theme.invader}</Sprite>)}
      {st.bullets.map((b, i) => <div key={i} className="bullet" style={{ left: `${b.x}%`, top: `${b.y}%` }} />)}
      {st.eb.map((b, i) => <div key={i} className="bullet bullet-enemy" style={{ left: `${b.x}%`, top: `${b.y}%` }} />)}
      <Sprite x={st.px} y={90} size={7}>{theme.player}</Sprite>
    </Arena>
  );
}

/* 3 — Stop incoming */
function Incoming({ theme, active, onWin, onLose }: LevelProps) {
  const r = useRerender();
  const id = useRef(0);
  const s = useRef({ objs: [] as { id: number; x: number; y: number; vx: number; vy: number }[], spawn: 0.5, killed: 0, lives: 3 });
  useLoop((dt) => {
    const st = s.current;
    st.spawn -= dt;
    if (st.spawn <= 0) {
      const a = Math.random() * Math.PI * 2;
      const sp = 14 + st.killed * 1.2;
      st.objs.push({ id: id.current++, x: 50 + Math.cos(a) * 55, y: 50 + Math.sin(a) * 55, vx: -Math.cos(a) * sp, vy: -Math.sin(a) * sp });
      st.spawn = Math.max(0.45, 1.2 - st.killed * 0.05);
    }
    st.objs.forEach((o) => {
      o.x += o.vx * dt;
      o.y += o.vy * dt;
    });
    st.objs = st.objs.filter((o) => {
      if (dist(o, { x: 50, y: 50 }) < 6) {
        st.lives--;
        return false;
      }
      return true;
    });
    if (st.lives <= 0) return onLose("Ti hanno colpito troppe volte.");
    if (st.killed >= 15) return onWin();
    r();
  }, active);
  const st = s.current;
  return (
    <Arena>
      <Hud>Vite: {"❤️".repeat(Math.max(0, st.lives))} · Fermati: {st.killed}/15</Hud>
      <Sprite x={50} y={50} size={9}>{theme.player}</Sprite>
      {st.objs.map((o) => (
        <Sprite key={o.id} x={o.x} y={o.y} size={8} onDown={() => {
          s.current.objs = s.current.objs.filter((x) => x.id !== o.id);
          s.current.killed++;
        }}>{theme.projectile}</Sprite>
      ))}
    </Arena>
  );
}

/* 4 — Escape */
function Escape({ theme, active, onWin, onLose }: LevelProps) {
  const keys = useKeys();
  const r = useRerender();
  const s = useRef({ p: { x: 50, y: 70 }, t: { x: 50, y: 70 }, e: { x: 50, y: 10 }, time: 0 });
  useLoop((dt) => {
    const st = s.current;
    const k = keys.current;
    if (k["ArrowLeft"]) st.t.x = st.p.x - 10;
    if (k["ArrowRight"]) st.t.x = st.p.x + 10;
    if (k["ArrowUp"]) st.t.y = st.p.y - 10;
    if (k["ArrowDown"]) st.t.y = st.p.y + 10;
    const move = (a: { x: number; y: number }, b: { x: number; y: number }, sp: number) => {
      const d = dist(a, b);
      if (d < 0.5) return;
      const m = Math.min(d, sp * dt);
      a.x += ((b.x - a.x) / d) * m;
      a.y += ((b.y - a.y) / d) * m;
    };
    st.t.x = Math.max(4, Math.min(96, st.t.x));
    st.t.y = Math.max(8, Math.min(96, st.t.y));
    move(st.p, st.t, 55);
    move(st.e, st.p, 22 + st.time * 2);
    st.time += dt;
    if (dist(st.p, st.e) < 6) return onLose(`${theme.enemy} ti ha preso.`);
    if (st.time >= 15) return onWin();
    r();
  }, active);
  const st = s.current;
  return (
    <Arena onMove={(p) => (s.current.t = p)}>
      <Hud>Sopravvivi: {Math.max(0, 15 - st.time).toFixed(1)}s</Hud>
      <Sprite x={st.e.x} y={st.e.y} size={9}>{theme.enemy}</Sprite>
      <Sprite x={st.p.x} y={st.p.y} size={7}>{theme.player}</Sprite>
    </Arena>
  );
}

/* 5 — Find intruder */
function Intruder({ theme, active, onWin, onLose }: LevelProps) {
  const [round, setRound] = useState(0);
  const [errors, setErrors] = useState(0);
  const n = [4, 5, 6][round];
  const odd = useMemo(() => Math.floor(Math.random() * n * n), [round, n]);
  const [common, intr] = theme.intruder[round];
  return (
    <Arena>
      <Hud>Round {round + 1}/3 · Errori: {errors}/3</Hud>
      <div className="absolute inset-[10%] grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {Array.from({ length: n * n }, (_, i) => (
          <button
            key={i}
            disabled={!active}
            className="cell"
            style={{ fontSize: `calc(var(--arena) * ${0.45 / n})` }}
            onClick={() => {
              if (i === odd) {
                if (round === 2) onWin();
                else setRound(round + 1);
              } else {
                const e = errors + 1;
                setErrors(e);
                if (e >= 3) onLose("Tre errori. L'intruso eri tu.");
              }
            }}
          >
            {i === odd ? intr : common}
          </button>
        ))}
      </div>
    </Arena>
  );
}

/* 6 — Memory */
function Memory({ theme, active, onWin }: LevelProps) {
  const cards = useMemo(() => shuffle([...theme.memory, ...theme.memory]), [theme]);
  const [open, setOpen] = useState<number[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  useEffect(() => {
    if (open.length !== 2) return;
    const [a, b] = open;
    const t = setTimeout(() => {
      if (cards[a] === cards[b]) {
        const nd = [...done, a, b];
        setDone(nd);
        if (nd.length === cards.length) onWin();
      }
      setOpen([]);
    }, 650);
    return () => clearTimeout(t);
  }, [open]);
  return (
    <Arena>
      <Hud>Mosse: {moves}</Hud>
      <div className="absolute inset-[10%] grid grid-cols-4 gap-2">
        {cards.map((c, i) => {
          const shown = open.includes(i) || done.includes(i);
          return (
            <button
              key={i}
              className={`cell ${shown ? "cell-open" : ""}`}
              style={{ fontSize: "calc(var(--arena) * 0.08)" }}
              disabled={!active || shown || open.length === 2}
              onClick={() => {
                setOpen([...open, i]);
                if (open.length === 1) setMoves(moves + 1);
              }}
            >
              {shown ? c : "?"}
            </button>
          );
        })}
      </div>
    </Arena>
  );
}

/* 7 — Spam */
function Spam({ active, onWin, onLose }: LevelProps) {
  const r = useRerender();
  const s = useRef({ c: 0, t: 10, pos: { x: 50, y: 55 } });
  useLoop((dt) => {
    s.current.t -= dt;
    if (s.current.t <= 0) return onLose(`Solo ${s.current.c} click. Il dio è deluso.`);
    r();
  }, active);
  const st = s.current;
  return (
    <Arena>
      <Hud>Click: {st.c}/50 · Tempo: {Math.max(0, st.t).toFixed(1)}s</Hud>
      <button
        className="spam-btn"
        style={{ left: `${st.pos.x}%`, top: `${st.pos.y}%` }}
        disabled={!active}
        onPointerDown={() => {
          st.c++;
          if (st.c % 10 === 0) st.pos = { x: 25 + Math.random() * 50, y: 30 + Math.random() * 50 };
          if (st.c >= 50) onWin();
          r();
        }}
      >
        CLICCA!
      </button>
    </Arena>
  );
}

/* 8 — Tricky tower */
function Tower({ theme, active, onWin, onLose }: LevelProps) {
  const r = useRerender();
  const s = useRef({ stack: [{ x: 30, w: 40 }], cur: { x: 0, w: 40, dir: 1 }, speed: 35 });
  const drop = () => {
    if (!active) return;
    const st = s.current;
    const top = st.stack[st.stack.length - 1];
    const l = Math.max(st.cur.x, top.x);
    const rr = Math.min(st.cur.x + st.cur.w, top.x + top.w);
    if (rr - l <= 0.5) return onLose("La torre è crollata. Molto tricky.");
    st.stack.push({ x: l, w: rr - l });
    if (st.stack.length >= 11) return onWin();
    st.cur = { x: 0, w: rr - l, dir: 1 };
    st.speed += 6;
    r();
  };
  const dropRef = useRef(drop);
  dropRef.current = drop;
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.code === "Space" && (e.preventDefault(), dropRef.current());
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  useLoop((dt) => {
    const c = s.current.cur;
    c.x += c.dir * s.current.speed * dt;
    if (c.x + c.w > 100) (c.x = 100 - c.w), (c.dir = -1);
    if (c.x < 0) (c.x = 0), (c.dir = 1);
    r();
  }, active);
  const st = s.current;
  const H = 7;
  return (
    <Arena onDown={drop}>
      <Hud>Piani: {st.stack.length - 1}/10 {theme.player}</Hud>
      {st.stack.map((b, i) => (
        <div key={i} className="block" style={{ left: `${b.x}%`, width: `${b.w}%`, bottom: `${3 + i * H}%`, height: `${H}%` }} />
      ))}
      <div className="block block-live" style={{ left: `${st.cur.x}%`, width: `${st.cur.w}%`, bottom: `${3 + st.stack.length * H}%`, height: `${H}%` }} />
    </Arena>
  );
}

/* 9 — Collect */
function Collect({ theme, active, onWin, onLose }: LevelProps) {
  const keys = useKeys();
  const r = useRerender();
  const id = useRef(0);
  const s = useRef({ bx: 50, items: [] as { id: number; x: number; y: number; v: number; e: string; bomb: boolean }[], spawn: 0, got: 0, lives: 3, t: 30 });
  useLoop((dt) => {
    const st = s.current;
    if (keys.current["ArrowLeft"]) st.bx -= 70 * dt;
    if (keys.current["ArrowRight"]) st.bx += 70 * dt;
    st.bx = Math.max(5, Math.min(95, st.bx));
    st.t -= dt;
    st.spawn -= dt;
    if (st.spawn <= 0) {
      const bomb = Math.random() < 0.25;
      st.items.push({ id: id.current++, x: 6 + Math.random() * 88, y: -5, v: 25 + Math.random() * 20, bomb, e: bomb ? theme.bomb : theme.collect[Math.floor(Math.random() * theme.collect.length)] });
      st.spawn = 0.55;
    }
    st.items.forEach((i) => (i.y += i.v * dt));
    st.items = st.items.filter((i) => {
      if (i.y > 84 && i.y < 94 && Math.abs(i.x - st.bx) < 8) {
        if (i.bomb) st.lives--;
        else st.got++;
        return false;
      }
      return i.y < 105;
    });
    if (st.lives <= 0) return onLose("Troppe bombe raccolte.");
    if (st.got >= 20) return onWin();
    if (st.t <= 0) return onLose(`Solo ${st.got} oggetti. L'inventario piange.`);
    r();
  }, active);
  const st = s.current;
  return (
    <Arena onMove={(p) => (s.current.bx = p.x)}>
      <Hud>Raccolti: {st.got}/20 · {"❤️".repeat(Math.max(0, st.lives))} · {Math.max(0, st.t).toFixed(0)}s</Hud>
      {st.items.map((i) => <Sprite key={i.id} x={i.x} y={i.y} size={7}>{i.e}</Sprite>)}
      <Sprite x={st.bx} y={90} size={10}>🧺</Sprite>
    </Arena>
  );
}

/* 10 — Cutscene */
function Cutscene({ theme, active, onWin }: LevelProps) {
  const lines = theme.story;
  const [i, setI] = useState(0);
  const [chars, setChars] = useState(0);
  const line = lines[i];
  useEffect(() => {
    if (!active || chars >= line.length) return;
    const t = setTimeout(() => setChars(chars + 1), 28);
    return () => clearTimeout(t);
  }, [chars, line, active]);
  const next = () => {
    if (!active) return;
    if (chars < line.length) return setChars(line.length);
    if (i === lines.length - 1) return onWin();
    setI(i + 1);
    setChars(0);
  };
  return (
    <Arena onDown={next}>
      <Hud>Cutscene {i + 1}/{lines.length} · (clicca per continuare)</Hud>
      <Sprite x={50} y={28} size={18}>☁️</Sprite>
      <Sprite x={50} y={24} size={11}>🧔</Sprite>
      <Sprite x={50} y={58} size={7}>{theme.player}</Sprite>
      <div className="dialog">
        {line.slice(0, chars)}
        <span className="caret">▌</span>
      </div>
    </Arena>
  );
}

export const LEVELS = [AtoB, Invaders, Incoming, Escape, Intruder, Memory, Spam, Tower, Collect, Cutscene];
