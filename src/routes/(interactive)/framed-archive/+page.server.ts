import { getFramedAvailableDates, getFramedEntriesForDate } from '$lib/framed';

export const prerender = true;

export function load() {
  const availableDates = getFramedAvailableDates();
  const selectedDate = availableDates[0] ?? '';

  return {
    availableDates,
    selectedDate,
    entries: selectedDate ? getFramedEntriesForDate(selectedDate) : [],
  };
}
