import {
  formatContextoDate,
  getContextoDateFromGameNumber,
  getContextoGameNumber,
  getContextoTodayDate
} from '$lib/contexto';

export interface ContextoAnswerPayload {
  success: boolean;
  gameNumber: number;
  date: string;
  answer?: string;
  error?: string;
}

export async function fetchContextoAnswerForGame(
  gameNumber: number,
  fetchImpl: typeof fetch = fetch
): Promise<ContextoAnswerPayload> {
  const targetDate = getContextoDateFromGameNumber(gameNumber);
  const response = await fetchImpl(`https://api.contexto.me/machado/en/giveup/${gameNumber}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(response.status === 404 ? 'Game not found' : `HTTP error ${response.status}`);
  }

  const data = await response.json();
  const answer = data.word || data.answer || data;

  return {
    success: true,
    gameNumber,
    date: formatContextoDate(targetDate),
    answer: typeof answer === 'string' ? answer : answer.word || answer
  };
}

export async function fetchContextoAnswerForDate(
  targetDate: Date,
  fetchImpl: typeof fetch = fetch
): Promise<ContextoAnswerPayload> {
  const gameNumber = getContextoGameNumber(targetDate);
  return fetchContextoAnswerForGame(gameNumber, fetchImpl);
}

export async function fetchTodayContextoAnswer(
  fetchImpl: typeof fetch = fetch
): Promise<ContextoAnswerPayload> {
  return fetchContextoAnswerForDate(getContextoTodayDate(), fetchImpl);
}
