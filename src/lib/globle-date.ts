import { startOfDay, format, subDays, addDays } from 'date-fns';
import { getJSTToday } from '$lib/utils';
import countries from '$lib/data/globle-countries.json';

import CryptoJS from 'crypto-js';
const KEY = "ee53e68c3074206a002bf01333b047d5";

export interface GlobleDayData {
    date: Date;
    country: {
        name: string;
        code: string;
        latitude: number;
        longitude: number;
        index: number;
        continent: string;
        subregion: string;
    };
    formattedDate: string;
}

// Decrypt the answer index from the API
function decryptAnswer(encrypted: string, key: string): number | null {
    try {
        const decrypted = CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);
        return parseInt(decrypted, 10);
    } catch (e) {
        return null;
    }
}

// Fetch answer from the Globle API
export async function getGlobleDataForDate(date: Date): Promise<GlobleDayData | null> {
    try {
        const dateStr = format(date, 'yyyy-MM-dd');
        const listLen = countries.length;
        const url = `https://globle-game.com/answer?day=${dateStr}&list=${listLen}`;

        const response = await fetch(url, {

        });

        if (!response.ok) {
            return null;
        }

        const data: { answer?: string } = await response.json();

        if (!data.answer) {
            return null;
        }

        const index = decryptAnswer(data.answer, KEY);

        if (index === null || isNaN(index) || index < 0 || index >= countries.length) {
            return null;
        }

        const country = countries[index];

        return {
            date,
            country: {
                name: country.name,
                code: country.code,
                latitude: country.latitude,
                longitude: country.longitude,
                index: country.index,
                continent: country.continent || 'Unknown',
                subregion: country.subregion || 'Unknown'
            },
            formattedDate: format(date, 'MMMM d, yyyy')
        };
    } catch (e) {
        console.error('Error fetching Globle data:', e);
        return null;
    }
}

export async function getGlobleToday(): Promise<GlobleDayData | null> {
    return getGlobleDataForDate(getJSTToday());
}

export async function getGlobleYesterday(): Promise<GlobleDayData | null> {
    return getGlobleDataForDate(subDays(getJSTToday(), 1));
}

// Helper to parse the verbose url format: "january-27-2026"
export const parseGlobleSlugDate = (slug: string): Date | null => {
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
    } catch (e) {
        return null;
    }
};

export const formatGlobleDateForSlug = (date: Date): string => {
    return format(date, 'MMMM-dd-yyyy').toLowerCase();
};
