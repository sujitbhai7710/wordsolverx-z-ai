<script lang="ts">
  import PhoodleAnswerCard from '$lib/components/PhoodleAnswerCard.svelte';
  import FiClock from '$lib/components/icons/FiClock.svelte';
  import FiCalendar from '$lib/components/icons/FiCalendar.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.meta?.title ?? "Phoodle Answer Yesterday"}</title>
  <meta name="description" content={data.meta?.description ?? ''} />
  <link rel="canonical" href="https://wordsolverx.com/phoodle-answer-yesterday" />
  <meta name="robots" content="noindex, follow" />
  {#if data.schemas}
    {@html `<script type="application/ld+json">${data.schemas}</script>`}
  {/if}
</svelte:head>

{#if data.error || !data.word}
  <div class="min-h-screen bg-white flex items-center justify-center">
    <div class="text-center p-8">
      <h1 class="text-3xl font-bold mb-4 text-gray-900">Phoodle Answer Not Available</h1>
      <p class="text-gray-600">Unable to load yesterday's puzzle. Please try again later.</p>
      <a href="/phoodle-answer-today" class="mt-6 inline-block px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all font-medium">← Back to Today</a>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header class="text-center mb-12">
        <div class="inline-flex items-center justify-center p-4 bg-orange-100 rounded-full text-orange-600 mb-6 font-medium">
          <span class="text-4xl">🍽️</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Yesterday's Phoodle Answer</h1>
        <p class="text-lg text-gray-600 font-medium">{data.formattedDate}</p>
      </header>

      <PhoodleAnswerCard word={data.word} date={data.formattedDate ?? ''} description={data.description} recipe_name={data.recipe_name} isYesterday={true} />

      <div class="flex flex-col sm:flex-row justify-center gap-4 mb-16">
        <a href="/phoodle-answer-today" class="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-orange-50 text-gray-700 border border-gray-200 rounded-2xl font-bold transition-all shadow-sm group">
          <FiClock class="w-5 h-5 text-orange-500 transition-transform group-hover:scale-110" />
          Today's Answer
        </a>
        <a href="/phoodle-archive" class="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-amber-50 text-gray-700 border border-gray-200 rounded-2xl font-bold transition-all shadow-sm group">
          <FiCalendar class="w-5 h-5 text-amber-500 transition-transform group-hover:scale-110" />
          Browse Archive
        </a>
      </div>

      <article class="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span class="w-2 h-8 bg-amber-500 rounded-full inline-block"></span>
          About Yesterday's Puzzle
        </h2>
        <p class="text-gray-600 mb-6 leading-relaxed text-lg">
          The Phoodle answer for <strong class="text-gray-900">{data.formattedDate}</strong> was
          <span class="px-2 py-1 bg-green-100 text-green-700 rounded font-bold uppercase">{data.word}</span>.
        </p>

        <h2 class="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div class="space-y-6">
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-bold text-gray-900 mb-2">What was yesterday's Phoodle answer?</h3>
            <p class="text-gray-600">Yesterday's Phoodle answer was <strong class="text-green-600">{data.upperWord}</strong>.</p>
          </div>
          <div class="border-b border-gray-200 pb-6">
            <h3 class="text-lg font-bold text-gray-900 mb-2">What is Phoodle?</h3>
            <p class="text-gray-600">Phoodle is a daily word puzzle game focused on food-related words. Similar to Wordle, you have six attempts to guess the five-letter food word.</p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Can I play past Phoodle puzzles?</h3>
            <p class="text-gray-600">Phoodle resets every day with a new secret word. While you can't play past puzzles officially, we keep an archive of answers for you to check.</p>
          </div>
        </div>
      </article>
    </div>
  </div>
{/if}
