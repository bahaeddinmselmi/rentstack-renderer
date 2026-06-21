import Hero from "./Hero";
import BookingWidget from "./BookingWidget";
import TrustBadges from "./TrustBadges";
import FleetGrid from "./FleetGrid";
import FleetScroll from "./FleetScroll";
import PromoBanner from "./PromoBanner";
import ServicesScroll from "./ServicesScroll";
import Reviews from "./Reviews";
import FAQ from "./FAQ";
import AirportDelivery from "./AirportDelivery";
import CityLinks from "./CityLinks";
import RichText from "./RichText";
import ImageBanner from "./ImageBanner";
import WhatsAppCTA from "./WhatsAppCTA";
import PricingTable from "./PricingTable";
import GoogleMap from "./GoogleMap";
import VideoEmbed from "./VideoEmbed";
import type { RenderContext } from "./context";

// ═══════════════════════════════════════════════════════════════════
// Block registry — the SINGLE source of truth for which block `type`
// strings exist and how each renders. The public PageRenderer (server)
// consumes this map; the Puck builder (Phase 2) will wrap the same
// components so the editor preview === production output.
//
// Each entry is called as (props, ctx). Pure presentational blocks
// ignore `ctx`; data-driven ones (FleetGrid, FleetScroll, Reviews, FAQ)
// read live tenant data from it. Blocks whose body is interactive
// (BookingWidget) return a client component as JSX, so hooks run inside
// React's render — not when the registry calls the block function.
// Block props always stay plain JSON — exactly what `site_pages.content`
// persists.
// ═══════════════════════════════════════════════════════════════════

type AnyProps = { id: string; [key: string]: unknown };
type BlockComponent = (props: never, ctx: RenderContext) => React.ReactNode;

const REGISTRY: Record<string, BlockComponent> = {
  Hero: Hero as unknown as BlockComponent,
  BookingWidget: BookingWidget as unknown as BlockComponent,
  TrustBadges: TrustBadges as unknown as BlockComponent,
  FleetGrid: FleetGrid as unknown as BlockComponent,
  FleetScroll: FleetScroll as unknown as BlockComponent,
  PromoBanner: PromoBanner as unknown as BlockComponent,
  ServicesScroll: ServicesScroll as unknown as BlockComponent,
  Reviews: Reviews as unknown as BlockComponent,
  FAQ: FAQ as unknown as BlockComponent,
  AirportDelivery: AirportDelivery as unknown as BlockComponent,
  CityLinks: CityLinks as unknown as BlockComponent,
  RichText: RichText as unknown as BlockComponent,
  ImageBanner: ImageBanner as unknown as BlockComponent,
  WhatsAppCTA: WhatsAppCTA as unknown as BlockComponent,
  PricingTable: PricingTable as unknown as BlockComponent,
  GoogleMap: GoogleMap as unknown as BlockComponent,
  VideoEmbed: VideoEmbed as unknown as BlockComponent,
};

/** Block types the builder palette can offer (Phase 2). */
export const BLOCK_TYPES = Object.keys(REGISTRY);

/** Render one block instance, or null for an unknown type. */
export function renderBlock(
  type: string,
  props: AnyProps,
  ctx: RenderContext,
): React.ReactNode {
  const Component = REGISTRY[type];
  if (!Component) return null;
  return Component(props as never, ctx);
}

export function hasBlock(type: string): boolean {
  return type in REGISTRY;
}
