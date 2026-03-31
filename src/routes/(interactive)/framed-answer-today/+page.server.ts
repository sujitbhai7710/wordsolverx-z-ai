import { format } from 'date-fns';
import { MODE_LABELS, VALID_MODES, fetchFramedAnswerForDateKey, type FramedMode } from '$lib/framed';
import { getPuzzleWindow, parsePuzzleDateKey } from '$lib/puzzle-window';
import { generateFAQSchema } from '$lib/seo';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
  const window = getPuzzleWindow('framed');
  const targetDateKey = window.effectivePuzzleDate;
  const fallbackDateKey = window.fallbackPuzzleDate ?? null;

  const modes = (
    await Promise.all(
      VALID_MODES.map(async (mode) => {
        const answer =
          (await fetchFramedAnswerForDateKey(targetDateKey, mode)) ??
          (fallbackDateKey ? await fetchFramedAnswerForDateKey(fallbackDateKey, mode) : null);

        if (!answer) {
          return null;
        }

        return {
          key: mode,
          label: MODE_LABELS[mode],
          dayNumber: answer.dayNumber,
          movie: answer.movie,
          dateKey: answer.dateKey
        };
      })
    )
  ).filter(Boolean) as Array<{
    key: FramedMode;
    label: string;
    dayNumber: number;
    movie: { title: string; year: number | null };
    dateKey: string;
  }>;

  const mode = 'classic';
  const activeMode = modes.find((entry) => entry.key === mode) ?? modes[0];
  if (!activeMode) {
    return {
      mode,
      dayNumber: 0,
      formattedDate: format(parsePuzzleDateKey(targetDateKey), 'MMMM d, yyyy'),
      movie: { title: 'Unavailable', year: null },
      modes: [],
      schemas: '[]',
      meta: {
        title: 'Framed Answer Today - Unable to Load',
        description: "Could not retrieve today's Framed answers.",
        keywords: 'framed answer today',
        featuredImage: 'https://wordsolver.tech/wordsolverx.webp'
      }
    };
  }

  const isCurrent = modes.every((entry) => entry.dateKey === targetDateKey);
  const formattedDate = format(parsePuzzleDateKey(activeMode.dateKey), 'MMMM d, yyyy');
  const featuredImage = 'https://wordsolver.tech/framed-answer-today.webp';
  const pageTitle = `Framed Hints and Answer for Today (${formattedDate})`;
  const pageDescription = `Get Framed hints and the confirmed Framed answers for ${formattedDate}. Classic is ${activeMode.movie.title}${activeMode.movie.year ? ` (${activeMode.movie.year})` : ''}, and the page also includes One Frame, Poster, and Title Shot.`;
  const pageKeywords = `framed answer today, framed answer, framed hint today, framed movie answer, framed ${formattedDate}`;

  const faqSchema = generateFAQSchema([
    {
      question: `What is the Framed classic answer for ${formattedDate}?`,
      answer: `The Framed classic answer for ${formattedDate} is ${activeMode.movie.title}${activeMode.movie.year ? ` (${activeMode.movie.year})` : ''}.`
    },
    {
      question: 'What modes does Framed have?',
      answer: 'Framed currently includes Classic, One Frame, Poster, and Title Shot modes.'
    },
    {
      question: 'How often does Framed update?',
      answer: 'Framed publishes a new movie challenge each day and WordSolverX rebuilds this page from those daily answers.'
    }
  ]);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageTitle,
    datePublished: `${activeMode.dateKey}T00:00:00Z`,
    dateModified: `${activeMode.dateKey}T00:00:00Z`,
    author: {
      '@type': 'Person',
      name: 'Preston Hayes',
      image: 'https://wordsolver.tech/auther-wordsolverx.webp',
      url: 'https://wordsolver.tech/about#preston-hayes'
    },
    publisher: { '@type': 'Organization', name: 'WordSolverX' },
    description: pageDescription,
    image: [featuredImage],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://wordsolver.tech/framed-answer-today'
    }
  };

  setHeaders({
    'X-Puzzle-Date': activeMode.dateKey,
    'X-Edge-Cache-Bypass': isCurrent ? '0' : '1'
  });

  return {
    mode,
    dayNumber: activeMode.dayNumber,
    formattedDate,
    movie: activeMode.movie,
    modes,
    schemas: JSON.stringify([faqSchema, articleSchema]),
    meta: {
      title: pageTitle,
      description: pageDescription,
      keywords: pageKeywords,
      featuredImage
    }
  };
};
