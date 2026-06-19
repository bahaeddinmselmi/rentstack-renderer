// ═══════════════════════════════════════════════════════════════════
// RichText — a generic freeform copy block (heading + paragraphs).
// Paragraphs split on blank lines; no HTML injection.
// ═══════════════════════════════════════════════════════════════════

export interface RichTextProps {
  id: string;
  heading?: string;
  body?: string;
  align?: "center" | "left";
}

export default function RichText({
  heading,
  body,
  align = "left",
}: RichTextProps) {
  const paragraphs = (body || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (!heading && !paragraphs.length) return null;
  return (
    <section
      className={`mx-auto max-w-3xl px-6 py-12 ${
        align === "center" ? "text-center" : ""
      }`}
    >
      {heading ? (
        <h2 className="mb-4 text-2xl font-bold text-neutral-900 md:text-3xl">
          {heading}
        </h2>
      ) : null}
      <div className="space-y-4 text-lg leading-relaxed text-neutral-700">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}
