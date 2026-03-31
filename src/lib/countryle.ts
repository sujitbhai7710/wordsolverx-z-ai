import countriesSource from '$lib/data/countryle/countries.json';
import { decryptCountryId } from '$lib/countryle-crypto';

export interface Country {
  id: number;
  country: string;
  continent: string;
  percentOfRenewableE: number;
  co2Total: number;
  coastlineLength: number;
  maxAltitude: number;
  population: number;
  avgTemperature: number;
  surface: number;
  density: number;
  PIB: number;
  rankingFifa: number;
  footballMatches: number;
  coordinates: string;
  hemisphere: string;
  mapsUrl: string;
}

export interface CountriesData {
  updatedDate: string;
  countries: Country[];
}

export interface CountryleDailyAnswer {
  dateKey: string;
  displayDate: string;
  gameNumber: number | null;
  country: Country;
}

export type ComparisonResult = 'EQUAL' | 'MORE' | 'LESS' | 'LITTLE_MORE' | 'LITTLE_LESS';

export interface GameClue {
  property: string;
  guessValue: string | number;
  answerValue: string | number;
  result: string;
  isCorrect: boolean;
}

const countriesData = parseCountriesData();

function parseCountriesData(): CountriesData {
  const rawPayload = typeof countriesSource === 'string' ? countriesSource : JSON.stringify(countriesSource);
  const decoded = rawPayload.startsWith('"') ? JSON.parse(rawPayload) : rawPayload;
  return JSON.parse(decoded) as CountriesData;
}

function formatCountryleDisplayDate(dateKey: string): string {
  return new Date(`${dateKey}T12:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
}

function toCountryleApiDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-');
  return `${day}/${month}/${year}`;
}

export function getCountriesData(): CountriesData {
  return countriesData;
}

export function getCountryById(id: number): Country | undefined {
  return countriesData.countries.find((country) => country.id === id);
}

export function getCountryByName(name: string): Country | undefined {
  const normalized = name.trim().toLowerCase();
  return countriesData.countries.find((country) => country.country.toLowerCase() === normalized);
}

export function getAllCountries(): Country[] {
  return countriesData.countries;
}

export async function fetchCountryleAnswerForDateKey(dateKey: string): Promise<CountryleDailyAnswer | null> {
  const response = await fetch(
    `https://www.countryle.com/hidden-api/get-daily-country-valid.php?date=${encodeURIComponent(toCountryleApiDate(dateKey))}`,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 WordSolverX'
      }
    }
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { country?: string; id?: string; number?: number };
  const encryptedId = payload.country ?? payload.id;
  if (!encryptedId) {
    return null;
  }

  const countryId = decryptCountryId(encryptedId);
  const country = getCountryById(countryId);
  if (!country) {
    return null;
  }

  return {
    dateKey,
    displayDate: formatCountryleDisplayDate(dateKey),
    gameNumber: typeof payload.number === 'number' ? payload.number : null,
    country
  };
}

