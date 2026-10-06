import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type Props = {
  id: string;
  index: string;
  kicker: string;
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
};

export function Chapter({ id, index, kicker, title, lede, children }: Props) {
  return (
    <section id={id} className="relative scroll-mt-20 border-t hairline">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-8 md:py-36">
        <Reveal>
          <div className="mb-6 flex items-center gap-4">
            <span className="font-mono text-xs text-accent">{index}</span>
            <span className="h-px w-10 bg-line-strong" />
            <span className="eyebrow">{kicker}</span>
          </div>
          <h2 className="max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl">
            {title}
          </h2>
          {lede && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted text-pretty">{lede}</p>}
        </Reveal>
        <div className="mt-14 md:mt-20">{children}</div>
      </div>
    </section>
  );
}
