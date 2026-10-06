"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction, type BloomEffect, type ChromaticAberrationEffect } from "postprocessing";
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { cine, INTRO_SECONDS, markIntroSeen, shouldPlayIntro } from "@/lib/cine";
import { useDaylight } from "@/lib/theme";
import { nebulaTexture } from "./textures";

export type Station = { pos: [number, number, number]; look: [number, number, number] };

const MOTION = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (e0: number, e1: number, x: number) => {
  const t = THREE.MathUtils.clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

// ───────────────────────── Camera ─────────────────────────

/**
 * Flies the camera along smooth Catmull-Rom curves through the chapter stations,
 * plays the opening fly-in, and adds the physical cues that sell motion:
 * a FOV kick with speed, banking into lateral moves, and an idle "handheld" breath.
 */
export function CineRig({ sections, stations, grades, narrow }: { sections: readonly string[]; stations: Station[]; grades: string[]; narrow: boolean }) {
  const { scene } = useThree();
  const tops = useRef<number[]>([]);
  const look = useRef(new THREE.Vector3(...stations[0].look));
  const prev = useRef(new THREE.Vector3(...stations[0].pos));
  const vel = useRef(new THREE.Vector3());
  const roll = useRef(0);
  const fov = useRef(0);
  const intro = useRef<{ on: boolean; t: number; started: boolean; titles?: boolean }>({ on: false, t: 0, started: false });
  const scratch = useRef({ p: new THREE.Vector3(), l: new THREE.Vector3(), c: new THREE.Color(), c2: new THREE.Color() });

  const curves = useMemo(
    () => ({
      pos: new THREE.CatmullRomCurve3(stations.map((s) => new THREE.Vector3(...s.pos)), false, "centripetal"),
      look: new THREE.CatmullRomCurve3(stations.map((s) => new THREE.Vector3(...s.look)), false, "centripetal"),
      introPos: new THREE.CatmullRomCurve3(
        [new THREE.Vector3(-8, 10, 84), new THREE.Vector3(16, 6, 50), new THREE.Vector3(12, 2.5, 24), new THREE.Vector3(...stations[0].pos)],
        false,
        "centripetal",
      ),
    }),
    [stations],
  );

  useEffect(() => {
    const measure = () => {
      tops.current = sections.map((id) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : 0;
      });
      // The probe line sits 35% down the viewport, so the first chapter starts there: top of page = station 0.
      tops.current[0] = window.innerHeight * 0.35;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    const play = shouldPlayIntro();
    console.info(`[cine] intro ${play ? "playing" : "skipped"}`);
    if (play) intro.current = { on: true, t: 0, started: false };
    else cine.titles = true;
    return () => ro.disconnect();
  }, [sections]);

  useFrame(({ camera, pointer, clock }, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const cam = camera as THREE.PerspectiveCamera;
    const tmp = scratch.current;
    const t = tops.current;
    if (!t.length) return;
    if (!fov.current) fov.current = cam.fov;
    const baseFov = narrow ? 70 : 55;

    // Continuous position along the chapter path.
    const y = window.scrollY + window.innerHeight * 0.35;
    let i = 0;
    while (i < t.length - 1 && y >= t[i + 1]) i++;
    const span = i < t.length - 1 ? t[i + 1] - t[i] : 1;
    const raw = i < t.length - 1 ? THREE.MathUtils.clamp((y - t[i]) / span, 0, 1) : 0;
    const u = i + raw * raw * (3 - 2 * raw);
    cine.chapter = u;
    const k01 = u / (stations.length - 1);
    curves.pos.getPoint(k01, tmp.p);
    curves.look.getPoint(k01, tmp.l);
    if (narrow) tmp.l.x *= 0.2;

    // Opening shot: sweep in from deep space; scrolling cuts it short.
    let follow = 1 - Math.pow(0.0015, dt);
    if (intro.current.on) {
      // Clock starts on the first drawn frame and advances by frame time, so a
      // shader-compile stall on load can't eat the shot.
      if (!intro.current.started) {
        intro.current.started = true;
        window.dispatchEvent(new Event("cine:intro-start"));
      } else intro.current.t += dt;
      const e = intro.current.t / INTRO_SECONDS;
      if (e >= 0.62 && !intro.current.titles) {
        intro.current.titles = true;
        cine.titles = true;
        window.dispatchEvent(new Event("cine:titles"));
      }
      if (e >= 1 || window.scrollY > 60) {
        intro.current.on = false;
        cine.titles = true;
        markIntroSeen();
        window.dispatchEvent(new Event("cine:intro-end"));
      } else {
        const p = easeInOut(e);
        curves.introPos.getPoint(p, tmp.p);
        tmp.l.set(4.2, -0.4, 0).lerp(new THREE.Vector3(...stations[0].look), smooth(0.55, 1, e));
        follow = 1; // the intro is already a smooth path
      }
    }

    // Handheld breath + pointer parallax.
    const time = clock.elapsedTime * MOTION;
    tmp.p.x += pointer.x * 0.7 + Math.sin(time * 0.31) * 0.12;
    tmp.p.y += pointer.y * 0.45 + Math.sin(time * 0.47) * 0.08;

    cam.position.lerp(tmp.p, follow);
    look.current.lerp(tmp.l, follow);
    cam.lookAt(look.current);

    // Velocity → speed, bank and FOV.
    vel.current.subVectors(cam.position, prev.current).divideScalar(Math.max(dt, 1e-3));
    prev.current.copy(cam.position);
    const measured = vel.current.length();
    const speed = measured > 300 ? cine.speed : measured; // a teleport (intro start, anchor jump) isn't motion
    cine.speed += (speed - cine.speed) * Math.min(1, dt * 6);
    const bankTarget = THREE.MathUtils.clamp(-vel.current.x * 0.012, -0.14, 0.14) * MOTION;
    roll.current += (bankTarget - roll.current) * Math.min(1, dt * 3);
    cam.rotateZ(roll.current + Math.sin(time * 0.2) * 0.006);
    const fovTarget = baseFov + Math.min(cine.speed * 0.32, 16) * MOTION;
    fov.current += (fovTarget - fov.current) * Math.min(1, dt * 4);
    if (Math.abs(cam.fov - fov.current) > 0.01) {
      cam.fov = fov.current;
      cam.updateProjectionMatrix();
    }

    // Colour grading per chapter: fog + background drift between chapter tints.
    const gi = Math.floor(u);
    tmp.c.set(grades[Math.min(gi, grades.length - 1)]).lerp(tmp.c2.set(grades[Math.min(gi + 1, grades.length - 1)]), u - gi);
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(tmp.c);
    if (scene.background instanceof THREE.Color) scene.background.copy(tmp.c);

    if (process.env.NODE_ENV !== "production") (window as unknown as { __cam?: number[] }).__cam = cam.position.toArray();
  });
  return null;
}

// ───────────────────────── Warp field ─────────────────────────

const warpVert = /* glsl */ `
  attribute float aTail;
  uniform float uStretch;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.z += aTail * uStretch;
    vColor = color;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vAlpha = (1.0 - aTail) * smoothstep(90.0, 6.0, -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const warpFrag = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  void main() { gl_FragColor = vec4(vColor * vAlpha * uOpacity, 1.0); }
`;

/** Deep-space stars along the flight path that stretch into hyperspace streaks with speed. */
export function WarpField({ narrow, sprite, palette }: { narrow: boolean; sprite: THREE.Texture; palette: string[] }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { points, lines } = useMemo(() => {
    let s = 41;
    const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
    const N = narrow ? 2500 : 6500;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const lpos = new Float32Array(N * 6);
    const lcol = new Float32Array(N * 6);
    const tail = new Float32Array(N * 2);
    const c = new THREE.Color();
    for (let i = 0; i < N; i++) {
      const rad = 5 + r() * 32;
      const a = r() * Math.PI * 2;
      const x = Math.cos(a) * rad, yy = Math.sin(a) * rad * 0.6, z = 90 - r() * 290;
      pos.set([x, yy, z], i * 3);
      lpos.set([x, yy, z, x, yy, z], i * 6);
      c.set(palette[i % palette.length]).lerp(new THREE.Color("#ffffff"), 0.5);
      col.set([c.r, c.g, c.b], i * 3);
      lcol.set([c.r, c.g, c.b, c.r, c.g, c.b], i * 6);
      tail.set([0, 1], i * 2);
    }
    const points = new THREE.BufferGeometry();
    points.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    points.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const lines = new THREE.BufferGeometry();
    lines.setAttribute("position", new THREE.BufferAttribute(lpos, 3));
    lines.setAttribute("color", new THREE.BufferAttribute(lcol, 3));
    lines.setAttribute("aTail", new THREE.BufferAttribute(tail, 1));
    return { points, lines };
  }, [narrow, palette]);

  const uniforms = useMemo(() => ({ uStretch: { value: 0 }, uOpacity: { value: 0 } }), []);
  const prevZ = useRef<number | null>(null);
  useFrame(({ camera }, dt) => {
    const m = mat.current;
    if (!m) return;
    const z = camera.position.z;
    const vz = prevZ.current === null ? 0 : (z - prevZ.current) / Math.max(dt, 1e-3);
    prevZ.current = z;
    // Tails trail behind the direction of travel; length grows with speed.
    const target = THREE.MathUtils.clamp(-vz * 0.09, -9, 9) * MOTION;
    m.uniforms.uStretch.value += (target - m.uniforms.uStretch.value) * Math.min(1, dt * 5);
    m.uniforms.uOpacity.value = Math.min(1, Math.abs(m.uniforms.uStretch.value) / 2.5);
  });

  return (
    <>
      <points geometry={points}>
        <pointsMaterial size={0.09} map={sprite} vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.75} />
      </points>
      <lineSegments geometry={lines} frustumCulled={false}>
        <shaderMaterial
          ref={mat}
          vertexShader={warpVert}
          fragmentShader={warpFrag}
          uniforms={uniforms}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  );
}

