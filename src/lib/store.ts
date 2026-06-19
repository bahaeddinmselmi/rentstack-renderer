import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { PageDocument } from "./types";

// ═══════════════════════════════════════════════════════════════════
// Local page-document store (DEV / seed mode).
//
// The builder publishes a Puck document; we persist it to a JSON file
// under `.data/pages/<slug>__<pageSlug>.json` so the public renderer
// picks it up on the next request — making "edit → publish → live"
// work end-to-end with zero backend.
//
// In production this is replaced by the backend endpoint
// `PUT /admin/sites/:id/pages/:pageSlug/content` (Phase 3, with auth).
// ═══════════════════════════════════════════════════════════════════

const DATA_DIR = path.join(process.cwd(), ".data", "pages");

function fileFor(slug: string, pageSlug: string): string {
  const safe = (s: string) => s.replace(/[^a-z0-9_-]/gi, "_");
  return path.join(DATA_DIR, `${safe(slug)}__${safe(pageSlug)}.json`);
}

export async function readPageDoc(
  slug: string,
  pageSlug: string,
): Promise<PageDocument | null> {
  try {
    const raw = await fs.readFile(fileFor(slug, pageSlug), "utf8");
    return JSON.parse(raw) as PageDocument;
  } catch {
    return null;
  }
}

export async function writePageDoc(
  slug: string,
  pageSlug: string,
  doc: PageDocument,
): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(fileFor(slug, pageSlug), JSON.stringify(doc, null, 2), "utf8");
}

export async function deletePageDoc(slug: string, pageSlug: string): Promise<void> {
  await fs.rm(fileFor(slug, pageSlug), { force: true });
}

/** List page slugs that have a stored document for this site (dev mode). */
export async function listStoredPageSlugs(slug: string): Promise<string[]> {
  const safe = (s: string) => s.replace(/[^a-z0-9_-]/gi, "_");
  const prefix = `${safe(slug)}__`;
  try {
    const files = await fs.readdir(DATA_DIR);
    return files
      .filter((f) => f.startsWith(prefix) && f.endsWith(".json"))
      .map((f) => f.slice(prefix.length, -".json".length));
  } catch {
    return [];
  }
}
