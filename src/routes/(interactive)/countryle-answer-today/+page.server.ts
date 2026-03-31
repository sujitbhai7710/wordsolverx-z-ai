import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateSoftwareApplicationSchema,
  generateWebPageSchema,
} from '$lib/seo';
import { fetchCountryleAnswerForDateKey } from '$lib/countryle';
import { getPuzzleWindow } from '$lib/puzzle-window';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
  const window = getPuzzleWindow('countryle');
  const targetDateKey = window.effectivePuzzleDate;
  const todayAnswer =
    (await fetchCountryleAnswerForDateKey(targetDateKey)) ??
    (window.fallbackPuzzleDate ? await fetchCountryleAnswerForDateKey(window.fallbackPuzzleDate) : null);

  if (!todayAnswer) {
    return {
      todayDate: targetDateKey,
      formattedTodayDate: new Date(`${targetDateKey}T12:00:00Z`).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      }),
      faqEntries: [],
      schemas: '[]',
      meta: {
        title: 'Countryle Answer Today - Unable to Load',
        description: "Could not retrieve today's Countryle answer.",
        keywords: 'countryle answer today',
        canonical: 'https://wordsolver.tech/countryle-answer-today'
      }
    };
  }

  const isCurrent = todayAnswer.dateKey === targetDateKey;
  const pageTitle = `Countryle Answer for Today (${todayAnswer.displayDate}) - WordSolverX`;
  const pageDescription = `Get today's Countryle answer for ${todayAnswer.displayDate}. The country is ${todayAnswer.country.country}. See the continent, population, surface area, temperature, and map link.`;
  const pageKeywords = `countryle answer today, countryle answer, countryle hint, countryle ${todayAnswer.dateKey}, countryle ${todayAnswer.country.country}`;
  const pageUrl = 'https://wordsolver.tech/countryle-answer-today';

  const faqEntries = [
    {
      question: `What is the Countryle answer for ${todayAnswer.displayDate}?`,
      answer: `The Countryle answer for ${todayAnswer.displayDate} is ${todayAnswer.country.country}.`
    },
    {
      question: 'What clues does Countryle use?',
      answer: 'Countryle compares continent, hemisphere, population, surface area, temperature, and direction to help you narrow down the answer.'
    },
    {
      question: 'Can I solve Countryle before revealing the answer?',
      answer: 'Yes. The Countryle solver lets you enter guesses and compare the same clue categories without opening the official game.'
    }
  ];

  const schemas = JSON.stringify([
    generateFAQSchema(faqEntries),
    generateHowToSchema('How to use the Countryle answer today page', [
      {
        name: "Check today's country",
        text: 'Read the answer card to see the current Countryle country and its key clue properties.'
      },
      {
        name: 'Open the map',
        text: 'Use the map link to jump directly to the country coordinates.'
      },
      {
        name: 'Browse older answers',
        text: 'Visit the archive when you need previous Countryle solutions.'
      }
    ]),
    generateSoftwareApplicationSchema('Countryle Answer Today', 'UtilitiesApplication'),
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://wordsolver.tech' },
      { name: 'Today', url: 'https://wordsolver.tech/today' },
      { name: 'Countryle Answer Today', url: pageUrl }
    ]),
    generateWebPageSchema('Countryle Answer Today', pageDescription, pageUrl)
  ]);

  setHeaders({
    'X-Puzzle-Date': todayAnswer.dateKey,
    'X-Edge-Cache-Bypass': isCurrent ? '0' : '1'
  });

  return {
    todayDate: todayAnswer.dateKey,
    todayAnswer: todayAnswer.country,
    formattedTodayDate: todayAnswer.displayDate,
    faqEntries,
    schemas,
    meta: {
      title: pageTitle,
      description: pageDescription,
      keywords: pageKeywords,
      canonical: pageUrl
    }
  };
};
