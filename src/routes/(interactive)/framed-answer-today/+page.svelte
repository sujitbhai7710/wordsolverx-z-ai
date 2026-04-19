<script lang="ts">
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FramedAnswerCard from '$lib/components/FramedAnswerCard.svelte';
  import InternalLinkSection from '$lib/components/InternalLinkSection.svelte';

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

    <section class="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600">Framed Answers Today</p>
          <h1 class="mt-3 text-4xl font-black text-gray-900">Framed Answer Today ({data.formattedDate})</h1>
          <p class="mt-4 max-w-3xl text-lg text-gray-600">
            Today's saved movie titles for Framed Classic, One Frame, Titleshot, and Poster.
          </p>
        </div>
        <a href="/framed-archive" class="inline-flex items-center rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-400">Browse Archive</a>
      </div>
    </section>

    <section class="grid gap-5 sm:grid-cols-2">
      {#if data.hasExactEntries}
        {#each data.entries as entry}
          <FramedAnswerCard game={entry.game} answer={entry.answer} puzzleNumber={entry.puzzleNumber} />
        {/each}
      {:else}
        <div class="sm:col-span-2 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          <h2 class="text-2xl font-black">Today&apos;s Framed answers are not stored yet</h2>
          <p class="mt-3 text-base text-amber-900">
            The saved dataset does not have the exact Framed entries for {data.formattedDate} yet. This page now waits for the correct date instead of silently showing an older answer set.
          </p>
          <div class="mt-5 flex flex-wrap gap-3">
            <a href="/framed-archive" class="inline-flex items-center rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-400">Browse Archive</a>
          </div>
        </div>
      {/if}
    </section>

    <AuthorCard
      name="Preston Hayes"
      image="/auther-wordsolverx.webp"
      description="Preston Hayes reviews WordSolverX entertainment puzzle pages and keeps the saved Framed datasets aligned with the published date archive."
    />

    <InternalLinkSection currentGame="Framed" />
  </div>
</div>
