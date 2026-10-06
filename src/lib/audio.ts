// One shared Web Audio graph for the piano and the beat machine.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

export function audio() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp).connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { ctx, out: master! };
}

export const midiToFreq = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

/** A soft electric-piano voice: two detuned partials with a fast attack and natural decay. */
export function playNote(midi: number, velocity = 0.8, when = 0) {
  const { ctx, out } = audio();
  const t = ctx.currentTime + when;
  const f = midiToFreq(midi);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.32 * velocity, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.12 * velocity, t + 0.35);
  g.gain.exponentialRampToValueAtTime(0.0008, t + 2.2);
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(Math.min(9000, f * 8), t);
  lp.frequency.exponentialRampToValueAtTime(Math.max(600, f * 2), t + 1.2);
  g.connect(lp).connect(out);
  for (const [mult, type, gain] of [[1, "triangle", 1], [2, "sine", 0.35], [1.003, "sine", 0.4]] as const) {
    const o = ctx.createOscillator();
    const og = ctx.createGain();
    o.type = type;
    o.frequency.value = f * mult;
    og.gain.value = gain;
    o.connect(og).connect(g);
    o.start(t);
    o.stop(t + 2.3);
  }
}

/** Drum voices for the beat machine. */
export function kick(when: number) {
  const { ctx, out } = audio();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.frequency.setValueAtTime(140, when);
  o.frequency.exponentialRampToValueAtTime(42, when + 0.12);
  g.gain.setValueAtTime(0.9, when);
  g.gain.exponentialRampToValueAtTime(0.001, when + 0.38);
  o.connect(g).connect(out);
  o.start(when);
  o.stop(when + 0.4);
}

let noiseBuf: AudioBuffer | null = null;
function noise(ctx: AudioContext) {
  if (!noiseBuf) {
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  return s;
}

export function snare(when: number) {
  const { ctx, out } = audio();
  const n = noise(ctx);
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1400;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.5, when);
  g.gain.exponentialRampToValueAtTime(0.001, when + 0.2);
  n.connect(hp).connect(g).connect(out);
  n.start(when);
  n.stop(when + 0.25);
  const o = ctx.createOscillator();
  const og = ctx.createGain();
  o.frequency.value = 190;
  og.gain.setValueAtTime(0.25, when);
  og.gain.exponentialRampToValueAtTime(0.001, when + 0.1);
  o.connect(og).connect(out);
  o.start(when);
  o.stop(when + 0.12);
}

export function hat(when: number, open = false) {
  const { ctx, out } = audio();
  const n = noise(ctx);
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 7500;
  const g = ctx.createGain();
  g.gain.setValueAtTime(open ? 0.16 : 0.11, when);
  g.gain.exponentialRampToValueAtTime(0.001, when + (open ? 0.22 : 0.05));
  n.connect(hp).connect(g).connect(out);
  n.start(when);
  n.stop(when + 0.25);
}

export function bass(midi: number, when: number, dur: number) {
  const { ctx, out } = audio();
  const o = ctx.createOscillator();
  const lp = ctx.createBiquadFilter();
  const g = ctx.createGain();
  o.type = "sawtooth";
  o.frequency.value = midiToFreq(midi);
  lp.type = "lowpass";
  lp.frequency.value = 420;
  g.gain.setValueAtTime(0.0001, when);
  g.gain.linearRampToValueAtTime(0.22, when + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, when + dur);
  o.connect(lp).connect(g).connect(out);
  o.start(when);
  o.stop(when + dur + 0.02);
}
