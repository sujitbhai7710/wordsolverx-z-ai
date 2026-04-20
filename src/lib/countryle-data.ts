import countryleArchiveJson from '../../static/countryle_archive.json';
import countryleTodayJson from '../../static/countryle_today.json';
import type { CountryData } from './countryle';

export interface CountryleArchiveEntry {
  gameNumber: number;
  date: string;
  apiDate?: string;
  country: CountryData;
  scrapedAt?: string;
}

export interface CountryleTodayPayload {
  date: string;
  gameNumber: number;
  updated?: string;
  country: CountryData;
}

const archiveData = countryleArchiveJson as Record<string, CountryleArchiveEntry>;
const todayData = countryleTodayJson as CountryleTodayPayload;

export function getCountryleArchive(): Record<string, CountryleArchiveEntry> {
  return archiveData;
}

export function getCountryleArchiveDates(): string[] {
  return Object.keys(archiveData).sort((left, right) => right.localeCompare(left));
}

export function getCountryleArchiveEntry(dateKey: string): CountryleArchiveEntry | null {
  return archiveData[dateKey] ?? null;
}

export function getLatestCountryleArchiveEntry(): CountryleArchiveEntry | null {
  const latestDate = getCountryleArchiveDates()[0];
  return latestDate ? archiveData[latestDate] : null;
}

function toTodayPayload(entry: CountryleArchiveEntry): CountryleTodayPayload {
  return {
    date: entry.date,
    gameNumber: entry.gameNumber,
    country: entry.country
  };
}

export function getCountryleToday(targetDateKey?: string): CountryleTodayPayload | null {
  if (targetDateKey) {
    const exactArchiveMatch = archiveData[targetDateKey];
    if (exactArchiveMatch) {
      return toTodayPayload(exactArchiveMatch);
    }

    if (todayData?.country?.country && todayData.date <= targetDateKey) {
      return todayData;
    }

    const matchingArchiveDate = getCountryleArchiveDates().find((dateKey) => dateKey <= targetDateKey);
    if (matchingArchiveDate) {
      return toTodayPayload(archiveData[matchingArchiveDate]);
    }
  }

  if (todayData?.country?.country) {
    return todayData;
  }

  const latest = getLatestCountryleArchiveEntry();
  if (!latest) return null;

  return toTodayPayload(latest);
}
