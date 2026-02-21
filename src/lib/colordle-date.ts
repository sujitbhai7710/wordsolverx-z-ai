
import { startOfDay, differenceInDays, addDays, subDays, format } from 'date-fns';
import { getTargetColors, type ColorData } from './colordle';
import { getJSTToday } from '$lib/utils';

// Start date from app.js: moment([2023, 7, 7]) -> August 7, 2023
// Offset from app.js: 500
const START_DATE = new Date(2023, 7, 7); // Month is 0-indexed in JS Date too: 7 = August
const DAY_OFFSET = 500;

export interface ColordleDayData {
    date: Date;
    dayNum: number;
    color: ColorData;
    formattedDate: string;
}

export const getColordleDayNum = (date: Date): number => {
    const targetDate = startOfDay(date);
    const startDate = startOfDay(START_DATE);
    // date-fns differenceInDays returns signed integer
    const diff = differenceInDays(targetDate, startDate);
    return diff + DAY_OFFSET;
};

export const getColordleDataForDate = (date: Date): ColordleDayData | null => {
    const dayNum = getColordleDayNum(date);
    const targets = getTargetColors();

    // Array index logic from app.js: myJson.colors[dayNum - dayOffset]
    // Which simplifies to diff in days.
    // Wait, app.js says: setTColorName(myJson.colors[dayNum - dayOffset]);
    // And dayNum = today.diff(startDay) + dayOffset.
    // So index = (today.diff(startDay) + dayOffset) - dayOffset = today.diff(startDay).
    // So the index is just the number of days since start date.

    const index = dayNum - DAY_OFFSET;

    if (index < 0 || index >= targets.length) {
        return null;
    }

    return {
        date: date,
        dayNum: dayNum,
        color: targets[index],
        formattedDate: format(date, 'MMMM d, yyyy')
    };
};

export const getColordleToday = (): ColordleDayData | null => {
    return getColordleDataForDate(getJSTToday());
};

export const getColordleYesterday = (): ColordleDayData | null => {
    return getColordleDataForDate(subDays(getJSTToday(), 1));
};


// Helper to parse the verbose url format: "january-12-2026"
export const parseSlugDate = (slug: string): Date | null => {
    try {
        const parts = slug.split('-');
        if (parts.length !== 3) return null;

        // parts[0] is month name, parts[1] is day, parts[2] is year
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

export const formatDateForSlug = (date: Date): string => {
    return format(date, 'MMMM-dd-yyyy').toLowerCase();
};
