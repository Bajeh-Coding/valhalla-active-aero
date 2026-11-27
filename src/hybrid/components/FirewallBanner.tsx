/** Mandatory industrial firewall for Chapter 5. */
export function FirewallBanner({ className }: { className?: string }) {
  return (
    <aside
      className={className}
      data-testid="industrial-firewall"
      role="note"
      aria-label="Firewall surse industriale"
    >
      <p className="font-ui text-[11px] tracking-[0.22em] text-aero-lime uppercase">
        Aplicație industrială / referință produs — surse publice Aston Martin
      </p>
      <p className="font-ui mt-2 text-[11px] tracking-[0.18em] text-aero-mist uppercase">
        NU sunt rezultate SAE 2020-36-0079
      </p>
    </aside>
  )
}
