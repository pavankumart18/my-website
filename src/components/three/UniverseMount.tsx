"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { Letterbox } from "./Letterbox";

const Universe = dynamic(() => import("./Universe"), { ssr: false });

const noop = () => () => {};

let webgl: boolean | undefined;
function hasWebGL() {
  if (webgl !== undefined) return webgl;
  try {
    const c = document.createElement("canvas");
    webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webgl = false;
  }
  return webgl;
}

// Fixed 3D backdrop. Falls back to a static aurora gradient without WebGL.
export function UniverseMount() {
  const ok = useSyncExternalStore(noop, hasWebGL, () => false);
  return (
    <>
      <div aria-hidden className="fixed inset-0 -z-20 overflow-hidden bg-bg">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_75%_30%,rgba(167,139,250,0.22),transparent),radial-gradient(50%_40%_at_20%_80%,rgba(34,211,238,0.14),transparent)]" />
        {ok && (
          <div className="universe-canvas absolute inset-0">
            <Universe />
          </div>
        )}
        {/* Daylight: a dawn wash over the inverted sky. */}
        <div className="sky-wash pointer-events-none absolute inset-0 mix-blend-multiply bg-[radial-gradient(70%_60%_at_80%_10%,rgba(253,186,116,0.35),transparent_60%),radial-gradient(60%_50%_at_10%_90%,rgba(125,211,252,0.35),transparent_60%),linear-gradient(180deg,#fdf2f8_0%,#eef2ff_55%,#ecfeff_100%)]" />
      </div>
      {/* Labels from the 3D scene: outside the daylight filter (never inverted) and above the page text. */}
      <div id="universe-overlay" aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden" />
      {ok && <Letterbox />}
      {/* Readability scrim: darker on the text side, open on the 3D side. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(90deg,var(--scrim-a)_0%,var(--scrim-b)_45%,transparent_75%)] max-md:bg-[var(--scrim-m)]" />
    </>
  );
}