// ───────────────────────── Nebulae ─────────────────────────

/** Large tinted cloud sprites behind each chapter — the colour of each "scene". */
export function Nebulae({ clouds }: { clouds: { pos: [number, number, number]; scale: number; color: string; opacity?: number }[] }) {
  const tex = useMemo(() => nebulaTexture(), []);
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    group.current?.children.forEach((c, i) => {
      const m = (c as THREE.Sprite).material as THREE.SpriteMaterial;
      m.rotation += dt * 0.012 * (i % 2 ? 1 : -1) * MOTION;
    });
  });
  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <sprite key={i} position={c.pos} scale={[c.scale, c.scale * 0.7, 1]}>
          <spriteMaterial
            map={tex}
            color={c.color}
            transparent
            opacity={c.opacity ?? 0.55}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            fog={false}
            rotation={i * 1.3}
          />
        </sprite>
      ))}
    </group>
  );
}

// ───────────────────────── Shooting stars ─────────────────────────

/** Occasional meteors crossing the frame, spawned relative to the camera. */
type Meteor = { g: THREE.BufferGeometry; head: THREE.Vector3; dir: THREE.Vector3; life: number; wait: number };

export function ShootingStars({ count = 3 }: { count?: number }) {
  const lines = useRef<(THREE.LineSegments | null)[]>([]);
  const meteors = useRef<Meteor[]>([]);
  const vec = useRef({ fwd: new THREE.Vector3(), right: new THREE.Vector3() });

  useFrame(({ camera }, rawDt) => {
    if (!MOTION) return;
    if (!meteors.current.length) {
      meteors.current = lines.current
        .filter((l): l is THREE.LineSegments => !!l)
        .map((l, i) => ({ g: l.geometry, head: new THREE.Vector3(), dir: new THREE.Vector3(), life: 0, wait: 2 + i * 2.5 }));
    }
    const dt = Math.min(rawDt, 0.1);
    const { fwd, right } = vec.current;
    for (const m of meteors.current) {
      const a = m.g.attributes.position as THREE.BufferAttribute;
      if (m.life <= 0) {
        m.wait -= dt;
        a.setXYZ(0, 0, -9999, 0);
        a.setXYZ(1, 0, -9999, 0);
        a.needsUpdate = true;
        if (m.wait > 0) continue;
        camera.getWorldDirection(fwd);
        right.crossVectors(fwd, camera.up).normalize();
        m.head
          .copy(camera.position)
          .addScaledVector(fwd, 22 + Math.random() * 14)
          .addScaledVector(right, (Math.random() - 0.2) * 26)
          .add(new THREE.Vector3(0, 7 + Math.random() * 5, 0));
        m.dir.copy(right).multiplyScalar(-1).add(new THREE.Vector3(0, -0.45, (Math.random() - 0.5) * 0.4)).normalize();
        m.life = 0.9 + Math.random() * 0.5;
        m.wait = 3.5 + Math.random() * 6;
      }
      m.life -= dt;
      m.head.addScaledVector(m.dir, dt * 34);
      const len = 3.2 * Math.min(1, m.life * 2);
      a.setXYZ(0, m.head.x, m.head.y, m.head.z);
      a.setXYZ(1, m.head.x - m.dir.x * len, m.head.y - m.dir.y * len, m.head.z - m.dir.z * len);
      a.needsUpdate = true;
    }
  });

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <lineSegments key={i} ref={(el) => { lines.current[i] = el; }} frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[new Float32Array([0, -9999, 0, 0, -9999, 0]), 3]} />
            <bufferAttribute attach="attributes-color" args={[new Float32Array([1, 1, 1, 0, 0, 0]), 3]} />
          </bufferGeometry>
          <lineBasicMaterial vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} fog={false} />
        </lineSegments>
      ))}
    </>
  );
}

