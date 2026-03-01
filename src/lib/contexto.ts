// Contexto game number reference: March 1, 2026 = game 1260
const REFERENCE_DATE = new Date(2026, 2, 1);
const REFERENCE_GAME_NUMBER = 1260;

export function getContextoGameNumber(date: Date): number {
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const refDate = new Date(
    REFERENCE_DATE.getFullYear(),
    REFERENCE_DATE.getMonth(),
    REFERENCE_DATE.getDate()
  );
  const diffTime = targetDate.getTime() - refDate.getTime();
  const diffDays = Math.floor(diffTime / 86400000);
  return REFERENCE_GAME_NUMBER + diffDays;
}

export function getContextoDateFromGameNumber(gameNumber: number): Date {
  const diffDays = gameNumber - REFERENCE_GAME_NUMBER;
  const date = new Date(REFERENCE_DATE);
  date.setDate(date.getDate() + diffDays);
  return date;
}

export function formatContextoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
}
