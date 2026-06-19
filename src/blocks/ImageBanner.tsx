import Image from "next/image";

// ═══════════════════════════════════════════════════════════════════
// ImageBanner — a generic full-width image band with an overlay heading
// and optional CTA. The flexible "anything goes" visual block.
// ═══════════════════════════════════════════════════════════════════

export interface ImageBannerProps {
  id: string;
  image?: string;
  heading?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  height?: "sm" | "md" | "lg";
}

const HEIGHTS: Record<string, string> = {
  sm: "min-h-[260px]",
  md: "min-h-[380px]",
  lg: "min-h-[520px]",
};

export default function ImageBanner({
  image,
  heading,
  subtitle,
  ctaLabel,
  ctaHref = "#",
  height = "md",
}: ImageBannerProps) {
  return (
    <section className={`relative isolate flex items-center justify-center overflow-hidden ${HEIGHTS[height] || HEIGHTS.md}`}>
      {image ? (
        <Image src={image} alt={heading || ""} fill sizes="100vw" className="-z-10 object-cover" />
      ) : (
        <div className="absolute inset-0 -z-10" style={{ backgroundColor: "var(--site-primary)" }} />
      )}
      <div className="absolute inset-0 -z-10 bg-black/45" />
      <div className="mx-auto max-w-3xl px-6 py-16 text-center text-white">
        {heading ? (
          <h2 className="font-headline text-3xl font-extrabold drop-shadow md:text-5xl">
            {heading}
          </h2>
        ) : null}
        {subtitle ? (
          <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-white/90">{subtitle}</p>
        ) : null}
        {ctaLabel ? (
          <a
            href={ctaHref}
            className="mt-8 inline-flex rounded-lg bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider transition-opacity hover:opacity-90"
            style={{ color: "var(--site-primary)" }}
          >
            {ctaLabel}
          </a>
        ) : null}
      </div>
    </section>
  );
}
