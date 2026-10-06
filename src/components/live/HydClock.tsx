"use client";

import { useEffect, useState } from "react";

const TZ = "Asia/Kolkata";

function istParts(d: Date) {
  const f = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short", hour12: false });
  const p = Object.fromEntries(f.formatToParts(d).map((x) => [x.type, x.value]));
  return { h: +p.hour % 24, m: +p.minute, s: +p.second, wd: p.weekday };
}

// A best guess, clearly labelled as one — not a tracker.
function guess(h: number, wd: string) {
  const weekend = wd === "Sat" || wd === "Sun";
  if (h >= 1 && h < 8) return { label: "probably asleep", color: "#60A5FA" };
  if (!weekend && h >= 10 && h < 19) return { label: "probably at Straive, shipping client AI", color: "#A78BFA" };
  return { label: "probably building Anshap", color: "#5EEAD4" };
}

const SEGMENTS = [
  { from: 1, to: 8, color: "#60A5FA", label: "Sleep" },
  { from: 10, to: 19, color: "#A78BFA", label: "Straive" },
  { from: 19, to: 25, color: "#5EEAD4", label: "Anshap" },
  { from: 8, to: 10, color: "#5EEAD4", label: "Anshap" },
];

const arc = (from: number, to: number, r: number) => {
  const a0 = (from / 24) * Math.PI * 2 - Math.PI / 2;
  const a1 = (to / 24) * Math.PI * 2 - Math.PI / 2;
  const large = to - from > 12 ? 1 : 0;
  return `M ${50 + r * Math.cos(a0)} ${50 + r * Math.sin(a0)} A ${r} ${r} 0 ${large} 1 ${50 + r * Math.cos(a1)} ${50 + r * Math.sin(a1)}`;
};

export function useIST() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // First tick deferred so server and client render the same placeholder.
    const first = setTimeout(() => setNow(new Date()), 0);
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return now;
}

export function HydTime() {
  const now = useIST();
  if (!now) return <span>Hyderabad</span>;
  const { h, m } = istParts(now);
  const hh = ((h + 11) % 12) + 1;
  return (
    <span className="tabular-nums">
      {hh}:{String(m).padStart(2, "0")} {h < 12 ? "AM" : "PM"}
    </span>
  );
}

export function HydClock() {
  const now = useIST();
  const p = now ? istParts(now) : { h: 0, m: 0, s: 0, wd: "Mon" };
  const g = guess(p.h, p.wd);
  const frac = (p.h + p.m / 60 + p.s / 3600) / 24;
  const ang = frac * Math.PI * 2 - Math.PI / 2;

  return (
    <div className="glass flex h-full flex-col rounded-3xl border hairline p-6 sm:p-8">
      <p className="eyebrow">Hyderabad · IST</p>
      <div className="mt-4 flex items-center gap-6">
        <svg viewBox="0 0 100 100" className="h-36 w-36 flex-none" aria-hidden>
          <circle cx="50" cy="50" r="40" fill="none" style={{ stroke: "rgb(var(--ink-rgb) / 0.06)" }} strokeWidth="7" />
          {SEGMENTS.map((s) => (
            <path key={`${s.from}`} d={arc(s.from, s.to, 40)} fill="none" stroke={s.color} strokeOpacity={0.55} strokeWidth="7" />
          ))}
          {now && (
            <>
              <line x1="50" y1="50" x2={50 + 34 * Math.cos(ang)} y2={50 + 34 * Math.sin(ang)} style={{ stroke: "var(--ink)" }} strokeWidth="1.6" strokeLinecap="round" />
              <circle cx={50 + 40 * Math.cos(ang)} cy={50 + 40 * Math.sin(ang)} r="4" fill={g.color} style={{ filter: `drop-shadow(0 0 4px ${g.color})` }} />
            </>
          )}
          <circle cx="50" cy="50" r="2.5" style={{ fill: "var(--ink)" }} />
          {[0, 6, 12, 18].map((hr) => {
            const a = (hr / 24) * Math.PI * 2 - Math.PI / 2;
            return (
              <text key={hr} x={50 + 27 * Math.cos(a)} y={50 + 27 * Math.sin(a) + 2} textAnchor="middle" fontSize="6" style={{ fill: "var(--muted)" }} fontFamily="var(--font-mono)">
                {hr}
              </text>
            );
          })}
        </svg>
        <div>
          <p className="font-display text-4xl font-semibold tabular-nums">
            {now ? `${String(p.h).padStart(2, "0")}:${String(p.m).padStart(2, "0")}` : "--:--"}
            <span className="text-xl text-muted">:{now ? String(p.s).padStart(2, "0") : "--"}</span>
          </p>
          <p className="mt-2 text-sm text-muted">{p.wd}</p>
          <p className="mt-3 flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full" style={{ background: g.color, boxShadow: `0 0 10px ${g.color}` }} />
            Pavan is {g.label}
          </p>
        </div>
      </div>
      <p className="mt-auto pt-6 text-xs text-faint">A typical day, roughly. My best guess, not a tracker.</p>
    </div>
  );
}
