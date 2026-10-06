"use client";

import { useEffect, useState } from "react";
import { anshapStory } from "@/content/profile";

type Check = { ms: number | null; ok: boolean | null };

// Pings each public Anshap surface from the visitor's own browser. `no-cors` gives an
// opaque response, which is enough to prove the host answered and to time the round trip.
async function ping(url: string): Promise<Check> {
  const t0 = performance.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    await fetch(`${url}/?_=${Date.now()}`, { mode: "no-cors", cache: "no-store", signal: ctrl.signal });
    return { ms: Math.round(performance.now() - t0), ok: true };
  } catch {
    return { ms: null, ok: false };
  } finally {
    clearTimeout(timer);
  }
}

export function StatusBoard({ compact = false }: { compact?: boolean }) {
  const [checks, setChecks] = useState<Record<string, Check>>({});
  const [at, setAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let alive = true;
    const run = async () => {
      const t0 = performance.now();
      const res = await Promise.all(anshapStory.status.map(async (s) => [s.name, await ping(s.url)] as const));
      if (!alive) return;
      console.info(`[status] ${res.length} surfaces checked in ${Math.round(performance.now() - t0)}ms`);
      setChecks(Object.fromEntries(res));
      setAt(Date.now());
    };
    // Wait until the page (and its 3D) has settled so timings reflect the network, not our own load.
    const first = setTimeout(run, 2500);
    const id = setInterval(run, 60_000);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      alive = false;
      clearTimeout(first);
      clearInterval(id);
      clearInterval(tick);
    };
  }, []);

  const up = Object.values(checks).filter((c) => c.ok).length;

  return (
    <div className={`glass rounded-3xl border hairline ${compact ? "p-5" : "p-6 sm:p-8"}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="eyebrow">Anshap systems · pinged from your browser</p>
        <p className="font-mono text-xs text-muted tabular-nums">
          {at ? `${up}/${anshapStory.status.length} up · checked ${Math.max(0, Math.round((now - at) / 1000))}s ago` : "checking…"}
        </p>
      </div>
      <ul className="mt-5 divide-y divide-ink/[0.06]">
        {anshapStory.status.map((s) => {
          const c = checks[s.name];
          const color = !c ? "#5b616c" : c.ok ? (c.ms! < 2000 ? "#4ADE80" : "#FBBF24") : "#F87171";
          return (
            <li key={s.name} className="flex items-center justify-between gap-4 py-3">
              <a href={s.url} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-3 hover:text-accent">
                <span className="relative flex h-2.5 w-2.5 flex-none">
                  {c?.ok && <span className="absolute inset-0 animate-ping rounded-full opacity-60" style={{ background: color }} />}
                  <span className="relative h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                </span>
                <span className="truncate text-sm">{s.name}</span>
              </a>
              <span className="flex-none font-mono text-xs tabular-nums text-muted">
                {!c ? "…" : c.ok ? `${c.ms} ms` : "unreachable"}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
