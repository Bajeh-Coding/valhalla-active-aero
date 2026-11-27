# Valhalla — Hybrid AM science scrollytelling

Prezentare științifică Hybrid AM (limbaj vizual Aston Martin Valhalla + capitole paper-exact) pe aerodinamica activă. Limbă UI: română. Termeni tehnici EN păstrați (DRS, CoP, CoG, LQR context S2, IPOPT absent din S1).

## Ordine capitole (locked)

0. Titlu / takeaways  
1. Introducere & context (activ vs pasiv, forțe CFD, CoP–CoG)  
2. Mecatronică & control (splitter, aripă, state machine DRS/Aerobrake/MaxP)  
3. Simulare (MATLAB/Simulink + VI-CarRealTime, DIL)  
4. Rezultate & concluzii  
5. Valhalla Active Aero — **capitol industrial separat** (surse AM publice)  
6. Grafice pe modelul S1 (re-plot din Table 3/5 / MaxP schedule)  
7. Recap + bibliografie  

## Reguli

- Cifre pe ecran: `docs/science-facts.md` (S1/S2) sau locator PDF — altfel omit.
- Capitolul 5 nu „dovedește” capitolul 4.
- Zero Unsplash; foto Valhalla = Wikimedia Commons (CC BY-SA) în `public/images/valhalla/`.
- Still scrub local (fallback onest) — fără rip CDN AM / YouTube scrub embed.

## Comenzi

```bash
npm install
npm run dev       # Vite :5173
npm run build
npm run preview   # :4173
npm test          # Vitest (fizică paper-exact)
npm run test:e2e  # Playwright
```

## Stack

React + Vite + Tailwind + GSAP ScrollTrigger + Zustand (doar pe control).
