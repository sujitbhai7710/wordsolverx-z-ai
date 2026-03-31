export const GAME_START_DATES: Record<string, Date> = {
  classic: new Date("2022-03-12T00:00:00.000Z"),
  "one-frame": new Date("2024-12-03T00:00:00.000Z"),
  poster: new Date("2025-07-25T00:00:00.000Z"),
  titleshot: new Date("2025-06-05T00:00:00.000Z"),
};

export const MODE_LABELS: Record<string, string> = {
  classic: "Classic",
  "one-frame": "One Frame",
  poster: "Poster",
  titleshot: "Title Shot",
};

export const VALID_MODES = ["classic", "one-frame", "poster", "titleshot"];

export function getCurrentDayNumber(mode: string): number {
  const startDate = GAME_START_DATES[mode];
  if (!startDate) return 0;

  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const pacificYear = parseInt(parts.find((p) => p.type === "year")!.value);
  const pacificMonth = parseInt(parts.find((p) => p.type === "month")!.value);
  const pacificDay = parseInt(parts.find((p) => p.type === "day")!.value);

  const startParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(startDate);
  const startYear = parseInt(startParts.find((p) => p.type === "year")!.value);
  const startMonth = parseInt(startParts.find((p) => p.type === "month")!.value);
  const startDay = parseInt(startParts.find((p) => p.type === "day")!.value);

  const todayUTC = Date.UTC(pacificYear, pacificMonth - 1, pacificDay, 12, 0, 0);
  const startUTC = Date.UTC(startYear, startMonth - 1, startDay, 12, 0, 0);

  const diffDays = Math.floor((todayUTC - startUTC) / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

export function getDateForDay(day: number, mode: string): Date {
  const startDate = GAME_START_DATES[mode];
  if (!startDate) return new Date();
  const date = new Date(startDate);
  date.setDate(date.getDate() + day - 1);
  return date;
}

export function getTodayGameDate(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}
