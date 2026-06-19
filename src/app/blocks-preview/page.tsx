import { renderBlock, BLOCK_TYPES } from "@/blocks/registry";
import type { RenderContext } from "@/blocks/context";
import { themeStyle } from "@/lib/theme";
import { SEED_SITES } from "@/lib/seed";

// ═══════════════════════════════════════════════════════════════════
// /blocks-preview — renders every registered block once, against the
// demo tenant's seed data, so we can eyeball each block in isolation
// (Phase 1 exit check). Not part of the tenant route group.
// ═══════════════════════════════════════════════════════════════════

export const dynamic = "force-static";

const demo = SEED_SITES.demo!;

const SAMPLE_PROPS: Record<string, Record<string, unknown>> = {
  Hero: {
    id: "p-hero",
    variant: "overlay",
    headline: "Hero (overlay)",
    subtitle: "Bannière pleine largeur, image de fond teintée en primary.",
    badge: "Variant overlay",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80",
  },
  BookingWidget: {
    id: "p-booking",
    overlap: false,
    defaultLocation: "Tunis, Tunisie",
  },
  TrustBadges: {
    id: "p-trust",
    badges: [
      { icon: "credit_card_off", title: "Sans carte", desc: "Paiement à la livraison." },
      { icon: "flight_land", title: "Aéroport", desc: "Livraison gratuite." },
      { icon: "verified_user", title: "Assuré", desc: "Tous risques inclus." },
    ],
  },
  FleetGrid: {
    id: "p-fleet",
    label: "Notre flotte",
    title: "FleetGrid",
    maxCars: 3,
    columns: 3,
    viewAllHref: "/nos-voitures",
    viewAllLabel: "Voir tout",
  },
  FleetScroll: { id: "p-fleetscroll", label: "Flotte", title: "FleetScroll", maxCars: 6 },
  PromoBanner: {
    id: "p-promo",
    badge: "Offre limitée",
    heading: "PromoBanner",
    subtitle: "Bannière promotionnelle en deux colonnes.",
    priceLabel: "Dès",
    price: "297",
    priceSuffix: "DT / 3 jours",
    ctaLabel: "Réserver",
    ctaHref: "#",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
  },
  ServicesScroll: {
    id: "p-services",
    label: "Nos services",
    title: "ServicesScroll",
    services: [
      { icon: "local_airport", title: "Livraison Aéroport", desc: "Accueil à votre arrivée, 24h/24." },
      { icon: "credit_card_off", title: "Sans Carte", desc: "Payez en espèces à la livraison." },
      { icon: "support_agent", title: "Assistance 24/7", desc: "Une équipe disponible à tout moment." },
      { icon: "verified_user", title: "Assurance", desc: "Tous risques incluse." },
    ],
  },
  Reviews: {
    id: "p-reviews",
    label: "Avis",
    title: "Reviews",
    layout: "carousel",
    ratingValue: 4.9,
    ratingCount: 200,
  },
  FAQ: { id: "p-faq", label: "FAQ", title: "FAQ", maxItems: 3 },
  AirportDelivery: {
    id: "p-airport",
    label: "Aéroports",
    title: "AirportDelivery",
    intro: "Nous livrons dans tous les aéroports de Tunisie.",
    airports: [
      { name: "Tunis-Carthage", desc: "Livraison gratuite 24h/24." },
      { name: "Enfidha-Hammamet", desc: "Accueil personnalisé à l’arrivée." },
      { name: "Djerba-Zarzis", desc: "Reprise gratuite au départ." },
    ],
  },
  CityLinks: {
    id: "p-cities",
    label: "Agences",
    title: "CityLinks",
    cities: [
      { name: "Tunis", href: "#" },
      { name: "Sousse", href: "#" },
      { name: "Hammamet", href: "#" },
      { name: "Djerba", href: "#" },
      { name: "Monastir", href: "#" },
      { name: "Sfax", href: "#" },
    ],
  },
  RichText: {
    id: "p-rich",
    heading: "RichText",
    body: "Premier paragraphe de démonstration.\n\nSecond paragraphe, séparé par une ligne vide.",
    align: "center",
  },
  ImageBanner: {
    id: "p-imgbanner",
    image: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=1600&q=80",
    heading: "ImageBanner",
    subtitle: "Bandeau image avec superposition et CTA.",
    ctaLabel: "Découvrir",
    ctaHref: "#",
    height: "md",
  },
};

export default function BlocksPreview() {
  const ctx: RenderContext = {
    slug: demo.config.slug,
    site: demo.config,
    cars: demo.cars,
    reviews: demo.reviews,
    faqs: demo.faqs,
  };

  return (
    <div style={themeStyle(demo.config)}>
      <header className="border-b border-black/10 bg-neutral-900 px-6 py-5 text-white">
        <h1 className="font-headline text-xl font-bold">RentStack · Blocks preview</h1>
        <p className="text-sm text-white/60">
          {BLOCK_TYPES.length} blocks · demo tenant data
        </p>
      </header>
      {BLOCK_TYPES.map((type) => (
        <section key={type} className="border-b-8 border-neutral-100">
          <div className="bg-neutral-50 px-6 py-2 font-mono text-xs uppercase tracking-wide text-neutral-500">
            {type}
          </div>
          {renderBlock(type, SAMPLE_PROPS[type] as { id: string }, ctx)}
        </section>
      ))}
    </div>
  );
}
