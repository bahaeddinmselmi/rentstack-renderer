import Icon from "@/components/Icon";
import Marquee from "@/components/Marquee";

// ═══════════════════════════════════════════════════════════════════
// ServicesScroll — reproduces the legacy services-scroll.tsx: a header
// plus an auto-scrolling row of service cards (Material icon + title +
// desc). Services are authored in the block props (a list), so the
// editor controls them directly.
// ═══════════════════════════════════════════════════════════════════

export interface ServiceItem {
  icon?: string;
  title: string;
  desc?: string;
}

export interface ServicesScrollProps {
  id: string;
  label?: string;
  title?: string;
  services?: ServiceItem[];
}

export default function ServicesScroll({
  label = "Nos Services",
  title = "Tout pour votre confort",
  services = [],
}: ServicesScrollProps) {
  if (!services.length) return null;
  return (
    <section className="bg-[#f2f4f7] py-24">
      <div className="mx-auto mb-12 max-w-screen-2xl px-6 md:px-12">
        {label ? (
          <p
            className="mb-2 font-body text-sm font-bold uppercase tracking-widest"
            style={{ color: "var(--site-primary)" }}
          >
            {label}
          </p>
        ) : null}
        {title ? (
          <h2 className="font-headline text-3xl font-extrabold text-[#191c1e] md:text-4xl">
            {title}
          </h2>
        ) : null}
      </div>
      <Marquee speed={0.6} fadeColor="#f2f4f7" gapClassName="gap-8">
        {services.map((s, i) => (
          <div
            key={i}
            className="w-80 flex-shrink-0 rounded-xl bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-md"
          >
            <Icon
              name={s.icon || "directions_car"}
              className="mb-6 block text-4xl"
              style={{ color: "var(--site-primary)" }}
            />
            <h3 className="mb-3 font-headline text-xl font-bold text-[#191c1e]">{s.title}</h3>
            {s.desc ? (
              <p className="font-body text-sm leading-relaxed text-[#444651]">{s.desc}</p>
            ) : null}
          </div>
        ))}
      </Marquee>
    </section>
  );
}
