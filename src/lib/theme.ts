import type { ThemeColors, SiteConfig } from "./types";

// ═══════════════════════════════════════════════════════════════════
// Theme → CSS variables. Mirrors the legacy sites' layout.tsx so blocks
// harvested from those repos keep working unchanged. Accepts both the
// camelCase and snake_case key variants the DB has used over time.
// ═══════════════════════════════════════════════════════════════════

function pick(t: ThemeColors, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = t[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

const RADIUS_MAP: Record<string, string> = {
  none: "0px",
  sm: "6px",
  md: "12px",
  lg: "16px",
  full: "9999px",
};

export function themeStyle(site: SiteConfig, rootProps?: Record<string, string>): React.CSSProperties {
  const t = site.themeColors || {};
  const primary = pick(t, "primary") || "#00256f";
  const primaryDark =
    pick(t, "primaryContainer", "primary_container", "primaryDark", "primary_dark") ||
    "#1a3c8f";
  const accent = pick(t, "accent") || primary;
  const footerBg = pick(t, "footerBg", "footer_bg") || "#172554";
  const iconTint =
    pick(t, "onPrimaryContainer", "on_primary_container", "iconTint", "icon_tint") ||
    "#92abff";

  const radiusKey = rootProps?.buttonRadius || "md";
  const radius = RADIUS_MAP[radiusKey] || "12px";

  return {
    ["--site-primary" as string]:      rootProps?.primary   || primary,
    ["--site-primary-dark" as string]: rootProps?.primary   || primaryDark,
    ["--site-accent" as string]:       rootProps?.accent    || accent,
    ["--site-footer-bg" as string]:    rootProps?.footerBg  || footerBg,
    ["--site-icon-tint" as string]:    rootProps?.iconTint  || iconTint,
    ["--site-card-bg" as string]:      rootProps?.cardBg    || "#f8faff",
    ["--site-button-text" as string]:  rootProps?.buttonText || "#ffffff",
    ["--site-radius" as string]:       radius,
  };
}
