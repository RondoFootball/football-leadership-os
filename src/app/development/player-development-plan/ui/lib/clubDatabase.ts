export type ClubId = string;
export type CountryId = string;
export type CompetitionId = string;

export type Club = {
  id: ClubId;
  name: string;
  aliases?: string[];
};

export type Country = {
  id: CountryId;
  name: string;
};

export type Competition = {
  id: CompetitionId;
  countryId: CountryId;
  name: string;
};

export type ClubDatabaseClub = Club & {
  logoUrl: string;
};

export type ClubDatabaseCompetition = Competition & {
  logoUrl: string;
  clubs: ClubDatabaseClub[];
};

export type ClubDatabaseCountry = Country & {
  logoUrl: string;
  competitions: ClubDatabaseCompetition[];
};

/* ---------------- NORMALIZE ---------------- */

function norm(v: string) {
  return v.trim().toLowerCase();
}

function isDefined<T>(value: T | undefined | null): value is T {
  return value != null;
}

/* ---------------- LOGO HELPERS ---------------- */

export function getClubLogoUrl(clubId: ClubId) {
  return `/logos/clubs/${clubId}.png`;
}

export function getCountryLogoUrl(countryId: CountryId) {
  return `/logos/countries/${countryId}.png`;
}

export function getCompetitionLogoUrl(competitionId: CompetitionId) {
  return `/logos/leagues/${competitionId}.png`;
}

/* ---------------- MASTER DATA ---------------- */

export const countriesById: Record<CountryId, Country> = {
  netherlands: { id: "netherlands", name: "Netherlands" },
  germany: { id: "germany", name: "Germany" },
  italy: { id: "italy", name: "Italy" },
  belgium: { id: "belgium", name: "Belgium" },
  england: { id: "england", name: "England" },
  spain: { id: "spain", name: "Spain" },
  sweden: { id: "sweden", name: "Sweden" },
  portugal: { id: "portugal", name: "Portugal" },
  france: { id: "france", name: "France" },
  denmark: { id: "denmark", name: "Denmark" },
  usa: { id: "usa", name: "United States" },
};

export const competitionsById: Record<CompetitionId, Competition> = {
  eredivisie: {
    id: "eredivisie",
    countryId: "netherlands",
    name: "Eredivisie",
  },
  kkd: {
    id: "kkd",
    countryId: "netherlands",
    name: "KKD",
  },

  bundesliga: {
    id: "bundesliga",
    countryId: "germany",
    name: "Bundesliga",
  },
  "2-bundesliga": {
    id: "2-bundesliga",
    countryId: "germany",
    name: "2. Bundesliga",
  },

  "serie-a": {
    id: "serie-a",
    countryId: "italy",
    name: "Serie A",
  },
  "serie-b": {
    id: "serie-b",
    countryId: "italy",
    name: "Serie B",
  },

  "jupiler-pro-league": {
    id: "jupiler-pro-league",
    countryId: "belgium",
    name: "Jupiler Pro League",
  },

  "challenger-pro-league": {
    id: "challenger-pro-league",
    countryId: "belgium",
    name: "Challenger Pro League",
  },

  "premier-league": {
    id: "premier-league",
    countryId: "england",
    name: "Premier League",
  },
  championship: {
    id: "championship",
    countryId: "england",
    name: "Championship",
  },
  "league-one": {
    id: "league-one",
    countryId: "england",
    name: "League One",
  },

  "la-liga": {
    id: "la-liga",
    countryId: "spain",
    name: "La Liga",
  },
  "segunda-division": {
    id: "segunda-division",
    countryId: "spain",
    name: "Segunda División",
  },

  allsvenskan: {
    id: "allsvenskan",
    countryId: "sweden",
    name: "Allsvenskan",
  },
  superettan: {
    id: "superettan",
    countryId: "sweden",
    name: "Superettan",
  },

  "primeira-liga": {
    id: "primeira-liga",
    countryId: "portugal",
    name: "Primeira Liga",
  },
  "liga-portugal-2": {
    id: "liga-portugal-2",
    countryId: "portugal",
    name: "Liga Portugal 2",
  },

    "ligue-1": {
    id: "ligue-1",
    countryId: "france",
    name: "Ligue 1",
  },
  "ligue-2": {
    id: "ligue-2",
    countryId: "france",
    name: "Ligue 2",
  },
    "mls-eastern": {
    id: "mls-eastern",
    countryId: "usa",
    name: "MLS Eastern Conference",
  },
  "mls-western": {
    id: "mls-western",
    countryId: "usa",
    name: "MLS Western Conference",
  },
};

/**
 * CLUBS: vaste identiteit
 * Voeg hier steeds clubs toe.
 * Club-id = bestandsnaam logo
 */
