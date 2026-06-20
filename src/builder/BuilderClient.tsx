"use client";

import { useState } from "react";
import { Puck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { puckConfig } from "./puck.config";
import { BuilderDataProvider } from "./data";
import type { RenderContext } from "@/blocks/context";
import type { PageDocument } from "@/lib/types";
import type { PageRef } from "@/lib/api";

// ═══════════════════════════════════════════════════════════════════
// BuilderClient — hosts <Puck>. The preview is rendered inline (iframe
// disabled) so the app's global CSS, fonts and per-tenant theme vars
// reach the blocks. A page bar switches/creates/deletes pages; publish
// POSTs the document to the renderer's save route (which forwards to the
// backend when a builder token is present). Admin-driven only.
// ═══════════════════════════════════════════════════════════════════

const EMPTY: Data = { content: [], root: {} } as Data;

function cleanSlug(s: string): string {
  return s.trim().toLowerCase().replace(/[^a-z0-9/-]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function BuilderClient({
  slug,
  pageSlug,
  initialData,
  pages,
  ctx,
  themeVars,
  token,
}: {
  slug: string;
  pageSlug: string;
  initialData: PageDocument | null;
  pages: PageRef[];
  ctx: RenderContext;
  themeVars: React.CSSProperties;
  token?: string | null;
}) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [adding, setAdding] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Seed root.props from site theme vars so the color pickers start on the
  // right values. Saved root.props (if any) take priority over site defaults.
  const tv = themeVars as Record<string, string>;
  const siteRootProps = {
    primary:  tv["--site-primary"]  || "#00256f",
    accent:   tv["--site-accent"]   || "#00256f",
    footerBg: tv["--site-footer-bg"] || "#172554",
  };
  const savedRootProps = (initialData as Record<string, unknown> | null)?.root as Record<string, unknown> | undefined;
  const mergedRoot = { props: { ...siteRootProps, ...((savedRootProps?.props as Record<string, unknown>) || {}) } };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Data = { ...((initialData as unknown as Data) || EMPTY), root: mergedRoot as any };

  const tokenQ = token ? `?t=${encodeURIComponent(token)}` : "";
  const pageHref = (p: string) => `/builder/${slug}/${p}${tokenQ}`;
  // Ensure the current page is always selectable even if the list lags.
  const pageList = pages.some((p) => p.slug === pageSlug)
    ? pages
    : [...pages, { slug: pageSlug, title: pageSlug, pageType: "page" }];

  async function save(doc: Data) {
    setStatus("saving");
    try {
      const res = await fetch("/api/builder/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, pageSlug, data: doc, token }),
      });
      setStatus(res.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
  }

  async function createPage() {
    const ps = cleanSlug(newSlug);
    if (!ps) return;
    setBusy(true);
    try {
      const res = await fetch("/api/builder/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, pageSlug: ps, token }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        window.location.href = pageHref(json.slug || ps);
      } else {
        alert(json.error || "Échec de la création");
        setBusy(false);
      }
    } catch {
      alert("Création impossible");
      setBusy(false);
    }
  }

  async function deleteCurrent() {
    if (pageSlug === "home") return;
    setBusy(true);
    try {
      const qs = new URLSearchParams({ slug });
      if (token) qs.set("token", token);
      const res = await fetch(`/api/builder/pages/${encodeURIComponent(pageSlug)}?${qs}`, {
        method: "DELETE",
      });
      if (res.ok) {
        window.location.href = pageHref("home");
      } else {
        const json = await res.json().catch(() => ({}));
        alert(json.error || "Échec de la suppression");
        setBusy(false);
      }
    } catch {
      alert("Suppression impossible");
      setBusy(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 bg-neutral-900 px-5 py-2.5 text-sm text-white">
        <div className="flex items-center gap-3">
          <span className="font-headline font-bold">RentStack Builder</span>
          <span className="text-white/40">·</span>
          <span className="text-white/70">{slug}</span>
        </div>
        <div className="flex items-center gap-4">
          {status === "saving" ? <span className="text-amber-300">Enregistrement…</span> : null}
          {status === "saved" ? <span className="text-emerald-400">✓ Publié</span> : null}
          {status === "error" ? <span className="text-red-400">Échec — réessayez</span> : null}
          <a href={`/${pageSlug === "home" ? "" : pageSlug}`} target="_blank" className="rounded bg-white/10 px-3 py-1 hover:bg-white/20">
            Voir le site ↗
          </a>
        </div>
      </div>

      {/* Page bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 bg-neutral-100 px-5 py-2 text-sm">
        <span className="text-neutral-500">Page :</span>
        {pageList.map((p) => {
          const active = p.slug === pageSlug;
          return (
            <a
              key={p.slug}
              href={active ? undefined : pageHref(p.slug)}
              className={`rounded-md px-3 py-1 font-medium ${
                active ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 hover:bg-neutral-200"
              }`}
              title={p.title}
            >
              {p.slug}
            </a>
          );
        })}

        {adding ? (
          <span className="flex items-center gap-1">
            <input
              autoFocus
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createPage()}
              placeholder="nos-voitures"
              className="w-40 rounded-md border border-neutral-300 px-2 py-1"
            />
            <button onClick={createPage} disabled={busy} className="rounded-md bg-neutral-900 px-2 py-1 text-white disabled:opacity-50">
              Créer
            </button>
            <button onClick={() => { setAdding(false); setNewSlug(""); }} className="px-2 py-1 text-neutral-500">
              Annuler
            </button>
          </span>
        ) : (
          <button onClick={() => setAdding(true)} className="rounded-md border border-dashed border-neutral-400 px-3 py-1 text-neutral-600 hover:bg-white">
            + Page
          </button>
        )}

        {pageSlug !== "home" ? (
          <span className="ml-auto flex items-center gap-1">
            {confirmDelete ? (
              <>
                <span className="text-neutral-500">Supprimer « {pageSlug} » ?</span>
                <button onClick={deleteCurrent} disabled={busy} className="rounded-md bg-red-600 px-2 py-1 text-white disabled:opacity-50">
                  Oui
                </button>
                <button onClick={() => setConfirmDelete(false)} className="px-2 py-1 text-neutral-500">
                  Non
                </button>
              </>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="rounded-md px-3 py-1 text-red-600 hover:bg-red-50">
                Supprimer la page
              </button>
            )}
          </span>
        ) : null}
      </div>

      <BuilderDataProvider value={ctx}>
        <Puck config={puckConfig} data={data} iframe={{ enabled: true }} onPublish={save} />
      </BuilderDataProvider>
    </div>
  );
}
