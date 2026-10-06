// "The network I grew": technologies as neurons, builds as the synapses between them.
// Build dates come from GitHub where public; Anshap dates are approximate (marked ~).

export type Cat = "ai" | "lang" | "web" | "data" | "cloud";
export type Lane = "learn" | "anshap" | "straive" | "own";

export const cats: Record<Cat, { label: string; color: string }> = {
  ai: { label: "AI", color: "#F472B6" },
  lang: { label: "Languages", color: "#FBBF24" },
  web: { label: "Product & web", color: "#22D3EE" },
  data: { label: "Data", color: "#A78BFA" },
  cloud: { label: "Cloud", color: "#34D399" },
};

export const lanes: Record<Lane, { label: string; color: string }> = {
  learn: { label: "Learning · CBIT", color: "#60A5FA" },
  anshap: { label: "Anshap · since Mar 2024", color: "#5EEAD4" },
  straive: { label: "Straive · client AI", color: "#A78BFA" },
  own: { label: "Own builds", color: "#FB923C" },
};

export type Tech = { id: string; label: string; cat: Cat };

export const techs: Tech[] = [
  { id: "llm", label: "LLMs", cat: "ai" },
  { id: "ml", label: "ML / DL", cat: "ai" },
  { id: "rag", label: "RAG", cat: "ai" },
  { id: "agents", label: "Multi-agent", cat: "ai" },
  { id: "safety", label: "AI safety", cat: "ai" },
  { id: "coding-agents", label: "Coding agents", cat: "ai" },
  { id: "python", label: "Python", cat: "lang" },
  { id: "js", label: "JavaScript", cat: "lang" },
  { id: "ts", label: "TypeScript", cat: "lang" },
  { id: "sql", label: "SQL", cat: "lang" },
  { id: "react", label: "React", cat: "web" },
  { id: "node", label: "Node", cat: "web" },
  { id: "django", label: "Django", cat: "web" },
  { id: "flask", label: "Flask", cat: "web" },
  { id: "fastapi", label: "FastAPI", cat: "web" },
  { id: "rn", label: "React Native", cat: "web" },
  { id: "next", label: "Next.js", cat: "web" },
  { id: "webgl", label: "Three.js", cat: "web" },
  { id: "mongo", label: "MongoDB", cat: "data" },
  { id: "postgres", label: "Postgres", cat: "data" },
  { id: "viz", label: "Data viz · D3", cat: "data" },
  { id: "gcp", label: "GCP · Vertex", cat: "cloud" },
  { id: "aws", label: "AWS", cat: "cloud" },
  { id: "docker", label: "Docker", cat: "cloud" },
];

export type Build = { id: string; label: string; lane: Lane; date: string; techs: string[]; href?: string; approx?: boolean };

const gh = (r: string) => `https://github.com/pavankumart18/${r}`;

