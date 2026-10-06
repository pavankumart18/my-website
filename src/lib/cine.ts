// Shared cinematic state between the 3D scene and DOM overlays (letterbox, title card).

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let decided: boolean | null = null;

/** Play the opening fly-in once per session, only from the top, never under reduced motion. */
export function shouldPlayIntro() {
  if (decided !== null) return decided;
  if (typeof window === "undefined") return false;
  let seen = false;
  try {
    seen = sessionStorage.getItem("cine-intro") === "1";
  } catch {}
  decided = !reduced() && !seen && window.scrollY < 40;
  return decided;
}

export function markIntroSeen() {
  try {
    sessionStorage.setItem("cine-intro", "1");
  } catch {}
}

export const INTRO_SECONDS = 2.8;

export const cine = {
  speed: 0, // smoothed camera speed, world units / second
  chapter: 0, // continuous station index along the flight path
  titles: false, // the opening shot has landed (or there was none): the portrait may assemble
};

