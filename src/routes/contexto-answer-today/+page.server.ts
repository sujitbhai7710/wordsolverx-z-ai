import type { PageServerLoad } from './$types';

interface ContextoAnswerResponse {
  success: boolean;
  gameNumber: number;
  date: string;
  answer?: string;
  error?: string;
}

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
  try {
    const response = await fetch('/api/contexto/daily');
    const latestAnswer = (await response.json()) as ContextoAnswerResponse;

    if (!response.ok || !latestAnswer?.success) {
      return {
        initialAnswer: null,
        latestDate: latestAnswer?.date ?? null,
        error: latestAnswer?.error ?? 'Failed to load Contexto answer'
      };
    }

    setHeaders({
      'X-Puzzle-Date': latestAnswer.date
    });

    return {
      initialAnswer: latestAnswer,
      latestDate: latestAnswer.date,
      error: null
    };
  } catch (error) {
    console.error('Contexto load error:', error);
    return { initialAnswer: null, latestDate: null, error: 'Failed to load Contexto answer' };
  }
};
