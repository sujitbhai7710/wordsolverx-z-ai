<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { fetchArchivePayload } from '$lib/archive-client';
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import WordleDisplayWrapper from '$lib/components/WordleDisplayWrapper.svelte';
  import type { WordleAnswer } from '$lib/api';
  import { formatDate } from '$lib/utils';

  interface WordleArchivePayload {
    selectedDateKey: string | null;
    selectedWordle: WordleAnswer | null;
  }

  let data = $state<WordleArchivePayload>({
    selectedDateKey: null,
    selectedWordle: null
  });
  let isLoading = $state(false);
  let loadError = $state<string | null>(null);

  const startDate = new Date(2021, 5, 19);
  let selectedDateParam = $state<string | null>(browser ? new URL(window.location.href).searchParams.get('date') : null);

  onMount(() => {
    if (window.location.search || window.location.hash) {
      window.history.replaceState(window.history.state, '', window.location.pathname);
    }
  });

  function handleDateSelect(dateKey: string): void {
    selectedDateParam = dateKey;
  }

  async function loadArchive(dateKey: string | null): Promise<void> {
    if (!dateKey) {
      data.selectedDateKey = null;
      data.selectedWordle = null;
      isLoading = false;
      loadError = null;
      return;
    }

    const requestDateKey = dateKey;
    isLoading = true;
    loadError = null;

    try {
      const payload = await fetchArchivePayload<WordleArchivePayload>('wordle', requestDateKey);

      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = payload.selectedDateKey;
      data.selectedWordle = payload.selectedWordle;
    } catch (error) {
      if (selectedDateParam !== requestDateKey) {
        return;
      }

      data.selectedDateKey = requestDateKey;
      data.selectedWordle = null;
      loadError = error instanceof Error ? error.message : 'Failed to load the Wordle archive entry.';
    } finally {
      if (selectedDateParam === requestDateKey) {
        isLoading = false;
      }
    }
  }

  $effect(() => {
    if (!browser) {
      return;
    }

    void loadArchive(selectedDateParam);
  });
</script>

<svelte:head>
  <title>Wordle Answer Archive - Complete History of All Solutions | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Wordle answers by date. Calendar view with search, daily puzzle numbers, and direct links to every past solution since June 2021." />
  <link rel="canonical" href="https://wordsolverx.com/wordle-answer-archive" />
  <meta property="og:title" content="Wordle Answer Archive - All Past Solutions" />
  <meta property="og:description" content="Complete history of every Wordle answer. Browse by calendar or search by date." />
  <meta property="og:url" content="https://wordsolverx.com/wordle-answer-archive" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://wordsolverx.com/images/wordle-answer-archive.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Wordle Answer Archive - All Past Solutions | WordSolverX" />
  <meta name="twitter:description" content="Complete history of every Wordle answer with calendar view." />
  <meta name="twitter:image" content="https://wordsolverx.com/images/wordle-answer-archive.webp" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Wordle Answer Archive",
    "description": "Complete archive of all New York Times Wordle answers and solutions from June 2021 to present.",
    "url": "https://wordsolverx.com/wordle-answer-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolverx.com" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Wordle"
  gameColor="teal"
  gameIcon="??"
  {startDate}
  basePath="/wordle-answer-archive"
  selectedDate={data.selectedDateKey}
  description="Every NYT Wordle answer since the beginning. Find any past solution instantly."
  onSelectDate={handleDateSelect}
/>

