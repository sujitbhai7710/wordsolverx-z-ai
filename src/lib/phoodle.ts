import { format, subDays } from 'date-fns';
import { getJSTToday } from '$lib/utils';

const PHOODLE_API = 'https://phoodle-worker.pinpoints.workers.dev';

// Start date for Phoodle (earliest available data)
export const PHOODLE_START_DATE = new Date(2023, 1, 1); // Feb 1, 2023

export interface PhoodleDayData {
    id: string;
    word: string;
    description?: string;
    recipe_name?: string;
    formattedDate: string;
    date: Date;
}

/**
 * Fetch Phoodle data for a specific date from the API.
 */
export async function getPhoodleDataForDate(date: Date): Promise<PhoodleDayData | null> {
    try {
        const dateStr = format(date, 'yyyy-MM-dd');
        const res = await fetch(`${PHOODLE_API}/show/date/${dateStr}`, {
            cache: 'force-cache'
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (!data.success || !data.data) return null;

        return {
            id: data.data.id,
            word: data.data.word,
            description: data.data.description,
            recipe_name: data.data.recipe_name,
            formattedDate: format(date, 'MMMM d, yyyy'),
            date: date
        };
    } catch {
        return null;
    }
}

/**
 * Get today's Phoodle data in JST
 */
export async function getPhoodleToday(): Promise<PhoodleDayData | null> {
    return getPhoodleDataForDate(getJSTToday());
}

/**
 * Get yesterday's Phoodle data in JST
 */
export async function getPhoodleYesterday(): Promise<PhoodleDayData | null> {
    return getPhoodleDataForDate(subDays(getJSTToday(), 1));
}

/**
 * Fetch paginated list of available dates from the API.
 */
export async function getPhoodleDatesPage(page: number): Promise<string[]> {
    try {
        const response = await fetch(`${PHOODLE_API}/list/page/${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // next: { revalidate: 3600 } // Removed for SvelteKit
            cache: 'force-cache'
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data.success ? data.data : [];
    } catch {
        return [];
    }
}

/**
 * Parse a slug-formatted date string like "january-07-2026" into a Date object.
 */
export function parsePhoodleSlugDate(slug: string): Date | null {
    try {
        const parts = slug.split('-');
        if (parts.length !== 3) return null;

        const monthStr = parts[0];
        const dayStr = parts[1];
        const yearStr = parts[2];

        const dateStr = `${monthStr} ${dayStr}, ${yearStr}`;
        const date = new Date(dateStr);

        if (isNaN(date.getTime())) return null;

        return date;
    } catch {
        return null;
    }
}

/**
 * Format a Date object into a slug-friendly string like "january-07-2026".
 */
export function formatPhoodleDateForSlug(date: Date): string {
    return format(date, 'MMMM-dd-yyyy').toLowerCase();
}

/**
 * Convert YYYY-MM-DD string to Date object.
 */
export function parseApiDate(dateStr: string): Date {
    return new Date(dateStr + 'T00:00:00Z');
}

