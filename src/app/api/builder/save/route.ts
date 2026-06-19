import { NextResponse, type NextRequest } from "next/server";
import { writePageDoc } from "@/lib/store";
import type { PageDocument } from "@/lib/types";

// ═══════════════════════════════════════════════════════════════════
// POST /api/builder/save — persist a published Puck document.
// Body: { slug, pageSlug, data: PageDocument, token? }.
//
// If a builder `token` is present (issued by the admin/agency backend),
// forward the publish to the backend's authenticated /builder endpoint,
// which scopes the write to the token's site/agency. Otherwise (local
// dev / seed) fall back to the file store so the loop still works.
// ═══════════════════════════════════════════════════════════════════

const BACKEND_API_URL =
  process.env.BACKEND_API_URL || "http://212.47.70.100:8088/api/v1";

export async function POST(req: NextRequest) {
  let body: { slug?: string; pageSlug?: string; data?: PageDocument; token?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { slug, pageSlug, data, token } = body;
  if (!slug || !pageSlug || !data || !Array.isArray(data.content)) {
    return NextResponse.json(
      { error: "slug, pageSlug and data.content are required" },
      { status: 400 },
    );
  }

  // Production path: a builder token → persist to the backend DB.
  if (token) {
    try {
      const res = await fetch(
        `${BACKEND_API_URL}/builder/pages/${encodeURIComponent(pageSlug)}/content`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: data }),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return NextResponse.json(
          { error: err.error || `Backend rejected publish (${res.status})` },
          { status: res.status },
        );
      }
      return NextResponse.json({ ok: true, persisted: "backend" });
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Backend unreachable" },
        { status: 502 },
      );
    }
  }

  // Dev path: no token → local file store.
  try {
    await writePageDoc(slug, pageSlug, data);
    return NextResponse.json({ ok: true, persisted: "file" });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Write failed" },
      { status: 500 },
    );
  }
}
