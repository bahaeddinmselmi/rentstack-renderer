import Link from "next/link";
import Icon from "@/components/Icon";
import SectionHeading from "./SectionHeading";

// ═══════════════════════════════════════════════════════════════════
// CityLinks — a grid of internal links to per-city landing pages (the
// legacy footer city links, promoted to a section for SEO + navigation).
// ═══════════════════════════════════════════════════════════════════

export interface CityLink {
  name: string;
  href: string;
}

export interface CityLinksProps {
  id: string;
  label?: string;
  title?: string;
  cities?: CityLink[];
}

export default function CityLinks({
  label = "Nos agences",
  title = "Location de voiture par ville",
  cities = [],
}: CityLinksProps) {
  if (!cities.length) return null;
  return (
    <section className="bg-[#f2f4f7] px-6 py-24 md:px-12">
      <div className="mx-auto max-w-screen-2xl">
        <SectionHeading label={label} title={title} align="center" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {cities.map((c, i) => (
            <Link
              key={i}
              href={c.href}
              className="group flex items-center justify-between rounded-lg border border-[#e0e3e6] bg-white px-4 py-3 text-sm font-semibold text-[#191c1e] transition-colors hover:border-[var(--site-primary)]"
            >
              {c.name}
              <Icon
                name="arrow_outward"
                className="text-base text-[#444651] transition-colors group-hover:text-[var(--site-primary)]"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
