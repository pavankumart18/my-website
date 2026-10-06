// A periodic-table tile. Used to spell part of a name the way a certain chemistry teacher's credits did.
const ELEMENTS: Record<string, { n: number; name: string; mass: string }> = {
  Pa: { n: 91, name: "Protactinium", mass: "231.04" },
  V: { n: 23, name: "Vanadium", mass: "50.942" },
};

export function ElementTile({ s, size = "md" }: { s: keyof typeof ELEMENTS; size?: "sm" | "md" }) {
  const e = ELEMENTS[s];
  const box = size === "sm" ? "h-[1.55em] min-w-[1.55em] px-[0.2em] text-[0.95em]" : "h-[1.7em] min-w-[1.7em] px-[0.22em] text-[1em]";
  return (
    <span
      title={`${e.name} · ${e.n}`}
      className={`group/el relative mx-[0.08em] inline-flex normal-case items-center justify-center rounded-[0.18em] border border-[#4ade80]/60 bg-gradient-to-br from-[#14532d] to-[#166534] align-[-0.3em] font-semibold tracking-normal text-[#f0fdf4] shadow-[0_0_14px_-4px_#4ade80] transition hover:shadow-[0_0_22px_-2px_#4ade80] ${box}`}
    >
      <span className="absolute left-[0.12em] top-[0.02em] text-[0.32em] font-medium opacity-80">{e.n}</span>
      {s}
      <span className="pointer-events-none absolute -bottom-[1.9em] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#14532d] px-2 py-0.5 font-mono text-[10px] normal-case tracking-normal text-[#bbf7d0] opacity-0 transition group-hover/el:opacity-100">
        {e.name} · {e.mass}
      </span>
    </span>
  );
}

/** "Pavan" with Pa and V as element tiles. */
export function ChemName({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <span className="whitespace-nowrap">
      <ElementTile s="Pa" size={size} />
      <ElementTile s="V" size={size} />
      <span className="ml-[0.04em]">an</span>
    </span>
  );
}
