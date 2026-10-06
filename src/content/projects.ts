// Project data. Figures come from each repo's README; demo datasets are synthetic
// and are labelled as such on the page. Clients are described by industry, never named.

export type DomainId = "health" | "edu" | "industry" | "media" | "finance" | "data" | "agents";

export const domains: Record<DomainId, { label: string; color: string }> = {
  health: { label: "Healthcare & life sciences", color: "#6EE7B7" },
  edu: { label: "Education", color: "#93C5FD" },
  industry: { label: "Energy & industry", color: "#FCD34D" },
  media: { label: "Media, sport & ads", color: "#F9A8D4" },
  finance: { label: "Finance & documents", color: "#C4B5FD" },
  data: { label: "Data stories & benchmarks", color: "#67E8F9" },
  agents: { label: "Agents & tooling", color: "#FDBA74" },
};

export type Featured = {
  repo: string;
  name: string;
  domain: DomainId;
  problem: string;
  built: string;
  metrics: { value: string; label: string }[];
  live?: string;
  note?: string;
};

const pages = (repo: string) => `https://pavankumart18.github.io/${repo}/`;

export const featured: Featured[] = [
  {
    repo: "hcp-network-intelligence-workbench",
    name: "HCP Network Intelligence",
    domain: "health",
    problem:
      "A pharma launch team needs to know who actually influences stroke-care adoption inside a health network, but the truth is split across six inconsistent data sources.",
    built:
      "An end-to-end workbench: source profiling, identity-resolution rules, a staged pipeline, an interactive influence network and a grounded Q&A assistant.",
    metrics: [
      { value: "820", label: "HCPs resolved" },
      { value: "3,108", label: "network edges" },
      { value: "6", label: "sources unified" },
    ],
    live: pages("hcp-network-intelligence-workbench"),
    note: "Synthetic data",
  },
  {
    repo: "cricket",
    name: "Cricket Scouting Intelligence",
    domain: "media",
    problem:
      "Auction markets misprice players with thin IPL records. Can a context-adjusted model find them before the market does?",
    built:
      "A player-value engine on ball-by-ball data across five T20 leagues. Predictions were frozen before the IPL 2025 auction and checked against the season.",
    metrics: [
      { value: "1.8M", label: "deliveries modelled" },
      { value: "75%", label: "validated hit rate" },
      { value: "50%", label: "random baseline" },
    ],
    live: "https://cricket-scouting-intelligence.streamlit.app/",
  },
  {
    repo: "ocr-benchmark-analysis",
    name: "Financial OCR Benchmark",
    domain: "finance",
    problem:
      "Which OCR engine should a finance team trust on receipts, SEC filings and degraded scans? Vendor claims don't answer that.",
    built:
      "A benchmark of local and LLM-based OCR on financial documents, scored by independent AI judges, with an interactive results dashboard.",
    metrics: [
      { value: "8", label: "models" },
      { value: "50", label: "documents" },
      { value: "2,000", label: "judged evaluations" },
    ],
    live: pages("ocr-benchmark-analysis"),
  },
  {
    repo: "data-harmonization",
    name: "Data Harmonization Tower",
    domain: "data",
    problem:
      "The same product, district or outlet appears under different IDs, spellings and units across every system. Nobody trusts the totals.",
    built:
      "A five-stage pipeline that ingests, canonicalises and AI-self-heals fragmented records into golden records, shown across three industry scenarios.",
    metrics: [
      { value: "91%", label: "dedup ratio" },
      { value: "64 → 6", label: "records → golden SKUs" },
      { value: "3", label: "industry scenarios" },
    ],
    live: pages("data-harmonization"),
    note: "Synthetic data",
  },
  {
    repo: "clearing-triage",
    name: "Clearing Triage Agent",
    domain: "edu",
    problem:
      "On A-level Results Day, university clearing teams field thousands of anxious calls in hours. Where could an AI agent help without replacing people?",
    built:
      "A shadow-mode triage agent: live conversation playback, a wellbeing escalation protocol, a vacancy explorer and an end-of-day retrospective.",
    metrics: [
      { value: "7", label: "student scenarios" },
      { value: "40", label: "courses mirrored" },
      { value: "Shadow", label: "mode, not replacement" },
    ],
    live: pages("clearing-triage"),
    note: "Mocked student data",
  },
  {
    repo: "wps-nuclear-demo",
    name: "WeldAssign AI",
    domain: "industry",
    problem:
      "In a nuclear facility, assigning a welder means checking every job against the welding procedure spec and each welder's qualifications. One mistake is costly.",
    built:
      "A supervisor workflow that extracts specification fields from PDFs, validates jobs, ranks eligible welders with explainable reasoning and flags exceptions.",
    metrics: [
      { value: "8", label: "workflow steps" },
      { value: "PDF → ticket", label: "end to end" },
      { value: "Explained", label: "every ranking" },
    ],
    live: pages("wps-nuclear-demo"),
  },
];

