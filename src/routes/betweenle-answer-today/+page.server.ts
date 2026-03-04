import type { PageServerLoad } from './$types';

import {
  formatBetweenleDate,
  getBetweenleArchive,
  getBetweenleTodayAnswer,
  parseDateKey,
} from '$lib/betweenle/logic';

export const load: PageServerLoad = async () => {
  const todayAnswer = getBetweenleTodayAnswer();
  const archive = getBetweenleArchive();
  const todaySeoDate = parseDateKey(todayAnswer.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const pageTitle = `Betweenle Hints and Answer for Today (${todaySeoDate})`;
  const pageDescription = `Get Betweenle hints and the confirmed Betweenle answer for today, ${todaySeoDate}. Check the live puzzle word first, then browse the full Betweenle archive calendar.`;
  const pageKeywords = `betweenle answer today, betweenle answer, betweenle hint, betweenle hint today, betweenle answer for ${todaySeoDate}`;

  return {
    todayAnswer,
    archive,
    todayLabel: formatBetweenleDate(todayAnswer.date),
    todaySeoDate,
    meta: {
      title: pageTitle,
      description: pageDescription,
      keywords: pageKeywords,
      canonical: 'https://wordsolverx.com/betweenle-answer-today',
    },
  };
};
