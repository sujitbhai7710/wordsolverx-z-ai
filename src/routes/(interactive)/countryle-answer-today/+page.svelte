<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import {
    PRESTON_HAYES_AUTHOR_DESCRIPTION,
    PRESTON_HAYES_AUTHOR_IMAGE,
    PRESTON_HAYES_AUTHOR_NAME,
  } from '$lib/authors';
  import { parseCoordinates } from '$lib/countryle';

  let { data } = $props();
  const todayAnswer = $derived.by(() => data.todayAnswer ?? {
    country: 'Unavailable',
    continent: 'Unavailable',
    hemisphere: 'Unavailable',
    population: 0,
    surface: 0,
    avgTemperature: 0,
    coordinates: '0,0',
    mapsUrl: '#'
  });
  const coords = $derived(parseCoordinates(todayAnswer.coordinates));
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <meta name="keywords" content={data.meta.keywords ?? 'countryle answer today, countryle answer, countryle hint'} />
  <link rel="canonical" href={data.meta.canonical} />
  {@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
    <Breadcrumbs />

    <section class="mt-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 via-teal-800 to-cyan-900 px-6 py-8 text-white shadow-2xl shadow-emerald-500/20 sm:px-8 sm:py-10">
      <div class="max-w-4xl">
        <p class="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
          Daily Countryle answer
        </p>
        <h1 class="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
          Countryle Answer for Today ({data.formattedTodayDate})
        </h1>
        <p class="mt-4 max-w-3xl text-base leading-7 text-emerald-50/90 sm:text-lg">
          The current Countryle country and all of the core clue properties used by the game.
        </p>
      </div>
    </section>

    <div class="mt-8 rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
      <div class="p-8 text-center">
        <div class="mb-6">
          <span class="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium tracking-wide text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            TODAY'S ANSWER
          </span>
        </div>
        <h2 class="mb-8 text-5xl font-black tracking-tight text-slate-900 dark:text-white">{todayAnswer.country}</h2>
        <div class="grid gap-4 text-left md:grid-cols-2 lg:grid-cols-3">
          <div class="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-5 dark:from-slate-700 dark:to-slate-600">
            <div class="text-sm font-medium text-slate-500 dark:text-slate-400">Continent</div>
            <div class="mt-1 text-lg font-bold text-slate-900 dark:text-white">{todayAnswer.continent}</div>
          </div>
          <div class="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5 dark:from-slate-700 dark:to-slate-600">
            <div class="text-sm font-medium text-slate-500 dark:text-slate-400">Hemisphere</div>
            <div class="mt-1 text-lg font-bold text-slate-900 dark:text-white">{todayAnswer.hemisphere}</div>
          </div>
          <div class="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-5 dark:from-slate-700 dark:to-slate-600">
            <div class="text-sm font-medium text-slate-500 dark:text-slate-400">Population</div>
            <div class="mt-1 text-lg font-bold text-slate-900 dark:text-white">{todayAnswer.population.toLocaleString()}</div>
          </div>
          <div class="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-5 dark:from-slate-700 dark:to-slate-600">
            <div class="text-sm font-medium text-slate-500 dark:text-slate-400">Surface Area</div>
            <div class="mt-1 text-lg font-bold text-slate-900 dark:text-white">{todayAnswer.surface.toLocaleString()} km²</div>
          </div>
          <div class="rounded-xl bg-gradient-to-br from-rose-50 to-red-50 p-5 dark:from-slate-700 dark:to-slate-600">
            <div class="text-sm font-medium text-slate-500 dark:text-slate-400">Avg Temperature</div>
            <div class="mt-1 text-lg font-bold text-slate-900 dark:text-white">{todayAnswer.avgTemperature.toFixed(1)}°C</div>
          </div>
          <div class="rounded-xl bg-gradient-to-br from-cyan-50 to-sky-50 p-5 dark:from-slate-700 dark:to-slate-600">
            <div class="text-sm font-medium text-slate-500 dark:text-slate-400">Coordinates</div>
            <div class="mt-1 text-lg font-bold text-slate-900 dark:text-white">{coords.lat.toFixed(2)}°, {coords.lng.toFixed(2)}°</div>
          </div>
        </div>
        <div class="mt-6">
          <a
            class="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
            href={todayAnswer.mapsUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            View on Google Maps
          </a>
        </div>
      </div>
    </div>

    <section class="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">More Countryle tools</p>
          <h2 class="mt-1 text-3xl font-black tracking-tight text-slate-900 dark:text-white">Browse the archive or solve first</h2>
          <p class="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Older Countryle answers are available on the archive page. If you prefer to solve the puzzle yourself, use the interactive solver.
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <a
            class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            href="/countryle-archive"
          >
            Browse Countryle Archive
          </a>
          <a
            class="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-900/70"
            href="/countryle-solver"
          >
            Open Countryle Solver
          </a>
        </div>
      </div>
    </section>

    <div class="mt-10 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
      <FAQSection faqs={data.faqEntries} title="Countryle Frequently Asked Questions" />
    </div>

    <div class="mt-12">
      <AuthorCard
        name={PRESTON_HAYES_AUTHOR_NAME}
        image={PRESTON_HAYES_AUTHOR_IMAGE}
        description={PRESTON_HAYES_AUTHOR_DESCRIPTION}
      />
    </div>
  </div>
</main>
