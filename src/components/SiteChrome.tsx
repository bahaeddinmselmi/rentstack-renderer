import Image from "next/image";
import { Phone, MessageCircle } from "lucide-react";
import type { SiteConfig } from "@/lib/types";

// ═══════════════════════════════════════════════════════════════════
// Navbar + Footer — renderer-level chrome driven by `sites` config
// (logo, name, phone, whatsapp), NOT Puck blocks. Matches the legacy
// prop-driven navbar.tsx / footer.tsx so every tenant gets consistent
// global chrome around its block-built page body.
// ═══════════════════════════════════════════════════════════════════

export function Navbar({ site }: { site: SiteConfig }) {
  const tel = site.phoneDisplay;
  const wa = site.whatsapp;
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <a href="/" className="flex items-center gap-2">
          {site.logoMain ? (
            <Image
              src={site.logoMain}
              alt={site.name}
              width={140}
              height={40}
              className="h-9 w-auto object-contain"
            />
          ) : (
            <span className="text-lg font-extrabold" style={{ color: "var(--site-primary)" }}>
              {site.nameShort || site.name}
            </span>
          )}
        </a>
        <div className="flex items-center gap-2">
          {tel ? (
            <a
              href={`tel:${tel.replace(/\s+/g, "")}`}
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-black/5 sm:flex"
            >
              <Phone size={16} />
              {tel}
            </a>
          ) : null}
          {wa ? (
            <a
              href={`https://wa.me/${wa.replace(/[^\d]/g, "")}`}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--site-primary)" }}
            >
              <MessageCircle size={16} />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          ) : null}
        </div>
      </nav>
    </header>
  );
}

export function Footer({ site }: { site: SiteConfig }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-8 text-white" style={{ backgroundColor: "var(--site-footer-bg)" }}>
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold">{site.name}</p>
          {site.seoDescription ? (
            <p className="mt-2 max-w-xs text-sm text-white/70">{site.seoDescription}</p>
          ) : null}
        </div>
        <div className="text-sm text-white/80">
          <p className="font-semibold text-white">Contact</p>
          {site.phoneDisplay ? <p className="mt-2">{site.phoneDisplay}</p> : null}
          {site.email ? <p>{site.email}</p> : null}
        </div>
        <div className="text-sm text-white/80">
          <p className="font-semibold text-white">À propos</p>
          <p className="mt-2">Location de voiture · Réservation sans carte bancaire.</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {year} {site.name}. Tous droits réservés.
      </div>
    </footer>
  );
}
