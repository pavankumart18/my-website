// Refreshes src/content/snapshot.json from the GitHub API before each build.
// The site fetches live data in the browser; this snapshot is the fallback when
// a visitor is rate-limited. On any failure the existing snapshot is kept.
import { readFileSync, writeFileSync } from "node:fs";

const USER = "pavankumart18";
const FILE = new URL("../src/content/snapshot.json", import.meta.url);
const t0 = Date.now();

try {
  const headers = process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {};
  const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`, { headers });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  const all = await res.json();
  const repos = all.map(({ name, html_url, homepage, description, language, pushed_at, created_at, fork }) => ({
    name, html_url, homepage, description, language, pushed_at, created_at, fork,
  }));
  const monthly = {};
  for (const r of repos) {
    if (r.fork || r.name === USER) continue;
    const k = r.created_at.slice(0, 7);
    monthly[k] = (monthly[k] || 0) + 1;
  }
  const sorted = Object.fromEntries(Object.entries(monthly).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(FILE, JSON.stringify({ generatedAt: new Date().toISOString(), total: repos.length, monthly: sorted, repos }, null, 1));
  console.log(`[snapshot] ${repos.length} repos written in ${Date.now() - t0}ms`);
} catch (e) {
  const prev = JSON.parse(readFileSync(FILE, "utf8"));
  console.warn(`[snapshot] kept existing snapshot from ${prev.generatedAt} (${e.message}) after ${Date.now() - t0}ms`);
}
