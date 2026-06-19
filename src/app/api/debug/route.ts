import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = (process.env.PLATFORM_API_KEY || "").trim();
  const backendUrl = process.env.BACKEND_API_URL || "http://212.47.70.100:8088/api/v1";
  const useSeed = process.env.USE_SEED === "1" || !apiKey;

  let backendStatus: number | string = "not_tried";
  let backendError: string | null = null;

  if (!useSeed) {
    try {
      const res = await fetch(`${backendUrl}/public/sites/car-hire-tunisia`, {
        headers: { "X-Api-Key": apiKey },
        signal: AbortSignal.timeout(5000),
      });
      backendStatus = res.status;
    } catch (e: any) {
      backendError = e?.message ?? String(e);
      backendStatus = "fetch_failed";
    }
  }

  return NextResponse.json({
    hasApiKey: !!apiKey,
    apiKeyPrefix: apiKey.slice(0, 12) || "(empty)",
    backendUrl,
    useSeed,
    backendStatus,
    backendError,
  });
}
