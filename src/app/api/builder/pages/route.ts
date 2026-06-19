import { NextResponse, type NextRequest } from "next/server";
import { writePageDoc, readPageDoc } from "@/lib/store";
import type { PageDocument } from "@/lib/types";

// ═══════════════════════════════════════════════════════════════════
// POST /api/builder/pages — create a new (empty) page.
// Body: { slug, pageSlug, pageType?, title?, token? }.
// Token present → forward to backend; else create in the local file store.
// ═══════════════════════════════════════════════════════════════════

const BACKEND_API_URL =
  process.env.BACKEND_API_URL || "http://212.47.70.100:8088/api/v1";

function cleanSlug(s: string): string {
  return s.trim().toLowerCase().replace(/[^a-z0-9/-]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { slug, token, pageType, title } = body as Record<string, string>;
  const pageSlug = cleanSlug(String(body?.pageSlug || ""));
  if (!slug || !pageSlug) {
    return NextResponse.json({ error: "slug and pageSlug are required" }, { status: 400 });
  }

  if (token) {
    try {
      const res = await fetch(`${BACKEND_API_URL}/builder/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slug: pageSlug, pageType, title }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return NextResponse.json({ error: data.error || `Backend ${res.status}` }, { status: res.status });
      }
      return NextResponse.json({ ok: true, slug: pageSlug });
    } catch (e) {
      return NextResponse.json({ error: e instanceof Error ? e.message : "Backend unreachable" }, { status: 502 });
    }
  }

  // Dev: refuse to clobber an existing stored page, then write an empty doc.
  const existing = await readPageDoc(slug, pageSlug);
  if (existing) {
    return NextResponse.json({ error: `Page "${pageSlug}" already exists` }, { status: 409 });
  }
  const empty: PageDocument = { root: { props: {} }, content: [] };
  await writePageDoc(slug, pageSlug, empty);
  return NextResponse.json({ ok: true, slug: pageSlug });
}
