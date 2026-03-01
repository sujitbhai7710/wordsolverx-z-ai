export interface Artist {
  name: string;
  debut: number;
  popularity: number;
  members: 'Solo' | 'Group';
  genre: 'Pop' | 'Hip Hop' | 'R&B' | 'Indie' | 'Rock';
  country: string;
  gender: 'Male' | 'Female' | 'Mixed';
}

export type FeedbackType = 'correct' | 'close' | 'wrong' | 'earlier' | 'later' | 'higher' | 'lower';

export interface AttributeFeedback {
  debut: FeedbackType;
  popularity: FeedbackType;
  members: FeedbackType;
  genre: FeedbackType;
  country: FeedbackType;
  gender: FeedbackType;
}

export interface Guess {
  artist: Artist;
  feedback: AttributeFeedback;
}

export interface ContinentMap {
  [key: string]: string;
}

export const CONTINENTS: ContinentMap = {
  // North America
  US: 'North America',
  CA: 'North America',
  MX: 'North America',
  
  // South America
  BR: 'South America',
  AR: 'South America',
  CO: 'South America',
  CL: 'South America',
  PE: 'South America',
  VE: 'South America',
  
  // Europe
  GB: 'Europe',
  UK: 'Europe',
  DE: 'Europe',
  FR: 'Europe',
  IT: 'Europe',
  ES: 'Europe',
  NL: 'Europe',
  BE: 'Europe',
  SE: 'Europe',
  NO: 'Europe',
  DK: 'Europe',
  IE: 'Europe',
  PL: 'Europe',
  RU: 'Europe',
  UA: 'Europe',
  TR: 'Europe',
  
  // Asia
  JP: 'Asia',
  KR: 'Asia',
  CN: 'Asia',
  IN: 'Asia',
  ID: 'Asia',
  PH: 'Asia',
  TH: 'Asia',
  VN: 'Asia',
  PK: 'Asia',
  
  // Africa
  NG: 'Africa',
  ZA: 'Africa',
  EG: 'Africa',
  TZ: 'Africa',
  MA: 'Africa',
  
  // Oceania
  AU: 'Oceania',
  NZ: 'Oceania',
  
  // Caribbean
  BB: 'Caribbean',
  
  // Middle East
  IL: 'Middle East',
  
  // Central America
  AM: 'Central America',
  
  // Other
  IS: 'Europe',
  UZ: 'Asia',
};

export const GENRES = ['Pop', 'Hip Hop', 'R&B', 'Indie', 'Rock'] as const;
export const MEMBERS_TYPES = ['Solo', 'Group'] as const;
export const GENDERS = ['Male', 'Female', 'Mixed'] as const;

export const DEBUT_CLOSE_THRESHOLD = 5;
export const POPULARITY_CLOSE_THRESHOLD = 50;
