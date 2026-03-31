export type FramedMode = 'classic' | 'one-frame' | 'poster' | 'titleshot';

export interface FramedMovie {
  title: string;
  year: number | null;
}

export interface FramedAnswer {
  mode: FramedMode;
  label: string;
  dateKey: string;
  dayNumber: number;
  movie: FramedMovie;
}

export const GAME_START_DATES: Record<FramedMode, Date> = {
  classic: new Date('2022-03-12T12:00:00Z'),
  'one-frame': new Date('2024-12-03T12:00:00Z'),
  poster: new Date('2025-07-25T12:00:00Z'),
  titleshot: new Date('2025-06-05T12:00:00Z')
};

export const MODE_LABELS: Record<FramedMode, string> = {
  classic: 'Classic',
  'one-frame': 'One Frame',
  poster: 'Poster',
  titleshot: 'Title Shot'
};

export const VALID_MODES: FramedMode[] = ['classic', 'one-frame', 'poster', 'titleshot'];

const DAY_MS = 86_400_000;
const FRAMED_BASE_URL = 'https://framed.wtf';
const CLASSIC_LIST_PATTERN = /\[\{title:"The Shawshank Redemption",id:\d+\}[\s\S]*?\]/;
const ONE_FRAME_LIST_PATTERN = /\[\{title:"A Fistful Of Dollars",id:\d+\}[\s\S]*?\]/;

let framedListPromise: Promise<Record<'classic' | 'one-frame', FramedMovie[]>> | null = null;

function parseMovieList(serializedList: string): FramedMovie[] {
  return [...serializedList.matchAll(/\{title:"([^"]+)",id:\d+\}/g)].map((match) => ({
    title: match[1],
    year: null
  }));
}

async function fetchFramedBundleSource(): Promise<string> {
  const response = await fetch(FRAMED_BASE_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 WordSolverX'
    }
  });

  if (!response.ok) {
    throw new Error(`Framed home request failed with ${response.status}`);
  }

  const html = await response.text();
  const appScript = html.match(/<script[^>]+src="([^"]*\/_app-[^"]+\.js)"/i)?.[1];
  if (!appScript) {
    throw new Error('Could not locate the Framed app bundle');
  }

  const bundleUrl = appScript.startsWith('http') ? appScript : new URL(appScript, FRAMED_BASE_URL).toString();
  const bundleResponse = await fetch(bundleUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 WordSolverX'
    }
  });

  if (!bundleResponse.ok) {
    throw new Error(`Framed bundle request failed with ${bundleResponse.status}`);
  }

  return bundleResponse.text();
}

async function getFramedMovieLists(): Promise<Record<'classic' | 'one-frame', FramedMovie[]>> {
  if (!framedListPromise) {
    framedListPromise = (async () => {
      const bundleSource = await fetchFramedBundleSource();
      const classicMatch = bundleSource.match(CLASSIC_LIST_PATTERN);
      const oneFrameMatch = bundleSource.match(ONE_FRAME_LIST_PATTERN);

      if (!classicMatch || !oneFrameMatch) {
        throw new Error('Could not extract the Framed movie lists');
      }

      return {
        classic: parseMovieList(classicMatch[0]),
        'one-frame': parseMovieList(oneFrameMatch[0])
      };
    })();
  }

  return framedListPromise;
}

function getDateKeyAnchor(dateKey: string): Date {
  return new Date(`${dateKey}T12:00:00Z`);
}

export function getFramedDayNumberForDate(dateKey: string, mode: FramedMode): number {
  const startDate = GAME_START_DATES[mode];
  const anchorDate = getDateKeyAnchor(dateKey);
  return Math.floor((anchorDate.getTime() - startDate.getTime()) / DAY_MS) + 1;
}

export function getDateForDay(day: number, mode: FramedMode): Date {
  return new Date(GAME_START_DATES[mode].getTime() + (day - 1) * DAY_MS);
}

async function fetchCoreFramedAnswer(mode: 'poster' | 'titleshot', dayNumber: number): Promise<FramedMovie | null> {
  const response = await fetch(`https://core.framed.wtf/${mode}/challenges/day/${dayNumber}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 WordSolverX'
    }
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { asset?: { title?: string; year?: number | null } };
  if (!payload.asset?.title) {
    return null;
  }

  return {
    title: payload.asset.title,
    year: payload.asset.year ?? null
  };
}

export async function fetchFramedAnswerForDateKey(dateKey: string, mode: FramedMode): Promise<FramedAnswer | null> {
  const dayNumber = getFramedDayNumberForDate(dateKey, mode);
  if (!Number.isFinite(dayNumber) || dayNumber < 1) {
    return null;
  }

  let movie: FramedMovie | null = null;

  if (mode === 'poster' || mode === 'titleshot') {
    movie = await fetchCoreFramedAnswer(mode, dayNumber);
  } else {
    const lists = await getFramedMovieLists();
    movie = lists[mode][dayNumber - 1] ?? null;
  }

  if (!movie) {
    return null;
  }

  return {
    mode,
    label: MODE_LABELS[mode],
    dateKey,
    dayNumber,
    movie
  };
}

export async function fetchRecentFramedAnswers(limit: number, mode: FramedMode, endDateKey: string): Promise<FramedAnswer[]> {
  const results: FramedAnswer[] = [];

  if (mode === 'classic' || mode === 'one-frame') {
    const lists = await getFramedMovieLists();
    const dayNumber = getFramedDayNumberForDate(endDateKey, mode);
    const movies = lists[mode];
    const maxStart = Math.min(dayNumber, movies.length);

    for (let currentDay = maxStart; currentDay >= Math.max(1, maxStart - limit + 1); currentDay -= 1) {
      const date = getDateForDay(currentDay, mode);
      results.push({
        mode,
        label: MODE_LABELS[mode],
        dateKey: date.toISOString().split('T')[0],
        dayNumber: currentDay,
        movie: movies[currentDay - 1]
      });
    }

    return results;
  }

  const endDay = getFramedDayNumberForDate(endDateKey, mode);
  for (let currentDay = endDay; currentDay >= Math.max(1, endDay - limit + 1); currentDay -= 1) {
    const date = getDateForDay(currentDay, mode);
    const movie = await fetchCoreFramedAnswer(mode, currentDay);
    if (!movie) {
      continue;
    }

    results.push({
      mode,
      label: MODE_LABELS[mode],
      dateKey: date.toISOString().split('T')[0],
      dayNumber: currentDay,
      movie
    });
  }

  return results;
}
