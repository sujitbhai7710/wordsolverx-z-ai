import { formatSpotleDate, parseSpotleDate, type SpotleData } from '$lib/spotle';
import { isArchiveDateInRange, parseArchiveDateKey, toArchiveDateKey } from '$lib/archive-page';
import { getPuzzleDateForGame } from '$lib/puzzle-window';
import spotleData from '../../../static/spotle_data.json';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const data = spotleData as SpotleData;
  const artists = data?.artists ?? [];
  const answers = data?.answers ?? [];
  const todayKey = formatSpotleDate(getPuzzleDateForGame('spotle'));
  const availableDateStrings = answers
    .map((entry) => entry.date)
    .filter((dateString) => dateString <= todayKey)
    .sort();
  const startDate = availableDateStrings.length > 0 ? parseSpotleDate(availableDateStrings[0]) : null;
  const latestDate = availableDateStrings.length > 0 ? parseSpotleDate(availableDateStrings[availableDateStrings.length - 1]) : null;
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
          formattedDate: parseSpotleDate(selectedAnswer.date).toLocaleDateString('en-US', {
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
