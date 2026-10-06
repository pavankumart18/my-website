"use client";

import { useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
};

/** True when the daylight theme is active. Usable inside the 3D scene. */
export function useDaylight() {
  return useSyncExternalStore(subscribe, () => document.documentElement.dataset.theme === "light", () => false);
}
