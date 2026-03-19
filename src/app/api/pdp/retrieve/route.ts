import { NextResponse } from "next/server";
import { retrieveKnowledge } from "@/app/development/player-development-plan/ui/lib/knowledgeIndex";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as any;
    const query = String(body?.query || "").trim();
    const topK = Number.isFinite(body?.topK) ? Number(body.topK) : 6;

    if (!query) {
      return NextResponse.json({ hits: [], error: "Missing query" }, { status: 400 });
    }

    const hits = retrieveKnowledge({ query, topK });

    return NextResponse.json({
      hits: hits.map((h) => ({
        id: h.id,
        source: h.source,
        page: h.page,
        score: h.score,
        text: h.text,
      })),
      debug: {
        query,
        topK,
        hitCount: hits.length,
      },
    });
  } catch (err: any) {
    const message = err?.message || String(err);
    console.error("PDP_RETRIEVE_ERROR:", message);
    return NextResponse.json({ hits: [], error: "Retrieve failed", message }, { status: 500 });
  }
}