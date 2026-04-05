import { formatFramedDate, getTodayFramedEntries } from '$lib/framed';
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateSoftwareApplicationSchema,
  generateWebPageSchema
} from '$lib/seo';

export const prerender = true;

export const load = () => {
  const entries = getTodayFramedEntries();
  const dateKey = entries[0]?.date ?? new Date().toISOString().slice(0, 10);
  const formattedDate = formatFramedDate(new Date(`${dateKey}T00:00:00Z`));
  const currentMonth = new Date(`${dateKey}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
  const pageTitle = `Framed Answer Today - ${currentMonth} - Updated`;
  const pageDescription = `Get today's Framed answers for ${formattedDate}, including Framed Classic, One Frame, Titleshot, and Poster puzzle titles from the static archive dataset.`;
  const pageUrl = 'https://wordsolver.tech/framed-answer-today';

  const schemas = JSON.stringify([
    generateWebPageSchema('Framed Answers Today', pageDescription, pageUrl),
    generateSoftwareApplicationSchema('Framed Answers Today', 'UtilitiesApplication'),
    generateHowToSchema('How to use the Framed answers today page', [
      { name: 'Check the current date', text: 'Open the page to see the saved answer cards for today\'s Framed modes.' },
      { name: 'Open the archive', text: 'Use the archive link to inspect older Framed puzzle dates.' },
      { name: 'Verify after playing', text: 'Use the title cards to confirm your guesses once you are done playing Framed.' }
    ]),
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://wordsolver.tech' },
      { name: 'Today', url: 'https://wordsolver.tech/today' },
      { name: 'Framed Answers Today', url: pageUrl }
    ]),
    generateFAQSchema([
      {
        question: `What are the Framed answers for ${formattedDate}?`,
        answer: entries.length > 0 ? `The page lists today's saved Framed answers for ${entries.map((entry) => entry.game.label).join(', ')}.` : 'The page shows the latest saved Framed answers from the static dataset.'
      },
      {
        question: 'Which Framed modes are included?',
        answer: 'The page includes Framed Classic, One Frame, Titleshot, and Poster.'
      },
      {
        question: 'Can I browse older Framed answers?',
        answer: 'Yes. Use the Framed archive page to select older dates and reveal the saved movie titles for each mode.'
      }
    ])
  ]);

  return {
    entries,
    formattedDate,
    schemas,
    meta: {
      title: pageTitle,
      description: pageDescription,
      keywords: 'framed answers today, framed answer today, framed archive, one frame answer, titleshot answer, poster answer',
      canonical: pageUrl,
      featuredImage: '/wordsolverx.webp'
    }
  };
};
