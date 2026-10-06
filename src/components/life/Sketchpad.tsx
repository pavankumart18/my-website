"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Pt = [number, number]; // normalised 0..1
type Stroke = { pts: Pt[]; hue: number };

// Warm-up doodle (normalised coords): mountains, a sun, and a winding trail up to a tent.
const DOODLE: Pt[][] = [
  [[0.04, 0.78], [0.2, 0.5], [0.3, 0.62], [0.48, 0.3], [0.62, 0.55], [0.72, 0.42], [0.96, 0.78]],
  [[0.44, 0.36], [0.48, 0.3], [0.52, 0.36], [0.5, 0.35], [0.48, 0.38], [0.46, 0.35]],
  ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => {
    const a = (i / 12) * Math.PI * 2;
    return i === 12 ? [] : ([[0.82 + Math.cos(a) * 0.055, 0.2 + Math.sin(a) * 0.055], [0.82 + Math.cos(a) * 0.08, 0.2 + Math.sin(a) * 0.08]] as Pt[]);
  }).filter((s) => s.length),
  Array.from({ length: 33 }, (_, i) => {
    const a = (i / 32) * Math.PI * 2;
    return [0.82 + Math.cos(a) * 0.04, 0.2 + Math.sin(a) * 0.04] as Pt;
  }),
  [[0.5, 0.92], [0.44, 0.84], [0.56, 0.76], [0.46, 0.68], [0.55, 0.6], [0.5, 0.52]],
  [[0.465, 0.52], [0.5, 0.45], [0.535, 0.52], [0.465, 0.52]],
  [[0.08, 0.92], [0.92, 0.92]],
];

export function Sketchpad() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const inView = useInView(wrap, { once: true, margin: "-80px" });
  const [mirror, setMirror] = useState(false);
  const [hint, setHint] = useState("Warming up…");
  const live = useRef({ strokes: [] as Stroke[], current: null as Stroke | null, mirror: false, hue: 190, doodleT: -1, started: false, hinted: false });

  useEffect(() => {
    live.current.mirror = mirror;
  }, [mirror]);

  useEffect(() => {
    if (inView && !live.current.started) {
      live.current.started = true;
      live.current.doodleT = 0;
    }
  }, [inView]);

  useEffect(() => {
    const c = canvas.current!;
    const g = c.getContext("2d")!;
    let raf = 0, w = 0, h = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    const doodleLen = DOODLE.reduce((s, p) => s + p.length, 0);

    const drawStroke = (pts: Pt[], hue: number, upto = pts.length, shimmer = 0) => {
      if (upto < 2) return;
      const L = live.current;
      const copies = L.mirror ? 6 : 1;
      for (let k = 0; k < copies; k++) {
        g.save();
        if (L.mirror) {
          g.translate(w / 2, h / 2);
          g.rotate((k / 6) * Math.PI * 2);
          g.translate(-w / 2, -h / 2);
        }
        g.strokeStyle = `hsl(${hue + shimmer} 95% 66%)`;
        g.shadowColor = `hsl(${hue + shimmer} 95% 60%)`;
        g.shadowBlur = 14;
        g.lineWidth = 2.6;
        g.lineCap = "round";
        g.lineJoin = "round";
        g.beginPath();
        g.moveTo(pts[0][0] * w, pts[0][1] * h);
        for (let i = 1; i < upto; i++) {
          const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
          g.quadraticCurveTo(x0 * w, y0 * h, ((x0 + x1) / 2) * w, ((y0 + y1) / 2) * h);
        }
        const last = pts[upto - 1];
        g.lineTo(last[0] * w, last[1] * h);
        g.stroke();
        g.restore();
      }
    };

    const t0 = performance.now();
    let last = t0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const L = live.current;
      const t = (now - t0) / 1000;
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      // Paper grid
      g.fillStyle = "rgba(255,255,255,0.05)";
      for (let x = 12; x < w; x += 24) for (let y = 12; y < h; y += 24) g.fillRect(x, y, 1.2, 1.2);

      if (L.doodleT >= 0) {
        L.doodleT += dt;
        let budget = Math.floor(L.doodleT * 22);
        DOODLE.forEach((pts, i) => {
          const n = Math.min(pts.length, budget);
          budget -= pts.length;
          drawStroke(pts, 40 + i * 28, n, Math.sin(t + i) * 10);
        });
        if (!L.hinted && L.doodleT * 22 > doodleLen + 8 && L.strokes.length === 0) {
          L.hinted = true;
          setHint("Your turn: draw anywhere.");
        }
      }
      L.strokes.forEach((s, i) => drawStroke(s.pts, s.hue, s.pts.length, Math.sin(t * 1.5 + i) * 14));
      if (L.current) drawStroke(L.current.pts, L.current.hue);
    };
    raf = requestAnimationFrame(frame);

    const pos = (e: PointerEvent): Pt => {
      const r = c.getBoundingClientRect();
      return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
    };
    const onDown = (e: PointerEvent) => {
      const L = live.current;
      c.setPointerCapture(e.pointerId);
      L.hue = (L.hue + 37) % 360;
      L.current = { pts: [pos(e)], hue: L.hue };
      setHint("Beautiful. Keep going.");
    };
    const onMove = (e: PointerEvent) => {
      const L = live.current;
      if (!L.current) return;
      const p = pos(e);
      const last = L.current.pts[L.current.pts.length - 1];
      if (Math.hypot(p[0] - last[0], p[1] - last[1]) > 0.004) L.current.pts.push(p);
    };
    const onUp = () => {
      const L = live.current;
      if (L.current && L.current.pts.length > 1) L.strokes.push(L.current);
      L.current = null;
    };
    c.addEventListener("pointerdown", onDown);
    c.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      c.removeEventListener("pointerdown", onDown);
      c.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div ref={wrap} className="glass flex h-full flex-col overflow-hidden rounded-3xl border hairline">
      <div className="flex flex-wrap items-start justify-between gap-3 p-6 pb-0 sm:p-8 sm:pb-0">
        <div>
          <p className="eyebrow">Drawing · how I slow down</p>
          <h4 className="mt-2 font-display text-2xl font-semibold">Draw with me.</h4>
        </div>
        <p className="font-mono text-[11px] text-muted">{hint}</p>
      </div>
      <canvas ref={canvas} className="mx-6 mt-4 min-h-72 flex-1 cursor-crosshair rounded-2xl border border-ink/[0.06] bg-[#0a0b14] screen-dark sm:mx-8 sm:min-h-80" style={{ touchAction: "none" }} aria-label="Drawing canvas" />
      <div className="flex flex-wrap items-center gap-2 p-6 sm:p-8">
        <button
          onClick={() => setMirror((m) => !m)}
          className={`rounded-full border px-4 py-2 text-sm transition ${mirror ? "border-[#F472B6]/60 bg-[#F472B6]/10 text-[#F9A8D4]" : "border-ink/15 hover:border-ink/40"}`}
        >
          ✺ Mandala mode {mirror ? "on" : "off"}
        </button>
        <button
          onClick={() => {
            live.current.strokes = [];
            live.current.doodleT = 0;
            live.current.hinted = false;
            setHint("Warming up…");
          }}
          className="rounded-full border border-ink/15 px-4 py-2 text-sm transition hover:border-ink/40"
        >
          ↺ Replay sketch
        </button>
        <button
          onClick={() => {
            live.current.strokes = [];
            live.current.doodleT = -1;
            setHint("Blank page. All yours.");
          }}
          className="rounded-full px-3 py-2 text-sm text-muted hover:text-text"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
