import Image from "next/image";
import Icon from "@/components/Icon";
import type { Car } from "@/lib/types";

// ═══════════════════════════════════════════════════════════════════
// CarCard — single fleet vehicle, reproducing the legacy car-card.tsx:
// contain image with category pill, a 2-col Material-icon spec grid,
// "Prix pour 3 jours", and a full-width "Voir l'offre" CTA. Themed via
// --site-primary so every tenant recolors for free.
// ═══════════════════════════════════════════════════════════════════

function val(v: string | number | null | undefined): string | null {
  return v === null || v === undefined || v === "" ? null : String(v);
}

export default function CarCard({ car }: { car: Car }) {
  const price = car.price3Days ?? null;
  const currency = car.currency || "DT";
  const seats = val(car.seats);
  const doors = val(car.doors);
  const transmission = val(car.transmission) || "Manuelle";
  const fuel = val(car.fuel) || "Essence";

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#e0e3e6]/60 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#f2f4f7]">
        {car.featured_image ? (
          <Image
            src={car.featured_image}
            alt={car.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-400">
            {car.title}
          </div>
        )}
        {car.category ? (
          <span
            className="absolute left-4 top-4 rounded-md px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: "var(--site-primary)" }}
          >
            {car.category}
          </span>
        ) : null}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mb-4">
          <h3 className="font-headline text-lg font-bold leading-tight text-[#191c1e] md:text-xl">
            {car.title}
          </h3>
          <p className="mt-0.5 text-xs text-[#444651]">
            {car.subtitle || "ou similaire"}
          </p>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] text-[#444651]">
          {seats ? (
            <Spec icon="airline_seat_recline_normal" label={`${seats} places`} />
          ) : null}
          {doors ? <Spec icon="sensor_door" label={`${doors} portes`} /> : null}
          <Spec icon="settings" label={transmission} />
          <Spec icon="local_gas_station" label={fuel} />
          <Spec icon="ac_unit" label="Climatisation" />
        </div>

        <div className="mt-auto border-t border-[#e0e3e6]/60 pt-4">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#444651]">
                Prix pour 3 jours
              </p>
              {price !== null ? (
                <p className="font-headline text-2xl font-extrabold text-[#191c1e]">
                  {price}{" "}
                  <span className="text-sm font-semibold text-[#444651]">{currency}</span>
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600">
              <Icon name="check_circle" className="text-base" />
              <span className="text-[11px] font-semibold">Annulation gratuite</span>
            </div>
          </div>

          <button
            type="button"
            className="block w-full rounded-lg py-3.5 text-center text-sm font-bold uppercase tracking-wider text-white transition-opacity duration-300 hover:opacity-90"
            style={{ backgroundColor: "var(--site-primary)" }}
          >
            Voir l’offre
          </button>
        </div>
      </div>
    </div>
  );
}

function Spec({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon name={icon} className="text-base" style={{ color: "var(--site-primary)" }} />
      {label}
    </div>
  );
}
