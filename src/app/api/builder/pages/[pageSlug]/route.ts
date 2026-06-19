import { NextResponse, type NextRequest } from "next/server";
import { deletePageDoc } from "@/lib/store";

// ═══════════════════════════════════════════════════════════════════
// DELETE /api/builder/pages/:pageSlug?slug=<site>&token=<t>
// Token present → forward to backend; else delete from the file store.
// The home page is protected (cannot be deleted).
// ═══════════════════════════════════════════════════════════════════

const BACKEND_API_URL =
  process.env.BACKEND_API_URL || "http://212.47.70.100:8088/api/v1";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ pageSlug: string }> },
) {
  const { pageSlug } = await params;
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  const token = url.searchParams.get("token");
  if (!slug) return NextResponse.json({ error: "slug is required" }, { status: 400 });
  if (pageSlug === "home") {
    return NextResponse.json({ error: "The home page cannot be deleted" }, { status: 400 });
  }

  if (token) {
    try {
      const res = await fetch(
        `${BACKEND_API_URL}/builder/pages/${encodeURIComponent(pageSlug)}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return NextResponse.json({ error: data.error || `Backend ${res.status}` }, { status: res.status });
      }
      return NextResponse.json({ ok: true });
    } catch (e) {
      return NextResponse.json({ error: e instanceof Error ? e.message : "Backend unreachable" }, { status: 502 });
    }
  }

  await deletePageDoc(slug, pageSlug);
  return NextResponse.json({ ok: true });
}
