<script lang="ts">
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import InternalLinkSection from '$lib/components/InternalLinkSection.svelte';
  import { formatPopulation, formatTemperature } from '$lib/countryle';

  let { data } = $props();
  let revealed = $state(false);

  function formatEntryDate(dateKey: string) {
    return new Date(`${dateKey}T12:00:00Z`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    });
  }

  const continentEmoji: Record<string, string> = {
    Africa: '\u{1F30D}',
    Europe: '\u{1F30D}',
    Asia: '\u{1F30F}',
    Oceania: '\u{1F30F}',
    'North America': '\u{1F30E}',
    'South America': '\u{1F30E}',
    Antarctica: '\u{2744}\u{FE0F}'
  };
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <meta name="keywords" content={data.meta.keywords} />
  <link rel="canonical" href={data.meta.canonical} />
  <meta property="og:title" content={data.meta.title} />
  <meta property="og:description" content={data.meta.description} />
  <meta property="og:url" content={data.meta.canonical} />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta property="og:image" content={`https://wordsolver.tech${data.meta.featuredImage}`} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.meta.title} />
  <meta name="twitter:description" content={data.meta.description} />
  <meta name="twitter:image" content={`https://wordsolver.tech${data.meta.featuredImage}`} />
  {@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-emerald-50/60 via-white to-slate-50">
  <div class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
    <Breadcrumbs />

    {#if data.today}
      <!-- Hero -->
      <section class="mt-6 rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-[0_20px_60px_rgba(16,185,129,0.08)] sm:p-10">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div class="max-w-2xl">
            <p class="text-xs font-bold uppercase tracking-[0.3em] text-emerald-600">Daily Geography Puzzle</p>
            <h1 class="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Countryle Answer Today ({data.formattedDate})
            </h1>
            <p class="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Game #{data.today.gameNumber}. Guess the mystery country using geography clues like continent, hemisphere, population, and temperature. Today's verified answer and stats are below.
            </p>
          </div>
          <div class="flex shrink-0 flex-wrap gap-3">
            <a href="/countryle-solver" class="inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-xl">Open Solver</a>
            <a href="/countryle-archive" class="inline-flex items-center rounded-full border border-emerald-200 bg-white px-6 py-3 text-sm font-bold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50">Browse Archive</a>
          </div>
        </div>
      </section>

      <!-- Answer Card -->
      <section class="mt-8 rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-[0_20px_60px_rgba(16,185,129,0.06)] sm:p-10">
        <h2 class="text-center text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Today's Country</h2>
        <p class="mt-2 text-center text-sm text-slate-500">Game #{data.today.gameNumber} &middot; {data.formattedDate}</p>

        <!-- Reveal Button / Country Name -->
        <div class="mx-auto mt-8 flex flex-col items-center">
          {#if !revealed}
            <button
              type="button"
              class="group relative rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 px-12 py-8 transition hover:border-emerald-400 hover:bg-emerald-50"
              onclick={() => (revealed = true)}
            >
              <div class="flex flex-col items-center gap-3">
                <svg class="h-10 w-10 text-emerald-400 transition group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span class="text-sm font-bold text-emerald-700">Click to Reveal Answer</span>
              </div>
            </button>
          {:else}
            <div class="flex flex-col items-center gap-2">
              <span class="text-4xl">{continentEmoji[data.today.country.continent] ?? '\u{1F30D}'}</span>
              <h3 class="text-4xl font-black tracking-tight text-emerald-700 sm:text-5xl">{data.today.country.country}</h3>
              <p class="mt-1 rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">{data.today.country.continent} &middot; {data.today.country.hemisphere}</p>
            </div>
          {/if}
        </div>

        <!-- Country Facts Grid (shown after reveal) -->
        {#if revealed}
          <div class="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3">
            <div class="rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/60 p-5 text-center">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Continent</p>
              <p class="mt-2 text-lg font-bold text-slate-900">{data.today.country.continent}</p>
            </div>
            <div class="rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/60 p-5 text-center">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Hemisphere</p>
              <p class="mt-2 text-lg font-bold text-slate-900">{data.today.country.hemisphere}</p>
            </div>
            <div class="rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/60 p-5 text-center">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Population</p>
              <p class="mt-2 text-lg font-bold text-slate-900">{formatPopulation(data.today.country.population)}</p>
            </div>
            <div class="rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/60 p-5 text-center">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Surface Area</p>
              <p class="mt-2 text-lg font-bold text-slate-900">{data.today.country.surface.toLocaleString()} km&sup2;</p>
            </div>
            <div class="rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/60 p-5 text-center">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Avg. Temp</p>
              <p class="mt-2 text-lg font-bold text-slate-900">{formatTemperature(data.today.country.avgTemperature)}</p>
            </div>
            <div class="rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/60 p-5 text-center">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Coordinates</p>
              <p class="mt-2 text-sm font-bold text-slate-900">{data.today.country.coordinates}</p>
            </div>
          </div>

          {#if data.today.country.mapsUrl}
            <div class="mt-6 text-center">
              <a href={data.today.country.mapsUrl} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                View on Google Maps
              </a>
            </div>
          {/if}

          <button
            type="button"
            class="mx-auto mt-5 block text-sm font-semibold text-emerald-600 underline underline-offset-4 hover:text-emerald-500"
            onclick={() => (revealed = false)}
          >
            Hide answer
          </button>
        {/if}
      </section>

      <!-- Recent Answers -->
      <section class="mt-8 rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-[0_20px_60px_rgba(16,185,129,0.06)] sm:p-10">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <h2 class="text-2xl font-black tracking-tight text-slate-900">Recent Countryle Answers</h2>
          <a href="/countryle-archive" class="text-sm font-bold text-emerald-600 hover:text-emerald-500">Full archive &rarr;</a>
        </div>

        <div class="mt-6 divide-y divide-slate-100">
          {#each data.recentEntries as entry}
            <a href="/countryle-archive" class="group flex items-center justify-between gap-4 py-4 transition first:pt-0 last:pb-0 hover:bg-emerald-50/40 -mx-3 px-3 rounded-xl">
              <div class="flex items-center gap-4">
                <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">
                  #{entry.gameNumber}
                </span>
                <div>
                  <p class="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{entry.country.country}</p>
                  <p class="text-sm text-slate-500">{formatEntryDate(entry.date)}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 sm:inline-flex">{entry.country.continent}</span>
                <span class="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 sm:inline-flex">{entry.country.hemisphere}</span>
                <svg class="h-4 w-4 text-slate-300 transition group-hover:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
              </div>
            </a>
          {/each}
        </div>
      </section>

      <!-- How It Works -->
      <section class="mt-8 rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-[0_20px_60px_rgba(16,185,129,0.06)] sm:p-10">
        <h2 class="text-center text-2xl font-black tracking-tight text-slate-900">How Countryle Works</h2>
        <div class="mx-auto mt-8 grid max-w-3xl gap-6 sm:grid-cols-3">
          <div class="rounded-2xl bg-emerald-50/60 p-6 text-center">
            <div class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">1</div>
            <h3 class="mt-4 text-base font-bold text-slate-900">Guess a country</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-600">Type any country name as your first guess and submit it.</p>
          </div>
          <div class="rounded-2xl bg-emerald-50/60 p-6 text-center">
            <div class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">2</div>
            <h3 class="mt-4 text-base font-bold text-slate-900">Read the clues</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-600">Compare continent, hemisphere, population, temperature, and surface area with arrow hints.</p>
          </div>
          <div class="rounded-2xl bg-emerald-50/60 p-6 text-center">
            <div class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">3</div>
            <h3 class="mt-4 text-base font-bold text-slate-900">Narrow it down</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-600">Each guess reveals more info. Find the target country in as few guesses as possible.</p>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="mt-8 rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-[0_20px_60px_rgba(16,185,129,0.06)] sm:p-10">
        <h2 class="text-center text-2xl font-black tracking-tight text-slate-900">Frequently Asked Questions</h2>
        <div class="mx-auto mt-8 max-w-3xl divide-y divide-slate-100">
          <details class="group py-5 first:pt-0 last:pb-0">
            <summary class="flex cursor-pointer items-center justify-between font-bold text-slate-900">
              What is the Countryle answer for {data.formattedDate}?
              <svg class="h-5 w-5 shrink-0 text-slate-400 transition group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <p class="mt-3 text-sm leading-relaxed text-slate-600">The Countryle answer for {data.formattedDate} is <strong>{data.today.country.country}</strong>, located in {data.today.country.continent} ({data.today.country.hemisphere} hemisphere). Click "Reveal Answer" above to see the full country details including population, surface area, and coordinates.</p>
          </details>
          <details class="group py-5 first:pt-0 last:pb-0">
            <summary class="flex cursor-pointer items-center justify-between font-bold text-slate-900">
              How does Countryle work?
              <svg class="h-5 w-5 shrink-0 text-slate-400 transition group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <p class="mt-3 text-sm leading-relaxed text-slate-600">Countryle is a daily geography guessing game. Each day a mystery country is picked and you guess countries to receive clues about continent, hemisphere, population, temperature, surface area, and proximity. The goal is to identify the country in as few guesses as possible.</p>
          </details>
          <details class="group py-5 first:pt-0 last:pb-0">
            <summary class="flex cursor-pointer items-center justify-between font-bold text-slate-900">
              Can I see older Countryle answers?
              <svg class="h-5 w-5 shrink-0 text-slate-400 transition group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <p class="mt-3 text-sm leading-relaxed text-slate-600">Yes. Use the <a href="/countryle-archive" class="font-semibold text-emerald-600 underline underline-offset-2 hover:text-emerald-500">Countryle archive</a> to look up previous dates and countries from the complete historical dataset.</p>
          </details>
          <details class="group py-5 first:pt-0 last:pb-0">
            <summary class="flex cursor-pointer items-center justify-between font-bold text-slate-900">
              Is this page updated daily?
              <svg class="h-5 w-5 shrink-0 text-slate-400 transition group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <p class="mt-3 text-sm leading-relaxed text-slate-600">Yes. This page is pre-rendered with the latest Countryle answer during each site build, which runs automatically every day. The answer data comes from a verified static dataset.</p>
          </details>
        </div>
      </section>
    {/if}

    <div class="mt-8">
      <AuthorCard
        name="Preston Hayes"
        image="/auther-wordsolverx.webp"
        description="Preston Hayes reviews WordSolverX geography answer pages and solver behavior so daily country pages stay accurate, readable, and easy to verify."
      />
    </div>

    <div class="mt-8">
      <InternalLinkSection currentGame="Countryle" />
    </div>
  </div>
</div>
