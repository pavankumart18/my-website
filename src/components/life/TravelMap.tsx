"use client";

import { geoContains, geoMercator, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import india from "@/content/india.json";
import { home, places, type Place } from "@/content/life";

const W = 560;
const H = 620;

const km = (a: { lat: number; lon: number }, b: { lat: number; lon: number }) => {
  const R = 6371, r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

// Himachal stops sit within a few km of each other; fan their labels out so they stay readable.
const labelOffset: Record<string, [number, number, "start" | "end"]> = {
  dharamshala: [-12, 4, "end"],
  mcleodganj: [-12, 4, "end"],
  triund: [12, 4, "start"],
  dwarka: [6, 20, "start"],
  jamnagar: [8, -10, "start"],
  varanasi: [10, 4, "start"],
  mysuru: [10, 4, "start"],
};

const noop = () => () => {};

export function TravelMap() {
  // Geometry is computed in the browser only: float output differs slightly between Node and browsers.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [sel, setSel] = useState<Place | null>(null);
  const [count, setCount] = useState(0);

  const { path, dots, proj } = useMemo(() => {
    const geo = india as unknown as GeoPermissibleObjects;
    const proj = geoMercator().fitExtent([[44, 20], [W - 20, H - 20]], geo);
    const path = geoPath(proj)(geo) ?? "";
    // Dot-matrix fill of the country.
    const dots: [number, number][] = [];
    for (let x = 0; x < W; x += 9)
      for (let y = 0; y < H; y += 9) {
        const ll = proj.invert?.([x, y]);
        if (ll && geoContains(geo, ll)) dots.push([x, y]);
      }
    return { path, dots, proj };
  }, []);

  const P = (p: { lat: number; lon: number }) => proj([p.lon, p.lat]) as [number, number];
  // Dharamshala, McLeod Ganj and Triund are a few km apart: fan their markers out around the
  // real spot (with leader lines) so each one can be hovered and tapped on its own.
  const FAN: Record<string, [number, number]> = { dharamshala: [-34, 22], mcleodganj: [-40, -14], triund: [26, -22] };
  const D = (p: Place): [number, number] => {
    const [x, y] = P(p);
    const f = FAN[p.id];
    return f ? [x + f[0], y + f[1]] : [x, y];
  };
  const h = P(home);
  const arc = (p: Place) => {
    const [x, y] = D(p);
    const mx = (h[0] + x) / 2, my = (h[1] + y) / 2;
    const dx = x - h[0], dy = y - h[1];
    const len = Math.hypot(dx, dy);
    const bend = Math.min(90, len * 0.35);
    return `M${h[0]},${h[1]} Q${mx - (dy / len) * bend},${my + (dx / len) * bend} ${x},${y}`;
  };

  const total = Math.round(places.reduce((s, p) => s + km(home, p) * 2, 0));

  useEffect(() => {
    if (!inView) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / 2200);
      setCount(Math.round(total * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, total]);

  return (
    <div ref={ref} className="glass relative overflow-hidden rounded-3xl border hairline">
      <div className="flex flex-wrap items-end justify-between gap-3 p-6 pb-0 sm:p-8 sm:pb-0">
        <div>
          <p className="eyebrow">Solo travel · {places.length} places, one backpack</p>
          <p className="mt-2 font-display text-3xl font-semibold tabular-nums">
            {count.toLocaleString("en-IN")} <span className="text-base font-normal text-muted">km of round trips from home</span>
          </p>
        </div>
        <p className="font-mono text-[11px] text-faint">tap a place</p>
      </div>

      {mounted ? (
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block w-full max-w-[560px]" role="img" aria-label="Map of India with solo trips from Hyderabad">
        <defs>
          <linearGradient id="route" x1="0" x2="1">
            <stop offset="0" stopColor="#22D3EE" />
            <stop offset="0.5" stopColor="#A78BFA" />
            <stop offset="1" stopColor="#F472B6" />
          </linearGradient>
          <radialGradient id="glow">
            <stop offset="0" stopColor="#FBBF24" stopOpacity="0.9" />
            <stop offset="1" stopColor="#FBBF24" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d={path} fill="rgba(167,139,250,0.04)" style={{ stroke: "rgb(var(--ink-rgb) / 0.12)" }} strokeWidth="1" />
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.1} style={{ fill: "rgb(var(--ink-rgb) / 0.16)" }} />
        ))}

        {places.map((p, i) => (
          <g key={p.id}>
            <motion.path
              d={arc(p)}
              fill="none"
              stroke="url(#route)"
              strokeWidth={sel?.id === p.id ? 2.4 : 1.4}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: sel && sel.id !== p.id ? 0.25 : 0.9 } : {}}
              transition={{ duration: 1.4, delay: 0.3 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* A traveller dot that keeps walking each route */}
            {inView && (
              <circle r={2.6} style={{ fill: "var(--ink)" }}>
                <animateMotion dur={`${4 + i * 0.7}s`} begin={`${1.8 + i * 0.3}s`} repeatCount="indefinite" path={arc(p)} />
              </circle>
            )}
          </g>
        ))}

        {/* "Next?" — trips still to come */}
        <g>
          <circle cx={W - 70} cy={H - 110} r={10} fill="none" stroke="#FBBF24" strokeDasharray="3 3">
            <animateTransform attributeName="transform" type="rotate" from={`0 ${W - 70} ${H - 110}`} to={`360 ${W - 70} ${H - 110}`} dur="10s" repeatCount="indefinite" />
          </circle>
          <path d={`M${h[0]},${h[1]} Q${(h[0] + W - 70) / 2 + 30},${h[1] + 20} ${W - 70},${H - 110}`} fill="none" stroke="#FBBF24" strokeOpacity="0.5" strokeDasharray="2 6" />
          <text x={W - 70} y={H - 82} textAnchor="middle" fill="#FBBF24" fontSize="12" fontFamily="var(--font-mono)">next?</text>
        </g>

        {/* Home */}
        <circle cx={h[0]} cy={h[1]} r={22} fill="url(#glow)" />
        <circle cx={h[0]} cy={h[1]} r={5} fill="#FBBF24" />
        <text x={h[0] + 10} y={h[1] + 20} style={{ fill: "var(--text)" }} fontSize="13" fontWeight={600}>Hyderabad · home</text>

        {/* Himachal: the real spot, with leader lines to the fanned-out markers */}
        {(() => {
          const real = P(places.find((p) => p.id === "mcleodganj")!);
          return (
            <g>
              <circle cx={real[0]} cy={real[1]} r={3} style={{ fill: "var(--ink)" }} opacity={0.6} />
              {places.filter((p) => FAN[p.id]).map((p) => {
                const [x, y] = D(p);
                return <line key={p.id} x1={real[0]} y1={real[1]} x2={x} y2={y} stroke="#F472B6" strokeOpacity={0.45} strokeDasharray="2 3" />;
              })}
            </g>
          );
        })()}

        {places.map((p, i) => {
          const [x, y] = D(p);
          const [ox, oy, anchor] = labelOffset[p.id] ?? [10, 4, "start"];
          const on = sel?.id === p.id;
          return (
            <motion.g
              key={p.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.2 + i * 0.18, type: "spring", stiffness: 300, damping: 18 }}
              style={{ transformOrigin: `${x}px ${y}px`, cursor: "pointer" }}
              onClick={() => setSel(p)}
              onMouseEnter={() => setSel(p)}
            >
              <circle cx={x} cy={y} r={13} fill="transparent" />
              <circle cx={x} cy={y} r={on ? 7 : 5} fill="#F472B6" style={{ stroke: "var(--ink)" }} strokeWidth={on ? 2 : 1} />
              <circle cx={x} cy={y} r={11} fill="none" stroke="#F472B6" strokeOpacity={0.5}>
                <animate attributeName="r" values="6;16;6" dur="2.6s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="2.6s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
              </circle>
              <text x={x + ox} y={y + oy} textAnchor={anchor} style={{ fill: on ? "var(--text)" : "var(--muted)" }} fontSize="12" fontWeight={on ? 600 : 400}>
                {p.name}
              </text>
            </motion.g>
          );
        })}
      </svg>
      ) : (
        <div className="mx-auto aspect-[560/620] w-full max-w-[560px]" />
      )}

      <div className="min-h-[104px] border-t hairline px-6 py-5 sm:px-8">
        <AnimatePresence initial={false}>
          {sel ? (
            <motion.div key={sel.id} initial={{ opacity: 0.4, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
              <p className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-display text-xl font-semibold">{sel.name}</span>
                <span className="font-mono text-xs text-muted">{sel.region} · {Math.round(km(home, sel)).toLocaleString("en-IN")} km from home</span>
              </p>
              <p className="mt-1.5 text-text/85">{sel.note}</p>
            </motion.div>
          ) : (
            <motion.p key="none" initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="text-muted">
              Every trip so far was solo. Hover or tap a place. Many more to come.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
