export interface WorldleCountry {
  code: string;
  name: string;
  longitude: number;
  latitude: number;
  names: Record<string, string>;
}

export interface WorldleCity {
  countryCode: string;
  population: number;
  sourceLink: string;
  names: Record<string, string>;
  capital: boolean;
  index: number;
  flag?: string;
  images?: Array<{
    imageCode: number;
    sourceLink: string;
  }>;
}

export interface WorldleCountryDetails {
  neighbors: string[];
  population: number;
  area: number;
  gdpPerCapita: number;
  currency: string;
  languages: string[];
  continent: string;
}

export type WorldleCountryDetailsMap = Record<string, WorldleCountryDetails>;

export type WorldleDirection = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

export interface WorldleAnswer {
  date: string;
  worldleNumber: number;
  country: WorldleCountry;
  capital?: WorldleCity;
  details?: WorldleCountryDetails;
}

export interface WorldleSolverHint {
  country: WorldleCountry;
  distance: number;
  direction: WorldleDirection;
  proximity?: number;
}

export interface WorldleSolverResult {
  country: WorldleCountry;
  matchScore: number;
  averageDistance: number;
}
