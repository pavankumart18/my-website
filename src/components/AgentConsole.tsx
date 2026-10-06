"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

// An illustrative replay of the multi-agent pattern from LLM-Cabinet / Agent Builder:
// plan → parallel specialists → synthesis → critique.
type Role =
  "Planner" | "Researcher" | "Engineer" | "Analyst" | "Synthesizer" | "Critic";

const script: { role: Role; text: string; ms: number }[] = [
  {
    role: "Planner",
    text: "Brief: who influences stroke-care adoption inside one health network?",
    ms: 900,
  },
  {
    role: "Planner",
    text: "Plan → 3 specialists in parallel, then synthesise and critique.",
    ms: 900,
  },
  {
    role: "Researcher",
    text: "Mapping the stakeholders and the decisions they own…",
    ms: 700,
  },
  {
    role: "Engineer",
    text: "Profiling 6 sources · resolving identities across HCP masters…",
    ms: 700,
  },
  {
    role: "Analyst",
    text: "Building influence edges from referrals & affiliations…",
    ms: 1100,
  },
  { role: "Engineer", text: "✓ 820 HCPs resolved · 3,108 edges", ms: 700 },
  {
    role: "Analyst",
    text: "✓ 4 high-influence clinicians surfaced, with evidence",
    ms: 900,
  },
  {
    role: "Synthesizer",
    text: "Drafting a one-glance answer + network view for the launch lead",
    ms: 1100,
  },
  {
    role: "Critic",
    text: "Check: every claim traces to a source row? → yes. Ship it.",
    ms: 1400,
  },
];

const parallel: Role[] = ["Researcher", "Engineer", "Analyst"];

function Node({
  r,
  current,
  done,
  visited,
}: {
  r: Role;
  current?: Role;
  done: boolean;
  visited: Set<Role>;
}) {
  return (
    <div
      className={`rounded-lg border px-2.5 py-1.5 text-center font-mono text-[11px] transition-all duration-500 ${
        current === r && !done
          ? "border-[#FDBA74] bg-[#FDBA74]/10 text-[#FDBA74] shadow-[0_0_24px_-6px_#FDBA74]"
          : visited.has(r)
            ? "border-line-strong text-text"
            : "border-line text-faint"
      }`}
    >
      {r}
    </div>
  );
}

export function AgentConsole() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-120px" });
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (inView) started.current = true;
    if (!started.current || step >= script.length) return;
    const t = setTimeout(
      () => setStep((s) => s + 1),
      step === 0 ? 400 : script[step - 1].ms,
    );
    return () => clearTimeout(t);
  }, [inView, step, run]);

  const shown = script.slice(0, step);
  const current = shown.at(-1)?.role;
  const done = step >= script.length;
  const visited = new Set(shown.map((s) => s.role));
  const state = { current, done, visited };

  return (
    <div
      ref={ref}
      className="screen-dark overflow-hidden rounded-2xl border hairline bg-[#0a0b0f]"
    >
      <div className="flex items-center justify-between border-b hairline px-4 py-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-full bg-ink/10" />
          ))}
        </div>
        <p className="font-mono text-[11px] text-muted">
          cabinet · illustrative replay
        </p>
        <button
          onClick={() => {
            setStep(0);
            setRun((r) => r + 1);
            started.current = true;
          }}
          className="font-mono text-[11px] text-muted hover:text-text"
        >
          ↻ replay
        </button>
      </div>

      <div className="flex flex-col items-center gap-2 border-b hairline px-4 py-5">
        <Node r="Planner" {...state} />
        <div className="h-3 w-px bg-line-strong" />
        <div className="grid w-full max-w-sm grid-cols-3 gap-2">
          {parallel.map((r) => (
            <Node key={r} r={r} {...state} />
          ))}
        </div>
        <div className="h-3 w-px bg-line-strong" />
        <div className="flex gap-2">
          <Node r="Synthesizer" {...state} />
          <span className="self-center text-faint">→</span>
          <Node r="Critic" {...state} />
        </div>
      </div>

      <ol className="min-h-[23rem] space-y-2 p-4 font-mono text-[12px] leading-relaxed">
        <AnimatePresence initial={false}>
          {shown.map((s, i) => (
            <motion.li
              key={`${run}-${i}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <span className="w-24 flex-none text-[#FDBA74]/80">
                {s.role.toLowerCase()}
              </span>
              <span
                className={
                  s.text.startsWith("✓") ? "text-live" : "text-text/85"
                }
              >
                {s.text}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
        {!done && (
          <li className="flex gap-3">
            <span className="w-24" />
            <span className="inline-block h-3.5 w-1.5 animate-pulse bg-text/60" />
          </li>
        )}
      </ol>
    </div>
  );
}
