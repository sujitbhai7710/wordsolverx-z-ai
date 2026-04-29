<script lang="ts">
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import { PRESTON_HAYES_AUTHOR_NAME, PRESTON_HAYES_AUTHOR_IMAGE, PRESTON_HAYES_AUTHOR_DESCRIPTION } from '$lib/authors';
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
  <meta property="og:image" content={`https://wordsolverx.com${data.meta.featuredImage}`} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.meta.title} />
  <meta name="twitter:description" content={data.meta.description} />
  <meta name="twitter:image" content={`https://wordsolverx.com${data.meta.featuredImage}`} />
  {@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

<div class="min-h-screen bg-slate-50">
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

    <!-- Today's Answer — Game-Style Visual Display -->
    <section class="mt-8 rounded-[2rem] border border-pink-100 bg-white p-6 shadow-[0_20px_60px_rgba(236,72,153,0.06)] sm:p-10">
      <h2 class="text-center text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Today's Colorfle Answer</h2>
      <p class="mt-2 text-center text-sm text-slate-500">Puzzle #{data.answer.puzzleNumber} &middot; {data.formattedDate}</p>

      <!-- Segmented Color Circle -->
      <div class="relative mx-auto mt-8 flex flex-col items-center">
        <button
          type="button"
          class="group relative cursor-pointer"
          onclick={() => (revealed = !revealed)}
          aria-label={revealed ? 'Hide answer colors' : 'Reveal answer colors'}
        >
          <!-- The circle with 3 segments using conic-gradient -->
          <div class="relative h-56 w-56 sm:h-72 sm:w-72">
            {#if revealed}
              {@const c1 = data.answer.colors[0]}
              {@const c2 = data.answer.colors[1]}
              {@const c3 = data.answer.colors[2]}
              {@const w1 = c1?.weight ?? 0.33}
              {@const w2 = c2?.weight ?? 0.33}
              {@const w3 = c3?.weight ?? 0.34}
              {@const deg1 = Math.round(w1 * 360)}
              {@const deg2 = Math.round((w1 + w2) * 360)}
              <div
                class="h-full w-full rounded-full shadow-2xl ring-4 ring-white transition-all duration-700"
                style={`background: conic-gradient(from 0deg, ${c1?.hex ?? '#ccc'} 0deg ${deg1}deg, ${c2?.hex ?? '#ccc'} ${deg1}deg ${deg2}deg, ${c3?.hex ?? '#ccc'} ${deg2}deg 360deg); box-shadow: 0 24px 60px rgba(0,0,0,0.15);`}
              ></div>
              <!-- White divider lines -->
              <div
                class="pointer-events-none absolute inset-0 rounded-full"
                style={`background: conic-gradient(from 0deg, transparent 0deg ${deg1 - 1}deg, white ${deg1 - 1}deg ${deg1 + 1}deg, transparent ${deg1 + 1}deg ${deg2 - 1}deg, white ${deg2 - 1}deg ${deg2 + 1}deg, transparent ${deg2 + 1}deg 360deg);`}
              ></div>
            {:else}
              <div
                class="flex h-full w-full items-center justify-center rounded-full bg-slate-200 shadow-2xl ring-4 ring-white transition-all duration-500"
              >
                <span class="text-4xl font-black text-slate-400">?</span>
              </div>
            {/if}
          </div>
          
          {#if !revealed}
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="rounded-full bg-white/95 px-6 py-3 text-sm font-bold text-slate-700 shadow-xl backdrop-blur-sm ring-2 ring-pink-100">Click to Reveal</span>
            </div>
          {/if}
        </button>
      </div>

      <!-- Component Color Squares with Names -->
      <div class="mx-auto mt-10 flex items-start justify-center gap-4 sm:gap-8">
        {#each data.answer.colors as color, idx}
          <div class="flex flex-col items-center gap-2">
            {#if revealed}
              <div
                class="h-16 w-16 rounded-xl shadow-lg ring-[3px] ring-white sm:h-20 sm:w-20"
                style={`background:${color.hex}; box-shadow: 0 8px 24px ${color.hex}44`}
              ></div>
              <p class="text-sm font-bold text-slate-800">{color.name}</p>
              <p class="font-mono text-xs text-slate-500">{color.hex}</p>
              {#if color.weight != null}
                <span class="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-pink-700">
                  {Math.round(color.weight * 100)}%
                </span>
              {/if}
            {:else}
              <div
                class="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-200 shadow-lg ring-[3px] ring-slate-300 sm:h-20 sm:w-20"
              >
                <span class="text-2xl font-black text-slate-400">{idx + 1}</span>
              </div>
              <p class="text-sm font-bold text-slate-400">Hidden</p>
              <p class="font-mono text-xs text-slate-300">---</p>
              {#if color.weight != null}
                <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-300">
                  --%
                </span>
              {/if}
            {/if}
          </div>
        {/each}
      </div>

      <!-- Target Color Result -->
      {#if revealed}
        <div class="mx-auto mt-8 flex flex-col items-center gap-3">
          <p class="text-sm font-semibold text-slate-500">Mixing these colors produces:</p>
          <div class="flex items-center gap-3">
            <div
              class="h-10 w-10 rounded-full shadow-md ring-2 ring-white"
              style={`background:${data.answer.targetColor.hex}`}
            ></div>
            <span class="font-mono text-lg font-bold text-slate-800">{data.answer.targetColor.hex}</span>
            <span class="text-xs text-slate-400">
              RGB({data.answer.targetColor.rgb.r}, {data.answer.targetColor.rgb.g}, {data.answer.targetColor.rgb.b})
            </span>
          </div>
        </div>
      {/if}

      {#if !revealed}
        <p class="mt-6 text-center text-xs text-slate-400">Click the circle above to reveal today's Colorfle answer</p>
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
                  class="h-8 w-8 rounded-lg ring-2 ring-teal-500"
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

    <article class="mt-8 space-y-8">
      <section class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
        <h2 class="text-3xl font-black tracking-tight text-slate-900">What is Colorfle?</h2>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          Colorfle is a daily color-mixing puzzle. Each day, the game generates a target color and your job is to identify the three component colors that, when mixed together, produce that target. Unlike word-based daily games, Colorfle operates entirely in the visual space — you are guessing colors, not letters.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          The game launched in 2022 during the wave of daily puzzle spinoffs that followed Wordle&apos;s explosion in popularity. While most of those clones stuck to words, Colorfle carved out a niche by focusing on color perception.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          It sits in the same category as games like Colordle and Contexto — puzzles that test a type of intelligence that traditional word games ignore entirely.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          The player base is smaller than Wordle&apos;s but noticeably dedicated. Color players tend to be designers, artists, photographers, and front-end developers — people who work with color every day and enjoy having their perception tested.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          The game has maintained consistent daily engagement because color perception is a genuine skill that improves with practice, and the daily format provides regular training.
        </p>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
        <h2 class="text-3xl font-black tracking-tight text-slate-900">How Colorfle Works</h2>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          Each Colorfle puzzle presents a single target color — the exact hex code and RGB values that make up the answer. Your task is to figure out which three colors mix to create that target.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          The component colors are drawn from a curated palette of named colors, and each carries a weight percentage indicating how much it contributes to the final mix.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          The daily cycle resets at midnight in the game&apos;s local timezone. Each puzzle is assigned a sequential number, so puzzle #{data.answer.puzzleNumber} follows #{data.answer.puzzleNumber - 1} from the day before.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          This page displays the target color as a blurred circle until you click to reveal it, giving you a chance to think about the answer before seeing it.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          Color mixing in Colorfle uses an additive RGB model. When you see a target like a muted olive green, the component colors might include something like 50% yellow-green, 30% dark brown, and 20% pale yellow.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          The exact proportions matter — a small shift in one component color can push the target noticeably toward a different hue family.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          There is no guess limit. You can submit component combinations until you hit the exact match or decide to reveal the answer. Most players solve it in three to five attempts once they get the hang of how the mixing works.
        </p>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
        <h2 class="text-3xl font-black tracking-tight text-slate-900">Today&apos;s Colorfle Answer — Understanding the Components</h2>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          The answer section above shows the target color, its hex code, and the three component colors with their individual weights. The weight tells you what percentage of the final mix each component represents.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          If one color carries 60% weight, it dominates the target — you should see that color&apos;s hue clearly in the result.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          This page also shows recent Colorfle answers in the archive grid below. If you want to understand how the mixing works, look at a few past answers and compare the component colors with the target — you will start seeing patterns in how certain combinations produce specific results.
        </p>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
        <h2 class="text-3xl font-black tracking-tight text-slate-900">Strategy Tips for Colorfle</h2>
        <div class="mt-6 space-y-6">
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-xl font-bold text-slate-900">Identify the dominant hue first</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
              Before guessing any components, look at the target and name the dominant color family — is it mostly blue? Mostly green? Does it lean warm or cool? The component with the highest weight will drive the hue, so if the target looks clearly blue, one of your three components should be a strong blue.
            </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-xl font-bold text-slate-900">Think about saturation and brightness separately</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
          Color perception has three dimensions: hue, saturation, and brightness. The hue tells you the color family (red, blue, etc.), saturation tells you how vivid it is, and brightness tells you how light or dark.
        </p>
        <p class="mt-2 text-base leading-7 text-slate-600">
          One component might control the hue while another adjusts the saturation. A bright, vivid target needs different treatment than a muted, pastel one.
        </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-xl font-bold text-slate-900">Use complementary colors to neutralize</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
              If the target is a desaturated gray or brown, the component colors likely include a pair that sit opposite each other on the color wheel — mixing complementary colors produces neutral tones. For example, blue mixed with orange creates a muted brownish tone.
            </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-xl font-bold text-slate-900">Start broad, then refine</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
              On your first guess, pick three colors that roughly match the target&apos;s overall impression. Even if you miss the exact components, the feedback will tell you whether you are in the right neighborhood. Then adjust one component at a time until you converge on the answer.
            </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-xl font-bold text-slate-900">Learn the named color palette</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
              Colorfle draws components from a specific set of named colors. Learning that set — colors like DarkKhaki, CadetBlue, and IndianRed — gives you a head start because you do not have to guess from the entire CSS color space. Browse the Colorfle archive on this site to study which colors appear most often as components.
            </p>
          </div>
        </div>
      </section>

    </article>

    <div class="mt-8">
      <AuthorCard
        name={PRESTON_HAYES_AUTHOR_NAME}
        image={PRESTON_HAYES_AUTHOR_IMAGE}
        description={PRESTON_HAYES_AUTHOR_DESCRIPTION}
      />
    </div>

    <div class="mt-8">
      <InternalLinkSection currentGame="Colorfle" />
    </div>
  </div>
</div>

