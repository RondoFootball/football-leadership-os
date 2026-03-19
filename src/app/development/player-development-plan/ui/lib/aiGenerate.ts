export type IntakePayload = {
  brand: {
    clubName?: string;
    primaryColor?: string;
    logoUrl?: string;
  };
  player: {
    name?: string;
    role?: string;
    team?: string;
    phase?: string;
    headshotUrl?: string;
  };
  clubModel: {
    dominantGameModel?: string;
    roleInModel?: string;
    criticalPhase?: string;
    nonNegotiables?: string;
  };
  diagnosis: {
    initialIntent?: string;      // <-- let op: match met je UI/plan veld
    executionLayer?: string;
    breakdownMoment?: string;
    pressureType?: string;
  };
  block: { lengthWeeks?: number };
  notes?: string;
};

export type AIDraft = {
  dominantDevelopmentObject?: { title?: string; context?: string };
  focus?: Array<{ title?: string; context?: string }>;
  whyNow?: string;
  observableShift?: string;
};

export async function generateWithAI(intake: IntakePayload): Promise<AIDraft> {
  const res = await fetch("/api/pdp/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(intake),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "AI generate failed");
  }

  return (await res.json()) as any;
}