// Single source of truth for the site's copy.
// Sources: GitHub, the old site, and Pavan's own notes (public-safe facts only —
// no internal Anshap metrics, customers or credentials).

export const profile = {
  name: "T. Pavan Kumar",
  shortName: "Pavan",
  title: "Data Science Engineer · Co-founder & CTO, Anshap",
  location: "Hyderabad, India",
  headline: "I build AI people can trust with what matters.",
  intro:
    "By day I ship applied AI for global clients at Straive. The rest of the time I'm building Anshap, an AI mental-wellness platform where the hardest engineering problem is knowing when the AI should step aside for a human.",
  github: "pavankumart18",
  // Repos updated by bots/cron jobs — excluded from "latest activity" so the live feed reflects real work.
  ignoreRepos: ["pavankumart18", "iss-tracker", "iss-tracker-new", "my-codespace-test"],
  email: "pavankumart7052@gmail.com",
  linkedin: "https://www.linkedin.com/in/pavan-kumar-958618263/",
  straive: {
    role: "Data Science Engineer",
    company: "Straive",
    promotion: "Promoted from Associate Data Science Engineer in under a year (July 2026).",
  },
};

export const anshap = {
  url: "https://www.anshap.com",
  role: "Co-founder & CTO",
  oneLine:
    "We don't sell an app. We sell the peace and clarity you lost — and the reassurance that someone is there while you get it back.",
  founderLine: "Built from lived experience: the friend that never leaves is the thing I once needed.",
  noa:
    "Noa is an AI buddy that understands you in the right words, at any hour. It isn't a therapist and never pretends to be. It reads the situation: if you can find your way with a little guidance, it walks beside you; if you can't, it brings you to someone who can.",
  ladder: [
    ["Noa", "An AI buddy for everyday clarity"],
    ["Screening", "Risk detection on every conversation"],
    ["Psychologist", "A verified, named human"],
    ["Session", "Booked care, not just a chat"],
  ] as [string, string][],
  northStar: "The north star is conversion to human care, not minutes in the app.",
  safety: [
    ["AI firewall", "Every message in and out is screened before it reaches the model, in parallel, with a crisis exemption so help is never blocked.", "#22D3EE"],
    ["Risk engine", "Reads conversations for risk using established clinical frameworks (Beck, Joiner), not keyword matching. Every score is verified.", "#A78BFA"],
    ["Crisis lock", "If real risk is detected the server takes over and fails closed. Reinstalling the app can't bypass it.", "#F472B6"],
    ["Psyche profile + Council", "A five-dimension profile reviewed by a 12-lens multi-agent council with a chair.", "#FBBF24"],
    ["k-anonymity", "Organisation dashboards are aggregate-only with K=5 suppression. No one is singled out.", "#34D399"],
    ["Verified psychologists", "Credential checks, licence re-verification and specialisation badges.", "#60A5FA"],
  ] as [string, string, string][],
  safetyLine: "The safety layer runs whether or not anyone is watching.",
  surfaces: ["Mobile app", "WhatsApp", "Website", "Noa chat", "Psychologist dashboard", "College dashboard", "Corporate dashboard", "Admin console"],
  stack: ["React Native · Expo", "Flask · FastAPI", "Socket.IO", "Docker", "GCP Cloud Run", "AWS", "Neon Postgres", "Gemini on Vertex AI", "React · Vite", "Next.js"],
};

// Everything below is from Anshap's own "LIVE = safe to market" feature list (Aug 2026).
export const anshapStory = {
  thesis: [
    "Peace, for this generation, doesn't come from a quiet place, a trip, or a good meal.",
    "It comes from thinking clearly.",
    "So Anshap's product isn't an app. It's a clear mind, and the reassurance that someone is there while you get it back.",
  ],
  waysIn: [
    { id: "app", label: "The app", line: "The full experience: Noa, screenings, mood, tools for hard moments, and booked sessions.", note: "Android · start anonymous in seconds" },
    { id: "whatsapp", label: "WhatsApp", line: "Talk to Noa, book, pay and attend a session without installing anything or creating an account.", note: "No app · no signup · the number stays private" },
    { id: "web", label: "The web", line: "Browse verified psychologists and book in a browser.", note: "anshap.com" },
  ],
  whatsappWhy:
    "The biggest drop-off in mental-health apps is \u201cinstall the app and create an account\u201d. Someone who has just admitted they need help is the worst possible moment to ask them for a password.",
  screens: [
    { src: "/images/anshap/screen-01.jpg", title: "Someone to talk to, any hour", line: "Judgement-free chat with Noa, day or night." },
    { src: "/images/anshap/screen-02.jpg", title: "Always in your corner", line: "Talk it out, reflect, reset." },
    { src: "/images/anshap/screen-03.jpg", title: "Real psychologists", line: "Verified, RCI-registered. Book when you're ready." },
    { src: "/images/anshap/screen-04.jpg", title: "See how you're really doing", line: "Mood, streaks and progress in one calm place." },
    { src: "/images/anshap/screen-05.jpg", title: "Tools for the hard moments", line: "Breathe, sleep, journal, reset." },
    { src: "/images/anshap/screen-06.jpg", title: "Start anonymous, in seconds", line: "Pick a nickname and you're in." },
  ],
  audiences: [
    {
      who: "People seeking help",
      points: ["Noa, 24/7, remembers context", "Voice conversations with Noa", "Validated screenings + mood checks", "Anonymous by design"],
      color: "#22D3EE",
    },
    {
      who: "Psychologists",
      points: ["Keep 100% of their fee", "Web + mobile dashboard", "Private clinical notes", "A clinical brief, so clients never repeat themselves"],
      color: "#A78BFA",
    },
    {
      who: "Colleges & companies",
      points: ["Aggregate-only wellbeing insight", "k-anonymity privacy floor", "Covered sessions for members", "Incident register for the Supreme Court mandate"],
      color: "#F472B6",
    },
  ],
  links: [
    { label: "Talk to Noa", href: "https://chat.anshap.com", primary: true },
    { label: "anshap.com", href: "https://www.anshap.com" },
    { label: "For psychologists", href: "https://psychologists.anshap.com" },
  ],
  // Public Anshap surfaces, pinged from the visitor's browser in the Live section.
  status: [
    { name: "anshap.com", url: "https://www.anshap.com" },
    { name: "Noa chat", url: "https://chat.anshap.com" },
    { name: "Psychologist dashboard", url: "https://psychologists.anshap.com" },
  ],
};

