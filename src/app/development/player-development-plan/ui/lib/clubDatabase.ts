export type ClubDatabaseClub = {
  id: string;
  name: string;
  logoUrl?: string;
  aliases?: string[];
};

export type ClubDatabaseCompetition = {
  id: string;
  name: string;
  logoUrl?: string;
  clubs: ClubDatabaseClub[];
};

export type ClubDatabaseCountry = {
  id: string;
  name: string;
  logoUrl?: string;
  competitions: ClubDatabaseCompetition[];
};

export const clubDatabase: ClubDatabaseCountry[] = [
  {
    id: "netherlands",
    name: "Netherlands",
    logoUrl: "/logos/countries/netherlands.png",
    competitions: [
      {
        id: "eredivisie",
        name: "Eredivisie",
        logoUrl: "/logos/netherlands/eredivisie/eredivisie.png",
        clubs: [
          {
            id: "ajax",
            name: "Ajax",
            logoUrl: "/logos/netherlands/eredivisie/ajax.png",
            aliases: ["AFC Ajax"],
          },
          {
            id: "az",
            name: "AZ",
            logoUrl: "/logos/netherlands/eredivisie/az.png",
            aliases: ["AZ Alkmaar"],
          },
          {
            id: "excelsior",
            name: "Excelsior",
            logoUrl: "/logos/netherlands/eredivisie/excelsior.png",
          },
          {
            id: "fc-groningen",
            name: "FC Groningen",
            logoUrl: "/logos/netherlands/eredivisie/fc-groningen.png",
          },
          {
            id: "fc-twente",
            name: "FC Twente",
            logoUrl: "/logos/netherlands/eredivisie/fc-twente.png",
            aliases: ["FC Twente Enschede"],
          },
          {
            id: "fc-utrecht",
            name: "FC Utrecht",
            logoUrl: "/logos/netherlands/eredivisie/fc-utrecht.png",
          },
          {
            id: "fc-volendam",
            name: "FC Volendam",
            logoUrl: "/logos/netherlands/eredivisie/fc-volendam.png",
          },
          {
            id: "feyenoord",
            name: "Feyenoord",
            logoUrl: "/logos/netherlands/eredivisie/feyenoord.png",
            aliases: ["Feyenoord Rotterdam"],
          },
          {
            id: "fortuna-sittard",
            name: "Fortuna Sittard",
            logoUrl: "/logos/netherlands/eredivisie/fortuna-sittard.png",
          },
          {
            id: "go-ahead-eagles",
            name: "Go Ahead Eagles",
            logoUrl: "/logos/netherlands/eredivisie/go-ahead-eagles.png",
          },
          {
            id: "heracles-almelo",
            name: "Heracles Almelo",
            logoUrl: "/logos/netherlands/eredivisie/heracles-almelo.png",
          },
          {
            id: "nac-breda",
            name: "NAC Breda",
            logoUrl: "/logos/netherlands/eredivisie/nac-breda.png",
          },
          {
            id: "nec",
            name: "NEC",
            logoUrl: "/logos/netherlands/eredivisie/nec.png",
            aliases: ["N.E.C.", "N.E.C. Nijmegen", "NEC Nijmegen"],
          },
          {
            id: "pec-zwolle",
            name: "PEC Zwolle",
            logoUrl: "/logos/netherlands/eredivisie/pec-zwolle.png",
          },
          {
            id: "psv",
            name: "PSV",
            logoUrl: "/logos/netherlands/eredivisie/psv.png",
            aliases: ["PSV Eindhoven"],
          },
          {
            id: "sc-heerenveen",
            name: "sc Heerenveen",
            logoUrl: "/logos/netherlands/eredivisie/sc-heerenveen.png",
            aliases: ["Heerenveen"],
          },
          {
            id: "sparta-rotterdam",
            name: "Sparta Rotterdam",
            logoUrl: "/logos/netherlands/eredivisie/sparta-rotterdam.png",
          },
          {
            id: "telstar",
            name: "Telstar",
            logoUrl: "/logos/netherlands/eredivisie/telstar.png",
          },
        ],
      },
      {
        id: "kkd",
        name: "KKD",
        logoUrl: "/logos/netherlands/kkd/kkd.png",
        clubs: [
          {
            id: "ado-den-haag",
            name: "ADO Den Haag",
            logoUrl: "/logos/netherlands/kkd/ado-den-haag.png",
          },
          {
            id: "almere-city",
            name: "Almere City",
            logoUrl: "/logos/netherlands/kkd/almere-city.png",
          },
          {
            id: "de-graafschap",
            name: "De Graafschap",
            logoUrl: "/logos/netherlands/kkd/de-graafschap.png",
          },
          {
            id: "fc-den-bosch",
            name: "FC Den Bosch",
            logoUrl: "/logos/netherlands/kkd/fc-den-bosch.png",
          },
          {
            id: "fc-dordrecht",
            name: "FC Dordrecht",
            logoUrl: "/logos/netherlands/kkd/fc-dordrecht.png",
          },
          {
            id: "fc-eindhoven",
            name: "FC Eindhoven",
            logoUrl: "/logos/netherlands/kkd/fc-eindhoven.png",
          },
          {
            id: "fc-emmen",
            name: "FC Emmen",
            logoUrl: "/logos/netherlands/kkd/fc-emmen.png",
          },
          {
            id: "helmond-sport",
            name: "Helmond Sport",
            logoUrl: "/logos/netherlands/kkd/helmond-sport.png",
          },
          {
            id: "jong-ajax",
            name: "Jong Ajax",
            logoUrl: "/logos/netherlands/kkd/jong-ajax.png",
          },
          {
            id: "jong-az",
            name: "Jong AZ",
            logoUrl: "/logos/netherlands/kkd/jong-az.png",
          },
          {
            id: "jong-psv",
            name: "Jong PSV",
            logoUrl: "/logos/netherlands/kkd/jong-psv.png",
          },
          {
            id: "jong-utrecht",
            name: "Jong Utrecht",
            logoUrl: "/logos/netherlands/kkd/jong-utrecht.png",
          },
          {
            id: "mvv-maastricht",
            name: "MVV Maastricht",
            logoUrl: "/logos/netherlands/kkd/mvv-maastricht.png",
          },
          {
            id: "rkc-waalwijk",
            name: "RKC Waalwijk",
            logoUrl: "/logos/netherlands/kkd/rkc-waalwijk.png",
          },
          {
            id: "roda-jc",
            name: "Roda JC",
            logoUrl: "/logos/netherlands/kkd/roda-jc.png",
            aliases: ["Roda JC Kerkrade"],
          },
          {
            id: "sc-cambuur",
            name: "SC Cambuur",
            logoUrl: "/logos/netherlands/kkd/sc-cambuur.png",
            aliases: ["Cambuur"],
          },
          {
            id: "top-oss",
            name: "TOP Oss",
            logoUrl: "/logos/netherlands/kkd/top-oss.png",
          },
          {
            id: "vitesse",
            name: "Vitesse",
            logoUrl: "/logos/netherlands/kkd/vitesse.png",
          },
          {
            id: "vvv-venlo",
            name: "VVV-Venlo",
            logoUrl: "/logos/netherlands/kkd/vvv-venlo.png",
          },
          {
            id: "willem-ii",
            name: "Willem II",
            logoUrl: "/logos/netherlands/kkd/willem-ii.png",
            aliases: ["Willem II Tilburg"],
          },
        ],
      },
    ],
  },

  {
    id: "germany",
    name: "Germany",
    logoUrl: "/logos/countries/germany.png",
    competitions: [
      {
        id: "bundesliga",
        name: "Bundesliga",
        logoUrl: "/logos/germany/bundesliga/bundesliga.png",
        clubs: [],
      },
      {
        id: "2-bundesliga",
        name: "2. Bundesliga",
        logoUrl: "/logos/germany/2-bundesliga/2-bundesliga.png",
        clubs: [],
      },
    ],
  },

  {
    id: "italy",
    name: "Italy",
    logoUrl: "/logos/countries/italy.png",
    competitions: [
      {
        id: "serie-a",
        name: "Serie A",
        logoUrl: "/logos/italy/serie-a/serie-a.png",
        clubs: [],
      },
      {
        id: "serie-b",
        name: "Serie B",
        logoUrl: "/logos/italy/serie-b/serie-b.png",
        clubs: [],
      },
    ],
  },

  {
    id: "belgium",
    name: "Belgium",
    logoUrl: "/logos/countries/belgium.png",
    competitions: [
      {
        id: "jupiler-pro-league",
        name: "Jupiler Pro League",
        logoUrl: "/logos/belgium/jupiler-pro-league/jupiler-pro-league.png",
        clubs: [
          {
            id: "anderlecht",
            name: "Anderlecht",
            logoUrl: "/logos/belgium/jupiler-pro-league/anderlecht.png",
          },
          {
            id: "cercle",
            name: "Cercle",
            logoUrl: "/logos/belgium/jupiler-pro-league/cercle-brugge.png",
            aliases: ["Cercle Brugge"],
          },
          {
            id: "club-brugge",
            name: "Club Brugge",
            logoUrl: "/logos/belgium/jupiler-pro-league/club-brugge.png",
          },
          {
            id: "dender",
            name: "Dender",
            logoUrl: "/logos/belgium/jupiler-pro-league/dender.png",
          },
          {
            id: "kaa-gent",
            name: "KAA Gent",
            logoUrl: "/logos/belgium/jupiler-pro-league/kaa-gent.png",
            aliases: ["Gent"],
          },
          {
            id: "kv-mechelen",
            name: "KV Mechelen",
            logoUrl: "/logos/belgium/jupiler-pro-league/kv-mechelen.png",
          },
          {
            id: "ohl",
            name: "OHL",
            logoUrl: "/logos/belgium/jupiler-pro-league/ohl.png",
            aliases: ["OH Leuven"],
          },
          {
            id: "raal",
            name: "Raal La Louvière",
            logoUrl: "/logos/belgium/jupiler-pro-league/raal-la-louviere.png",
            aliases: ["Raal"],
          },
          {
            id: "racing-genk",
            name: "Racing Genk",
            logoUrl: "/logos/belgium/jupiler-pro-league/racing-genk.png",
            aliases: ["Genk"],
          },
          {
            id: "royal-antwerp",
            name: "Royal Antwerp",
            logoUrl: "/logos/belgium/jupiler-pro-league/royal-antwerp.png",
            aliases: ["Antwerp"],
          },
          {
            id: "standard-luik",
            name: "Standard Liège",
            logoUrl: "/logos/belgium/jupiler-pro-league/standard.png",
            aliases: ["Standard", "Standard Luik"],
          },
          {
            id: "stvv",
            name: "STVV",
            logoUrl: "/logos/belgium/jupiler-pro-league/stvv.png",
          },
          {
            id: "union",
            name: "Union",
            logoUrl: "/logos/belgium/jupiler-pro-league/union.png",
            aliases: ["Union SG", "Union Saint-Gilloise"],
          },
          {
            id: "westerlo",
            name: "Westerlo",
            logoUrl: "/logos/belgium/jupiler-pro-league/westerlo.png",
          },
          {
            id: "zulte-waregem",
            name: "Zulte Waregem",
            logoUrl: "/logos/belgium/jupiler-pro-league/zulte-waregem.png",
            aliases: ["Zulte"],
          },
        ],
      },
    ],
  },

  {
    id: "england",
    name: "England",
    logoUrl: "/logos/countries/england.png",
    competitions: [
      {
        id: "premier-league",
        name: "Premier League",
        logoUrl: "/logos/england/premier-league/premier-league.png",
        clubs: [
          {
            id: "arsenal",
            name: "Arsenal",
            logoUrl: "/logos/england/premier-league/arsenal.png",
          },
          {
            id: "aston-villa",
            name: "Aston Villa",
            logoUrl: "/logos/england/premier-league/aston-villa.png",
          },
          {
            id: "bournemouth",
            name: "Bournemouth",
            logoUrl: "/logos/england/premier-league/bournemouth.png",
          },
          {
            id: "brentford",
            name: "Brentford",
            logoUrl: "/logos/england/premier-league/brentford.png",
          },
          {
            id: "brighton",
            name: "Brighton and Hove Albion",
            logoUrl: "/logos/england/premier-league/brighton.png",
          },
          {
            id: "kv-mechelen",
            name: "KV Mechelen",
            logoUrl: "/logos/england/premier-league/kv-mechelen.png",
          },
          {
            id: "burnley",
            name: "Burnley",
            logoUrl: "/logos/england/premier-league/burnley.png",
          },
          {
            id: "raal",
            name: "Raal La Louvière",
            logoUrl: "/logos/england/premier-league/raal-la-louviere.png",
            aliases: ["Raal"],
          },
          {
            id: "chelsea",
            name: "Chelsea",
            logoUrl: "/logos/england/premier-league/chelsea.png",
          },
          {
            id: "crystal-palace",
            name: "Crystal Palace",
            logoUrl: "/logos/england/premier-league/crystal-palace.png",
          },
          {
            id: "everton",
            name: "Everton",
            logoUrl: "/logos/england/premier-league/everton.png",
          },
          {
            id: "fulham",
            name: "Fulham",
            logoUrl: "/logos/england/premier-league/fulham.png",
          },
          {
            id: "union",
            name: "Union",
            logoUrl: "/logos/england/premier-league/union.png",
            aliases: ["Union SG", "Union Saint-Gilloise"],
          },
          {
            id: "leeds-united",
            name: "Leeds United",
            logoUrl: "/logos/england/premier-league/leeds.png",
          },
          {
            id: "liverpool",
            name: "Liverpool",
            logoUrl: "/logos/england/premier-league/liverpool.png",
          },
          {
            id: "manchester-city",
            name: "Manchester City",
            logoUrl: "/logos/england/premier-league/manchester-city.png",
          },
          {
            id: "manchester-united",
            name: "Manchester United",
            logoUrl: "/logos/england/premier-league/manchester-united.png",
          },
          {
            id: "newcastle",
            name: "Newcastle United",
            logoUrl: "/logos/england/premier-league/newcastle.png",
          },
          {
            id: "nottingham-forest",
            name: "Nottingham Forest",
            logoUrl: "/logos/england/premier-league/nottingham-forest.png",
          },
          {
            id: "sunderland",
            name: "Sunderland",
            logoUrl: "/logos/england/premier-league/sunderland.png",
          },
          {
            id: "tottenham-hotspur",
            name: "Tottenham Hotspur",
            logoUrl: "/logos/england/premier-league/tottenham.png",
          },
          {
            id: "west-ham-united",
            name: "West Ham United",
            logoUrl: "/logos/england/premier-league/west-ham.png",
          },
          {
            id: "wolverhampton-wanderers",
            name: "Wolverhampton Wanderers",
            logoUrl: "/logos/england/premier-league/wolves.png",
          },
        ],
      },
    ],
  },

  {
    id: "spain",
    name: "Spain",
    logoUrl: "/logos/countries/spain.png",
    competitions: [
      {
        id: "la-liga",
        name: "La Liga",
        logoUrl: "/logos/spain/la-liga/la-liga.png",
        clubs: [],
      },
      {
        id: "segunda-division",
        name: "Segunda División",
        logoUrl: "/logos/spain/segunda-division/segunda-division.png",
        clubs: [],
      },
    ],
  },

  {
    id: "sweden",
    name: "Sweden",
    logoUrl: "/logos/countries/sweden.png",
    competitions: [
      {
        id: "allsvenskan",
        name: "Allsvenskan",
        logoUrl: "/logos/sweden/allsvenskan/allsvenskan.png",
        clubs: [],
      },
    ],
  },
];

function norm(v: string) {
  return v.trim().toLowerCase();
}

export function getCountryById(countryId: string) {
  return clubDatabase.find((country) => country.id === countryId);
}

export function getCompetitionByIds(countryId: string, competitionId: string) {
  return getCountryById(countryId)?.competitions.find(
    (competition) => competition.id === competitionId
  );
}

export function getClubByIds(
  countryId: string,
  competitionId: string,
  clubId: string
) {
  return getCompetitionByIds(countryId, competitionId)?.clubs.find(
    (club) => club.id === clubId
  );
}

export function findClubInDatabaseByName(name: string) {
  const input = norm(name);

  for (const country of clubDatabase) {
    for (const competition of country.competitions) {
      for (const club of competition.clubs) {
        if (norm(club.name) === input) {
          return { country, competition, club };
        }
        if (club.aliases?.some((alias) => norm(alias) === input)) {
          return { country, competition, club };
        }
      }
    }
  }

  return null;
}