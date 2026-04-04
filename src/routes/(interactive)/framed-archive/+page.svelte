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

<div class="bg-black min-h-screen py-12">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <Breadcrumbs />

    <section class="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
      <p class="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">Framed Archive</p>
      <h1 class="mt-3 text-4xl font-black text-white">Past Framed Answers</h1>
      <p class="mt-4 max-w-3xl text-lg text-zinc-300">
        Select any saved date to view the Framed Classic, One Frame, Titleshot, and Poster answers from the static archive.
      </p>
    </section>

    <section class="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 space-y-5">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Selected date</p>
          <h2 class="mt-2 text-2xl font-black text-white">{formattedDate}</h2>
        </div>

        <div class="flex flex-wrap gap-3">
          <button type="button" class="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-900" onclick={() => moveSelection(1)}>Older</button>
          <button type="button" class="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-900" onclick={() => moveSelection(-1)}>Newer</button>
        </div>
      </div>

      <input
        class="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white"
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
  </div>
</div>
