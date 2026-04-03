import { differenceInDays, format, startOfDay, subDays } from 'date-fns';
import type { ColorData } from './colordle';
import colordleData from '../../static/colordle_data.json';
import { getPuzzleDateForGame } from '$lib/puzzle-window';

interface ColordleGeneratedEntry {
	date: string;
	dayNum: number;
	color: ColorData;
}

interface ColordleGeneratedDataset {
	generatedAt: string;
	sourceUrl: string;
	startDate: string;
	dayOffset: number;
	entryCount: number;
	latestDate: string | null;
	colors: string[];
	availableDateStrings: string[];
	entries: ColordleGeneratedEntry[];
}

const generatedDataset = colordleData as ColordleGeneratedDataset;
const START_DATE = startOfDay(new Date(`${generatedDataset.startDate}T12:00:00Z`));
const DAY_OFFSET = generatedDataset.dayOffset;

export interface ColordleDayData {
	date: Date;
	dayNum: number;
	color: ColorData;
	formattedDate: string;
}

export interface ResolvedColordleDayData extends ColordleDayData {
	requestedDate: Date;
	requestedDayNum: number;
	requestedFormattedDate: string;
	exactMatch: boolean;
	fallbackReason: 'before-start' | 'after-end' | null;
	availableFromDate: Date;
	availableThroughDate: Date;
	availableFromFormattedDate: string;
	availableThroughFormattedDate: string;
}

export interface ColordleTodayPayload {
	actualDateKey: string;
	requestedDateKey: string;
	color: ColorData;
	dayNum: number;
	formattedDate: string;
	requestedFormattedDate: string;
	exactMatch: boolean;
	isFallback: boolean;
	fallbackReason: 'before-start' | 'after-end' | null;
	availableThroughDateKey: string | null;
	availableThroughFormattedDate: string | null;
	yesterdayData: ColordleDayData | null;
	last100Days: ColordleDayData[];
}

const formatColordleDate = (date: Date): string => format(date, 'MMMM d, yyyy');

const toDateKey = (date: Date): string => format(startOfDay(date), 'yyyy-MM-dd');

const parseStoredDate = (dateKey: string): Date => startOfDay(new Date(`${dateKey}T12:00:00Z`));

const generatedEntries = generatedDataset.entries.map((entry) => ({
	...entry,
	parsedDate: parseStoredDate(entry.date)
}));

const entryByDateKey = new Map(generatedEntries.map((entry) => [entry.date, entry]));

function buildColordleDayData(entry: (typeof generatedEntries)[number]): ColordleDayData {
	return {
		date: entry.parsedDate,
		dayNum: entry.dayNum,
		color: entry.color,
		formattedDate: formatColordleDate(entry.parsedDate)
	};
}

function getDateBounds() {
	const firstEntry = generatedEntries[0];
	const lastEntry = generatedEntries[generatedEntries.length - 1];

	if (!firstEntry || !lastEntry) {
		return null;
	}

	return {
		availableFromDate: firstEntry.parsedDate,
		availableThroughDate: lastEntry.parsedDate
	};
}

export const getColordleDayNum = (date: Date): number => {
	return differenceInDays(startOfDay(date), START_DATE) + DAY_OFFSET;
};

export const getColordleAvailableDates = (): Date[] => {
	return generatedEntries.map((entry) => entry.parsedDate);
};

export const getColordleAvailableDateKeys = (): string[] => {
	return [...generatedDataset.availableDateStrings];
};

export const getColordleDataForDate = (date: Date): ColordleDayData | null => {
	const entry = entryByDateKey.get(toDateKey(date));
	return entry ? buildColordleDayData(entry) : null;
};

export const getLatestAvailableColordleData = (): ColordleDayData | null => {
	const latestEntry = generatedEntries[generatedEntries.length - 1];
	return latestEntry ? buildColordleDayData(latestEntry) : null;
};

