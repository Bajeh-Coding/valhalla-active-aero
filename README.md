# Valhalla — Aerodinamică activă (congres)

Prezentare științifică oral+visual (bară AIAA/SAE) pe aerodinamica activă, demonstrată vizual cu Aston Martin Valhalla. Limbă: română. Cifrele pe ecran provin din SAE 2020-36-0079 (S1) și Machines 2024, 12, 160 (S2) — nu din marketing Valhalla.

## Arc narativ

problemă → 3 takeaways → SotA → metodă → control → rezultate → implicații → recap + bibliografie

## Comenzi

```bash
npm install
npm run dev       # Vite :5173
npm run build
npm run preview   # :4173 — cale publish-app
npm test          # Vitest (fizică paper-exact)
npm run test:e2e  # Playwright
```

## Asset-uri

Fotografii reale Valhalla în `public/images/valhalla/` (Wikimedia Commons, CC BY-SA). Zero Unsplash. Proveniența e documentată în `src/congress/assets.ts`.

## Stack

React + Vite + Tailwind + GSAP ScrollTrigger + Zustand (doar pe beat-ul de control).
