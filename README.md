# Valhalla Active Aero — Hybrid AM

Prezentare congres Hybrid AM: limbaj vizual Aston Martin Valhalla + știință paper-exact (SAE 2020-36-0079). RO pe UI; termeni tehnici EN păstrați. **Graficele poartă argumentul**; foto = atmosferă.

## Capitole

0 Titlu · 1 Intro (CoP/CoG, Table 3) · 2 Mecatronică (DRS/Aerobrake/MaxP) · 3 Simulare (Simulink×VI-CarRealTime, DIL) · 4 Rezultate · 5 Valhalla industrial (firewall) · 6 Galerie grafice · 7 Recap

## Comenzi

```bash
npm install
npm run dev       # Vite :5173
npm run build
npm run preview   # :4173
npm test          # Vitest
npm run test:e2e  # Playwright
```

## Asset-uri

`public/images/valhalla/` — Wikimedia Commons (CC BY-SA). Zero Unsplash. Zero AM CDN. Proveniență: `src/hybrid/assets.ts`.

## Stack

React + Vite + Tailwind + GSAP ScrollTrigger + SVG charts + Zustand (control demo).