export const resolveColordleDataForDate = (date: Date): ResolvedColordleDayData | null => {
	const bounds = getDateBounds();
	const requestedDate = startOfDay(date);
	const requestedFormattedDate = formatColordleDate(requestedDate);
	const requestedDayNum = getColordleDayNum(requestedDate);

	if (!bounds) {
		return null;
	}

	const exactData = getColordleDataForDate(requestedDate);
	const availableFromFormattedDate = formatColordleDate(bounds.availableFromDate);
	const availableThroughFormattedDate = formatColordleDate(bounds.availableThroughDate);

	if (exactData) {
		return {
			...exactData,
			requestedDate,
			requestedDayNum,
			requestedFormattedDate,
			exactMatch: true,
			fallbackReason: null,
			availableFromDate: bounds.availableFromDate,
			availableThroughDate: bounds.availableThroughDate,
			availableFromFormattedDate,
			availableThroughFormattedDate
		};
	}

	const fallbackReason = requestedDate < bounds.availableFromDate ? 'before-start' : 'after-end';
	const fallbackDate =
		fallbackReason === 'before-start' ? bounds.availableFromDate : bounds.availableThroughDate;
	const fallbackData = getColordleDataForDate(fallbackDate);

	if (!fallbackData) {
		return null;
	}

	return {
		...fallbackData,
		requestedDate,
		requestedDayNum,
		requestedFormattedDate,
		exactMatch: false,
		fallbackReason,
		availableFromDate: bounds.availableFromDate,
		availableThroughDate: bounds.availableThroughDate,
		availableFromFormattedDate,
		availableThroughFormattedDate
	};
};

export const getColordleToday = (): ColordleDayData | null => {
	return getColordleDataForDate(getPuzzleDateForGame('colordle'));
};

export const getColordleYesterday = (): ColordleDayData | null => {
	return getColordleDataForDate(subDays(getPuzzleDateForGame('colordle'), 1));
};

export const getColordleTodayPayload = (
	requestedDate: Date = getPuzzleDateForGame('colordle')
): ColordleTodayPayload | null => {
	const resolvedData = resolveColordleDataForDate(requestedDate);

	if (!resolvedData) {
		return null;
	}

	const yesterdayData = getColordleDataForDate(subDays(resolvedData.date, 1));
	const last100Days = Array.from({ length: 100 }, (_, index) =>
		getColordleDataForDate(subDays(resolvedData.date, index))
	).filter((entry): entry is ColordleDayData => entry !== null);

	return {
		actualDateKey: toDateKey(resolvedData.date),
		requestedDateKey: toDateKey(resolvedData.requestedDate),
		color: resolvedData.color,
		dayNum: resolvedData.dayNum,
		formattedDate: resolvedData.formattedDate,
		requestedFormattedDate: resolvedData.requestedFormattedDate,
		exactMatch: resolvedData.exactMatch,
		isFallback: !resolvedData.exactMatch,
		fallbackReason: resolvedData.fallbackReason,
		availableThroughDateKey: toDateKey(resolvedData.availableThroughDate),
		availableThroughFormattedDate: resolvedData.availableThroughFormattedDate,
		yesterdayData,
		last100Days
	};
};

export async function getLiveColordleTargetColors(): Promise<ColorData[]> {
	return generatedEntries.map((entry) => entry.color);
}

export async function getColordleDataForDateLive(date: Date): Promise<ColordleDayData | null> {
	return getColordleDataForDate(date);
}

export async function getLatestAvailableColordleDataLive(): Promise<ColordleDayData | null> {
	return getLatestAvailableColordleData();
}

export async function resolveColordleDataForDateLive(
	date: Date
): Promise<ResolvedColordleDayData | null> {
	return resolveColordleDataForDate(date);
}

export const parseSlugDate = (slug: string): Date | null => {
	try {
		const parts = slug.split('-');
		if (parts.length !== 3) return null;

		const [monthStr, dayStr, yearStr] = parts;
		const date = new Date(`${monthStr} ${dayStr}, ${yearStr}`);

		if (Number.isNaN(date.getTime())) {
			return null;
		}

		return date;
	} catch {
		return null;
	}
};

export const formatDateForSlug = (date: Date): string => {
	return format(date, 'MMMM-dd-yyyy').toLowerCase();
};
