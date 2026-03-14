import type { RequestHandler } from './$types';
import {
  formatContextoDate,
  getContextoDateFromGameNumber,
  getContextoGameNumber,
  getContextoTodayDate
} from '$lib/contexto';

export const GET: RequestHandler = async ({ url }) => {
  const dateStr = url.searchParams.get('date');
  const gameNumberStr = url.searchParams.get('game');

  let gameNumber: number;
  let targetDate: Date;

  if (gameNumberStr) {
    gameNumber = Number.parseInt(gameNumberStr, 10);
    if (Number.isNaN(gameNumber) || gameNumber < 1) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid game number' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    targetDate = getContextoDateFromGameNumber(gameNumber);
  } else {
    if (dateStr) {
      const [year, month, day] = dateStr.split('-').map(Number);
      targetDate = new Date(year, month - 1, day);
    } else {
      targetDate = getContextoTodayDate();
    }
    gameNumber = getContextoGameNumber(targetDate);
  }

  const today = getContextoTodayDate();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(targetDate);
  compareDate.setHours(0, 0, 0, 0);

  if (compareDate > today) {
    return new Response(
      JSON.stringify({ success: false, error: 'Cannot fetch answers for future dates' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const response = await fetch(`https://api.contexto.me/machado/en/giveup/${gameNumber}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Game not found. This game number may not exist yet.',
            gameNumber,
            date: formatContextoDate(targetDate)
          }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    const answer = data.word || data.answer || data;

    return new Response(
      JSON.stringify({
        success: true,
        gameNumber,
        date: formatContextoDate(targetDate),
        answer: typeof answer === 'string' ? answer : answer.word || answer
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Contexto API error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to fetch from Contexto API',
        gameNumber,
        date: formatContextoDate(targetDate)
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
