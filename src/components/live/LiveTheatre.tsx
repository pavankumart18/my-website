"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const SHOWS = [
  { id: "noa", label: "Noa · Anshap", url: "https://chat.anshap.com", note: "The real product. An anonymous preview chat with Noa.", accent: "#5EEAD4" },
  { id: "hcp", label: "HCP Network", url: "https://pavankumart18.github.io/hcp-network-intelligence-workbench/", note: "Pharma launch network intelligence (synthetic data).", accent: "#6EE7B7" },
  { id: "triage", label: "Clearing Triage", url: "https://pavankumart18.github.io/clearing-triage/", note: "Shadow-mode AI triage for university clearing.", accent: "#93C5FD" },
  { id: "ocr", label: "OCR Benchmark", url: "https://pavankumart18.github.io/ocr-benchmark-analysis/", note: "8 models × 50 financial documents, judged.", accent: "#C4B5FD" },
  { id: "weld", label: "WeldAssign AI", url: "https://pavankumart18.github.io/wps-nuclear-demo/", note: "Explainable welder assignment for a nuclear site.", accent: "#FCD34D" },
  { id: "f1", label: "The Pit Wall", url: "https://f1-rose.vercel.app", note: "An editorial F1 dashboard with live race telemetry.", accent: "#F9A8D4" },
];

// Real, running software inside the page. Nothing loads until the visitor asks.
export function LiveTheatre() {
  const [sel, setSel] = useState(0);
  const [launched, setLaunched] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const show = SHOWS[sel];
  const on = launched[show.id];

  return (
    <div className="glass min-w-0 max-w-full overflow-hidden rounded-3xl border hairline">
      <div className="flex gap-2 overflow-x-auto border-b hairline p-3 [scrollbar-width:none]">
        {SHOWS.map((s, k) => (
          <button
            key={s.id}
            onClick={() => setSel(k)}
            className={`flex flex-none items-center gap-2 rounded-full px-3.5 py-1.5 text-sm transition ${
              k === sel ? "bg-ink/[0.1] text-text" : "text-muted hover:text-text"
            }`}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: s.accent }} />
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 border-b hairline bg-ink/[0.04] px-4 py-2.5">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-full bg-ink/10" />
          ))}
        </div>
        <span className="min-w-0 flex-1 truncate rounded-md bg-ink/[0.05] px-3 py-1 font-mono text-[11px] text-muted">{show.url.replace("https://", "")}</span>
        <a href={show.url} target="_blank" rel="noreferrer" className="flex-none font-mono text-[11px] text-muted hover:text-text">open ↗</a>
      </div>

      <div className="screen-dark relative aspect-[4/5] w-full bg-[#06070d] sm:aspect-[16/10]">
        {on && !loaded[show.id] && (
          <div className="absolute inset-0 grid place-items-center">
            <p className="flex items-center gap-3 font-mono text-xs text-muted">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/20 border-t-white/80" />
              Connecting to {show.url.replace("https://", "").split("/")[0]}…
            </p>
          </div>
        )}
        <AnimatePresence mode="wait">
          {on ? (
            <motion.iframe
              key={show.id}
              src={show.url}
              title={show.label}
              onLoad={() => setLoaded((l) => ({ ...l, [show.id]: true }))}
              initial={{ opacity: 0 }}
              animate={{ opacity: loaded[show.id] ? 1 : 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 h-full w-full"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          ) : (
            <motion.div key={`${show.id}-idle`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 grid place-items-center p-6 text-center">
              <div
                aria-hidden
                className="absolute inset-0 opacity-40"
                style={{ background: `radial-gradient(50% 50% at 50% 50%, ${show.accent}33, transparent 70%)` }}
              />
              <div className="relative">
                <p className="eyebrow">Live · running right now</p>
                <p className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{show.label}</p>
                <p className="mx-auto mt-2 max-w-sm text-muted">{show.note}</p>
                <button
                  onClick={() => setLaunched((l) => ({ ...l, [show.id]: true }))}
                  className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-bg transition hover:brightness-110"
                  style={{ background: `linear-gradient(90deg, ${show.accent}, #F472B6)` }}
                >
                  ▶ Launch it here
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