export const clubsById: Record<ClubId, Club> = {
  /* =========================
     NETHERLANDS
     ========================= */

  ajax: {
    id: "ajax",
    name: "Ajax",
    aliases: ["AFC Ajax"],
  },
  az: {
    id: "az",
    name: "AZ",
    aliases: ["AZ Alkmaar"],
  },
  excelsior: {
    id: "excelsior",
    name: "Excelsior",
  },
  "fc-groningen": {
    id: "fc-groningen",
    name: "FC Groningen",
  },
  "fc-twente": {
    id: "fc-twente",
    name: "FC Twente",
    aliases: ["FC Twente Enschede"],
  },
  "fc-utrecht": {
    id: "fc-utrecht",
    name: "FC Utrecht",
  },
  "fc-volendam": {
    id: "fc-volendam",
    name: "FC Volendam",
  },
  feyenoord: {
    id: "feyenoord",
    name: "Feyenoord",
    aliases: ["Feyenoord Rotterdam"],
  },
  "fortuna-sittard": {
    id: "fortuna-sittard",
    name: "Fortuna Sittard",
  },
  "go-ahead-eagles": {
    id: "go-ahead-eagles",
    name: "Go Ahead Eagles",
  },
  "heracles-almelo": {
    id: "heracles-almelo",
    name: "Heracles Almelo",
  },
  "nac-breda": {
    id: "nac-breda",
    name: "NAC Breda",
  },
  nec: {
    id: "nec",
    name: "NEC",
    aliases: ["N.E.C.", "N.E.C. Nijmegen", "NEC Nijmegen"],
  },
  "pec-zwolle": {
    id: "pec-zwolle",
    name: "PEC Zwolle",
  },
  psv: {
    id: "psv",
    name: "PSV",
    aliases: ["PSV Eindhoven"],
  },
  "sc-heerenveen": {
    id: "sc-heerenveen",
    name: "sc Heerenveen",
    aliases: ["Heerenveen"],
  },
  "sparta-rotterdam": {
    id: "sparta-rotterdam",
    name: "Sparta Rotterdam",
  },
  telstar: {
    id: "telstar",
    name: "Telstar",
  },

  "ado-den-haag": {
    id: "ado-den-haag",
    name: "ADO Den Haag",
  },
  "almere-city": {
    id: "almere-city",
    name: "Almere City",
  },
  "de-graafschap": {
    id: "de-graafschap",
    name: "De Graafschap",
  },
  "fc-den-bosch": {
    id: "fc-den-bosch",
    name: "FC Den Bosch",
  },
  "fc-dordrecht": {
    id: "fc-dordrecht",
    name: "FC Dordrecht",
  },
  "fc-eindhoven": {
    id: "fc-eindhoven",
    name: "FC Eindhoven",
  },
  "fc-emmen": {
    id: "fc-emmen",
    name: "FC Emmen",
  },
  "helmond-sport": {
    id: "helmond-sport",
    name: "Helmond Sport",
  },
  "jong-ajax": {
    id: "jong-ajax",
    name: "Jong Ajax",
  },
  "jong-az": {
    id: "jong-az",
    name: "Jong AZ",
  },
  "jong-psv": {
    id: "jong-psv",
    name: "Jong PSV",
  },
  "jong-utrecht": {
    id: "jong-utrecht",
    name: "Jong Utrecht",
  },
  "mvv-maastricht": {
    id: "mvv-maastricht",
    name: "MVV Maastricht",
  },
  "rkc-waalwijk": {
    id: "rkc-waalwijk",
    name: "RKC Waalwijk",
  },
  "roda-jc": {
    id: "roda-jc",
    name: "Roda JC",
    aliases: ["Roda JC Kerkrade"],
  },
  "sc-cambuur": {
    id: "sc-cambuur",
    name: "SC Cambuur",
    aliases: ["Cambuur"],
  },
  "top-oss": {
    id: "top-oss",
    name: "TOP Oss",
  },
  vitesse: {
    id: "vitesse",
    name: "Vitesse",
  },
  "vvv-venlo": {
    id: "vvv-venlo",
    name: "VVV-Venlo",
  },
  "willem-ii": {
    id: "willem-ii",
    name: "Willem II",
    aliases: ["Willem II Tilburg"],
  },

    /* =========================
     USA
     ========================= */

  /* MLS Eastern Conference */
  nashville: {
    id: "nashville",
    name: "Nashville",
    aliases: ["Nashville SC"],
  },
  "nyc-fc": {
    id: "nyc-fc",
    name: "NYC FC",
    aliases: ["New York City FC", "NYCFC"],
  },
  "inter-miami": {
    id: "inter-miami",
    name: "Inter Miami",
    aliases: ["Inter Miami CF"],
  },
  charlotte: {
    id: "charlotte",
    name: "Charlotte",
    aliases: ["Charlotte FC"],
  },
  "chicago-fire": {
    id: "chicago-fire",
    name: "Chicago Fire",
    aliases: ["Chicago Fire FC"],
  },
  "dc-united": {
    id: "dc-united",
    name: "DC United",
    aliases: ["D.C. United", "DCU"],
  },
  toronto: {
    id: "toronto",
    name: "Toronto",
    aliases: ["Toronto FC"],
  },
  "ny-red-bulls": {
    id: "ny-red-bulls",
    name: "NY Red Bulls",
    aliases: ["New York Red Bulls", "Red Bulls"],
  },
  cincinnati: {
    id: "cincinnati",
    name: "FC Cincinnati",
    aliases: ["Cincinnati"],
  },
  "atlanta-united": {
    id: "atlanta-united",
    name: "Atlanta United",
    aliases: ["Atlanta United FC"],
  },
  "new-england": {
    id: "new-england",
    name: "New England",
    aliases: ["New England Revolution", "Revs"],
  },
  montreal: {
    id: "montreal",
    name: "Montréal",
    aliases: ["CF Montréal", "Montreal", "CF Montreal"],
  },
  "orlando-city": {
    id: "orlando-city",
    name: "Orlando City",
    aliases: ["Orlando City SC"],
  },
  "columbus-crew": {
    id: "columbus-crew",
    name: "Columbus Crew",
    aliases: ["Crew"],
  },
  philadelphia: {
    id: "philadelphia",
    name: "Philadelphia",
    aliases: ["Philadelphia Union"],
  },

  /* MLS Western Conference */
  lafc: {
    id: "lafc",
    name: "LAFC",
    aliases: ["Los Angeles FC"],
  },
  whitecaps: {
    id: "whitecaps",
    name: "Whitecaps",
    aliases: ["Vancouver Whitecaps", "Vancouver Whitecaps FC"],
  },
  "sj-earthquakes": {
    id: "sj-earthquakes",
    name: "SJ Earthquakes",
    aliases: ["San Jose Earthquakes", "San Jose"],
  },
  "san-diego": {
    id: "san-diego",
    name: "San Diego FC",
    aliases: ["San Diego"],
  },
  seattle: {
    id: "seattle",
    name: "Seattle",
    aliases: ["Seattle Sounders", "Seattle Sounders FC"],
  },
  "real-salt-lake": {
    id: "real-salt-lake",
    name: "Real Salt Lake",
    aliases: ["RSL"],
  },
  "colorado-rapids": {
    id: "colorado-rapids",
    name: "Colorado Rapids",
    aliases: ["Rapids"],
  },
  dallas: {
    id: "dallas",
    name: "Dallas",
    aliases: ["FC Dallas"],
  },
  "houston-dynamo": {
    id: "houston-dynamo",
    name: "Houston Dynamo",
    aliases: ["Houston Dynamo FC"],
  },
  "la-galaxy": {
    id: "la-galaxy",
    name: "LA Galaxy",
    aliases: ["Los Angeles Galaxy", "Galaxy"],
  },
  austin: {
    id: "austin",
    name: "Austin",
    aliases: ["Austin FC"],
  },
  minnesota: {
    id: "minnesota",
    name: "Minnesota",
    aliases: ["Minnesota United", "Minnesota United FC"],
  },
  "st-louis-city": {
    id: "st-louis-city",
    name: "St. Louis City",
    aliases: ["St. Louis City SC", "Saint Louis City"],
  },
  portland: {
    id: "portland",
    name: "Portland",
    aliases: ["Portland Timbers"],
  },
  "sporting-kc": {
    id: "sporting-kc",
    name: "Sporting KC",
    aliases: ["Sporting Kansas City"],
  },

    /* =========================
     ENGLAND
     ========================= */

  /* Premier League */
  arsenal: {
    id: "arsenal",
    name: "Arsenal",
    aliases: ["Arsenal FC"],
  },
  "aston-villa": {
    id: "aston-villa",
    name: "Aston Villa",
    aliases: ["AVFC"],
  },
  bournemouth: {
    id: "bournemouth",
    name: "Bournemouth",
    aliases: ["AFC Bournemouth"],
  },
  brentford: {
    id: "brentford",
    name: "Brentford",
    aliases: ["Brentford FC"],
  },
  brighton: {
    id: "brighton",
    name: "Brighton & Hove Albion",
    aliases: ["Brighton", "Brighton and Hove Albion"],
  },
  burnley: {
    id: "burnley",
    name: "Burnley",
    aliases: ["Burnley FC"],
  },
  chelsea: {
    id: "chelsea",
    name: "Chelsea",
    aliases: ["Chelsea FC"],
  },
  "crystal-palace": {
    id: "crystal-palace",
    name: "Crystal Palace",
    aliases: ["Palace"],
  },
  everton: {
    id: "everton",
    name: "Everton",
    aliases: ["Everton FC"],
  },
  fulham: {
    id: "fulham",
    name: "Fulham",
    aliases: ["Fulham FC"],
  },
  leeds: {
    id: "leeds",
    name: "Leeds United",
    aliases: ["Leeds"],
  },
  liverpool: {
    id: "liverpool",
    name: "Liverpool",
    aliases: ["Liverpool FC"],
  },
  "man-city": {
    id: "man-city",
    name: "Manchester City",
    aliases: ["Man City"],
  },
  "man-united": {
    id: "man-united",
    name: "Manchester United",
    aliases: ["Man United"],
  },
  newcastle: {
    id: "newcastle",
    name: "Newcastle United",
    aliases: ["Newcastle"],
  },
  "nottingham-forest": {
    id: "nottingham-forest",
    name: "Nottingham Forest",
    aliases: ["Forest"],
  },
  sunderland: {
    id: "sunderland",
    name: "Sunderland",
    aliases: ["Sunderland AFC"],
  },
  tottenham: {
    id: "tottenham",
    name: "Tottenham Hotspur",
    aliases: ["Spurs"],
  },
  "west-ham": {
    id: "west-ham",
    name: "West Ham United",
    aliases: ["West Ham"],
  },
  wolves: {
    id: "wolves",
    name: "Wolverhampton Wanderers",
    aliases: ["Wolves"],
  },

  /* Championship */
  "birmingham-city": {
    id: "birmingham-city",
    name: "Birmingham City",
    aliases: ["Birmingham"],
  },
  blackburn: {
    id: "blackburn",
    name: "Blackburn Rovers",
    aliases: ["Blackburn"],
  },
  "bristol-city": {
    id: "bristol-city",
    name: "Bristol City",
    aliases: ["Bristol City FC"],
  },
  charlton: {
    id: "charlton",
    name: "Charlton Athletic",
    aliases: ["Charlton"],
  },
  coventry: {
    id: "coventry",
    name: "Coventry City",
    aliases: ["Coventry"],
  },
  "derby-county": {
    id: "derby-county",
    name: "Derby County",
    aliases: ["Derby"],
  },
  "hull-city": {
    id: "hull-city",
    name: "Hull City",
    aliases: ["Hull"],
  },
  ipswich: {
    id: "ipswich",
    name: "Ipswich Town",
    aliases: ["Ipswich"],
  },
  leicester: {
    id: "leicester",
    name: "Leicester City",
    aliases: ["Leicester"],
  },
  middlesbrough: {
    id: "middlesbrough",
    name: "Middlesbrough",
    aliases: ["Boro"],
  },
  millwall: {
    id: "millwall",
    name: "Millwall",
    aliases: ["Millwall FC"],
  },
  norwich: {
    id: "norwich",
    name: "Norwich City",
    aliases: ["Norwich"],
  },
  "oxford-united": {
    id: "oxford-united",
    name: "Oxford United",
    aliases: ["Oxford"],
  },
  portsmouth: {
    id: "portsmouth",
    name: "Portsmouth",
    aliases: ["Pompey"],
  },
  preston: {
    id: "preston",
    name: "Preston North End",
    aliases: ["Preston"],
  },
  qpr: {
    id: "qpr",
    name: "Queens Park Rangers",
    aliases: ["QPR"],
  },
  "sheffield-united": {
    id: "sheffield-united",
    name: "Sheffield United",
    aliases: ["Sheff United"],
  },
  "sheffield-wednesday": {
    id: "sheffield-wednesday",
    name: "Sheffield Wednesday",
    aliases: ["Sheff Wednesday"],
  },
  southampton: {
    id: "southampton",
    name: "Southampton",
    aliases: ["Saints"],
  },
  "stoke-city": {
    id: "stoke-city",
    name: "Stoke City",
    aliases: ["Stoke"],
  },
  swansea: {
    id: "swansea",
    name: "Swansea City",
    aliases: ["Swansea"],
  },
  watford: {
    id: "watford",
    name: "Watford",
    aliases: ["Watford FC"],
  },
  "west-brom": {
    id: "west-brom",
    name: "West Bromwich Albion",
    aliases: ["West Brom"],
  },
  wrexham: {
    id: "wrexham",
    name: "Wrexham",
    aliases: ["Wrexham AFC"],
  },

  /* League One */
  "afc-wimbledon": {
    id: "afc-wimbledon",
    name: "Wimbledon",
    aliases: ["AFC Wimbledon"],
  },
  barnsley: {
    id: "barnsley",
    name: "Barnsley",
    aliases: ["Barnsley FC"],
  },
  blackpool: {
    id: "blackpool",
    name: "Blackpool",
    aliases: ["Blackpool FC"],
  },
  bolton: {
    id: "bolton",
    name: "Bolton",
    aliases: ["Bolton Wanderers"],
  },
  bradford: {
    id: "bradford",
    name: "Bradford",
    aliases: ["Bradford City"],
  },
  burton: {
    id: "burton",
    name: "Burton",
    aliases: ["Burton Albion"],
  },
  cardiff: {
    id: "cardiff",
    name: "Cardiff",
    aliases: ["Cardiff City"],
  },
  doncaster: {
    id: "doncaster",
    name: "Doncaster",
    aliases: ["Doncaster Rovers"],
  },
  exeter: {
    id: "exeter",
    name: "Exeter",
    aliases: ["Exeter City"],
  },
  huddersfield: {
    id: "huddersfield",
    name: "Huddersfield",
    aliases: ["Huddersfield Town"],
  },
  "leyton-orient": {
    id: "leyton-orient",
    name: "Leyton Orient",
    aliases: ["Leyton Orient FC"],
  },
  lincoln: {
    id: "lincoln",
    name: "Lincoln",
    aliases: ["Lincoln City"],
  },
  luton: {
    id: "luton",
    name: "Luton",
    aliases: ["Luton Town"],
  },
  mansfield: {
    id: "mansfield",
    name: "Mansfield",
    aliases: ["Mansfield Town"],
  },
  northampton: {
    id: "northampton",
    name: "Northampton",
    aliases: ["Northampton Town"],
  },
  peterborough: {
    id: "peterborough",
    name: "Peterborough",
    aliases: ["Peterborough United"],
  },
  plymouth: {
    id: "plymouth",
    name: "Plymouth",
    aliases: ["Plymouth Argyle"],
  },
  "port-vale": {
    id: "port-vale",
    name: "Port Vale",
    aliases: ["Port Vale FC"],
  },
  reading: {
    id: "reading",
    name: "Reading",
    aliases: ["Reading FC"],
  },
  rotherham: {
    id: "rotherham",
    name: "Rotherham",
    aliases: ["Rotherham United"],
  },
  stevenage: {
    id: "stevenage",
    name: "Stevenage",
    aliases: ["Stevenage FC"],
  },
  stockport: {
    id: "stockport",
    name: "Stockport",
    aliases: ["Stockport County"],
  },
  wigan: {
    id: "wigan",
    name: "Wigan",
    aliases: ["Wigan Athletic"],
  },
  wycombe: {
    id: "wycombe",
    name: "Wycombe",
    aliases: ["Wycombe Wanderers"],
  },

    /* =========================
     GERMANY
     ========================= */

  /* Bundesliga */
  augsburg: {
    id: "augsburg",
    name: "Augsburg",
    aliases: ["FC Augsburg"],
  },
  bayern: {
    id: "bayern",
    name: "Bayern",
    aliases: ["FC Bayern München", "Bayern Munich"],
  },
  "borussia-dortmund": {
    id: "borussia-dortmund",
    name: "Dortmund",
    aliases: ["Borussia Dortmund", "BVB"],
  },
  "borussia-monchengladbach": {
    id: "borussia-monchengladbach",
    name: "Mönchengladbach",
    aliases: ["Borussia Mönchengladbach", "Gladbach"],
  },
  "eintracht-frankfurt": {
    id: "eintracht-frankfurt",
    name: "Frankfurt",
    aliases: ["Eintracht Frankfurt"],
  },
  freiburg: {
    id: "freiburg",
    name: "Freiburg",
    aliases: ["SC Freiburg"],
  },
  heidenheim: {
    id: "heidenheim",
    name: "Heidenheim",
    aliases: ["1. FC Heidenheim"],
  },
  hoffenheim: {
    id: "hoffenheim",
    name: "Hoffenheim",
    aliases: ["TSG Hoffenheim"],
  },
  koln: {
    id: "koln",
    name: "Köln",
    aliases: ["1. FC Köln", "FC Cologne"],
  },
  leverkusen: {
    id: "leverkusen",
    name: "Leverkusen",
    aliases: ["Bayer 04 Leverkusen"],
  },
  mainz: {
    id: "mainz",
    name: "Mainz",
    aliases: ["1. FSV Mainz 05"],
  },
  "rb-leipzig": {
    id: "rb-leipzig",
    name: "Leipzig",
    aliases: ["RB Leipzig"],
  },
  "st-pauli": {
    id: "st-pauli",
    name: "St. Pauli",
    aliases: ["FC St. Pauli"],
  },
  stuttgart: {
    id: "stuttgart",
    name: "Stuttgart",
    aliases: ["VfB Stuttgart"],
  },
  "union-berlin": {
    id: "union-berlin",
    name: "Union Berlin",
    aliases: ["1. FC Union Berlin"],
  },
  "vfl-wolfsburg": {
    id: "vfl-wolfsburg",
    name: "Wolfsburg",
    aliases: ["VfL Wolfsburg"],
  },
  "werder-bremen": {
    id: "werder-bremen",
    name: "Werder Bremen",
    aliases: ["SV Werder Bremen"],
  },
  "hamburger-sv": {
    id: "hamburger-sv",
    name: "Hamburg",
    aliases: ["Hamburger SV", "HSV"],
  },

  /* 2. Bundesliga */
  "arminia-bielefeld": {
    id: "arminia-bielefeld",
    name: "Arminia",
    aliases: ["Arminia Bielefeld"],
  },
  bochum: {
    id: "bochum",
    name: "Bochum",
    aliases: ["VfL Bochum"],
  },
  braunschweig: {
    id: "braunschweig",
    name: "Braunschweig",
    aliases: ["Eintracht Braunschweig"],
  },
  darmstadt: {
    id: "darmstadt",
    name: "Darmstadt",
    aliases: ["SV Darmstadt 98"],
  },
  "dynamo-dresden": {
    id: "dynamo-dresden",
    name: "Dresden",
    aliases: ["Dynamo Dresden"],
  },
  elversberg: {
    id: "elversberg",
    name: "Elversberg",
    aliases: ["SV Elversberg"],
  },
  "fortuna-dusseldorf": {
    id: "fortuna-dusseldorf",
    name: "Düsseldorf",
    aliases: ["Fortuna Düsseldorf"],
  },
  "greuther-furth": {
    id: "greuther-furth",
    name: "Greuther Fürth",
    aliases: ["SpVgg Greuther Fürth"],
  },
  hannover: {
    id: "hannover",
    name: "Hannover",
    aliases: ["Hannover 96"],
  },
  "hertha-bsc": {
    id: "hertha-bsc",
    name: "Hertha",
    aliases: ["Hertha BSC"],
  },
  "holstein-kiel": {
    id: "holstein-kiel",
    name: "Holstein",
    aliases: ["Holstein Kiel"],
  },
  kaiserslautern: {
    id: "kaiserslautern",
    name: "Kaiserslautern",
    aliases: ["1. FC Kaiserslautern"],
  },
  karlsruhe: {
    id: "karlsruhe",
    name: "Karlsruhe",
    aliases: ["Karlsruher SC", "KSC"],
  },
  magdeburg: {
    id: "magdeburg",
    name: "Magdeburg",
    aliases: ["1. FC Magdeburg"],
  },
  nurnberg: {
    id: "nurnberg",
    name: "Nürnberg",
    aliases: ["1. FC Nürnberg"],
  },
  paderborn: {
    id: "paderborn",
    name: "Paderborn",
    aliases: ["SC Paderborn 07"],
  },
  "preussen-munster": {
    id: "preussen-munster",
    name: "Preußen Münster",
    aliases: ["SC Preußen Münster"],
  },
  schalke: {
    id: "schalke",
    name: "Schalke",
    aliases: ["FC Schalke 04"],
  },
  /* =========================
     ITALY
     ========================= */

  /* Serie A */
  atalanta: {
    id: "atalanta",
    name: "Atalanta",
    aliases: ["Atalanta BC"],
  },
  bologna: {
    id: "bologna",
    name: "Bologna",
    aliases: ["Bologna FC", "Bologna FC 1909"],
  },
  cagliari: {
    id: "cagliari",
    name: "Cagliari",
    aliases: ["Cagliari Calcio"],
  },
  como: {
    id: "como",
    name: "Como",
    aliases: ["Como 1907"],
  },
  cremonese: {
    id: "cremonese",
    name: "Cremonese",
    aliases: ["US Cremonese"],
  },
  fiorentina: {
    id: "fiorentina",
    name: "Fiorentina",
    aliases: ["ACF Fiorentina"],
  },
  genoa: {
    id: "genoa",
    name: "Genoa",
    aliases: ["Genoa CFC"],
  },
  "hellas-verona": {
    id: "hellas-verona",
    name: "Hellas Verona",
    aliases: ["Verona", "Hellas"],
  },
  inter: {
    id: "inter",
    name: "Inter",
    aliases: ["Internazionale", "Inter Milan"],
  },
  juventus: {
    id: "juventus",
    name: "Juventus",
    aliases: ["Juve"],
  },
  lazio: {
    id: "lazio",
    name: "Lazio",
    aliases: ["SS Lazio"],
  },
  lecce: {
    id: "lecce",
    name: "Lecce",
    aliases: ["US Lecce"],
  },
  milan: {
    id: "milan",
    name: "Milan",
    aliases: ["AC Milan"],
  },
  napoli: {
    id: "napoli",
    name: "Napoli",
    aliases: ["SSC Napoli"],
  },
  parma: {
    id: "parma",
    name: "Parma",
    aliases: ["Parma Calcio"],
  },
  pisa: {
    id: "pisa",
    name: "Pisa",
    aliases: ["Pisa SC"],
  },
  roma: {
    id: "roma",
    name: "Roma",
    aliases: ["AS Roma"],
  },
  sassuolo: {
    id: "sassuolo",
    name: "Sassuolo",
    aliases: ["US Sassuolo", "Sassuolo Calcio"],
  },
  torino: {
    id: "torino",
    name: "Torino",
    aliases: ["Torino FC"],
  },
  udinese: {
    id: "udinese",
    name: "Udinese",
    aliases: ["Udinese Calcio"],
  },

  /* Serie B */
  avellino: {
    id: "avellino",
    name: "Avellino",
    aliases: ["US Avellino"],
  },
  bari: {
    id: "bari",
    name: "Bari",
    aliases: ["SSC Bari"],
  },
  carrarese: {
    id: "carrarese",
    name: "Carrarese",
    aliases: ["Carrarese Calcio"],
  },
  catanzaro: {
    id: "catanzaro",
    name: "Catanzaro",
    aliases: ["US Catanzaro 1929"],
  },
  cesena: {
    id: "cesena",
    name: "Cesena",
    aliases: ["Cesena FC"],
  },
  empoli: {
    id: "empoli",
    name: "Empoli",
    aliases: ["Empoli FC"],
  },
  entella: {
    id: "entella",
    name: "Entella",
    aliases: ["Virtus Entella"],
  },
  frosinone: {
    id: "frosinone",
    name: "Frosinone",
    aliases: ["Frosinone Calcio"],
  },
  "juve-stabia": {
    id: "juve-stabia",
    name: "Juve Stabia",
    aliases: ["SS Juve Stabia"],
  },
  mantova: {
    id: "mantova",
    name: "Mantova",
    aliases: ["AC Mantova"],
  },
  modena: {
    id: "modena",
    name: "Modena",
    aliases: ["Modena FC"],
  },
  monza: {
    id: "monza",
    name: "Monza",
    aliases: ["AC Monza"],
  },
  padova: {
    id: "padova",
    name: "Padova",
    aliases: ["Calcio Padova"],
  },
  palermo: {
    id: "palermo",
    name: "Palermo",
    aliases: ["Palermo FC"],
  },
  pescara: {
    id: "pescara",
    name: "Pescara",
    aliases: ["Delfino Pescara"],
  },
  reggiana: {
    id: "reggiana",
    name: "Reggiana",
    aliases: ["AC Reggiana 1919"],
  },
  sampdoria: {
    id: "sampdoria",
    name: "Sampdoria",
    aliases: ["UC Sampdoria"],
  },
  spezia: {
    id: "spezia",
    name: "Spezia",
    aliases: ["Spezia Calcio"],
  },
  sudtirol: {
    id: "sudtirol",
    name: "Südtirol",
    aliases: ["FC Südtirol"],
  },
  venezia: {
    id: "venezia",
    name: "Venezia",
    aliases: ["Venezia FC"],
  },
  /* =========================
     BELGIUM
     ========================= */

  /* Jupiler Pro League */
  anderlecht: {
    id: "anderlecht",
    name: "Anderlecht",
    aliases: ["RSC Anderlecht"],
  },
  antwerp: {
    id: "antwerp",
    name: "Antwerp",
    aliases: ["Royal Antwerp FC"],
  },
  "club-brugge": {
    id: "club-brugge",
    name: "Club Brugge",
    aliases: ["Club Brugge KV"],
  },
  "cercle-brugge": {
    id: "cercle-brugge",
    name: "Cercle Brugge",
    aliases: ["Cercle Brugge KSV"],
  },
  charleroi: {
    id: "charleroi",
    name: "Charleroi",
    aliases: ["Sporting Charleroi"],
  },
  dender: {
    id: "dender",
    name: "Dender",
    aliases: ["FCV Dender"],
  },
  genk: {
    id: "genk",
    name: "Genk",
    aliases: ["KRC Genk"],
  },
  gent: {
    id: "gent",
    name: "Gent",
    aliases: ["KAA Gent"],
  },
  leuven: {
    id: "leuven",
    name: "OH Leuven",
    aliases: ["OHL"],
  },
  mechelen: {
    id: "mechelen",
    name: "Mechelen",
    aliases: ["KV Mechelen"],
  },
  raal: {
    id: "raal",
    name: "RAAL",
    aliases: ["RAAL La Louvière"],
  },
  "standard-liege": {
    id: "standard-liege",
    name: "Standard",
    aliases: ["Standard Liège"],
  },
  stvv: {
    id: "stvv",
    name: "STVV",
    aliases: ["Sint-Truiden"],
  },
  "union-sg": {
    id: "union-sg",
    name: "Union",
    aliases: ["Union Saint-Gilloise"],
  },
  westerlo: {
    id: "westerlo",
    name: "Westerlo",
    aliases: ["KVC Westerlo"],
  },
  "zulte-waregem": {
    id: "zulte-waregem",
    name: "Zulte Waregem",
    aliases: ["Essevee"],
  },

  /* Challenger Pro League */
  beveren: {
    id: "beveren",
    name: "Beveren",
    aliases: ["SK Beveren"],
  },
  beerschot: {
    id: "beerschot",
    name: "Beerschot",
    aliases: ["K Beerschot VA"],
  },
  kortrijk: {
    id: "kortrijk",
    name: "Kortrijk",
    aliases: ["KV Kortrijk"],
  },
  lommel: {
    id: "lommel",
    name: "Lommel",
    aliases: ["Lommel SK"],
  },
  "patro-eisden": {
    id: "patro-eisden",
    name: "Patro Eisden",
    aliases: ["Patro Eisden Maasmechelen"],
  },
  "fc-luik": {
    id: "fc-luik",
    name: "FC Luik",
    aliases: ["RFC Liège"],
  },
  eupen: {
    id: "eupen",
    name: "Eupen",
    aliases: ["KAS Eupen"],
  },
  "jong-gent": {
    id: "jong-gent",
    name: "Jong Gent",
    aliases: ["Jong KAA Gent"],
  },
  lokeren: {
    id: "lokeren",
    name: "Lokeren",
    aliases: ["KSC Lokeren-Temse"],
  },
  lierse: {
    id: "lierse",
    name: "Lierse",
    aliases: ["Lierse SK"],
  },
  seraing: {
    id: "seraing",
    name: "Seraing",
    aliases: ["RFC Seraing"],
  },
  rwdm: {
    id: "rwdm",
    name: "RWDM",
    aliases: ["RWD Molenbeek"],
  },
  "francs-borains": {
    id: "francs-borains",
    name: "Francs Borains",
    aliases: ["Royal Francs Borains"],
  },
  "jong-genk": {
    id: "jong-genk",
    name: "Jong Genk",
  },
  "rsca-futures": {
    id: "rsca-futures",
    name: "RSCA Futures",
  },
  "club-nxt": {
    id: "club-nxt",
    name: "Club NXT",
  },
  "olympic-charleroi": {
    id: "olympic-charleroi",
    name: "Olympic Charleroi",
  },

    /* =========================
     SWEDEN
     ========================= */

  /* Allsvenskan */
  aik: {
    id: "aik",
    name: "AIK",
    aliases: ["AIK Fotboll"],
  },
  bp: {
    id: "bp",
    name: "BP",
    aliases: ["Brommapojkarna", "IF Brommapojkarna"],
  },
  degerfors: {
    id: "degerfors",
    name: "Degerfors",
    aliases: ["Degerfors IF"],
  },
  djurgarden: {
    id: "djurgarden",
    name: "Djurgården",
    aliases: ["Djurgårdens IF", "Djurgardens IF"],
  },
  elfsborg: {
    id: "elfsborg",
    name: "Elfsborg",
    aliases: ["IF Elfsborg"],
  },
  gais: {
    id: "gais",
    name: "GAIS",
    aliases: ["GAIS Göteborg"],
  },
  hacken: {
    id: "hacken",
    name: "Häcken",
    aliases: ["BK Häcken", "BK Hacken"],
  },
  halmstad: {
    id: "halmstad",
    name: "Halmstad",
    aliases: ["Halmstads BK"],
  },
  hammarby: {
    id: "hammarby",
    name: "Hammarby",
    aliases: ["Hammarby IF"],
  },
  "ifk-goteborg": {
    id: "ifk-goteborg",
    name: "IFK Göteborg",
    aliases: ["IFK Goteborg", "Göteborg"],
  },
  kalmar: {
    id: "kalmar",
    name: "Kalmar",
    aliases: ["Kalmar FF"],
  },
  malmo: {
    id: "malmo",
    name: "Malmö",
    aliases: ["Malmö FF", "Malmo FF"],
  },
  mjallby: {
    id: "mjallby",
    name: "Mjällby",
    aliases: ["Mjällby AIF", "Mjallby AIF"],
  },
  orgryte: {
    id: "orgryte",
    name: "Örgryte",
    aliases: ["Örgryte IS", "Orgryte IS"],
  },
  sirius: {
    id: "sirius",
    name: "Sirius",
    aliases: ["IK Sirius"],
  },
  vasteras: {
    id: "vasteras",
    name: "Västerås",
    aliases: ["Västerås SK", "Vasteras SK"],
  },

  /* Superettan */
  falkenberg: {
    id: "falkenberg",
    name: "Falkenberg",
    aliases: ["Falkenbergs FF"],
  },
  "gif-sundsvall": {
    id: "gif-sundsvall",
    name: "GIF Sundsvall",
  },
  helsingborg: {
    id: "helsingborg",
    name: "Helsingborg",
    aliases: ["Helsingborgs IF"],
  },
  "ifk-norrkoping": {
    id: "ifk-norrkoping",
    name: "IFK Norrköping",
    aliases: ["IFK Norrkoping"],
  },
  "ifk-varnamo": {
    id: "ifk-varnamo",
    name: "IFK Värnamo",
    aliases: ["IFK Varnamo"],
  },
  brage: {
    id: "brage",
    name: "Brage",
    aliases: ["IK Brage"],
  },
  oddevold: {
    id: "oddevold",
    name: "Oddevold",
    aliases: ["IK Oddevold"],
  },
  landskrona: {
    id: "landskrona",
    name: "Landskrona",
    aliases: ["Landskrona BoIS"],
  },
  ljungskile: {
    id: "ljungskile",
    name: "Ljungskile",
    aliases: ["Ljungskile SK"],
  },
  "nordic-united": {
    id: "nordic-united",
    name: "Nordic United",
    aliases: ["Nordic United FC"],
  },
  norrby: {
    id: "norrby",
    name: "Norrby",
    aliases: ["Norrby IF"],
  },
  orebro: {
    id: "orebro",
    name: "Örebro",
    aliases: ["Örebro SK", "Orebro SK"],
  },
  osters: {
    id: "osters",
    name: "Öster",
    aliases: ["Östers IF", "Osters IF"],
  },
  ostersund: {
    id: "ostersund",
    name: "Östersund",
    aliases: ["Östersunds FK", "Ostersunds FK"],
  },
  sandviken: {
    id: "sandviken",
    name: "Sandviken",
    aliases: ["Sandvikens IF"],
  },
  varberg: {
    id: "varberg",
    name: "Varberg",
    aliases: ["Varbergs BoIS FC", "Varbergs BoIS"],
  },

    /* =========================
     FRANCE
     ========================= */

  /* Ligue 1 */
  psg: {
    id: "psg",
    name: "PSG",
    aliases: ["Paris Saint-Germain", "Paris SG"],
  },
  lens: {
    id: "lens",
    name: "Lens",
    aliases: ["RC Lens"],
  },
  marseille: {
    id: "marseille",
    name: "Marseille",
    aliases: ["Olympique de Marseille", "OM"],
  },
  lyon: {
    id: "lyon",
    name: "Lyon",
    aliases: ["Olympique Lyonnais", "OL"],
  },
  losc: {
    id: "losc",
    name: "LOSC",
    aliases: ["LOSC Lille", "Lille", "Lille OSC"],
  },
  monaco: {
    id: "monaco",
    name: "Monaco",
    aliases: ["AS Monaco"],
  },
  rennes: {
    id: "rennes",
    name: "Rennes",
    aliases: ["Stade Rennais", "Stade Rennais FC"],
  },
  strasbourg: {
    id: "strasbourg",
    name: "Strasbourg",
    aliases: ["RC Strasbourg", "RC Strasbourg Alsace"],
  },
  toulouse: {
    id: "toulouse",
    name: "Toulouse",
    aliases: ["Toulouse FC"],
  },
  lorient: {
    id: "lorient",
    name: "Lorient",
    aliases: ["FC Lorient"],
  },
  brest: {
    id: "brest",
    name: "Brest",
    aliases: ["Stade Brestois", "Stade Brestois 29"],
  },
  angers: {
    id: "angers",
    name: "Angers",
    aliases: ["Angers SCO"],
  },
  "paris-fc": {
    id: "paris-fc",
    name: "Paris FC",
    aliases: ["PFC"],
  },
  "le-havre": {
    id: "le-havre",
    name: "Le Havre",
    aliases: ["Le Havre AC", "HAC"],
  },
  nice: {
    id: "nice",
    name: "Nice",
    aliases: ["OGC Nice"],
  },
  auxerre: {
    id: "auxerre",
    name: "Auxerre",
    aliases: ["AJ Auxerre"],
  },
  nantes: {
    id: "nantes",
    name: "Nantes",
    aliases: ["FC Nantes"],
  },
  metz: {
    id: "metz",
    name: "Metz",
    aliases: ["FC Metz"],
  },

    /* Ligue 2 */
  troyes: {
    id: "troyes",
    name: "Troyes",
    aliases: ["ESTAC Troyes", "ESTAC"],
  },
  "saint-etienne": {
    id: "saint-etienne",
    name: "Saint-Étienne",
    aliases: ["Saint-Etienne", "AS Saint-Étienne", "AS Saint-Etienne"],
  },
  "le-mans": {
    id: "le-mans",
    name: "Le Mans",
    aliases: ["Le Mans FC"],
  },
  "red-star": {
    id: "red-star",
    name: "Red Star",
    aliases: ["Red Star FC 93", "Red Star FC"],
  },
  reims: {
    id: "reims",
    name: "Reims",
    aliases: ["Stade de Reims"],
  },
  rodez: {
    id: "rodez",
    name: "Rodez",
    aliases: ["Rodez Aveyron", "Rodez Aveyron Football"],
  },
  montpellier: {
    id: "montpellier",
    name: "Montpellier",
    aliases: ["Montpellier HSC", "MHSC"],
  },
  dunkerque: {
    id: "dunkerque",
    name: "Dunkerque",
    aliases: ["USL Dunkerque"],
  },
  annecy: {
    id: "annecy",
    name: "Annecy",
    aliases: ["FC Annecy"],
  },
  guingamp: {
    id: "guingamp",
    name: "Guingamp",
    aliases: ["EA Guingamp"],
  },
  pau: {
    id: "pau",
    name: "Pau",
    aliases: ["Pau FC"],
  },
  boulogne: {
    id: "boulogne",
    name: "Boulogne",
    aliases: ["US Boulogne", "US Boulogne CO"],
  },
  grenoble: {
    id: "grenoble",
    name: "Grenoble",
    aliases: ["Grenoble Foot 38", "GF38"],
  },
  clermont: {
    id: "clermont",
    name: "Clermont",
    aliases: ["Clermont Foot", "Clermont Foot 63"],
  },
  nancy: {
    id: "nancy",
    name: "Nancy",
    aliases: ["AS Nancy Lorraine"],
  },
  amiens: {
    id: "amiens",
    name: "Amiens",
    aliases: ["SC Amiens", "Amiens SC"],
  },
  laval: {
    id: "laval",
    name: "Laval",
    aliases: ["Stade Lavallois", "Stade Laval"],
  },
  bastia: {
    id: "bastia",
    name: "Bastia",
    aliases: ["SC Bastia"],
  },

    /* =========================
     SPAIN
     ========================= */

  /* Primera */
  barcelona: {
    id: "barcelona",
    name: "Barcelona",
    aliases: ["FC Barcelona", "Barça", "Barca"],
  },
  "real-madrid": {
    id: "real-madrid",
    name: "Real Madrid",
    aliases: ["Real Madrid CF"],
  },
  villarreal: {
    id: "villarreal",
    name: "Villarreal",
    aliases: ["Villarreal CF"],
  },
  "atletico-madrid": {
    id: "atletico-madrid",
    name: "Atlético Madrid",
    aliases: ["Atletico Madrid", "Atlético", "Atletico"],
  },
  "real-betis": {
    id: "real-betis",
    name: "Betis",
    aliases: ["Real Betis", "Real Betis Balompié", "Real Betis Balompie"],
  },
  celta: {
    id: "celta",
    name: "Celta",
    aliases: ["Celta de Vigo", "RC Celta"],
  },
  "real-sociedad": {
    id: "real-sociedad",
    name: "Real Sociedad",
    aliases: ["La Real"],
  },
  getafe: {
    id: "getafe",
    name: "Getafe",
    aliases: ["Getafe CF"],
  },
  athletic: {
    id: "athletic",
    name: "Athletic",
    aliases: ["Athletic Bilbao", "Athletic Club"],
  },
  osasuna: {
    id: "osasuna",
    name: "Osasuna",
    aliases: ["CA Osasuna"],
  },
  espanyol: {
    id: "espanyol",
    name: "Espanyol",
    aliases: ["RCD Espanyol"],
  },
  valencia: {
    id: "valencia",
    name: "Valencia",
    aliases: ["Valencia CF"],
  },
  girona: {
    id: "girona",
    name: "Girona",
    aliases: ["FC Girona", "Girona FC"],
  },
  rayo: {
    id: "rayo",
    name: "Rayo Vallecano",
    aliases: ["Rayo"],
  },
  sevilla: {
    id: "sevilla",
    name: "Sevilla",
    aliases: ["Sevilla FC"],
  },
  alaves: {
    id: "alaves",
    name: "Alavés",
    aliases: ["Alaves", "Deportivo Alavés", "Deportivo Alaves"],
  },
  elche: {
    id: "elche",
    name: "Elche",
    aliases: ["Elche CF"],
  },
  mallorca: {
    id: "mallorca",
    name: "Mallorca",
    aliases: ["Real Mallorca", "RCD Mallorca"],
  },
  levante: {
    id: "levante",
    name: "Levante",
    aliases: ["Levante UD"],
  },
  oviedo: {
    id: "oviedo",
    name: "Oviedo",
    aliases: ["Real Oviedo"],
  },

  /* Segunda */
  "racing-santander": {
    id: "racing-santander",
    name: "Racing Santander",
    aliases: ["Real Racing Club", "Racing"],
  },
  almeria: {
    id: "almeria",
    name: "Almería",
    aliases: ["Almeria", "UD Almería", "UD Almeria"],
  },
  malaga: {
    id: "malaga",
    name: "Málaga",
    aliases: ["Malaga", "Málaga CF", "Malaga CF"],
  },
  deportivo: {
    id: "deportivo",
    name: "Deportivo",
    aliases: ["Deportivo La Coruña", "Deportivo La Coruna", "RC Deportivo"],
  },
  burgos: {
    id: "burgos",
    name: "Burgos",
    aliases: ["Burgos CF"],
  },
  castellon: {
    id: "castellon",
    name: "Castellón",
    aliases: ["Castellon", "CD Castellón", "CD Castellon"],
  },
  "las-palmas": {
    id: "las-palmas",
    name: "Las Palmas",
    aliases: ["UD Las Palmas"],
  },
  "sporting-gijon": {
    id: "sporting-gijon",
    name: "Sporting Gijón",
    aliases: ["Sporting Gijon", "Sporting de Gijón", "Sporting de Gijon"],
  },
  ceuta: {
    id: "ceuta",
    name: "Ceuta",
    aliases: ["AD Ceuta"],
  },
  eibar: {
    id: "eibar",
    name: "Eibar",
    aliases: ["SD Eibar"],
  },
  albacete: {
    id: "albacete",
    name: "Albacete",
    aliases: ["Albacete Balompié", "Albacete Balompie"],
  },
  cordoba: {
    id: "cordoba",
    name: "Córdoba",
    aliases: ["Cordoba", "Córdoba CF", "Cordoba CF"],
  },
  granada: {
    id: "granada",
    name: "Granada",
    aliases: ["Granada CF"],
  },
  "real-sociedad-b": {
    id: "real-sociedad-b",
    name: "Real Sociedad B",
    aliases: ["Sanse"],
  },
  andorra: {
    id: "andorra",
    name: "Andorra",
    aliases: ["FC Andorra"],
  },
  cadiz: {
    id: "cadiz",
    name: "Cádiz",
    aliases: ["Cadiz", "Cádiz CF", "Cadiz CF"],
  },
  leganes: {
    id: "leganes",
    name: "Leganés",
    aliases: ["Leganes", "CD Leganés", "CD Leganes"],
  },
  valladolid: {
    id: "valladolid",
    name: "Valladolid",
    aliases: ["Real Valladolid"],
  },
  huesca: {
    id: "huesca",
    name: "Huesca",
    aliases: ["SD Huesca"],
  },
  zaragoza: {
    id: "zaragoza",
    name: "Zaragoza",
    aliases: ["Real Zaragoza"],
  },
  mirandes: {
    id: "mirandes",
    name: "Mirandés",
    aliases: ["Mirandes", "CD Mirandés", "CD Mirandes"],
  },
  leonesa: {
    id: "leonesa",
    name: "Leonesa",
    aliases: ["Cultural Leonesa"],
  },

    /* =========================
     PORTUGAL
     ========================= */

  /* Primeira Liga */
  alverca: {
    id: "alverca",
    name: "Alverca",
    aliases: ["FC Alverca"],
  },
  arouca: {
    id: "arouca",
    name: "Arouca",
    aliases: ["FC Arouca"],
  },
  avs: {
    id: "avs",
    name: "AVS Futebol SAD",
    aliases: ["AVS"],
  },
  benfica: {
    id: "benfica",
    name: "Benfica",
    aliases: ["SL Benfica"],
  },
  braga: {
    id: "braga",
    name: "Braga",
    aliases: ["Sporting Braga"],
  },
  "casa-pia": {
    id: "casa-pia",
    name: "Casa Pia",
    aliases: ["Casa Pia AC"],
  },
  estoril: {
    id: "estoril",
    name: "Estoril",
    aliases: ["Estoril Praia"],
    },
  estrela: {
    id: "estrela",
    name: "Estrela",
    aliases: ["CF Estrela da Amadora", "Estrela da Amadora"],
  },
  famalicao: {
    id: "famalicao",
    name: "Famalicão",
    aliases: ["FC Famalicão", "Famalicao"],
  },
  "gil-vicente": {
    id: "gil-vicente",
    name: "Gil Vicente",
    aliases: ["Gil Vicente FC"],
  },
  moreirense: {
    id: "moreirense",
    name: "Moreirense",
    aliases: ["Moreirense FC"],
  },
  nacional: {
    id: "nacional",
    name: "Nacional",
    aliases: ["CD Nacional"],
  },
  porto: {
    id: "porto",
    name: "Porto",
    aliases: ["FC Porto"],
  },
  "rio-ave": {
    id: "rio-ave",
    name: "Rio Ave",
    aliases: ["Rio Ave FC"],
  },
  "santa-clara": {
    id: "santa-clara",
    name: "Santa Clara",
    aliases: ["CD Santa Clara"],
  },
  "sporting-cp": {
    id: "sporting-cp",
    name: "Sporting",
    aliases: ["Sporting CP", "Sporting Lisbon"],
  },
  tondela: {
    id: "tondela",
    name: "Tondela",
    aliases: ["CD Tondela"],
  },
  "vitoria-guimaraes": {
    id: "vitoria-guimaraes",
    name: "Vitória",
    aliases: ["Vitória Guimarães", "Guimarães", "Vitória SC"],
  },

    /* Liga Portugal 2 */
  maritimo: {
    id: "maritimo",
    name: "Marítimo",
    aliases: ["CS Marítimo", "Maritimo"],
  },
  "academico-viseu": {
    id: "academico-viseu",
    name: "Académico Viseu",
    aliases: ["Academico Viseu", "Académico de Viseu FC"],
  },
  torreense: {
    id: "torreense",
    name: "Torreense",
    aliases: ["SCU Torreense"],
  },
  "uniao-de-leiria": {
    id: "uniao-de-leiria",
    name: "União de Leiria",
    aliases: ["Uniao de Leiria", "UD Leiria"],
  },
  vizela: {
    id: "vizela",
    name: "Vizela",
    aliases: ["FC Vizela"],
  },
  "sporting-cp-ii": {
    id: "sporting-cp-ii",
    name: "Sporting CP II",
    aliases: ["Sporting B", "Sporting CP B"],
  },
  "porto-ii": {
    id: "porto-ii",
    name: "Porto II",
    aliases: ["FC Porto B", "Porto B"],
  },
  "lusitania-fc": {
    id: "lusitania-fc",
    name: "Lusitânia FC",
    aliases: ["Lusitania FC", "Lusitânia"],
  },
  "benfica-ii": {
    id: "benfica-ii",
    name: "Benfica II",
    aliases: ["SL Benfica B", "Benfica B"],
  },
  chaves: {
    id: "chaves",
    name: "Chaves",
    aliases: ["GD Chaves"],
  },
  feirense: {
    id: "feirense",
    name: "Feirense",
    aliases: ["CD Feirense"],
  },
  leixoes: {
    id: "leixoes",
    name: "Leixões",
    aliases: ["Leixoes", "Leixões SC"],
  },
  "felgueiras-1932": {
    id: "felgueiras-1932",
    name: "Felgueiras 1932",
    aliases: ["FC Felgueiras 1932", "Felgueiras"],
  },
  "pacos-de-ferreira": {
    id: "pacos-de-ferreira",
    name: "Paços de Ferreira",
    aliases: ["Pacos de Ferreira", "FC Paços de Ferreira", "FC Pacos de Ferreira"],
  },
  penafiel: {
    id: "penafiel",
    name: "Penafiel",
    aliases: ["FC Penafiel"],
  },
  farense: {
    id: "farense",
    name: "Farense",
    aliases: ["SC Farense"],
  },
  portimonense: {
    id: "portimonense",
    name: "Portimonense",
    aliases: ["Portimonense SC"],
  },
  "ud-oliveirense": {
    id: "ud-oliveirense",
    name: "UD Oliveirense",
    aliases: ["União Desportiva Oliveirense", "Uniao Desportiva Oliveirense", "Oliveirense"],
  },


  /* =========================
     OTHER / PLACEHOLDER
     ========================= */

  "custom-club": {
    id: "custom-club",
    name: "Custom Club",
    aliases: ["Other club", "Andere club"],
  },
};

