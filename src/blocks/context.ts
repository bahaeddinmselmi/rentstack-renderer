import type { SiteConfig, Car, Review, Faq } from "@/lib/types";

// ═══════════════════════════════════════════════════════════════════
// Render context — the live, per-tenant data a block may need.
//
// The server PageRenderer fetches this once per request (cars, reviews,
// faqs, site config) and threads it to every block's render function, so
// data-driven blocks (FleetGrid, Reviews, FAQ) stay pure presentational
// components with no fetching of their own.
//
// In the Puck builder (Phase 2) the same context is supplied from the
// editor's loaded site, so the preview renders identically.
// ═══════════════════════════════════════════════════════════════════

export interface RenderContext {
  slug: string;
  site: SiteConfig;
  cars: Car[];
  reviews: Review[];
  faqs: Faq[];
}

/** Signature every block render component shares. */
export type BlockRender<P = Record<string, unknown>> = (
  props: P,
  ctx: RenderContext,
) => React.ReactNode;
