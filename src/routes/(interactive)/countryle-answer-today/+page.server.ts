import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateSoftwareApplicationSchema,
  generateWebPageSchema,
} from '$lib/seo';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const now = new Date();
  const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const formattedTodayDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const todayAnswer = {
    id: 1,
    country: 'France',
    continent: 'Europe',
    percentOfRenewableE: 23,
    co2Total: 306,
    coastlineLength: 4853,
    maxAltitude: 4808,
    population: 67390000,
    avgTemperature: 12.2,
    surface: 643801,
    density: 119,
    PIB: 2957880000000,
    rankingFifa: 2,
    footballMatches: 987,
    coordinates: '46.6034,2.3488',
    hemisphere: 'Northern',
    mapsUrl: 'https://maps.google.com/?q=46.6034,2.3488',
  };

  const faqEntries = [
    {
      question: `What is the Countryle answer for ${formattedTodayDate}?`,
      answer: `The Countryle answer for ${formattedTodayDate} is ${todayAnswer.country}. The country is in ${todayAnswer.continent} with a population of approximately ${todayAnswer.population.toLocaleString()}.`,
    },
    {
      question: 'How often does Countryle update its daily answer?',
      answer: 'Countryle resets every day at midnight UTC. A new country is selected as the answer for each day, and the previous day\'s answer is archived.',
    },
    {
      question: 'Can I use the Countryle solver to find today\'s answer?',
      answer: 'Yes. Visit the Countryle Solver page, enter your guesses, and use the colour-coded feedback to narrow down the answer. The solver runs entirely in your browser for instant results.',
    },
  ];

  const pageTitle = `Countryle Answer for Today (${formattedTodayDate}) - WordSolverX`;
  const pageDescription = `Get today's Countryle answer for ${formattedTodayDate}. Today's country is ${todayAnswer.country} in ${todayAnswer.continent}. See population, surface area, temperature, and coordinates.`;
  const pageKeywords = `countryle answer today, countryle answer, countryle hint, countryle ${todayDate}, countryle answer ${formattedTodayDate}`;
  const pageUrl = 'https://wordsolver.tech/countryle-answer-today';

  const schemas = JSON.stringify([
    generateFAQSchema(faqEntries),
    generateHowToSchema('How to use the Countryle answer today page', [
      {
        name: 'Check today\'s answer',
        text: 'Read the answer card at the top of the page to see the current Countryle country and all its properties.',
      },
      {
        name: 'Browse the archive',
        text: 'Use the archive link to look up Countryle answers from previous days.',
      },
      {
        name: 'Solve instead',
        text: 'Open the Countryle solver if you want help narrowing down the answer on your own.',
      },
    ]),
    generateSoftwareApplicationSchema('Countryle Answer Today', 'UtilitiesApplication'),
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://wordsolver.tech' },
      { name: 'Today', url: 'https://wordsolver.tech/today' },
      { name: 'Countryle Answer Today', url: pageUrl },
    ]),
    generateWebPageSchema('Countryle Answer Today', pageDescription, pageUrl),
  ]);

  return {
    todayDate,
    todayAnswer,
    formattedTodayDate,
    faqEntries,
    schemas,
    meta: {
      title: pageTitle,
      description: pageDescription,
      keywords: pageKeywords,
      canonical: pageUrl,
    },
  };
};
