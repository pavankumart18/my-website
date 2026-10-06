import { profile } from "@/content/profile";
import { Reveal } from "./Reveal";

export function Contact() {
  const links = [
    ["Email", profile.email, `mailto:${profile.email}`],
    ["LinkedIn", "pavan-kumar", profile.linkedin],
    ["GitHub", profile.github, `https://github.com/${profile.github}`],
  ];
  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden border-t hairline">
      
      <div className="relative mx-auto max-w-6xl px-4 py-28 sm:px-8 md:py-40">
        <Reveal>
          <p className="eyebrow">Contact · so, what do you desire?</p>
          <h2 className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">
            Have a hard problem worth a <em className="font-serif font-normal italic text-aurora">working</em> answer?
          </h2>
          <p className="mt-6 max-w-xl text-lg text-muted">
            I&apos;m open to conversations about applied AI, AI safety, agentic systems, and building care that people can trust.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="ember mt-10 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#22D3EE] via-[#A78BFA] to-[#F472B6] px-6 py-3 font-medium text-bg transition"
          >
            Start a conversation <span aria-hidden>→</span>
          </a>
        </Reveal>
        <Reveal delay={0.1} className="mt-20 grid gap-px overflow-hidden rounded-2xl border hairline bg-line sm:grid-cols-3">
          {links.map(([k, v, href]) => (
            <a key={k} href={href} target="_blank" rel="noreferrer" className="group glass p-6 transition-colors hover:bg-ink/[0.06]">
              <p className="eyebrow">{k}</p>
              <p className="mt-2 truncate transition-colors group-hover:text-accent">{v} ↗</p>
            </a>
          ))}
        </Reveal>
      </div>
      <footer className="relative mx-auto flex max-w-6xl flex-wrap justify-between gap-4 border-t hairline px-4 py-8 text-xs text-faint sm:px-8">
        <span suppressHydrationWarning>Built with chemistry, not shortcuts · © {new Date().getFullYear()} {profile.name}</span>
        <span>Built with Next.js, React Three Fiber, Motion and live GitHub data</span>
      </footer>
    </section>
  );
}
