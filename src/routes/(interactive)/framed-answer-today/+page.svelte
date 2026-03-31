<script lang="ts">
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import {
    PRESTON_HAYES_AUTHOR_DESCRIPTION,
    PRESTON_HAYES_AUTHOR_IMAGE,
    PRESTON_HAYES_AUTHOR_NAME,
  } from '$lib/authors';

  let { data } = $props();

  let selectedMode = $state('classic');
  let revealed = $state(false);

  let activeMode = $derived(data.modes.find((m) => m.key === selectedMode) ?? data.modes[0]);
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <meta name="news_keywords" content={data.meta.keywords} />
  <link rel="canonical" href="https://wordsolver.tech/framed-answer-today" />
  <meta property="og:title" content={data.meta.title} />
  <meta property="og:description" content={data.meta.description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://wordsolver.tech/framed-answer-today" />
  <meta property="og:image" content={data.meta.featuredImage ?? 'https://wordsolver.tech/wordsolverx.webp'} />
  <meta property="og:image:alt" content={`Framed hints and answer for ${data.formattedDate}`} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.meta.title} />
  <meta name="twitter:description" content={data.meta.description} />
  <meta name="twitter:image" content={data.meta.featuredImage ?? 'https://wordsolver.tech/wordsolverx.webp'} />
  {@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <div class="text-center mb-12">
    <h1 class="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Framed Answer for Today</h1>
    <p class="text-lg text-slate-600 dark:text-slate-300">
      Verified Framed hints and the solution for {data.formattedDate}
    </p>
    <div class="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm font-semibold">
      <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
      Updated Daily
    </div>
  </div>

  <!-- Mode Tabs -->
  <div class="flex flex-wrap justify-center gap-2 mb-10">
    {#each data.modes as mode}
      <button
        onclick={() => { selectedMode = mode.key; revealed = false; }}
        class="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all {selectedMode === mode.key
          ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/20'
          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700'}"
      >
        {mode.label}
      </button>
    {/each}
  </div>

  <!-- Answer Card -->
  <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
    <div class="bg-gradient-to-r from-red-600 to-rose-600 px-8 py-6 text-center">
      <span class="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium tracking-wide backdrop-blur-sm">
        {activeMode.label} &mdash; Day #{activeMode.dayNumber}
      </span>
    </div>

    <div class="p-8 text-center">
      {#if revealed}
        <div class="mb-6">
          <span class="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium tracking-wide">
            TODAY'S ANSWER
          </span>
        </div>

        <h2 class="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          {activeMode.movie.title}
        </h2>
        <p class="text-xl text-slate-500 dark:text-slate-400 font-medium">
          ({activeMode.movie.year})
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 text-left">
          <div class="bg-gradient-to-br from-red-50 to-rose-50 dark:from-slate-700 dark:to-slate-600 p-4 rounded-lg">
            <div class="text-sm font-medium text-slate-600 dark:text-slate-300">Mode</div>
            <div class="text-lg font-bold text-slate-900 dark:text-white">{activeMode.label}</div>
          </div>
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 p-4 rounded-lg">
            <div class="text-sm font-medium text-slate-600 dark:text-slate-300">Day Number</div>
            <div class="text-lg font-bold text-slate-900 dark:text-white">#{activeMode.dayNumber}</div>
          </div>
          <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-700 dark:to-slate-600 p-4 rounded-lg">
            <div class="text-sm font-medium text-slate-600 dark:text-slate-300">Year</div>
            <div class="text-lg font-bold text-slate-900 dark:text-white">{activeMode.movie.year}</div>
          </div>
        </div>
      {:else}
        <div class="py-10">
          <div class="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 flex items-center justify-center">
            <svg class="w-12 h-12 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            {activeMode.label} &mdash; Day #{activeMode.dayNumber}
          </h2>
          <p class="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
            Click the button below to reveal today's Framed movie answer.
          </p>
          <button
            onclick={() => revealed = true}
            class="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/30"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.75 6.75M9.878 9.878l-3.128 3.128M21 12c0 1.268-.63 2.39-1.593 3.068M3 3l18 18" />
            </svg>
            Reveal Answer
          </button>
        </div>
      {/if}

      <div class="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
        <a href="/framed-archive" class="inline-flex items-center justify-center px-6 py-3 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-medium rounded-lg transition-colors group">
          View All Past Answers
          <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </div>
    </div>
  </div>

  <!-- SEO Content Section -->
  <article class="mt-12 space-y-8">
    <section class="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">What is Framed?</h2>
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
        Framed is a daily movie guessing game that tests your film knowledge. Each day, a new movie is selected, and you're shown a single still frame from it. Your job is to guess the movie title within six attempts.
      </p>
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
        With each incorrect guess, an additional frame from the movie is revealed, giving you more visual context. The frames progress through key moments of the film, so attentive players can piece together the answer from the cinematography, actors, or setting.
      </p>
      <p class="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
        Framed appeals to both casual movie watchers and hardcore cinephiles. Some days the answer is a blockbuster everyone has seen; other days it's a deep cut that rewards true film buffs. Either way, it's a fun daily challenge that sharpens your visual memory.
      </p>
    </section>

    <section class="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">How to Play Framed</h2>
      <div class="space-y-6 text-lg text-slate-600 dark:text-slate-300">
        <p class="leading-relaxed">Playing Framed is straightforward, but mastering it takes practice:</p>
        <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Step 1: Study the First Frame</h3>
          <p class="text-slate-600 dark:text-slate-300">Look carefully at the opening frame. Pay attention to the color palette, any visible actors, the setting, and the overall visual style. These clues will help you narrow down the genre and era.</p>
        </div>
        <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Step 2: Make Your Best Guess</h3>
          <p class="text-slate-600 dark:text-slate-300">Type in your guess. If you recognize the frame, go for it. If not, make an educated guess based on what you see. Each wrong answer reveals another scene.</p>
        </div>
        <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Step 3: Use Additional Frames</h3>
          <p class="text-slate-600 dark:text-slate-300">As new frames appear, look for recurring themes, characters, or locations. The progression of scenes often tells a story that points toward the answer.</p>
        </div>
        <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Step 4: Identify the Movie</h3>
          <p class="text-slate-600 dark:text-slate-300">Use all available frames to identify the film. You have six total guesses, so don't rush &mdash; each frame contains valuable information.</p>
        </div>
      </div>
    </section>

    <section class="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">Framed Game Modes</h2>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-2xl p-6 border border-red-100 dark:border-red-800/30">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Classic</h3>
          <p class="text-slate-600 dark:text-slate-300">The original Framed experience. A new scene from the movie is revealed with each wrong guess, building up to six frames total.</p>
        </div>
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">One Frame</h3>
          <p class="text-slate-600 dark:text-slate-300">Only a single frame is shown. No additional clues &mdash; you get one shot to identify the movie from a single image.</p>
        </div>
        <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-100 dark:border-purple-800/30">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Poster</h3>
          <p class="text-slate-600 dark:text-slate-300">Guess the movie from its poster. Posters are iconic and recognizable, making this mode great for visual learners.</p>
        </div>
        <div class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-100 dark:border-amber-800/30">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Title Shot</h3>
          <p class="text-slate-600 dark:text-slate-300">Identify the movie from its title card or opening credits. Typography and design fans will love this mode.</p>
        </div>
      </div>
    </section>

    <section class="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-3xl p-8 border border-red-100 dark:border-red-800/30">
      <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">Tips for Solving Framed Faster</h2>
      <div class="space-y-4 text-lg text-slate-600 dark:text-slate-300">
        <p class="leading-relaxed">Getting better at Framed comes down to recognizing visual patterns. Watch for distinctive color grading &mdash; warm sepia tones might indicate a period piece, while neon-lit scenes suggest a modern thriller or sci-fi film.</p>
        <p class="leading-relaxed">Pay attention to actors' faces and clothing. Even if you can't name the actor, recognizing their general look can narrow things down to a specific era or genre. The background details matter too &mdash; architecture, vehicles, and signage can all reveal when and where the film takes place.</p>
        <p class="leading-relaxed">Build a mental library of movie stills by watching films across different genres and decades. The more movies you've seen, the easier it becomes to match a frame to its source. Classic films, indie darlings, and international cinema all make appearances, so broad viewing habits pay off.</p>
      </div>
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
