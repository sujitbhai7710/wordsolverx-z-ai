import type { PageServerLoad } from './$types';
import { formatContextoDate } from '$lib/contexto';

export const load: PageServerLoad = async ({ fetch }) => {
  const today = new Date();
  const dateStr = formatContextoDate(today);

  try {
    const response = await fetch(`/api/contexto/daily?date=${dateStr}`);
    if (!response.ok) {
      return { initialAnswer: null, error: 'Failed to load Contexto answer' };
    }
    const data = await response.json();
    return {
      initialAnswer: data?.success ? data : null,
      error: data?.success ? null : data?.error ?? 'Failed to load Contexto answer'
    };
  } catch (error) {
    console.error('Contexto load error:', error);
    return { initialAnswer: null, error: 'Failed to load Contexto answer' };
  }
};
