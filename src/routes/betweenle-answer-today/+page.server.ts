import type { PageServerLoad } from './$types';

import {
  formatBetweenleDate,
  getBetweenleArchive,
  getBetweenleTodayAnswer,
} from '$lib/betweenle/logic';

export const load: PageServerLoad = async () => {
  const todayAnswer = getBetweenleTodayAnswer();
  const archive = getBetweenleArchive();

  return {
    todayAnswer,
    archive,
    todayLabel: formatBetweenleDate(todayAnswer.date),
    meta: {
      title: 'Betweenle Answer Today - Daily Betweenle Archive & Calendar | WordSolverX',
      description:
        'Get the Betweenle answer today, browse the Betweenle archive by date, and check older puzzle words from the calendar.',
      canonical: 'https://wordsolverx.com/betweenle-answer-today',
    },
  };
};