export async function fetchRecentCountryleAnswers(limit: number, endDateKey: string): Promise<CountryleDailyAnswer[]> {
  const results: CountryleDailyAnswer[] = [];

  for (let offset = 0; offset < limit; offset += 1) {
    const date = new Date(`${endDateKey}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() - offset);
    const dateKey = date.toISOString().split('T')[0];
    const answer = await fetchCountryleAnswerForDateKey(dateKey);
    if (answer) {
      results.push(answer);
    }
  }

  return results;
}

export function parseCoordinates(coords: string): { lat: number; lng: number } {
  const parts = coords.split(',').map((part) => parseFloat(part.trim()));
  return { lat: parts[0], lng: parts[1] };
}

export function compareValues(guessValue: number, answerValue: number, threshold: number = 0.1): ComparisonResult {
  const diff = guessValue - answerValue;
  const percentageDiff = Math.abs(diff / answerValue);

  if (percentageDiff < 0.01) {
    return 'EQUAL';
  }

  if (diff > 0) {
    return percentageDiff <= threshold ? 'LITTLE_MORE' : 'MORE';
  }

  return percentageDiff <= threshold ? 'LITTLE_LESS' : 'LESS';
}

export function getDirection(guessCoords: { lat: number; lng: number }, answerCoords: { lat: number; lng: number }): string {
  const directions: string[] = [];

  if (Math.abs(guessCoords.lat - answerCoords.lat) >= 5) {
    directions.push(guessCoords.lat > answerCoords.lat ? 'South' : 'North');
  }

  if (Math.abs(guessCoords.lng - answerCoords.lng) >= 5) {
    directions.push(guessCoords.lng > answerCoords.lng ? 'West' : 'East');
  }

  return directions.length === 0 ? 'Same location area' : `Go ${directions.join('')}`;
}

export function generateClues(guess: Country, answer: Country): GameClue[] {
  const clues: GameClue[] = [];

  clues.push({
    property: 'Continent',
    guessValue: guess.continent,
    answerValue: answer.continent,
    result: guess.continent === answer.continent ? 'Correct!' : 'Different',
    isCorrect: guess.continent === answer.continent
  });

  clues.push({
    property: 'Hemisphere',
    guessValue: guess.hemisphere,
    answerValue: answer.hemisphere,
    result: guess.hemisphere === answer.hemisphere ? 'Correct!' : 'Different',
    isCorrect: guess.hemisphere === answer.hemisphere
  });

  const populationComparison = compareValues(guess.population, answer.population);
  clues.push({
    property: 'Population',
    guessValue: guess.population.toLocaleString(),
    answerValue: answer.population.toLocaleString(),
    result: populationComparison === 'EQUAL' ? 'Correct!' : `Answer is ${populationComparison.toLowerCase().replace('_', ' ')}`,
    isCorrect: populationComparison === 'EQUAL'
  });

  const surfaceComparison = compareValues(guess.surface, answer.surface);
  clues.push({
    property: 'Surface Area',
    guessValue: `${guess.surface.toLocaleString()} km²`,
    answerValue: `${answer.surface.toLocaleString()} km²`,
    result: surfaceComparison === 'EQUAL' ? 'Correct!' : `Answer is ${surfaceComparison.toLowerCase().replace('_', ' ')}`,
    isCorrect: surfaceComparison === 'EQUAL'
  });

  const temperatureComparison = compareValues(guess.avgTemperature, answer.avgTemperature, 0.15);
  clues.push({
    property: 'Temperature',
    guessValue: `${guess.avgTemperature.toFixed(1)}°C`,
    answerValue: `${answer.avgTemperature.toFixed(1)}°C`,
    result: temperatureComparison === 'EQUAL' ? 'Correct!' : `Answer is ${temperatureComparison.toLowerCase().replace('_', ' ')}`,
    isCorrect: temperatureComparison === 'EQUAL'
  });

  const direction = getDirection(parseCoordinates(guess.coordinates), parseCoordinates(answer.coordinates));
  clues.push({
    property: 'Direction',
    guessValue: guess.coordinates,
    answerValue: direction,
    result: direction,
    isCorrect: direction === 'Same location area'
  });

  return clues;
}

export function filterPossibleCountries(guesses: Array<{ guess: Country; clues: GameClue[] }>, allCountries: Country[]): Country[] {
  if (guesses.length === 0) {
    return allCountries;
  }

  return allCountries.filter((country) => {
    return guesses.every(({ guess, clues }) => {
      for (const clue of clues) {
        if (!clue.isCorrect) {
          continue;
        }

        if (clue.property === 'Continent' && country.continent !== guess.continent) {
          return false;
        }

        if (clue.property === 'Hemisphere' && country.hemisphere !== guess.hemisphere) {
          return false;
        }
      }

      return true;
    });
  });
}
