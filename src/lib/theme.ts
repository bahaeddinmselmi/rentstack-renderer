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

export function themeStyle(site: SiteConfig): React.CSSProperties {
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

  return {
    // typed as a CSS-variable bag — matches the legacy sites' token names
    // so harvested blocks work unchanged.
    ["--site-primary" as string]: primary,
    ["--site-primary-dark" as string]: primaryDark,
    ["--site-accent" as string]: accent,
    ["--site-footer-bg" as string]: footerBg,
    ["--site-icon-tint" as string]: iconTint,
  };
}
