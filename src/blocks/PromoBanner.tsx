// ═══════════════════════════════════════════════════════════════════
// PromoBanner — reproduces the legacy promo-banner.tsx: a split card on
// the surface bg, primary-filled, with a badge pill, headline, a price
// callout and a white CTA. Pure presentational.
// ═══════════════════════════════════════════════════════════════════

export interface PromoBannerProps {
  id: string;
  badge?: string;
  heading?: string;
  subtitle?: string;
  priceLabel?: string;
  price?: string | number;
  priceSuffix?: string;
  ctaLabel?: string;
  ctaHref?: string;
  image?: string;
}

export default function PromoBanner({
  badge,
  heading = "Offre spéciale",
  subtitle,
  priceLabel = "À partir de",
  price,
  priceSuffix,
  ctaLabel = "Réserver",
  ctaHref = "#",
  image,
}: PromoBannerProps) {
  return (
    <section className="bg-[#f7f9fc] px-6 py-24 md:px-12">
      <div className="mx-auto max-w-screen-2xl">
        <div
          className="flex flex-col items-center overflow-hidden rounded-2xl md:flex-row"
          style={{ backgroundColor: "var(--site-primary)" }}
        >
          <div className="w-full p-12 md:w-1/2 md:p-20">
            {badge ? (
              <span className="mb-8 inline-block rounded-full bg-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white">
                {badge}
              </span>
            ) : null}
            <h2 className="mb-6 font-headline text-4xl font-black leading-tight text-white md:text-5xl">
              {heading}
            </h2>
            {subtitle ? (
              <p
                className="mb-10 font-body text-lg opacity-90"
                style={{ color: "var(--site-icon-tint)" }}
              >
                {subtitle}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-8">
              {price !== undefined && price !== "" ? (
                <div className="text-white">
                  <p className="mb-1 text-xs uppercase tracking-widest opacity-60">
                    {priceLabel}
                  </p>
                  <p className="font-body text-4xl font-black">
                    {price}{" "}
                    {priceSuffix ? (
                      <span className="text-lg font-semibold">{priceSuffix}</span>
                    ) : null}
                  </p>
                </div>
              ) : null}
              <a
                href={ctaHref}
                className="rounded-lg bg-white px-8 py-4 font-bold transition-opacity hover:opacity-90"
                style={{ color: "var(--site-primary)" }}
              >
                {ctaLabel}
              </a>
            </div>
          </div>
          {image ? (
            <div className="relative h-[300px] w-full md:h-[400px] md:w-1/2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={heading} className="h-full w-full rounded-l-lg object-cover" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
