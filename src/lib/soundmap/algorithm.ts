import firstGuessResultsData from '../data/soundmap-first-guesses.json';
import type { Artist, AttributeFeedback, FeedbackType } from './types';
import { CONTINENTS, DEBUT_CLOSE_THRESHOLD, POPULARITY_CLOSE_THRESHOLD } from './types';

// Re-export types for convenience
export type { Artist, AttributeFeedback, FeedbackType, Guess } from './types';

interface FirstGuessScoreRow {
	name: string;
	twoGuesses: number | null;
	threeGuesses: number | null;
}

export interface FirstGuessRecommendation {
	artist: Artist;
	twoGuesses: number | null;
	threeGuesses: number | null;
}

const rankedFirstGuesses = firstGuessResultsData as FirstGuessScoreRow[];

/**
 * Calculate feedback for a guess compared to the target artist
 */
export function calculateFeedback(guess: Artist, target: Artist): AttributeFeedback {
  return {
    debut: getDebutFeedback(guess.debut, target.debut),
    popularity: getPopularityFeedback(guess.popularity, target.popularity),
    members: guess.members === target.members ? 'correct' : 'wrong',
    genre: guess.genre === target.genre ? 'correct' : 'wrong',
    country: getCountryFeedback(guess.country, target.country),
    gender: guess.gender === target.gender ? 'correct' : 'wrong',
  };
}

function getDebutFeedback(guess: number, target: number): FeedbackType {
  if (guess === target) return 'correct';
  const diff = Math.abs(guess - target);
  if (diff <= DEBUT_CLOSE_THRESHOLD) return 'close';
  return guess > target ? 'later' : 'earlier';
}

function getPopularityFeedback(guess: number, target: number): FeedbackType {
  if (guess === target) return 'correct';
  const diff = Math.abs(guess - target);
  if (diff <= POPULARITY_CLOSE_THRESHOLD) return 'close';
  return guess < target ? 'higher' : 'lower';
}

function getCountryFeedback(guess: string, target: string): FeedbackType {
  if (guess === target) return 'correct';
  const guessContinent = CONTINENTS[guess] || 'Unknown';
  const targetContinent = CONTINENTS[target] || 'Unknown';
  if (guessContinent === targetContinent && guessContinent !== 'Unknown') return 'close';
  return 'wrong';
}

/**
 * Check if an artist matches the given feedback
 */
export function matchesFeedback(artist: Artist, guess: Artist, feedback: AttributeFeedback): boolean {
  const actualFeedback = calculateFeedback(guess, artist);
  return (
    actualFeedback.debut === feedback.debut &&
    actualFeedback.popularity === feedback.popularity &&
    actualFeedback.members === feedback.members &&
    actualFeedback.genre === feedback.genre &&
    actualFeedback.country === feedback.country &&
    actualFeedback.gender === feedback.gender
  );
}

/**
 * Filter candidates based on all guesses
 */
export function filterCandidates(
  allArtists: Artist[],
  guesses: Array<{ artist: Artist; feedback: AttributeFeedback }>
): Artist[] {
  return allArtists.filter(candidate => 
    guesses.every(({ artist, feedback }) => matchesFeedback(candidate, artist, feedback))
  );
}

/**
 * Create a feedback pattern key for grouping
 */
function feedbackToKey(feedback: AttributeFeedback): string {
  return `${feedback.debut}|${feedback.popularity}|${feedback.members}|${feedback.genre}|${feedback.country}|${feedback.gender}`;
}

/**
 * Calculate entropy-based score for a guess
 * Higher score = better guess (eliminates more possibilities on average)
 */
export function calculateGuessScore(guess: Artist, candidates: Artist[]): number {
  if (candidates.length <= 1) return 0;
  
  // Group candidates by feedback pattern
  const feedbackGroups = new Map<string, number>();
  
  for (const target of candidates) {
    const feedback = calculateFeedback(guess, target);
    const key = feedbackToKey(feedback);
    feedbackGroups.set(key, (feedbackGroups.get(key) || 0) + 1);
  }
  
  // Calculate expected information gain (entropy)
  const total = candidates.length;
  let entropy = 0;
  
  for (const count of feedbackGroups.values()) {
    if (count > 0) {
      const probability = count / total;
      // Entropy formula: -p * log2(p)
      entropy -= probability * Math.log2(probability);
    }
  }
  
  return entropy;
}

/**
 * Find the best next guess using entropy-based algorithm
 */
export function findBestGuess(
  allArtists: Artist[],
  candidates: Artist[],
  previousGuesses: string[]
): Artist | null {
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];
  
  // Filter out already guessed artists
  const availableGuesses = allArtists.filter(a => !previousGuesses.includes(a.name));
  
  // If no available guesses, return null
  if (availableGuesses.length === 0) return null;
  
  // Find the guess with highest entropy score
  let bestGuess = availableGuesses[0];
  let bestScore = -Infinity;
  
  // Prioritize candidates (to potentially win immediately)
  for (const candidate of candidates) {
    if (!previousGuesses.includes(candidate.name)) {
      const score = calculateGuessScore(candidate, candidates);
      // Add small bonus for being a potential answer
      const adjustedScore = score + 0.1;
      if (adjustedScore > bestScore) {
        bestScore = adjustedScore;
        bestGuess = candidate;
      }
    }
  }
  
  // Also check non-candidates for potentially better information gain
  for (const artist of availableGuesses) {
    if (!candidates.includes(artist)) {
      const score = calculateGuessScore(artist, candidates);
      if (score > bestScore + 0.2) { // Require significant improvement over candidates
        bestScore = score;
        bestGuess = artist;
      }
    }
  }
  
  return bestGuess;
}

/**
 * Get recommended first guesses (pre-computed for efficiency)
 * These are loaded from the pre-ranked first-guess results dataset
 */
export function getRecommendedFirstGuesses(
	allArtists: Artist[],
	limit: number = 5
): FirstGuessRecommendation[] {
	const artistByName = new Map(allArtists.map((artist) => [artist.name.toLowerCase(), artist]));

	return rankedFirstGuesses
		.map((entry) => {
			const artist = artistByName.get(entry.name.toLowerCase());
			if (!artist) return null;

			return {
				artist,
				twoGuesses: entry.twoGuesses,
				threeGuesses: entry.threeGuesses
			};
		})
		.filter((entry): entry is FirstGuessRecommendation => entry !== null)
		.slice(0, limit);
}
