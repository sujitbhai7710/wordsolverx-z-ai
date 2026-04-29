<script lang="ts">
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import { PRESTON_HAYES_AUTHOR_NAME, PRESTON_HAYES_AUTHOR_IMAGE, PRESTON_HAYES_AUTHOR_DESCRIPTION } from '$lib/authors';
  import WordlebotPage from '$lib/components/wordlebot/WordlebotPage.svelte';

  let { data }: { data: { config: import('$lib/wordlebot-wasm/types').WordlebotPageConfig } } = $props();
</script>

<WordlebotPage config={data.config} />

<!-- SEO Article Section -->
<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-16">
  <div class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
    <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 mb-6">Why the Canuckle Archive Matters</h2>
    <div class="prose prose-slate dark:prose-invert max-w-none">
      <p>Every Canuckle answer since the game launched. Browse by date, check your guesses, or just see how many Canadian words you actually know.</p>
      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Canuckle Works</h3>
      <p>Same format as Wordle — six tries, five letters, color feedback. The difference is every answer ties back to Canada somehow. That could be a province name, a hockey term, a French-Canadian word, or slang you'd hear in Halifax but not in Houston. The answer pool is smaller than standard Wordle, roughly 2,300 words, so vowel-heavy openers tend to do well.</p>

      <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can I use the archive to get better?</h4>
      <p>Yes — browsing past answers is the fastest way to learn what kinds of Canadian words show up. You'll start noticing which letters and themes repeat.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Do all players get the same word?</h4>
      <p>Yes, one word per day, same for everyone. The archive reflects that shared answer for each date.</p>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Are French words included?</h4>
      <p>Sometimes. Canuckle pulls from both English and French Canadian vocabulary, so don't be surprised if a word comes from the French side of the bilingual pool.</p>
    </div>
  </div>

    <div class="mt-12">
      <AuthorCard
        name={PRESTON_HAYES_AUTHOR_NAME}
        image={PRESTON_HAYES_AUTHOR_IMAGE}
        description={PRESTON_HAYES_AUTHOR_DESCRIPTION}
      />
    </div>
  </article>