// ───────────────────────── Arrivals ─────────────────────────

/** Set pieces assemble as the camera approaches: scale up with a spin-in, about their own centre. */
export function Arrive({ at, children, near = 15, far = 30 }: { at: [number, number, number]; children: ReactNode; near?: number; far?: number }) {
  const g = useRef<THREE.Group>(null);
  const center = useMemo(() => new THREE.Vector3(...at), [at]);
  useFrame(({ camera }, dt) => {
    const el = g.current;
    if (!el) return;
    const a = MOTION ? 1 - smooth(near, far, camera.position.distanceTo(center)) : 1;
    const s = THREE.MathUtils.lerp(el.scale.x, Math.max(0.001, a), Math.min(1, dt * 3));
    el.scale.setScalar(s);
    el.rotation.y = (1 - s) * 1.4;
    el.visible = s > 0.01;
  });
  return (
    <group position={at}>
      <group ref={g}>
        <group position={[-at[0], -at[1], -at[2]]}>{children}</group>
      </group>
    </group>
  );
}

// ───────────────────────── Post-processing ─────────────────────────

/** Bloom, film grain and vignette, with chromatic aberration and bloom that swell with speed. */
export function CineEffects({ lite = false }: { lite?: boolean }) {
  const day = useDaylight();
  const ca = useRef<ChromaticAberrationEffect>(null);
  const bloom = useRef<BloomEffect>(null);
  const offset = useMemo(() => new THREE.Vector2(0.0004, 0.0004), []);
  useFrame(() => {
    const s = Math.min(cine.speed / 40, 1) * MOTION;
    ca.current?.offset.set(0.0004 + s * 0.0035, 0.0004 + s * 0.002);
    if (bloom.current) bloom.current.intensity = (day ? 0.45 : 1.15) + s * 0.9;
  });
  // Phones get bloom + vignette only; aberration and grain are full-screen passes they can't spare.
  if (lite)
    return (
      <EffectComposer multisampling={0} resolutionScale={0.75}>
        <Bloom ref={bloom} mipmapBlur intensity={1.15} luminanceThreshold={0.15} luminanceSmoothing={0.3} />
        <Vignette offset={0.22} darkness={0.82} />
      </EffectComposer>
    );
  return (
    <EffectComposer multisampling={0}>
      <Bloom ref={bloom} mipmapBlur intensity={1.15} luminanceThreshold={0.15} luminanceSmoothing={0.3} />
      <ChromaticAberration ref={ca} offset={offset} radialModulation modulationOffset={0.25} blendFunction={BlendFunction.NORMAL} />
      <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.18} />
      <Vignette offset={0.22} darkness={0.82} />
    </EffectComposer>
  );
}
