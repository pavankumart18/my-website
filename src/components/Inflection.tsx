"use client";

import { motion, useInView } from "motion/react";
import { useMemo, useRef, useState } from "react";
import snapshot from "@/content/snapshot.json";
import { monthLabel } from "@/lib/dates";
import { useGitHub } from "@/lib/github";
import { useMounted } from "@/lib/useMounted";
import { Chapter } from "./Chapter";
import { CountUp } from "./fx/CountUp";
import { Reveal } from "./Reveal";

const PIVOT = "2025-09";

function monthsBetween(start: string, end: string) {
  const out: string[] = [];
  let [y, m] = start.split("-").map(Number);
  const [ey, em] = end.split("-").map(Number);
  while (y < ey || (y === ey && m <= em)) {
    out.push(`${y}-${String(m).padStart(2, "0")}`);
    if (++m > 12) { m = 1; y++; }
  }
  return out;
}

const fmt = (k: string) =>
  monthLabel(k);

export function Inflection() {
  const gh = useGitHub();
  const mounted = useMounted();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [hover, setHover] = useState<number | null>(null);

  const { months, max, before, after, beforeSpan, afterSpan } = useMemo(() => {
    const keys = Object.keys(gh.monthly).sort();
    // Server: end at the snapshot month. Browser (after hydration): extend to the current month.
    const now = mounted ? new Date() : new Date(snapshot.generatedAt);
    const end = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const months = monthsBetween(keys[0] ?? "2024-02", end).map((k) => ({ k, n: gh.monthly[k] || 0 }));
    const pre = months.filter((m) => m.k < PIVOT);
    const post = months.filter((m) => m.k >= PIVOT);
    return {
      months,
      max: Math.max(...months.map((m) => m.n), 1),
      before: pre.reduce((s, m) => s + m.n, 0),
      after: post.reduce((s, m) => s + m.n, 0),
      beforeSpan: pre.length,
      afterSpan: post.length,
    };
  }, [gh.monthly, mounted]);

  const W = 1000, H = 320, pad = { l: 8, r: 8, t: 30, b: 34 };
  const bw = (W - pad.l - pad.r) / months.length;
  const pivotIdx = months.findIndex((m) => m.k >= PIVOT);
  const y = (n: number) => pad.t + (H - pad.t - pad.b) * (1 - n / max);
  const rate = (n: number, span: number) => (span ? (n / span).toFixed(1) : "0");

  return (
    <Chapter
      id="inflection"
      index="02"
      kicker="Straive · Data Science Engineer"
      title={
        <>
          Then the pace <em className="font-serif font-normal italic text-aurora">changed.</em>
        </>
      }
      lede="In September 2025 I joined Straive on a mentorship-driven team that shipped a client-facing AI demo almost every day, using coding agents. The work stopped being coursework and started having stakeholders, deadlines and real data. In July 2026 I was promoted from Associate to Data Science Engineer, in under a year."
    >
      <div ref={ref} className="rounded-2xl border hairline glass p-4 sm:p-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">New repositories per month</p>
            <p className="mt-1 text-sm text-muted">
              {gh.status === "live" ? "Live from the GitHub API" : "GitHub snapshot"} · forks excluded · hover a bar
            </p>
          </div>
          <p className="h-5 font-mono text-sm tabular-nums">
            {hover !== null ? (
              <>
                <span className="text-muted">{fmt(months[hover].k)}</span> · {months[hover].n} new
              </>
            ) : null}
          </p>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Bar chart of new repositories per month, rising sharply from September 2025">
          <defs>
            <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="60%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#F472B6" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <line key={f} x1={pad.l} x2={W - pad.r} y1={y(max * f)} y2={y(max * f)} style={{ stroke: "rgb(var(--ink-rgb) / 0.05)" }} />
          ))}
          {pivotIdx >= 0 && (
            <g>
              <rect x={pad.l + pivotIdx * bw} y={pad.t - 20} width={W - pad.r - (pad.l + pivotIdx * bw)} height={H - pad.t - pad.b + 20} fill="rgba(167,139,250,0.06)" />
              <line x1={pad.l + pivotIdx * bw} x2={pad.l + pivotIdx * bw} y1={pad.t - 20} y2={H - pad.b} stroke="rgba(167,139,250,0.6)" strokeDasharray="3 4" />
              <text x={pad.l + pivotIdx * bw + 8} y={pad.t - 6} fill="#A78BFA" fontSize="12" fontFamily="var(--font-mono)">
                STRAIVE · CLIENT AI DELIVERY →
              </text>
              <text x={pad.l + 4} y={pad.t - 6} style={{ fill: "var(--faint)" }} fontSize="12" fontFamily="var(--font-mono)">
                LEARNING BY BUILDING
              </text>
            </g>
          )}
          {months.map((m, i) => {
            const h = H - pad.b - y(m.n);
            const post = m.k >= PIVOT;
            return (
              <g key={m.k} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                <rect x={pad.l + i * bw} y={pad.t} width={bw} height={H - pad.t - pad.b} fill="transparent" />
                <motion.rect
                  x={pad.l + i * bw + bw * 0.18}
                  width={bw * 0.64}
                  rx={2}
                  fill={post ? (hover === i ? "var(--ink)" : "url(#barGrad)") : hover === i ? "var(--muted)" : "rgb(var(--ink-rgb) / 0.22)"}
                  initial={{ height: 0, y: H - pad.b }}
                  animate={inView ? { height: h, y: y(m.n) } : {}}
                  transition={{ duration: 0.9, delay: 0.2 + i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                />
                {(m.k.endsWith("-01") || i === 0) && (
                  <text x={pad.l + i * bw} y={H - 12} style={{ fill: "var(--faint)" }} fontSize="11" fontFamily="var(--font-mono)">
                    {m.k.slice(0, 4)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border hairline bg-line sm:grid-cols-3">
        {[
          [String(before), `repos in ${beforeSpan} months of university building`],
          [String(after), `repos in ${afterSpan} months at Straive pace`],
          [`${rate(after, afterSpan)}/mo`, `new repos a month now, up from ${rate(before, beforeSpan)}`],
        ].map(([v, l], i) => (
          <Reveal key={l} delay={i * 0.08} className="glass p-6">
            <p className={`font-display text-4xl font-semibold tabular-nums ${i === 2 ? "text-accent" : ""}`}><CountUp key={v} value={v} /></p>
            <p className="mt-2 text-sm text-muted">{l}</p>
          </Reveal>
        ))}
      </div>
    </Chapter>
  );
}
