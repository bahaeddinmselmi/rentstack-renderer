import "server-only";
import type { SiteConfig, SitePage, Car, Review, Faq } from "./types";
import { slugFromSubdomain } from "./tenant";
import { SEED_SITES, hasSeed } from "./seed";
import { readPageDoc, listStoredPageSlugs } from "./store";

// ═══════════════════════════════════════════════════════════════════
// Multi-tenant data layer.
//
// Wraps the existing backend public API:
//   GET /public/sites/:slug                 → site config
//   GET /public/sites/:slug/pages/:pageSlug → page (with Puck document)
//   GET /public/sites/:slug/cars            → fleet
//   GET /public/sites/:slug/reviews|faqs    → lists
//
// Auth: a single platform-level X-Api-Key (any "connected" key can read
// any slug — the slug is the tenant selector in the path).
//
// DEV: when USE_SEED=1 (or no API key is configured), reads come from
// the in-repo SEED_SITES so the renderer works with zero backend.
// ═══════════════════════════════════════════════════════════════════

const BACKEND_API_URL =
  process.env.BACKEND_API_URL || "http://212.47.70.100:8088/api/v1";
const PLATFORM_API_KEY = (process.env.PLATFORM_API_KEY || "").trim();
const USE_SEED = process.env.USE_SEED === "1" || !PLATFORM_API_KEY;

/** Optional static custom-domain → slug map (JSON in env) until the
 *  backend gains a /public/resolve endpoint. */
function customDomainMap(): Record<string, string> {
  try {
    return JSON.parse(process.env.CUSTOM_DOMAIN_MAP || "{}");
  } catch {
    return {};
  }
}

async function backendFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BACKEND_API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": PLATFORM_API_KEY,
    },
    next: { revalidate: 300 }, // ISR: 5-min cache, same as legacy sites
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || err.message || `API ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Host → slug ──────────────────────────────────────────────────────

/**
 * Resolve a Host header to a site slug.
 * Subdomain is parsed locally; custom domains use the env map (dev) or,
 * in seed mode, match against a seeded site's `domain`.
 */
export async function resolveSlugFromHost(
  host: string,
): Promise<string | null> {
  const sub = slugFromSubdomain(host);
  if (sub) return sub;

  const bare = host.split(":")[0]!.toLowerCase();
  const mapped = customDomainMap()[bare];
  if (mapped) return mapped;

  if (USE_SEED) {
    const match = Object.values(SEED_SITES).find(
      (s) => s.config.domain?.toLowerCase() === bare,
    );
    if (match) return match.config.slug;
  }

  // Fallback for local dev: a single explicit dev site.
  return process.env.DEV_SITE || null;
}

// ── Reads ────────────────────────────────────────────────────────────

export async function getSiteConfig(
  slug: string,
): Promise<SiteConfig | null> {
  if (USE_SEED && hasSeed(slug)) return SEED_SITES[slug]!.config;
  try {
    return await backendFetch<SiteConfig>(`/public/sites/${slug}`);
  } catch {
    return null;
  }
}

export async function getSitePage(
  slug: string,
  pageSlug: string,
): Promise<SitePage | null> {
  if (USE_SEED && hasSeed(slug)) {
    const base = SEED_SITES[slug]!.pages[pageSlug] ?? null;
    // A builder-published document overrides the seed content, so
    // "publish → reload → live" works locally.
    const published = await readPageDoc(slug, pageSlug);
    if (published) {
      return base
        ? { ...base, content: published }
        : {
            id: `${slug}-${pageSlug}`,
            siteId: slug,
            pageType: pageSlug === "home" ? "home" : "page",
            slug: pageSlug,
            title: pageSlug === "home" ? "Accueil" : pageSlug,
            content: published,
            isActive: true,
          };
    }
    return base;
  }
  try {
    return await backendFetch<SitePage>(
      `/public/sites/${slug}/pages/${pageSlug}`,
    );
  } catch {
    return null;
  }
}

/** Lightweight page descriptor for the builder's page switcher. */
export interface PageRef {
  slug: string;
  title: string;
  pageType: string;
}

export async function getSitePages(slug: string): Promise<PageRef[]> {
  if (USE_SEED && hasSeed(slug)) {
    const seedPages = Object.values(SEED_SITES[slug]!.pages).map((p) => ({
      slug: p.slug,
      title: p.title,
      pageType: p.pageType,
    }));
    // Merge in any builder-created pages persisted to the file store.
    const stored = await listStoredPageSlugs(slug);
    const known = new Set(seedPages.map((p) => p.slug));
    for (const s of stored) {
      if (!known.has(s)) seedPages.push({ slug: s, title: s, pageType: s === "home" ? "home" : "page" });
    }
    return seedPages;
  }
  try {
    const pages = await backendFetch<PageRef[]>(`/public/sites/${slug}/pages`);
    return pages.map((p) => ({ slug: p.slug, title: p.title, pageType: p.pageType }));
  } catch {
    return [];
  }
}

export async function getSiteCars(slug: string): Promise<Car[]> {
  if (USE_SEED && hasSeed(slug)) return SEED_SITES[slug]!.cars;
  try {
    return await backendFetch<Car[]>(`/public/sites/${slug}/cars`);
  } catch {
    return [];
  }
}

export async function getReviews(slug: string): Promise<Review[]> {
  if (USE_SEED && hasSeed(slug)) return SEED_SITES[slug]!.reviews;
  try {
    return await backendFetch<Review[]>(`/public/sites/${slug}/reviews`);
  } catch {
    return [];
  }
}

export async function getFaqs(slug: string): Promise<Faq[]> {
  if (USE_SEED && hasSeed(slug)) return SEED_SITES[slug]!.faqs;
  try {
    return await backendFetch<Faq[]>(`/public/sites/${slug}/faqs`);
  } catch {
    return [];
  }
}

export { USE_SEED };
