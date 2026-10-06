"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { anshapStory } from "@/content/profile";

const icon: Record<string, string> = { app: "▢", whatsapp: "◌", web: "◍" };

export function WaysIn() {
  const [sel, setSel] = useState(1);
  const w = anshapStory.waysIn[sel];
  return (
    <div className="glass rounded-3xl border hairline p-6 sm:p-8">
      <p className="eyebrow">Three ways in · same psychologists, same safety layer</p>
      <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-ink/[0.04] p-1.5">
        {anshapStory.waysIn.map((x, k) => (
          <button
            key={x.id}
            onClick={() => setSel(k)}
            className={`relative rounded-xl px-2 py-2.5 text-sm transition ${k === sel ? "text-bg" : "text-muted hover:text-text"}`}
          >
            {k === sel && (
              <motion.span layoutId="ways-pill" className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FBBF24] to-[#F472B6]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
            )}
            <span className="relative font-medium">
              <span aria-hidden className="mr-1.5 opacity-70">{icon[x.id]}</span>
              {x.label}
            </span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={w.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="mt-6">
          <p className="text-lg leading-relaxed">{w.line}</p>
          <p className="mt-2 font-mono text-xs text-muted">{w.note}</p>
          {w.id === "whatsapp" && <p className="mt-5 border-l-2 border-[#FBBF24]/60 pl-4 text-sm leading-relaxed text-muted">{anshapStory.whatsappWhy}</p>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
