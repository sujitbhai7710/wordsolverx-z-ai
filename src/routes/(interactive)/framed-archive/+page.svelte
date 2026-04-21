<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FramedAnswerCard from '$lib/components/FramedAnswerCard.svelte';
  import { formatFramedDate, getFramedAvailableDates, getFramedEntriesForDate } from '$lib/framed';

  const availableDates = getFramedAvailableDates();
  let selectedDate = $state(availableDates[0] ?? '');
  const entries = $derived(selectedDate ? getFramedEntriesForDate(selectedDate) : []);
  const formattedDate = $derived(
    selectedDate ? formatFramedDate(new Date(`${selectedDate}T00:00:00Z`)) : ''
  );

  function moveSelection(offset: number) {
    const index = availableDates.indexOf(selectedDate);
    const nextIndex = index + offset;
    if (nextIndex >= 0 && nextIndex < availableDates.length) {
      selectedDate = availableDates[nextIndex];
    }
  }
</script>

<svelte:head>
  <title>Framed Archive - Past Framed Answers by Date | WordSolverX</title>
  <meta name="description" content="Browse the Framed archive by date and reveal the saved answers for Framed Classic, One Frame, Titleshot, and Poster from the static dataset." />
  <link rel="canonical" href="https://wordsolver.tech/framed-archive" />
  <meta property="og:title" content="Framed Archive - Past Framed Answers by Date" />
  <meta property="og:description" content="Search saved Framed movie title answers by date for all supported Framed modes." />
  <meta property="og:url" content="https://wordsolver.tech/framed-archive" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Framed Archive" />
  <meta name="twitter:description" content="Browse static Framed answer history by date." />
  <meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
</svelte:head>

