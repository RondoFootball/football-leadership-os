export type ClubPreset = {
  id: string;
  name: string;
  country: string;
  league: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  colorBalance: number;
  aliases?: string[];
  shirtImageUrl?: string;
};

export const clubPresets: ClubPreset[] = [
  /* =========================
     NETHERLANDS — EREDIVISIE
     ========================= */

  {
    id: "ajax",
    name: "Ajax",
    country: "Netherlands",
    league: "Eredivisie",
    logoUrl: "/logos/netherlands/eredivisie/ajax.png",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorBalance: 72,
    aliases: ["AFC Ajax"],
    shirtImageUrl: "/shirts/netherlands/eredivisie/ajax.png",
  },
  {
    id: "az",
    name: "AZ",
    country: "Netherlands",
    league: "Eredivisie",
    logoUrl: "/logos/netherlands/eredivisie/az.png",
    primaryColor: "#D0001B",
    secondaryColor: "#FFFFFF",
    colorBalance: 72,
    aliases: ["AZ Alkmaar"],
  },
  {
    id: "excelsior",
    name: "Excelsior",
    country: "Netherlands",
    league: "Eredivisie",
    logoUrl: "/logos/netherlands/eredivisie/excelsior.png",
    primaryColor: "#000000",
    secondaryColor: "#E30613",
    colorBalance: 64,
  },
  {
    id: "fc-groningen",
    name: "FC Groningen",
    country: "Netherlands",
    league: "Eredivisie",
    logoUrl: "/logos/netherlands/eredivisie/fc-groningen.png",
    primaryColor: "#00853F",
    secondaryColor: "#FFFFFF",
    colorBalance: 72,
  },
  {
    id: "fc-twente",
    name: "FC Twente",
    country: "Netherlands",
    league: "Eredivisie",
    logoUrl: "/logos/netherlands/eredivisie/fc-twente.png",
    primaryColor: "#E30613",
    secondaryColor: "#FFFFFF",
    colorBalance: 70,
    aliases: ["FC Twente Enschede"],
  },
  {
    id: "fc-utrecht",
    name: "FC Utrecht",
    country: "Netherlands",
    league: "Eredivisie",
    logoUrl: "/logos/netherlands/eredivisie/fc-utrecht.png",
    primaryColor: "#E30613",
    secondaryColor: "#FFFFFF",
    colorBalance: 70,
  },
  {
    id: "fc-volendam",
    name: "FC Volendam",
    country: "Netherlands",
    league: "Eredivisie",
    logoUrl: "/logos/netherlands/eredivisie/fc-volendam.png",
    primaryColor: "#F58220",
    secondaryColor: "#000000",
    colorBalance: 70,
  },
  {
    id: "feyenoord",
    name: "Feyenoord",
    country: "Netherlands",
    league: "Eredivisie",
    logoUrl: "/logos/netherlands/eredivisie/feyenoord.png",
    primaryColor: "#D4001F",
    secondaryColor: "#FFFFFF",
    colorBalance: 72,
    aliases: ["Feyenoord Rotterdam"],
  },
  {
    id: "fortuna-sittard",
    name: "Fortuna Sittard",
    country: "Netherlands",
    league: "Eredivisie",
    logoUrl: "/logos/netherlands/eredivisie/fortuna-sittard.png",
    primaryColor: "#FFD200",
    secondaryColor: "#009640",
    colorBalance: 62,
  },
  {
    id: "go-ahead-eagles",
    name: "Go Ahead Eagles",
    country: "Netherlands",
    league: "Eredivisie",
    logoUrl: "/logos/netherlands/eredivisie/go-ahead-eagles.png",
    primaryColor: "#C8102E",
    secondaryColor: "#FFD100",
    colorBalance: 66,
  },
  {
    id: "heracles-almelo",
    name: "Heracles Almelo",
    country: "Netherlands",
    league: "Eredivisie",
    logoUrl: "/logos/netherlands/eredivisie/heracles-almelo.png",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    colorBalance: 70,
  },
  {
    id: "nac-breda",
    name: "NAC Breda",
    country: "Netherlands",
    league: "Eredivisie",
    logoUrl: "/logos/netherlands/eredivisie/nac-breda.png",
    primaryColor: "#F5D000",
    secondaryColor: "#000000",
    colorBalance: 68,
  },
  {
    id: "nec",
    name: "NEC",
    country: "Netherlands",
    league: "Eredivisie",
    logoUrl: "/logos/netherlands/eredivisie/nec.png",
    primaryColor: "#D71920",
    secondaryColor: "#00853F",
    colorBalance: 62,
    aliases: ["N.E.C.", "N.E.C. Nijmegen", "NEC Nijmegen"],
  },
  {
    id: "pec-zwolle",
    name: "PEC Zwolle",
    country: "Netherlands",
    league: "Eredivisie",
    logoUrl: "/logos/netherlands/eredivisie/pec-zwolle.png",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorBalance: 72,
  },
  {
    id: "psv",
    name: "PSV",
    country: "Netherlands",
    league: "Eredivisie",
    logoUrl: "/logos/netherlands/eredivisie/psv.png",
    primaryColor: "#E30613",
    secondaryColor: "#FFFFFF",
    colorBalance: 72,
    aliases: ["PSV Eindhoven"],
  },
  {
    id: "sc-heerenveen",
    name: "sc Heerenveen",
    country: "Netherlands",
    league: "Eredivisie",
    logoUrl: "/logos/netherlands/eredivisie/sc-heerenveen.png",
    primaryColor: "#003DA5",
    secondaryColor: "#FFFFFF",
    colorBalance: 72,
    aliases: ["Heerenveen"],
  },
  {
    id: "sparta-rotterdam",
    name: "Sparta Rotterdam",
    country: "Netherlands",
    league: "Eredivisie",
    logoUrl: "/logos/netherlands/eredivisie/sparta-rotterdam.png",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorBalance: 72,
  },
  {
    id: "telstar",
    name: "Telstar",
    country: "Netherlands",
    league: "Eredivisie",
    logoUrl: "/logos/netherlands/eredivisie/telstar.png",
    primaryColor: "#FFFFFF",
    secondaryColor: "#003DA5",
    colorBalance: 64,
  },
  

  /* ==================
     NETHERLANDS — KKD
     ================== */

  {
    id: "ado-den-haag",
    name: "ADO Den Haag",
    country: "Netherlands",
    league: "KKD",
    logoUrl: "/logos/netherlands/kkd/ado-den-haag.png",
    primaryColor: "#007A33",
    secondaryColor: "#F7D117",
    colorBalance: 66,
  },
  {
    id: "almere-city",
    name: "Almere City",
    country: "Netherlands",
    league: "KKD",
    logoUrl: "/logos/netherlands/kkd/almere-city.png",
    primaryColor: "#E30613",
    secondaryColor: "#000000",
    colorBalance: 64,
  },
  {
    id: "de-graafschap",
    name: "De Graafschap",
    country: "Netherlands",
    league: "KKD",
    logoUrl: "/logos/netherlands/kkd/de-graafschap.png",
    primaryColor: "#004B9B",
    secondaryColor: "#FFFFFF",
    colorBalance: 72,
  },
  {
    id: "fc-den-bosch",
    name: "FC Den Bosch",
    country: "Netherlands",
    league: "KKD",
    logoUrl: "/logos/netherlands/kkd/fc-den-bosch.png",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorBalance: 72,
  },
  {
    id: "fc-dordrecht",
    name: "FC Dordrecht",
    country: "Netherlands",
    league: "KKD",
    logoUrl: "/logos/netherlands/kkd/fc-dordrecht.png",
    primaryColor: "#00853F",
    secondaryColor: "#FFFFFF",
    colorBalance: 72,
  },
  {
    id: "fc-eindhoven",
    name: "FC Eindhoven",
    country: "Netherlands",
    league: "KKD",
    logoUrl: "/logos/netherlands/kkd/fc-eindhoven.png",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorBalance: 72,
  },
  {
    id: "fc-emmen",
    name: "FC Emmen",
    country: "Netherlands",
    league: "KKD",
    logoUrl: "/logos/netherlands/kkd/fc-emmen.png",
    primaryColor: "#E30613",
    secondaryColor: "#FFFFFF",
    colorBalance: 72,
  },
  {
    id: "helmond-sport",
    name: "Helmond Sport",
    country: "Netherlands",
    league: "KKD",
    logoUrl: "/logos/netherlands/kkd/helmond-sport.png",
    primaryColor: "#000000",
    secondaryColor: "#FFD200",
    colorBalance: 62,
  },
  {
    id: "jong-ajax",
    name: "Jong Ajax",
    country: "Netherlands",
    league: "KKD",
    logoUrl: "/logos/netherlands/kkd/jong-ajax.png",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorBalance: 72,
  },
  {
    id: "jong-az",
    name: "Jong AZ",
    country: "Netherlands",
    league: "KKD",
    logoUrl: "/logos/netherlands/kkd/jong-az.png",
    primaryColor: "#D0001B",
    secondaryColor: "#FFFFFF",
    colorBalance: 72,
  },
  {
    id: "jong-psv",
    name: "Jong PSV",
    country: "Netherlands",
    league: "KKD",
    logoUrl: "/logos/netherlands/kkd/jong-psv.png",
    primaryColor: "#E30613",
    secondaryColor: "#FFFFFF",
    colorBalance: 72,
  },
  {
    id: "jong-utrecht",
    name: "Jong Utrecht",
    country: "Netherlands",
    league: "KKD",
    logoUrl: "/logos/netherlands/kkd/jong-utrecht.png",
    primaryColor: "#E30613",
    secondaryColor: "#FFFFFF",
    colorBalance: 70,
  },
  {
    id: "mvv-maastricht",
    name: "MVV Maastricht",
    country: "Netherlands",
    league: "KKD",
    logoUrl: "/logos/netherlands/kkd/mvv-maastricht.png",
    primaryColor: "#C8102E",
    secondaryColor: "#FFFFFF",
    colorBalance: 72,
  },
  {
    id: "rkc-waalwijk",
    name: "RKC Waalwijk",
    country: "Netherlands",
    league: "KKD",
    logoUrl: "/logos/netherlands/kkd/rkc-waalwijk.png",
    primaryColor: "#FFD200",
    secondaryColor: "#0057B8",
    colorBalance: 66,
  },
  {
    id: "roda-jc",
    name: "Roda JC",
    country: "Netherlands",
    league: "KKD",
    logoUrl: "/logos/netherlands/kkd/roda-jc.png",
    primaryColor: "#FFD200",
    secondaryColor: "#000000",
    colorBalance: 68,
    aliases: ["Roda JC Kerkrade"],
  },
  {
    id: "sc-cambuur",
    name: "SC Cambuur",
    country: "Netherlands",
    league: "KKD",
    logoUrl: "/logos/netherlands/kkd/sc-cambuur.png",
    primaryColor: "#FFD200",
    secondaryColor: "#0057B8",
    colorBalance: 66,
    aliases: ["Cambuur"],
  },
  {
    id: "top-oss",
    name: "TOP Oss",
    country: "Netherlands",
    league: "KKD",
    logoUrl: "/logos/netherlands/kkd/top-oss.png",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorBalance: 72,
  },
  {
    id: "vitesse",
    name: "Vitesse",
    country: "Netherlands",
    league: "KKD",
    logoUrl: "/logos/netherlands/kkd/vitesse.png",
    primaryColor: "#FFD200",
    secondaryColor: "#000000",
    colorBalance: 68,
  },
  {
    id: "vvv-venlo",
    name: "VVV-Venlo",
    country: "Netherlands",
    league: "KKD",
    logoUrl: "/logos/netherlands/kkd/vvv-venlo.png",
    primaryColor: "#FFD200",
    secondaryColor: "#000000",
    colorBalance: 68,
  },
  {
    id: "willem-ii",
    name: "Willem II",
    country: "Netherlands",
    league: "KKD",
    logoUrl: "/logos/netherlands/kkd/willem-ii.png",
    primaryColor: "#D71920",
    secondaryColor: "#0057B8",
    colorBalance: 62,
    aliases: ["Willem II Tilburg"],
  },

  /* ======================
     PLACEHOLDERS — OTHER
     ====================== */

  {
    id: "custom-club",
    name: "Custom Club",
    country: "Other",
    league: "Other",
    logoUrl: "",
    primaryColor: "#111111",
    secondaryColor: "#FFFFFF",
    colorBalance: 70,
    aliases: ["Other club", "Andere club"],
  },
];

/* ---------------- HELPERS ---------------- */

function norm(v: string) {
  return v.trim().toLowerCase();
}

export function getClubPresetByName(name: string) {
  const input = norm(name);

  return clubPresets.find((club) => {
    if (norm(club.name) === input) return true;
    if (club.aliases?.some((alias) => norm(alias) === input)) return true;
    return false;
  });
}

export function getClubPresetsByCountry(country: string) {
  return clubPresets.filter((club) => norm(club.country) === norm(country));
}

export function getClubPresetsByCountryAndLeague(country: string, league: string) {
  return clubPresets.filter(
    (club) =>
      norm(club.country) === norm(country) &&
      norm(club.league) === norm(league)
  );
}

export const clubPresetGroups = {
  netherlands: {
    label: "Netherlands",
    leagues: {
      eredivisie: clubPresets.filter(
        (club) => club.country === "Netherlands" && club.league === "Eredivisie"
      ),
      kkd: clubPresets.filter(
        (club) => club.country === "Netherlands" && club.league === "KKD"
      ),
    },
  },
};