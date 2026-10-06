// Tiny shared state between the DOM and the 3D scene (e.g. hover a safety layer → its ring glows).
type Listener = () => void;

const state = { shield: -1, noaPulse: 0 };
const listeners = new Set<Listener>();

export const bus = {
  get: () => state,
  set(patch: Partial<typeof state>) {
    Object.assign(state, patch);
    listeners.forEach((l) => l());
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};