/**
 * SEIZOENSINDELING
 * Alleen dit stuk pas je aan bij promotie/degradatie.
 */
export const competitionClubIds: Record<CompetitionId, ClubId[]> = {
  eredivisie: [
    "ajax",
    "az",
    "excelsior",
    "fc-groningen",
    "fc-twente",
    "fc-utrecht",
    "fc-volendam",
    "feyenoord",
    "fortuna-sittard",
    "go-ahead-eagles",
    "heracles-almelo",
    "nac-breda",
    "nec",
    "pec-zwolle",
    "psv",
    "sc-heerenveen",
    "sparta-rotterdam",
    "telstar",
  ],
  kkd: [
    "ado-den-haag",
    "almere-city",
    "de-graafschap",
    "fc-den-bosch",
    "fc-dordrecht",
    "fc-eindhoven",
    "fc-emmen",
    "helmond-sport",
    "jong-ajax",
    "jong-az",
    "jong-psv",
    "jong-utrecht",
    "mvv-maastricht",
    "rkc-waalwijk",
    "roda-jc",
    "sc-cambuur",
    "top-oss",
    "vitesse",
    "vvv-venlo",
    "willem-ii",
  ],
  "premier-league": [
    "arsenal",
    "aston-villa",
    "bournemouth",
    "brentford",
    "brighton",
    "burnley",
    "chelsea",
    "crystal-palace",
    "everton",
    "fulham",
    "leeds",
    "liverpool",
    "man-city",
    "man-united",
    "newcastle",
    "nottingham-forest",
    "sunderland",
    "tottenham",
    "west-ham",
    "wolves",
  ],
  championship: [
    "birmingham-city",
    "blackburn",
    "bristol-city",
    "charlton",
    "coventry",
    "derby-county",
    "hull-city",
    "ipswich",
    "leicester",
    "middlesbrough",
    "millwall",
    "norwich",
    "oxford-united",
    "portsmouth",
    "preston",
    "qpr",
    "sheffield-united",
    "sheffield-wednesday",
    "southampton",
    "stoke-city",
    "swansea",
    "watford",
    "west-brom",
    "wrexham",
  ],
  "league-one": [
    "afc-wimbledon",
    "barnsley",
    "blackpool",
    "bolton",
    "bradford",
    "burton",
    "cardiff",
    "doncaster",
    "exeter",
    "huddersfield",
    "leyton-orient",
    "lincoln",
    "luton",
    "mansfield",
    "northampton",
    "peterborough",
    "plymouth",
    "port-vale",
    "reading",
    "rotherham",
    "stevenage",
    "stockport",
    "wigan",
    "wycombe",
  ],
    bundesliga: [
    "augsburg",
    "bayern",
    "borussia-dortmund",
    "borussia-monchengladbach",
    "eintracht-frankfurt",
    "freiburg",
    "heidenheim",
    "hoffenheim",
    "koln",
    "leverkusen",
    "mainz",
    "rb-leipzig",
    "st-pauli",
    "stuttgart",
    "union-berlin",
    "vfl-wolfsburg",
    "werder-bremen",
    "hamburger-sv",
  ],
  "2-bundesliga": [
    "arminia-bielefeld",
    "bochum",
    "braunschweig",
    "darmstadt",
    "dynamo-dresden",
    "elversberg",
    "fortuna-dusseldorf",
    "greuther-furth",
    "hannover",
    "hertha-bsc",
    "holstein-kiel",
    "kaiserslautern",
    "karlsruhe",
    "magdeburg",
    "nurnberg",
    "paderborn",
    "preussen-munster",
    "schalke",
  ],
    "serie-a": [
    "atalanta",
    "bologna",
    "cagliari",
    "como",
    "cremonese",
    "fiorentina",
    "genoa",
    "hellas-verona",
    "inter",
    "juventus",
    "lazio",
    "lecce",
    "milan",
    "napoli",
    "parma",
    "pisa",
    "roma",
    "sassuolo",
    "torino",
    "udinese",
  ],
  "serie-b": [
    "avellino",
    "bari",
    "carrarese",
    "catanzaro",
    "cesena",
    "empoli",
    "entella",
    "frosinone",
    "juve-stabia",
    "mantova",
    "modena",
    "monza",
    "padova",
    "palermo",
    "pescara",
    "reggiana",
    "sampdoria",
    "spezia",
    "sudtirol",
    "venezia",
  ],
    "jupiler-pro-league": [
    "anderlecht",
    "antwerp",
    "cercle-brugge",
    "club-brugge",
    "charleroi",
    "dender",
    "genk",
    "gent",
    "leuven",
    "mechelen",
    "raal",
    "standard-liege",
    "stvv",
    "union-sg",
    "westerlo",
    "zulte-waregem",
  ],
  "challenger-pro-league": [
    "beerschot",
    "beveren",
    "club-nxt",
    "eupen",
    "fc-luik",
    "francs-borains",
    "jong-genk",
    "jong-gent",
    "kortrijk",
    "lierse",
    "lokeren",
    "lommel",
    "olympic-charleroi",
    "patro-eisden",
    "rsca-futures",
    "rwdm",
    "seraing",
  ],
    allsvenskan: [
    "aik",
    "bp",
    "degerfors",
    "djurgarden",
    "elfsborg",
    "gais",
    "hacken",
    "halmstad",
    "hammarby",
    "ifk-goteborg",
    "kalmar",
    "malmo",
    "mjallby",
    "orgryte",
    "sirius",
    "vasteras",
  ],
  superettan: [
    "brage",
    "falkenberg",
    "gif-sundsvall",
    "helsingborg",
    "ifk-norrkoping",
    "ifk-varnamo",
    "landskrona",
    "ljungskile",
    "nordic-united",
    "norrby",
    "oddevold",
    "orebro",
    "osters",
    "ostersund",
    "sandviken",
    "varberg",
  ],
    "la-liga": [
    "alaves",
    "athletic",
    "atletico-madrid",
    "barcelona",
    "celta",
    "elche",
    "espanyol",
    "getafe",
    "girona",
    "levante",
    "mallorca",
    "osasuna",
    "oviedo",
    "rayo",
    "real-betis",
    "real-madrid",
    "real-sociedad",
    "sevilla",
    "valencia",
    "villarreal",
  ],
  "segunda-division": [
    "albacete",
    "almeria",
    "andorra",
    "burgos",
    "cadiz",
    "castellon",
    "ceuta",
    "cordoba",
    "deportivo",
    "eibar",
    "granada",
    "huesca",
    "las-palmas",
    "leganes",
    "leonesa",
    "malaga",
    "mirandes",
    "racing-santander",
    "real-sociedad-b",
    "sporting-gijon",
    "valladolid",
    "zaragoza",
  ],
  "primeira-liga": [
    "alverca",
    "arouca",
    "avs",
    "benfica",
    "braga",
    "casa-pia",
    "estoril",
    "estrela",
    "famalicao",
    "gil-vicente",
    "moreirense",
    "nacional",
    "porto",
    "rio-ave",
    "santa-clara",
    "sporting-cp",
    "tondela",
    "vitoria-guimaraes",
  ],
    "liga-portugal-2": [
    "maritimo",
    "academico-viseu",
    "torreense",
    "uniao-de-leiria",
    "vizela",
    "sporting-cp-ii",
    "porto-ii",
    "lusitania-fc",
    "benfica-ii",
    "chaves",
    "feirense",
    "leixoes",
    "felgueiras-1932",
    "pacos-de-ferreira",
    "penafiel",
    "farense",
    "portimonense",
    "ud-oliveirense",
  ],
    "ligue-1": [
    "psg",
    "lens",
    "marseille",
    "lyon",
    "losc",
    "monaco",
    "rennes",
    "strasbourg",
    "toulouse",
    "lorient",
    "brest",
    "angers",
    "paris-fc",
    "le-havre",
    "nice",
    "auxerre",
    "nantes",
    "metz",
  ],
    "ligue-2": [
    "troyes",
    "saint-etienne",
    "le-mans",
    "red-star",
    "reims",
    "rodez",
    "montpellier",
    "dunkerque",
    "annecy",
    "guingamp",
    "pau",
    "boulogne",
    "grenoble",
    "clermont",
    "nancy",
    "amiens",
    "laval",
    "bastia",
  ],
    "mls-eastern": [
    "nashville",
    "nyc-fc",
    "inter-miami",
    "charlotte",
    "chicago-fire",
    "dc-united",
    "toronto",
    "ny-red-bulls",
    "cincinnati",
    "atlanta-united",
    "new-england",
    "montreal",
    "orlando-city",
    "columbus-crew",
    "philadelphia",
  ],
  "mls-western": [
    "lafc",
    "whitecaps",
    "sj-earthquakes",
    "san-diego",
    "seattle",
    "real-salt-lake",
    "colorado-rapids",
    "dallas",
    "houston-dynamo",
    "la-galaxy",
    "austin",
    "minnesota",
    "st-louis-city",
    "portland",
    "sporting-kc",
  ],
};

