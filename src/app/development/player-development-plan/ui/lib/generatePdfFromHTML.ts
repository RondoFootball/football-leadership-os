// src/app/api/pdp/pdf/_lib/generatePdfFromHtml.ts
import { chromium } from "playwright";

export async function generatePdfFromHtml(html: string): Promise<Buffer> {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", right: "14mm", bottom: "14mm", left: "14mm" },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}