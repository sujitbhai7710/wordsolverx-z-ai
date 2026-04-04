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

<div class="bg-black min-h-screen py-12">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
    <Breadcrumbs />

    <section class="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">Framed Answers Today</p>
          <h1 class="mt-3 text-4xl font-black text-white">{data.formattedDate}</h1>
          <p class="mt-4 max-w-3xl text-lg text-zinc-300">
            Today's saved movie titles for Framed Classic, One Frame, Titleshot, and Poster.
          </p>
        </div>
        <a href="/framed-archive" class="inline-flex items-center rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-400">Browse Archive</a>
      </div>
    </section>

    <section class="grid gap-5 sm:grid-cols-2">
      {#each data.entries as entry}
        <FramedAnswerCard game={entry.game} answer={entry.answer} puzzleNumber={entry.puzzleNumber} />
      {/each}
    </section>

    <AuthorCard
      name="Preston Hayes"
      image="/auther-wordsolverx.webp"
      description="Preston Hayes reviews WordSolverX entertainment puzzle pages and keeps the saved Framed datasets aligned with the published date archive."
    />

    <InternalLinkSection currentGame="Framed" />
  </div>
</div>
