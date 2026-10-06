"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Counts the numeric part of a value up from 0 when it scrolls into view, keeping any
 * prefix/suffix and separators ("3,108", "91%", "4.6/mo", "64 → 6" animates the first number).
 */
export function CountUp({ value, duration = 1.2 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const m = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!m || !inView || reduce) return;
    const [, pre, num, post] = m;
    const target = parseFloat(num.replace(/,/g, ""));
    const decimals = num.includes(".") ? num.split(".")[1].length : 0;
    const commas = num.includes(",");
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / (duration * 1000));
      const v = target * (1 - Math.pow(1 - k, 3));
      const str = commas ? Math.round(v).toLocaleString("en-US") : v.toFixed(decimals);
      setShown(pre + str + post);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Frames can be throttled (background tab, occluded window): always land on the real value.
    const done = setTimeout(() => {
      cancelAnimationFrame(raf);
      setShown(value);
    }, duration * 1000 + 150);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(done);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {shown}
    </span>
  );
}
