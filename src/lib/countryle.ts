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

export type ComparisonResult = 'EQUAL' | 'MORE' | 'LESS' | 'LITTLE_MORE' | 'LITTLE_LESS';

export interface GameClue {
  property: string;
  guessValue: string | number;
  answerValue: string | number;
  result: string;
  isCorrect: boolean;
}

export function parseCoordinates(coords: string): { lat: number; lng: number } {
  const parts = coords.split(',').map(p => parseFloat(p.trim()));
  return { lat: parts[0], lng: parts[1] };
}

export function compareValues(guessValue: number, answerValue: number, threshold: number = 0.1): ComparisonResult {
  const diff = guessValue - answerValue;
  const percentageDiff = Math.abs(diff / answerValue);

  if (percentageDiff < 0.01) {
    return 'EQUAL';
  }

  if (diff > 0) {
    if (percentageDiff <= threshold) {
      return 'LITTLE_MORE';
    }
    return 'MORE';
  } else {
    if (percentageDiff <= threshold) {
      return 'LITTLE_LESS';
    }
    return 'LESS';
  }
}

export function getDirection(guessCoords: { lat: number; lng: number }, answerCoords: { lat: number; lng: number }): string {
  const directions: string[] = [];

  if (Math.abs(guessCoords.lat - answerCoords.lat) < 5) {
    // Same latitude region
  } else if (guessCoords.lat > answerCoords.lat) {
    directions.push('South');
  } else {
    directions.push('North');
  }

  if (Math.abs(guessCoords.lng - answerCoords.lng) < 5) {
    // Same longitude region
  } else if (guessCoords.lng > answerCoords.lng) {
    directions.push('West');
  } else {
    directions.push('East');
  }

  if (directions.length === 0) {
    return 'Same location area';
  }

  return `Go ${directions.join('')}`;
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

  const popComparison = compareValues(guess.population, answer.population);
  clues.push({
    property: 'Population',
    guessValue: guess.population.toLocaleString(),
    answerValue: answer.population.toLocaleString(),
    result: popComparison === 'EQUAL' ? 'Correct!' : `Answer is ${popComparison.toLowerCase().replace('_', ' ')}`,
    isCorrect: popComparison === 'EQUAL'
  });

  const surfaceComparison = compareValues(guess.surface, answer.surface);
  clues.push({
    property: 'Surface Area',
    guessValue: `${guess.surface.toLocaleString()} km²`,
    answerValue: `${answer.surface.toLocaleString()} km²`,
    result: surfaceComparison === 'EQUAL' ? 'Correct!' : `Answer is ${surfaceComparison.toLowerCase().replace('_', ' ')}`,
    isCorrect: surfaceComparison === 'EQUAL'
  });

  const tempComparison = compareValues(guess.avgTemperature, answer.avgTemperature, 0.15);
  clues.push({
    property: 'Temperature',
    guessValue: `${guess.avgTemperature.toFixed(1)}°C`,
    answerValue: `${answer.avgTemperature.toFixed(1)}°C`,
    result: tempComparison === 'EQUAL' ? 'Correct!' : `Answer is ${tempComparison.toLowerCase().replace('_', ' ')}`,
    isCorrect: tempComparison === 'EQUAL'
  });

  const guessCoords = parseCoordinates(guess.coordinates);
  const answerCoords = parseCoordinates(answer.coordinates);
  const direction = getDirection(guessCoords, answerCoords);
  clues.push({
    property: 'Direction',
    guessValue: `(${guessCoords.lat.toFixed(2)}, ${guessCoords.lng.toFixed(2)})`,
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

  return allCountries.filter(country => {
    return guesses.every(({ guess, clues }) => {
      for (const clue of clues) {
        if (clue.isCorrect) {
          if (clue.property === 'Continent' && country.continent !== guess.continent) return false;
          if (clue.property === 'Hemisphere' && country.hemisphere !== guess.hemisphere) return false;
        }
      }
      return true;
    });
  });
}
