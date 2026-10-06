"use client";

import { anshap } from "@/content/profile";
import { bus } from "@/lib/bus";

// Hovering a layer lights up its matching ring around Noa's core in the 3D scene.
export function SafetyLayers() {
  return (
    <ul className="mt-6 grid gap-2 sm:grid-cols-2">
      {anshap.safety.map(([name, line, color], i) => (
        <li
          key={name}
          tabIndex={0}
          onMouseEnter={() => bus.set({ shield: i })}
          onMouseLeave={() => bus.set({ shield: -1 })}
          onFocus={() => bus.set({ shield: i })}
          onBlur={() => bus.set({ shield: -1 })}
          className="group cursor-default rounded-2xl border border-ink/[0.06] p-4 outline-none transition hover:border-ink/20 hover:bg-ink/[0.04] focus-visible:border-ink/30"
        >
          <span className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 flex-none rounded-full transition group-hover:scale-150" style={{ background: color, boxShadow: `0 0 14px ${color}` }} />
            <span className="font-medium">{name}</span>
          </span>
          <span className="mt-1.5 block pl-[22px] text-sm leading-relaxed text-muted">{line}</span>
        </li>
      ))}
    </ul>
  );
}
