"use client";

import { Float, Html, MeshDistortMaterial, PerformanceMonitor, Sparkles } from "@react-three/drei";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import snapshot from "@/content/snapshot.json";
import { home, places } from "@/content/life";
import { bus } from "@/lib/bus";
import { useDaylight } from "@/lib/theme";
import { Arrive, CineEffects, CineRig, Nebulae, ShootingStars, WarpField, type Station } from "./Cinema";
import { spriteTexture } from "./textures";

// Clicks only count when they land on empty space, never on page content.
const onEmptySpace = (e: ThreeEvent<MouseEvent | PointerEvent>) =>
  !(e.nativeEvent.target as HTMLElement | null)?.closest("a,button,input,iframe,.glass,h1,h2,h3,p,li");

const STAR_REPOS = (snapshot.repos as { name: string; fork: boolean; html_url: string }[]).filter((r) => !r.fork);

// One persistent 3D world behind the page. The camera flies along -Z as you scroll;
// each chapter has its own set piece waiting at a station on that path.

// Respect reduced-motion: scroll still drives the camera, but ambient spin stops.
const MOTION = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1;

const PALETTE = ["#22D3EE", "#A78BFA", "#F472B6", "#FBBF24", "#34D399", "#60A5FA", "#FB923C"];

// Camera stations, one per DOM section (same order as SECTIONS).
const SECTIONS = ["top", "journey", "origins", "inflection", "work", "anshap", "anshap-hold", "agents", "life", "pulse", "contact"] as const;
// Each look-at sits ~4.5 units left of its set piece, so the 3D lives on the open right side.
const STATIONS: Station[] = [
  { pos: [0, 0.6, 10], look: [-0.8, 0, 0] },
  { pos: [3, 7, 9], look: [4, -1, 0] }, // journey: rise above the galaxy and look down on it
  { pos: [-2, 3, 2], look: [2, -1, -8] },
  { pos: [-1, 1, -16], look: [1.5, 0, -28] },
  { pos: [0, 0.5, -30], look: [1.5, 0, -42] },
  { pos: [0, 0, -64], look: [1.5, 0, -76] },
  { pos: [-0.5, 0.6, -65.5], look: [1.8, 0, -76] }, // hold on Noa through the simulator + safety layers
  { pos: [0, 0.5, -94], look: [1.5, 0, -106] },
  { pos: [0, 1, -120], look: [1.5, 0, -134] },
  { pos: [0, 1.5, -146], look: [0.5, -1.5, -161] },
  { pos: [0, 2, -167], look: [0, 1, -200] },
];

// Colour grade per station: the fog/background tint the camera drifts through.
const GRADES = ["#05061a", "#07051c", "#060a1c", "#0c0720", "#14061a", "#03141a", "#03141a", "#160c05", "#170818", "#031318", "#0a0614"];

const rand = (() => {
  let s = 11;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
})();