<section id="archive-answer" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 scroll-mt-28">
  {#if data.selectedWordle}
    <div class="mb-5 rounded-xl border border-teal-200 bg-teal-50/70 px-5 py-4 text-sm font-medium text-teal-900 dark:border-teal-800/40 dark:bg-teal-950/20 dark:text-teal-200">
      Selected archive date: {formatDate(new Date(`${data.selectedDateKey}T00:00:00Z`))}
    </div>
    <WordleDisplayWrapper
      wordleData={data.selectedWordle}
      wordleWord={data.selectedWordle.solution}
      wordleNumber={data.selectedWordle.id}
      formattedDate={formatDate(new Date(`${data.selectedDateKey}T00:00:00Z`))}
      pageContext="archive"
      contentGuide={data.selectedWordle.content_guide}
      socialImage={data.selectedWordle.social_image}
      youtubeVideoUrl={data.selectedWordle.youtube_video_url}
    />
  {:else if loadError}
    <div class="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-800/40 dark:bg-rose-950/20">
      <h2 class="text-2xl font-bold text-rose-900 dark:text-rose-100">We couldn't load that Wordle date</h2>
      <p class="mt-3 text-rose-700 dark:text-rose-200">{loadError}</p>
    </div>
  {:else if isLoading && data.selectedDateKey}
    <div class="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Loading Wordle archive entry...</h2>
      <p class="mt-3 text-slate-600 dark:text-slate-300">
        Pulling the selected answer into this archive page now.
      </p>
    </div>
  {:else}
    <div class="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Pick a date to reveal the answer here</h2>
      <p class="mt-3 text-slate-600 dark:text-slate-300">
        Click any archived day in the calendar or list above and the full Wordle answer block will load below this section.
      </p>
    </div>
  {/if}
</section>

<!-- SEO Article Section -->
<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
  <div class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
    <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 mb-6">Why the Wordle Answer Archive Matters</h2>
    <div class="prose prose-slate dark:prose-invert max-w-none">
      <p>
        The Wordle answer archive is one of the most valuable resources for dedicated daily puzzle solvers. Since The New York Times acquired Wordle in early 2022, millions of players around the world have made the five-letter guessing game a daily ritual. However, maintaining a perfect streak requires consistency, and sometimes life gets in the way. Whether you missed a day because of travel, a busy work schedule, or simply forgot to open the browser, the archive ensures you never lose track of what happened.
      </p>
      <p>
        Beyond casual catch-up, the Wordle answer archive serves as a powerful analytical tool. Pattern recognition is a key skill in Wordle, and studying the complete history of past answers reveals fascinating trends. You can observe which letters appear most frequently as starting letters, which vowel patterns recur, and how the difficulty fluctuates over time. Some weeks cluster challenging words together, while others offer easier solutions. By reviewing the archive, players can develop more effective opening strategies and improve their average guess count.
      </p>
      <p>
        The archive also helps players understand the curated answer list that The New York Times uses. Not every valid five-letter English word appears as a Wordle solution. The NYT editors maintain a carefully selected answer list of roughly 2,300 words, chosen to avoid obscure or offensive terms. Studying the archive gives you insight into the types of words that make the cut, including common nouns, simple adjectives, and everyday verbs that most English speakers would recognize immediately.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Wordle Answers Work</h3>
      <p>
        Every Wordle puzzle operates on a simple but elegant system. Each day at midnight in your local time zone, a new five-letter word is served to every player simultaneously. The answer is deterministic, meaning every player in the world sees the same word on the same day. This shared experience is what makes Wordle such a cultural phenomenon and drives the social sharing behavior that popularized the game.
      </p>
      <p>
        The answer list is pre-determined and stored in the game's source code. When Josh Wardle originally created Wordle, he hand-picked the solutions from a list of common five-letter words. After the NYT takeover, the editorial team occasionally made small adjustments, removing words they deemed inappropriate or too obscure. The list cycles in a fixed order, so once you know the starting date, you can calculate any future or past answer by counting days. This predictability is exactly what makes the Wordle archive possible and reliable.
      </p>
      <p>
        Wordle uses a clever feedback system with colored tiles. Green tiles indicate a correct letter in the correct position, yellow tiles show a correct letter in the wrong position, and gray tiles mean the letter is not in the word at all. This color-coded system gives players up to six attempts to narrow down the possibilities. The mathematical beauty of Wordle lies in its information theory foundation: each guess should ideally eliminate as many remaining words as possible, and optimal play can theoretically solve any puzzle in about 3.4 guesses on average.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Notable Past Wordle Answers</h3>
      <p>
        Over the years, certain Wordle answers have sparked widespread discussion and frustration among players. Some of the most memorable include words with unusual letter patterns, repeated letters, or uncommon letter combinations that challenged even experienced solvers. Words ending in less common suffixes, those featuring tricky consonant clusters, and answers with double letters in unexpected positions have all caused difficulty spikes.
      </p>
      <p>
        The archive reveals that certain letter frequencies in Wordle answers differ from general English language statistics. For example, the letter S appears less often at the end of Wordle answers than you might expect, because the NYT tends to avoid plural forms. Similarly, words ending in Y are quite common, and words starting with C, S, and B appear frequently. Understanding these patterns by studying the archive can give you a meaningful edge in your daily solves.
      </p>
      <p>
        Streak data from the broader Wordle community shows that most players maintain streaks of 30 to 100 days, with elite players reaching into the hundreds. The archive is essential for streak verification, allowing you to confirm answers for any date you might have missed and retroactively fill in your score history.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How to Use the Wordle Archive</h3>
      <p>
        Using the Wordle archive on WordSolverX is straightforward. Navigate to the calendar view above and click on any date from June 19, 2021 onwards. The selected answer will load directly on this page without redirecting you to a separate URL, keeping your browsing experience smooth and efficient. Each entry includes the solution word, the puzzle number, the formatted date, and occasionally additional context like content guides or social images.
      </p>
      <p>
        To improve your Wordle skills using the archive, consider these strategies. First, review the answers from the past month and note any patterns in letter distribution. Second, pay attention to words that gave you trouble and analyze why they were difficult. Third, compare your own starting word against the optimal mathematical choices and see how your approach stacks up. Fourth, use the archive to study letter frequency data and refine your guess elimination strategy over time.
      </p>
      <p>
        Teachers and educators can also use the Wordle archive as a classroom resource. The daily puzzle format encourages vocabulary development, strategic thinking, and healthy competition. By pulling past answers from the archive, teachers can create themed word lists, vocabulary quizzes, or classroom challenges that align with their curriculum goals.
      </p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How far back does the Wordle archive go?</h4>
      <p>
        The Wordle archive on WordSolverX covers every answer from the very first puzzle on June 19, 2021 through the present day. Josh Wardle created the original game and released it to the public on that date, and the archive includes every single solution since then, including the pre-NYT era and all post-acquisition answers.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Are the archive answers guaranteed to be correct?</h4>
      <p>
        Yes. The Wordle answers in our archive are sourced directly from the official Wordle answer list maintained by The New York Times. Each entry is cross-referenced with the deterministic answer sequence, so you can trust that every solution displayed here matches exactly what appeared in the official game on that date.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can I use the archive to see future Wordle answers?</h4>
      <p>
        The archive only displays answers for dates that have already occurred. Future answers are not shown, preserving the daily challenge and surprise that makes Wordle enjoyable. We believe in maintaining the integrity of the puzzle experience while still providing a useful reference tool for past solutions.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Does the NYT ever change or remove Wordle answers?</h4>
      <p>
        On rare occasions, The New York Times has substituted a planned Wordle answer with an alternative word, typically because the original choice was deemed potentially offensive or too closely associated with a sensitive current event. When this happens, the archive reflects the answer that players actually received on that day, not the originally planned word.
      </p>

      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How does this archive differ from other Wordle answer sites?</h4>
      <p>
        WordSolverX provides a clean, calendar-based interface that loads answers inline without redirecting you to separate dated pages. This means you can quickly browse multiple dates without losing your place. The archive also includes additional metadata like puzzle numbers, formatted dates, and contextual information that many other sites lack.
      </p>
    </div>
  </div>
</article>
