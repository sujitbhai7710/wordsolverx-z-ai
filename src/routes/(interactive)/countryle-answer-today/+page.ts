import { getCountryleArchiveDates, getCountryleArchiveEntry, getCountryleToday } from '$lib/countryle-data';
import { getMainDailyDateKey } from '$lib/main-daily-date';
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateSoftwareApplicationSchema,
  generateWebPageSchema
} from '$lib/seo';

export const prerender = true;

function formatDisplayDate(dateKey: string): string {
  return new Date(`${dateKey}T12:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  });
}

export const load = () => {
  const targetDateKey = getMainDailyDateKey();
  const today = getCountryleToday(targetDateKey);
  const recentEntries = getCountryleArchiveDates()
    .slice(0, 10)
    .map((dateKey) => getCountryleArchiveEntry(dateKey))
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const formattedDate = today ? formatDisplayDate(today.date) : 'today';
  const currentMonth = new Date(`${today?.date ?? targetDateKey}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
  const pageTitle = `Countryle Answer Today - ${currentMonth} - Updated`;
  const pageDescription = today
    ? `Get today's Countryle answer for ${formattedDate}. See the country, continent, hemisphere, population, coordinates, and direct links to the archive and Countryle solver.`
    : 'Get today\'s Countryle answer, archive access, and the Countryle solver.';
  const pageUrl = 'https://wordsolver.tech/countryle-answer-today';

  const schemas = JSON.stringify([
    generateWebPageSchema('Countryle Answer Today', pageDescription, pageUrl),
    generateSoftwareApplicationSchema('Countryle Answer Today', 'UtilitiesApplication'),
    generateHowToSchema('How to use the Countryle answer today page', [
      { name: 'Check today\'s country', text: 'Use the top answer card to verify the official Countryle country and its key stats.' },
      { name: 'Open the archive', text: 'Browse older Countryle dates from the archive page when you need previous answers.' },
      { name: 'Use the solver first', text: 'Open the solver if you want to narrow the country before revealing today\'s answer.' }
    ]),
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://wordsolver.tech' },
      { name: 'Today', url: 'https://wordsolver.tech/today' },
      { name: 'Countryle Answer Today', url: pageUrl }
    ]),
    generateFAQSchema([
      {
        question: `What is the Countryle answer for ${formattedDate}?`,
        answer: today ? `The Countryle answer for ${formattedDate} is ${today.country.country}.` : 'The latest Countryle answer is shown on this page.'
      },
      {
        question: 'Does this page include country facts?',
        answer: 'Yes. The Countryle answer page includes continent, hemisphere, population, temperature, surface area, coordinates, and a map link when available.'
      },
      {
        question: 'Can I check older Countryle answers?',
        answer: 'Yes. Use the Countryle archive page to look up previous dates and countries from the saved archive dataset.'
      }
    ])
  ]);

  return {
    today,
    recentEntries,
    formattedDate,
    schemas,
    meta: {
      title: pageTitle,
      description: pageDescription,
      keywords: 'countryle answer today, countryle answer, countryle archive, countryle solver, countryle country today',
      canonical: pageUrl,
      featuredImage: '/images/countryle-answer-today.webp'
    }
  };
};
