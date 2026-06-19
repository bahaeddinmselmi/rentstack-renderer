import { renderBlock } from "@/blocks/registry";
import type { RenderContext } from "@/blocks/context";
import type { PageDocument, SiteConfig, Car, Review, Faq } from "@/lib/types";

// ═══════════════════════════════════════════════════════════════════
// PageRenderer — turns a stored Puck document into the live page.
//
// It receives the page's block document plus the tenant's live data
// (fetched once by the route), builds a RenderContext, and maps each
// block instance through the shared registry. Unknown block types are
// skipped silently so a forward-compatible document never crashes an
// older renderer.
// ═══════════════════════════════════════════════════════════════════

export default function PageRenderer({
  document,
  site,
  cars,
  reviews,
  faqs,
}: {
  document: PageDocument | null;
  site: SiteConfig;
  cars: Car[];
  reviews: Review[];
  faqs: Faq[];
}) {
  const ctx: RenderContext = {
    slug: site.slug,
    site,
    cars,
    reviews,
    faqs,
  };

  const blocks = document?.content ?? [];
  if (!blocks.length) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center text-neutral-500">
        Cette page n’a pas encore de contenu.
      </div>
    );
  }

  return (
    <>
      {blocks.map((block) => {
        const props = (block.props ?? { id: block.type }) as {
          id: string;
          [k: string]: unknown;
        };
        return (
          <div key={props.id || block.type} data-block={block.type}>
            {renderBlock(block.type, props, ctx)}
          </div>
        );
      })}
    </>
  );
}
