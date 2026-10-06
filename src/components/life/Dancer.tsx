"use client";

import { useEffect, useRef, useState } from "react";
import { audio, bass, hat, kick, snare } from "@/lib/audio";

// A freestyle hip-hop dancer drawn as light, grooving to a beat synthesised in the browser.
type Move = "groove" | "toprock" | "wave" | "freeze";
const MOVES: { id: Move; label: string }[] = [
  { id: "groove", label: "Groove" },
  { id: "toprock", label: "Toprock" },
  { id: "wave", label: "Arm wave" },
  { id: "freeze", label: "Freeze" },
];

// 16-step boom-bap pattern.
const KICK = [0, 3, 8, 10];
const SNARE = [4, 12];
const BASSLINE: [number, number][] = [[0, 36], [3, 36], [8, 39], [10, 34]];

type V = [number, number];
const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1]];
const polar = (len: number, ang: number): V => [Math.sin(ang) * len, Math.cos(ang) * len];

/** Two-bone IK: knee/elbow position for a joint chain from a to target with lengths l1, l2. */
function ik(a: V, t: V, l1: number, l2: number, bendDir: number): V {
  const dx = t[0] - a[0], dy = t[1] - a[1];
  const d = Math.min(Math.hypot(dx, dy), l1 + l2 - 0.001);
  const base = Math.atan2(dy, dx);
  const cosA = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d);
  const ang = base + Math.acos(Math.max(-1, Math.min(1, cosA))) * bendDir;
  return [a[0] + Math.cos(ang) * l1, a[1] + Math.sin(ang) * l1];
}