/* ---------------- DERIVED DATA ---------------- */

export const clubDatabase: ClubDatabaseCountry[] = Object.values(countriesById).map(
  (country) => ({
    ...country,
    logoUrl: getCountryLogoUrl(country.id),
    competitions: Object.values(competitionsById)
      .filter((competition) => competition.countryId === country.id)
      .map((competition) => ({
        ...competition,
        logoUrl: getCompetitionLogoUrl(competition.id),
        clubs: (competitionClubIds[competition.id] ?? [])
          .map((clubId) => clubsById[clubId])
          .filter(isDefined)
          .map((club) => ({
            ...club,
            logoUrl: getClubLogoUrl(club.id),
          })),
      })),
  })
);

/* ---------------- HELPERS ---------------- */

export function getCountryById(countryId: string) {
  const country = countriesById[countryId];
  if (!country) return undefined;

  return {
    ...country,
    logoUrl: getCountryLogoUrl(country.id),
  };
}

export function getCompetitionById(competitionId: string) {
  const competition = competitionsById[competitionId];
  if (!competition) return undefined;

  return {
    ...competition,
    logoUrl: getCompetitionLogoUrl(competition.id),
  };
}

export function getClubById(clubId: string) {
  const club = clubsById[clubId];
  if (!club) return undefined;

  return {
    ...club,
    logoUrl: getClubLogoUrl(club.id),
  };
}

