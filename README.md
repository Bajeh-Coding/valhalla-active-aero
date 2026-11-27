# Valhalla Active Aero

Interactive scrollytelling web app for Aston Martin Valhalla active aerodynamics (Phase 1 architecture scaffold).

## Project root

```
/agent/valhalla-active-aero
```

## Commands

```bash
cd /agent/valhalla-active-aero
npm install
npm run fetch-assets  # Download chapter photos → public/images/ (also postinstall)
npm run dev           # Vite dev server (host: all interfaces, port 5173)
npm run build         # Typecheck + production SPA build → dist/
npm run preview       # Serve dist/ (host: all interfaces, port 4173) — publish-app path
npm test              # Vitest (physics/telemetry)
npm run test:e2e      # Playwright
```

Chapter photography lives in `public/images/` (`hero-valhalla`, `side-aero`, `rear-wing`, `track-nurburgring`). If download is blocked, the UI falls back to Unsplash CDN URLs.

Production preview binds all interfaces (`--host`) so Cursor `publish-app` and external devices can reach the SPA. No localhost-only asset URLs.

Ground-truth constants: `src/data/vehicleConstants.ts` (from master-spec only).