/** Spiral galaxy: dust + one bright star per public repository. */
function Galaxy({ narrow, sprite }: { narrow: boolean; sprite: THREE.Texture }) {
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState<{ i: number; p: THREE.Vector3 } | null>(null);
  // In daylight the sky is inverted, so a bright core would read as a dark stain: keep it faint.
  const day = useDaylight();
  // Portal labels into the unfiltered overlay (the canvas itself is colour-inverted in daylight).
  const canvasParent = useThree((st) => st.gl.domElement.parentElement);
  const portal = useMemo(
    () => ({ current: (document.getElementById("universe-overlay") ?? canvasParent) as HTMLElement }),
    [canvasParent],
  );
  const { dust, stars } = useMemo(() => {
    const N = narrow ? 5000 : 12000;
    const arms = 4;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const inner = new THREE.Color("#FDE68A");
    const c = new THREE.Color();
    for (let i = 0; i < N; i++) {
      const r = Math.pow(rand(), 1.6) * 9;
      const arm = ((i % arms) / arms) * Math.PI * 2;
      const spin = r * 0.55;
      const spread = (1 - r / 12) * 0.9;
      const jitter = () => Math.pow(rand(), 3) * (rand() < 0.5 ? -1 : 1) * spread * (0.3 + r * 0.25);
      pos[i * 3] = Math.cos(arm + spin) * r + jitter();
      pos[i * 3 + 1] = jitter() * 0.35;
      pos[i * 3 + 2] = Math.sin(arm + spin) * r + jitter();
      c.set(PALETTE[i % arms === 0 ? 1 : i % arms === 1 ? 0 : i % arms === 2 ? 2 : 5]).lerp(inner, Math.max(0, 1 - r / 2.5));
      col.set([c.r, c.g, c.b], i * 3);
    }
    const dust = new THREE.BufferGeometry();
    dust.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    dust.setAttribute("color", new THREE.BufferAttribute(col, 3));

    const M = snapshot.total;
    const sp = new Float32Array(M * 3);
    const sc = new Float32Array(M * 3);
    for (let i = 0; i < M; i++) {
      const r = 1.5 + rand() * 7.5;
      const a = ((i % arms) / arms) * Math.PI * 2 + r * 0.55 + (rand() - 0.5) * 0.4;
      sp.set([Math.cos(a) * r, (rand() - 0.5) * 0.4, Math.sin(a) * r], i * 3);
      c.set(PALETTE[i % PALETTE.length]);
      sc.set([c.r, c.g, c.b], i * 3);
    }
    const stars = new THREE.BufferGeometry();
    stars.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    stars.setAttribute("color", new THREE.BufferAttribute(sc, 3));
    return { dust, stars };
  }, [narrow]);

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.04 * MOTION;
  });

  return (
    <group position={[narrow ? 0 : 4.2, -0.4, 0]} rotation={[0.42, 0, 0.12]}>
      <group ref={group}>
        <points geometry={dust}>
          <pointsMaterial size={0.05} map={sprite} vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.85} />
        </points>
        <points
          geometry={stars}
          onPointerMove={(e) => {
            if (e.index === undefined || !onEmptySpace(e)) return setHover(null);
            const a = stars.attributes.position;
            setHover({ i: e.index, p: new THREE.Vector3(a.getX(e.index), a.getY(e.index), a.getZ(e.index)) });
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHover(null);
            document.body.style.cursor = "";
          }}
          onClick={(e) => {
            if (e.index === undefined || !onEmptySpace(e)) return;
            const r = STAR_REPOS[e.index % STAR_REPOS.length];
            if (r) window.open(r.html_url, "_blank", "noopener");
          }}
        >
          <pointsMaterial size={0.32} map={sprite} vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
        {hover && STAR_REPOS.length > 0 && (
          <Html portal={portal} position={hover.p} center style={{ pointerEvents: "none" }} zIndexRange={[40, 0]}>
            <div className="-translate-y-8 whitespace-nowrap rounded-full border border-ink/15 bg-[var(--surface-2)] px-3 py-1 font-mono text-[11px] text-text shadow-lg">
              {STAR_REPOS[hover.i % STAR_REPOS.length].name} ↗
            </div>
          </Html>
        )}
        <mesh>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshBasicMaterial color="#FFF3C4" toneMapped={false} transparent opacity={day ? 0 : 1} />
        </mesh>
        <sprite scale={[5.5, 5.5, 1]}>
          <spriteMaterial map={sprite} color="#FFE7A8" transparent opacity={day ? 0.08 : 0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>
        <sprite scale={[16, 16, 1]}>
          <spriteMaterial map={sprite} color="#A78BFA" transparent opacity={day ? 0.05 : 0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>
      </group>
    </group>
  );
}

/** Origins: a single seed crystal — where it started. */
function Seed({ x }: { x: number }) {
  return (
    <Float speed={1.2 * MOTION} rotationIntensity={1.2} floatIntensity={1}>
      <mesh position={[x + 0.5, -1, -8]}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial color="#60A5FA" emissive="#3B82F6" emissiveIntensity={1.4} metalness={0.3} roughness={0.2} wireframe />
      </mesh>
    </Float>
  );
}