// Every recent project, for the domain map. `live` = has a public demo on GitHub Pages.
export type MapProject = { repo: string; domain: DomainId; live?: string };

const p = (repo: string, domain: DomainId, live = true): MapProject => ({
  repo,
  domain,
  live: live ? pages(repo) : undefined,
});

export const mapProjects: MapProject[] = [
  p("hcp-network-intelligence-workbench", "health"),
  p("clinical-data-review", "health"),
  p("deal-engine", "health"),
  p("clearing-triage", "edu"),
  p("school-compliance-checker", "edu"),
  p("school-compliance-demo", "edu"),
  p("School-Dashboard", "edu"),
  p("SCAN-Dashboard", "edu"),
  p("parent-feedback-analysis", "edu"),
  p("school-level-data-analysis", "edu"),
  p("learn-with-ai", "edu"),
  p("lean-with-claude", "edu"),
  p("wps-nuclear-demo", "industry"),
  p("ai-ros", "industry"),
  p("ai-blender-design-journey", "industry"),
  p("3d-benchmark-analysis", "industry"),
  p("ad-ops-copilot", "media"),
  p("ad-campaign-engine", "media"),
  p("adtech-engine", "media"),
  p("merlin-kpi-compass", "media"),
  p("comic-transcriptions", "media"),
  p("cricket", "media", false),
  { repo: "f1", domain: "media", live: "https://f1-rose.vercel.app" },
  p("ocr-benchmark-analysis", "finance"),
  p("automated-form-filling", "finance"),
  p("Credit-Card-Management-System", "finance", false),
  p("loan-approval-application", "finance", false),
  p("data-harmonization", "data"),
  p("frontierscience-viz", "data"),
  p("animated-data-insights", "data"),
  p("svg-generation-analysis", "data"),
  p("sql-analysis", "data"),
  p("curio-ledger", "data"),
  p("visual-biography", "data"),
  p("indesign-journey", "data"),
  p("client-demo-skills", "agents", false),
  p("agents", "agents", false),
  p("agent-builder", "agents"),
  p("Agent-flow-builder", "agents"),
  p("LLM-Cabinet", "agents", false),
  p("parallel-editing", "agents"),
  p("ai-card-studio", "agents"),
  p("matlab-mcp", "agents"),
  p("mcp_server", "agents", false),
  p("Gemini-RAG", "agents", false),
  p("lewm-demos", "agents"),
  p("form", "agents"),
];

export const agentWork = [
  {
    repo: "client-demo-skills",
    name: "Client Demo Skills",
    line: "Nine installable Claude Code skills distilled from ~100 principles of a team that shipped a client demo almost every day.",
  },
  {
    repo: "agents",
    name: "Agent Skills + Global Memory",
    line: "Portable working habits for coding agents: when to act, when to ask, and how to verify before claiming done.",
  },
  {
    repo: "agent-builder",
    name: "Agent Builder",
    line: "Client-side multi-agent orchestrator: plans specialist agents, runs independent stages in parallel and draws the live execution graph.",
  },
  {
    repo: "LLM-Cabinet",
    name: "The Cabinet",
    line: "Planner, Researcher, Engineer, Analyst, Synthesizer and Critic agents, with a one-call decider routing models per role.",
  },
  {
    repo: "parallel-editing",
    name: "ParallelEdit",
    line: "Humans and sandboxed AI agents co-editing long documents in real time over Yjs and WebRTC.",
  },
  {
    repo: "ai-card-studio",
    name: "AI Card Studio",
    line: "Claude Managed Agents running real work in a cloud container and saving the results as interactive cards.",
  },
];
