"use client";

import { useEffect, useState } from "react";
import snapshot from "@/content/snapshot.json";
import { dayLabel } from "./dates";
import { profile } from "@/content/profile";

export type Repo = {
  name: string;
  html_url: string;
  homepage: string | null;
  description: string | null;
  language: string | null;
  pushed_at: string;
  created_at: string;
  fork: boolean;
};

export type GHEvent = { type: string; created_at: string; repo: { name: string } };

export type GitHubState = {
  status: "loading" | "live" | "snapshot";
  repos: Repo[];
  events: GHEvent[];
  monthly: Record<string, number>;
  total: number;
  fetchedMs?: number;
};

export const snapshotDate = dayLabel(snapshot.generatedAt);

const CACHE_KEY = "gh-cache-v1";
const TTL = 10 * 60 * 1000;

function monthlyFrom(repos: Repo[]) {
  const m: Record<string, number> = {};
  for (const r of repos) {
    if (r.fork || r.name === profile.github) continue; // the profile README repo isn't a project
    const k = r.created_at.slice(0, 7);
    m[k] = (m[k] || 0) + 1;
  }
  return m;
}

const fallback: GitHubState = {
  status: "snapshot",
  repos: snapshot.repos as Repo[],
  events: [],
  monthly: snapshot.monthly,
  total: snapshot.total,
};

// One shared request per page load, however many components subscribe.
let inflight: Promise<GitHubState> | null = null;

async function load(): Promise<GitHubState> {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const c = JSON.parse(cached) as GitHubState & { at: number };
      if (Date.now() - c.at < TTL) return c;
    }
  } catch {}

  const t0 = performance.now();
  const base = `https://api.github.com/users/${profile.github}`;
  const [reposRes, eventsRes] = await Promise.all([
    fetch(`${base}/repos?per_page=100&sort=pushed`),
    fetch(`${base}/events/public?per_page=100`),
  ]);
  if (!reposRes.ok) throw new Error(`GitHub ${reposRes.status}`);
  const repos = (await reposRes.json()) as Repo[];
  const events = eventsRes.ok ? ((await eventsRes.json()) as GHEvent[]) : [];
  const fetchedMs = Math.round(performance.now() - t0);
  console.info(`[github] fetched ${repos.length} repos, ${events.length} events in ${fetchedMs}ms`);

  const state: GitHubState = {
    status: "live",
    repos,
    events,
    monthly: monthlyFrom(repos),
    total: repos.length,
    fetchedMs,
  };
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ...state, at: Date.now() }));
  } catch {}
  return state;
}

export function useGitHub(): GitHubState {
  const [state, setState] = useState<GitHubState>({ ...fallback, status: "loading" });
  useEffect(() => {
    let alive = true;
    inflight ??= load().catch((e) => {
      console.warn("[github] falling back to snapshot:", e);
      return fallback;
    });
    inflight.then((s) => alive && setState(s));
    return () => {
      alive = false;
    };
  }, []);
  return state;
}

/** Repos that reflect real, human work: no forks, no bot-updated repos. */
export const workRepos = (repos: Repo[]) => repos.filter((r) => !r.fork && !profile.ignoreRepos.includes(r.name));

export function timeAgo(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  const units: [number, string][] = [
    [86400 * 30, "mo"],
    [86400 * 7, "w"],
    [86400, "d"],
    [3600, "h"],
    [60, "m"],
  ];
  for (const [n, u] of units) if (s >= n) return `${Math.floor(s / n)}${u} ago`;
  return "just now";
}
