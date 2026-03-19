import fsp from "node:fs/promises";
import path from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const RAW_DIR = path.join(process.cwd(), "knowledge", "raw-pdfs");
const OUT_FILE = path.join(process.cwd(), "knowledge", "pdp", "index.json");

function cleanText(s) {
  return (s || "")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function chunkText(text, maxChars = 1200, overlap = 150) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(i + maxChars, text.length);
    const slice = text.slice(i, end);
    chunks.push(slice.trim());
    i = end - overlap;
    if (i < 0) i = 0;
    if (end === text.length) break;
  }
  return chunks.filter(Boolean);
}

async function extractPdfText(buffer) {
  const uint8 = new Uint8Array(buffer);
  const loadingTask = getDocument({
    data: uint8,
    disableWorker: true,
    verbosity: 0,
  });

  const pdf = await loadingTask.promise;
  let out = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    // Join items with spaces; insert a newline between “lines-ish”
    const strings = content.items
      .map((it) => (typeof it.str === "string" ? it.str : ""))
      .filter(Boolean);

    out += strings.join(" ") + "\n\n";
  }

  return out;
}

async function main() {
  await fsp.mkdir(path.dirname(OUT_FILE), { recursive: true });

  const files = await fsp.readdir(RAW_DIR).catch(() => []);
  const pdfs = files.filter((f) => f.toLowerCase().endsWith(".pdf"));

  if (!pdfs.length) {
    console.error(`No PDFs found in ${RAW_DIR}`);
    console.error(`→ Put PDFs in: knowledge/raw-pdfs/`);
    process.exit(1);
  }

  const items = [];

  for (const filename of pdfs) {
    const full = path.join(RAW_DIR, filename);
    const dataBuffer = await fsp.readFile(full);

    const rawText = await extractPdfText(dataBuffer);
    const text = cleanText(rawText);

    const chunks = chunkText(text, 1200, 150);

    chunks.forEach((c, idx) => {
      items.push({
        id: `${filename}::${idx + 1}`,
        source: filename,
        chunkIndex: idx + 1,
        text: c,
      });
    });

    console.log(`✓ ${filename}: ${chunks.length} chunks`);
  }

  await fsp.writeFile(
    OUT_FILE,
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        chunkSize: 1200,
        overlap: 150,
        count: items.length,
        items,
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(`\nDone. Wrote ${items.length} chunks → ${OUT_FILE}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