export function Dancer() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(92);
  const [move, setMove] = useState<Move>("groove");
  const live = useRef({ playing: false, bpm: 92, move: "groove" as Move, startAt: 0, nextStep: 0, step: 0, idleT0: 0, flash: 0 });

  useEffect(() => {
    live.current.bpm = bpm;
  }, [bpm]);
  useEffect(() => {
    live.current.move = move;
  }, [move]);

  // Beat scheduler on the audio clock (lookahead), so drums never drift.
  useEffect(() => {
    if (!playing) {
      live.current.playing = false;
      return;
    }
    const { ctx } = audio();
    const L = live.current;
    L.playing = true;
    L.startAt = ctx.currentTime + 0.08;
    L.nextStep = L.startAt;
    L.step = 0;
    const id = setInterval(() => {
      const stepDur = 60 / L.bpm / 4;
      while (L.nextStep < ctx.currentTime + 0.12) {
        const s = L.step % 16;
        if (KICK.includes(s)) kick(L.nextStep);
        if (SNARE.includes(s)) snare(L.nextStep);
        if (s % 2 === 0) hat(L.nextStep, s === 14);
        const b = BASSLINE.find(([at]) => at === s);
        if (b) bass(b[1], L.nextStep, stepDur * 2.5);
        L.nextStep += stepDur;
        L.step++;
      }
    }, 25);
    return () => clearInterval(id);
  }, [playing]);

  useEffect(() => {
    const c = canvas.current!;
    const g = c.getContext("2d")!;
    let raf = 0, w = 0, h = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);
    const t0 = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const L = live.current;
      // Beat position: from the audio clock when playing, otherwise a calm idle groove.
      let beat: number;
      if (L.playing) {
        const { ctx } = audio();
        beat = Math.max(0, (ctx.currentTime - L.startAt) * (L.bpm / 60));
      } else beat = ((now - t0) / 1000) * (70 / 60);
      const energy = L.playing ? 1 : 0.45;
      const ph = beat % 1;
      const hit = Math.pow(1 - ph, 3); // spikes on every beat

      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Motion trails: fade the previous frame instead of clearing.
      g.fillStyle = "rgba(6,7,16,0.28)";
      g.fillRect(0, 0, w, h);

      const S = Math.min(h / 6.4, w / 5.5, 62); // figure scale, capped so a tall stage never crops him
      const floor = Math.min(h * 0.88, h / 2 + S * 3);
      const cx = w / 2;

      // Stage light pulses with the kick.
      const spot = g.createRadialGradient(cx, floor, 0, cx, floor, S * 3.4);
      spot.addColorStop(0, `rgba(167,139,250,${0.1 + hit * 0.22 * energy})`);
      spot.addColorStop(1, "rgba(167,139,250,0)");
      g.fillStyle = spot;
      g.fillRect(0, 0, w, h);
      g.strokeStyle = "rgba(255,255,255,0.08)";
      g.beginPath();
      g.moveTo(cx - S * 3, floor);
      g.lineTo(cx + S * 3, floor);
      g.stroke();

      const TAU = Math.PI * 2;
      const leg = S * 1.05, shin = S * 1.0, torso = S * 1.35, upper = S * 0.75, fore = S * 0.7;
      let hip: V, chestLean = 0, footL: V, footR: V, armL: [number, number], armR: [number, number], headTilt = 0;

      switch (L.move) {
        case "toprock": {
          // Cross-step: feet alternate crossing in front, body twists.
          const side = Math.sin(beat * Math.PI);
          hip = [cx + side * S * 0.35, floor - leg - shin + S * 0.22 + hit * S * 0.12];
          footL = [cx - S * 0.55 + Math.max(0, side) * S * 0.9, floor - Math.max(0, Math.sin(beat * TAU)) * S * 0.25];
          footR = [cx + S * 0.55 + Math.min(0, side) * S * 0.9, floor - Math.max(0, -Math.sin(beat * TAU)) * S * 0.25];
          chestLean = -side * 0.22;
          armL = [-1.9 + side * 0.6, -1.2];
          armR = [1.9 + side * 0.6, 1.2];
          headTilt = side * 0.15;
          break;
        }
        case "wave": {
          const wv = beat * TAU * 0.5;
          hip = [cx, floor - leg - shin + S * 0.15 + hit * S * 0.06];
          footL = [cx - S * 0.5, floor];
          footR = [cx + S * 0.5, floor];
          chestLean = Math.sin(wv) * 0.08;
          // A wave travelling across: left hand → shoulders → right hand.
          armL = [-1.55 + Math.sin(wv) * 0.5, -0.4 + Math.sin(wv - 0.8) * 0.9];
          armR = [1.55 + Math.sin(wv - 1.6) * 0.5, 0.4 + Math.sin(wv - 2.4) * 0.9];
          headTilt = Math.sin(wv - 1.2) * 0.2;
          break;
        }
        case "freeze": {
          // Hold a sharp pose; tiny breath only. On each new bar, snap to a new freeze.
          const bar = Math.floor(beat / 4) % 2;
          hip = [cx + (bar ? -1 : 1) * S * 0.2, floor - leg - shin + S * 0.55];
          footL = [cx - S * 0.85, floor];
          footR = [cx + S * 0.7, floor];
          chestLean = bar ? 0.35 : -0.3;
          // Two clean freezes: one arm pointing to the sky / both arms crossed in a b-boy stance.
          armL = bar ? [-2.3, -0.5] : [-0.9, 1.9];
          armR = bar ? [0.9, -1.9] : [2.3, 0.5];
          headTilt = bar ? 0.3 : -0.25;
          break;
        }
        default: {
          // Groove: knee bounce on the beat, shoulders rock on the off-beat.
          const rock = Math.sin(beat * Math.PI);
          hip = [cx + rock * S * 0.12 * energy, floor - leg - shin + S * (0.12 + hit * 0.22 * energy)];
          footL = [cx - S * 0.55, floor];
          footR = [cx + S * 0.55, floor - Math.max(0, Math.sin(beat * Math.PI)) * S * 0.18 * energy];
          chestLean = rock * 0.12 * energy;
          armL = [-0.5 - hit * 0.35 * energy, -1.6 + rock * 0.5];
          armR = [0.5 + hit * 0.35 * energy, 1.6 + rock * 0.5];
          headTilt = -rock * 0.12 + hit * 0.08;
        }
      }

      const chest = add(hip, polar(torso, Math.PI + chestLean));
      const neck = add(chest, polar(S * 0.2, Math.PI + chestLean));
      const head = add(neck, polar(S * 0.38, Math.PI + chestLean + headTilt));
      const shL = add(chest, [-S * 0.38, S * 0.05]);
      const shR = add(chest, [S * 0.38, S * 0.05]);
      const elL = add(shL, polar(upper, armL[0]));
      const hdL = add(elL, polar(fore, armL[0] + armL[1]));
      const elR = add(shR, polar(upper, armR[0]));
      const hdR = add(elR, polar(fore, armR[0] + armR[1]));
      const hpL = add(hip, [-S * 0.22, 0]);
      const hpR = add(hip, [S * 0.22, 0]);
      const knL = ik(hpL, footL, leg, shin, 1);
      const knR = ik(hpR, footR, leg, shin, -1);

      const hue = (beat * 40) % 360;
      const limb = (pts: V[], color: string, width: number) => {
        g.strokeStyle = color;
        g.lineWidth = width;
        g.lineCap = "round";
        g.lineJoin = "round";
        g.shadowColor = color;
        g.shadowBlur = 18 + hit * 22 * energy;
        g.beginPath();
        g.moveTo(...pts[0]);
        for (const p of pts.slice(1)) g.lineTo(...p);
        g.stroke();
      };
      const colA = `hsl(${190 + hue * 0.3} 95% 62%)`;
      const colB = `hsl(${290 + hue * 0.3} 90% 68%)`;
      limb([footL, knL, hpL, hpR, knR, footR], colA, S * 0.17);
      limb([hip, chest], colB, S * 0.22);
      limb([hdL, elL, shL, shR, elR, hdR], colB, S * 0.15);
      limb([chest, neck], colB, S * 0.14);
      g.shadowBlur = 26;
      g.fillStyle = "#fff";
      g.shadowColor = colA;
      g.beginPath();
      g.arc(head[0], head[1], S * 0.3, 0, TAU);
      g.fill();
      // Cap on the head — hip-hop, after all.
      g.fillStyle = colA;
      g.beginPath();
      g.ellipse(head[0] + S * 0.08, head[1] - S * 0.16, S * 0.32, S * 0.12, headTilt + chestLean, Math.PI, TAU);
      g.fill();
      g.shadowBlur = 0;

      // Floor reflection hint
      g.fillStyle = `rgba(167,139,250,${0.08 + hit * 0.1 * energy})`;
      g.beginPath();
      g.ellipse(hip[0], floor + 4, S * 0.9, S * 0.12, 0, 0, TAU);
      g.fill();
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div className="glass flex h-full flex-col overflow-hidden rounded-3xl border hairline">
      <div className="flex flex-wrap items-start justify-between gap-3 p-6 pb-0 sm:p-8 sm:pb-0">
        <div>
          <p className="eyebrow">Dance · freestyle hip-hop</p>
          <h4 className="mt-2 font-display text-2xl font-semibold">Where I get out of my head.</h4>
        </div>
        <span className="rounded-full border border-ink/10 px-3 py-1 font-mono text-[11px] text-muted tabular-nums">{bpm} BPM</span>
      </div>
      <canvas ref={canvas} className="mt-2 min-h-72 w-full flex-1 sm:min-h-80" aria-label="Animated dancer" />
      <div className="space-y-4 p-6 pt-2 sm:p-8 sm:pt-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="rounded-full bg-gradient-to-r from-[#22D3EE] to-[#A78BFA] px-4 py-2 text-sm font-medium text-bg"
          >
            {playing ? "■ Stop the beat" : "▶ Drop the beat"}
          </button>
          {MOVES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMove(m.id)}
              className={`rounded-full border px-3.5 py-2 text-sm transition ${move === m.id ? "border-ink/40 bg-ink/10" : "border-ink/10 text-muted hover:text-text"}`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-3 text-xs text-muted">
          Tempo
          <input type="range" min={70} max={120} value={bpm} onChange={(e) => setBpm(+e.target.value)} className="w-full accent-[#A78BFA]" />
        </label>
      </div>
    </div>
  );
}
