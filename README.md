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
npm run dev       # Vite dev server (host: all interfaces, port 5173)
npm run build     # Typecheck + production SPA build → dist/
npm run preview   # Serve dist/ (host: all interfaces, port 4173) — publish-app path
npm test          # Vitest (physics/telemetry — Phase 2+)
npm run test:e2e  # Playwright (Phase 5)
```

Production preview binds all interfaces (`--host`) so Cursor `publish-app` and external devices can reach the SPA. No localhost-only asset URLs.

Ground-truth constants: `src/data/vehicleConstants.ts` (from master-spec only).