// Illustrative routing scenarios for the "How Noa decides" simulator.
// Not the production model: the real engine is a verified scorer, not a lookup.
export type Scenario = {
  label: string;
  message: string;
  risk: number; // 0..1, illustrative
  band: "low" | "moderate" | "high";
  route: string;
  routeLine: string;
  shield: number; // which 3D safety ring to light up
};

export const scenarios: Scenario[] = [
  {
    label: "Exam stress",
    message: "Exams start Monday and I can't focus on anything.",
    risk: 0.18,
    band: "low",
    route: "Guide, in-app",
    routeLine: "Noa walks beside them: a short grounding exercise, a focus plan, and a check-in tomorrow.",
    shield: 0,
  },
  {
    label: "Weeks of poor sleep",
    message: "Work has me so anxious I've barely slept for three weeks.",
    risk: 0.52,
    band: "moderate",
    route: "Suggest a psychologist",
    routeLine: "Noa keeps supporting them, and surfaces verified psychologists with open slots. A clinical brief goes with the booking.",
    shield: 3,
  },
  {
    label: "Signs of crisis",
    message: "I don't see the point of anything anymore.",
    risk: 0.91,
    band: "high",
    route: "Crisis protocol · human now",
    routeLine: "The server-side gate takes over. Crisis resources come first, and a human is brought in. The AI steps aside.",
    shield: 2,
  },
];

export const toolkit = [
  "Python", "SQL", "ML / DL", "PyTorch", "RAG", "Multi-agent systems", "AI safety & guardrails", "Prompt engineering",
  "Flask", "FastAPI", "React", "Next.js", "React Native", "Docker", "AWS", "GCP · Cloud Run · Vertex", "Postgres", "Data pipelines", "D3 · data viz",
];

export type Cert = { title: string; issuer: string; image: string; points: string[] };

export const certs: Cert[] = [
  {
    title: "Associate Cloud Engineer",
    issuer: "Google Cloud",
    image: "/images/cloud.png",
    points: ["Cloud architecture & deployment", "Security best practices", "Monitoring and optimisation"],
  },
  {
    title: "Data Science",
    issuer: "Infosys Springboard",
    image: "/images/science.png",
    points: ["Analysis & visualisation", "ML algorithms", "Python, R and SQL"],
  },
  {
    title: "AI & ML Virtual Internship",
    issuer: "MathWorks",
    image: "/images/mathworks.png",
    points: ["AI/ML fundamentals", "Model development in MATLAB", "Real-world applications"],
  },
  {
    title: "Code Vipassana",
    issuer: "Google Developer Groups",
    image: "/images/vipassana.png",
    points: ["Data processing at scale", "AI on Google Cloud / Vertex AI", "Cloud-native AI solutions"],
  },
];

export type EarlyProject = { name: string; repo: string; line: string; stack: string };

export const earlyProjects: EarlyProject[] = [
  {
    name: "News Aggregator & Summarizer",
    repo: "News-Aggregator-and-Summarizer",
    line: "Ad-free news collected from top sources and summarised with the ChatGPT API.",
    stack: "MERN · OpenAI",
  },
  {
    name: "Smart Hair",
    repo: "Smart-Hair",
    line: "Classifies face shape into five categories and recommends flattering hairstyles.",
    stack: "Python · ML",
  },
  {
    name: "Climate Cast",
    repo: "Climate-Cast",
    line: "Trend analysis of climate data with regional impact assessment.",
    stack: "Data analysis",
  },
  {
    name: "Study Buddy",
    repo: "Studybuddy",
    line: "Permission-based discussion rooms for student study groups.",
    stack: "Django",
  },
  {
    name: "Student Portal",
    repo: "Student-Portal",
    line: "Notes, assignments, events and timetable in one place.",
    stack: "JavaScript",
  },
  {
    name: "Reservation Systems",
    repo: "Railway-Ticket-Reservation-System",
    line: "Bus and rail seat allocation with safety-aware, gender-based adjacency rules.",
    stack: "Python",
  },
];