export const builds: Build[] = [
  // Learning
  { id: "news", label: "News Aggregator & Summarizer", lane: "learn", date: "2024-02", techs: ["js", "react", "node", "mongo", "llm"], href: gh("News-Aggregator-and-Summarizer") },
  { id: "hair", label: "Smart Hair · face-shape model", lane: "learn", date: "2024-02", techs: ["python", "ml"], href: gh("Smart-Hair") },
  { id: "portal", label: "Student Portal", lane: "learn", date: "2024-03", techs: ["js"], href: gh("Student-Portal") },
  { id: "climate", label: "Climate Cast", lane: "learn", date: "2024-05", techs: ["viz"], href: gh("Climate-Cast") },
  { id: "study", label: "Study Buddy", lane: "learn", date: "2024-05", techs: ["django", "python"], href: gh("Studybuddy") },
  { id: "rail", label: "Reservation engines", lane: "learn", date: "2024-06", techs: ["python"], href: gh("Railway-Ticket-Reservation-System") },
  // Anshap
  { id: "noa", label: "Noa, the AI buddy", lane: "anshap", date: "2024-03", techs: ["llm", "python", "rn"], approx: true },
  { id: "backend", label: "Anshap backend & APIs", lane: "anshap", date: "2024-04", techs: ["flask", "fastapi", "python", "postgres", "sql", "gcp", "aws", "docker"], approx: true },
  { id: "psych", label: "Psychologist dashboard", lane: "anshap", date: "2025-06", techs: ["react", "js"], approx: true },
  { id: "orgs", label: "College & corporate dashboards", lane: "anshap", date: "2026-03", techs: ["react", "sql", "postgres"], approx: true },
  { id: "risk", label: "Risk engine + 12-lens Council", lane: "anshap", date: "2026-06", techs: ["agents", "safety", "llm", "python", "gcp"], approx: true },
  { id: "firewall", label: "AI firewall", lane: "anshap", date: "2026-06", techs: ["safety", "gcp"] },
  { id: "whatsapp", label: "Noa on WhatsApp", lane: "anshap", date: "2026-08", techs: ["llm", "python", "flask"] },
  // Straive
  { id: "cabinet", label: "LLM Cabinet", lane: "straive", date: "2025-11", techs: ["agents", "llm", "python"], href: gh("LLM-Cabinet") },
  { id: "econ", label: "Animated data insights", lane: "straive", date: "2025-11", techs: ["viz", "python"], href: gh("animated-data-insights") },
  { id: "agentb", label: "Agent Builder", lane: "straive", date: "2025-12", techs: ["agents", "llm", "js"], href: gh("agent-builder") },
  { id: "school", label: "School compliance checker", lane: "straive", date: "2026-02", techs: ["llm", "js"], href: gh("school-compliance-checker") },
  { id: "harmony", label: "Data Harmonization Tower", lane: "straive", date: "2026-03", techs: ["llm", "js", "viz"], href: gh("data-harmonization") },
  { id: "ocr", label: "Financial OCR benchmark", lane: "straive", date: "2026-04", techs: ["llm", "python", "viz"], href: gh("ocr-benchmark-analysis") },
  { id: "adops", label: "AdOps Copilot", lane: "straive", date: "2026-04", techs: ["llm", "js", "viz"], href: gh("ad-ops-copilot") },
  { id: "hcp", label: "HCP Network Intelligence", lane: "straive", date: "2026-05", techs: ["js", "python", "viz", "llm"], href: gh("hcp-network-intelligence-workbench") },
  { id: "weld", label: "WeldAssign AI", lane: "straive", date: "2026-05", techs: ["js", "python", "llm"], href: gh("wps-nuclear-demo") },
  { id: "skills", label: "Client Demo Skills", lane: "straive", date: "2026-07", techs: ["coding-agents", "llm"], href: gh("client-demo-skills") },
  // Own
  { id: "rag", label: "Gemini RAG", lane: "own", date: "2025-12", techs: ["rag", "llm", "python"], href: gh("Gemini-RAG") },
  { id: "cricket", label: "Cricket Scouting Intelligence", lane: "own", date: "2026-05", techs: ["python", "ml", "viz"], href: gh("cricket") },
  { id: "f1", label: "The Pit Wall · F1", lane: "own", date: "2026-06", techs: ["next", "ts", "react"], href: gh("f1") },
  { id: "site", label: "This website", lane: "own", date: "2026-10", techs: ["next", "ts", "react", "webgl", "coding-agents"] },
];

export const milestones: { date: string; text: string }[] = [
  { date: "2024-01", text: "CBIT, AI & Data Science. Learning by building." },
  { date: "2024-02", text: "First shipped projects: a MERN news summariser and a face-shape model." },
  { date: "2024-03", text: "Anshap begins. Noa's first lines of code." },
  { date: "2024-06", text: "Rules engines, study tools, data stories: one small thing at a time." },
  { date: "2025-06", text: "Anshap grows: psychologists get their own dashboard." },
  { date: "2025-09", text: "Joins Straive. A client-facing AI demo almost every day." },
  { date: "2025-11", text: "Agents everywhere: planners, critics, councils." },
  { date: "2026-06", text: "Anshap's safety layer goes live: firewall, risk engine, council." },
  { date: "2026-07", text: "Promoted to Data Science Engineer, in under a year." },
  { date: "2026-10", text: "Now. Still growing the network." },
];

export const START = "2024-01";
export const END = "2026-10";
export const monthIndex = (d: string) => {
  const [y, m] = d.split("-").map(Number);
  const [sy, sm] = START.split("-").map(Number);
  return (y - sy) * 12 + (m - sm);
};
export const TOTAL_MONTHS = monthIndex(END);
