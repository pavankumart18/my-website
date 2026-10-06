"use client";

import { motion } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import { profile } from "@/content/profile";
import { snapshotDate, timeAgo, useGitHub, workRepos } from "@/lib/github";
import { useMounted } from "@/lib/useMounted";
import { Chapter } from "./Chapter";
import { HydClock, HydTime } from "./live/HydClock";
import { LiveTheatre } from "./live/LiveTheatre";
import { StatusBoard } from "./live/StatusBoard";
import { Reveal } from "./Reveal";

const WEEKS = 26;
const langColor: Record<string, string> = {
  JavaScript: "#FCD34D", HTML: "#FDBA74", Python: "#93C5FD", TypeScript: "#8AB4FF", "Jupyter Notebook": "#F9A8D4", "C++": "#C4B5FD",
};

export function Pulse() {
  const gh = useGitHub();
  const mounted = useMounted(); // the heatmap and "x ago" depend on today: client only
  const heat = useRef<HTMLDivElement>(null);
  // On narrow screens the heatmap scrolls; start at the most recent weeks.
  useEffect(() => {
    if (heat.current) heat.current.scrollLeft = heat.current.scrollWidth;
  }, [gh.repos]);

  const { cells, total, activeDays } = useMemo(() => {
    if (!mounted) return { cells: [] as { d: Date; n: number }[], total: 0, activeDays: 0 };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - (WEEKS * 7 - 1) - today.getDay());
    // GitHub's public events feed is often empty, so activity comes from the repos
    // themselves: the day each was created and the day it was last updated.
    const counts = new Map<string, number>();
    const bump = (iso: string) => {
      const k = new Date(iso).toDateString();
      counts.set(k, (counts.get(k) || 0) + 1);
    };
    for (const r of workRepos(gh.repos)) {
      bump(r.created_at);
      if (r.pushed_at.slice(0, 10) !== r.created_at.slice(0, 10)) bump(r.pushed_at);
    }
    for (const e of gh.events) if (!profile.ignoreRepos.some((n) => e.repo.name.endsWith(`/${n}`))) bump(e.created_at);
    const cells = Array.from({ length: (WEEKS + 1) * 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return { d, n: d > today ? -1 : counts.get(d.toDateString()) || 0 };
    });
    const inRange = cells.filter((c) => c.n > 0);
    return { cells, total: inRange.reduce((s, c) => s + c.n, 0), activeDays: inRange.length };
  }, [gh.repos, gh.events, mounted]);

  const recent = workRepos(gh.repos).slice(0, 6);
  const langs = useMemo(() => {
    const m: Record<string, number> = {};
    for (const r of gh.repos) if (r.language && !r.fork) m[r.language] = (m[r.language] || 0) + 1;
    const sum = Object.values(m).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([l, n]) => ({ l, pct: (n / sum) * 100 }));
  }, [gh.repos]);

  const shade = (n: number) =>
    n < 0 ? "transparent" : n === 0 ? "rgb(var(--ink-rgb) / 0.06)" : `rgba(74,222,128,${Math.min(0.25 + n * 0.12, 1)})`;

  return (
    <Chapter
      id="pulse"
      index="07"
      kicker="Right now"
      title={
        <>
          It&apos;s <em className="font-serif font-normal italic text-aurora"><HydTime /></em> in Hyderabad. Here&apos;s what&apos;s live.
        </>
      }
      lede="Nothing in this section is a screenshot. The clock ticks, the systems are pinged from your browser, the demos are the real running software, and GitHub is queried on load."
    >
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="min-w-0">
          <HydClock />
        </Reveal>
        <Reveal delay={0.08} className="min-w-0">
          <StatusBoard />
        </Reveal>
      </div>

      <Reveal className="mt-5 min-w-0">
        <LiveTheatre />
      </Reveal>

      <Reveal className="mb-5 mt-16 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Public GitHub</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Most of my 2026 work lives in private repositories: Anshap and client engagements. This is the public slice.
          </p>
        </div>
      </Reveal>
      <Reveal>
        <div className="mb-5 flex items-center gap-2.5 font-mono text-xs text-muted">
          {gh.status === "live" ? (
            <>
              <span className="live-dot" /> Live · GitHub API · {gh.fetchedMs != null ? `${gh.fetchedMs}ms` : "cached"}
            </>
          ) : gh.status === "loading" ? (
            <>Connecting to GitHub…</>
          ) : (
            <>GitHub is rate-limiting this browser, so this is the snapshot from {snapshotDate}. Live data returns shortly.</>
          )}
        </div>
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <Reveal className="min-w-0 rounded-2xl border hairline glass p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="eyebrow">Repository activity · last {WEEKS} weeks</p>
            <p className="font-mono text-xs text-muted tabular-nums">
              {total} updates · {activeDays} active days
            </p>
          </div>
          <div ref={heat} className="mt-6 overflow-x-auto">
            <div className="grid w-max grid-flow-col grid-rows-7 gap-1">
              {cells.map((c, i) => (
                <motion.span
                  key={i}
                  title={c.n >= 0 ? `${c.d.toDateString()} · ${c.n} repo updates` : undefined}
                  initial={{ opacity: 0, scale: 0.4 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.004, duration: 0.3 }}
                  className="h-3.5 w-3.5 rounded-[3px] sm:h-4 sm:w-4"
                  style={{ background: shade(c.n) }}
                />
              ))}
            </div>
          </div>

          <p className="eyebrow mt-10">Languages across repositories</p>
          <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-ink/5">
            {langs.map(({ l, pct }, i) => (
              <motion.span
                key={l}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                style={{ background: langColor[l] ?? "#5b616c" }}
              />
            ))}
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
            {langs.slice(0, 6).map(({ l, pct }) => (
              <li key={l} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: langColor[l] ?? "#5b616c" }} />
                {l} <span className="font-mono text-faint">{pct.toFixed(0)}%</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="min-w-0 rounded-2xl border hairline glass p-6 sm:p-8">
          <p className="eyebrow">Recently pushed</p>
          <ul className="mt-4 divide-y divide-line">
            {(recent.length ? recent : Array.from({ length: 6 }, () => null)).map((r, i) =>
              r ? (
                <li key={r.name}>
                  <a href={r.homepage || r.html_url} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-4 py-3.5">
                    <span className="min-w-0">
                      <span className="block truncate font-mono text-sm transition-colors group-hover:text-accent">{r.name}</span>
                      <span className="text-xs text-faint">{r.language ?? "—"}</span>
                    </span>
                    <span className="flex-none font-mono text-xs text-muted tabular-nums">{mounted ? timeAgo(r.pushed_at) : ""}</span>
                  </a>
                </li>
              ) : (
                <li key={i} className="py-3.5">
                  <span className="block h-4 w-2/3 animate-pulse rounded bg-ink/5" />
                </li>
              ),
            )}
          </ul>
          <a href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer" className="mt-6 inline-block text-sm text-accent hover:underline">
            All {gh.total} repositories ↗
          </a>
        </Reveal>
      </div>
    </Chapter>
  );
}
