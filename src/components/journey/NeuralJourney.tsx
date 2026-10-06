"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { builds, cats, lanes, milestones, monthIndex, techs, TOTAL_MONTHS, type Build, type Lane, type Tech } from "@/content/network";
import { playNote } from "@/lib/audio";
import { MONTHS } from "@/lib/dates";

const LANE_ORDER: Lane[] = ["learn", "anshap", "straive", "own"];
const CAT_Y = { ai: 0.1, lang: 0.25, web: 0.78, data: 0.9, cloud: 0.9 } as const;
const LANE_Y = (i: number) => 0.42 + i * 0.1;
// A pentatonic scale per category, so a career "plays" as it grows.
const NOTES = { ai: [76, 79, 81], lang: [67, 69, 72], web: [60, 62, 64], data: [55, 57, 60], cloud: [52, 55, 57] } as const;

type BNode = Build & { m: number; x: number; y: number };
type Node = Tech & { birth: number; uses: BNode[]; x: number; y: number };

const fmt = (m: number) => {
  const mm = Math.floor(m);
  return `${MONTHS[mm % 12]} ${2024 + Math.floor(mm / 12)}`;
};

export function NeuralJourney() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const inView = useInView(wrap, { margin: "-80px" });
  const [t, setT] = useState(TOTAL_MONTHS);
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState(true);
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [size, setSize] = useState({ w: 1000, h: 560 });
  const live = useRef({ t: TOTAL_MONTHS, hover: null as string | null, pinned: null as string | null });
  const played = useRef(false);
  const userStarted = useRef(false); // sound only after the visitor presses play

  useEffect(() => {
    live.current.t = t;
    live.current.hover = hover;
    live.current.pinned = pinned;
  }, [t, hover, pinned]);

  // Layout: techs by birth date and category band, nudged apart; builds on their lanes.
  const { nodes, bnodes } = useMemo(() => {
    const { w, h } = size;
    const padL = w < 700 ? 24 : 150, padR = 40;
    const X = (m: number) => padL + (m / TOTAL_MONTHS) * (w - padL - padR);
    const bnodes: BNode[] = builds.map((b) => {
      const m = monthIndex(b.date);
      return { ...b, m, x: X(m), y: h * LANE_Y(LANE_ORDER.indexOf(b.lane)) };
    });
    // De-overlap builds sharing a month on one lane.
    LANE_ORDER.forEach((l) => {
      const row = bnodes.filter((b) => b.lane === l).sort((a, b) => a.x - b.x);
      for (let i = 1; i < row.length; i++) if (row[i].x - row[i - 1].x < 14) row[i].x = row[i - 1].x + 14;
    });
    const nodes: Node[] = techs.map((tch) => {
      const uses = bnodes.filter((b) => b.techs.includes(tch.id)).sort((a, b) => a.m - b.m);
      const birth = uses[0]?.m ?? 0;
      return { ...tch, uses, birth, x: X(birth), y: h * CAT_Y[tch.cat] };
    });
    // Data and cloud share the bottom band, so space them as one row.
    ([["ai"], ["lang"], ["web"], ["data", "cloud"]] as const).forEach((group) => {
      const row = nodes.filter((n) => (group as readonly string[]).includes(n.cat)).sort((a, b) => a.x - b.x);
      const gap = w < 700 ? 54 : 84;
      for (let i = 1; i < row.length; i++) if (row[i].x - row[i - 1].x < gap) row[i].x = row[i - 1].x + gap;
      const over = row.length ? row[row.length - 1].x - (w - padR) : 0;
      if (over > 0) row.forEach((n) => (n.x -= over));
      row.forEach((n, i) => (n.y += (i % 2 ? 1 : -1) * h * 0.028));
    });
    return { nodes, bnodes };
  }, [size]);

  useEffect(() => {
    const el = wrap.current!;
    const ro = new ResizeObserver(([e]) => {
      const w = Math.max(720, e.contentRect.width);
      setSize({ w, h: w < 900 ? 600 : 580 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Autoplay once, the first time it comes into view.
  useEffect(() => {
    if (inView && !played.current) {
      played.current = true;
      setT(0);
      setPlaying(true);
    }
  }, [inView]);

  // Playback: ~14 s for the whole career, with a note for every neuron born.
  useEffect(() => {
    if (!playing) return;
    let raf = 0, last = performance.now();
    const born = new Set(nodes.filter((n) => n.birth <= live.current.t).map((n) => n.id));
    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const next = Math.min(TOTAL_MONTHS, live.current.t + dt * (TOTAL_MONTHS / 14));
      for (const n of nodes) {
        if (!born.has(n.id) && n.birth <= next) {
          born.add(n.id);
          if (sound && userStarted.current) {
            const scale = NOTES[n.cat];
            try {
              playNote(scale[born.size % scale.length], 0.5);
            } catch {}
          }
        }
      }
      setT(next);
      // On narrow screens the canvas scrolls sideways: keep the playhead in view.
      const el = wrap.current;
      if (el && el.scrollWidth > el.clientWidth) el.scrollLeft = (next / TOTAL_MONTHS) * (el.scrollWidth - el.clientWidth);
      if (next >= TOTAL_MONTHS) setPlaying(false);
      else raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, nodes, sound]);

  // Render loop.
  useEffect(() => {
    const c = canvas.current!;
    const g = c.getContext("2d")!;
    let raf = 0;
    let ink = "255 255 255", text = "#e9ebef", muted = "#8b919c";
    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      ink = cs.getPropertyValue("--ink-rgb").trim() || ink;
      text = cs.getPropertyValue("--text").trim() || text;
      muted = cs.getPropertyValue("--muted").trim() || muted;
    };
    readTheme();
    const mo = new MutationObserver(readTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const t0 = performance.now();
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!inView && !playing) return;
      const { w, h } = size;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (c.width !== w * dpr) {
        c.width = w * dpr;
        c.height = h * dpr;
      }
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      const time = (now - t0) / 1000;
      const T = live.current.t;
      const focus = live.current.pinned ?? live.current.hover;
      const fTech = focus?.startsWith("t:") ? focus.slice(2) : null;
      const fBuild = focus?.startsWith("b:") ? focus.slice(2) : null;
      const fBuildNode = fBuild ? bnodes.find((b) => b.id === fBuild) : undefined;
      const techDim = (id: string) => (fTech ? fTech !== id : fBuildNode ? !fBuildNode.techs.includes(id) : false);
      const edgeOn = (techId: string, buildId: string) => (fTech ? fTech === techId : fBuild ? fBuild === buildId : true);
      const padL = w < 700 ? 24 : 150, padR = 40;
      const X = (m: number) => padL + (m / TOTAL_MONTHS) * (w - padL - padR);

      // Lanes
      LANE_ORDER.forEach((l, i) => {
        const y = h * LANE_Y(i);
        g.strokeStyle = `rgb(${ink} / 0.08)`;
        g.setLineDash([2, 6]);
        g.beginPath();
        g.moveTo(padL, y);
        g.lineTo(w - padR, y);
        g.stroke();
        g.setLineDash([]);
        // The lane's lit stretch, up to the playhead.
        const first = bnodes.filter((b) => b.lane === l).reduce((m, b) => Math.min(m, b.m), Infinity);
        if (first <= T) {
          const grad = g.createLinearGradient(X(first), 0, X(T), 0);
          grad.addColorStop(0, lanes[l].color + "00");
          grad.addColorStop(1, lanes[l].color);
          g.strokeStyle = grad;
          g.lineWidth = 2;
          g.beginPath();
          g.moveTo(X(first), y);
          g.lineTo(X(T), y);
          g.stroke();
          g.lineWidth = 1;
        }
        if (w >= 700) {
          g.fillStyle = lanes[l].color;
          g.font = "500 11px var(--font-mono), monospace";
          g.textAlign = "left";
          g.fillText(lanes[l].label.toUpperCase(), 12, y + 4);
        }
      });

      // Synapses + pulses
      for (const n of nodes) {
        if (n.birth > T) continue;
        for (const b of n.uses) {
          if (b.m > T) continue;
          const dim = !edgeOn(n.id, b.id);
          const strong = !!focus && !dim;
          const mx = (n.x + b.x) / 2, my = (n.y + b.y) / 2 + (n.y < b.y ? -20 : 20);
          const grow = Math.min(1, (T - b.m) * 3 + 0.05);
          g.strokeStyle = dim ? `rgb(${ink} / 0.04)` : cats[n.cat].color + (strong ? "dd" : "40");
          g.lineWidth = strong ? 1.8 : 1;
          g.beginPath();
          g.moveTo(n.x, n.y);
          // Partial quadratic for the growth animation.
          const steps = 18;
          for (let i = 1; i <= Math.ceil(steps * grow); i++) {
            const u = Math.min(1, i / steps);
            const x = (1 - u) * (1 - u) * n.x + 2 * (1 - u) * u * mx + u * u * b.x;
            const y = (1 - u) * (1 - u) * n.y + 2 * (1 - u) * u * my + u * u * b.y;
            g.lineTo(x, y);
          }
          g.stroke();
          if (!dim && grow >= 1) {
            const u = (time * 0.35 + (n.x + b.x) * 0.001) % 1;
            const x = (1 - u) * (1 - u) * n.x + 2 * (1 - u) * u * mx + u * u * b.x;
            const y = (1 - u) * (1 - u) * n.y + 2 * (1 - u) * u * my + u * u * b.y;
            g.fillStyle = cats[n.cat].color;
            g.beginPath();
            g.arc(x, y, strong ? 2.6 : 1.6, 0, Math.PI * 2);
            g.fill();
          }
        }
      }

      // Builds
      for (const b of bnodes) {
        if (b.m > T) continue;
        const lit = fTech ? b.techs.includes(fTech) : fBuild ? b.id === fBuild : true;
        const pop = Math.min(1, (T - b.m) * 4 + 0.2);
        const isF = fBuild === b.id;
        const s = (isF ? 6.5 : 4.2) * pop;
        if (isF) {
          // Focus ring + label for the selected build.
          g.strokeStyle = lanes[b.lane].color;
          g.lineWidth = 1.4;
          g.beginPath();
          g.arc(b.x, b.y, 13 + Math.sin(time * 4) * 1.5, 0, Math.PI * 2);
          g.stroke();
          g.fillStyle = text;
          g.font = "600 12px var(--font-inter), sans-serif";
          g.textAlign = b.x > w * 0.75 ? "right" : "left";
          g.fillText(b.label, b.x + (b.x > w * 0.75 ? -18 : 18), b.y - 14);
        }
        g.save();
        g.translate(b.x, b.y);
        g.rotate(Math.PI / 4);
        g.fillStyle = lit ? lanes[b.lane].color : `rgb(${ink} / 0.12)`;
        g.shadowColor = lanes[b.lane].color;
        g.shadowBlur = lit ? 10 : 0;
        g.fillRect(-s, -s, s * 2, s * 2);
        g.restore();
      }

      // Neurons
      for (const n of nodes) {
        if (n.birth > T) continue;
        const age = T - n.birth;
        const used = n.uses.filter((b) => b.m <= T).length;
        const r = (5 + Math.sqrt(used) * 2.6) * Math.min(1, age * 3 + 0.3);
        const dim = techDim(n.id);
        const col = cats[n.cat].color;
        // Birth shockwave
        if (age < 0.6) {
          g.strokeStyle = col;
          g.globalAlpha = 1 - age / 0.6;
          g.beginPath();
          g.arc(n.x, n.y, r + age * 60, 0, Math.PI * 2);
          g.stroke();
          g.globalAlpha = 1;
        }
        const breathe = 1 + Math.sin(time * 2 + n.x) * 0.06;
        const glow = g.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3.2 * breathe);
        glow.addColorStop(0, col + (dim ? "22" : "88"));
        glow.addColorStop(1, col + "00");
        g.fillStyle = glow;
        g.beginPath();
        g.arc(n.x, n.y, r * 3.2 * breathe, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = dim ? `rgb(${ink} / 0.25)` : col;
        g.beginPath();
        g.arc(n.x, n.y, r, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = dim ? muted : text;
        g.font = `${fTech === n.id ? 600 : 500} ${w < 900 ? 10 : 12}px var(--font-inter), sans-serif`;
        g.textAlign = "center";
        g.fillText(n.label, n.x, n.y + (n.cat === "web" ? r + 15 : -r - 8));
      }

      // Playhead
      const px = X(T);
      g.strokeStyle = `rgb(${ink} / 0.35)`;
      g.setLineDash([3, 4]);
      g.beginPath();
      g.moveTo(px, h * 0.04);
      g.lineTo(px, h * 0.98);
      g.stroke();
      g.setLineDash([]);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
    };
  }, [nodes, bnodes, size, inView, playing]);

  const onMove = (e: React.PointerEvent) => {
    const r = canvas.current!.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * size.w, y = ((e.clientY - r.top) / r.height) * size.h;
    let best: string | null = null, bd = 12;
    for (const b of bnodes) {
      if (b.m > t) continue;
      const d = Math.hypot(b.x - x, b.y - y);
      if (d < bd) {
        bd = d;
        best = "b:" + b.id;
      }
    }
    if (!best) {
      bd = 22;
      for (const n of nodes) {
        if (n.birth > t) continue;
        const d = Math.hypot(n.x - x, n.y - y);
        if (d < bd) {
          bd = d;
          best = "t:" + n.id;
        }
      }
    }
    setHover(best);
  };

  const focusId = pinned ?? hover;
  const focusNode = focusId?.startsWith("t:") ? nodes.find((n) => n.id === focusId.slice(2)) : undefined;
  const focusBuild = focusId?.startsWith("b:") ? bnodes.find((b) => b.id === focusId.slice(2)) : undefined;
  const caption = [...milestones].reverse().find((m) => monthIndex(m.date) <= t + 0.01) ?? milestones[0];
  const techCount = nodes.filter((n) => n.birth <= t).length;
  const buildCount = bnodes.filter((b) => b.m <= t).length;

  return (
    <div className="glass overflow-hidden rounded-3xl border hairline">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b hairline px-5 py-4 sm:px-7">
        <div className="flex items-center gap-6 font-mono text-xs tabular-nums text-muted">
          <span>
            <span className="font-display text-2xl font-semibold text-text">{techCount}</span> technologies
          </span>
          <span>
            <span className="font-display text-2xl font-semibold text-text">{buildCount}</span> builds
          </span>
          <span className="hidden sm:inline">
            <span className="font-display text-2xl font-semibold text-text">{fmt(t)}</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {(Object.keys(cats) as (keyof typeof cats)[]).map((c) => (
            <span key={c} className="flex items-center gap-1.5 text-muted">
              <span className="h-2 w-2 rounded-full" style={{ background: cats[c].color }} />
              {cats[c].label}
            </span>
          ))}
        </div>
      </div>

      <div className="min-h-[52px] border-b hairline px-5 py-3.5 sm:px-7">
        <AnimatePresence mode="wait">
            <motion.p
              key={caption.date}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-sm text-text"
            >
              <span className="mr-2 font-mono text-xs text-[#FBBF24]">{fmt(monthIndex(caption.date))}</span>
              {caption.text}
            </motion.p>
          </AnimatePresence>
      </div>
      <div ref={wrap} className="relative overflow-x-auto [scrollbar-width:thin]">
        <canvas
          ref={canvas}
          style={{ width: size.w, height: size.h }}
          className={`block ${hover ? "cursor-pointer" : "cursor-crosshair"}`}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
          onClick={() => setPinned(hover && hover !== pinned ? hover : null)}
          aria-label="Animated network of technologies and the projects built with them, over time"
        />

      </div>

      <div className="grid gap-5 border-t hairline p-5 sm:p-7 lg:grid-cols-[auto_1fr] lg:items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              userStarted.current = true;
              if (!playing && t >= TOTAL_MONTHS - 0.01) setT(0);
              setPlaying((p) => !p);
            }}
            className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#22D3EE] via-[#A78BFA] to-[#F472B6] text-bg"
            aria-label={playing ? "Pause" : "Play my journey"}
          >
            {playing ? "❚❚" : "▶"}
          </button>
          <button onClick={() => setSound((s) => !s)} className="rounded-full border border-ink/15 px-3 py-1.5 text-xs text-muted hover:text-text">
            {sound ? "♪ sound on" : "♪ sound off"}
          </button>
        </div>
        <input
          type="range"
          min={0}
          max={TOTAL_MONTHS}
          step={0.05}
          value={t}
          onChange={(e) => {
            setPlaying(false);
            setT(+e.target.value);
          }}
          aria-label="Scrub through time"
          className="w-full accent-[#A78BFA]"
        />
      </div>

      <div className="min-h-[92px] border-t hairline px-5 py-4 sm:px-7">
        <AnimatePresence initial={false}>
          {focusBuild ? (
            <motion.div key={focusBuild.id} initial={{ opacity: 0.4, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
              <p className="flex flex-wrap items-baseline gap-x-3">
                <span className="flex items-center gap-2 font-display text-xl font-semibold">
                  <span className="h-2.5 w-2.5 rotate-45" style={{ background: lanes[focusBuild.lane].color }} />
                  {focusBuild.label}
                </span>
                <span className="font-mono text-xs text-muted">
                  {lanes[focusBuild.lane].label} · {focusBuild.approx ? "~" : ""}
                  {fmt(focusBuild.m)} {pinned ? "· pinned" : "· click to pin"}
                </span>
                {focusBuild.href && (
                  <a href={focusBuild.href} target="_blank" rel="noreferrer" className="ml-auto text-sm text-accent hover:underline">
                    Open ↗
                  </a>
                )}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <span className="self-center font-mono text-[11px] text-faint">built with</span>
                {focusBuild.techs.map((id) => {
                  const tch = nodes.find((n) => n.id === id)!;
                  return (
                    <button
                      key={id}
                      onClick={() => setPinned("t:" + id)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-3 py-1 text-xs hover:border-ink/30"
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: cats[tch.cat].color }} />
                      {tch.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : focusNode ? (
            <motion.div key={focusNode.id} initial={{ opacity: 0.4, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
              <p className="flex flex-wrap items-baseline gap-x-3">
                <span className="font-display text-xl font-semibold" style={{ color: cats[focusNode.cat].color }}>
                  {focusNode.label}
                </span>
                <span className="font-mono text-xs text-muted">
                  since {fmt(focusNode.birth)} · {focusNode.uses.length} builds {pinned ? "· pinned" : "· click to pin"}
                </span>
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {focusNode.uses.map((b) => {
                  const chip = (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-3 py-1 text-xs">
                      <span className="h-1.5 w-1.5 rotate-45" style={{ background: lanes[b.lane].color }} />
                      {b.label}
                      {b.approx && <span className="text-faint">~</span>}
                      {b.href && <span className="text-faint">↗</span>}
                    </span>
                  );
                  return b.href ? (
                    <a key={b.id} href={b.href} target="_blank" rel="noreferrer" className="hover:opacity-80">
                      {chip}
                    </a>
                  ) : (
                    <span key={b.id}>{chip}</span>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted">
              Hover a neuron (technology) or a diamond (build) to explore. Click to pin. Drag the timeline to rewind. Anshap dates marked ~ are approximate.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
