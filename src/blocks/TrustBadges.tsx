import Icon from "@/components/Icon";

// ═══════════════════════════════════════════════════════════════════
// TrustBadges — reproduces the legacy trust-badges.tsx: a centered 3-col
// row, each with a circular tinted Material-icon disc. `icon` is a
// Material Symbols name straight from the DB (no mapping).
// ═══════════════════════════════════════════════════════════════════

export interface Badge {
  icon?: string;
  title: string;
  desc?: string;
}

export interface TrustBadgesProps {
  id: string;
  badges?: Badge[];
}

export default function TrustBadges({ badges = [] }: TrustBadgesProps) {
  if (!badges.length) return null;
  return (
    <section className="bg-[#f7f9fc] px-6 py-24 md:px-12">
      <div className="mx-auto max-w-screen-2xl">
        <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3">
          {badges.map((b, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
                style={{ backgroundColor: "color-mix(in srgb, var(--site-primary) 15%, white)" }}
              >
                <Icon
                  name={b.icon || "verified_user"}
                  className="text-4xl"
                  style={{ color: "var(--site-primary)" }}
                />
              </div>
              <h3 className="mb-2 font-headline text-xl font-bold text-[#191c1e]">
                {b.title}
              </h3>
              {b.desc ? (
                <p className="max-w-[250px] font-body text-sm text-[#444651]">{b.desc}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
