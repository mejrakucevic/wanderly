import { CONTINENTS, CONTINENT_IDS, type ContinentId } from '@/constants/continents';

/** English names for the 195 countries in `continents.ts` (ISO 3166-1 alpha-2 codes). */
export const COUNTRY_NAMES: Record<string, string> = {
  AD: 'Andorra', AE: 'United Arab Emirates', AF: 'Afghanistan', AG: 'Antigua and Barbuda', AL: 'Albania',
  AM: 'Armenia', AO: 'Angola', AR: 'Argentina', AT: 'Austria', AU: 'Australia', AZ: 'Azerbaijan',
  BA: 'Bosnia and Herzegovina', BB: 'Barbados', BD: 'Bangladesh', BE: 'Belgium', BF: 'Burkina Faso',
  BG: 'Bulgaria', BH: 'Bahrain', BI: 'Burundi', BJ: 'Benin', BN: 'Brunei', BO: 'Bolivia', BR: 'Brazil',
  BS: 'Bahamas', BT: 'Bhutan', BW: 'Botswana', BY: 'Belarus', BZ: 'Belize', CA: 'Canada',
  CD: 'DR Congo', CF: 'Central African Republic', CG: 'Republic of the Congo', CH: 'Switzerland',
  CI: 'Côte d’Ivoire', CL: 'Chile', CM: 'Cameroon', CN: 'China', CO: 'Colombia', CR: 'Costa Rica',
  CU: 'Cuba', CV: 'Cape Verde', CY: 'Cyprus', CZ: 'Czechia', DE: 'Germany', DJ: 'Djibouti',
  DK: 'Denmark', DM: 'Dominica', DO: 'Dominican Republic', DZ: 'Algeria', EC: 'Ecuador', EE: 'Estonia',
  EG: 'Egypt', ER: 'Eritrea', ES: 'Spain', ET: 'Ethiopia', FI: 'Finland', FJ: 'Fiji', FM: 'Micronesia',
  FR: 'France', GA: 'Gabon', GB: 'United Kingdom', GD: 'Grenada', GE: 'Georgia', GH: 'Ghana',
  GM: 'Gambia', GN: 'Guinea', GQ: 'Equatorial Guinea', GR: 'Greece', GT: 'Guatemala',
  GW: 'Guinea-Bissau', GY: 'Guyana', HN: 'Honduras', HR: 'Croatia', HT: 'Haiti', HU: 'Hungary',
  ID: 'Indonesia', IE: 'Ireland', IL: 'Israel', IN: 'India', IQ: 'Iraq', IR: 'Iran', IS: 'Iceland',
  IT: 'Italy', JM: 'Jamaica', JO: 'Jordan', JP: 'Japan', KE: 'Kenya', KG: 'Kyrgyzstan', KH: 'Cambodia',
  KI: 'Kiribati', KM: 'Comoros', KN: 'Saint Kitts and Nevis', KP: 'North Korea', KR: 'South Korea',
  KW: 'Kuwait', KZ: 'Kazakhstan', LA: 'Laos', LB: 'Lebanon', LC: 'Saint Lucia', LI: 'Liechtenstein',
  LK: 'Sri Lanka', LR: 'Liberia', LS: 'Lesotho', LT: 'Lithuania', LU: 'Luxembourg', LV: 'Latvia',
  LY: 'Libya', MA: 'Morocco', MC: 'Monaco', MD: 'Moldova', ME: 'Montenegro', MG: 'Madagascar',
  MH: 'Marshall Islands', MK: 'North Macedonia', ML: 'Mali', MM: 'Myanmar', MN: 'Mongolia',
  MR: 'Mauritania', MT: 'Malta', MU: 'Mauritius', MV: 'Maldives', MW: 'Malawi', MX: 'Mexico',
  MY: 'Malaysia', MZ: 'Mozambique', NA: 'Namibia', NE: 'Niger', NG: 'Nigeria', NI: 'Nicaragua',
  NL: 'Netherlands', NO: 'Norway', NP: 'Nepal', NR: 'Nauru', NZ: 'New Zealand', OM: 'Oman',
  PA: 'Panama', PE: 'Peru', PG: 'Papua New Guinea', PH: 'Philippines', PK: 'Pakistan', PL: 'Poland',
  PS: 'Palestine', PT: 'Portugal', PW: 'Palau', PY: 'Paraguay', QA: 'Qatar', RO: 'Romania',
  RS: 'Serbia', RU: 'Russia', RW: 'Rwanda', SA: 'Saudi Arabia', SB: 'Solomon Islands',
  SC: 'Seychelles', SD: 'Sudan', SE: 'Sweden', SG: 'Singapore', SI: 'Slovenia', SK: 'Slovakia',
  SL: 'Sierra Leone', SM: 'San Marino', SN: 'Senegal', SO: 'Somalia', SR: 'Suriname',
  SS: 'South Sudan', ST: 'São Tomé and Príncipe', SV: 'El Salvador', SY: 'Syria', SZ: 'Eswatini',
  TD: 'Chad', TG: 'Togo', TH: 'Thailand', TJ: 'Tajikistan', TL: 'Timor-Leste', TM: 'Turkmenistan',
  TN: 'Tunisia', TO: 'Tonga', TR: 'Türkiye', TT: 'Trinidad and Tobago', TV: 'Tuvalu', TZ: 'Tanzania',
  UA: 'Ukraine', UG: 'Uganda', US: 'United States', UY: 'Uruguay', UZ: 'Uzbekistan', VA: 'Vatican City',
  VC: 'Saint Vincent and the Grenadines', VE: 'Venezuela', VN: 'Vietnam', VU: 'Vanuatu', WS: 'Samoa',
  YE: 'Yemen', ZA: 'South Africa', ZM: 'Zambia', ZW: 'Zimbabwe',
};

