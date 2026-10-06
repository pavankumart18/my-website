"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { playNote } from "@/lib/audio";

// Two octaves from C4. Computer keys: A W S E D F T G Y H U J K O L P ; '
const START = 60;
const KEYS = Array.from({ length: 25 }, (_, i) => START + i);
const BLACK = new Set([1, 3, 6, 8, 10]);
const isBlack = (m: number) => BLACK.has(m % 12);
const NAMES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
const KEYMAP: Record<string, number> = { a: 60, w: 61, s: 62, e: 63, d: 64, f: 65, t: 66, g: 67, y: 68, h: 69, u: 70, j: 71, k: 72, o: 73, l: 74, p: 75, ";": 76, "'": 77 };

const SCALE = [60, 62, 64, 65, 67, 69, 71, 72];
// Twinkle Twinkle Little Star (traditional) — the first tune most beginners learn.
const TWINKLE = [60, 60, 67, 67, 69, 69, 67, 65, 65, 64, 64, 62, 62, 60];

// TODO(Pavan): tick these off as you go.
const JOURNEY = [
  { step: "Finding middle C", done: true },
  { step: "C major scale, right hand", done: false },
  { step: "First full song", done: false },
  { step: "Both hands together", done: false },
];

type Spark = { id: number; midi: number };

export function Piano() {
  const [down, setDown] = useState<Set<number>>(new Set());
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [lesson, setLesson] = useState<{ notes: number[]; i: number } | null>(null);
  const [played, setPlayed] = useState(0);
  const sparkId = useRef(0);
  const narrowRef = useRef<HTMLDivElement>(null);

  const press = useCallback((m: number) => {
    playNote(m);
    setPlayed((n) => n + 1);
    setDown((d) => new Set(d).add(m));
    setTimeout(() => setDown((d) => { const n = new Set(d); n.delete(m); return n; }), 180);
    const id = ++sparkId.current;
    setSparks((s) => [...s.slice(-24), { id, midi: m }]);
    setTimeout(() => setSparks((s) => s.filter((x) => x.id !== id)), 1600);
    setLesson((l) => {
      if (!l || l.notes[l.i] !== m) return l;
      return l.i + 1 >= l.notes.length ? null : { ...l, i: l.i + 1 };
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey) return;
      const el = e.target as HTMLElement;
      if (el.closest("input,textarea,[contenteditable]")) return;
      const m = KEYMAP[e.key.toLowerCase()];
      if (m === undefined) return;
      // Only when the piano is on screen, so typing elsewhere never makes noise.
      const r = narrowRef.current?.getBoundingClientRect();
      if (!r || r.bottom < 0 || r.top > window.innerHeight) return;
      press(m);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  const autoplay = (notes: number[], gap = 0.32) => {
    notes.forEach((m, i) => setTimeout(() => press(m), i * gap * 1000));
  };

  const whites = KEYS.filter((m) => !isBlack(m));
  const target = lesson ? lesson.notes[lesson.i] : null;

  return (
    <div ref={narrowRef} className="glass flex h-full flex-col overflow-hidden rounded-3xl border hairline">
      <div className="p-6 pb-0 sm:p-8 sm:pb-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="eyebrow">Piano · just started</p>
            <h4 className="mt-2 font-display text-2xl font-semibold">Being a beginner, on purpose.</h4>
          </div>
          <span className="rounded-full border border-ink/10 px-3 py-1 font-mono text-[11px] text-muted tabular-nums">{played} notes played here</span>
        </div>
        <ol className="mt-4 flex flex-wrap gap-2">
          {JOURNEY.map((j) => (
            <li key={j.step} className={`rounded-full border px-3 py-1 text-xs ${j.done ? "border-[#34D399]/40 text-[#6EE7B7]" : "border-ink/10 text-faint"}`}>
              {j.done ? "✓ " : "○ "}
              {j.step}
            </li>
          ))}
        </ol>
      </div>

      {/* Notes rise like light from the keys */}
      <div className="relative mx-6 mt-4 h-28 overflow-hidden sm:mx-8">
        {sparks.map((s) => {
          const wi = whites.indexOf(isBlack(s.midi) ? s.midi - 1 : s.midi);
          const left = ((wi + (isBlack(s.midi) ? 1 : 0.5)) / whites.length) * 100;
          const hue = ((s.midi - START) / 24) * 300;
          return (
            <motion.span
              key={s.id}
              className="absolute bottom-0 h-8 w-[3.2%] -translate-x-1/2 rounded-full"
              style={{ left: `${left}%`, background: `hsl(${190 + hue} 90% 65%)`, boxShadow: `0 0 18px hsl(${190 + hue} 90% 65%)` }}
              initial={{ y: 0, opacity: 0.95, scaleY: 1 }}
              animate={{ y: -110, opacity: 0, scaleY: 2.2 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          );
        })}
        {lesson && (
          <p className="absolute left-0 top-0 font-mono text-[11px] text-[#FBBF24]">
            Follow the glow · {lesson.i}/{lesson.notes.length}
          </p>
        )}
        {!lesson && played > 0 && sparks.length === 0 && <p className="absolute left-0 top-0 font-mono text-[11px] text-faint">Nice. Keep going.</p>}
      </div>

      <div className="relative mx-6 h-36 select-none sm:mx-8 sm:h-40" style={{ touchAction: "none" }}>
        {whites.map((m, i) => {
          const glow = target === m;
          return (
            <button
              key={m}
              aria-label={`${NAMES[m % 12]}${Math.floor(m / 12) - 1}`}
              onPointerDown={(e) => {
                e.preventDefault();
                press(m);
              }}
              className={`absolute bottom-0 top-0 rounded-b-lg border border-black/40 transition-colors ${
                down.has(m) ? "bg-[#c4b5fd]" : glow ? "bg-[#FDE68A]" : "bg-[#eef0f6] hover:bg-white"
              }`}
              style={{ left: `${(i / whites.length) * 100}%`, width: `${100 / whites.length}%`, boxShadow: glow ? "0 0 24px #FBBF24" : undefined }}
            >
              {m % 12 === 0 && <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 font-mono text-[9px] text-black/40">C{Math.floor(m / 12) - 1}</span>}
            </button>
          );
        })}
        {KEYS.filter(isBlack).map((m) => {
          const wi = whites.indexOf(m - 1);
          const glow = target === m;
          return (
            <button
              key={m}
              aria-label={`${NAMES[m % 12]}${Math.floor(m / 12) - 1}`}
              onPointerDown={(e) => {
                e.preventDefault();
                press(m);
              }}
              className={`absolute top-0 z-10 h-[60%] rounded-b-md border border-black ${down.has(m) ? "bg-[#7c3aed]" : glow ? "bg-[#F59E0B]" : "bg-[#151722] hover:bg-[#262a3a]"}`}
              style={{ left: `${((wi + 1) / whites.length) * 100 - 100 / whites.length / 3.2}%`, width: `${(100 / whites.length) * 0.64}%` }}
            />
          );
        })}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2 p-6 sm:p-8">
        <button onClick={() => setLesson({ notes: TWINKLE, i: 0 })} className="rounded-full bg-gradient-to-r from-[#FBBF24] to-[#F472B6] px-4 py-2 text-sm font-medium text-bg">
          ▶ Play my first song with me
        </button>
        <button onClick={() => autoplay(SCALE)} className="rounded-full border border-ink/15 px-4 py-2 text-sm transition hover:border-ink/40">
          Hear the C major scale
        </button>
        <span className="hidden font-mono text-[11px] text-faint sm:inline">or use keys A–; on your keyboard</span>
      </div>
    </div>
  );
}
