"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { INTRO_SECONDS, shouldPlayIntro } from "@/lib/cine";

// Cinema bars + opening credits for the fly-in. They retract when the shot lands or the visitor scrolls.
export function Letterbox() {
  const [on, setOn] = useState(false);

  // Hide the nav while the bars are up, so the frame reads as pure cinema.
  useEffect(() => {
    document.documentElement.classList.toggle("cine-intro", on);
  }, [on]);

  useEffect(() => {
    let fallback: ReturnType<typeof setTimeout> | undefined;
    let preroll: ReturnType<typeof setTimeout> | undefined;
    // Pre-roll: bars go up immediately while WebGL warms up, so the wait reads as intentional.
    if (shouldPlayIntro()) {
      preroll = setTimeout(() => setOn(true), 0);
      fallback = setTimeout(() => setOn(false), 3500);
    }
    const start = () => {
      clearTimeout(fallback);
      setOn(true);
      fallback = setTimeout(() => setOn(false), (INTRO_SECONDS + 6) * 1000);
    };
    const end = () => setOn(false);
    window.addEventListener("cine:intro-start", start);
    window.addEventListener("cine:intro-end", end);
    return () => {
      clearTimeout(preroll);
      clearTimeout(fallback);
      window.removeEventListener("cine:intro-start", start);
      window.removeEventListener("cine:intro-end", end);
    };
  }, []);

  const bar = "fixed inset-x-0 z-[65] flex items-center justify-between bg-black px-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 sm:px-10";
  return (
    <AnimatePresence>
      {on && (
        <>
          <motion.div
            key="top"
            className={`${bar} top-0`}
            initial={{ height: "12vh" }}
            animate={{ height: "12vh" }}
            exit={{ height: 0, opacity: 0.6 }}
            transition={{ duration: 1.1, ease: [0.7, 0, 0.2, 1] }}
          >
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1.2 }}>
              T. Pavan Kumar
            </motion.span>
            <motion.span className="hidden sm:inline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1.2 }}>
              A story in seven chapters
            </motion.span>
          </motion.div>
          <motion.div
            key="bottom"
            className={`${bar} bottom-0`}
            initial={{ height: "12vh" }}
            animate={{ height: "12vh" }}
            exit={{ height: 0, opacity: 0.6 }}
            transition={{ duration: 1.1, ease: [0.7, 0, 0.2, 1] }}
          >
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1.2 }}>
              It all began with a big bang
            </motion.span>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.4, 1] }} transition={{ delay: 2.2, duration: 2 }}>
              Scroll to skip
            </motion.span>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
