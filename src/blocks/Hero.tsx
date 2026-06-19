import Image from "next/image";

// ═══════════════════════════════════════════════════════════════════
// Hero — reproduces the legacy hero-section.tsx. variant:
//   overlay → solid primary bg + full-bleed image at 60% tint, centered
//             uppercase headline with a badge framed by hairlines.
//   split   → left brand-gradient text panel, right full-bleed image.
// ═══════════════════════════════════════════════════════════════════

export interface HeroProps {
  id: string;
  variant?: "overlay" | "split";
  headline?: string;
  subtitle?: string;
  badge?: string;
  image?: string;
}

export default function Hero({
  variant = "overlay",
  headline = "Headline",
  subtitle,
  badge,
  image,
}: HeroProps) {
  if (variant === "split") {
    return (
      <section className="relative flex min-h-[520px] flex-col overflow-hidden md:flex-row">
        <div
          className="relative z-10 flex w-full flex-col justify-center px-8 py-20 md:w-[55%] md:px-16 md:py-24"
          style={{
            background:
              "linear-gradient(135deg, var(--site-primary) 0%, var(--site-primary-dark) 100%)",
          }}
        >
          {badge ? (
            <span className="mb-5 w-fit rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white/70">
              {badge}
            </span>
          ) : null}
          <h1 className="mb-5 font-headline text-4xl font-extrabold uppercase leading-tight tracking-tight text-white md:text-5xl">
            {headline}
          </h1>
          {subtitle ? (
            <p className="max-w-md font-body text-base leading-relaxed text-white/80 md:text-lg">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div className="relative h-64 w-full md:h-auto md:w-[45%]">
          {image ? (
            <Image src={image} alt={headline} fill sizes="45vw" priority className="object-cover object-center" />
          ) : null}
          <div
            className="absolute inset-y-0 left-0 hidden w-28 md:block"
            style={{ background: "linear-gradient(to right, var(--site-primary-dark), transparent)" }}
          />
        </div>
      </section>
    );
  }

  // overlay
  return (
    <section
      className="relative flex min-h-[500px] items-center justify-center overflow-hidden px-6 py-24 md:px-12"
      style={{ backgroundColor: "var(--site-primary)" }}
    >
      {image ? (
        <Image src={image} alt={headline} fill priority quality={85} className="object-cover object-center" />
      ) : null}
      <div className="absolute inset-0 opacity-60" style={{ backgroundColor: "var(--site-primary)" }} />
      <div
        className="absolute inset-x-0 bottom-0 h-32"
        style={{ background: "linear-gradient(to top, var(--site-primary), transparent)" }}
      />
      <div className="relative z-10 max-w-5xl text-center">
        <h1 className="mb-6 font-headline text-4xl font-extrabold uppercase tracking-tight text-white drop-shadow-lg md:text-6xl">
          {headline}
        </h1>
        {subtitle ? (
          <p className="mx-auto max-w-2xl font-body text-lg font-medium text-white/85 drop-shadow-md md:text-xl">
            {subtitle}
          </p>
        ) : null}
        {badge ? (
          <div className="mt-6 inline-flex items-center gap-3">
            <span className="h-px w-8 bg-white/50" />
            <span className="font-headline text-sm font-bold uppercase tracking-widest text-white drop-shadow-md md:text-base">
              {badge}
            </span>
            <span className="h-px w-8 bg-white/50" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
