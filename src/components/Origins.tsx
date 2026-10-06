import { certs, earlyProjects } from "@/content/profile";
import { asset } from "@/lib/asset";
import { Chapter } from "./Chapter";
import { Reveal } from "./Reveal";
import { SeatDemo } from "./SeatDemo";

export function Origins() {
  return (
    <Chapter
      id="origins"
      index="01"
      kicker="Origins · CBIT, Hyderabad"
      title={
        <>
          It started with a degree in AI & Data Science, and a habit of{" "}
          <em className="font-serif font-normal italic text-aurora">building</em> to learn.
        </>
      }
      lede="At Chaitanya Bharathi Institute of Technology I learned more from shipping small things than from any single course: a news summariser on the MERN stack, a face-shape classifier, climate trend analysis, study tools for my classmates. Each one taught me how a model meets a real user."
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        <Reveal>
          <ul className="divide-y divide-line border-y hairline">
            {earlyProjects.map((p) => (
              <li key={p.repo}>
                <a
                  href={`https://github.com/pavankumart18/${p.repo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-baseline justify-between gap-6 py-4"
                >
                  <div>
                    <p className="font-medium transition-colors group-hover:text-accent">{p.name}</p>
                    <p className="mt-1 text-sm text-muted">{p.line}</p>
                  </div>
                  <span className="flex-none font-mono text-[11px] text-faint">{p.stack}</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <SeatDemo />
        </Reveal>
      </div>

      <Reveal className="mt-24">
        <p className="eyebrow mb-6">Foundations · certifications</p>
        <div className="grid gap-px overflow-hidden rounded-2xl border hairline bg-line sm:grid-cols-2 lg:grid-cols-4">
          {certs.map((c) => (
            <div key={c.title} className="group glass p-6 transition-colors hover:bg-surface-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(c.image)} alt="" loading="lazy" className="h-9 w-9 rounded-md object-contain opacity-80 grayscale transition group-hover:opacity-100 group-hover:grayscale-0" />
              <p className="mt-5 text-xs text-muted">{c.issuer}</p>
              <p className="mt-1 font-medium">{c.title}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-muted">
                {c.points.map((pt) => (
                  <li key={pt} className="flex gap-2">
                    <span className="mt-2 h-px w-2 flex-none bg-faint" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </Chapter>
  );
}
