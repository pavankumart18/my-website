"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { anshapStory, profile } from "@/content/profile";
import { featured } from "@/content/projects";
import { setTheme } from "./ThemeToggle";

type Item = { group: string; label: string; hint?: string; run: () => void };

const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
const open = (url: string) => window.open(url, "_blank", "noopener");

export function openPalette() {
  window.dispatchEvent(new Event("open-palette"));
}

// ⌘K / Ctrl+K: jump anywhere, open any project, copy the email.
export function CommandPalette() {
  const [isOpen, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const [toast, setToast] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const items = useMemo<Item[]>(
    () => [
      ...[
        ["top", "Home"], ["journey", "Journey · the network I grew"], ["origins", "Origins · CBIT"], ["inflection", "Straive"], ["work", "Selected work"],
        ["anshap", "Anshap"], ["agents", "Agents & tooling"], ["life", "Off the clock · hobbies"], ["pulse", "Right now · live"], ["contact", "Contact"],
      ].map(([id, label]) => ({ group: "Go to", label, run: () => jump(id) })),
      { group: "Anshap", label: "Talk to Noa", hint: "chat.anshap.com", run: () => open("https://chat.anshap.com") },
      ...anshapStory.links.filter((l) => !l.primary).map((l) => ({ group: "Anshap", label: l.label, hint: l.href.replace("https://", ""), run: () => open(l.href) })),
      ...featured.map((f) => ({ group: "Projects", label: f.name, hint: f.live ? "live demo" : "code", run: () => open(f.live ?? `https://github.com/${profile.github}/${f.repo}`) })),
      {
        group: "Contact",
        label: "Copy email",
        hint: profile.email,
        run: () => {
          navigator.clipboard?.writeText(profile.email).then(() => {
            setToast("Email copied");
            setTimeout(() => setToast(""), 1800);
          });
        },
      },
      { group: "Theme", label: "Daylight sky", hint: "light mode", run: () => setTheme("light") },
      { group: "Theme", label: "Night sky", hint: "dark mode", run: () => setTheme("dark") },
      { group: "Contact", label: "LinkedIn", run: () => open(profile.linkedin) },
      { group: "Contact", label: "GitHub", run: () => open(`https://github.com/${profile.github}`) },
    ],
    [],
  );

  const results = items.filter((i) => `${i.group} ${i.label} ${i.hint ?? ""}`.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (isOpen) setTimeout(() => input.current?.focus(), 30);
  }, [isOpen]);

  const choose = (it: Item | undefined) => {
    if (!it) return;
    setOpen(false);
    setQ("");
    setIdx(0);
    it.run();
  };

  let lastGroup = "";
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-start justify-center bg-black/60 px-4 pt-[14vh] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-label="Command palette"
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-ink/15 bg-[var(--surface-2)] shadow-2xl"
              initial={{ y: -12, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -12, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                ref={input}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setIdx(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, results.length - 1)); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
                  if (e.key === "Enter") choose(results[idx]);
                }}
                placeholder="Jump to a chapter, open a project, copy email…"
                className="w-full border-b border-ink/10 bg-transparent px-5 py-4 text-[15px] outline-none placeholder:text-faint"
              />
              <ul className="max-h-[50vh] overflow-y-auto p-2">
                {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">Nothing matches “{q}”.</li>}
                {results.map((it, i) => {
                  const head = it.group !== lastGroup ? (lastGroup = it.group) : null;
                  return (
                    <li key={it.group + it.label}>
                      {head && <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-wider text-faint">{head}</p>}
                      <button
                        onMouseEnter={() => setIdx(i)}
                        onClick={() => choose(it)}
                        className={`flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left text-sm ${i === idx ? "bg-ink/[0.08] text-text" : "text-text/80"}`}
                      >
                        <span>{it.label}</span>
                        {it.hint && <span className="truncate font-mono text-[11px] text-faint">{it.hint}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <p className="border-t border-ink/10 px-4 py-2 font-mono text-[10px] text-faint">↑↓ navigate · ↵ open · esc close</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm text-bg">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
