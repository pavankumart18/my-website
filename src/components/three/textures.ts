import * as THREE from "three";

let seed = 3;
const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

/** Soft round sprite for stars. */
export function spriteTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.8)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** A wispy, procedurally painted nebula cloud (white; tinted per instance). */
export function nebulaTexture(size = 512) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  g.globalCompositeOperation = "lighter";
  const h = size / 2;
  for (let i = 0; i < 70; i++) {
    const a = rnd() * Math.PI * 2;
    const d = Math.pow(rnd(), 0.8) * h * 0.62;
    const x = h + Math.cos(a) * d;
    const y = h + Math.sin(a) * d * 0.7;
    const r = (0.12 + rnd() * 0.3) * h;
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    const alpha = 0.05 + rnd() * 0.08;
    grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  // Fade the edges so the sprite never shows a square border.
  g.globalCompositeOperation = "destination-in";
  const mask = g.createRadialGradient(h, h, h * 0.25, h, h, h);
  mask.addColorStop(0, "rgba(0,0,0,1)");
  mask.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = mask;
  g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
