import { toolkit } from "@/content/profile";
import { agentWork } from "@/content/projects";
import { AgentConsole } from "./AgentConsole";
import { Chapter } from "./Chapter";
import { Reveal } from "./Reveal";

export function Agents() {
  return (
    <Chapter
      id="agents"
      index="05"
      kicker="Agents & tooling"
      title={
        <>
          Shipping daily meant teaching the agents{" "}
          <em className="font-serif font-normal italic text-aurora">how we work.</em>
        </>
      }
      lede="Speed came from method, not shortcuts. I turned recurring lessons into skills and memory that coding agents load on demand, and built orchestrators where specialist agents plan, work in parallel and check each other before anything reaches a client."
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <Reveal>
          <ul className="divide-y divide-line border-y hairline">
            {agentWork.map((a) => (
              <li key={a.repo}>
                <a href={`https://github.com/pavankumart18/${a.repo}`} target="_blank" rel="noreferrer" className="group block py-4">
                  <p className="flex items-center justify-between font-medium">
                    <span className="transition-colors group-hover:text-[#FDBA74]">{a.name}</span>
                    <span className="text-faint transition group-hover:translate-x-0.5 group-hover:text-text">↗</span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{a.line}</p>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="lg:sticky lg:top-28 lg:self-start">
          <AgentConsole />
          <blockquote className="mt-6 border-l-2 border-[#FDBA74]/50 pl-4 text-sm leading-relaxed text-muted">
            “A demo is theatre with a technical core. It only has to work once, in front of one audience, and make one
            capability unmistakably obvious.”
            <span className="mt-2 block font-mono text-[11px] text-faint">— from client-demo-skills</span>
          </blockquote>
        </Reveal>
      </div>

      <Reveal className="mt-24">
        <p className="eyebrow mb-5">Toolkit</p>
        <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-3 group-hover:[animation-play-state:paused]">
            {[...toolkit, ...toolkit].map((t, i) => (
              <span key={i} className="glass rounded-full border border-ink/10 px-4 py-2 text-sm text-text/85 transition hover:border-ink/40 hover:text-text">
                {t}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </Chapter>
  );
}
