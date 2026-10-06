"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** False during SSR and hydration, true afterwards: gate anything that depends on "now". */
export function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false);
}
