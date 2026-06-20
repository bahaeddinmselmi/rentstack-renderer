import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  resolveSlugFromHost,
  getSiteConfig,
  getSitePage,
  getSiteCars,
  getReviews,
  getFaqs,
} from "@/lib/api";
import { themeStyle } from "@/lib/theme";
import PageRenderer from "@/components/PageRenderer";
import { Navbar, Footer } from "@/components/SiteChrome";

// ═══════════════════════════════════════════════════════════════════
// The ONE tenant route. Every host, every page lands here:
//   • Host header → site slug (subdomain / custom domain / DEV_SITE)
//   • path segments → page slug (empty → "home")
// More specific routes (/blocks-preview, future /builder) take priority
// over this optional catch-all, so they're never treated as tenants.
//
// Reading the Host header makes this route dynamic per-host, which is
// correct for multi-tenant rendering. (Edge host→slug caching can be
// layered back in via a proxy later — it's a perf optimization, not a
// correctness requirement.)
// ═══════════════════════════════════════════════════════════════════

type Params = Promise<{ path?: string[] }>;

function pageSlugFromPath(path?: string[]): string {
  if (!path || path.length === 0) return "home";
  return path.join("/");
}

async function resolveSlug(): Promise<string | null> {
  const host = (await headers()).get("host") || "";
  return resolveSlugFromHost(host);
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const slug = await resolveSlug();
  if (!slug) return {};
  const site = await getSiteConfig(slug);
  if (!site) return {};

  const { path } = await params;
  const page = await getSitePage(slug, pageSlugFromPath(path));

  const title =
    page?.title && page.title !== "Accueil"
      ? `${page.title} · ${site.name}`
      : site.seoTitleDefault || site.name;
  const description = page?.metaDescription || site.seoDescription || undefined;

  return {
    title,
    description,
    openGraph: {
      title: title || undefined,
      description,
      images: site.ogImage ? [site.ogImage] : undefined,
    },
  };
}

export default async function TenantPage({ params }: { params: Params }) {
  const slug = await resolveSlug();
  if (!slug) redirect("http://212.47.70.100:8083");

  const site = await getSiteConfig(slug);
  if (!site) notFound();

  const { path } = await params;
  const pageSlug = pageSlugFromPath(path);

  const [page, cars, reviews, faqs] = await Promise.all([
    getSitePage(slug, pageSlug),
    getSiteCars(slug),
    getReviews(slug),
    getFaqs(slug),
  ]);

  if (!page || page.isActive === false) notFound();

  const rootProps = (page.content as Record<string, unknown> | null)?.root as { props?: Record<string, string> } | undefined;

  return (
    <div style={themeStyle(site, rootProps?.props)}>
      <Navbar site={site} />
      <main>
        <PageRenderer
          document={page.content}
          site={site}
          cars={cars}
          reviews={reviews}
          faqs={faqs}
        />
      </main>
      <Footer site={site} />
    </div>
  );
}
