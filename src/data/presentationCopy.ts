/**
 * Sparse Romanian narrative — A0–A5.
 * Numbers only from docs/science-facts.md (S1/S2). Brand overlay ≠ paper vehicle.
 */
export const PRESENTATION_COPY = {
  hero: {
    brandLeft: 'ASTON MARTIN',
    brandRight: 'VALHALLA',
    headline: 'Aerodinamică activă.',
    line: 'Forța pe care anvelopa nu o poate inventa.',
    scroll: '↓ derulează',
  },
  limita: {
    /** A1 — friction circle / Fz (S2); no invent numbers. */
    title: 'Limita de la pata de contact',
    body: 'Torque vectoring redistribuie cuplul pe roți. Cercul de fricțiune și Fz decid cât forță mai poate da anvelopa — dincolo de regiunea liniară, TV singur nu ajunge.',
    /** S2-F010 */
    keyLabel: 'Regiune liniară tipică',
    keyValue: '< ~4 m/s²',
    cite: 'S2',
  },
  actuatoare: {
    /** A2 — splitter + wing; Table 3 @160 km/h (S1-F011). */
    title: 'Splitter și aripă',
    body: 'Două suprafețe active: splitter deschis sau închis, aripă cu AOA între 0° și 25°. Forțele vin din tabele CFD — nu din formule inventate.',
    keyLabel: 'Downforce spate @ 160 km/h',
    keyValue: '−126 → 467 N',
    cite: 'S1 · Table 3',
  },
  control: {
    /** A3 — state machine (S1-F030…). */
    title: 'Mașină de stări',
    body: 'DRS, AEROBRAKE și MaxP mapează viteza, accelerația și frâna pe configurații paper. Un singur panou — restul e tipografie.',
  },
  rezultat: {
    /** A4 — one big delta (S1-F062); secondary DIL (S1-F073). */
    title: 'Ce câștigă turul',
    body: 'MaxP față de aero pasiv original — GRIP Track, driver virtual.',
    secondary: 'DIL Nürburgring GP: −5.76 s față de original',
    cite: 'S1 · Table 5 / 6',
  },
  inchidere: {
    /** A5 — TV + aero as system (S1-F090…092); short biblio. */
    title: 'Sistem integrat',
    body: 'Balance aero bun pe un vehicul cu TV câștigă turul. Aero activă completează Fz pe care redistribuirea cuplului nu îl creează.',
    /** S1-F081 Table 4 — one cited delta only */
    keyLabel: 'TV + new aero pack',
    keyValue: '−1.827 s',
    cite: 'S1 · Table 4',
  },
} as const
