<script lang="ts">
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import InternalLinkSection from '$lib/components/InternalLinkSection.svelte';
  import { formatPopulation, formatTemperature } from '$lib/countryle';

  let { data } = $props();
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

<div class="bg-white min-h-screen py-12">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
    <Breadcrumbs />

    {#if data.today}
      <section class="rounded-3xl bg-white shadow-sm border border-gray-200 p-8">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Countryle Answer Today</p>
            <h1 class="mt-3 text-4xl font-black text-gray-900">Countryle Answer Today ({data.formattedDate})</h1>
            <p class="mt-3 text-lg text-gray-600">Game #{data.today.gameNumber} · {data.today.country.country}</p>
            <p class="mt-4 max-w-3xl text-lg text-gray-600">
              Today's Countryle country is verified from the saved static dataset generated during the site build.
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <a href="/countryle-solver" class="inline-flex items-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500">Open Solver</a>
            <a href="/countryle-archive" class="inline-flex items-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">Browse Archive</a>
          </div>
        </div>
      </section>

      <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article class="rounded-3xl bg-white shadow-sm border border-gray-200 p-8">
          <h2 class="text-2xl font-black text-gray-900">Country Details</h2>
          <div class="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div class="rounded-2xl bg-gray-50 p-4"><p class="text-sm text-gray-500">Continent</p><p class="mt-2 font-bold text-gray-900">{data.today.country.continent}</p></div>
            <div class="rounded-2xl bg-gray-50 p-4"><p class="text-sm text-gray-500">Hemisphere</p><p class="mt-2 font-bold text-gray-900">{data.today.country.hemisphere}</p></div>
            <div class="rounded-2xl bg-gray-50 p-4"><p class="text-sm text-gray-500">Population</p><p class="mt-2 font-bold text-gray-900">{formatPopulation(data.today.country.population)}</p></div>
            <div class="rounded-2xl bg-gray-50 p-4"><p class="text-sm text-gray-500">Surface Area</p><p class="mt-2 font-bold text-gray-900">{data.today.country.surface.toLocaleString()} km²</p></div>
            <div class="rounded-2xl bg-gray-50 p-4"><p class="text-sm text-gray-500">Avg. Temperature</p><p class="mt-2 font-bold text-gray-900">{formatTemperature(data.today.country.avgTemperature)}</p></div>
            <div class="rounded-2xl bg-gray-50 p-4"><p class="text-sm text-gray-500">Coordinates</p><p class="mt-2 font-bold text-gray-900">{data.today.country.coordinates}</p></div>
          </div>

          {#if data.today.country.mapsUrl}
            <a href={data.today.country.mapsUrl} target="_blank" rel="noopener noreferrer" class="mt-6 inline-flex items-center rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-100">
              View on Google Maps
            </a>
          {/if}
        </article>

        <article class="rounded-3xl bg-white shadow-sm border border-gray-200 p-8">
          <h2 class="text-2xl font-black text-gray-900">Recent Countryle Answers</h2>
          <div class="mt-6 space-y-3">
            {#each data.recentEntries as entry}
              <a href="/countryle-archive" class="block rounded-2xl border border-gray-200 p-4 hover:border-emerald-400 transition-colors">
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="font-semibold text-gray-900">{entry.country.country}</p>
                    <p class="text-sm text-gray-600">{entry.date} · #{entry.gameNumber}</p>
                  </div>
                  <span class="text-sm font-semibold text-gray-500">{entry.country.continent}</span>
                </div>
              </a>
            {/each}
          </div>
        </article>
      </section>
    {/if}

    <AuthorCard
      name="Preston Hayes"
      image="/auther-wordsolverx.webp"
      description="Preston Hayes reviews WordSolverX geography answer pages and solver behavior so daily country pages stay accurate, readable, and easy to verify."
    />

    <InternalLinkSection currentGame="Countryle" />
  </div>
</div>
