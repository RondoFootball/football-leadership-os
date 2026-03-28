import {
  clubsById,
  countriesById,
  competitionsById,
  competitionClubIds,
  getClubLogoUrl,
  getCurrentCompetitionIdForClub,
} from "./clubDatabase";

export type ClubColorMix = {
  primary: number;
  secondary: number;
  tertiary?: number;
};

export type ClubVisualPreset = {
  clubId: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor?: string;
  colorMix: ClubColorMix;
};

export type ClubPreset = {
  id: string;
  name: string;
  country: string;
  league: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor?: string;
  colorMix: ClubColorMix;
  aliases?: string[];
};

function norm(v: string) {
  return v.trim().toLowerCase();
}

/**
 * Alleen visuele clubdata.
 * Geen shirts.
 * Geen land/league.
 * Alles gegroepeerd per land voor overzicht.
 */
export const clubVisualPresetsById: Record<string, ClubVisualPreset> = {
  /* =========================
     NETHERLANDS
     ========================= */

  ajax: {
    clubId: "ajax",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 72,
      secondary: 28,
    },
  },
  az: {
    clubId: "az",
    primaryColor: "#D0001B",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 72,
      secondary: 28,
    },
  },
  excelsior: {
    clubId: "excelsior",
    primaryColor: "#000000",
    secondaryColor: "#E30613",
    colorMix: {
      primary: 64,
      secondary: 36,
    },
  },
  "fc-groningen": {
    clubId: "fc-groningen",
    primaryColor: "#00853F",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 72,
      secondary: 28,
    },
  },
  "fc-twente": {
    clubId: "fc-twente",
    primaryColor: "#E30613",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 70,
      secondary: 30,
    },
  },
  "fc-utrecht": {
    clubId: "fc-utrecht",
    primaryColor: "#E30613",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 70,
      secondary: 30,
    },
  },
  "fc-volendam": {
    clubId: "fc-volendam",
    primaryColor: "#F58220",
    secondaryColor: "#000000",
    colorMix: {
      primary: 70,
      secondary: 30,
    },
  },
  feyenoord: {
    clubId: "feyenoord",
    primaryColor: "#D4001F",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 72,
      secondary: 28,
    },
  },
  "fortuna-sittard": {
    clubId: "fortuna-sittard",
    primaryColor: "#FFD200",
    secondaryColor: "#009640",
    colorMix: {
      primary: 62,
      secondary: 38,
    },
  },
  "go-ahead-eagles": {
    clubId: "go-ahead-eagles",
    primaryColor: "#C8102E",
    secondaryColor: "#FFD100",
    colorMix: {
      primary: 66,
      secondary: 34,
    },
  },
  "heracles-almelo": {
    clubId: "heracles-almelo",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 70,
      secondary: 30,
    },
  },
  "nac-breda": {
    clubId: "nac-breda",
    primaryColor: "#F5D000",
    secondaryColor: "#000000",
    colorMix: {
      primary: 68,
      secondary: 32,
    },
  },
  nec: {
    clubId: "nec",
    primaryColor: "#D71920",
    secondaryColor: "#00853F",
    tertiaryColor: "#000000",
    colorMix: {
      primary: 52,
      secondary: 28,
      tertiary: 20,
    },
  },
  "pec-zwolle": {
    clubId: "pec-zwolle",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 72,
      secondary: 28,
    },
  },
  psv: {
    clubId: "psv",
    primaryColor: "#E30613",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 72,
      secondary: 28,
    },
  },
  "sc-heerenveen": {
    clubId: "sc-heerenveen",
    primaryColor: "#003DA5",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 72,
      secondary: 28,
    },
  },
  "sparta-rotterdam": {
    clubId: "sparta-rotterdam",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 72,
      secondary: 28,
    },
  },
  telstar: {
    clubId: "telstar",
    primaryColor: "#FFFFFF",
    secondaryColor: "#003DA5",
    colorMix: {
      primary: 64,
      secondary: 36,
    },
  },

  "ado-den-haag": {
    clubId: "ado-den-haag",
    primaryColor: "#007A33",
    secondaryColor: "#F7D117",
    colorMix: {
      primary: 66,
      secondary: 34,
    },
  },
  "almere-city": {
    clubId: "almere-city",
    primaryColor: "#E30613",
    secondaryColor: "#000000",
    colorMix: {
      primary: 64,
      secondary: 36,
    },
  },
  "de-graafschap": {
    clubId: "de-graafschap",
    primaryColor: "#004B9B",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 72,
      secondary: 28,
    },
  },
  "fc-den-bosch": {
    clubId: "fc-den-bosch",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 72,
      secondary: 28,
    },
  },
  "fc-dordrecht": {
    clubId: "fc-dordrecht",
    primaryColor: "#00853F",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 72,
      secondary: 28,
    },
  },
  "fc-eindhoven": {
    clubId: "fc-eindhoven",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 72,
      secondary: 28,
    },
  },
  "fc-emmen": {
    clubId: "fc-emmen",
    primaryColor: "#E30613",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 72,
      secondary: 28,
    },
  },
  "helmond-sport": {
    clubId: "helmond-sport",
    primaryColor: "#000000",
    secondaryColor: "#FFD200",
    colorMix: {
      primary: 62,
      secondary: 38,
    },
  },
  "jong-ajax": {
    clubId: "jong-ajax",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 72,
      secondary: 28,
    },
  },
  "jong-az": {
    clubId: "jong-az",
    primaryColor: "#D0001B",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 72,
      secondary: 28,
    },
  },
  "jong-psv": {
    clubId: "jong-psv",
    primaryColor: "#E30613",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 72,
      secondary: 28,
    },
  },
  "jong-utrecht": {
    clubId: "jong-utrecht",
    primaryColor: "#E30613",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 70,
      secondary: 30,
    },
  },
  "mvv-maastricht": {
    clubId: "mvv-maastricht",
    primaryColor: "#C8102E",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 72,
      secondary: 28,
    },
  },
  "rkc-waalwijk": {
    clubId: "rkc-waalwijk",
    primaryColor: "#FFD200",
    secondaryColor: "#0057B8",
    colorMix: {
      primary: 66,
      secondary: 34,
    },
  },
  "roda-jc": {
    clubId: "roda-jc",
    primaryColor: "#FFD200",
    secondaryColor: "#000000",
    colorMix: {
      primary: 68,
      secondary: 32,
    },
  },
  "sc-cambuur": {
    clubId: "sc-cambuur",
    primaryColor: "#FFD200",
    secondaryColor: "#0057B8",
    colorMix: {
      primary: 66,
      secondary: 34,
    },
  },
  "top-oss": {
    clubId: "top-oss",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 72,
      secondary: 28,
    },
  },
  vitesse: {
    clubId: "vitesse",
    primaryColor: "#FFD200",
    secondaryColor: "#000000",
    colorMix: {
      primary: 68,
      secondary: 32,
    },
  },
  "vvv-venlo": {
    clubId: "vvv-venlo",
    primaryColor: "#FFD200",
    secondaryColor: "#000000",
    colorMix: {
      primary: 68,
      secondary: 32,
    },
  },
  "willem-ii": {
    clubId: "willem-ii",
    primaryColor: "#D71920",
    secondaryColor: "#0057B8",
    colorMix: {
      primary: 62,
      secondary: 38,
    },
  },

    /* =========================
     ENGLAND
     ========================= */

  /* Premier League */
  arsenal: {
    clubId: "arsenal",
    primaryColor: "#EF0107",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 74, secondary: 26 },
  },
  "aston-villa": {
    clubId: "aston-villa",
    primaryColor: "#670E36",
    secondaryColor: "#95BFE5",
    colorMix: { primary: 68, secondary: 32 },
  },
  bournemouth: {
    clubId: "bournemouth",
    primaryColor: "#DA291C",
    secondaryColor: "#000000",
    colorMix: { primary: 64, secondary: 36 },
  },
  brentford: {
    clubId: "brentford",
    primaryColor: "#E30613",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  brighton: {
    clubId: "brighton",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  burnley: {
    clubId: "burnley",
    primaryColor: "#6C1D45",
    secondaryColor: "#99D6EA",
    colorMix: { primary: 66, secondary: 34 },
  },
  chelsea: {
    clubId: "chelsea",
    primaryColor: "#034694",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 76, secondary: 24 },
  },
  "crystal-palace": {
    clubId: "crystal-palace",
    primaryColor: "#1B458F",
    secondaryColor: "#C4122E",
    colorMix: { primary: 60, secondary: 40 },
  },
  everton: {
    clubId: "everton",
    primaryColor: "#003399",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 76, secondary: 24 },
  },
  fulham: {
    clubId: "fulham",
    primaryColor: "#FFFFFF",
    secondaryColor: "#000000",
    colorMix: { primary: 68, secondary: 32 },
  },
  leeds: {
    clubId: "leeds",
    primaryColor: "#FFFFFF",
    secondaryColor: "#1D428A",
    colorMix: { primary: 70, secondary: 30 },
  },
  liverpool: {
    clubId: "liverpool",
    primaryColor: "#C8102E",
    secondaryColor: "#00B2A9",
    colorMix: { primary: 78, secondary: 22 },
  },
  "man-city": {
    clubId: "man-city",
    primaryColor: "#6CABDD",
    secondaryColor: "#1C2C5B",
    colorMix: { primary: 72, secondary: 28 },
  },
  "man-united": {
    clubId: "man-united",
    primaryColor: "#DA291C",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 74, secondary: 26 },
  },
  newcastle: {
    clubId: "newcastle",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 62, secondary: 38 },
  },
  "nottingham-forest": {
    clubId: "nottingham-forest",
    primaryColor: "#DD0000",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 74, secondary: 26 },
  },
  sunderland: {
    clubId: "sunderland",
    primaryColor: "#EB172B",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  tottenham: {
    clubId: "tottenham",
    primaryColor: "#FFFFFF",
    secondaryColor: "#132257",
    colorMix: { primary: 72, secondary: 28 },
  },
  "west-ham": {
    clubId: "west-ham",
    primaryColor: "#7A263A",
    secondaryColor: "#1BB1E7",
    colorMix: { primary: 66, secondary: 34 },
  },
  wolves: {
    clubId: "wolves",
    primaryColor: "#FDB913",
    secondaryColor: "#231F20",
    colorMix: { primary: 74, secondary: 26 },
  },

  /* Championship */
  "birmingham-city": {
    clubId: "birmingham-city",
    primaryColor: "#0046AE",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 74, secondary: 26 },
  },
  blackburn: {
    clubId: "blackburn",
    primaryColor: "#1F4FA3",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 64, secondary: 36 },
  },
  "bristol-city": {
    clubId: "bristol-city",
    primaryColor: "#E31B23",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  charlton: {
    clubId: "charlton",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  coventry: {
    clubId: "coventry",
    primaryColor: "#6CABDD",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 74, secondary: 26 },
  },
  "derby-county": {
    clubId: "derby-county",
    primaryColor: "#FFFFFF",
    secondaryColor: "#000000",
    colorMix: { primary: 66, secondary: 34 },
  },
  "hull-city": {
    clubId: "hull-city",
    primaryColor: "#F28C28",
    secondaryColor: "#000000",
    colorMix: { primary: 68, secondary: 32 },
  },
  ipswich: {
    clubId: "ipswich",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  leicester: {
    clubId: "leicester",
    primaryColor: "#003090",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 76, secondary: 24 },
  },
  middlesbrough: {
    clubId: "middlesbrough",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 74, secondary: 26 },
  },
  millwall: {
    clubId: "millwall",
    primaryColor: "#002E5D",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  norwich: {
    clubId: "norwich",
    primaryColor: "#FFF200",
    secondaryColor: "#00A650",
    colorMix: { primary: 66, secondary: 34 },
  },
  "oxford-united": {
    clubId: "oxford-united",
    primaryColor: "#FFD200",
    secondaryColor: "#002147",
    colorMix: { primary: 70, secondary: 30 },
  },
  portsmouth: {
    clubId: "portsmouth",
    primaryColor: "#003087",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 74, secondary: 26 },
  },
  preston: {
    clubId: "preston",
    primaryColor: "#FFFFFF",
    secondaryColor: "#003366",
    colorMix: { primary: 66, secondary: 34 },
  },
  qpr: {
    clubId: "qpr",
    primaryColor: "#1B458F",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 64, secondary: 36 },
  },
  "sheffield-united": {
    clubId: "sheffield-united",
    primaryColor: "#EE2737",
    secondaryColor: "#000000",
    colorMix: { primary: 68, secondary: 32 },
  },
  "sheffield-wednesday": {
    clubId: "sheffield-wednesday",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 68, secondary: 32 },
  },
  southampton: {
    clubId: "southampton",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  "stoke-city": {
    clubId: "stoke-city",
    primaryColor: "#E03A3E",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  swansea: {
    clubId: "swansea",
    primaryColor: "#FFFFFF",
    secondaryColor: "#000000",
    colorMix: { primary: 68, secondary: 32 },
  },
  watford: {
    clubId: "watford",
    primaryColor: "#FBEE23",
    secondaryColor: "#ED2127",
    colorMix: { primary: 66, secondary: 34 },
  },
  "west-brom": {
    clubId: "west-brom",
    primaryColor: "#122F67",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 66, secondary: 34 },
  },
  wrexham: {
    clubId: "wrexham",
    primaryColor: "#E31B23",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },

  /* League One */
  "afc-wimbledon": {
    clubId: "afc-wimbledon",
    primaryColor: "#0057B8",
    secondaryColor: "#FFD200",
    colorMix: { primary: 66, secondary: 34 },
  },
  barnsley: {
    clubId: "barnsley",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  blackpool: {
    clubId: "blackpool",
    primaryColor: "#FF6A00",
    secondaryColor: "#000000",
    colorMix: { primary: 68, secondary: 32 },
  },
  bolton: {
    clubId: "bolton",
    primaryColor: "#FFFFFF",
    secondaryColor: "#1E3A8A",
    colorMix: { primary: 60, secondary: 40 },
  },
  bradford: {
    clubId: "bradford",
    primaryColor: "#FDB913",
    secondaryColor: "#7A1E1E",
    colorMix: { primary: 66, secondary: 34 },
  },
  burton: {
    clubId: "burton",
    primaryColor: "#FFD200",
    secondaryColor: "#000000",
    colorMix: { primary: 68, secondary: 32 },
  },
  cardiff: {
    clubId: "cardiff",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  doncaster: {
    clubId: "doncaster",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  exeter: {
    clubId: "exeter",
    primaryColor: "#D71920",
    secondaryColor: "#000000",
    colorMix: { primary: 68, secondary: 32 },
  },
  huddersfield: {
    clubId: "huddersfield",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 74, secondary: 26 },
  },
  "leyton-orient": {
    clubId: "leyton-orient",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  lincoln: {
    clubId: "lincoln",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  luton: {
    clubId: "luton",
    primaryColor: "#FF6A00",
    secondaryColor: "#1E5AA8",
    colorMix: { primary: 66, secondary: 34 },
  },
  mansfield: {
    clubId: "mansfield",
    primaryColor: "#FDB913",
    secondaryColor: "#1E3A8A",
    colorMix: { primary: 64, secondary: 36 },
  },
  northampton: {
    clubId: "northampton",
    primaryColor: "#7A1E1E",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  peterborough: {
    clubId: "peterborough",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  plymouth: {
    clubId: "plymouth",
    primaryColor: "#00853F",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  "port-vale": {
    clubId: "port-vale",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  reading: {
    clubId: "reading",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 74, secondary: 26 },
  },
  rotherham: {
    clubId: "rotherham",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  stevenage: {
    clubId: "stevenage",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 68, secondary: 32 },
  },
  stockport: {
    clubId: "stockport",
    primaryColor: "#1E5AA8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  wigan: {
    clubId: "wigan",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 74, secondary: 26 },
  },
  wycombe: {
    clubId: "wycombe",
    primaryColor: "#1E3A8A",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
    /* =========================
     GERMANY
     ========================= */

  /* Bundesliga */
  augsburg: {
    clubId: "augsburg",
    primaryColor: "#D71920",
    secondaryColor: "#00853F",
    colorMix: { primary: 65, secondary: 35 },
  },
  bayern: {
    clubId: "bayern",
    primaryColor: "#DC052D",
    secondaryColor: "#0066B2",
    colorMix: { primary: 72, secondary: 28 },
  },
  "borussia-dortmund": {
    clubId: "borussia-dortmund",
    primaryColor: "#FDE100",
    secondaryColor: "#000000",
    colorMix: { primary: 74, secondary: 26 },
  },
  "borussia-monchengladbach": {
    clubId: "borussia-monchengladbach",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  "eintracht-frankfurt": {
    clubId: "eintracht-frankfurt",
    primaryColor: "#000000",
    secondaryColor: "#D71920",
    colorMix: { primary: 68, secondary: 32 },
  },
  freiburg: {
    clubId: "freiburg",
    primaryColor: "#D71920",
    secondaryColor: "#000000",
    colorMix: { primary: 66, secondary: 34 },
  },
  heidenheim: {
    clubId: "heidenheim",
    primaryColor: "#D71920",
    secondaryColor: "#003A8F",
    colorMix: { primary: 64, secondary: 36 },
  },
  hoffenheim: {
    clubId: "hoffenheim",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  koln: {
    clubId: "koln",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  leverkusen: {
    clubId: "leverkusen",
    primaryColor: "#000000",
    secondaryColor: "#D71920",
    colorMix: { primary: 68, secondary: 32 },
  },
  mainz: {
    clubId: "mainz",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  "rb-leipzig": {
    clubId: "rb-leipzig",
    primaryColor: "#FFFFFF",
    secondaryColor: "#D71920",
    colorMix: { primary: 58, secondary: 42 },
  },
  "st-pauli": {
    clubId: "st-pauli",
    primaryColor: "#4A2C2A",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 66, secondary: 34 },
  },
  stuttgart: {
    clubId: "stuttgart",
    primaryColor: "#FFFFFF",
    secondaryColor: "#D71920",
    colorMix: { primary: 60, secondary: 40 },
  },
  "union-berlin": {
    clubId: "union-berlin",
    primaryColor: "#D71920",
    secondaryColor: "#F1C40F",
    colorMix: { primary: 68, secondary: 32 },
  },
  "vfl-wolfsburg": {
    clubId: "vfl-wolfsburg",
    primaryColor: "#65B32E",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  "werder-bremen": {
    clubId: "werder-bremen",
    primaryColor: "#00853F",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  "hamburger-sv": {
    clubId: "hamburger-sv",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 68, secondary: 32 },
  },

  /* 2. Bundesliga */
  "arminia-bielefeld": {
    clubId: "arminia-bielefeld",
    primaryColor: "#003A8F",
    secondaryColor: "#000000",
    colorMix: { primary: 68, secondary: 32 },
  },
  bochum: {
    clubId: "bochum",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  braunschweig: {
    clubId: "braunschweig",
    primaryColor: "#FDB913",
    secondaryColor: "#1E3A8A",
    colorMix: { primary: 64, secondary: 36 },
  },
  darmstadt: {
    clubId: "darmstadt",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  "dynamo-dresden": {
    clubId: "dynamo-dresden",
    primaryColor: "#FFD200",
    secondaryColor: "#7A1E1E",
    colorMix: { primary: 66, secondary: 34 },
  },
  elversberg: {
    clubId: "elversberg",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 68, secondary: 32 },
  },
  "fortuna-dusseldorf": {
    clubId: "fortuna-dusseldorf",
    primaryColor: "#E32219",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  "greuther-furth": {
    clubId: "greuther-furth",
    primaryColor: "#00853F",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  hannover: {
    clubId: "hannover",
    primaryColor: "#00853F",
    secondaryColor: "#000000",
    colorMix: { primary: 64, secondary: 36 },
  },
  "hertha-bsc": {
    clubId: "hertha-bsc",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  "holstein-kiel": {
    clubId: "holstein-kiel",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  kaiserslautern: {
    clubId: "kaiserslautern",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  karlsruhe: {
    clubId: "karlsruhe",
    primaryColor: "#003A8F",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  magdeburg: {
    clubId: "magdeburg",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  nurnberg: {
    clubId: "nurnberg",
    primaryColor: "#8A1538",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  paderborn: {
    clubId: "paderborn",
    primaryColor: "#0057B8",
    secondaryColor: "#000000",
    colorMix: { primary: 68, secondary: 32 },
  },
  "preussen-munster": {
    clubId: "preussen-munster",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  schalke: {
    clubId: "schalke",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 74, secondary: 26 },
  },

    /* =========================
     ITALY
     ========================= */

  /* Serie A */
  atalanta: {
    clubId: "atalanta",
    primaryColor: "#00529F",
    secondaryColor: "#000000",
    colorMix: { primary: 58, secondary: 42 },
  },
  bologna: {
    clubId: "bologna",
    primaryColor: "#9E1B32",
    secondaryColor: "#1D4E89",
    colorMix: { primary: 58, secondary: 42 },
  },
  cagliari: {
    clubId: "cagliari",
    primaryColor: "#C8102E",
    secondaryColor: "#003B7A",
    colorMix: { primary: 56, secondary: 44 },
  },
  como: {
    clubId: "como",
    primaryColor: "#0054A6",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 74, secondary: 26 },
  },
  cremonese: {
    clubId: "cremonese",
    primaryColor: "#A6192E",
    secondaryColor: "#8E8C89",
    colorMix: { primary: 66, secondary: 34 },
  },
  fiorentina: {
    clubId: "fiorentina",
    primaryColor: "#5B2C83",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 76, secondary: 24 },
  },
  genoa: {
    clubId: "genoa",
    primaryColor: "#A6192E",
    secondaryColor: "#003087",
    colorMix: { primary: 54, secondary: 46 },
  },
  "hellas-verona": {
    clubId: "hellas-verona",
    primaryColor: "#FFD100",
    secondaryColor: "#1E4FA1",
    colorMix: { primary: 54, secondary: 46 },
  },
  inter: {
    clubId: "inter",
    primaryColor: "#00529F",
    secondaryColor: "#000000",
    colorMix: { primary: 56, secondary: 44 },
  },
  juventus: {
    clubId: "juventus",
    primaryColor: "#FFFFFF",
    secondaryColor: "#000000",
    colorMix: { primary: 60, secondary: 40 },
  },
  lazio: {
    clubId: "lazio",
    primaryColor: "#9BCBEB",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  lecce: {
    clubId: "lecce",
    primaryColor: "#F5C400",
    secondaryColor: "#C8102E",
    colorMix: { primary: 58, secondary: 42 },
  },
  milan: {
    clubId: "milan",
    primaryColor: "#D71920",
    secondaryColor: "#000000",
    colorMix: { primary: 56, secondary: 44 },
  },
  napoli: {
    clubId: "napoli",
    primaryColor: "#0085CA",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 78, secondary: 22 },
  },
  parma: {
    clubId: "parma",
    primaryColor: "#FFD100",
    secondaryColor: "#1F2A44",
    colorMix: { primary: 52, secondary: 48 },
  },
  pisa: {
    clubId: "pisa",
    primaryColor: "#0F172A",
    secondaryColor: "#1D4E89",
    colorMix: { primary: 68, secondary: 32 },
  },
  roma: {
    clubId: "roma",
    primaryColor: "#8E1F2F",
    secondaryColor: "#F7B500",
    colorMix: { primary: 62, secondary: 38 },
  },
  sassuolo: {
    clubId: "sassuolo",
    primaryColor: "#00A651",
    secondaryColor: "#000000",
    colorMix: { primary: 64, secondary: 36 },
  },
  torino: {
    clubId: "torino",
    primaryColor: "#7B1E3A",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 76, secondary: 24 },
  },
  udinese: {
    clubId: "udinese",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 62, secondary: 38 },
  },

  /* Serie B */
  avellino: {
    clubId: "avellino",
    primaryColor: "#00853F",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  bari: {
    clubId: "bari",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  carrarese: {
    clubId: "carrarese",
    primaryColor: "#1E5AA8",
    secondaryColor: "#FFD200",
    colorMix: { primary: 64, secondary: 36 },
  },
  catanzaro: {
    clubId: "catanzaro",
    primaryColor: "#D71920",
    secondaryColor: "#FFD200",
    colorMix: { primary: 66, secondary: 34 },
  },
  cesena: {
    clubId: "cesena",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  empoli: {
    clubId: "empoli",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 74, secondary: 26 },
  },
  entella: {
    clubId: "entella",
    primaryColor: "#1E5AA8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  frosinone: {
    clubId: "frosinone",
    primaryColor: "#FFD200",
    secondaryColor: "#1E5AA8",
    colorMix: { primary: 68, secondary: 32 },
  },
  "juve-stabia": {
    clubId: "juve-stabia",
    primaryColor: "#FFD200",
    secondaryColor: "#1E3A8A",
    colorMix: { primary: 68, secondary: 32 },
  },
  mantova: {
    clubId: "mantova",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  modena: {
    clubId: "modena",
    primaryColor: "#FFD200",
    secondaryColor: "#1E3A8A",
    colorMix: { primary: 66, secondary: 34 },
  },
  monza: {
    clubId: "monza",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  padova: {
    clubId: "padova",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  palermo: {
    clubId: "palermo",
    primaryColor: "#F4A6C1",
    secondaryColor: "#000000",
    colorMix: { primary: 68, secondary: 32 },
  },
  pescara: {
    clubId: "pescara",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  reggiana: {
    clubId: "reggiana",
    primaryColor: "#D71920",
    secondaryColor: "#FFD200",
    colorMix: { primary: 66, secondary: 34 },
  },
  sampdoria: {
    clubId: "sampdoria",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 64, secondary: 36 },
  },
  spezia: {
    clubId: "spezia",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  sudtirol: {
    clubId: "sudtirol",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 68, secondary: 32 },
  },
  venezia: {
    clubId: "venezia",
    primaryColor: "#0B3D2E",
    secondaryColor: "#F2C94C",
    colorMix: { primary: 64, secondary: 36 },
  },

    /* =========================
     BELGIUM
     ========================= */

  anderlecht: {
    clubId: "anderlecht",
    primaryColor: "#512D6D",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  antwerp: {
    clubId: "antwerp",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  "club-brugge": {
    clubId: "club-brugge",
    primaryColor: "#000000",
    secondaryColor: "#1E5AA8",
    colorMix: { primary: 62, secondary: 38 },
  },
  "cercle-brugge": {
    clubId: "cercle-brugge",
    primaryColor: "#00853F",
    secondaryColor: "#000000",
    colorMix: { primary: 68, secondary: 32 },
  },
  charleroi: {
    clubId: "charleroi",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 74, secondary: 26 },
  },
  dender: {
    clubId: "dender",
    primaryColor: "#274185",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  genk: {
    clubId: "genk",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 74, secondary: 26 },
  },
  gent: {
    clubId: "gent",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  leuven: {
    clubId: "leuven",
    primaryColor: "#000000",
    secondaryColor: "#D71920",
    colorMix: { primary: 62, secondary: 38 },
  },
  mechelen: {
    clubId: "mechelen",
    primaryColor: "#FFD200",
    secondaryColor: "#D71920",
    colorMix: { primary: 58, secondary: 42 },
  },
  raal: {
    clubId: "raal",
    primaryColor: "#2F7946",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  "standard-liege": {
    clubId: "standard-liege",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  stvv: {
    clubId: "stvv",
    primaryColor: "#FFD200",
    secondaryColor: "#0057B8",
    colorMix: { primary: 62, secondary: 38 },
  },
  "union-sg": {
    clubId: "union-sg",
    primaryColor: "#FFD200",
    secondaryColor: "#1E3A8A",
    colorMix: { primary: 60, secondary: 40 },
  },
  westerlo: {
    clubId: "westerlo",
    primaryColor: "#FFD200",
    secondaryColor: "#0057B8",
    colorMix: { primary: 60, secondary: 40 },
  },
  "zulte-waregem": {
    clubId: "zulte-waregem",
    primaryColor: "#E21350",
    secondaryColor: "#FFD204",
    colorMix: { primary: 80, secondary: 20 },
  },

  /* Challenger */
  beerschot: {
    clubId: "beerschot",
    primaryColor: "#512D6D",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  beveren: {
    clubId: "beveren",
    primaryColor: "#FFD200",
    secondaryColor: "#000000",
    colorMix: { primary: 68, secondary: 32 },
  },
  kortrijk: {
    clubId: "kortrijk",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  lommel: {
    clubId: "lommel",
    primaryColor: "#00853F",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  "patro-eisden": {
    clubId: "patro-eisden",
    primaryColor: "#FFD200",
    secondaryColor: "#000000",
    colorMix: { primary: 66, secondary: 34 },
  },
  "fc-luik": {
    clubId: "fc-luik",
    primaryColor: "#D71920",
    secondaryColor: "#1E3A8A",
    colorMix: { primary: 64, secondary: 36 },
  },
  eupen: {
    clubId: "eupen",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  "jong-gent": {
    clubId: "jong-gent",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  lokeren: {
    clubId: "lokeren",
    primaryColor: "#000000",
    secondaryColor: "#FFD200",
    colorMix: { primary: 66, secondary: 34 },
  },
  lierse: {
    clubId: "lierse",
    primaryColor: "#FFD200",
    secondaryColor: "#000000",
    colorMix: { primary: 68, secondary: 32 },
  },
  seraing: {
    clubId: "seraing",
    primaryColor: "#D71920",
    secondaryColor: "#000000",
    colorMix: { primary: 66, secondary: 34 },
  },
  rwdm: {
    clubId: "rwdm",
    primaryColor: "#D71920",
    secondaryColor: "#000000",
    colorMix: { primary: 68, secondary: 32 },
  },
  "francs-borains": {
    clubId: "francs-borains",
    primaryColor: "#00853F",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  "jong-genk": {
    clubId: "jong-genk",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  "rsca-futures": {
    clubId: "rsca-futures",
    primaryColor: "#512D6D",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  "club-nxt": {
    clubId: "club-nxt",
    primaryColor: "#000000",
    secondaryColor: "#1E5AA8",
    colorMix: { primary: 64, secondary: 36 },
  },
  "olympic-charleroi": {
    clubId: "olympic-charleroi",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },

    /* =========================
     SWEDEN
     ========================= */

  /* Allsvenskan */
  aik: {
    clubId: "aik",
    primaryColor: "#000000",
    secondaryColor: "#F2C94C",
    colorMix: { primary: 70, secondary: 30 },
  },
  bp: {
    clubId: "bp",
    primaryColor: "#D71920",
    secondaryColor: "#000000",
    colorMix: { primary: 68, secondary: 32 },
  },
  degerfors: {
    clubId: "degerfors",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  djurgarden: {
    clubId: "djurgarden",
    primaryColor: "#1E5AA8",
    secondaryColor: "#87CEEB",
    colorMix: { primary: 66, secondary: 34 },
  },
  elfsborg: {
    clubId: "elfsborg",
    primaryColor: "#F2C94C",
    secondaryColor: "#000000",
    colorMix: { primary: 72, secondary: 28 },
  },
  gais: {
    clubId: "gais",
    primaryColor: "#00853F",
    secondaryColor: "#000000",
    colorMix: { primary: 66, secondary: 34 },
  },
  hacken: {
    clubId: "hacken",
    primaryColor: "#F2C94C",
    secondaryColor: "#000000",
    colorMix: { primary: 74, secondary: 26 },
  },
  halmstad: {
    clubId: "halmstad",
    primaryColor: "#0057B8",
    secondaryColor: "#000000",
    colorMix: { primary: 64, secondary: 36 },
  },
  hammarby: {
    clubId: "hammarby",
    primaryColor: "#00853F",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  "ifk-goteborg": {
    clubId: "ifk-goteborg",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 74, secondary: 26 },
  },
  kalmar: {
    clubId: "kalmar",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  malmo: {
    clubId: "malmo",
    primaryColor: "#87CEEB",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  mjallby: {
    clubId: "mjallby",
    primaryColor: "#FFD200",
    secondaryColor: "#000000",
    colorMix: { primary: 70, secondary: 30 },
  },
  orgryte: {
    clubId: "orgryte",
    primaryColor: "#D71920",
    secondaryColor: "#1E5AA8",
    colorMix: { primary: 66, secondary: 34 },
  },
  sirius: {
    clubId: "sirius",
    primaryColor: "#1E5AA8",
    secondaryColor: "#000000",
    colorMix: { primary: 68, secondary: 32 },
  },
  vasteras: {
    clubId: "vasteras",
    primaryColor: "#00853F",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },

  /* Superettan */
  brage: {
    clubId: "brage",
    primaryColor: "#00853F",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  falkenberg: {
    clubId: "falkenberg",
    primaryColor: "#FFD200",
    secondaryColor: "#0057B8",
    colorMix: { primary: 62, secondary: 38 },
  },
  "gif-sundsvall": {
    clubId: "gif-sundsvall",
    primaryColor: "#0057B8",
    secondaryColor: "#FFD200",
    colorMix: { primary: 62, secondary: 38 },
  },
  helsingborg: {
    clubId: "helsingborg",
    primaryColor: "#D71920",
    secondaryColor: "#1E5AA8",
    colorMix: { primary: 64, secondary: 36 },
  },
  "ifk-norrkoping": {
    clubId: "ifk-norrkoping",
    primaryColor: "#FFFFFF",
    secondaryColor: "#0057B8",
    colorMix: { primary: 64, secondary: 36 },
  },
  "ifk-varnamo": {
    clubId: "ifk-varnamo",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  landskrona: {
    clubId: "landskrona",
    primaryColor: "#F2C94C",
    secondaryColor: "#000000",
    colorMix: { primary: 68, secondary: 32 },
  },
  ljungskile: {
    clubId: "ljungskile",
    primaryColor: "#00853F",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  "nordic-united": {
    clubId: "nordic-united",
    primaryColor: "#D71920",
    secondaryColor: "#000000",
    colorMix: { primary: 66, secondary: 34 },
  },
  norrby: {
    clubId: "norrby",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  oddevold: {
    clubId: "oddevold",
    primaryColor: "#1E5AA8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  orebro: {
    clubId: "orebro",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  osters: {
    clubId: "osters",
    primaryColor: "#D71920",
    secondaryColor: "#0057B8",
    colorMix: { primary: 64, secondary: 36 },
  },
  ostersund: {
    clubId: "ostersund",
    primaryColor: "#D71920",
    secondaryColor: "#000000",
    colorMix: { primary: 66, secondary: 34 },
  },
  sandviken: {
    clubId: "sandviken",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  varberg: {
    clubId: "varberg",
    primaryColor: "#00853F",
    secondaryColor: "#000000",
    colorMix: { primary: 66, secondary: 34 },
  },

    /* =========================
     SPAIN
     ========================= */

  /* Primera */
  alaves: {
    clubId: "alaves",
    primaryColor: "#1E5AA8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  athletic: {
    clubId: "athletic",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  "atletico-madrid": {
    clubId: "atletico-madrid",
    primaryColor: "#D71920",
    secondaryColor: "#1E3A8A",
    colorMix: { primary: 58, secondary: 42 },
  },
  barcelona: {
    clubId: "barcelona",
    primaryColor: "#A50044",
    secondaryColor: "#004D98",
    colorMix: { primary: 54, secondary: 46 },
  },
  celta: {
    clubId: "celta",
    primaryColor: "#9BCBEB",
    secondaryColor: "#C8102E",
    colorMix: { primary: 68, secondary: 32 },
  },
  elche: {
    clubId: "elche",
    primaryColor: "#00853F",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  espanyol: {
    clubId: "espanyol",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  getafe: {
    clubId: "getafe",
    primaryColor: "#0057B8",
    secondaryColor: "#D71920",
    colorMix: { primary: 62, secondary: 38 },
  },
  girona: {
    clubId: "girona",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  levante: {
    clubId: "levante",
    primaryColor: "#7A1E3A",
    secondaryColor: "#0057B8",
    colorMix: { primary: 56, secondary: 44 },
  },
  mallorca: {
    clubId: "mallorca",
    primaryColor: "#D71920",
    secondaryColor: "#000000",
    colorMix: { primary: 66, secondary: 34 },
  },
  osasuna: {
    clubId: "osasuna",
    primaryColor: "#D71920",
    secondaryColor: "#1E3A8A",
    colorMix: { primary: 60, secondary: 40 },
  },
  oviedo: {
    clubId: "oviedo",
    primaryColor: "#1E5AA8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  rayo: {
    clubId: "rayo",
    primaryColor: "#FFFFFF",
    secondaryColor: "#D71920",
    colorMix: { primary: 62, secondary: 38 },
  },
  "real-betis": {
    clubId: "real-betis",
    primaryColor: "#00853F",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  "real-madrid": {
    clubId: "real-madrid",
    primaryColor: "#FFFFFF",
    secondaryColor: "#D4AF37",
    colorMix: { primary: 74, secondary: 26 },
  },
  "real-sociedad": {
    clubId: "real-sociedad",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  sevilla: {
    clubId: "sevilla",
    primaryColor: "#FFFFFF",
    secondaryColor: "#D71920",
    colorMix: { primary: 66, secondary: 34 },
  },
  valencia: {
    clubId: "valencia",
    primaryColor: "#FFFFFF",
    secondaryColor: "#000000",
    tertiaryColor: "#F4A300",
    colorMix: { primary: 58, secondary: 30, tertiary: 12 },
  },
  villarreal: {
    clubId: "villarreal",
    primaryColor: "#FDE100",
    secondaryColor: "#1E3A8A",
    colorMix: { primary: 72, secondary: 28 },
  },

  /* Segunda */
  albacete: {
    clubId: "albacete",
    primaryColor: "#FFFFFF",
    secondaryColor: "#000000",
    colorMix: { primary: 68, secondary: 32 },
  },
  almeria: {
    clubId: "almeria",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  andorra: {
    clubId: "andorra",
    primaryColor: "#1E3A8A",
    secondaryColor: "#F4C300",
    colorMix: { primary: 66, secondary: 34 },
  },
  burgos: {
    clubId: "burgos",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  cadiz: {
    clubId: "cadiz",
    primaryColor: "#FDE100",
    secondaryColor: "#1E3A8A",
    colorMix: { primary: 70, secondary: 30 },
  },
  castellon: {
    clubId: "castellon",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  ceuta: {
    clubId: "ceuta",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 68, secondary: 32 },
  },
  cordoba: {
    clubId: "cordoba",
    primaryColor: "#00853F",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  deportivo: {
    clubId: "deportivo",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  eibar: {
    clubId: "eibar",
    primaryColor: "#1E3A8A",
    secondaryColor: "#D71920",
    colorMix: { primary: 58, secondary: 42 },
  },
  granada: {
    clubId: "granada",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  huesca: {
    clubId: "huesca",
    primaryColor: "#D71920",
    secondaryColor: "#1E5AA8",
    colorMix: { primary: 58, secondary: 42 },
  },
  "las-palmas": {
    clubId: "las-palmas",
    primaryColor: "#FDE100",
    secondaryColor: "#0057B8",
    colorMix: { primary: 68, secondary: 32 },
  },
  leganes: {
    clubId: "leganes",
    primaryColor: "#1E5AA8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  leonesa: {
    clubId: "leonesa",
    primaryColor: "#FFFFFF",
    secondaryColor: "#D71920",
    colorMix: { primary: 64, secondary: 36 },
  },
  malaga: {
    clubId: "malaga",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 74, secondary: 26 },
  },
  mirandes: {
    clubId: "mirandes",
    primaryColor: "#D71920",
    secondaryColor: "#000000",
    colorMix: { primary: 66, secondary: 34 },
  },
  "racing-santander": {
    clubId: "racing-santander",
    primaryColor: "#00853F",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 72, secondary: 28 },
  },
  "real-sociedad-b": {
    clubId: "real-sociedad-b",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 68, secondary: 32 },
  },
  "sporting-gijon": {
    clubId: "sporting-gijon",
    primaryColor: "#D71920",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  valladolid: {
    clubId: "valladolid",
    primaryColor: "#512D6D",
    secondaryColor: "#FFFFFF",
    colorMix: { primary: 70, secondary: 30 },
  },
  zaragoza: {
    clubId: "zaragoza",
    primaryColor: "#FFFFFF",
    secondaryColor: "#1E5AA8",
    colorMix: { primary: 64, secondary: 36 },
  },

  /* =========================
     OTHER / PLACEHOLDER
     ========================= */

  "custom-club": {
    clubId: "custom-club",
    primaryColor: "#111111",
    secondaryColor: "#FFFFFF",
    colorMix: {
      primary: 70,
      secondary: 30,
    },
  },
};

export const clubPresets: ClubPreset[] = Object.values(clubVisualPresetsById)
  .map((visual): ClubPreset | null => {
    const club = clubsById[visual.clubId];
    if (!club) return null;

    const competitionId = getCurrentCompetitionIdForClub(club.id);
    const competition = competitionId ? competitionsById[competitionId] : undefined;
    const country = competition ? countriesById[competition.countryId] : undefined;

    return {
      id: club.id,
      name: club.name,
      ...(club.aliases ? { aliases: club.aliases } : {}),
      logoUrl: getClubLogoUrl(club.id),
      country: country?.name ?? "Other",
      league: competition?.name ?? "Other",
      primaryColor: visual.primaryColor,
      secondaryColor: visual.secondaryColor,
      ...(visual.tertiaryColor ? { tertiaryColor: visual.tertiaryColor } : {}),
      colorMix: visual.colorMix,
    };
  })
  .filter((club): club is ClubPreset => club !== null);

/* ---------------- HELPERS ---------------- */

export function getClubPresetById(clubId: string) {
  return clubPresets.find((club) => club.id === clubId);
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

export function getClubPresetsByCompetitionId(competitionId: string) {
  return (competitionClubIds[competitionId] ?? [])
    .map((clubId) => getClubPresetById(clubId))
    .filter((club): club is ClubPreset => club !== undefined);
}

export const clubPresetGroups = Object.values(countriesById).reduce<
  Record<
    string,
    {
      label: string;
      leagues: Record<string, ClubPreset[]>;
    }
  >
>((acc, country) => {
  const leagues = Object.values(competitionsById)
    .filter((competition) => competition.countryId === country.id)
    .reduce<Record<string, ClubPreset[]>>((leagueAcc, competition) => {
      leagueAcc[competition.id] = getClubPresetsByCompetitionId(competition.id);
      return leagueAcc;
    }, {});

  acc[country.id] = {
    label: country.name,
    leagues,
  };

  return acc;
}, {});