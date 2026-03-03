<script lang="ts">
  import type { WorldleAnswer } from '$lib/worldle/types';

  let {
    answer,
    headline = 'Answer details',
    subheadline = '',
  }: {
    answer: WorldleAnswer;
    headline?: string;
    subheadline?: string;
  } = $props();

  function formatPopulation(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  function formatArea(value: number): string {
    return `${new Intl.NumberFormat('en-US').format(value)} sq km`;
  }
</script>

<section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
  <div class="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">{headline}</p>
      {#if subheadline}
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{subheadline}</p>
      {/if}
    </div>
    <div class="inline-flex flex-wrap items-center gap-2 rounded-3xl bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-800 dark:bg-sky-900/30 dark:text-sky-200">
      <span>Worldle #{answer.worldleNumber}</span>
      <span class="h-1.5 w-1.5 rounded-full bg-sky-500"></span>
      <span>{answer.date}</span>
    </div>
  </div>

  <div class="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
    <div>
      <div class="flex flex-wrap items-center gap-4">
        <img
          alt={`Flag of ${answer.country.name}`}
          class="h-14 w-20 rounded-2xl border border-slate-200 object-cover shadow-sm dark:border-slate-700"
          height="56"
          loading="lazy"
          src={`https://flagcdn.com/w160/${answer.country.code.toLowerCase()}.png`}
          width="80"
        />
        <div>
          <h2 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {answer.country.name}
          </h2>
          <p class="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            Country code {answer.country.code}
          </p>
        </div>
      </div>

      <div class="mt-6 grid gap-4 sm:grid-cols-2">
        {#if answer.capital}
          <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Capital</p>
            <p class="mt-2 break-words text-lg font-bold text-slate-900 dark:text-white">{answer.capital.names.en}</p>
          </div>
        {/if}

        {#if answer.details?.continent}
          <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Continent</p>
            <p class="mt-2 break-words text-lg font-bold text-slate-900 dark:text-white">{answer.details.continent}</p>
          </div>
        {/if}

        <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Coordinates</p>
          <p class="mt-2 break-words text-lg font-bold text-slate-900 dark:text-white">
            {answer.country.latitude.toFixed(2)}, {answer.country.longitude.toFixed(2)}
          </p>
        </div>

        {#if answer.details?.population}
          <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Population</p>
            <p class="mt-2 text-lg font-bold text-slate-900 dark:text-white">
              {formatPopulation(answer.details.population)}
            </p>
          </div>
        {/if}

        {#if answer.details?.area}
          <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Area</p>
            <p class="mt-2 break-words text-lg font-bold text-slate-900 dark:text-white">{formatArea(answer.details.area)}</p>
          </div>
        {/if}

        {#if answer.details?.currency}
          <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Currency</p>
            <p class="mt-2 break-words text-lg font-bold text-slate-900 dark:text-white">{answer.details.currency}</p>
          </div>
        {/if}
      </div>
    </div>

    <div class="rounded-3xl bg-gradient-to-br from-sky-600 to-blue-700 p-6 text-white shadow-xl shadow-sky-500/20">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">Quick profile</p>

      {#if answer.details?.languages?.length}
        <div class="mt-5">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-sky-100/90">Languages</p>
          <p class="mt-2 break-words text-sm leading-6 text-sky-50">{answer.details.languages.join(', ')}</p>
        </div>
      {/if}

      {#if answer.details?.neighbors?.length}
        <div class="mt-5">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-sky-100/90">Neighbors</p>
          <div class="mt-3 flex flex-wrap gap-2">
            {#each answer.details.neighbors as neighbor}
              <span class="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white">{neighbor}</span>
            {/each}
          </div>
        </div>
      {/if}

      {#if answer.details?.gdpPerCapita}
        <div class="mt-5">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-sky-100/90">GDP per capita</p>
          <p class="mt-2 text-sm font-semibold text-sky-50">
            ${new Intl.NumberFormat('en-US').format(answer.details.gdpPerCapita)}
          </p>
        </div>
      {/if}

      <div class="mt-6 grid gap-3">
        <a
          class="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-sky-800 transition hover:bg-sky-50"
          href={`https://en.wikipedia.org/wiki/${encodeURIComponent(answer.country.name)}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          Open Wikipedia
        </a>
        <a
          class="inline-flex items-center justify-center rounded-2xl border border-white/25 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
          href={`https://www.google.com/maps/search/?api=1&query=${answer.country.latitude},${answer.country.longitude}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          View on map
        </a>
      </div>
    </div>
  </div>
</section>
