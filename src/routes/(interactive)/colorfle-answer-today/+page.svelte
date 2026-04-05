<script lang="ts">
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import InternalLinkSection from '$lib/components/InternalLinkSection.svelte';
  import { getContrastColor } from '$lib/colorfle';

  let { data } = $props();
  let revealed = $state(false);
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
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
    <Breadcrumbs />

    <section class="rounded-3xl bg-white shadow-sm border border-gray-200 p-8">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-pink-600">Colorfle Answer Today</p>
          <h1 class="mt-3 text-4xl font-black text-gray-900">Colorfle Answer Today ({data.formattedDate})</h1>
          <p class="mt-4 max-w-3xl text-lg text-gray-600">
            Puzzle #{data.answer.puzzleNumber}. Colorfle shows you a target color and you guess the three colors that mix to create it. See the answer below.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <a href="/colorfle-solver" class="inline-flex items-center rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white hover:bg-pink-500">Open Solver</a>
          <a href="/colorfle-archive" class="inline-flex items-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">Browse Archive</a>
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <article class="rounded-3xl bg-white shadow-sm border border-gray-200 p-8">
        <h2 class="text-2xl font-black text-gray-900">Today's Colorfle Colors</h2>
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {#each data.answer.colors as color}
            <div class="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              <div class="h-32" style={`background:${color.hex}`}></div>
              <div class="p-4">
                <p class="font-semibold text-gray-900">{color.name}</p>
                <p class="mt-1 font-mono text-sm text-gray-600">{color.hex}</p>
                <p class="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                  Weight {Math.round((color.weight ?? 0) * 100)}%
                </p>
              </div>
            </div>
          {/each}
        </div>

        <div class="mt-8 rounded-2xl border border-dashed border-pink-300 p-5">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.22em] text-pink-600">Target Color</p>
              <p class="mt-2 text-sm text-gray-600">Reveal the final Colorfle hex and RGB values.</p>
            </div>
            <button
              type="button"
              class="rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-500"
              onclick={() => (revealed = !revealed)}
            >
              {revealed ? 'Hide Target' : 'Reveal Target'}
            </button>
          </div>

          <div class="mt-5 rounded-2xl overflow-hidden border border-gray-200">
            <div
              class="h-56 flex items-center justify-center"
              style={`background:${data.answer.targetColor.hex}; color:${getContrastColor(data.answer.targetColor.hex)}; filter:${revealed ? 'none' : 'blur(28px) brightness(0.8)'}`}
            >
              <span class="text-3xl font-black tracking-wider">{data.answer.targetColor.hex}</span>
            </div>
            {#if revealed}
              <div class="grid grid-cols-3 gap-4 p-5 bg-white">
                <div>
                  <p class="text-xs uppercase tracking-[0.2em] text-gray-500">Red</p>
                  <p class="mt-2 text-xl font-bold text-gray-900">{data.answer.targetColor.rgb.r}</p>
                </div>
                <div>
                  <p class="text-xs uppercase tracking-[0.2em] text-gray-500">Green</p>
                  <p class="mt-2 text-xl font-bold text-gray-900">{data.answer.targetColor.rgb.g}</p>
                </div>
                <div>
                  <p class="text-xs uppercase tracking-[0.2em] text-gray-500">Blue</p>
                  <p class="mt-2 text-xl font-bold text-gray-900">{data.answer.targetColor.rgb.b}</p>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </article>

      <article class="rounded-3xl bg-white shadow-sm border border-gray-200 p-8">
        <h2 class="text-2xl font-black text-gray-900">Recent Colorfle Answers</h2>
        <div class="mt-6 space-y-3">
          {#each data.recentEntries as entry}
            <a href="/colorfle-archive" class="block rounded-2xl border border-gray-200 p-4 hover:border-pink-400 transition-colors">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="font-semibold text-gray-900">#{entry.puzzleNumber}</p>
                  <p class="text-sm text-gray-600">{entry.date}</p>
                </div>
                <div class="flex items-center gap-2">
                  {#each entry.colors as color}
                    <span class="h-8 w-8 rounded-lg border border-gray-200" style={`background:${color.hex}`}></span>
                  {/each}
                  <span class="h-8 w-8 rounded-lg border-2 border-gray-900" style={`background:${entry.targetColor.hex}`}></span>
                </div>
              </div>
            </a>
          {/each}
        </div>
      </article>
    </section>

    <AuthorCard
      name="Preston Hayes"
      image="/auther-wordsolverx.webp"
      description="Preston Hayes reviews daily puzzle answer pages, archive accuracy, and solver logic at WordSolverX so each page stays useful, fast, and easy to verify."
    />

    <InternalLinkSection currentGame="Colorfle" />
  </div>
</div>
