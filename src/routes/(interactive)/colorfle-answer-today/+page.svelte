<script lang="ts">
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import InternalLinkSection from '$lib/components/InternalLinkSection.svelte';
  import { getContrastColor } from '$lib/colorfle';

  let { data } = $props();
  let revealed = $state(false);

  function formatEntryDate(isoDate: string) {
    const d = new Date(isoDate + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
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

<div class="min-h-screen bg-gradient-to-b from-slate-50 via-white to-pink-50/30">
  <div class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
    <Breadcrumbs />

    <!-- Hero -->
    <section class="mt-6 rounded-[2rem] border border-pink-100 bg-white p-8 shadow-[0_20px_60px_rgba(236,72,153,0.08)] sm:p-10">
      <p class="text-xs font-bold uppercase tracking-[0.3em] text-pink-500">Daily Color Puzzle</p>
      <h1 class="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
        Colorfle Answer Today ({data.formattedDate})
      </h1>
      <p class="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
        Puzzle #{data.answer.puzzleNumber} — Colorfle shows you a target color and you guess the three colors that mix to create it. See today's exact answer below.
      </p>
      <div class="mt-6 flex flex-wrap gap-3">
        <a href="/colorfle-solver" class="inline-flex items-center rounded-full bg-pink-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-pink-500/20 transition hover:-translate-y-0.5 hover:bg-pink-500 hover:shadow-xl">Open Solver</a>
        <a href="/colorfle-archive" class="inline-flex items-center rounded-full border border-pink-200 bg-white px-6 py-3 text-sm font-bold text-pink-700 transition hover:border-pink-300 hover:bg-pink-50">Browse Archive</a>
      </div>
    </section>

    <!-- Today's Answer — Visual Display -->
    <section class="mt-8 rounded-[2rem] border border-pink-100 bg-white p-8 shadow-[0_20px_60px_rgba(236,72,153,0.06)] sm:p-10">
      <h2 class="text-center text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Today's Colorfle Answer</h2>
      <p class="mt-2 text-center text-sm text-slate-500">Puzzle #{data.answer.puzzleNumber} &middot; {data.formattedDate}</p>

      <!-- Target Color Circle -->
      <div class="relative mx-auto mt-8 flex flex-col items-center">
        <button
          type="button"
          class="group relative cursor-pointer"
          onclick={() => (revealed = !revealed)}
          aria-label={revealed ? 'Hide target color' : 'Reveal target color'}
        >
          <div
            class="h-52 w-52 rounded-full shadow-2xl ring-4 ring-white transition-all duration-500 sm:h-64 sm:w-64"
            style={`background:${data.answer.targetColor.hex}; filter:${revealed ? 'none' : 'blur(32px) brightness(0.7) saturate(0.5)'}; box-shadow: 0 24px 60px ${data.answer.targetColor.hex}44`}
          ></div>
          {#if !revealed}
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="rounded-full bg-white/90 px-5 py-2.5 text-sm font-bold text-slate-700 shadow-lg backdrop-blur-sm">Click to Reveal</span>
            </div>
          {:else}
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-2xl font-black tracking-wider sm:text-3xl" style={`color:${getContrastColor(data.answer.targetColor.hex)}`}>{data.answer.targetColor.hex}</span>
              <span class="mt-1 text-xs font-semibold opacity-75" style={`color:${getContrastColor(data.answer.targetColor.hex)}`}>
                RGB({data.answer.targetColor.rgb.r}, {data.answer.targetColor.rgb.g}, {data.answer.targetColor.rgb.b})
              </span>
            </div>
          {/if}
          <!-- Similarity badge -->
          {#if revealed}
            <div
              class="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full text-xs font-black text-white shadow-lg sm:h-14 sm:w-14 sm:text-sm"
              style={`background:${data.answer.targetColor.hex}; border: 3px solid white;`}
            >
              100%
            </div>
          {/if}
        </button>
      </div>

      <!-- Component Colors Squares -->
      <div class="mx-auto mt-10 flex items-center justify-center gap-4 sm:gap-6">
        {#each data.answer.colors as color}
          <div class="flex flex-col items-center gap-2">
            <div
              class="h-16 w-16 rounded-xl shadow-lg ring-[3px] ring-emerald-500 sm:h-20 sm:w-20"
              style={`background:${color.hex}`}
            ></div>
            <p class="text-xs font-bold text-slate-700 sm:text-sm">{color.name}</p>
            <p class="font-mono text-[10px] text-slate-400 sm:text-xs">{color.hex}</p>
            {#if color.weight != null}
              <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 sm:text-xs">
                {Math.round(color.weight * 100)}%
              </span>
            {/if}
          </div>
        {/each}
      </div>

      <!-- Color Breakdown -->
      {#if revealed}
        <div class="mx-auto mt-10 max-w-lg rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50/50 to-white p-6">
          <h3 class="text-center text-sm font-bold uppercase tracking-[0.2em] text-pink-600">Color Breakdown</h3>
          <p class="mt-3 text-center text-sm leading-relaxed text-slate-600">
            Mixing
            {#each data.answer.colors as color, i}
              <span class="inline-flex items-center gap-1">
                <span class="inline-block h-3 w-3 rounded-sm" style={`background:${color.hex}`}></span>
                <strong>{color.name}</strong>{#if color.weight != null} ({Math.round(color.weight * 100)}%){/if}{#if i < data.answer.colors.length - 2},{:else if i === data.answer.colors.length - 2} and{/if}
              </span>
            {/each}
            produces the target color
            <span class="inline-flex items-center gap-1">
              <span class="inline-block h-3 w-3 rounded-sm" style={`background:${data.answer.targetColor.hex}`}></span>
              <strong>{data.answer.targetColor.hex}</strong>
            </span>.
          </p>
        </div>
      {/if}

      {#if !revealed}
        <p class="mt-6 text-center text-xs text-slate-400">Click the circle above to reveal today's target color</p>
      {:else}
        <button
          type="button"
          class="mx-auto mt-6 block text-sm font-semibold text-pink-600 underline underline-offset-4 hover:text-pink-500"
          onclick={() => (revealed = false)}
        >
          Hide answer
        </button>
      {/if}
    </section>

    <!-- Recent Archive -->
    <section class="mt-8 rounded-[2rem] border border-pink-100 bg-white p-8 shadow-[0_20px_60px_rgba(236,72,153,0.06)] sm:p-10">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <h2 class="text-2xl font-black tracking-tight text-slate-900">Recent Colorfle Answers</h2>
        <a href="/colorfle-archive" class="text-sm font-bold text-pink-600 hover:text-pink-500">View full archive &rarr;</a>
      </div>

      <div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {#each data.recentEntries as entry}
          <a href="/colorfle-archive" class="group block rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/50 p-5 transition hover:border-pink-200 hover:shadow-lg hover:shadow-pink-100/40">
            <!-- Mini target circle -->
            <div class="flex items-center justify-center">
              <div
                class="h-24 w-24 rounded-full shadow-md ring-2 ring-white transition-transform group-hover:scale-105"
                style={`background:${entry.targetColor.hex}; box-shadow: 0 12px 30px ${entry.targetColor.hex}33`}
              ></div>
            </div>
            <!-- Component color mini squares -->
            <div class="mt-4 flex items-center justify-center gap-2">
              {#each entry.colors as color}
                <div
                  class="h-8 w-8 rounded-lg ring-2 ring-emerald-500"
                  style={`background:${color.hex}`}
                  title={color.name}
                ></div>
              {/each}
            </div>
            <!-- Info -->
            <div class="mt-3 text-center">
              <p class="text-sm font-bold text-slate-800">#{entry.puzzleNumber}</p>
              <p class="mt-0.5 text-xs text-slate-500">{formatEntryDate(entry.date)}</p>
              <p class="mt-1 font-mono text-xs text-slate-400">{entry.targetColor.hex}</p>
            </div>
          </a>
        {/each}
      </div>
    </section>

    <div class="mt-8">
      <AuthorCard
        name="Preston Hayes"
        image="/auther-wordsolverx.webp"
        description="Preston Hayes reviews daily puzzle answer pages, archive accuracy, and solver logic at WordSolverX so each page stays useful, fast, and easy to verify."
      />
    </div>

    <div class="mt-8">
      <InternalLinkSection currentGame="Colorfle" />
    </div>
  </div>
</div>
