import fs from "node:fs";
import path from "node:path";

type Chunk = {
  id: string;
  source: string;
  chunkIndex: number;
  text: string;
};

type KnowledgeIndex = {
  items: Chunk[];
};

let cache: KnowledgeIndex | null = null;

function loadIndex(): KnowledgeIndex {
  if (cache) return cache;

  const filePath = path.join(process.cwd(), "knowledge", "pdp", "index.json");
  const raw = fs.readFileSync(filePath, "utf8");
  cache = JSON.parse(raw);

  return cache!;
}

function scoreChunk(text: string, query: string): number {
  const q = query.toLowerCase().split(/\s+/).filter(Boolean);
  const t = text.toLowerCase();

  let score = 0;
  for (const word of q) {
    if (t.includes(word)) score += 1;
  }
  return score;
}

export function retrieveRelevantKnowledge(
  query: string,
  topK = 6
): Chunk[] {
  const index = loadIndex();

  const scored = index.items
    .map((item) => ({
      item,
      score: scoreChunk(item.text, query),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((x) => x.item);

  return scored;
}