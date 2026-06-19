"use client";

import type { Config } from "@puckeditor/core";
import { renderBlock } from "@/blocks/registry";
import { useBuilderData } from "./data";

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
      // locations is array of {value}; flatten before render.
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
  },
};
