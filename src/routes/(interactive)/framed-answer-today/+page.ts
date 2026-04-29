import { formatFramedDate, getTodayFramedEntries, getLatestFramedDateKey } from '$lib/framed';
import { getMainDailyDateKey } from '$lib/main-daily-date';
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateSoftwareApplicationSchema,
  generateWebPageSchema
} from '$lib/seo';

export const prerender = true;

export const load = () => {
  const targetDateKey = getMainDailyDateKey();
  let entries = getTodayFramedEntries(targetDateKey);

  // Fallback: if today's date has no data, use the latest available date
  let displayDateKey = targetDateKey;
  let hasExactEntries = entries.length === 4;
  if (!hasExactEntries) {
    const latestKey = getLatestFramedDateKey();
    if (latestKey) {
      displayDateKey = latestKey;
      entries = getTodayFramedEntries(latestKey);
      hasExactEntries = entries.length === 4;
    }
  }

  const formattedDate = formatFramedDate(new Date(`${displayDateKey}T00:00:00Z`));
  const currentMonth = new Date(`${displayDateKey}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
  const pageTitle = hasExactEntries
    ? `Framed Answer Today (${formattedDate}) | Archive`
    : `Framed Answer Today - ${currentMonth} - Updated`;
  const pageDescription = hasExactEntries
    ? `Get today's Framed answers for ${formattedDate}, including Framed Classic, One Frame, Titleshot, and Poster puzzle titles from our verified answer records.`
    : `Check whether the Framed answers for ${formattedDate} are ready yet, then use the archive if you need older saved movie titles.`;
  const pageUrl = 'https://wordsolverx.com/framed-answer-today';

  const schemas = JSON.stringify([
    generateWebPageSchema('Framed Answers Today', pageDescription, pageUrl),
    generateSoftwareApplicationSchema('Framed Answers Today', 'UtilitiesApplication'),
    generateHowToSchema('How to use the Framed answers today page', [
      { name: 'Check the current date', text: 'Open the page to see the saved answer cards for today\'s Framed modes.' },
      { name: 'Open the archive', text: 'Use the archive link to inspect older Framed puzzle dates.' },
      { name: 'Verify after playing', text: 'Use the title cards to confirm your guesses once you are done playing Framed.' }
    ]),
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://wordsolverx.com' },
      { name: 'Today', url: 'https://wordsolverx.com/today' },
      { name: 'Framed Answers Today', url: pageUrl }
    ]),
    generateFAQSchema([
      {
        question: `What are the Framed answers for ${formattedDate}?`,
        answer: hasExactEntries
          ? `The page lists today's saved Framed answers for ${entries.map((entry) => entry.game.label).join(', ')}.`
          : 'Today\'s exact Framed answers are not available yet. Check back shortly or use the archive for older saved dates.'
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
    hasExactEntries,
    targetDateKey: displayDateKey,
    formattedDate,
    schemas,
    meta: {
      title: pageTitle,
      description: pageDescription,
      keywords: 'framed answers today, framed answer today, framed archive, one frame answer, titleshot answer, poster answer',
      canonical: pageUrl,
      featuredImage: '/images/framed-answer-today.webp'
    }
  };
};
