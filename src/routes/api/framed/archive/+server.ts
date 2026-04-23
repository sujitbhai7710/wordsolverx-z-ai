import { json } from '@sveltejs/kit';
import { getFramedAvailableDates, getFramedEntriesForDate } from '$lib/framed';

export function GET({ url }) {
  const date = url.searchParams.get('date') ?? '';
  const availableDates = getFramedAvailableDates();

  if (!availableDates.includes(date)) {
    return json({ entries: [] }, { status: 404 });
  }

  return json({ entries: getFramedEntriesForDate(date) });
}
