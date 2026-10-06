import { domains, featured } from "@/content/projects";
import { Chapter } from "./Chapter";
import { DomainGraph } from "./DomainGraph";
import { CountUp } from "./fx/CountUp";
import { Tilt } from "./fx/Tilt";
import { Reveal } from "./Reveal";

export function Work() {
  return (
    <Chapter
      id="work"
      index="03"
      kicker="Selected work · 2025 — now"
      title={
        <>
          Different industries. The same question:{" "}
          <em className="font-serif font-normal italic text-aurora">what would actually help?</em>
        </>
      }
      lede="Pharma launch teams, university admissions, nuclear maintenance, finance operations. Each engagement starts by learning how the people in the room make decisions, then building the smallest thing that makes the right capability unmistakable."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {featured.map((f, i) => (
          <Reveal key={f.repo} delay={(i % 2) * 0.08}>
            <Tilt className="h-full rounded-2xl">
            <article className="group relative flex h-full flex-col rounded-2xl border hairline glass p-6 transition duration-500 hover:border-line-strong hover:bg-surface-2 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-xs text-muted">
                  <span className="h-2 w-2 rounded-full" style={{ background: domains[f.domain].color }} />
                  {domains[f.domain].label}
                </span>
                {f.note && <span className="font-mono text-[10px] uppercase tracking-wider text-faint">{f.note}</span>}
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">{f.name}</h3>
              <dl className="mt-4 space-y-3 text-sm leading-relaxed">
                <div>
                  <dt className="eyebrow mb-1 !text-[10px]">Problem</dt>
                  <dd className="text-muted">{f.problem}</dd>
                </div>
                <div>
                  <dt className="eyebrow mb-1 !text-[10px]">What I built</dt>
                  <dd className="text-text/90">{f.built}</dd>
                </div>
              </dl>
              <div className="mt-auto pt-7">
                <div className="grid grid-cols-3 gap-4 border-t hairline pt-5">
                  {f.metrics.map((m) => (
                    <div key={m.label}>
                      <p className="font-display text-lg font-semibold tabular-nums sm:text-xl"><CountUp value={m.value} /></p>
                      <p className="mt-0.5 text-[11px] leading-snug text-muted">{m.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-4 text-sm">
                  {f.live && (
                    <a href={f.live} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                      Live demo ↗
                    </a>
                  )}
                  <a href={`https://github.com/pavankumart18/${f.repo}`} target="_blank" rel="noreferrer" className="text-muted hover:text-text">
                    Code ↗
                  </a>
                </div>
              </div>
            </article>
            </Tilt>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-24">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">The full map</p>
            <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">Everything since September 2025, by domain</h3>
          </div>
        </div>
        <DomainGraph />
      </Reveal>
    </Chapter>
  );
}
