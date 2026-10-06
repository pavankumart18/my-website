"use client";

import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { useEffect, useState } from "react";
import { anshapStory } from "@/content/profile";
import { asset } from "@/lib/asset";

// A fanned 3D deck of Anshap's store screens. Drag, click a side card, or use the arrows.
export function ScreenDeck() {
  const screens = anshapStory.screens;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = (d: number) => setI((v) => (v + d + screens.length) % screens.length);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go(1), 4200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, paused]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 50) go(info.offset.x < 0 ? 1 : -1);
  };

  return (
    <div
      className="relative select-none overflow-x-clip py-2 outline-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Anshap app screens"
    >
      <div className="relative mx-auto h-[440px] w-full max-w-[420px] [perspective:1400px] sm:h-[520px]">
        {screens.map((s, k) => {
          let off = k - i;
          if (off > screens.length / 2) off -= screens.length;
          if (off < -screens.length / 2) off += screens.length;
          const abs = Math.abs(off);
          return (
            <motion.div
              key={s.src}
              className="absolute left-1/2 top-0 h-full w-[200px] -ml-[100px] cursor-grab overflow-hidden rounded-[28px] border border-ink/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] active:cursor-grabbing sm:w-[240px] sm:-ml-[120px]"
              style={{ zIndex: 10 - abs, transformStyle: "preserve-3d" }}
              animate={{
                x: off * 120,
                rotateY: off * -28,
                scale: 1 - abs * 0.12,
                opacity: abs > 2 ? 0 : 1 - abs * 0.25,
                filter: `brightness(${1 - abs * 0.3})`,
              }}
              transition={{ type: "spring", stiffness: 180, damping: 24 }}
              drag={off === 0 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={onDragEnd}
              onClick={() => off !== 0 && setI(k)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(s.src)} alt={s.title} loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover object-top" />
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <button onClick={() => go(-1)} aria-label="Previous screen" className="glass grid h-10 w-10 place-items-center rounded-full border border-ink/10 hover:border-ink/40">←</button>
        <div className="min-w-0 flex-1 text-center">
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
              <p className="font-medium">{screens[i].title}</p>
              <p className="mt-0.5 text-sm text-muted">{screens[i].line}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-3 flex justify-center gap-1.5">
            {screens.map((s, k) => (
              <button
                key={s.src}
                aria-label={`Show ${s.title}`}
                onClick={() => setI(k)}
                className={`h-1.5 rounded-full transition-all ${k === i ? "w-6 bg-gradient-to-r from-[#FBBF24] to-[#F472B6]" : "w-1.5 bg-ink/25"}`}
              />
            ))}
          </div>
        </div>
        <button onClick={() => go(1)} aria-label="Next screen" className="glass grid h-10 w-10 place-items-center rounded-full border border-ink/10 hover:border-ink/40">→</button>
      </div>
    </div>
  );
}