export type CountryOption = { code: string; name: string; continent: ContinentId };

/** All countries, sorted by name. */
export const ALL_COUNTRIES: CountryOption[] = CONTINENT_IDS
  .flatMap((continent) => CONTINENTS[continent].countries.map((code) => ({ code, name: COUNTRY_NAMES[code] ?? code, continent })))
  .sort((a, b) => a.name.localeCompare(b.name));

export function countryName(code: string) {
  return COUNTRY_NAMES[code.toUpperCase()] ?? code.toUpperCase();
}

/** Flag emoji built from the two regional-indicator letters, e.g. "BA" → 🇧🇦. */
export function countryFlag(code: string) {
  return String.fromCodePoint(...[...code.toUpperCase()].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65));
}

/** Map pin position for each country: its capital, as [latitude, longitude]. */
const CAPITALS: Record<string, [number, number]> = {
  AD: [42.51, 1.52], AE: [24.45, 54.38], AF: [34.53, 69.17], AG: [17.12, -61.85], AL: [41.33, 19.82],
  AM: [40.18, 44.51], AO: [-8.84, 13.23], AR: [-34.6, -58.38], AT: [48.21, 16.37], AU: [-35.28, 149.13],
  AZ: [40.41, 49.87], BA: [43.86, 18.41], BB: [13.1, -59.62], BD: [23.81, 90.41], BE: [50.85, 4.35],
  BF: [12.37, -1.52], BG: [42.7, 23.32], BH: [26.23, 50.59], BI: [-3.43, 29.93], BJ: [6.5, 2.6],
  BN: [4.9, 114.94], BO: [-16.49, -68.12], BR: [-15.79, -47.88], BS: [25.05, -77.35], BT: [27.47, 89.64],
  BW: [-24.65, 25.91], BY: [53.9, 27.56], BZ: [17.25, -88.77], CA: [45.42, -75.7], CD: [-4.44, 15.27],
  CF: [4.39, 18.56], CG: [-4.26, 15.24], CH: [46.95, 7.45], CI: [6.83, -5.29], CL: [-33.45, -70.67],
  CM: [3.85, 11.5], CN: [39.9, 116.4], CO: [4.71, -74.07], CR: [9.93, -84.08], CU: [23.11, -82.37],
  CV: [14.93, -23.51], CY: [35.19, 33.38], CZ: [50.08, 14.44], DE: [52.52, 13.4], DJ: [11.59, 43.15],
  DK: [55.68, 12.57], DM: [15.3, -61.39], DO: [18.49, -69.93], DZ: [36.75, 3.06], EC: [-0.18, -78.47],
  EE: [59.44, 24.75], EG: [30.04, 31.24], ER: [15.32, 38.93], ES: [40.42, -3.7], ET: [9.03, 38.74],
  FI: [60.17, 24.94], FJ: [-18.14, 178.44], FM: [6.92, 158.16], FR: [48.86, 2.35], GA: [0.42, 9.47],
  GB: [51.51, -0.13], GD: [12.06, -61.75], GE: [41.72, 44.79], GH: [5.6, -0.19], GM: [13.45, -16.58],
  GN: [9.64, -13.58], GQ: [3.75, 8.78], GR: [37.98, 23.73], GT: [14.63, -90.51], GW: [11.86, -15.6],
  GY: [6.8, -58.16], HN: [14.07, -87.19], HR: [45.81, 15.98], HT: [18.59, -72.31], HU: [47.5, 19.04],
  ID: [-6.21, 106.85], IE: [53.35, -6.26], IL: [31.77, 35.21], IN: [28.61, 77.21], IQ: [33.31, 44.36],
  IR: [35.69, 51.39], IS: [64.15, -21.94], IT: [41.9, 12.5], JM: [18.02, -76.8], JO: [31.95, 35.93],
  JP: [35.68, 139.69], KE: [-1.29, 36.82], KG: [42.87, 74.59], KH: [11.56, 104.92], KI: [1.33, 172.98],
  KM: [-11.7, 43.26], KN: [17.3, -62.72], KP: [39.04, 125.76], KR: [37.57, 126.98], KW: [29.38, 47.99],
  KZ: [51.17, 71.45], LA: [17.98, 102.63], LB: [33.89, 35.5], LC: [14.01, -60.99], LI: [47.14, 9.52],
  LK: [6.93, 79.86], LR: [6.3, -10.8], LS: [-29.31, 27.48], LT: [54.69, 25.28], LU: [49.61, 6.13],
  LV: [56.95, 24.11], LY: [32.89, 13.19], MA: [34.02, -6.83], MC: [43.74, 7.42], MD: [47.01, 28.86],
  ME: [42.44, 19.26], MG: [-18.88, 47.51], MH: [7.09, 171.38], MK: [42.0, 21.43], ML: [12.64, -8.0],
  MM: [19.76, 96.08], MN: [47.89, 106.91], MR: [18.08, -15.98], MT: [35.9, 14.51], MU: [-20.16, 57.5],
  MV: [4.18, 73.51], MW: [-13.96, 33.79], MX: [19.43, -99.13], MY: [3.14, 101.69], MZ: [-25.97, 32.57],
  NA: [-22.56, 17.08], NE: [13.51, 2.11], NG: [9.08, 7.4], NI: [12.11, -86.24], NL: [52.37, 4.9],
  NO: [59.91, 10.75], NP: [27.72, 85.32], NR: [-0.55, 166.92], NZ: [-41.29, 174.78], OM: [23.59, 58.41],
  PA: [8.98, -79.52], PE: [-12.05, -77.04], PG: [-9.44, 147.18], PH: [14.6, 120.98], PK: [33.68, 73.05],
  PL: [52.23, 21.01], PS: [31.9, 35.2], PT: [38.72, -9.14], PW: [7.5, 134.62], PY: [-25.26, -57.58],
  QA: [25.29, 51.53], RO: [44.43, 26.1], RS: [44.79, 20.45], RU: [55.76, 37.62], RW: [-1.94, 30.06],
  SA: [24.71, 46.68], SB: [-9.43, 159.95], SC: [-4.62, 55.45], SD: [15.5, 32.56], SE: [59.33, 18.07],
  SG: [1.35, 103.82], SI: [46.06, 14.51], SK: [48.15, 17.11], SL: [8.48, -13.23], SM: [43.94, 12.45],
  SN: [14.72, -17.47], SO: [2.05, 45.32], SR: [5.85, -55.2], SS: [4.85, 31.58], ST: [0.34, 6.73],
  SV: [13.69, -89.22], SY: [33.51, 36.28], SZ: [-26.31, 31.14], TD: [12.13, 15.06], TG: [6.13, 1.22],
  TH: [13.76, 100.5], TJ: [38.56, 68.79], TL: [-8.56, 125.57], TM: [37.96, 58.33], TN: [36.81, 10.18],
  TO: [-21.14, -175.2], TR: [39.93, 32.86], TT: [10.66, -61.51], TV: [-8.52, 179.2], TZ: [-6.16, 35.75],
  UA: [50.45, 30.52], UG: [0.35, 32.58], US: [38.91, -77.04], UY: [-34.9, -56.16], UZ: [41.3, 69.24],
  VA: [41.9, 12.45], VC: [13.16, -61.23], VE: [10.49, -66.88], VN: [21.03, 105.85], VU: [-17.73, 168.32],
  WS: [-13.83, -171.76], YE: [15.37, 44.19], ZA: [-25.75, 28.19], ZM: [-15.39, 28.32], ZW: [-17.83, 31.05],
};

export function countryPosition(code: string): { latitude: number; longitude: number } | null {
  const position = CAPITALS[code.toUpperCase()];
  return position ? { latitude: position[0], longitude: position[1] } : null;
}
