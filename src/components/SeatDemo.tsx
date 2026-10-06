"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// A playable version of the 2024 reservation project: seats are allotted so that
// no one is placed beside a stranger of a different gender, and seniors sit up front.
type Kind = "F" | "M" | "S";
const ROWS = 8;
const SEATS = ROWS * 4; // 2 + 2 layout
const pairOf = (i: number) => (i % 2 === 0 ? i + 1 : i - 1);
const rowOf = (i: number) => Math.floor(i / 4);
const label = { F: "Woman", M: "Man", S: "Senior" } as const;
const tone = { F: "bg-[#F9A8D4]", M: "bg-[#93C5FD]", S: "bg-[#FCD34D]" } as const;

// Women sit beside women, men beside men; seniors may sit beside anyone.
const compatible = (a: Kind, b: Kind) => a === b || a === "S" || b === "S";

function allot(seats: (Kind | null)[], k: Kind): { seat: number; why: string } | null {
  const ok = (i: number) => {
    const n = seats[pairOf(i)];
    return seats[i] === null && (n === null || compatible(k, n));
  };
  const free = seats.map((_, i) => i).filter(ok);
  if (!free.length) return null;
  const score = (i: number) => {
    const n = seats[pairOf(i)];
    let s = 0;
    if (n !== null) s -= 100; // fill a compatible pair first
    if (k === "S") s += rowOf(i) * 10; // seniors: as close to the door as possible
    return s + i * 0.01;
  };
  const seat = free.sort((a, b) => score(a) - score(b))[0];
  const n = seats[pairOf(seat)];
  const why =
    k === "S"
      ? `Row ${rowOf(seat) + 1}: nearest available to the front for a senior passenger.`
      : n
        ? `Row ${rowOf(seat) + 1}: paired beside a compatible passenger.`
        : `Row ${rowOf(seat) + 1}: no compatible pair free, so a fresh pair is opened.`;
  return { seat, why };
}

export function SeatDemo() {
  const [seats, setSeats] = useState<(Kind | null)[]>(() => Array(SEATS).fill(null));
  const [log, setLog] = useState<string[]>(["Choose a passenger to book a seat."]);
  const [last, setLast] = useState<number | null>(null);

  const book = (k: Kind) => {
    const r = allot(seats, k);
    if (!r) {
      setLog((l) => [`${label[k]}: no seat satisfies the safety rules. Booking declined.`, ...l].slice(0, 4));
      return;
    }
    const next = [...seats];
    next[r.seat] = k;
    setSeats(next);
    setLast(r.seat);
    setLog((l) => [`${label[k]} → seat ${r.seat + 1}. ${r.why}`, ...l].slice(0, 4));
  };

  const filled = seats.filter(Boolean).length;

  return (
    <div className="rounded-2xl border hairline glass p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="eyebrow">Playable · 2024 project</p>
        <p className="font-mono text-xs text-muted tabular-nums">
          {filled}/{SEATS} booked
        </p>
      </div>
      <h3 className="mt-3 font-display text-xl font-semibold">Safety-aware seat allocation</h3>
      <p className="mt-1 text-sm text-muted">My first rules engine. Book passengers and watch the constraint logic choose.</p>

      <div className="mt-6 flex gap-5">
        <div className="grid flex-none grid-cols-[repeat(2,1.6rem)_0.9rem_repeat(2,1.6rem)] gap-1.5 rounded-xl border hairline bg-bg/60 p-3">
          {Array.from({ length: ROWS }).map((_, r) =>
            [0, 1, null, 2, 3].map((c, j) =>
              c === null ? (
                <span key={`${r}-a`} />
              ) : (
                <div key={`${r}-${j}`} className="relative h-6 w-[1.6rem] rounded-[5px] border hairline bg-ink/[0.03]">
                  <AnimatePresence>
                    {seats[r * 4 + c] && (
                      <motion.span
                        initial={{ scale: 0.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        className={`absolute inset-[3px] rounded-[3px] ${tone[seats[r * 4 + c]!]} ${
                          last === r * 4 + c ? "ring-2 ring-ink/70" : ""
                        }`}
                      />
                    )}
                  </AnimatePresence>
                </div>
              ),
            ),
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap gap-2">
            {(["F", "M", "S"] as Kind[]).map((k) => (
              <button
                key={k}
                onClick={() => book(k)}
                className="flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 text-xs transition hover:bg-ink/[0.06]"
              >
                <span className={`h-2 w-2 rounded-full ${tone[k]}`} />
                {label[k]}
              </button>
            ))}
            <button
              onClick={() => {
                setSeats(Array(SEATS).fill(null));
                setLast(null);
                setLog(["Reset. Choose a passenger to book a seat."]);
              }}
              className="rounded-full px-3 py-1.5 text-xs text-muted transition hover:text-text"
            >
              Reset
            </button>
          </div>
          <ol className="mt-4 space-y-2 font-mono text-[11px] leading-relaxed">
            {log.map((l, i) => (
              <motion.li
                key={l + i + filled}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: i === 0 ? 1 : 0.45, x: 0 }}
                className={i === 0 ? "text-text" : "text-muted"}
              >
                {l}
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
