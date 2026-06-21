"use client";

import { useState, useCallback } from "react";
import { Puck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { puckConfig } from "./puck.config";
import { BuilderDataProvider } from "./data";
import type { RenderContext } from "@/blocks/context";
import type { PageDocument } from "@/lib/types";
import type { PageRef } from "@/lib/api";

// ═══════════════════════════════════════════════════════════════════
// BuilderClient — hosts <Puck>. iframe: { enabled: true } isolates the
// preview CSS. A page bar switches/creates/deletes pages; the header bar
// has mobile/tablet/desktop preview toggles and an AI content generator.
// Publish POSTs the document to the renderer's save route (which forwards
// to the backend when a builder token is present).
// ═══════════════════════════════════════════════════════════════════

const EMPTY: Data = { content: [], root: {} } as Data;

type PreviewWidth = "mobile" | "tablet" | "desktop";

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
  const [previewWidth, setPreviewWidth] = useState<PreviewWidth>("desktop");
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiTone, setAiTone] = useState("Professionnel");
  const [aiLang, setAiLang] = useState("FR");
  // Re-mounting Puck with a new key forces it to reinitialize with new data
  const [puckKey, setPuckKey] = useState(0);
  const [puckData, setPuckData] = useState<Data | null>(null);

  // Seed root.props from site theme vars + saved root.props
  const tv = themeVars as Record<string, string>;
  const siteRootProps = {
    primary:      tv["--site-primary"]     || "#00256f",
    accent:       tv["--site-accent"]      || "#00256f",
    footerBg:     tv["--site-footer-bg"]   || "#172554",
    iconTint:     tv["--site-icon-tint"]   || "#92abff",
    cardBg:       tv["--site-card-bg"]     || "#f8faff",
    buttonText:   tv["--site-button-text"] || "#ffffff",
    buttonRadius: "md",
    fontFamily:   "Manrope",
    metaTitle:    "",
    metaDescription: "",
  };
  const savedRootProps = (initialData as Record<string, unknown> | null)?.root as Record<string, unknown> | undefined;
  const mergedRoot = { props: { ...siteRootProps, ...((savedRootProps?.props as Record<string, unknown>) || {}) } };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const baseData: Data = { ...((initialData as unknown as Data) || EMPTY), root: mergedRoot as any };
  const data = puckData || baseData;

  const tokenQ = token ? `?t=${encodeURIComponent(token)}` : "";
  const pageHref = (p: string) => `/builder/${slug}/${p}${tokenQ}`;
  const siteHref = `https://${ctx.site.domain}/${pageSlug === "home" ? "" : pageSlug}`;

  const pageList = pages.some((p) => p.slug === pageSlug)
    ? pages
    : [...pages, { slug: pageSlug, title: pageSlug, pageType: "page" }];

  const previewMaxWidth =
    previewWidth === "mobile" ? "375px" :
    previewWidth === "tablet" ? "768px" : "100%";

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

  const generateAI = useCallback(async () => {
    setAiGenerating(true);
    setAiError("");
    try {
      const res = await fetch("/api/builder/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          siteName: ctx.site.name,
          city: ctx.site.addressCity || ctx.site.name,
          tone: aiTone,
          language: aiLang,
          token,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Génération échouée");
      // Re-mount Puck with the new document (preserves current root.props)
      const generated = json.document as Data;
      const withRoot = { ...generated, root: data.root };
      setPuckData(withRoot);
      setPuckKey((k) => k + 1);
      setShowAiModal(false);
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setAiGenerating(false);
    }
  }, [slug, ctx.site.name, ctx.site.addressCity, aiTone, aiLang, token, data.root]);

  return (
    <div>
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 bg-neutral-900 px-5 py-2.5 text-sm text-white">
        <div className="flex items-center gap-3">
          <span className="font-headline font-bold">RentStack Builder</span>
          <span className="text-white/40">·</span>
          <span className="text-white/70">{slug}</span>
        </div>

        {/* Preview width toggles */}
        <div className="flex items-center gap-1 rounded-md bg-white/10 p-0.5">
          {(["mobile", "tablet", "desktop"] as PreviewWidth[]).map((w) => {
            const label = w === "mobile" ? "📱" : w === "tablet" ? "💻" : "🖥";
            const title = w === "mobile" ? "Mobile (375px)" : w === "tablet" ? "Tablette (768px)" : "Bureau";
            return (
              <button
                key={w}
                onClick={() => setPreviewWidth(w)}
                title={title}
                className={`rounded px-2 py-1 text-sm transition-colors ${
                  previewWidth === w ? "bg-white/20 text-white" : "text-white/50 hover:text-white/80"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {status === "saving" ? <span className="text-amber-300">Enregistrement…</span> : null}
          {status === "saved" ? <span className="text-emerald-400">✓ Publié</span> : null}
          {status === "error" ? <span className="text-red-400">Échec — réessayez</span> : null}

          <button
            onClick={() => setShowAiModal(true)}
            className="rounded bg-violet-600 px-3 py-1 text-white hover:bg-violet-500"
          >
            ✨ Générer
          </button>

          <a href={siteHref} target="_blank" rel="noopener noreferrer"
            className="rounded bg-white/10 px-3 py-1 hover:bg-white/20">
            Voir le site ↗
          </a>
        </div>
      </div>

      {/* ── Page bar ──────────────────────────────────────────────── */}
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

      {/* ── Puck canvas with preview width constraint ─────────────── */}
      <div style={{ maxWidth: previewMaxWidth, margin: "0 auto", transition: "max-width 0.2s ease" }}>
        <BuilderDataProvider value={ctx}>
          <Puck
            key={puckKey}
            config={puckConfig}
            data={data}
            iframe={{ enabled: true }}
            onPublish={save}
          />
        </BuilderDataProvider>
      </div>

      {/* ── AI Generate modal ─────────────────────────────────────── */}
      {showAiModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => { if (e.target === e.currentTarget) setShowAiModal(false); }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-lg font-bold">✨ Générer une page avec l'IA</h2>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">Nom du site</label>
                <input
                  readOnly
                  value={ctx.site.name}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">Ville</label>
                <input
                  readOnly
                  value={ctx.site.addressCity || ctx.site.name}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">Ton</label>
                <select
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                >
                  <option>Professionnel</option>
                  <option>Chaleureux</option>
                  <option>Luxe</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">Langue</label>
                <select
                  value={aiLang}
                  onChange={(e) => setAiLang(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                >
                  <option value="FR">Français</option>
                  <option value="EN">English</option>
                  <option value="AR">العربية</option>
                </select>
              </div>
            </div>

            {aiError ? (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{aiError}</p>
            ) : null}

            <div className="mt-5 flex gap-3">
              <button
                onClick={generateAI}
                disabled={aiGenerating}
                className="flex-1 rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
              >
                {aiGenerating ? "Génération en cours…" : "Générer ✨"}
              </button>
              <button
                onClick={() => setShowAiModal(false)}
                className="rounded-lg px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-100"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
