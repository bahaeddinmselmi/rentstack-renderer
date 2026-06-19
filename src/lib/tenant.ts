import "server-only";

// ═══════════════════════════════════════════════════════════════════
// Tenant resolution — map an incoming Host header to a site slug.
//
// Resolution order:
//   1. Custom domain        → look up sites.domain (handled in API layer)
//   2. Platform subdomain   → `<slug>.rentstack.app` → take the label
//   3. Local dev            → `<slug>.localhost:PORT` or ?site=<slug>
//
// The middleware does a cheap string parse here; the authoritative
// custom-domain → slug lookup happens against the backend in api.ts.
// ═══════════════════════════════════════════════════════════════════

/** Root domain the platform serves subdomains under. */
export const PLATFORM_ROOT =
  process.env.NEXT_PUBLIC_PLATFORM_ROOT || "rentstack.app";

/** Hosts that are the bare platform (no tenant) — marketing/app shell. */
const RESERVED_LABELS = new Set([
  "www",
  "app",
  "admin",
  "api",
  "builder",
  "@",
]);

/** Strip port and lowercase. */
function normalizeHost(host: string): string {
  return host.split(":")[0]!.trim().toLowerCase();
}

/**
 * Extract a slug from a subdomain of the platform root or of localhost.
 * Returns null when the host is a custom domain (needs a DB lookup) or
 * the bare platform host.
 */
export function slugFromSubdomain(host: string): string | null {
  const h = normalizeHost(host);

  // `<slug>.localhost`
  if (h.endsWith(".localhost")) {
    const label = h.slice(0, -".localhost".length);
    return label && !RESERVED_LABELS.has(label) ? label : null;
  }

  // `<slug>.rentstack.app`
  if (h.endsWith(`.${PLATFORM_ROOT}`)) {
    const label = h.slice(0, -(`.${PLATFORM_ROOT}`.length));
    // ignore nested subdomains like a.b.rentstack.app for now
    if (!label || label.includes(".")) return null;
    return RESERVED_LABELS.has(label) ? null : label;
  }

  return null;
}

/** True when the host is the platform root itself (no tenant). */
export function isPlatformHost(host: string): boolean {
  const h = normalizeHost(host);
  return (
    h === PLATFORM_ROOT ||
    h === `www.${PLATFORM_ROOT}` ||
    h === "localhost"
  );
}

/** True when the host is a custom domain (not a platform subdomain). */
export function isCustomDomain(host: string): boolean {
  const h = normalizeHost(host);
  if (isPlatformHost(h)) return false;
  if (h.endsWith(`.${PLATFORM_ROOT}`)) return false;
  if (h.endsWith(".localhost")) return false;
  return true;
}
