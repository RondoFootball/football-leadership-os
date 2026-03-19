export type Lang = "en" | "de" | "es" | "fr" | "it" | "nl";

type Track = { n: "01" | "02" | "03"; title: string; desc: string };

type Slide = {
  back: string;
  titleA: string;
  titleB: string;
  sub: string;
  sections: { label: string; text: string }[];
  cta: string;
  foot: string;
};

type Copy = {
  brand: string;
  requestAccess: string;
  explore: string;

  exploreTitleA: string;
  exploreTitleB: string;
  tracks: Track[];
  tracksCta: string;

  requestTitle: string;
  requestSubtitle: string;
  requestSubmit: string;

  fName: string;
  fEmail: string;
  fRole: string;
  fClub: string;
  fNote: string;
  fNamePh: string;
  fEmailPh: string;
  fRolePh: string;
  fClubPh: string;
  fNotePh: string;

  whatYouGet: string;
  whatYouGetBullets: string[];

  submittedTitle: string;
  submittedBody: string;
  footerLine: string;

  vision: Slide;
  recruitment: Slide;
  development: Slide;
};

export const COPY: Record<Lang, Copy> = {
  en: {
    brand: "FOOTBALL LEADERSHIP",
    requestAccess: "Request access",
    explore: "Explore",

    exploreTitleA: "Explore.",
    exploreTitleB: "Start where it matters.",
    tracksCta: "Open →",
    tracks: [
      { n: "01", title: "Vision & Strategy", desc: "Set direction. Keep it consistent through pressure." },
      { n: "02", title: "Recruitment", desc: "Plan windows. Define profiles. Protect decision quality." },
      { n: "03", title: "Development & Assessments", desc: "Build plans. Run assessments. Track what changes." },
    ],

    requestTitle: "Request access.",
    requestSubtitle: "For professional football clubs — and the people accountable for direction.",
    requestSubmit: "Submit",

    fName: "Name",
    fEmail: "Email",
    fRole: "Role",
    fClub: "Club / Organisation",
    fNote: "Note (optional)",
    fNamePh: "Your name",
    fEmailPh: "you@club.com",
    fRolePh: "Sporting Director / Head Coach / CEO / …",
    fClubPh: "Club name",
    fNotePh: "What are you trying to improve?",

    whatYouGet: "WHAT YOU GET",
    whatYouGetBullets: [
      "A clear way to set vision and priorities",
      "Recruitment planning with ownership",
      "Assessments and development plans that stick",
      "Minimal interface. Serious standard.",
    ],

    submittedTitle: "Submitted.",
    submittedBody: "Thanks — we’ll follow up.",
    footerLine: "A product company. Built to become the standard.",

    vision: {
      back: "← Explore",
      titleA: "Vision.",
      titleB: "Direction under pressure.",
      sub: "Structure for identity, priorities and non-negotiables.",
      sections: [
        { label: "Identity", text: "Playing model. Leadership model. Cultural baseline." },
        { label: "Priorities", text: "Short-term focus. Long-term trajectory. Clear sequencing." },
        { label: "Alignment", text: "Board. Sporting director. Head coach. Same language." },
      ],
      cta: "Request access",
      foot: "Built for coherence — not noise.",
    },

    recruitment: {
      back: "← Explore",
      titleA: "Recruitment.",
      titleB: "Decisions without chaos.",
      sub: "Structure for windows, profiles and ownership.",
      sections: [
        { label: "Profiles", text: "Role clarity. Tactical fit. Financial logic." },
        { label: "Process", text: "From scouting to final decision — structured." },
        { label: "Ownership", text: "Clear mandate. Clear escalation. No grey zones." },
      ],
      cta: "Request access",
      foot: "Recruitment as a system — not a reaction.",
    },

    development: {
      back: "← Explore",
      titleA: "Development.",
      titleB: "Make progress visible.",
      sub: "Assessments and development plans that connect to performance.",
      sections: [
        { label: "Diagnosis", text: "Individual, staff and system-level clarity." },
        { label: "Plans", text: "Role-based focus. Clear constraints." },
        { label: "Follow-up", text: "Rhythm, ownership, and honest review." },
      ],
      cta: "Request access",
      foot: "Development as discipline — not intention.",
    },
  },

  nl: {
    brand: "FOOTBALL LEADERSHIP",
    requestAccess: "Toegang aanvragen",
    explore: "Verkennen",

    exploreTitleA: "Verkennen.",
    exploreTitleB: "Begin bij wat telt.",
    tracksCta: "Open →",
    tracks: [
      { n: "01", title: "Visie & Strategie", desc: "Richting zetten. Koers houden als het schuurt." },
      { n: "02", title: "Recruitment", desc: "Windows plannen. Profielen scherp. Besluiten rustig." },
      { n: "03", title: "Ontwikkeling & Assessments", desc: "Plannen bouwen. Assessments draaien. Verandering volgen." },
    ],

    requestTitle: "Toegang aanvragen.",
    requestSubtitle: "Voor profclubs — en de mensen die eindverantwoordelijk zijn voor richting.",
    requestSubmit: "Versturen",

    fName: "Naam",
    fEmail: "Email",
    fRole: "Rol",
    fClub: "Club / Organisatie",
    fNote: "Notitie (optioneel)",
    fNamePh: "Jouw naam",
    fEmailPh: "jij@club.com",
    fRolePh: "TD / Hoofdtrainer / Directie / …",
    fClubPh: "Clubnaam",
    fNotePh: "Waar wil je scherper in worden?",

    whatYouGet: "WAT JE KRIJGT",
    whatYouGetBullets: [
      "Een heldere manier om koers te zetten",
      "Recruitmentplanning met eigenaarschap",
      "Assessments en ontwikkelplannen die blijven hangen",
      "Minimal interface. Serieuze standaard.",
    ],

    submittedTitle: "Verstuurd.",
    submittedBody: "Dank — we komen bij je terug.",
    footerLine: "Productbedrijf. Gebouwd om de standaard te worden.",

    vision: {
      back: "← Verkennen",
      titleA: "Visie.",
      titleB: "Koers als het schuurt.",
      sub: "Structuur voor identiteit, prioriteiten en non-negotiables.",
      sections: [
        { label: "Identiteit", text: "Speelwijze. Leiderschap. Culturele ondergrens." },
        { label: "Prioriteiten", text: "Korte termijn focus. Lange termijn lijn. Volgorde." },
        { label: "Afstemming", text: "Bestuur, TD, hoofdtrainer — dezelfde taal." },
      ],
      cta: "Toegang aanvragen",
      foot: "Gemaakt voor samenhang — niet voor ruis.",
    },

    recruitment: {
      back: "← Verkennen",
      titleA: "Recruitment.",
      titleB: "Besluiten zonder chaos.",
      sub: "Structuur voor windows, profielen en eigenaarschap.",
      sections: [
        { label: "Profielen", text: "Rolscherpte. Tactische fit. Financiële logica." },
        { label: "Proces", text: "Van scouting tot besluit — strak ingericht." },
        { label: "Eigenaarschap", text: "Mandaat helder. Escalatie helder. Geen grijs gebied." },
      ],
      cta: "Toegang aanvragen",
      foot: "Recruitment als systeem — niet als reactie.",
    },

    development: {
      back: "← Verkennen",
      titleA: "Ontwikkeling.",
      titleB: "Maak progressie zichtbaar.",
      sub: "Assessments en ontwikkelplannen die aan performance hangen.",
      sections: [
        { label: "Diagnose", text: "Individu, staf en systeem — scherp beeld." },
        { label: "Plannen", text: "Rolgericht. Beperkte focus. Heldere grenzen." },
        { label: "Follow-up", text: "Ritme, eigenaarschap en eerlijke evaluatie." },
      ],
      cta: "Toegang aanvragen",
      foot: "Ontwikkeling als discipline — niet als intentie.",
    },
  },

  // Voor nu: de rest volgt EN (we kunnen ze daarna per taal finetunen)
  de: undefined as any,
  es: undefined as any,
  fr: undefined as any,
  it: undefined as any,
};

// Map other languages to EN to keep everything working.
COPY.de = COPY.en;
COPY.es = COPY.en;
COPY.fr = COPY.en;
COPY.it = COPY.en;