<script lang="ts">
  import { type Snippet } from 'svelte';
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import {
    PRESTON_HAYES_AUTHOR_DESCRIPTION,
    PRESTON_HAYES_AUTHOR_IMAGE,
    PRESTON_HAYES_AUTHOR_NAME
  } from '$lib/authors';
  import { generatePersonAuthorSchema } from '$lib/seo';

  interface ModeConfig {
    name: string;
    icon: string;
    color: string;
    bg: string;
  }

  interface GameAnswer {
    game: string;
    date: string;
    mode: string;
    region: string;
    game_id: number;
    json_content: string;
  }

  interface ParsedContent {
    champion_name: string;
    yesterday?: string;
  }

  interface PageMeta {
    title?: string;
    heading?: string;
    description?: string;
    keywords?: string;
    featuredImage?: string;
  }

  type StructuredDataNode = Record<string, unknown> | StructuredDataNode[] | string | null;

  let {
    gameKey,
    gameTitle,
    apiGame,
    modes,
    modeConfig,
    regions = [
      { key: 'america', label: 'America', flag: 'US', accent: 'bg-emerald-500' },
      { key: 'europe', label: 'Europe', flag: 'EU', accent: 'bg-teal-500' }
    ],
    gridCols = 'grid-cols-1 md:grid-cols-2',
    seoContent,
    crossLinks,
    schemas,
    data
  }: {
    gameKey: string;
    gameTitle: string;
    apiGame: string;
    modes: string[];
    modeConfig: Record<string, ModeConfig>;
    regions?: { key: string; label: string; flag: string; accent: string }[];
    gridCols?: string;
    seoContent: Snippet;
    crossLinks: { href: string; icon: string; label: string }[];
    schemas: object;
    data?: {
      answers: GameAnswer[];
      dateStr: string;
      error: string | null;
      meta?: PageMeta;
      schemas?: object | string;
    };
  } = $props();

  let answers = $derived(data?.answers ?? []);
  let loading = $derived(!data?.answers?.length);
  let error = $derived(data?.error ?? null);
  let copiedKey = $state<string | null>(null);
  let dateStr = $derived(data?.dateStr ?? '');

  let canonicalUrl = $derived(`https://wordsolver.tech/${gameKey}-answer-today`);
  let seoDate = $derived(dateStr ? dateStr.replace(/^[^,]+,\s*/, '') : '');
  let pageTitle = $derived(
    data?.meta?.title ?? `${gameTitle} Hints and Answers for Today${seoDate ? ` (${seoDate})` : ''}`
  );
  let pageHeading = $derived(
    data?.meta?.heading ?? `${gameTitle} Hints and Answers for Today${seoDate ? ` (${seoDate})` : ''}`
  );
  let pageDescription = $derived(
    data?.meta?.description ??
      `Get ${gameTitle} hints and the confirmed ${gameTitle} answers for today${seoDate ? `, ${seoDate}` : ''}. Check every available mode and region in one place.`
  );
  let pageKeywords = $derived(
    data?.meta?.keywords ??
      `${gameKey} answer today, ${gameKey} answer, ${gameKey} hint, ${gameKey} hint today${seoDate ? `, ${gameKey} answer for ${seoDate}` : ''}`
  );
  let pageImage = $derived(data?.meta?.featuredImage ?? 'https://wordsolver.tech/wordsolverx.webp');
  let crossLinkColsClass = $derived(crossLinks.length > 4 ? 'md:grid-cols-5' : 'md:grid-cols-4');

  function normalizeStructuredData(input: unknown): unknown {
    if (typeof input === 'string' || input == null) {
      return input;
    }

    if (Array.isArray(input)) {
      return input.map((item) => normalizeStructuredData(item));
    }

    if (typeof input !== 'object') {
      return input;
    }

    const normalized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      normalized[key] = normalizeStructuredData(value);
    }

    const type = normalized['@type'];

    if (type === 'NewsArticle' || type === 'Article' || type === 'BlogPosting') {
      normalized['@type'] = 'Article';
      normalized.headline = pageTitle;
      normalized.description = pageDescription;
      normalized.mainEntityOfPage = {
        '@type': 'WebPage',
        '@id': canonicalUrl
      };
      normalized.image = pageImage;
    }

    if (type === 'WebPage') {
      normalized.name = pageTitle;
      normalized.headline = pageTitle;
      normalized.description = pageDescription;
      normalized.url = canonicalUrl;

      if (normalized['@id']) {
        normalized['@id'] = canonicalUrl;
      }
    }

    return normalized;
  }

  function hasSchemaType(input: StructuredDataNode, types: string[]): boolean {
    if (typeof input === 'string' || input == null) {
      return false;
    }

    if (Array.isArray(input)) {
      return input.some((item) => hasSchemaType(item, types));
    }

    const record = input as Record<string, unknown>;
    const schemaType = record['@type'];

    if (typeof schemaType === 'string' && types.includes(schemaType)) {
      return true;
    }

    return Object.values(record).some((value) => hasSchemaType(value as StructuredDataNode, types));
  }

  let resolvedSchemas = $derived(normalizeStructuredData(data?.schemas ?? schemas));
  let resolvedSchemaJson = $derived(
    typeof resolvedSchemas === 'string' ? resolvedSchemas : JSON.stringify(resolvedSchemas)
  );
  let hasPrimaryArticleSchema = $derived(
    hasSchemaType(resolvedSchemas as StructuredDataNode, ['Article', 'NewsArticle', 'BlogPosting'])
  );
  let webPageSchema = $derived({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
    image: pageImage
  });
  let articleSchema = $derived({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageTitle,
    description: pageDescription,
    mainEntityOfPage: canonicalUrl,
    author: generatePersonAuthorSchema(
      'Preston Hayes',
      'https://wordsolver.tech/about#preston-hayes',
      'https://wordsolver.tech/auther-wordsolverx.webp'
    ),
    publisher: {
      '@type': 'Organization',
      name: 'WordSolverX'
    },
    image: pageImage
  });

  function parseContent(jsonContent: string): ParsedContent {
    try {
      return JSON.parse(jsonContent);
    } catch {
      return { champion_name: 'Unknown' };
    }
  }

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text);
    copiedKey = key;
    setTimeout(() => {
      copiedKey = null;
    }, 2000);
  }

  function getAnswer(mode: string, region: string) {
    return answers.find((answer) => answer.mode === mode && answer.region === region);
  }
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta name="keywords" content={pageKeywords} />
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:site_name" content="WordSolverX" />
  <meta property="og:image" content={pageImage} />
  <meta property="og:image:alt" content={`${gameTitle} hints and answers for today`} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  <meta name="twitter:image" content={pageImage} />
  {@html `<script type="application/ld+json">${JSON.stringify(webPageSchema)}</script>`}
  {#if !hasPrimaryArticleSchema}
    {@html `<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>`}
  {/if}
  {@html `<script type="application/ld+json">${resolvedSchemaJson}</script>`}
</svelte:head>

<div class="min-h-screen bg-gray-100">
  <div class="bg-white shadow-sm">
    <div class="max-w-6xl mx-auto px-4 py-10">
      <h1 class="text-4xl font-extrabold text-gray-900">{pageHeading}</h1>
      {#if dateStr}
        <p class="mt-2 text-lg text-gray-500">{dateStr}</p>
      {/if}
    </div>
  </div>

  <div class="max-w-6xl mx-auto px-4 py-8">
    {#if loading}
      <div class={`grid ${gridCols} gap-6`}>
        {#each Array(modes.length) as _}
          <div class="animate-pulse rounded-2xl bg-white p-6">
            <div class="mx-auto mb-4 h-12 w-12 rounded-full bg-gray-200"></div>
            <div class="mx-auto mb-4 h-4 w-1/2 rounded bg-gray-200"></div>
            <div class="mx-auto h-8 w-3/4 rounded bg-gray-200"></div>
          </div>
        {/each}
      </div>
    {:else if error}
      <div class="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p class="text-red-600">{error}</p>
        <button onclick={() => window.location.reload()} class="mt-4 rounded-lg bg-red-500 px-4 py-2 text-white">
          Retry
        </button>
      </div>
    {:else}
      {#each regions as region}
        <div class="mb-12">
          <div class="mb-6 flex items-center gap-3">
            <div class={`h-8 w-1 rounded-full ${region.accent}`}></div>
            <h2 class="text-2xl font-bold text-gray-800">{region.flag} {gameTitle} {region.label} Answers</h2>
          </div>
          <div class={`grid ${gridCols} gap-6`}>
            {#each modes as mode}
              {@const answer = getAnswer(mode, region.key)}
              {@const content = answer ? parseContent(answer.json_content) : null}
              {@const cfg = modeConfig[mode]}
              <div class={`rounded-2xl border-2 ${cfg.color} ${cfg.bg} p-6 transition-all hover:shadow-lg`}>
                <div class="mb-3 flex justify-center">
                  <div class={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-2xl ${cfg.bg} ${cfg.color}`}>
                    {cfg.icon}
                  </div>
                </div>
                <h3 class="mb-4 text-center font-medium text-gray-600">{cfg.name}</h3>
                {#if content}
                  <div class="mb-4 text-center">
                    <p class="text-3xl font-bold text-gray-800">{content.champion_name}</p>
                  </div>
                  <div class="flex items-center justify-between border-t pt-3 text-sm">
                    <div class="flex items-center gap-1.5 text-orange-500">
                      <span>ID</span>
                      <span>Game #{answer?.game_id}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <button
                        onclick={() => copyToClipboard(content.champion_name, `${mode}-${region.key}`)}
                        class="text-gray-400 transition-colors hover:text-gray-600"
                        title="Copy answer"
                      >
                        {copiedKey === `${mode}-${region.key}` ? 'Copied' : 'Copy'}
                      </button>
                      <span class="flex items-center gap-1 text-green-500">
                        <span class="h-2 w-2 rounded-full bg-green-500"></span>
                        Live
                      </span>
                    </div>
                  </div>
                  {#if content.yesterday}
                    <div class="mt-3 border-t border-dashed pt-3 text-center">
                      <span class="text-xs text-gray-400">Yesterday: </span>
                      <span class="text-sm font-medium text-gray-600">{content.yesterday}</span>
                    </div>
                  {/if}
                {:else}
                  <div class="py-4 text-center text-gray-400">No data available</div>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      {/each}

      <div class="mb-12 rounded-3xl bg-white p-8 shadow-sm md:p-12">
        {@render seoContent()}
      </div>

      <div class="mb-12">
        <AuthorCard
          name={PRESTON_HAYES_AUTHOR_NAME}
          image={PRESTON_HAYES_AUTHOR_IMAGE}
          description={PRESTON_HAYES_AUTHOR_DESCRIPTION}
        />
      </div>
    {/if}
  </div>

  <div class="max-w-6xl mx-auto px-4 py-12">
    <h2 class="mb-6 text-center text-xl font-bold text-gray-800">More Games</h2>
    <div class={`grid grid-cols-2 ${crossLinkColsClass} gap-4`}>
      {#each crossLinks as link}
        <a href={link.href} class="rounded-xl bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md">
          <span class="mb-2 block text-3xl">{link.icon}</span>
          <span class="font-medium text-gray-700">{link.label}</span>
        </a>
      {/each}
    </div>
  </div>
</div>
