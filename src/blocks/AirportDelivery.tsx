import Icon from "@/components/Icon";
import SectionHeading from "./SectionHeading";

// ═══════════════════════════════════════════════════════════════════
// AirportDelivery — a reassurance band listing the airports a tenant
// delivers to (from the Hammamet / Djerba redesigns). Authored via
// props so each site lists its own airports.
// ═══════════════════════════════════════════════════════════════════

export interface Airport {
  name: string;
  desc?: string;
}

export interface AirportDeliveryProps {
  id: string;
  label?: string;
  title?: string;
  intro?: string;
  airports?: Airport[];
}

export default function AirportDelivery({
  label = "Livraison Aéroport",
  title = "Récupérez votre voiture à l’aéroport",
  intro,
  airports = [],
}: AirportDeliveryProps) {
  if (!airports.length) return null;
  return (
    <section className="bg-white px-6 py-24 md:px-12">
      <div className="mx-auto max-w-screen-xl">
        <SectionHeading label={label} title={title} align="center" />
        {intro ? (
          <p className="mx-auto -mt-6 mb-12 max-w-2xl text-center font-body text-[#444651]">
            {intro}
          </p>
        ) : null}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {airports.map((a, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-xl border border-[#e0e3e6]/60 bg-[#f7f9fc] p-6"
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: "var(--site-primary)" }}
              >
                <Icon name="flight_land" className="text-2xl" />
              </span>
              <div>
                <h3 className="font-headline text-lg font-bold text-[#191c1e]">{a.name}</h3>
                {a.desc ? <p className="mt-1 text-sm text-[#444651]">{a.desc}</p> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
