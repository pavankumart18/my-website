import { anshap, anshapStory } from "@/content/profile";
import { asset } from "@/lib/asset";
import { NoaDecides } from "./anshap/NoaDecides";
import { SafetyLayers } from "./anshap/SafetyLayers";
import { ScreenDeck } from "./anshap/ScreenDeck";
import { WaysIn } from "./anshap/WaysIn";
import { Chapter } from "./Chapter";
import { Reveal } from "./Reveal";

function SubHead({ n, title, line }: { n: string; title: string; line?: string }) {
  return (
    <Reveal className="mb-8 mt-28 first:mt-0">
      <p className="font-mono text-xs text-[#FBBF24]">{n}</p>
      <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h3>
      {line && <p className="mt-3 max-w-2xl leading-relaxed text-muted">{line}</p>}
    </Reveal>
  );
}

export function Anshap() {
  return (
    <Chapter
      id="anshap"
      index="04"
      kicker={`Anshap · ${anshap.role}`}
      title={
        <>
          The front door to care, built by someone who <em className="font-serif font-normal italic text-aurora">needed one.</em>
        </>
      }
    >
      {/* The thesis, as a slow typographic reveal */}
      <div className="max-w-3xl space-y-3">
        {anshapStory.thesis.map((line, i) => (
          <Reveal key={i} delay={i * 0.15}>
            <p className={i === 1 ? "font-serif text-4xl italic text-aurora sm:text-5xl" : "text-xl leading-relaxed text-text/80 sm:text-2xl"}>{line}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12">
        <div className="glass flex max-w-3xl items-center gap-5 rounded-3xl border hairline p-5 sm:p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/anshap/icon.png")} alt="Anshap" loading="lazy" className="h-14 w-14 flex-none rounded-2xl bg-white p-1.5" />
          <p className="font-serif text-xl italic leading-snug text-text/90 sm:text-2xl">{anshap.founderLine}</p>
        </div>
      </Reveal>

      <SubHead n="4.1" title="What people actually get" line={anshap.noa} />
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <ScreenDeck />
        </Reveal>
        <Reveal delay={0.1}>
          <WaysIn />
          <ol className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {anshap.ladder.map(([step, line], i) => (
              <li key={step} className="glass rounded-2xl border hairline p-4">
                <span className="font-mono text-[10px] text-faint">STEP {i + 1}</span>
                <span className="mt-1 block font-medium">{step}</span>
                <span className="mt-1 block text-xs leading-snug text-muted">{line}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted">{anshap.northStar}</p>
        </Reveal>
      </div>

      <SubHead n="4.2" title="The hardest problem: knowing when to step aside" line="An AI buddy that never escalates is dangerous. One that escalates everything is useless. The product is the judgement in between." />
      <Reveal>
        <NoaDecides />
      </Reveal>

      <SubHead n="4.3" title="The safety architecture I engineered" line={`${anshap.safetyLine} Hover a layer to see it light up around Noa.`} />
      <Reveal>
        <SafetyLayers />
      </Reveal>
      <div id="anshap-hold" aria-hidden />

      <SubHead n="4.4" title="Built for three sides of care" />
      <div className="grid gap-5 md:grid-cols-3">
        {anshapStory.audiences.map((a, i) => (
          <Reveal key={a.who} delay={i * 0.08}>
            <div className="glass spot h-full rounded-3xl border hairline p-7">
              <span className="block h-1 w-10 rounded-full" style={{ background: a.color, boxShadow: `0 0 18px ${a.color}` }} />
              <p className="mt-5 font-display text-xl font-semibold">{a.who}</p>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                {a.points.map((pt) => (
                  <li key={pt} className="flex gap-2.5">
                    <span className="mt-[7px] h-1 w-1 flex-none rounded-full" style={{ background: a.color }} />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <SubHead n="4.5" title="What I run as CTO" />
      <Reveal className="grid gap-5 md:grid-cols-2">
        <div className="glass rounded-3xl border hairline p-7">
          <p className="eyebrow">Surfaces in production</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {anshap.surfaces.map((s) => (
              <span key={s} className="rounded-full border border-ink/10 bg-ink/[0.04] px-3 py-1 text-sm">{s}</span>
            ))}
          </div>
        </div>
        <div className="glass rounded-3xl border hairline p-7">
          <p className="eyebrow">Stack</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {anshap.stack.map((s) => (
              <span key={s} className="rounded-full border border-ink/10 bg-ink/[0.04] px-3 py-1 font-mono text-xs text-muted">{s}</span>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-12 flex flex-wrap gap-3">
        {anshapStory.links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className={
              l.primary
                ? "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FBBF24] via-[#F472B6] to-[#A78BFA] px-6 py-3 font-medium text-bg transition hover:brightness-110"
                : "glass inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm transition hover:border-ink/40"
            }
          >
            {l.label} <span aria-hidden>↗</span>
          </a>
        ))}
      </Reveal>
    </Chapter>
  );
}