/** Straive: a rising helix of bars — the shipping cadence, one block per month. */
function CadenceHelix({ x }: { x: number }) {
  const ref = useRef<THREE.Group>(null);
  const months = useMemo(() => Object.entries(snapshot.monthly).sort(([a], [b]) => a.localeCompare(b)), []);
  const max = Math.max(...months.map(([, n]) => n));
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.25 * MOTION;
  });
  return (
    <group position={[x + 1, -2.6, -28]} ref={ref}>
      {months.map(([m, n], i) => {
        const a = (i / months.length) * Math.PI * 3;
        const h = 0.25 + (n / max) * 2.4;
        const post = m >= "2025-09";
        return (
          <mesh key={m} position={[Math.cos(a) * 3, i * 0.12 + h / 2, Math.sin(a) * 3]}>
            <boxGeometry args={[0.32, h, 0.32]} />
            <meshStandardMaterial
              color={post ? PALETTE[i % 4] : "#334155"}
              emissive={post ? PALETTE[i % 4] : "#1e293b"}
              emissiveIntensity={post ? 1.6 : 0.2}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/** Work: a ring of client demos orbiting a core, coloured by industry. */
function DemoRing({ x }: { x: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 47;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      c.set(PALETTE[i % PALETTE.length]);
      arr.set([c.r, c.g, c.b], i * 3);
    }
    return arr;
  }, []);
  useEffect(() => {
    const m = ref.current!;
    m.instanceColor = new THREE.InstancedBufferAttribute(colors, 3);
  }, [colors]);
  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.elapsedTime * MOTION;
    for (let i = 0; i < count; i++) {
      const ring = i % 3;
      const a = (i / count) * Math.PI * 2 + t * (0.15 + ring * 0.07);
      const r = 2.1 + ring * 0.85;
      dummy.position.set(Math.cos(a) * r, Math.sin(a * 2 + ring) * 0.5 + (ring - 1) * 0.6, Math.sin(a) * r);
      dummy.rotation.set(t + i, t * 0.7 + i, 0);
      dummy.scale.setScalar(0.22 + ((i * 7) % 5) * 0.03);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <group position={[x + 2.4, -1, -42]} rotation={[0.35, 0, -0.15]}>
      <instancedMesh ref={ref} args={[undefined, undefined, count]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial emissive="#ffffff" emissiveIntensity={0.25} toneMapped={false} roughness={0.3} />
      </instancedMesh>
      <mesh>
        <torusKnotGeometry args={[0.9, 0.22, 160, 24]} />
        <meshStandardMaterial color="#A78BFA" emissive="#7C3AED" emissiveIntensity={1.2} roughness={0.15} metalness={0.6} />
      </mesh>
    </group>
  );
}

/** Anshap: Noa's core, wrapped in rotating safety shields — one per layer. */
function NoaCore({ x }: { x: number }) {
  const shields = useRef<THREE.Group>(null);
  const core = useRef<THREE.Group>(null);
  const pulseAt = useRef(0);
  const [shield, setShield] = useState(-1);

  useEffect(
    () =>
      bus.subscribe(() => {
        const st = bus.get();
        setShield(st.shield);
        if (st.noaPulse > pulseAt.current) pulseAt.current = st.noaPulse;
      }),
    [],
  );

  useFrame((_, dt) => {
    shields.current?.children.forEach((c, i) => {
      const lit = i === shield;
      c.rotation.x += dt * MOTION * (0.12 + i * 0.05) * (i % 2 ? -1 : 1) * (lit ? 0.3 : 1);
      c.rotation.y += dt * MOTION * (0.2 + i * 0.03) * (lit ? 0.3 : 1);
      const target = lit ? 1.12 : 1;
      c.scale.setScalar(THREE.MathUtils.lerp(c.scale.x, target, 0.12));
    });
    // A soft "breath" after a click or a simulator decision.
    const since = (Date.now() - pulseAt.current) / 1000;
    const k = since < 1.2 ? Math.sin((since / 1.2) * Math.PI) * 0.22 : 0;
    core.current?.scale.setScalar(1 + k);
  });

  const layers = ["#22D3EE", "#A78BFA", "#F472B6", "#FBBF24", "#34D399", "#60A5FA"];
  return (
    <group position={[x, 0, -76]}>
      <group
        ref={core}
        onClick={(e) => {
          if (!onEmptySpace(e)) return;
          pulseAt.current = Date.now();
        }}
        onPointerOver={(e) => onEmptySpace(e) && (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "")}
      >
        <Float speed={1.5 * MOTION} floatIntensity={0.6}>
          <mesh>
            <sphereGeometry args={[1.5, 96, 96]} />
            <MeshDistortMaterial color="#5EEAD4" emissive="#14B8A6" emissiveIntensity={0.9} distort={0.38} speed={1.6 * MOTION} roughness={0.1} metalness={0.2} />
          </mesh>
        </Float>
      </group>
      <group ref={shields}>
        {layers.map((c, i) => (
          <mesh key={c} rotation={[i * 0.6, i * 0.9, 0]}>
            <torusGeometry args={[2.3 + i * 0.42, shield === i ? 0.07 : 0.025, 16, 160]} />
            <meshBasicMaterial color={c} toneMapped={false} transparent opacity={shield === -1 || shield === i ? 1 : 0.15} />
          </mesh>
        ))}
      </group>
      <Sparkles count={80} scale={9} size={3} speed={0.4 * MOTION} color="#99F6E4" />
    </group>
  );
}

/** Agents: specialist nodes passing signals along their edges. */
function AgentMesh({ x }: { x: number }) {
  const nodes: [number, number, number][] = [
    [0, 2.2, 0], [-2.2, 0.4, 0.6], [0, 0.4, -1], [2.2, 0.4, 0.6], [-1, -1.8, 0], [1.2, -1.8, 0],
  ];
  const edges: [number, number][] = [[0, 1], [0, 2], [0, 3], [1, 4], [2, 4], [3, 4], [4, 5]];
  const pulses = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * MOTION;
    pulses.current?.children.forEach((p, i) => {
      const [a, b] = edges[i];
      const f = (t * 0.5 + i * 0.37) % 1;
      p.position.set(...(nodes[a].map((v, k) => v + (nodes[b][k] - v) * f) as [number, number, number]));
    });
  });
  const lineGeo = useMemo(() => {
    const pts = edges.flatMap(([a, b]) => [new THREE.Vector3(...nodes[a]), new THREE.Vector3(...nodes[b])]);
    return new THREE.BufferGeometry().setFromPoints(pts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <group position={[x, 0, -106]} rotation={[0.2, -0.4, 0]}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#FB923C" transparent opacity={0.35} />
      </lineSegments>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[i === 0 ? 0.32 : 0.24, 32, 32]} />
          <meshStandardMaterial color={PALETTE[(i + 3) % PALETTE.length]} emissive={PALETTE[(i + 3) % PALETTE.length]} emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
      ))}
      <group ref={pulses}>
        {edges.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshBasicMaterial color="#FFF7ED" toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Off the clock: the solo trips as a constellation, Hyderabad at the centre, arcs drawn in light. */
function TravelConstellation({ x, sprite }: { x: number; sprite: THREE.Texture }) {
  const group = useRef<THREE.Group>(null);
  const { stars, arcs, homeP } = useMemo(() => {
    const k = 0.32; // degrees → world units
    const to = (lat: number, lon: number) => new THREE.Vector3((lon - home.lon) * k, (lat - home.lat) * k, 0);
    const homeP = to(home.lat, home.lon);
    const pos = new Float32Array(places.length * 3);
    places.forEach((p, i) => pos.set(to(p.lat, p.lon).toArray(), i * 3));
    const stars = new THREE.BufferGeometry();
    stars.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const arcs = places.map((p) => {
      const end = to(p.lat, p.lon);
      const mid = homeP.clone().add(end).multiplyScalar(0.5).add(new THREE.Vector3(0, 0, 1.6 + end.length() * 0.15));
      return new THREE.BufferGeometry().setFromPoints(new THREE.QuadraticBezierCurve3(homeP, mid, end).getPoints(40));
    });
    return { stars, arcs, homeP };
  }, []);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime * MOTION;
    group.current.rotation.y = Math.sin(t * 0.25) * 0.35 - 0.2;
    group.current.rotation.x = -0.35 + Math.sin(t * 0.18) * 0.08;
  });
  return (
    <group position={[x, 0, -134]}>
      <group ref={group}>
        {arcs.map((g, i) => (
          <line key={i}>
            <primitive object={g} attach="geometry" />
            <lineBasicMaterial color={PALETTE[i % PALETTE.length]} transparent opacity={0.85} toneMapped={false} />
          </line>
        ))}
        <points geometry={stars}>
          <pointsMaterial size={0.55} map={sprite} color="#F9A8D4" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
        <mesh position={homeP}>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshBasicMaterial color="#FBBF24" toneMapped={false} />
        </mesh>
        <sprite position={homeP} scale={[2.4, 2.4, 1]}>
          <spriteMaterial map={sprite} color="#FBBF24" transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>
      </group>
    </group>
  );
}

/** Live: a breathing field of points — the wave runs in the vertex shader, not on the CPU. */
const pulseVert = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  varying vec3 vColor;
  void main() {
    vec3 p = position;
    p.y = sin(length(p.xz) * 0.9 - uTime * 1.6) * 0.45 + sin(p.x * 0.4 + uTime) * 0.2;
    vColor = color;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const pulseFrag = /* glsl */ `
  uniform sampler2D uMap;
  varying vec3 vColor;
  void main() {
    vec4 t = texture2D(uMap, gl_PointCoord);
    gl_FragColor = vec4(vColor * t.a, t.a);
  }
`;

function PulseField({ narrow, sprite }: { narrow: boolean; sprite: THREE.Texture }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const S = narrow ? 50 : 80;
  const geo = useMemo(() => {
    const pos = new Float32Array(S * S * 3);
    const col = new Float32Array(S * S * 3);
    const c = new THREE.Color();
    for (let i = 0; i < S; i++)
      for (let j = 0; j < S; j++) {
        const k = (i * S + j) * 3;
        pos.set([(i / S - 0.5) * 22, 0, (j / S - 0.5) * 22], k);
        c.set(PALETTE[0]).lerp(new THREE.Color(PALETTE[2]), j / S);
        col.set([c.r, c.g, c.b], k);
      }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, [S]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uSize: { value: 70 }, uMap: { value: sprite } }), [sprite]);
  useFrame(({ clock, gl }) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = clock.elapsedTime * MOTION;
    mat.current.uniforms.uSize.value = 70 * gl.getPixelRatio();
  });
  return (
    <points geometry={geo} position={[narrow ? 0 : 5, -3, -161]} frustumCulled={false}>
      <shaderMaterial ref={mat} vertexShader={pulseVert} fragmentShader={pulseFrag} uniforms={uniforms} vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export default function Universe() {
  const narrow = typeof window !== "undefined" && window.innerWidth < 768;
  // Start sharp, then trade resolution for smoothness if the device can't hold the frame rate.
  const maxDpr = narrow ? 1.25 : 1.5;
  const [dpr, setDpr] = useState(maxDpr);
  const sprite = useMemo(() => spriteTexture(), []);
  const x = narrow ? 0 : 6;

  return (
    <Canvas
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
      raycaster={{ params: { Points: { threshold: 0.18 } } as THREE.RaycasterParameters }}
      dpr={dpr}
      camera={{ position: STATIONS[0].pos, fov: narrow ? 70 : 55, near: 0.1, far: 300 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      onCreated={(state) => {
        console.info(`[universe] WebGL ready in ${Math.round(performance.now())}ms since navigation`);
        if (process.env.NODE_ENV !== "production") (window as unknown as { __r3f?: unknown }).__r3f = state;
      }}
    >
      <color attach="background" args={["#05061a"]} />
      <fog attach="fog" args={["#05061a", 12, 32]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[8, 6, 4]} intensity={60} color="#A78BFA" />
      <pointLight position={[6, 2, -70]} intensity={80} color="#5EEAD4" />
      <pointLight position={[2, 4, -40]} intensity={60} color="#F472B6" />

      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(1, +(d - 0.25).toFixed(2)))}
        onIncline={() => setDpr((d) => Math.min(maxDpr, +(d + 0.25).toFixed(2)))}
        flipflops={4}
        onFallback={() => setDpr(1)}
      />
      <CineRig sections={SECTIONS} stations={STATIONS} grades={GRADES} narrow={narrow} />
      <Nebulae
        clouds={[
          { pos: [x + 10, 4, -22], scale: 60, color: "#4C1D95", opacity: 0.6 },
          { pos: [x - 18, -6, -30], scale: 46, color: "#0E7490", opacity: 0.45 },
          { pos: [x + 14, -2, -58], scale: 60, color: "#9D174D", opacity: 0.55 },
          { pos: [x + 8, 6, -96], scale: 64, color: "#0F766E", opacity: 0.65 },
          { pos: [x - 16, -4, -92], scale: 40, color: "#4338CA", opacity: 0.4 },
          { pos: [x + 12, 2, -126], scale: 56, color: "#9A3412", opacity: 0.5 },
          { pos: [x + 4, 4, -140], scale: 60, color: "#BE185D", opacity: 0.5 },
          { pos: [x + 6, -8, -180], scale: 70, color: "#155E75", opacity: 0.55 },
          { pos: [0, 10, -215], scale: 90, color: "#6D28D9", opacity: 0.5 },
        ]}
      />
      <Galaxy narrow={narrow} sprite={sprite} />
      <WarpField narrow={narrow} sprite={sprite} palette={PALETTE} />
      <ShootingStars count={narrow ? 2 : 3} />
      <Arrive at={[x + 0.5, -1, -8]} near={12} far={24}>
        <Seed x={x} />
      </Arrive>
      <Arrive at={[x + 1, -1, -28]}>
        <CadenceHelix x={x} />
      </Arrive>
      <Arrive at={[x + 2.4, -1, -42]}>
        <DemoRing x={x} />
      </Arrive>
      <Arrive at={[x, 0, -76]}>
        <NoaCore x={x} />
      </Arrive>
      <Arrive at={[x, 0, -106]}>
        <AgentMesh x={x} />
      </Arrive>
      <Arrive at={[x + 1, 0, -134]}>
        <TravelConstellation x={x + 1} sprite={sprite} />
      </Arrive>
      <Arrive at={[narrow ? 0 : 5, -3, -161]} near={14} far={34}>
        <PulseField narrow={narrow} sprite={sprite} />
      </Arrive>

      <CineEffects lite={narrow} />
    </Canvas>
  );
}
