import { notFound } from "next/navigation";
import {
  getSiteConfig,
  getSitePage,
  getSitePages,
  getSiteCars,
  getReviews,
  getFaqs,
} from "@/lib/api";
import { themeStyle } from "@/lib/theme";
import type { RenderContext } from "@/blocks/context";
import BuilderClient from "@/builder/BuilderClient";

// ═══════════════════════════════════════════════════════════════════
// /builder/<slug>/<pageSlug> — the drag-and-drop editor for one page.
//
// Server side: load the tenant config + page document + live data, then
// hand them to the client <Puck> host. The same data layer the public
// site uses feeds the editor, so the preview matches production.
//
// AUTH: open in local dev. Phase 3 gates this behind an SSO token issued
// by the admin and scopes it to the agency that owns the site.
// ═══════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string; pageSlug: string }>;
type Search = Promise<{ t?: string }>;

export default async function BuilderPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  const { slug, pageSlug } = await params;
  const { t: token } = await searchParams;

  const site = await getSiteConfig(slug);
  if (!site) notFound();

  const [page, pages, cars, reviews, faqs] = await Promise.all([
    getSitePage(slug, pageSlug),
    getSitePages(slug),
    getSiteCars(slug),
    getReviews(slug),
    getFaqs(slug),
  ]);

  const ctx: RenderContext = { slug, site, cars, reviews, faqs };

  return (
    <BuilderClient
      slug={slug}
      pageSlug={pageSlug}
      initialData={page?.content ?? null}
      pages={pages}
      ctx={ctx}
      themeVars={themeStyle(site)}
      token={token ?? null}
    />
  );
}
