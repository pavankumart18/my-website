"use client";

import { anshap, profile } from "@/content/profile";
import { mapProjects } from "@/content/projects";
import { timeAgo, useGitHub, workRepos } from "@/lib/github";
import { useMounted } from "@/lib/useMounted";
import { CountUp } from "./fx/CountUp";

export function Hero() {
  const gh = useGitHub();
  const mounted = useMounted(); // relative times depend on "now": client only
  const latest = workRepos(gh.repos)[0];
  const liveDemos = mapProjects.filter((p) => p.live).length;
  const words = profile.headline.split(" ");

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col">
      <div className="relative flex flex-1 flex-col">
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 pt-24 sm:px-8">
        <div
          className="hero-rise glass mb-8 inline-flex w-fit items-center gap-2.5 rounded-full border border-ink/10 px-3.5 py-1.5 text-xs text-muted"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="live-dot" />
          {latest ? (
            <span>
              Latest public work · <span className="text-text">{latest.name}</span>
              {mounted && <> · {timeAgo(latest.pushed_at)}</>}
            </span>
          ) : (
            <span>{profile.location}</span>
          )}
        </div>

        <p
          className="hero-rise eyebrow mb-5 !text-text/70"
          style={{ animationDelay: "0.05s" }}
        >
          {profile.name} · {profile.location}
        </p>

        <h1 className="max-w-3xl font-display text-[2.7rem] font-semibold leading-[1.0] tracking-tight sm:text-6xl md:text-[5.2rem]">
          {words.map((w, i) => (
            <span
              key={i}
              className="hero-rise-word mr-[0.22em] inline-block"
              style={{ animationDelay: `${0.08 + i * 0.035}s` }}
            >
              {i >= words.length - 2 ? <em className="font-serif font-normal italic text-aurora">{w}</em> : w}
            </span>
          ))}
        </h1>

        <p
          className="hero-rise mt-8 max-w-xl text-lg leading-relaxed text-text/75"
          style={{ animationDelay: "0.35s" }}
        >
          {profile.intro}
        </p>

        <div
          className="hero-rise mt-10 flex flex-wrap gap-3"
          style={{ animationDelay: "0.45s" }}
        >
          <a href="#journey" className="rounded-full bg-gradient-to-r from-[#22D3EE] via-[#A78BFA] to-[#F472B6] px-5 py-2.5 text-sm font-medium text-bg transition hover:brightness-110">
            Begin the journey
          </a>
          <a href="#anshap" className="glass rounded-full border border-ink/15 px-5 py-2.5 text-sm transition hover:border-ink/40">
            Anshap →
          </a>
        </div>
      </div>

      <dl
        className="hero-rise relative mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-4 px-4 pb-10 pt-6 sm:grid-cols-4 sm:px-8"
        style={{ animationDelay: "0.55s" }}
      >
        {[
          [profile.straive.company, profile.straive.role],
          ["Anshap", anshap.role],
          [`${liveDemos}+`, "live AI demos"],
          [String(gh.total), "public repositories"],
        ].map(([v, l]) => (
          <div key={l} className="border-t border-ink/10 pt-3">
            <dt className="font-display text-xl font-semibold sm:text-2xl">{/\d/.test(v) ? <CountUp value={v} /> : v}</dt>
            <dd className="mt-1 text-xs text-muted">{l}</dd>
          </div>
        ))}
      </dl>
      <p
        className="hero-rise pointer-events-none absolute bottom-36 right-8 hidden max-w-[16rem] text-right font-mono text-[10px] leading-relaxed tracking-wider text-ink/40 lg:block"
        style={{ animationDelay: "1.2s" }}
      >
        EACH BRIGHT STAR IS ONE OF MY {gh.total} REPOSITORIES · SCROLL TO TRAVEL
      </p>
      </div>
    </section>
  );
}
