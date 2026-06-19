import type { SiteConfig, SitePage, Car, Review, Faq } from "./types";

// ═══════════════════════════════════════════════════════════════════
// Dev seed — lets the renderer run with no backend (USE_SEED mode).
// One demo tenant "demo" with a homepage built from real blocks.
// This is also the shape the onboarding flow will seed into
// `site_pages.content` for new clients.
// ═══════════════════════════════════════════════════════════════════

interface SeedSite {
  config: SiteConfig;
  pages: Record<string, SitePage>;
  cars: Car[];
  reviews: Review[];
  faqs: Faq[];
}

const demoCars: Car[] = [
  { id: "c1", title: "Volkswagen Golf 8", slug: "vw-golf-8", subtitle: "Compacte · Diesel", price3Days: 324, currency: "DT", category: "Économique", seats: 5, doors: 5, transmission: "Manuelle", fuel: "Diesel", featured_image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80" },
  { id: "c2", title: "Renault Clio 5", slug: "renault-clio-5", subtitle: "Citadine · Essence", price3Days: 297, currency: "DT", category: "Économique", seats: 5, doors: 5, transmission: "Manuelle", fuel: "Essence", featured_image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80" },
  { id: "c3", title: "Hyundai Tucson", slug: "hyundai-tucson", subtitle: "SUV · Diesel", price3Days: 612, currency: "DT", category: "SUV", seats: 5, doors: 5, transmission: "Automatique", fuel: "Diesel", featured_image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80" },
  { id: "c4", title: "Mercedes Classe C", slug: "mercedes-classe-c", subtitle: "Berline · Premium", price3Days: 1080, currency: "DT", category: "Luxe", seats: 5, doors: 4, transmission: "Automatique", fuel: "Diesel", featured_image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80" },
  { id: "c5", title: "Dacia Duster", slug: "dacia-duster", subtitle: "SUV · Diesel", price3Days: 459, currency: "DT", category: "SUV", seats: 5, doors: 5, transmission: "Manuelle", fuel: "Diesel", featured_image: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&q=80" },
  { id: "c6", title: "Peugeot 208", slug: "peugeot-208", subtitle: "Citadine · Essence", price3Days: 315, currency: "DT", category: "Économique", seats: 5, doors: 5, transmission: "Manuelle", fuel: "Essence", featured_image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80" },
];

const demoReviews: Review[] = [
  { id: "r1", author: "Sami B.", city: "Tunis", rating: 5, text: "Service impeccable, voiture livrée à l'aéroport à l'heure. Je recommande vivement !" },
  { id: "r2", author: "Leïla M.", city: "Sousse", rating: 5, text: "Prix très corrects et aucune carte bancaire demandée. Parfait pour les vacances." },
  { id: "r3", author: "Karim T.", city: "Djerba", rating: 5, text: "Voiture propre et récente. Réservation simple et rapide. Très satisfait." },
];

const demoFaqs: Faq[] = [
  { id: "f1", question: "Faut-il une carte bancaire pour réserver ?", answer: "Non. Vous payez en espèces à la livraison, sans aucune empreinte de carte.", category: "reservation" },
  { id: "f2", question: "La livraison à l'aéroport est-elle gratuite ?", answer: "Oui, la livraison et la reprise à l'aéroport sont entièrement gratuites.", category: "livraison" },
  { id: "f3", question: "Le kilométrage est-il illimité ?", answer: "Oui, tous nos véhicules sont proposés avec kilométrage illimité.", category: "conditions" },
];

const demoHomeDocument = {
  root: { props: {} },
  content: [
    {
      type: "Hero",
      props: {
        id: "hero-1",
        variant: "overlay",
        headline: "Location de voiture en Tunisie",
        subtitle:
          "Louez une voiture avec livraison gratuite à l'aéroport. Sans carte bancaire, kilométrage illimité, assurance incluse.",
        badge: "Disponible 24h/24 · 7j/7",
        image:
          "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80",
      },
    },
    {
      type: "BookingWidget",
      props: {
        id: "booking-1",
        overlap: true,
        defaultLocation: "Aéroport Tunis-Carthage",
        actionHref: "/nos-voitures",
      },
    },
    {
      type: "FleetGrid",
      props: {
        id: "fleet-1",
        label: "Notre Flotte",
        title: "Nos Véhicules",
        maxCars: 6,
        columns: 3,
        viewAllHref: "/nos-voitures",
        viewAllLabel: "Voir tout",
      },
    },
    {
      type: "TrustBadges",
      props: {
        id: "trust-1",
        badges: [
          { icon: "credit_card_off", title: "Sans Carte Bancaire", desc: "Payez en espèces à la livraison." },
          { icon: "flight_land", title: "Livraison Aéroport", desc: "Récupérez votre voiture à l'aéroport, gratuitement." },
          { icon: "verified_user", title: "Assurance Incluse", desc: "Tous nos véhicules sont assurés tous risques." },
        ],
      },
    },
    {
      type: "PromoBanner",
      props: {
        id: "promo-1",
        badge: "Offre de l'été",
        heading: "-20% sur les locations longue durée",
        subtitle: "Réservez 7 jours ou plus et profitez d'un tarif dégressif.",
        priceLabel: "À partir de",
        price: "279",
        priceSuffix: "DT / 3 jours",
        ctaLabel: "Voir les offres",
        ctaHref: "/nos-voitures",
        image:
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
      },
    },
    {
      type: "ServicesScroll",
      props: {
        id: "services-1",
        label: "Nos Services",
        title: "Tout pour votre confort",
        services: [
          { icon: "local_airport", title: "Livraison Aéroport", desc: "Accueil personnalisé à votre arrivée, 24h/24." },
          { icon: "credit_card_off", title: "Sans Carte Bancaire", desc: "Réservez en ligne, payez en espèces à la livraison." },
          { icon: "directions_car", title: "Flotte Récente", desc: "Des véhicules récents et bien entretenus." },
          { icon: "support_agent", title: "Assistance 24/7", desc: "Notre équipe est disponible à tout moment." },
          { icon: "verified_user", title: "Assurance Tous Risques", desc: "Tous nos véhicules sont couverts." },
          { icon: "hotel", title: "Livraison Hôtel", desc: "Nous livrons directement à votre hôtel." },
        ],
      },
    },
    {
      type: "Reviews",
      props: {
        id: "reviews-1",
        label: "Avis Clients",
        title: "Ce que disent nos clients",
        layout: "carousel",
        ratingValue: 4.9,
        ratingCount: 240,
      },
    },
    {
      type: "FAQ",
      props: {
        id: "faq-1",
        label: "Questions Fréquentes",
        title: "Tout savoir sur la location",
        maxItems: 6,
      },
    },
    {
      type: "CityLinks",
      props: {
        id: "cities-1",
        label: "Nos agences",
        title: "Location de voiture par ville",
        cities: [
          { name: "Tunis", href: "/location-voiture-tunis" },
          { name: "Sousse", href: "/location-voiture-sousse" },
          { name: "Hammamet", href: "/location-voiture-hammamet" },
          { name: "Djerba", href: "/location-voiture-djerba" },
          { name: "Monastir", href: "/location-voiture-monastir" },
          { name: "Sfax", href: "/location-voiture-sfax" },
          { name: "Nabeul", href: "/location-voiture-nabeul" },
          { name: "Bizerte", href: "/location-voiture-bizerte" },
        ],
      },
    },
  ],
};

const demoSite: SeedSite = {
  config: {
    id: "seed-demo",
    slug: "demo",
    domain: "demo.localhost",
    name: "RentStack Demo",
    nameShort: "Demo",
    language: "fr",
    phoneDisplay: "+216 23 179 016",
    whatsapp: "21623179016",
    email: "contact.booking.rentalcars@gmail.com",
    logoMain: null,
    logoWhite: null,
    baseUrl: "http://demo.localhost:3000",
    themeColors: {
      primary: "#00256f",
      primaryContainer: "#1a3c8f",
      accent: "#00256f",
      footerBg: "#172554",
      onPrimaryContainer: "#92abff",
    },
    seoTitleDefault: "RentStack Demo — Location de voiture en Tunisie",
    seoDescription:
      "Démo de la plateforme RentStack : location de voiture multi-tenant rendue depuis un document de blocs.",
  },
  pages: {
    home: {
      id: "seed-page-home",
      siteId: "seed-demo",
      pageType: "home",
      slug: "home",
      title: "Accueil",
      metaDescription:
        "Location de voiture en Tunisie — livraison aéroport gratuite, sans carte bancaire.",
      h1: "Location de voiture en Tunisie",
      heroImage: null,
      isActive: true,
      content: demoHomeDocument,
    },
  },
  cars: demoCars,
  reviews: demoReviews,
  faqs: demoFaqs,
};

export const SEED_SITES: Record<string, SeedSite> = {
  demo: demoSite,
};

export function hasSeed(slug: string): boolean {
  return Boolean(SEED_SITES[slug]);
}