export function getCompetitionByIds(countryId: string, competitionId: string) {
  const competition = competitionsById[competitionId];
  if (!competition || competition.countryId !== countryId) return undefined;

  return {
    ...competition,
    logoUrl: getCompetitionLogoUrl(competition.id),
    clubs: (competitionClubIds[competition.id] ?? [])
      .map((clubId) => getClubById(clubId))
      .filter(isDefined),
  };
}

export function getClubByIds(
  countryId: string,
  competitionId: string,
  clubId: string
) {
  const competition = getCompetitionByIds(countryId, competitionId);
  return competition?.clubs.find((club) => club.id === clubId);
}

export function getCurrentCompetitionIdForClub(clubId: string) {
  return Object.entries(competitionClubIds).find(([, clubIds]) =>
    clubIds.includes(clubId)
  )?.[0];
}

export function getCurrentCompetitionForClub(clubId: string) {
  const competitionId = getCurrentCompetitionIdForClub(clubId);
  if (!competitionId) return undefined;

  const competition = competitionsById[competitionId];
  if (!competition) return undefined;

  return {
    ...competition,
    logoUrl: getCompetitionLogoUrl(competition.id),
  };
}

export function findClubInDatabaseByName(name: string) {
  const input = norm(name);

  for (const club of Object.values(clubsById)) {
    if (norm(club.name) === input || club.aliases?.some((alias) => norm(alias) === input)) {
      const competition = getCurrentCompetitionForClub(club.id);
      const country = competition ? getCountryById(competition.countryId) : undefined;

      return {
        country,
        competition,
        club: {
          ...club,
          logoUrl: getClubLogoUrl(club.id),
        },
      };
    }
  }

  return null;
}