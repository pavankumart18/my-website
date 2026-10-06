"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { scenarios } from "@/content/profile";
import { bus } from "@/lib/bus";

const STAGES = ["AI firewall", "Risk engine", "Server-side gate", "Route"] as const;
const bandColor = { low: "#34D399", moderate: "#FBBF24", high: "#F472B6" } as const;

// Illustrative walk-through of Anshap's safety pipeline for three preset messages.
export function NoaDecides() {
  const [pick, setPick] = useState(0);
  const [stage, setStage] = useState(0);
  const [run, setRun] = useState(0);
  const s = scenarios[pick];

  useEffect(() => {
    if (stage >= STAGES.length) return;
    const t = setTimeout(() => setStage((v) => v + 1), stage === 0 ? 350 : 750);
    return () => clearTimeout(t);
  }, [stage, run]);

  useEffect(() => {
    if (stage === STAGES.length) bus.set({ shield: s.shield, noaPulse: Date.now() });
  }, [stage, s.shield]);

  const choose = (k: number) => {
    setPick(k);
    setStage(0);
    setRun((r) => r + 1);
  };

  const done = stage >= STAGES.length;

  return (
    <div className="glass overflow-hidden rounded-3xl border hairline">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b hairline px-6 py-4 sm:px-8">
        <div>
          <p className="eyebrow">Interactive · how Noa decides</p>
          <p className="mt-1 text-sm text-muted">Pick a message and watch it move through the safety pipeline.</p>
        </div>
        <span className="rounded-full border border-ink/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-faint">Illustrative · not the production model</span>
      </div>

      <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3 border-b hairline p-6 sm:p-8 lg:border-b-0 lg:border-r">
          {scenarios.map((sc, k) => (
            <button
              key={sc.label}
              onClick={() => choose(k)}
              className={`block w-full rounded-2xl border p-4 text-left transition ${
                k === pick ? "border-ink/30 bg-ink/[0.07]" : "border-ink/[0.06] hover:border-ink/20 hover:bg-ink/[0.03]"
              }`}
            >
              <span className="flex items-center gap-2 text-xs text-muted">
                <span className="h-2 w-2 rounded-full" style={{ background: bandColor[sc.band] }} />
                {sc.label}
              </span>
              <span className="mt-2 block text-[15px] leading-snug">“{sc.message}”</span>
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8">
          <ol className="grid grid-cols-4 gap-2">
            {STAGES.map((st, k) => {
              const active = k < stage;
              return (
                <li key={st} className="relative">
                  <div className="h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
                    <motion.div
                      key={`${run}-${k}`}
                      className="h-full rounded-full"
                      style={{ background: k === 3 ? bandColor[s.band] : "linear-gradient(90deg,#22D3EE,#A78BFA)" }}
                      initial={{ width: 0 }}
                      animate={{ width: active ? "100%" : 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                  <p className={`mt-2 text-[11px] leading-tight sm:text-xs ${active ? "text-text" : "text-faint"}`}>{st}</p>
                </li>
              );
            })}
          </ol>

          <div className="mt-8 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="relative mx-auto h-32 w-32">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" style={{ stroke: "rgb(var(--ink-rgb) / 0.07)" }} strokeWidth="8" />
                <motion.circle
                  key={run}
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={bandColor[s.band]}
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: stage >= 2 ? s.risk : 0 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  style={{ filter: `drop-shadow(0 0 6px ${bandColor[s.band]})` }}
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-faint">risk band</p>
                  <p className="font-display text-lg font-semibold capitalize" style={{ color: stage >= 2 ? bandColor[s.band] : undefined }}>
                    {stage >= 2 ? s.band : "…"}
                  </p>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {done ? (
                <motion.div key={`r${run}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <p className="eyebrow">Decision</p>
                  <p className="mt-2 font-display text-2xl font-semibold" style={{ color: bandColor[s.band] }}>{s.route}</p>
                  <p className="mt-2 leading-relaxed text-text/85">{s.routeLine}</p>
                </motion.div>
              ) : (
                <motion.p key={`w${run}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-mono text-sm text-muted">
                  {stage === 0 ? "Screening the message…" : stage === 1 ? "Message is clean. Scoring risk…" : "Checking the server-side gate…"}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {done && s.band === "high" && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 rounded-xl border border-[#F472B6]/30 bg-[#F472B6]/[0.06] px-4 py-3 text-sm text-text/85">
              If you or someone you know is struggling right now, in India you can call <strong>Tele-MANAS on 14416</strong>, free and 24/7.
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
