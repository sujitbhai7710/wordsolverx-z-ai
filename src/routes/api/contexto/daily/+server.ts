import type { RequestHandler } from './$types';
import {
  formatContextoDate,
  getContextoDateFromGameNumber,
  getContextoGameNumber,
  getContextoTodayDate
} from '$lib/contexto';
import {
  fetchContextoAnswerForDate,
  fetchContextoAnswerForGame
} from '$lib/contexto-api';
import { getPuzzleWindow } from '$lib/puzzle-window';

const LONG_CACHE_CONTROL = 'public, max-age=0, s-maxage=2592000, stale-while-revalidate=86400';
const SHORT_RETRY_CACHE_CONTROL = 'public, max-age=0, s-maxage=30, stale-while-revalidate=30';

export const GET: RequestHandler = async ({ url }) => {
  const dateStr = url.searchParams.get('date');
  const gameNumberStr = url.searchParams.get('game');
  const visibleDate = getContextoTodayDate();
  const visibleDateKey = formatContextoDate(visibleDate);

  let gameNumber: number;
  let targetDate: Date;

  if (!dateStr && !gameNumberStr) {
    try {
      const todayAnswer = await fetchContextoAnswerForDate(visibleDate);
      return jsonResponse(
        todayAnswer,
        200,
        getLatestCacheControl(todayAnswer.date, visibleDateKey)
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return jsonResponse(
        {
          success: false,
          error:
            message === 'Game not found'
              ? "Today's Contexto answer is not available yet"
              : 'Failed to fetch the latest Contexto answer',
          date: visibleDateKey
        },
        503,
        SHORT_RETRY_CACHE_CONTROL
      );
    }
  }

  if (gameNumberStr) {
    gameNumber = Number.parseInt(gameNumberStr, 10);
    if (Number.isNaN(gameNumber) || gameNumber < 1) {
      return jsonResponse({ success: false, error: 'Invalid game number' }, 400);
    }
    targetDate = getContextoDateFromGameNumber(gameNumber);
  } else if (dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    targetDate = new Date(year, month - 1, day);
    gameNumber = getContextoGameNumber(targetDate);
  } else {
    targetDate = visibleDate;
    gameNumber = getContextoGameNumber(targetDate);
  }

  const compareDate = new Date(targetDate);
  compareDate.setHours(0, 0, 0, 0);
  const today = new Date(visibleDate);
  today.setHours(0, 0, 0, 0);

  if (compareDate > today) {
    return jsonResponse({ success: false, error: 'Cannot fetch answers for future dates' }, 400);
  }

  try {
    const payload = gameNumberStr
      ? await fetchContextoAnswerForGame(gameNumber)
      : await fetchContextoAnswerForDate(targetDate);

    return jsonResponse(
      payload,
      200,
      payload.date === visibleDateKey
        ? buildCacheControl(getPuzzleWindow('contexto').ttlSeconds, 3600)
        : LONG_CACHE_CONTROL
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message === 'Game not found') {
      return jsonResponse(
        {
          success: false,
          error: 'Game not found. This game number may not exist yet.',
          gameNumber,
          date: formatContextoDate(targetDate)
        },
        404,
        SHORT_RETRY_CACHE_CONTROL
      );
    }

    console.error('Contexto API error:', error);
    return jsonResponse(
      {
        success: false,
        error: 'Failed to fetch from Contexto API',
        gameNumber,
        date: formatContextoDate(targetDate)
      },
      500,
      SHORT_RETRY_CACHE_CONTROL
    );
  }
};

function buildCacheControl(sMaxage: number, staleWhileRevalidate = 86400): string {
  return `public, max-age=0, s-maxage=${sMaxage}, stale-while-revalidate=${staleWhileRevalidate}`;
}

function jsonResponse(body: unknown, status = 200, cacheControl?: string): Response {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (cacheControl) {
    headers['Cache-Control'] = cacheControl;
  }

  return new Response(JSON.stringify(body), { status, headers });
}

function getLatestCacheControl(actualDate: string, visibleDateKey: string): string {
  if (actualDate === visibleDateKey) {
    return buildCacheControl(getPuzzleWindow('contexto').ttlSeconds, 3600);
  }

  return SHORT_RETRY_CACHE_CONTROL;
}
