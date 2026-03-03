import countriesData from '$lib/data/worldle/countries.json';
import citiesData from '$lib/data/worldle/cities.json';
import countryDetailsData from '$lib/data/worldle/country-details.json';
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateSoftwareApplicationSchema,
  generateWebPageSchema,
} from '$lib/seo';
import {
  WORLDLE_START_DATE,
  getCurrentWorldleDateString,
  getDailyWorldleAnswer,
  getDisplayDateLabel,
  getMonthDate,
  getMonthKey,
  getRecentWorldleAnswers,
  isValidWorldleDate,
} from '$lib/worldle/logic';
import type { WorldleCity, WorldleCountry, WorldleCountryDetailsMap } from '$lib/worldle/types';
import type { PageServerLoad } from './$types';

const countries = countriesData as WorldleCountry[];
const cities = citiesData as WorldleCity[];
const countryDetails = countryDetailsData as WorldleCountryDetailsMap;

export const load: PageServerLoad = async ({ url }) => {
  const todayDate = getCurrentWorldleDateString();
  const requestedDate = url.searchParams.get('date');
  const selectedDate = requestedDate && isValidWorldleDate(requestedDate, todayDate) ? requestedDate : null;

  const fallbackMonthKey = getMonthKey(selectedDate ?? todayDate);
  const requestedMonth = url.searchParams.get('month');
  const fallbackMonth = getMonthDate(fallbackMonthKey);
  const minimumMonth = getMonthDate(getMonthKey(WORLDLE_START_DATE));
  const maximumMonth = getMonthDate(getMonthKey(todayDate));
  const requestedMonthDate = isValidMonthKey(requestedMonth) ? getMonthDate(requestedMonth) : null;
  const displayMonth =
    requestedMonthDate &&
    requestedMonthDate.getTime() >= minimumMonth.getTime() &&
    requestedMonthDate.getTime() <= maximumMonth.getTime()
      ? requestedMonthDate
      : fallbackMonth;

  const todayAnswer = getDailyWorldleAnswer(countries, cities, countryDetails, todayDate);
  const recentAnswers = getRecentWorldleAnswers(10, countries, cities, countryDetails, todayDate);
  const selectedAnswer = selectedDate
    ? getDailyWorldleAnswer(countries, cities, countryDetails, selectedDate)
    : null;

  const formattedTodayDate = getDisplayDateLabel(todayDate);
  const formattedSelectedDate = selectedDate ? getDisplayDateLabel(selectedDate) : null;

  const faqEntries = recentAnswers.map((answer) => ({
    question: `What was the Worldle answer on ${getDisplayDateLabel(answer.date)}?`,
    answer: `The Worldle answer on ${getDisplayDateLabel(answer.date)} was ${answer.country.name}. That puzzle was Worldle #${answer.worldleNumber}.`,
  }));

  const pageTitle = `Worldle Answer Today: ${todayAnswer.country.name} for ${formattedTodayDate} | WordSolverX`;
  const pageDescription = `Get the Worldle answer for ${formattedTodayDate}. See today's country, review the last 10 Worldle answers, and use the built-in date calendar to check any past answer.`;

  const pageUrl = 'https://wordsolverx.com/worldle-answer-today';

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: `Worldle Answer Today for ${formattedTodayDate}: ${todayAnswer.country.name}`,
    description: pageDescription,
    datePublished: `${todayDate}T00:00:00Z`,
    dateModified: `${todayDate}T00:00:00Z`,
    author: {
      '@type': 'Organization',
      name: 'WordSolverX',
    },
    publisher: {
      '@type': 'Organization',
      name: 'WordSolverX',
      logo: {
        '@type': 'ImageObject',
        url: 'https://wordsolverx.com/wordsolverx.webp',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
  };

  const schemas = JSON.stringify([
    articleSchema,
    generateFAQSchema(faqEntries),
    generateHowToSchema('How to use the Worldle answer today page', [
      {
        name: 'Check today',
        text: 'Read the top answer card to see the current Worldle country and quick facts.',
      },
      {
        name: 'Review recent answers',
        text: 'Use the last 10 answers and FAQs to compare today with recent Worldle puzzles.',
      },
      {
        name: 'Pick a date',
        text: 'Select any valid day in the calendar to load that date and reveal the matching Worldle answer below it.',
      },
    ]),
    generateSoftwareApplicationSchema('Worldle Answer Today', 'UtilitiesApplication'),
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://wordsolverx.com' },
      { name: 'Today', url: 'https://wordsolverx.com/today' },
      { name: 'Worldle Answer Today', url: pageUrl },
    ]),
    generateWebPageSchema('Worldle Answer Today', pageDescription, pageUrl),
  ]);

  return {
    todayDate,
    todayAnswer,
    recentAnswers,
    selectedDate,
    selectedAnswer,
    displayMonth,
    formattedTodayDate,
    formattedSelectedDate,
    faqEntries,
    schemas,
    meta: {
      title: pageTitle,
      description: pageDescription,
      canonical: pageUrl,
    },
  };
};

function isValidMonthKey(value: string | null): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}$/.test(value)) {
    return false;
  }

  const [, month] = value.split('-').map(Number);
  return month >= 1 && month <= 12;
}
