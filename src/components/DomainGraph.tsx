"use client";

import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY, type SimulationNodeDatum } from "d3-force";
import { useInView } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { domains, mapProjects, type DomainId } from "@/content/projects";

type Node = SimulationNodeDatum & { id: string; domain: DomainId; hub: boolean; href?: string };

export function DomainGraph() {
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { once: true, margin: "-100px" });
  const [size, setSize] = useState({ w: 900, h: 560 });
  const [nodes, setNodes] = useState<Node[]>([]);
  const [hover, setHover] = useState<string | null>(null);
  const [focus, setFocus] = useState<DomainId | null>(null);

  useEffect(() => {
    const el = wrap.current!;
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      setSize({ w, h: w < 640 ? 820 : 560 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const graph = useMemo(() => {
    const hubs: Node[] = (Object.keys(domains) as DomainId[]).map((d) => ({ id: `hub:${d}`, domain: d, hub: true }));
    const leaves: Node[] = mapProjects.map((p) => ({
      id: p.repo,
      domain: p.domain,
      hub: false,
      href: p.live ?? `https://github.com/pavankumart18/${p.repo}`,
    }));
    const links = leaves.map((l) => ({ source: l.id, target: `hub:${l.domain}` }));
    return { all: [...hubs, ...leaves], links };
  }, []);

  useEffect(() => {
    if (!inView) return;
    const { w, h } = size;
    const t0 = performance.now();
    const all = graph.all.map((n) => ({ ...n, x: w / 2 + (Math.random() - 0.5) * 40, y: h / 2 + (Math.random() - 0.5) * 40 }));
    const narrow = w < 640;
    // On phones, pin hubs in a zig-zag column so clusters stack legibly.
    const hubIds = Object.keys(domains);
    const slot = (d: Node) => hubIds.indexOf(d.domain);
    const tx = (d: Node) => (narrow && d.hub ? w * (slot(d) % 2 ? 0.66 : 0.34) : w / 2);
    const ty = (d: Node) => (narrow && d.hub ? 70 + ((h - 130) * slot(d)) / (hubIds.length - 1) : h / 2);
    const sim = forceSimulation<Node>(all)
      .force("link", forceLink<Node, { source: string; target: string }>(graph.links.map((l) => ({ ...l }))).id((d) => d.id).distance(narrow ? 34 : 66).strength(0.9))
      .force("charge", forceManyBody<Node>().strength((d) => (d.hub ? (narrow ? -120 : -900) : -50)))
      .force("collide", forceCollide<Node>((d) => (d.hub ? 26 : 9)))
      .force("x", forceX<Node>(tx).strength((d) => (narrow ? (d.hub ? 0.9 : 0) : 0.05)))
      .force("y", forceY<Node>(ty).strength((d) => (narrow ? (d.hub ? 0.9 : 0) : 0.09)));
    if (!narrow) sim.force("center", forceCenter(w / 2, h / 2));
    let raf = 0;
    sim.on("tick", () => {
      for (const n of all) {
        n.x = Math.max(24, Math.min(w - 24, n.x!));
        n.y = Math.max(36, Math.min(h - 44, n.y!));
      }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setNodes([...all]));
    });
    sim.on("end", () => console.info(`[graph] settled in ${Math.round(performance.now() - t0)}ms`));
    return () => {
      sim.stop();
      cancelAnimationFrame(raf);
    };
  }, [inView, size, graph]);

  const byId = new Map(nodes.map((n) => [n.id, n]));
  const dim = (d: DomainId) => (focus && focus !== d ? 0.12 : 1);
  const hovered = hover ? byId.get(hover) : undefined;

  return (
    <div className="rounded-2xl border hairline glass">
      <div className="flex flex-wrap gap-2 border-b hairline p-4 sm:p-5">
        {(Object.keys(domains) as DomainId[]).map((d) => {
          const n = mapProjects.filter((p) => p.domain === d).length;
          return (
            <button
              key={d}
              onClick={() => setFocus(focus === d ? null : d)}
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition ${
                focus === d ? "border-line-strong bg-ink/[0.07] text-text" : "border-line text-muted hover:text-text"
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: domains[d].color }} />
              {domains[d].label}
              <span className="font-mono text-faint">{n}</span>
            </button>
          );
        })}
      </div>
      <div ref={wrap} className="relative">
        <svg width={size.w} height={size.h} className="block" role="img" aria-label="Network of projects grouped by industry domain">
          {graph.links.map((l) => {
            const a = byId.get(l.source), b = byId.get(l.target);
            if (!a || !b) return null;
            return (
              <line key={l.source} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={domains[a.domain].color}
                strokeOpacity={0.18 * dim(a.domain) * (hover === a.id ? 3 : 1)} />
            );
          })}
          {nodes.map((n) =>
            n.hub ? (
              <g key={n.id} transform={`translate(${n.x},${n.y})`} opacity={dim(n.domain)} className="cursor-pointer" onClick={() => setFocus(focus === n.domain ? null : n.domain)}>
                <circle r={7} fill={domains[n.domain].color} />
                <circle r={14} fill="none" stroke={domains[n.domain].color} strokeOpacity={0.3} />
                <text y={-20} textAnchor="middle" fontSize="11" fontWeight={500} style={{ paintOrder: "stroke", fill: "var(--text)", stroke: "var(--bg)" }} strokeWidth={4}>
                  {domains[n.domain].label}
                </text>
              </g>
            ) : (
              <a key={n.id} href={n.href} target="_blank" rel="noreferrer">
                <circle
                  cx={n.x} cy={n.y} r={hover === n.id ? 6 : 4}
                  fill={domains[n.domain].color}
                  fillOpacity={(hover === n.id ? 1 : 0.7) * dim(n.domain)}
                  onMouseEnter={() => setHover(n.id)}
                  onMouseLeave={() => setHover(null)}
                  className="transition-[r]"
                />
              </a>
            ),
          )}
        </svg>
        {hovered && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-line-strong bg-bg/95 px-3 py-2 text-xs shadow-xl"
            style={{ left: hovered.x, top: (hovered.y ?? 0) - 12 }}
          >
            <p className="font-mono text-text">{hovered.id}</p>
            <p className="mt-0.5 text-muted">{domains[hovered.domain].label} · open ↗</p>
          </div>
        )}
      </div>
      <p className="border-t hairline px-4 py-3 font-mono text-[10px] tracking-wider text-faint">
        {mapProjects.length} PROJECTS · CLICK A NODE TO OPEN · CLICK A DOMAIN TO FOCUS
      </p>
    </div>
  );
}
