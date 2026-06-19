import CarCard from "@/components/CarCard";
import SectionHeading from "./SectionHeading";
import Marquee from "@/components/Marquee";
import type { RenderContext } from "./context";

// ═══════════════════════════════════════════════════════════════════
// FleetScroll — the horizontal auto-scrolling variant of the fleet, for
// pages that want a band of vehicles rather than a grid.
// ═══════════════════════════════════════════════════════════════════

export interface FleetScrollProps {
  id: string;
  label?: string;
  title?: string;
  maxCars?: number;
}

export default function FleetScroll(
  { label, title, maxCars = 8 }: FleetScrollProps,
  ctx: RenderContext,
) {
  const cars = ctx.cars.slice(0, Math.max(0, maxCars));
  if (!cars.length) return null;
  return (
    <section className="bg-white py-24">
      <div className="mx-auto mb-12 max-w-screen-2xl px-6 md:px-12">
        <SectionHeading label={label} title={title} align="left" />
      </div>
      <Marquee speed={0.5} fadeColor="#ffffff" gapClassName="gap-6">
        {cars.map((car) => (
          <div key={car.id} className="w-80 flex-shrink-0">
            <CarCard car={car} />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
