import { useEffect, useRef, useState, type ReactNode, type PointerEvent } from "react";

export function useLoop(fn: (dt: number) => void, active: boolean) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    if (!active) return;
    let id = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      ref.current(dt);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [active]);
}

export function useKeys() {
  const k = useRef<Record<string, boolean>>({});
  useEffect(() => {
    const d = (e: KeyboardEvent) => (k.current[e.key] = true);
    const u = (e: KeyboardEvent) => (k.current[e.key] = false);
    window.addEventListener("keydown", d);
    window.addEventListener("keyup", u);
    return () => {
      window.removeEventListener("keydown", d);
      window.removeEventListener("keyup", u);
    };
  }, []);
  return k;
}

export function useRerender() {
  const [, set] = useState(0);
  return () => set((n) => n + 1);
}

export function Arena({
  children,
  onMove,
  onDown,
}: {
  children: ReactNode;
  onMove?: (p: { x: number; y: number }) => void;
  onDown?: (p: { x: number; y: number }) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pos = (e: PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 };
  };
  return (
    <div
      ref={ref}
      className="arena"
      onPointerMove={(e) => onMove?.(pos(e))}
      onPointerDown={(e) => {
        onMove?.(pos(e));
        onDown?.(pos(e));
      }}
    >
      {children}
    </div>
  );
}

export function Sprite({
  x,
  y,
  size = 6,
  children,
  onDown,
}: {
  x: number;
  y: number;
  size?: number;
  children: ReactNode;
  onDown?: () => void;
}) {
  return (
    <div
      className={`sprite ${onDown ? "cursor-pointer" : "pointer-events-none"}`}
      style={{ left: `${x}%`, top: `${y}%`, fontSize: `calc(var(--arena) * ${size / 100})` }}
      onPointerDown={(e) => {
        if (onDown) {
          e.stopPropagation();
          onDown();
        }
      }}
    >
      {children}
    </div>
  );
}

export function Hud({ children }: { children: ReactNode }) {
  return <div className="hud">{children}</div>;
}

export const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

export function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j]!, r[i]!];
  }
  return r;
}
