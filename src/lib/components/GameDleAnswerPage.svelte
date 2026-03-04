<script lang="ts">
  import { type Snippet } from 'svelte';

  interface ModeConfig { name: string; icon: string; color: string; bg: string; }
  interface GameAnswer { game: string; date: string; mode: string; region: string; game_id: number; json_content: string; }
  interface ParsedContent { champion_name: string; yesterday?: string; }
  interface PageMeta {
    title?: string;
    heading?: string;
    description?: string;
    keywords?: string;
    featuredImage?: string;
  }

  let {
    gameKey, gameTitle, apiGame, modes, modeConfig,
    regions = [{ key: 'america', label: 'America', flag: '🇺🇸', accent: 'bg-emerald-500' }, { key: 'europe', label: 'Europe', flag: '🇪🇺', accent: 'bg-teal-500' }],
    gridCols = 'grid-cols-1 md:grid-cols-2',
    seoContent, crossLinks, schemas,
    data,
  }: {
    gameKey: string;
    gameTitle: string;
    apiGame: string;
    modes: string[];
    modeConfig: Record<string, ModeConfig>;
    regions?: { key: string; label: string; flag: string; accent: string; }[];
    gridCols?: string;
    seoContent: Snippet;
    crossLinks: { href: string; icon: string; label: string; }[];
    schemas: object;
    data?: {
      answers: GameAnswer[];
      dateStr: string;
      error: string | null;
      meta?: PageMeta;
      schemas?: object | string;
    };
  } = $props();

  // Use server-side data if available, otherwise fall back to empty state
  let answers = $state<GameAnswer[]>(data?.answers ?? []);
  let loading = $state(!data?.answers?.length);
  let error = $state<string | null>(data?.error ?? null);
  let copiedKey = $state<string | null>(null);
  let dateStr = $state(data?.dateStr ?? '');

  // Generate canonical URL based on gameKey
  let canonicalUrl = $derived(`https://wordsolverx.com/${gameKey}-answer-today`);
  let seoDate = $derived(dateStr ? dateStr.replace(/^[^,]+,\s*/, '') : '');
  let pageTitle = $derived(data?.meta?.title ?? `${gameTitle} Hints and Answers for Today${seoDate ? ` (${seoDate})` : ''}`);
  let pageHeading = $derived(data?.meta?.heading ?? `${gameTitle} Hints and Answers for Today${seoDate ? ` (${seoDate})` : ''}`);
  let pageDescription = $derived(
    data?.meta?.description ??
      `Get ${gameTitle} hints and the confirmed ${gameTitle} answers for today${seoDate ? `, ${seoDate}` : ''}. Check every available mode and region in one place.`
  );
  let pageKeywords = $derived(
    data?.meta?.keywords ??
      `${gameKey} answer today, ${gameKey} answer, ${gameKey} hint, ${gameKey} hint today${seoDate ? `, ${gameKey} answer for ${seoDate}` : ''}`
  );
  let pageImage = $derived(data?.meta?.featuredImage ?? 'https://wordsolverx.com/wordsolverx.webp');
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

    if (type === 'NewsArticle' || type === 'Article') {
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

  let resolvedSchemas = $derived(normalizeStructuredData(data?.schemas ?? schemas));
  let resolvedSchemaJson = $derived(typeof resolvedSchemas === 'string' ? resolvedSchemas : JSON.stringify(resolvedSchemas));
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
    author: {
      '@type': 'Organization',
      name: 'WordSolverX'
    },
    publisher: {
      '@type': 'Organization',
      name: 'WordSolverX'
    },
    image: pageImage
  });

  function parseContent(jsonContent: string): ParsedContent {
    try { return JSON.parse(jsonContent); } catch { return { champion_name: 'Unknown' }; }
  }

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text);
    copiedKey = key;
    setTimeout(() => { copiedKey = null; }, 2000);
  }

  function getAnswer(mode: string, region: string) {
    return answers.find(a => a.mode === mode && a.region === region);
  }
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta name="keywords" content={pageKeywords} />
  <meta name="news_keywords" content={pageKeywords} />
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
  {@html `<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>`}
  {@html `<script type="application/ld+json">${resolvedSchemaJson}</script>`}
