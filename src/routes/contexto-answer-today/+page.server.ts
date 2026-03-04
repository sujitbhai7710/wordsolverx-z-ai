import type { PageServerLoad } from './$types';
import { getContextoGameNumber } from '$lib/contexto';

interface ContextoAnswerResponse {
  success: boolean;
  gameNumber: number;
  date: string;
  answer?: string;
  error?: string;
}

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const seedGameNumber = getContextoGameNumber(new Date()) + 2;
    let latestAnswer: ContextoAnswerResponse | null = null;
    let lastError = 'Failed to load Contexto answer';

    for (let offset = 0; offset < 5; offset += 1) {
      const response = await fetch(`/api/contexto/daily?game=${seedGameNumber - offset}`);
      const payload = (await response.json()) as ContextoAnswerResponse;

      if (response.ok && payload?.success) {
        latestAnswer = payload;
        break;
      }

      if (payload?.error) {
        lastError = payload.error;
      }
    }

    if (!latestAnswer) {
      return { initialAnswer: null, latestDate: null, error: lastError };
    }

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
