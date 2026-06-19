import CarCard from "@/components/CarCard";
import SectionHeading from "./SectionHeading";
import type { RenderContext } from "./context";

// ═══════════════════════════════════════════════════════════════════
// FleetGrid — the homepage's featured-cars grid on the surface bg, with
// the label + title + "view all" header. Fed by live tenant `cars`.
// ═══════════════════════════════════════════════════════════════════

export interface FleetGridProps {
  id: string;
  label?: string;
  title?: string;
  maxCars?: number;
  columns?: 2 | 3 | 4;
  viewAllHref?: string;
  viewAllLabel?: string;
}

const COLS: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

export default function FleetGrid(
  {
    label,
    title,
    maxCars = 6,
    columns = 3,
    viewAllHref,
    viewAllLabel,
  }: FleetGridProps,
  ctx: RenderContext,
) {
  const cars = ctx.cars.slice(0, Math.max(0, maxCars));
  if (!cars.length) return null;
  return (
    <section className="bg-[#f7f9fc] px-4 py-24 md:px-12">
      <div className="mx-auto max-w-screen-2xl">
        <SectionHeading
          label={label}
          title={title}
          align="left"
          linkHref={viewAllHref}
          linkLabel={viewAllLabel}
        />
        <div className={`grid grid-cols-1 gap-6 ${COLS[columns] || COLS[3]}`}>
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}
