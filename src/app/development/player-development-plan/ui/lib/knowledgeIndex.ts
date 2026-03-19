import fs from "node:fs";
import path from "node:path";

export type KnowledgeChunk = {
  id: string;
  source: string; // e.g. "Visual OS.pdf"
  page?: number; // optional
  text: string;
};

export type KnowledgeHit = KnowledgeChunk & {
  score: number;
};

const DEFAULT_INDEX_PATH = path.join(process.cwd(), "data", "pdp-knowledge.json");

function normalize(s: string) {
  return (s || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(s: string) {
  const t = normalize(s);
  if (!t) return [];
  return t.split(" ").filter(Boolean);
}

function loadIndex(indexPath = DEFAULT_INDEX_PATH): KnowledgeChunk[] {
  if (!fs.existsSync(indexPath)) return [];
  const raw = fs.readFileSync(indexPath, "utf8");
  const parsed = JSON.parse(raw);

  // support:
  // - { items:[...] } (your ingest output)
  // - { chunks:[...] }
  // - [...]
  const arr =
    Array.isArray(parsed) ? parsed : Array.isArray(parsed?.items) ? parsed.items : parsed?.chunks;

  if (!Array.isArray(arr)) return [];

  return arr
    .map((c: any, i: number) => ({
      id: String(c.id ?? `chunk_${i}`),
      source: String(c.source ?? c.file ?? "unknown"),
      page: typeof c.page === "number" ? c.page : undefined,
      text: String(c.text ?? ""),
    }))
    .filter((c: KnowledgeChunk) => c.text.trim().length > 0);
}

function scoreChunk(queryTokens: string[], chunkText: string) {
  const hay = normalize(chunkText);
  if (!hay) return 0;

  let score = 0;
  for (const tok of queryTokens) {
    if (!tok) continue;
    if (hay.includes(tok)) score += 1;
  }

  // phrase bonus
  const phrase = queryTokens.slice(0, 8).join(" ");
  if (phrase.length >= 12 && hay.includes(phrase)) score += 4;

  return score;
}

export function retrieveKnowledge(params: {
  query: string;
  topK?: number;
  indexPath?: string;
}): KnowledgeHit[] {
  const { query, topK = 6, indexPath } = params;
  const chunks = loadIndex(indexPath || DEFAULT_INDEX_PATH);

  const qTokens = tokenize(query).filter((t) => t.length >= 3);
  if (!qTokens.length || !chunks.length) return [];

  return chunks
    .map((c) => ({ ...c, score: scoreChunk(qTokens, c.text) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}