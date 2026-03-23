import { isArchiveDateInRange, parseArchiveDateKey, toArchiveDateKey } from '$lib/archive-page';
import { getContextoDateFromGameNumber } from '$lib/contexto';
import type { PageServerLoad } from './$types';

interface ContextoAnswerResponse {
  success: boolean;
  gameNumber: number;
  date: string;
  answer?: string;
  error?: string;
}

const CONTEXTO_START_DATE = getContextoDateFromGameNumber(1);

export const load: PageServerLoad = async ({ fetch, url }) => {
  const latestAnswer = await getLatestContextoAnswer(fetch);
  const latestDate = latestAnswer?.date ? new Date(`${latestAnswer.date}T12:00:00`) : null;
  const selectedDate = parseArchiveDateKey(url.searchParams.get('date'));

  if (!latestDate || !selectedDate || !isArchiveDateInRange(selectedDate, CONTEXTO_START_DATE, latestDate)) {
    return {
      selectedDateKey: null,
      selectedContexto: null,
    };
  }

  const selectedDateKey = toArchiveDateKey(selectedDate);
  const response = await fetch(`/api/contexto/daily?date=${selectedDateKey}`);
  const payload = (await response.json()) as ContextoAnswerResponse;

  return {
    selectedDateKey,
    selectedContexto: response.ok && payload.success ? payload : null,
  };
};

async function getLatestContextoAnswer(fetchFn: typeof fetch): Promise<ContextoAnswerResponse | null> {
  const response = await fetchFn('/api/contexto/daily');
  const payload = (await response.json()) as ContextoAnswerResponse;
  return response.ok && payload.success ? payload : null;
}
