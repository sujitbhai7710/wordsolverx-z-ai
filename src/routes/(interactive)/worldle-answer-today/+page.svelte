<script lang="ts">
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import WorldleCountryCard from '$lib/components/worldle/WorldleCountryCard.svelte';
  import {
    PRESTON_HAYES_AUTHOR_DESCRIPTION,
    PRESTON_HAYES_AUTHOR_IMAGE,
    PRESTON_HAYES_AUTHOR_NAME
  } from '$lib/authors';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <meta
    name="keywords"
    content={data.meta.keywords ?? 'worldle answer today, worldle answer, worldle hint, worldle hint today'}
  />
  <link rel="canonical" href={data.meta.canonical} />
  <meta property="og:title" content={data.meta.title} />
  <meta property="og:description" content={data.meta.description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={data.meta.canonical} />
  <meta property="og:image" content="https://wordsolver.tech/wordsolverx.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.meta.title} />
  <meta name="twitter:description" content={data.meta.description} />
  <meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
  {@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-100">
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
    <Breadcrumbs />

    <section class="mt-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-700 via-blue-800 to-indigo-900 px-6 py-8 text-white shadow-2xl shadow-sky-500/20 sm:px-8 sm:py-10">
      <div class="max-w-4xl">
        <p class="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
          Server-rendered Worldle answer page
        </p>
        <h1 class="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
          Worldle Answer Today ({data.formattedTodayDate})
        </h1>
        <p class="mt-4 max-w-3xl text-base leading-7 text-sky-50/90 sm:text-lg">
          Check the verified Worldle country for {data.formattedTodayDate}, then jump to the dedicated archive page if you need an older Worldle answer.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <div class="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white">
            <img
              alt={`Flag of ${data.todayAnswer.country.name}`}
              class="h-6 w-8 rounded-md border border-white/20 object-cover"
              height="24"
              loading="lazy"
              src={`https://flagcdn.com/w40/${data.todayAnswer.country.code.toLowerCase()}.png`}
              width="32"
            />
            <span>{data.todayAnswer.country.name}</span>
          </div>
          <div class="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white">
            <span>Worldle #{data.todayAnswer.worldleNumber}</span>
          </div>
          <div class="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white">
            <span>Updates at 00:00 UTC</span>
          </div>
        </div>
      </div>
    </section>

    <div class="mt-8">
      <WorldleCountryCard
        answer={data.todayAnswer}
        headline="Today's Worldle answer"
        subheadline={`This page is refreshed automatically for the active Worldle day. Today is ${data.formattedTodayDate}.`}
      />
    </div>

    <section class="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">More Worldle tools</p>
          <h2 class="mt-1 text-3xl font-black tracking-tight text-slate-900">Open the archive or solve first</h2>
          <p class="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Older Worldle answers now live on the dedicated archive page, so this today page stays focused on the current country only.
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <a
            class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            href="/worldle-archive"
          >
            Browse Worldle Archive
          </a>
          <a
            class="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            href="/worldle-solver"
          >
            Open Worldle Solver
          </a>
        </div>
      </div>
    </section>

    <div class="mt-10 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/60">
      <FAQSection faqs={data.faqEntries} title="Worldle Answers For The Last 10 Days" />
    </div>

    <article class="mt-10 grid gap-6 lg:grid-cols-2">
      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">How Worldle works</p>
        <h2 class="mt-2 text-2xl font-bold text-slate-900">A geography puzzle with daily country clues</h2>
        <p class="mt-4 text-base leading-7 text-slate-600">
          Worldle gives you a country silhouette each day and asks you to guess the hidden country. Every incorrect guess returns a distance in kilometers, a direction arrow, and a proximity percentage. Those clues tell you how far your guess is from the target and in which direction to move next.
        </p>
        <p class="mt-4 text-base leading-7 text-slate-600">
          This page shows today&apos;s answer once you are ready to reveal it. If you need to verify an older puzzle, use the Worldle archive instead of a dated slug page.
        </p>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Why this page helps</p>
        <h2 class="mt-2 text-2xl font-bold text-slate-900">Use the answer page without leaving WordSolverX</h2>
        <p class="mt-4 text-base leading-7 text-slate-600">
          The Worldle answer page uses the same shared WordSolverX layout as the rest of the site, so it stays fast, simple, and easy to navigate. It is designed like an article for search visibility, but it still works like a practical answer tool.
        </p>
        <p class="mt-4 text-base leading-7 text-slate-600">
          If you want to solve the puzzle instead of revealing it, use the Worldle Solver. It runs in the browser and filters countries from the same base dataset used for the answer and archive views.
        </p>
      </section>
    </article>

    <div class="mt-12">
      <AuthorCard
        name={PRESTON_HAYES_AUTHOR_NAME}
        image={PRESTON_HAYES_AUTHOR_IMAGE}
        description={PRESTON_HAYES_AUTHOR_DESCRIPTION}
      />
    </div>
  </div>
</main>
