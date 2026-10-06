"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// The five-way version of rock-paper-scissors, for settling things logically.
type Hand = "rock" | "paper" | "scissors" | "lizard" | "spock";
const HANDS: { id: Hand; icon: string; label: string }[] = [
  { id: "rock", icon: "✊", label: "Rock" },
  { id: "paper", icon: "✋", label: "Paper" },
  { id: "scissors", icon: "✌️", label: "Scissors" },
  { id: "lizard", icon: "🦎", label: "Lizard" },
  { id: "spock", icon: "🖖", label: "Spock" },
];
const BEATS: Record<Hand, Partial<Record<Hand, string>>> = {
  scissors: { paper: "cuts", lizard: "decapitates" },
  paper: { rock: "covers", spock: "disproves" },
  rock: { lizard: "crushes", scissors: "crushes" },
  lizard: { spock: "poisons", paper: "eats" },
  spock: { scissors: "smashes", rock: "vaporizes" },
};
const pickHand = (): Hand => HANDS[crypto.getRandomValues(new Uint32Array(1))[0] % 5].id;
const label = (h: Hand) => HANDS.find((x) => x.id === h)!.label;

export function LogicGame() {
  const [round, setRound] = useState<{ you: Hand; me: Hand } | null>(null);
  const [score, setScore] = useState({ you: 0, me: 0 });
  const [n, setN] = useState(0);

  const play = (you: Hand) => {
    const me = pickHand();
    setRound({ you, me });
    setN((k) => k + 1);
    if (BEATS[you][me]) setScore((s) => ({ ...s, you: s.you + 1 }));
    else if (BEATS[me][you]) setScore((s) => ({ ...s, me: s.me + 1 }));
  };

  let verdict = "", rule = "";
  if (round) {
    const { you, me } = round;
    if (you === me) verdict = "Draw. Again?";
    else if (BEATS[you][me]) {
      verdict = "You win.";
      rule = `${label(you)} ${BEATS[you][me]} ${label(me)}.`;
    } else {
      verdict = "I win.";
      rule = `${label(me)} ${BEATS[me][you]} ${label(you)}.`;
    }
  }

  return (
    <div className="glass flex flex-col gap-5 rounded-3xl border hairline p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div className="max-w-sm">
        <p className="eyebrow">Settling arguments · logically</p>
        <h4 className="mt-2 font-display text-2xl font-semibold">Three options were never enough.</h4>
        <p className="mt-1 text-sm text-muted">
          You <span className="tabular-nums text-text">{score.you}</span> · me <span className="tabular-nums text-text">{score.me}</span>
        </p>
      </div>
      <div className="flex-1 sm:max-w-md">
        <div className="flex flex-wrap gap-2">
          {HANDS.map((h) => (
            <motion.button
              key={h.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => play(h.id)}
              className="flex items-center gap-1.5 rounded-full border border-ink/15 px-3.5 py-2 text-sm hover:border-ink/40"
            >
              <span aria-hidden>{h.icon}</span>
              {h.label}
            </motion.button>
          ))}
        </div>
        <div className="mt-3 min-h-[44px]">
          <AnimatePresence mode="wait">
            {round && (
              <motion.p key={n} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm">
                <span className="text-muted">
                  {HANDS.find((h) => h.id === round.you)!.icon} vs {HANDS.find((h) => h.id === round.me)!.icon}
                </span>{" "}
                <span className="font-medium">{verdict}</span> <span className="text-muted">{rule}</span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
