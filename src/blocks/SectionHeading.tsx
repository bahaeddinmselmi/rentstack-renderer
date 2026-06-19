import Link from "next/link";
import Icon from "@/components/Icon";

// ═══════════════════════════════════════════════════════════════════
// SectionHeading — the legacy eyebrow (uppercase primary label) + bold
// headline. Optional right-aligned "view all" link, matching the
// homepage fleet header.
// ═══════════════════════════════════════════════════════════════════

export default function SectionHeading({
  label,
  title,
  align = "center",
  linkHref,
  linkLabel,
}: {
  label?: string;
  title?: string;
  align?: "center" | "left";
  linkHref?: string;
  linkLabel?: string;
}) {
  if (!label && !title) return null;
  const hasLink = linkHref && linkLabel;

  const heading = (
    <div className={align === "center" && !hasLink ? "text-center" : ""}>
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
  );

  if (hasLink) {
    return (
      <div className="mb-12 flex items-end justify-between">
        {heading}
        <Link
          href={linkHref}
          className="hidden items-center gap-2 text-sm font-bold transition-all duration-300 hover:gap-4 md:flex"
          style={{ color: "var(--site-primary)" }}
        >
          {linkLabel}
          <Icon name="arrow_forward" className="text-lg" />
        </Link>
      </div>
    );
  }

  return <div className="mb-12">{heading}</div>;
}
