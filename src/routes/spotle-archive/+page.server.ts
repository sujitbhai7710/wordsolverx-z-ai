import { formatSpotleDate, type SpotleData } from '$lib/spotle';
import { isArchiveDateInRange, parseArchiveDateKey, toArchiveDateKey } from '$lib/archive-page';
import { getISTToday } from '$lib/utils';
import spotleData from '../../../static/spotle_data.json';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const data = spotleData as SpotleData;
  const artists = data?.artists ?? [];
  const answers = data?.answers ?? [];
  const todayKey = formatSpotleDate(getISTToday());
  const availableDateStrings = answers
    .map((entry) => entry.date)
    .filter((dateString) => dateString <= todayKey)
    .sort();
  const startDate = availableDateStrings.length > 0 ? new Date(`${availableDateStrings[0]}T12:00:00`) : null;
  const latestDate = availableDateStrings.length > 0 ? new Date(`${availableDateStrings[availableDateStrings.length - 1]}T12:00:00`) : null;
  const selectedDate = parseArchiveDateKey(url.searchParams.get('date'));

  if (!startDate || !latestDate || !selectedDate || !isArchiveDateInRange(selectedDate, startDate, latestDate)) {
    return {
      availableDateStrings,
      selectedDateKey: null,
      selectedSpotle: null,
    };
  }

  const selectedDateKey = toArchiveDateKey(selectedDate);
  const selectedAnswer = answers.find((entry) => entry.date === selectedDateKey) ?? null;
  const selectedArtist =
    selectedAnswer?.artist
      ? artists.find((artist) => artist.artist.toLowerCase() === selectedAnswer.artist.toLowerCase()) ?? null
      : null;

  return {
    availableDateStrings,
    selectedDateKey,
    selectedSpotle: selectedAnswer
      ? {
          date: selectedAnswer.date,
          formattedDate: new Date(`${selectedAnswer.date}T12:00:00`).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          dayNumber: selectedAnswer.dayNumber,
          artistName: selectedAnswer.artist,
          artist: selectedArtist,
        }
      : null,
  };
};
