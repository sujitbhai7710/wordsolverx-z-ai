import { format, subDays } from 'date-fns';

// The first NYT Wordle was #219 on February 15, 2022
export const WORDLE_NYT_START_DATE = new Date('2022-02-15');
export const WORDLE_NYT_START_NUMBER = 219;

export function getWordleNumber(date: Date): number {
  const timeDiff = date.getTime() - WORDLE_NYT_START_DATE.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return WORDLE_NYT_START_NUMBER + daysDiff;
}

export function getWordleDate(number: number): Date {
  const daysDiff = number - WORDLE_NYT_START_NUMBER;
  const date = new Date(WORDLE_NYT_START_DATE);
  date.setDate(date.getDate() + daysDiff);
  return date;
}

/**
 * Get today's date in Japan Standard Time (UTC+9)
 */
export function getJSTToday(): Date {
  const now = new Date();
  const jstOffset = 9 * 60; // JST is UTC+9
  const jstTime = new Date(now.getTime() + (jstOffset + now.getTimezoneOffset()) * 60000);
  jstTime.setHours(0, 0, 0, 0);
  return jstTime;
}

/**
 * Get today's date in user's local timezone
 * Each user gets their own puzzle that resets at their local midnight
 */
export function getTodayDate(): Date {
  // Get current date in local time
  const now = new Date();

  // Normalize to the start of the day
  now.setHours(0, 0, 0, 0);

  return now;
}

/**
 * Get yesterday's date in GMT+14:00 timezone
 */
export function getYesterdayDate(): Date {
  return subDays(getTodayDate(), 1);
}

export function formatDate(date: Date): string {
  return format(date, 'MMMM d, yyyy');
}

export function formatNumber(num: number): string {
  return num.toString().padStart(3, '0');
} 