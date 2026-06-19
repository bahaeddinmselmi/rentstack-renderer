"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { RenderContext } from "@/blocks/context";

// ═══════════════════════════════════════════════════════════════════
// Builder data context — the client-side equivalent of the server
// RenderContext. The builder page fetches the tenant's cars/reviews/
// faqs/site on the server and provides them here, so data-driven blocks
// render with real content inside the Puck editor (same registry → the
// editor preview matches production).
// ═══════════════════════════════════════════════════════════════════

const Ctx = createContext<RenderContext | null>(null);

export function BuilderDataProvider({
  value,
  children,
}: {
  value: RenderContext;
  children: ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBuilderData(): RenderContext {
  const v = useContext(Ctx);
  if (!v) {
    // Defensive fallback so a block render never crashes the editor.
    return { slug: "", site: { id: "", slug: "", domain: "", name: "" }, cars: [], reviews: [], faqs: [] };
  }
  return v;
}
