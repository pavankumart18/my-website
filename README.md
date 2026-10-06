# T. Pavan Kumar — portfolio

A scroll-told story (Origins → Straive → Work → Anshap → Agents → Live) flown through a
persistent 3D universe. Next.js 16, React Three Fiber, Motion and d3-force.

- **3D:** `src/components/three/Universe.tsx` — one WebGL scene; the camera flies between
  stations as you scroll (`STATIONS`, one per section). Lazy-loaded, falls back to a static
  gradient without WebGL, and stops ambient motion under `prefers-reduced-motion`.
- **Live data:** GitHub API in the browser; `npm run build` refreshes
  `src/content/snapshot.json` first (`scripts/snapshot.mjs`), used when a visitor is rate-limited.
  Set `GITHUB_TOKEN` at build time to avoid build-machine rate limits.

## Edit content
- `src/content/profile.ts`: bio, Straive role, Anshap story + safety architecture, certifications
- `src/content/projects.ts`: featured case studies and the domain map

## Run
```bash
npm install
npm run dev
```

## Deploy
- **Vercel:** import the repo; no config needed.
- **GitHub Pages** (served at `/my-website`):
  ```bash
  NEXT_PUBLIC_BASE_PATH=/my-website npm run build   # static site in ./out
  ```
