import countriesPayload from '$lib/data/countryle/countries.json';

export interface CountryData {
  id: number;
  country: string;
  continent: string;
  hemisphere: string;
  population: number;
  surface: number;
  avgTemperature: number;
  coordinates: string;
  percentOfRenewableE?: number;
  co2Total?: number;
  coastlineLength?: number;
  maxAltitude?: number;
  PIB?: number;
  rankingFifa?: number;
  footballMatches?: number;
  mapsUrl?: string;
  density?: number;
}

export type DiffType = 'LESS' | 'LITTLE_LESS' | 'EQUAL' | 'LITTLE_MORE' | 'MORE' | 'DIFFERENT';
export type DirectionType = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW' | 'EQUAL';

export interface CountryHint {
  id: string;
  country: CountryData;
  hemisphereDiff: DiffType;
  continentHit: boolean;
  avgTemperatureDiff: DiffType;
  populationDiff: DiffType;
  coordinatesDiff: DirectionType;
}

interface CountriesPayload {
  updatedDate?: string;
  countries: CountryData[];
}

const countriesData = countriesPayload as CountriesPayload;

export const directionLabels: Record<DirectionType, string> = {
  N: 'N',
  NE: 'NE',
  E: 'E',
  SE: 'SE',
  S: 'S',
  SW: 'SW',
  W: 'W',
  NW: 'NW',
  EQUAL: 'Exact'
};

export const directionOptions: DirectionType[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export function getAllCountries(): CountryData[] {
  return [...(countriesData.countries ?? [])].sort((left, right) =>
    left.country.localeCompare(right.country)
  );
}

export function getCountryById(id: number): CountryData | null {
  return countriesData.countries.find((country) => country.id === id) ?? null;
}

export function getCountryByName(name: string): CountryData | null {
  return (
    countriesData.countries.find(
      (country) => country.country.toLowerCase() === name.trim().toLowerCase()
    ) ?? null
  );
}

export function getTemperatureDiff(guessedTemp: number, targetTemp: number): DiffType {
  const diff = guessedTemp - targetTemp;
  if (diff > 3) return 'LESS';
  if (diff > 1) return 'LITTLE_LESS';
  if (-diff > 3) return 'MORE';
  if (-diff > 1) return 'LITTLE_MORE';
  return 'EQUAL';
}

export function getPopulationDiff(guessedPop: number, targetPop: number): DiffType {
  const closeThreshold = 5;
  const farThreshold = 15;
  const lowerClose = targetPop * (1 - closeThreshold / 100);
  const upperClose = targetPop * (1 + closeThreshold / 100);
  const lowerFar = targetPop * (1 - farThreshold / 100);
  const upperFar = targetPop * (1 + farThreshold / 100);

  if (guessedPop > upperFar) return 'LESS';
  if (guessedPop > upperClose) return 'LITTLE_LESS';
  if (guessedPop < lowerFar) return 'MORE';
  if (guessedPop < lowerClose) return 'LITTLE_MORE';
  return 'EQUAL';
}

export function getHemisphereDiff(guessed: string, target: string): DiffType {
  return guessed === target ? 'EQUAL' : 'DIFFERENT';
}

export function getContinentHit(guessed: string, target: string): boolean {
  return guessed === target;
}

export function getRhumbLineBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const dPhi = Math.log(Math.tan(Math.PI / 4 + lat2Rad / 2) / Math.tan(Math.PI / 4 + lat1Rad / 2));
  let bearing = (Math.atan2(dLon, dPhi) * 180) / Math.PI;
  bearing = (bearing + 360) % 360;
  return bearing;
}

export function getDirectionFromBearing(bearing: number, sameCoords = false): DirectionType {
  if (sameCoords) return 'EQUAL';
  if (bearing >= 337.5 || bearing < 22.5) return 'N';
  if (bearing >= 22.5 && bearing < 67.5) return 'NE';
  if (bearing >= 67.5 && bearing < 112.5) return 'E';
  if (bearing >= 112.5 && bearing < 157.5) return 'SE';
  if (bearing >= 157.5 && bearing < 202.5) return 'S';
  if (bearing >= 202.5 && bearing < 247.5) return 'SW';
  if (bearing >= 247.5 && bearing < 292.5) return 'W';
  if (bearing >= 292.5 && bearing < 337.5) return 'NW';
  return 'EQUAL';
}

export function calculateDirection(coord1: string, coord2: string): DirectionType {
  const [lat1, lon1] = coord1.split(',').map(Number);
  const [lat2, lon2] = coord2.split(',').map(Number);

  if (lat1 === lat2 && lon1 === lon2) return 'EQUAL';

  return getDirectionFromBearing(getRhumbLineBearing(lat1, lon1, lat2, lon2));
}

export function filterCountriesByHints(
  allCountries: CountryData[],
  hints: CountryHint[]
): { country: CountryData; score: number }[] {
  if (hints.length === 0) {
    return allCountries.map((country) => ({ country, score: 0 }));
  }

  const results: { country: CountryData; score: number }[] = [];

  for (const candidate of allCountries) {
    let totalScore = 0;
    let matchesAll = true;

    for (const hint of hints) {
      let hintScore = 0;

      if (getHemisphereDiff(hint.country.hemisphere, candidate.hemisphere) !== hint.hemisphereDiff) {
        matchesAll = false;
        break;
      }
      hintScore += 20;

      if (getContinentHit(hint.country.continent, candidate.continent) !== hint.continentHit) {
        matchesAll = false;
        break;
      }
      hintScore += 20;

      if (
        getTemperatureDiff(hint.country.avgTemperature, candidate.avgTemperature) !==
        hint.avgTemperatureDiff
      ) {
        matchesAll = false;
        break;
      }
      hintScore += 20;

      if (getPopulationDiff(hint.country.population, candidate.population) !== hint.populationDiff) {
        matchesAll = false;
        break;
      }
      hintScore += 20;

      const expectedDirection = calculateDirection(hint.country.coordinates, candidate.coordinates);
      const directions: DirectionType[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      const selectedIndex = directions.indexOf(hint.coordinatesDiff);
      const actualIndex = directions.indexOf(expectedDirection);
      const directionDiff = Math.min(
        Math.abs(selectedIndex - actualIndex),
        8 - Math.abs(selectedIndex - actualIndex)
      );

      if (directionDiff > 1) {
        matchesAll = false;
        break;
      }

      hintScore += directionDiff === 0 ? 20 : 10;
      totalScore += hintScore;
    }

    if (matchesAll) {
      results.push({ country: candidate, score: totalScore / hints.length });
    }
  }

  return results.sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    return left.country.country.localeCompare(right.country.country);
  });
}

export function formatPopulation(value: number): string {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return String(value);
}

export function formatTemperature(value: number): string {
  return `${value.toFixed(1)}°C`;
}