<div class="min-h-screen py-10">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <Breadcrumbs />

    <section class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
      <p class="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-400">Framed Archive</p>
      <h1 class="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-50">Past Framed Answers</h1>
      <p class="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
        Select any saved date to view the Framed Classic, One Frame, Titleshot, and Poster answers from the static archive.
      </p>
    </section>

    <section class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5 dark:border-slate-700 dark:bg-slate-800">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Selected date</p>
          <h2 class="mt-2 text-2xl font-black text-slate-900 dark:text-slate-50">{formattedDate}</h2>
        </div>

        <div class="flex flex-wrap gap-3">
          <button type="button" class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700" onclick={() => moveSelection(1)}>Older</button>
          <button type="button" class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700" onclick={() => moveSelection(-1)}>Newer</button>
        </div>
      </div>

      <input
        class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
        type="date"
        value={selectedDate}
        min={availableDates[availableDates.length - 1]}
        max={availableDates[0]}
        onchange={(event) => (selectedDate = (event.currentTarget as HTMLInputElement).value)}
      />
    </section>

    <section class="grid gap-5 sm:grid-cols-2">
      {#each entries as entry}
        <FramedAnswerCard game={entry.game} answer={entry.answer} puzzleNumber={entry.puzzleNumber} />
      {/each}
    </section>

    <!-- SEO Article Section -->
    <article class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
      <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 mb-6">Why the Framed Archive Matters</h2>
      <div class="prose prose-slate dark:prose-invert max-w-none">
        <p>
          The Framed archive is a comprehensive database of past movie-guessing puzzle answers, covering multiple game modes including Framed Classic, One Frame, Titleshot, and Poster. For film enthusiasts, the archive serves as both a practical tool for checking missed answers and a curated journey through cinema history. Each entry represents a movie that the Framed community was challenged to identify, creating a unique record of how the game selects and presents films to players.
        </p>
        <p>
          Studying the Framed archive reveals fascinating patterns in the game's movie selection. The curators draw from a wide range of genres, eras, and cinematic traditions, ensuring that players encounter everything from classic Hollywood films and Oscar winners to international cinema, cult favorites, and recent releases. By browsing the archive, you can see which directors, genres, and decades appear most frequently, giving you insight into the types of movies that tend to be featured in the daily puzzle rotation.
        </p>
        <p>
          The archive is particularly valuable for movie buffs who want to test their film knowledge systematically. By reviewing past answers and honestly assessing which ones you would have guessed correctly, you can identify gaps in your cinematic knowledge and focus your movie-watching on areas that need improvement. This turns the archive from a simple answer lookup into a personalized film study guide that evolves with your daily puzzle experience.
        </p>

        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Framed Answers Work</h3>
        <p>
          Framed presents players with visual clues from a movie and challenges them to identify the film title within a limited number of guesses. The different game modes vary in how they present these clues: Classic shows sequential frames from the movie, One Frame gives just a single screenshot, Titleshot uses a specially composed image, and Poster challenges players to identify the film from its movie poster. Each mode tests different aspects of film recognition and visual memory.
        </p>
        <p>
          The answer for each date is predetermined and stored in the game's static dataset. When players select a date in the archive, they can see the answer for every game mode that was active on that date. The deterministic nature of the puzzle system ensures that the archive is perfectly accurate for every past date, making it a reliable reference for checking answers, verifying streaks, or settling debates about what a particular day's movie was.
        </p>
        <p>
          Framed draws its movie selection from a curated pool that spans the full history of cinema. The selection criteria balance popular well-known films with more obscure entries, creating a difficulty curve that keeps the game engaging for both casual moviegoers and dedicated cinephiles. The archive reflects this balanced approach, with entries ranging from mainstream blockbusters to indie gems and foreign language films.
        </p>

        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Notable Past Framed Answers</h3>
        <p>
          The Framed archive contains answers spanning decades of cinema. Particularly memorable entries include iconic films that most players recognized immediately, as well as obscure titles that stumped even the most knowledgeable film enthusiasts. Horror movies, animated features, and foreign language films tend to be among the most challenging entries, while classic Hollywood films and recent popular releases generally produce higher solve rates.
        </p>
        <p>
          Director patterns are visible throughout the archive. Certain filmmakers appear multiple times, reflecting their significant impact on cinema and the game curators' recognition of their importance. Players who study these patterns can develop expectations about which directors and genres are more likely to appear, giving them a strategic advantage when approaching new daily puzzles.
        </p>

        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How to Use the Framed Archive</h3>
        <p>
          Navigate the archive using the date picker, or use the Older and Newer buttons to browse sequentially. Select any date to view the answers for all available game modes. Use the archive to catch up on missed days, study patterns in movie selection, or create a watchlist of films you didn't recognize that you want to explore further.
        </p>

        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">What game modes does the Framed archive cover?</h4>
        <p>
          The archive includes answers for Framed Classic, One Frame, Titleshot, and Poster. Each mode presents movie clues in a different visual format, and the archive records the answer for each mode on every available date.
        </p>

        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Does the Framed archive include movie posters or images?</h4>
        <p>
          The archive provides the movie titles and puzzle numbers for each date. Due to copyright considerations, the actual visual clues, frames, and posters from the game are not reproduced in the archive. The answer cards display the movie title and puzzle metadata.
        </p>

        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How can I use the archive to improve at Framed?</h4>
        <p>
          Review the archive regularly and honestly assess which movies you would have guessed correctly. For films you missed, look them up, watch trailers, and add them to your watchlist. Over time, this will expand your visual movie knowledge and improve your recognition of frames, posters, and film stills.
        </p>

        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Are Framed answers the same for all players on a given day?</h4>
        <p>
          Yes. Framed serves the same movie to all players on each date. The archive reflects the universally shared answer for every day since the game launched.
        </p>

        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How often is the Framed archive updated?</h4>
        <p>
          The archive is updated daily as new Framed puzzles are released. New entries are added automatically, maintaining a complete and current record of all past puzzle solutions.
        </p>
      </div>
    </article>
  </div>
</div>
