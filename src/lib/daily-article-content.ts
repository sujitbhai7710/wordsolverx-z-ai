import dailyArticlesJson from '$lib/generated/daily-articles.json';

export type DailyArticleGame = 'wordle' | 'colordle';
export type TodayArticleKey =
  | 'betweenle-answer-today'
  | 'canuckle-answer-today'
  | 'colordle-answer-today'
  | 'colorfle-answer-today'
  | 'contexto-answer-today'
  | 'countryle-answer-today'
  | 'dotadle-answer-today'
  | 'framed-answer-today'
  | 'globle-answer-today'
  | 'loldle-answer-today'
  | 'narutodle-answer-today'
  | 'nerdle-answer-today'
  | 'onepiecedle-answer-today'
  | 'phoodle-answer-today'
  | 'phrazle-answer-today'
  | 'pokedle-answer-today'
  | 'quordle-answer-today'
  | 'searchle-answer-today'
  | 'semantle-answer-today'
  | 'smashdle-answer-today'
  | 'spotle-answer-today'
  | 'sportle-answer-today'
  | 'worgle-answer-today'
  | 'waffle-answer-today'
  | 'wordle-answer-today'
  | 'worldle-answer-today';

export interface DailyArticleMeta {
  provider?: string;
  model?: string;
  fallbackUsed?: boolean;
  generatedAt?: string;
  wordCount?: number;
}

export interface DailyArticleContent {
  game?: DailyArticleGame;
  articleKey?: TodayArticleKey;
  date: string;
  title?: string;
  summary?: string;
  bonusHints?: string[];
  contentGuideHtml?: string;
  articleHtml?: string;
  meta?: DailyArticleMeta;
}

interface DailyArticleBundle {
  generatedAt: string | null;
  articles: Partial<Record<string, DailyArticleContent>>;
}

const dailyArticles = dailyArticlesJson as DailyArticleBundle;

function getMatchingArticle(key: string, date?: string): DailyArticleContent | null {
  const article = dailyArticles.articles?.[key];
  if (!article || article.date !== date) {
    return date ? null : article ?? null;
  }

  return article;
}

export function getDailyArticleBundle(): DailyArticleBundle {
  return dailyArticles;
}

export function getWordleDailyArticle(date: string): DailyArticleContent | null {
  return getMatchingArticle('wordle-answer-today', date);
}

export function getColordleDailyArticle(date: string): DailyArticleContent | null {
  return getMatchingArticle('colordle-answer-today', date);
}

export function getTodayPageArticle(
  articleKey: TodayArticleKey,
  date: string
): DailyArticleContent | null {
  return getMatchingArticle(articleKey, date);
}
