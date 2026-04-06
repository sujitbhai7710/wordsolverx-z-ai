import {
  buildColorfleAnswerPayload,
  getColorfleArchiveEntries
} from '$lib/colorfle';
import { getMainDailyDate } from '$lib/main-daily-date';
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateSoftwareApplicationSchema,
  generateWebPageSchema
} from '$lib/seo';

export const prerender = true;

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

export const load = () => {
  const today = getMainDailyDate();
  const formattedDate = formatDate(today);
  const answer = buildColorfleAnswerPayload(today, 0);
  const recentEntries = getColorfleArchiveEntries(10, today).slice(1);

  const currentMonth = today.toLocaleDateString('en-US', { month: 'long' });
  const pageTitle = `Colorfle Answer Today - ${currentMonth} - Updated`;
  const pageDescription = `Get today's Colorfle answer for ${formattedDate}. Colorfle shows a target color and you guess the three colors that mix to create it. See the exact answer hex, source colors, and weights.`;
  const pageUrl = 'https://wordsolver.tech/colorfle-answer-today';

  const schemas = JSON.stringify([
    generateWebPageSchema('Colorfle Answer Today', pageDescription, pageUrl),
    generateSoftwareApplicationSchema('Colorfle Answer Today', 'UtilitiesApplication'),
    generateHowToSchema('How to use the Colorfle answer today page', [
      { name: 'Check the color blocks', text: 'Review the three official Colorfle source colors for the current puzzle.' },
      { name: 'Reveal the target color', text: 'Reveal the mixed target hex only when you are ready to verify your own result.' },
      { name: 'Use the solver or archive', text: 'Open the solver to work backward from a color or browse older Colorfle entries in the archive.' }
    ]),
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://wordsolver.tech' },
      { name: 'Today', url: 'https://wordsolver.tech/today' },
      { name: 'Colorfle Answer Today', url: pageUrl }
    ]),
    generateFAQSchema([
      {
        question: `What is the Colorfle answer for ${formattedDate}?`,
        answer: `The Colorfle answer for ${formattedDate} mixes ${answer.colors.map((color) => color.name).join(', ')} into the target color ${answer.targetColor.hex}.`
      },
      {
        question: 'Does this page show the exact Colorfle target hex?',
        answer: 'Yes. The page reveals the exact mixed target hex and RGB values so you can confirm the official answer after playing.'
      },
      {
        question: 'Can I check older Colorfle answers?',
        answer: 'Yes. Use the Colorfle archive page to browse previous puzzle dates and target colors.'
      }
    ])
  ]);

  return {
    answer,
    formattedDate,
    recentEntries,
    schemas,
    meta: {
      title: pageTitle,
      description: pageDescription,
      keywords: 'colorfle answer today, colorfle answer, colorfle archive, colorfle solver, colorfle hex answer',
      canonical: pageUrl,
      featuredImage: '/wordsolverx.webp'
    }
  };
};