</svelte:head>

<div class="min-h-screen bg-gray-100">
  <div class="bg-white shadow-sm">
    <div class="max-w-6xl mx-auto px-4 py-10">
      <h1 class="text-4xl font-extrabold text-gray-900">{pageHeading}</h1>
      {#if dateStr}<p class="text-lg text-gray-500 mt-2">{dateStr}</p>{/if}
    </div>
  </div>

  <div class="max-w-6xl mx-auto px-4 py-8">
    {#if loading}
      <div class="grid {gridCols} gap-6">
        {#each Array(modes.length) as _}
          <div class="bg-white rounded-2xl p-6 animate-pulse">
            <div class="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div class="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        {/each}
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p class="text-red-600">{error}</p>
        <button onclick={() => window.location.reload()} class="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg">Retry</button>
      </div>
    {:else}
      {#each regions as region}
        <div class="mb-12">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-1 h-8 {region.accent} rounded-full"></div>
            <h2 class="text-2xl font-bold text-gray-800">{region.flag} {gameTitle} {region.label} Answers</h2>
          </div>
          <div class="grid {gridCols} gap-6">
            {#each modes as mode}
              {@const answer = getAnswer(mode, region.key)}
              {@const content = answer ? parseContent(answer.json_content) : null}
              {@const cfg = modeConfig[mode]}
              <div class="rounded-2xl border-2 {cfg.color} {cfg.bg} p-6 transition-all hover:shadow-lg">
                <div class="flex justify-center mb-3">
                  <div class="w-12 h-12 rounded-full {cfg.bg} border-2 {cfg.color} flex items-center justify-center text-2xl">{cfg.icon}</div>
                </div>
                <h3 class="text-center text-gray-600 font-medium mb-4">{cfg.name}</h3>
                {#if content}
                  <div class="text-center mb-4">
                    <p class="text-3xl font-bold text-gray-800">{content.champion_name}</p>
                  </div>
                  <div class="flex items-center justify-between text-sm border-t pt-3">
                    <div class="flex items-center gap-1.5 text-orange-500"><span>🏆</span><span>Game #{answer?.game_id}</span></div>
                    <div class="flex items-center gap-2">
                      <button onclick={() => copyToClipboard(content.champion_name, `${mode}-${region.key}`)} class="text-gray-400 hover:text-gray-600 transition-colors" title="Copy">
                        {copiedKey === `${mode}-${region.key}` ? '✓' : '📋'}
                      </button>
                      <span class="flex items-center gap-1 text-green-500"><span class="w-2 h-2 bg-green-500 rounded-full"></span>Live</span>
                    </div>
                  </div>
                  {#if content.yesterday}
                    <div class="mt-3 pt-3 border-t border-dashed text-center">
                      <span class="text-xs text-gray-400">Yesterday: </span>
                      <span class="text-sm font-medium text-gray-600">{content.yesterday}</span>
                    </div>
                  {/if}
                {:else}
                  <div class="text-center py-4 text-gray-400">No data available</div>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      {/each}

      <div class="bg-white rounded-3xl p-8 md:p-12 shadow-sm mb-12">
        {@render seoContent()}
      </div>
    {/if}
  </div>

  <div class="max-w-6xl mx-auto px-4 py-12">
    <h2 class="text-xl font-bold text-gray-800 mb-6 text-center">More Games</h2>
    <div class="grid grid-cols-2 md:grid-cols-{crossLinks.length > 4 ? 5 : 4} gap-4">
      {#each crossLinks as link}
        <a href={link.href} class="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
          <span class="text-3xl block mb-2">{link.icon}</span>
          <span class="font-medium text-gray-700">{link.label}</span>
        </a>
      {/each}
    </div>
  </div>
</div>
