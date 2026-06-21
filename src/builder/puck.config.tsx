"use client";

import type { Config } from "@puckeditor/core";
import { renderBlock } from "@/blocks/registry";
import { useBuilderData } from "./data";
import type React from "react";

// Inline color picker shown in Puck's field sidebar.
const colorField = {
  type: "custom" as const,
  render: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input
        type="color"
        value={value || "#00256f"}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: 40, height: 32, cursor: "pointer", border: "1px solid #d1d5db", borderRadius: 6, padding: 2 }}
      />
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#00256f"
        style={{ flex: 1, padding: "4px 8px", border: "1px solid #d1d5db", borderRadius: 6, fontFamily: "monospace", fontSize: 13 }}
      />
    </div>
  ),
};

const GOOGLE_FONT_URLS: Record<string, string> = {
  Manrope:    "https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap",
  Inter:      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
  Poppins:    "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap",
  Montserrat: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap",
  Raleway:    "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap",
  "DM Sans":  "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap",
};

const RADIUS_MAP: Record<string, string> = {
  none: "0px",
  sm:   "6px",
  md:   "12px",
  lg:   "16px",
  full: "9999px",
};

// ═══════════════════════════════════════════════════════════════════
// Puck config — field schemas for the builder palette. Crucially, every
// component's `render` delegates to the SAME `renderBlock` the public
// server renderer uses, so the editor preview IS the production output
// (zero drift). Data-driven blocks read live tenant data from the
// builder data context.
//
// Puck's persisted data shape ({ root, content, zones }) is exactly our
// PageDocument, so onPublish hands back a document we can store as-is.
// ═══════════════════════════════════════════════════════════════════

/** Render a registered block inside the editor with live tenant data. */
function EditorBlock({ type, props }: { type: string; props: Record<string, unknown> }) {
  const ctx = useBuilderData();
  const withId = { id: (props.id as string) || `${type}-preview`, ...props };
  return <>{renderBlock(type, withId as { id: string }, ctx)}</>;
}

const r = (type: string) => (props: Record<string, unknown>) =>
  <EditorBlock type={type} props={props} />;

const iconField = { type: "text" as const, label: "Icône (Material Symbols)" };

