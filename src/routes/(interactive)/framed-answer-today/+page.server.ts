import { getCurrentDayNumber, getDateForDay, MODE_LABELS } from '$lib/framed';
import { generateFAQSchema } from '$lib/seo';
import type { PageServerLoad } from './$types';

const MOCK_MOVIES: Record<string, { title: string; year: number }> = {
  classic: { title: 'The Shawshank Redemption', year: 1994 },
  'one-frame': { title: 'Inception', year: 2010 },
  poster: { title: 'Pulp Fiction', year: 1994 },
  titleshot: { title: 'The Dark Knight', year: 2008 },
};

export const load: PageServerLoad = async () => {
  const mode = 'classic';
  const dayNumber = getCurrentDayNumber(mode);
  const gameDate = getDateForDay(dayNumber, mode);
  const formattedDate = gameDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const movie = MOCK_MOVIES[mode];
  const featuredImage = 'https://wordsolver.tech/framed-answer-today.webp';

  const pageTitle = `Framed Hints and Answer for Today (${formattedDate})`;
  const pageDescription = `Get Framed hints and the confirmed Framed answer for today, ${formattedDate}. Today's movie is ${movie.title} (${movie.year}), Day #${dayNumber}. Classic, One Frame, Poster, and Title Shot modes covered.`;
  const pageKeywords = `framed answer today, framed answer, framed hint, framed hint today, framed movie answer, framed ${formattedDate}`;

  const faqSchema = generateFAQSchema([
    {
      question: `What is the Framed answer for ${formattedDate}?`,
      answer: `The Framed answer for ${formattedDate} is ${movie.title} (${movie.year}).`,
    },
    {
      question: 'How does Framed work?',
      answer: 'Framed shows you a single frame from a movie each day. You have six guesses to identify the film. Each wrong guess reveals an additional scene from the movie, giving you more context to work with.',
    },
    {
      question: 'What are the different Framed game modes?',
      answer: 'Framed offers four modes: Classic (guess from a scene), One Frame (only one frame shown), Poster (identify from the movie poster), and Title Shot (guess from the title card).',
    },
    {
      question: 'When does the Framed puzzle reset?',
      answer: 'The Framed puzzle resets daily at midnight UTC. A new movie is selected each day for all game modes.',
    },
    {
      question: `What hints are available for Framed Day ${dayNumber}?`,
      answer: `For Framed Day ${dayNumber}, the movie is a ${movie.year} release. Consider the genre, visual style, and any recognizable actors in the frame to narrow down your guess.`,
    },
  ]);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageTitle,
    datePublished: gameDate.toISOString(),
    dateModified: gameDate.toISOString(),
    author: {
      '@type': 'Person',
      name: 'Preston Hayes',
      image: 'https://wordsolver.tech/auther-wordsolverx.webp',
      url: 'https://wordsolver.tech/about#preston-hayes',
    },
    publisher: { '@type': 'Organization', name: 'WordSolverX' },
    description: pageDescription,
    image: [featuredImage],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://wordsolver.tech/framed-answer-today',
    },
  };

  const schemas = JSON.stringify([faqSchema, articleSchema]);

  const modes = Object.entries(MODE_LABELS).map(([key, label]) => ({
    key,
    label,
    dayNumber: getCurrentDayNumber(key),
    movie: MOCK_MOVIES[key] ?? movie,
  }));

  return {
    mode,
    dayNumber,
    formattedDate,
    movie,
    modes,
    schemas,
    meta: {
      title: pageTitle,
      description: pageDescription,
      keywords: pageKeywords,
      featuredImage,
    },
  };
};
