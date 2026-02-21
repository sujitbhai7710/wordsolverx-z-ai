// Semantle Library - Date calculations and answer lookup
// Epoch: January 29, 2022 (Puzzle #1)

import { format, differenceInDays, parse, subDays } from 'date-fns';
import { getJSTToday } from '$lib/utils';

// Import the secret words list
import { SECRET_WORDS } from '$lib/data/semantle-words';

// Semantle started on January 29, 2022 (Puzzle #1)
const SEMANTLE_EPOCH = new Date(Date.UTC(2022, 0, 29)); // January 29, 2022 UTC

export interface SemantleData {
    word: string;
    puzzleNumber: number;
    formattedDate: string;
    date: Date;
}

/**
 * Calculate the Semantle puzzle number for a given date (UTC)
 */
export function getSemantlePuzzleNumber(date: Date): number {
    // Normalize to midnight local (which is JST if using getJSTToday)
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const startDate = new Date(SEMANTLE_EPOCH.getUTCFullYear(), SEMANTLE_EPOCH.getUTCMonth(), SEMANTLE_EPOCH.getUTCDate());
    const daysDiff = differenceInDays(normalizedDate, startDate);
    return daysDiff;
}

/**
 * Get the Semantle answer for a specific date
 */
export function getSemantleAnswer(date: Date): string | null {
    const puzzleNumber = getSemantlePuzzleNumber(date);
    const index = puzzleNumber; // Removed -1: Word list starts at index 0 which is Puzzle #0 (epoch day)

    if (index < 0 || index >= SECRET_WORDS.length) {
        return null;
    }

    return SECRET_WORDS[index];
}

/**
 * Get full Semantle data for a given date
 */
export function getSemantleDataForDate(date: Date): SemantleData | null {
    const word = getSemantleAnswer(date);
    if (!word) return null;

    const puzzleNumber = getSemantlePuzzleNumber(date);

    // Use UTC components to format the date string to be "timezone independent"
    const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const formattedDate = format(utcDate, 'MMMM d, yyyy');

    return {
        word,
        puzzleNumber,
        formattedDate,
        date
    };
}

/**
 * Parse a slug like "january-29-2022" into a UTC Date
 */
export function parseSemantleSlugDate(slug: string): Date | null {
    try {
        // Handle format: month-day-year (e.g., january-29-2022)
        const parts = slug.toLowerCase().split('-');
        if (parts.length < 3) return null;

        const monthName = parts[0];
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[parts.length - 1], 10);

        if (isNaN(day) || isNaN(year)) return null;

        const months: Record<string, number> = {
            january: 0, february: 1, march: 2, april: 3,
            may: 4, june: 5, july: 6, august: 7,
            september: 8, october: 9, november: 10, december: 11
        };

        const month = months[monthName];
        if (month === undefined) return null;

        // Return as UTC date to ensure consistent puzzle number calculation
        return new Date(Date.UTC(year, month, day));
    } catch {
        return null;
    }
}

/**
 * Format a date for use in URL slugs (january-29-2022)
 * Ensures consistency by using UTC components
 */
export function formatSemantleDateForSlug(date: Date): string {
    const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    return format(utcDate, 'MMMM-d-yyyy').toLowerCase();
}

/**
 * Get today's Semantle data based on UTC time
 */
export function getTodaySemantleData(): SemantleData | null {
    const today = getJSTToday();
    return getSemantleDataForDate(today);
}

/**
 * Get yesterday's Semantle data based on UTC time
 */
export function getYesterdaySemantleData(): SemantleData | null {
    const today = getJSTToday();
    const yesterday = subDays(today, 1);
    return getSemantleDataForDate(yesterday);
}

/**
 * Get the start date of Semantle
 */
export function getSemantleStartDate(): Date {
    return new Date(SEMANTLE_EPOCH);
}

/**
 * Get total number of available puzzles
 */
export function getTotalSemantlePuzzles(): number {
    return SECRET_WORDS.length;
}
