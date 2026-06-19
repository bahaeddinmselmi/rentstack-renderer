import BookingForm from "@/components/BookingForm";

// ═══════════════════════════════════════════════════════════════════
// BookingWidget — the floating white search card that overlaps the hero
// (legacy floating-search.tsx). Server wrapper around the interactive
// BookingForm so the registry can render it via JSX (hooks intact).
// ═══════════════════════════════════════════════════════════════════

export interface BookingWidgetProps {
  id: string;
  locations?: string[];
  defaultLocation?: string;
  actionHref?: string;
  overlap?: boolean;
}

const DEFAULT_LOCATIONS = [
  "Tunis, Tunisie",
  "Aéroport Tunis-Carthage",
  "Aéroport Enfidha",
  "Hammamet",
  "Sousse",
  "Monastir",
  "Djerba",
];

export default function BookingWidget({
  locations,
  defaultLocation,
  actionHref = "/nos-voitures",
  overlap = true,
}: BookingWidgetProps) {
  const locs = locations && locations.length ? locations : DEFAULT_LOCATIONS;
  return (
    <div className={`relative z-20 mx-auto max-w-6xl px-4 md:px-6 ${overlap ? "-mt-24" : "mt-10"}`}>
      <div className="rounded-xl border border-[#c4c6d3]/15 bg-white p-5 shadow-2xl md:p-10">
        <BookingForm
          locations={locs}
          defaultLocation={defaultLocation || locs[0]!}
          actionHref={actionHref}
        />
      </div>
    </div>
  );
}
