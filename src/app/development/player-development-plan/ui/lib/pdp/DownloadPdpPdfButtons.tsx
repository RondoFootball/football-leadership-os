// src/app/development/player-development-plan/ui/components/DownloadPdpPdfButtons.tsx

"use client";

import * as React from "react";
import type { DevelopmentPlanV1 } from "@/app/development/player-development-plan/ui/lib/engineSchema";
import { downloadPdpPdf } from "@/app/development/player-development-plan/ui/lib/pdp/downloadPdf";

type Props = {
  plan: DevelopmentPlanV1 | null | undefined;
  lang?: "nl" | "en";
};

export function DownloadPdpPdfButtons({ plan, lang }: Props) {
  const [err, setErr] = React.useState<string>("");

  async function onDownload(version: "staff" | "player") {
    setErr("");
    try {
      await downloadPdpPdf({ plan, version, lang });
    } catch (e: any) {
      setErr(e?.message || "PDF download failed.");
    }
  }

  const disabled = !plan;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="button"
          onClick={() => onDownload("staff")}
          disabled={disabled}
          style={{ padding: "10px 12px", borderRadius: 10 }}
        >
          Download Staff PDF
        </button>

        <button
          type="button"
          onClick={() => onDownload("player")}
          disabled={disabled}
          style={{ padding: "10px 12px", borderRadius: 10 }}
        >
          Download Player PDF
        </button>
      </div>

      {!plan ? (
        <div style={{ fontSize: 12, opacity: 0.75 }}>
          Geen plan beschikbaar. Start eerst het gesprek en genereer het plan.
        </div>
      ) : null}

      {err ? (
        <div style={{ fontSize: 12, color: "#b00020" }}>{err}</div>
      ) : null}
    </div>
  );
}