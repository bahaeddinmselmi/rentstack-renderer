// ═══════════════════════════════════════════════════════════════════
// Shared types — site config + Puck-style page document
// ═══════════════════════════════════════════════════════════════════

/** A single block instance inside a page document. */
export interface BlockInstance {
  type: string;
  props: { id: string; [key: string]: unknown };
}

/**
 * The page document persisted in `site_pages.content` (JSONB).
 * Mirrors the Puck data shape so the builder (<Puck>) and the public
 * renderer share one format.
 */
export interface PageDocument {
  root: { props?: Record<string, unknown> };
  content: BlockInstance[];
  zones?: Record<string, BlockInstance[]>;
}

/** Theme tokens stored on `sites.themeColors` (JSONB). */
export interface ThemeColors {
  primary?: string;
  primaryContainer?: string;
  primary_container?: string;
  accent?: string;
  footerBg?: string;
  footer_bg?: string;
  onPrimaryContainer?: string;
  on_primary_container?: string;
  [key: string]: string | undefined;
}

/**
 * Site config returned by `GET /public/sites/:slug`.
 * Only the fields the renderer needs are typed; the rest pass through.
 */
export interface SiteConfig {
  id: string;
  slug: string;
  domain: string;
  name: string;
  nameShort?: string | null;
  language?: string | null;
  phoneDisplay?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  logoMain?: string | null;
  logoWhite?: string | null;
  ogImage?: string | null;
  baseUrl?: string | null;
  themeColors?: ThemeColors | null;
  // Address
  addressCity?: string | null;
  // SEO
  seoTitleDefault?: string | null;
  seoDescription?: string | null;
  // site_settings merged by category (navbar, footer, fonts, etc.)
  config?: Record<string, unknown> | null;
  // pass-through for everything else
  [key: string]: unknown;
}

/** A page row from `GET /public/sites/:slug/pages`. */
export interface SitePage {
  id: string;
  siteId: string;
  pageType: string;
  slug: string;
  title: string;
  metaDescription?: string | null;
  h1?: string | null;
  content: PageDocument | null;
  heroImage?: string | null;
  isActive: boolean;
}

/** Car shape (subset) returned by `/public/sites/:slug/cars`. */
export interface Car {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  price3Days?: string | number | null;
  currency?: string | null;
  featured_image?: string | null;
  category?: string | null;
  seats?: number | null;
  doors?: number | null;
  transmission?: string | null;
  fuel?: string | null;
}

/** Review shape (subset). */
export interface Review {
  id: string;
  author: string;
  city?: string | null;
  rating: number;
  text: string;
}

/** FAQ shape (subset). */
export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
}
