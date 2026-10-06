"use client";

import { motion } from "motion/react";
import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";

const read = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");
const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
};

function apply(t: Theme) {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem("theme", t);
  } catch {}
}

/**
 * Switch theme with a circular reveal that grows from `origin` (the toggle), using the
 * View Transitions API. Browsers without it get a soft cross-fade of colours instead.
 */
export function setTheme(t: Theme, origin?: { x: number; y: number }) {
  const root = document.documentElement;
  if (root.dataset.theme === t) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };

  if (!doc.startViewTransition || reduce) {
    root.classList.add("theme-anim");
    apply(t);
    setTimeout(() => root.classList.remove("theme-anim"), 700);
    return;
  }

  const x = origin?.x ?? window.innerWidth - 80;
  const y = origin?.y ?? 32;
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  root.classList.add("theme-vt");
  const vt = doc.startViewTransition(() => apply(t));
  vt.ready
    .then(() => {
      const anim = root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 750, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
      );
      return anim.finished;
    })
    .catch(() => {})
    .finally(() => root.classList.remove("theme-vt"));
}

// Sun ⇄ moon: the moon's bite slides off and eight rays grow as it becomes the sun.
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, read, () => "dark" as Theme);
  const light = theme === "light";
  return (
    <button
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTheme(light ? "dark" : "light", { x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      aria-label={light ? "Switch to night sky" : "Switch to daylight"}
      className="group relative grid h-8 w-8 place-items-center rounded-full border border-ink/10 text-text transition hover:border-ink/30"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 overflow-visible">
        <mask id="moon-bite">
          <rect x="-4" y="-4" width="32" height="32" fill="white" />
          <motion.circle r="7" fill="black" animate={{ cx: light ? 30 : 17, cy: light ? -6 : 7 }} transition={{ type: "spring", stiffness: 260, damping: 22 }} />
        </mask>
        <motion.circle cx="12" cy="12" fill="currentColor" mask="url(#moon-bite)" animate={{ r: light ? 4.5 : 8 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} />
        <motion.g animate={{ rotate: light ? 0 : -90, opacity: light ? 1 : 0, scale: light ? 1 : 0.4 }} style={{ originX: "12px", originY: "12px" }} transition={{ duration: 0.4 }}>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <line key={i} x1={12 + Math.cos(a) * 7.5} y1={12 + Math.sin(a) * 7.5} x2={12 + Math.cos(a) * 10} y2={12 + Math.sin(a) * 10} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            );
          })}
        </motion.g>
      </svg>
      <span className="pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap rounded-full border border-ink/10 bg-[var(--surface-2)] px-2.5 py-1 text-[11px] text-text opacity-0 shadow-lg transition group-hover:opacity-100">
        {light ? "Night sky" : "Daylight"}
      </span>
    </button>
  );
}
