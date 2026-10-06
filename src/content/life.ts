// "Off the clock": hobbies. Places are Pavan's real solo trips (as of Oct 2026).

export type Place = { id: string; name: string; region: string; lat: number; lon: number; note: string };

export const home = { name: "Hyderabad", lat: 17.385, lon: 78.4867 };

export const places: Place[] = [
  { id: "mysuru", name: "Mysuru", region: "Karnataka", lat: 12.2958, lon: 76.6394, note: "Palaces, old streets and slow mornings." },
  { id: "jamnagar", name: "Jamnagar", region: "Gujarat", lat: 22.4707, lon: 70.0577, note: "On the road west, toward the coast." },
  { id: "dwarka", name: "Dwarka", region: "Gujarat", lat: 22.2394, lon: 68.9678, note: "Where I learned that peace comes from a clear mind, not a place." },
  { id: "varanasi", name: "Varanasi", region: "Uttar Pradesh", lat: 25.3176, lon: 82.9739, note: "The ghats at dawn. The oldest living city." },
  { id: "dharamshala", name: "Dharamshala", region: "Himachal Pradesh", lat: 32.219, lon: 76.3234, note: "Mountain air and a different pace of life." },
  { id: "mcleodganj", name: "McLeod Ganj", region: "Himachal Pradesh", lat: 32.2426, lon: 76.3213, note: "Prayer flags, cafés and the Dhauladhars." },
  { id: "triund", name: "Triund", region: "Himachal Pradesh", lat: 32.259, lon: 76.355, note: "The trek: about 2,850 m up, alone, one step at a time." },
];

export const lifeIntro =
  "I travel alone to clear my head, sketch to slow down, dance to get out of it, and I've just started piano: the most honest place to be a beginner again.";