// Typed loosely: each block validates its own props at render time.
export const puckConfig: Config = {
  // Root = site-wide settings panel. Colors stored here are applied as
  // CSS vars wrapping the preview content; on publish they're saved in
  // root.props of the Puck document and read back by the public renderer.
  root: {
    fields: {
      // ── Colors ──────────────────────────────────────────────────
      primary:     { ...colorField, label: "Couleur principale" } as typeof colorField & { label: string },
      accent:      { ...colorField, label: "Couleur accent" } as typeof colorField & { label: string },
      footerBg:    { ...colorField, label: "Fond du footer" } as typeof colorField & { label: string },
      iconTint:    { ...colorField, label: "Icônes / badges" } as typeof colorField & { label: string },
      cardBg:      { ...colorField, label: "Fond des cartes" } as typeof colorField & { label: string },
      buttonText:  { ...colorField, label: "Texte des boutons" } as typeof colorField & { label: string },
      // ── Shape ───────────────────────────────────────────────────
      buttonRadius: {
        type: "select",
        label: "Arrondi des boutons",
        options: [
          { label: "Aucun", value: "none" },
          { label: "Petit", value: "sm" },
          { label: "Moyen", value: "md" },
          { label: "Grand", value: "lg" },
          { label: "Pilule", value: "full" },
        ],
      },
      // ── Typography ──────────────────────────────────────────────
      fontFamily: {
        type: "select",
        label: "Police de caractères",
        options: [
          { label: "Manrope (défaut)", value: "Manrope" },
          { label: "Inter", value: "Inter" },
          { label: "Poppins", value: "Poppins" },
          { label: "Montserrat", value: "Montserrat" },
          { label: "Raleway", value: "Raleway" },
          { label: "DM Sans", value: "DM Sans" },
        ],
      },
      // ── SEO ─────────────────────────────────────────────────────
      metaTitle: { type: "text", label: "Titre SEO (balise title)" },
      metaDescription: { type: "textarea", label: "Méta-description" },
    },
    defaultProps: {
      primary:      "#00256f",
      accent:       "#00256f",
      footerBg:     "#172554",
      iconTint:     "#92abff",
      cardBg:       "#f8faff",
      buttonText:   "#ffffff",
      buttonRadius: "md",
      fontFamily:   "Manrope",
      metaTitle:    "",
      metaDescription: "",
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (({
      children,
      primary, accent, footerBg, iconTint, cardBg, buttonText, buttonRadius, fontFamily,
    }: {
      children: React.ReactNode;
      primary: string; accent: string; footerBg: string;
      iconTint: string; cardBg: string; buttonText: string;
      buttonRadius: string; fontFamily: string;
    }) => {
      const fontUrl = GOOGLE_FONT_URLS[fontFamily] || GOOGLE_FONT_URLS["Manrope"];
      const radius = RADIUS_MAP[buttonRadius] || "12px";
      return (
        <div style={{
          "--site-primary":      primary,
          "--site-primary-dark": primary,
          "--site-accent":       accent,
          "--site-footer-bg":    footerBg,
          "--site-icon-tint":    iconTint,
          "--site-card-bg":      cardBg,
          "--site-button-text":  buttonText,
          "--site-radius":       radius,
          "--font-headline":     `"${fontFamily}", sans-serif`,
          "--font-body":         `"${fontFamily}", sans-serif`,
        } as React.CSSProperties}>
          <style>{`@import url('${fontUrl}');`}</style>
          {children}
        </div>
      );
    }) as any,
  },
  components: {
    Hero: {
      label: "Hero",
      fields: {
        variant: { type: "select", options: [
          { label: "Overlay", value: "overlay" },
          { label: "Split", value: "split" },
        ] },
        headline: { type: "text" },
        subtitle: { type: "textarea" },
        badge: { type: "text" },
        image: { type: "text", label: "Image (URL)" },
      },
      defaultProps: {
        variant: "overlay",
        headline: "Location de voiture",
        subtitle: "Livraison gratuite à l'aéroport, sans carte bancaire.",
        badge: "Disponible 24h/24",
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80",
      },
      render: r("Hero"),
    },

    BookingWidget: {
      label: "Booking widget",
      fields: {
        defaultLocation: { type: "text" },
        actionHref: { type: "text", label: "Lien recherche" },
        overlap: { type: "radio", options: [
          { label: "Chevauche le hero", value: true },
          { label: "Espacé", value: false },
        ] },
        locations: { type: "array", arrayFields: { value: { type: "text" } },
          getItemSummary: (i: { value?: string }) => i.value || "Lieu" },
      },
      defaultProps: { defaultLocation: "Aéroport Tunis-Carthage", actionHref: "/nos-voitures", overlap: false, locations: [] },
      render: (props) => {
        const locs = Array.isArray(props.locations)
          ? (props.locations as Array<{ value?: string }>).map((x) => x.value).filter(Boolean)
          : [];
        return <EditorBlock type="BookingWidget" props={{ ...props, locations: locs }} />;
      },
    },

    TrustBadges: {
      label: "Trust badges",
      fields: {
        badges: { type: "array",
          arrayFields: { icon: iconField, title: { type: "text" }, desc: { type: "textarea" } },
          getItemSummary: (i: { title?: string }) => i.title || "Badge" },
      },
      defaultProps: { badges: [
        { icon: "credit_card_off", title: "Sans Carte Bancaire", desc: "Payez en espèces à la livraison." },
        { icon: "flight_land", title: "Livraison Aéroport", desc: "Gratuite, à votre arrivée." },
        { icon: "verified_user", title: "Assurance Incluse", desc: "Tous risques." },
      ] },
      render: r("TrustBadges"),
    },

    FleetGrid: {
      label: "Fleet grid",
      fields: {
        label: { type: "text" }, title: { type: "text" },
        maxCars: { type: "number" },
        columns: { type: "select", options: [
          { label: "2", value: 2 }, { label: "3", value: 3 }, { label: "4", value: 4 } ] },
        viewAllHref: { type: "text" }, viewAllLabel: { type: "text" },
      },
      defaultProps: { label: "Notre Flotte", title: "Nos Véhicules", maxCars: 6, columns: 3, viewAllHref: "/nos-voitures", viewAllLabel: "Voir tout" },
      render: r("FleetGrid"),
    },

    FleetScroll: {
      label: "Fleet scroll",
      fields: { label: { type: "text" }, title: { type: "text" }, maxCars: { type: "number" } },
      defaultProps: { label: "Flotte", title: "Nos véhicules", maxCars: 8 },
      render: r("FleetScroll"),
    },

    PromoBanner: {
      label: "Promo banner",
      fields: {
        badge: { type: "text" }, heading: { type: "text" }, subtitle: { type: "textarea" },
        priceLabel: { type: "text" }, price: { type: "text" }, priceSuffix: { type: "text" },
        ctaLabel: { type: "text" }, ctaHref: { type: "text" }, image: { type: "text", label: "Image (URL)" },
      },
      defaultProps: { badge: "Offre spéciale", heading: "-20% longue durée", subtitle: "Réservez 7 jours ou plus.", priceLabel: "À partir de", price: "279", priceSuffix: "DT / 3 jours", ctaLabel: "Réserver", ctaHref: "/nos-voitures", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80" },
      render: r("PromoBanner"),
    },

    ServicesScroll: {
      label: "Services scroll",
      fields: {
        label: { type: "text" }, title: { type: "text" },
        services: { type: "array",
          arrayFields: { icon: iconField, title: { type: "text" }, desc: { type: "textarea" } },
          getItemSummary: (i: { title?: string }) => i.title || "Service" },
      },
      defaultProps: { label: "Nos Services", title: "Tout pour votre confort", services: [
        { icon: "local_airport", title: "Livraison Aéroport", desc: "Accueil 24h/24." },
        { icon: "credit_card_off", title: "Sans Carte", desc: "Paiement à la livraison." },
        { icon: "support_agent", title: "Assistance 24/7", desc: "Toujours disponible." },
      ] },
      render: r("ServicesScroll"),
    },

    Reviews: {
      label: "Reviews",
      fields: {
        label: { type: "text" }, title: { type: "text" },
        layout: { type: "select", options: [
          { label: "Carousel", value: "carousel" }, { label: "Grid", value: "grid" } ] },
        ratingValue: { type: "number" }, ratingCount: { type: "number" },
      },
      defaultProps: { label: "Avis Clients", title: "Ce que disent nos clients", layout: "carousel", ratingValue: 4.9, ratingCount: 200 },
      render: r("Reviews"),
    },

    FAQ: {
      label: "FAQ",
      fields: { label: { type: "text" }, title: { type: "text" }, maxItems: { type: "number" } },
      defaultProps: { label: "Questions Fréquentes", title: "Tout savoir sur la location", maxItems: 6 },
      render: r("FAQ"),
    },

    AirportDelivery: {
      label: "Airport delivery",
      fields: {
        label: { type: "text" }, title: { type: "text" }, intro: { type: "textarea" },
        airports: { type: "array",
          arrayFields: { name: { type: "text" }, desc: { type: "textarea" } },
          getItemSummary: (i: { name?: string }) => i.name || "Aéroport" },
      },
      defaultProps: { label: "Livraison Aéroport", title: "Récupérez votre voiture à l'aéroport", intro: "Nous livrons dans tous les aéroports.", airports: [
        { name: "Tunis-Carthage", desc: "Livraison gratuite 24h/24." },
        { name: "Enfidha-Hammamet", desc: "Accueil à l'arrivée." },
      ] },
      render: r("AirportDelivery"),
    },

    CityLinks: {
      label: "City links",
      fields: {
        label: { type: "text" }, title: { type: "text" },
        cities: { type: "array",
          arrayFields: { name: { type: "text" }, href: { type: "text" } },
          getItemSummary: (i: { name?: string }) => i.name || "Ville" },
      },
      defaultProps: { label: "Nos agences", title: "Location de voiture par ville", cities: [
        { name: "Tunis", href: "/location-voiture-tunis" },
        { name: "Sousse", href: "/location-voiture-sousse" },
        { name: "Hammamet", href: "/location-voiture-hammamet" },
      ] },
      render: r("CityLinks"),
    },

    RichText: {
      label: "Rich text",
      fields: {
        heading: { type: "text" }, body: { type: "textarea" },
        align: { type: "select", options: [
          { label: "Left", value: "left" }, { label: "Center", value: "center" } ] },
      },
      defaultProps: { heading: "Titre", body: "Votre texte ici.", align: "left" },
      render: r("RichText"),
    },

    ImageBanner: {
      label: "Image banner",
      fields: {
        image: { type: "text", label: "Image (URL)" }, heading: { type: "text" }, subtitle: { type: "textarea" },
        ctaLabel: { type: "text" }, ctaHref: { type: "text" },
        height: { type: "select", options: [
          { label: "Small", value: "sm" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" } ] },
      },
      defaultProps: { image: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=1600&q=80", heading: "Titre", subtitle: "Sous-titre", ctaLabel: "Découvrir", ctaHref: "#", height: "md" },
      render: r("ImageBanner"),
    },

    // ── New blocks ────────────────────────────────────────────────

    WhatsAppCTA: {
      label: "WhatsApp CTA",
      fields: {
        label:         { type: "text",     label: "Texte du bouton" },
        message:       { type: "textarea", label: "Message pré-rempli" },
        phoneOverride: { type: "text",     label: "Numéro (laisser vide → utilise celui du site)" },
      },
      defaultProps: {
        label:         "Réserver via WhatsApp",
        message:       "Bonjour, je souhaite louer une voiture.",
        phoneOverride: "",
      },
      render: r("WhatsAppCTA"),
    },

    PricingTable: {
      label: "Pricing table",
      fields: {
        title:    { type: "text",     label: "Titre" },
        subtitle: { type: "textarea", label: "Sous-titre" },
        currency: { type: "text",     label: "Devise (ex: DT, €, $)" },
        plans: {
          type: "array",
          arrayFields: {
            label:        { type: "text",   label: "Nom du véhicule / catégorie" },
            pricePerDay:  { type: "text",   label: "Prix / jour" },
            pricePerWeek: { type: "text",   label: "Prix / semaine" },
            pricePerMonth:{ type: "text",   label: "Prix / mois" },
            tag:          { type: "text",   label: "Badge (ex: Populaire)" },
            highlighted:  { type: "radio",  label: "Mettre en avant", options: [
              { label: "Oui", value: true },
              { label: "Non", value: false },
            ] },
          },
          getItemSummary: (i: { label?: string }) => i.label || "Formule",
        },
      },
      defaultProps: {
        title:    "Nos Tarifs",
        subtitle: "Transparents et sans surprise",
        currency: "DT",
        plans: [
          { label: "Citadine",    pricePerDay: "39",  pricePerWeek: "220", pricePerMonth: "750",  tag: "",         highlighted: false },
          { label: "Berline",     pricePerDay: "59",  pricePerWeek: "330", pricePerMonth: "1100", tag: "Populaire", highlighted: true },
          { label: "SUV / 4x4",  pricePerDay: "89",  pricePerWeek: "490", pricePerMonth: "1600", tag: "",         highlighted: false },
        ],
      },
      render: r("PricingTable"),
    },

    GoogleMap: {
      label: "Google Map",
      fields: {
        title:   { type: "text",   label: "Titre de la section" },
        address: { type: "text",   label: "Adresse (texte)" },
        lat:     { type: "text",   label: "Latitude" },
        lng:     { type: "text",   label: "Longitude" },
        zoom:    { type: "number", label: "Zoom (1-18)" },
        height:  { type: "select", label: "Hauteur", options: [
          { label: "Petite (280px)", value: "sm" },
          { label: "Moyenne (400px)", value: "md" },
          { label: "Grande (520px)", value: "lg" },
        ] },
      },
      defaultProps: {
        title:   "Notre localisation",
        address: "Tunis, Tunisie",
        lat:     "36.8065",
        lng:     "10.1815",
        zoom:    14,
        height:  "md",
      },
      render: r("GoogleMap"),
    },

    VideoEmbed: {
      label: "Vidéo (YouTube / TikTok)",
      fields: {
        url:         { type: "text",   label: "URL YouTube ou TikTok" },
        title:       { type: "text",   label: "Titre (optionnel)" },
        aspectRatio: { type: "select", label: "Format", options: [
          { label: "Paysage 16:9", value: "16:9" },
          { label: "Portrait 9:16 (TikTok)", value: "9:16" },
        ] },
      },
      defaultProps: {
        url:         "",
        title:       "",
        aspectRatio: "16:9",
      },
      render: r("VideoEmbed"),
    },
  },
};
