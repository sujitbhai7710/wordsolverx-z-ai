<script lang="ts">
  import { getTodayPageArticle, type TodayArticleKey } from '$lib/daily-article-content';

  let {
    articleKey,
    articleDate,
    eyebrow = 'Daily article',
    fallbackTitle = "Today's notes",
    fallbackSummary = ''
  }: {
    articleKey: TodayArticleKey;
    articleDate: string;
    eyebrow?: string;
    fallbackTitle?: string;
    fallbackSummary?: string;
  } = $props();

  const article = $derived(getTodayPageArticle(articleKey, articleDate));
</script>

{#if article?.articleHtml}
  <section class="mt-12 rounded-3xl border border-gray-100 bg-white p-8 shadow-lg">
    <p class="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">{eyebrow}</p>
    <h2 class="mt-2 text-3xl font-bold text-gray-900">
      {article.title || fallbackTitle}
    </h2>
    {#if article.summary || fallbackSummary}
      <p class="mt-4 text-lg leading-8 text-gray-600">
        {article.summary || fallbackSummary}
      </p>
    {/if}
    <div class="prose prose-lg mt-6 max-w-none prose-headings:scroll-mt-28 prose-h2:text-gray-900 prose-h3:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-a:text-emerald-600">
      {@html article.articleHtml}
    </div>
  </section>
{/if}
