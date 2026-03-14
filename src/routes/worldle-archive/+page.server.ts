import countriesData from '$lib/data/worldle/countries.json';
import citiesData from '$lib/data/worldle/cities.json';
import countryDetailsData from '$lib/data/worldle/country-details.json';
import { parseArchiveDateKey, toArchiveDateKey } from '$lib/archive-page';
import {
  WORLDLE_START_DATE,
  getCurrentWorldleDateString,
  getDailyWorldleAnswer,
  getDisplayDateLabel,
  isValidWorldleDate,
} from '$lib/worldle/logic';
import type { WorldleCity, WorldleCountry, WorldleCountryDetailsMap } from '$lib/worldle/types';
import type { PageServerLoad } from './$types';

const countries = countriesData as WorldleCountry[];
const cities = citiesData as WorldleCity[];
const countryDetails = countryDetailsData as WorldleCountryDetailsMap;

export const load: PageServerLoad = async ({ url }) => {
  const selectedDate = parseArchiveDateKey(url.searchParams.get('date'));

  if (!selectedDate) {
    return {
      selectedDateKey: null,
      selectedAnswer: null,
      formattedSelectedDate: null,
    };
  }

  const selectedDateKey = toArchiveDateKey(selectedDate);
  const todayDate = getCurrentWorldleDateString();

  if (!isValidWorldleDate(selectedDateKey, todayDate)) {
    return {
      selectedDateKey: null,
      selectedAnswer: null,
      formattedSelectedDate: null,
    };
  }

  return {
    selectedDateKey,
    selectedAnswer: getDailyWorldleAnswer(countries, cities, countryDetails, selectedDateKey),
    formattedSelectedDate: getDisplayDateLabel(selectedDateKey),
  };
};
