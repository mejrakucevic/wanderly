/**
 * Countries per continent: the 193 UN member states plus the two observer states
 * (Vatican City, Palestine) = 195. Transcontinental countries are counted once:
 * Russia in Europe; Turkey, Cyprus, Georgia, Armenia, Azerbaijan and Kazakhstan in Asia.
 * Codes are ISO 3166-1 alpha-2, matching `locations.country_code`.
 */
export const CONTINENTS = {
  europe: {
    name: 'Europe',
    countries: ['AL', 'AD', 'AT', 'BY', 'BE', 'BA', 'BG', 'HR', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'RU', 'SM', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'UA', 'GB', 'VA'],
  },
  asia: {
    name: 'Asia',
    countries: ['AF', 'AM', 'AZ', 'BH', 'BD', 'BT', 'BN', 'KH', 'CN', 'CY', 'GE', 'IN', 'ID', 'IR', 'IQ', 'IL', 'JP', 'JO', 'KZ', 'KW', 'KG', 'LA', 'LB', 'MY', 'MV', 'MN', 'MM', 'NP', 'KP', 'OM', 'PK', 'PS', 'PH', 'QA', 'SA', 'SG', 'KR', 'LK', 'SY', 'TJ', 'TH', 'TL', 'TR', 'TM', 'AE', 'UZ', 'VN', 'YE'],
  },
  africa: {
    name: 'Africa',
    countries: ['DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN', 'UG', 'ZM', 'ZW'],
  },
  northAmerica: {
    name: 'North America',
    countries: ['AG', 'BS', 'BB', 'BZ', 'CA', 'CR', 'CU', 'DM', 'DO', 'SV', 'GD', 'GT', 'HT', 'HN', 'JM', 'MX', 'NI', 'PA', 'KN', 'LC', 'VC', 'TT', 'US'],
  },
  southAmerica: {
    name: 'South America',
    countries: ['AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'GY', 'PY', 'PE', 'SR', 'UY', 'VE'],
  },
  oceania: {
    name: 'Oceania',
    countries: ['AU', 'FJ', 'KI', 'MH', 'FM', 'NR', 'NZ', 'PW', 'PG', 'WS', 'SB', 'TO', 'TV', 'VU'],
  },
} as const;

export type ContinentId = keyof typeof CONTINENTS;
export const CONTINENT_IDS = Object.keys(CONTINENTS) as ContinentId[];
export const WORLD_COUNTRY_COUNT = CONTINENT_IDS.reduce((sum, id) => sum + CONTINENTS[id].countries.length, 0);

const byCountry = new Map<string, ContinentId>(
  CONTINENT_IDS.flatMap((id) => CONTINENTS[id].countries.map((code) => [code, id] as const)),
);

export function continentOf(countryCode: string | null | undefined): ContinentId | null {
  return countryCode ? byCountry.get(countryCode.toUpperCase()) ?? null : null;
}

export type ContinentProgress = { id: ContinentId; name: string; visited: number; total: number; percent: number };

/** Visited/total per continent for a set of visited ISO country codes. */
export function continentProgress(visitedCodes: Iterable<string>): Record<ContinentId, ContinentProgress> {
  const visited = new Set([...visitedCodes].map((code) => code.toUpperCase()));
  return Object.fromEntries(CONTINENT_IDS.map((id) => {
    const { name, countries } = CONTINENTS[id];
    const count = countries.filter((code) => visited.has(code)).length;
    return [id, { id, name, visited: count, total: countries.length, percent: Math.round((count / countries.length) * 100) }];
  })) as Record<ContinentId, ContinentProgress>;
}
