import Icon from "@/components/Icon";
import SectionHeading from "./SectionHeading";
import type { RenderContext } from "./context";

// ═══════════════════════════════════════════════════════════════════
// FAQ — reproduces the legacy homepage accordion: gray-50 <details>
// cards with an expand_more Material chevron. Native <details> so it
// works without client JS. Fed by live tenant `faqs`.
// ═══════════════════════════════════════════════════════════════════

export interface FAQProps {
  id: string;
  label?: string;
  title?: string;
  maxItems?: number;
}

export default function FAQ(
  { label, title, maxItems = 8 }: FAQProps,
  ctx: RenderContext,
) {
  const faqs = ctx.faqs.slice(0, Math.max(0, maxItems));
  if (!faqs.length) return null;
  return (
    <section className="bg-white px-4 py-20 md:px-12">
      <div className="mx-auto max-w-screen-lg">
        <SectionHeading label={label} title={title} align="center" />
        <div className="space-y-4">
          {faqs.map((f) => (
            <details
              key={f.id}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
            >
              <summary className="flex cursor-pointer items-center justify-between p-5 transition-colors hover:bg-gray-100">
                <span className="pr-4 text-left font-bold text-gray-900">
                  {f.question}
                </span>
                <Icon
                  name="expand_more"
                  className="shrink-0 transition-transform group-open:rotate-180"
                  style={{ color: "var(--site-primary)" }}
                />
              </summary>
              <div className="px-5 pb-5 leading-relaxed text-gray-600">{f.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
