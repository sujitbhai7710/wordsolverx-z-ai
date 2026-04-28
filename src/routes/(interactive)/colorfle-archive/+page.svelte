<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import { getColorfleArchiveEntries } from '$lib/colorfle';

  const allEntries = getColorfleArchiveEntries(365);
  let days = $state(30);
  let selectedDate = $state(allEntries[0]?.date ?? '');

  const visibleEntries = $derived(allEntries.slice(0, days));
  const selectedEntry = $derived(
    allEntries.find((entry) => entry.date === selectedDate) ?? visibleEntries[0] ?? null
  );
</script>

<svelte:head>
  <title>Colorfle Archive - Daily Color Answers History | WordSolverX</title>
  <meta name="description" content="Browse the Colorfle archive with recent puzzle dates, source colors, and final target hex results for past Colorfle games." />
  <link rel="canonical" href="https://wordsolverx.com/colorfle-archive" />
  <meta property="og:title" content="Colorfle Archive - Daily Color Answers History" />
  <meta property="og:description" content="Check past Colorfle answer colors and target hex codes with a static date archive." />
  <meta property="og:url" content="https://wordsolverx.com/colorfle-archive" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Colorfle Archive" />
  <meta name="twitter:description" content="Past Colorfle puzzle answers with source colors and final target hex values." />
  <meta name="twitter:image" content="https://wordsolverx.com/wordsolverx.webp" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Colorfle Archive',
    description: 'Archive of previous Colorfle daily color answers.',
    url: 'https://wordsolverx.com/colorfle-archive'
  })}</script>`}
</svelte:head>

<div class="min-h-screen bg-slate-50 py-10">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <Breadcrumbs />

    <!-- Hero Header -->
    <section class="rounded-[2rem] border border-pink-100 bg-white p-8 shadow-[0_20px_60px_rgba(236,72,153,0.08)] sm:p-10">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.3em] text-pink-500">Colorfle Archive</p>
          <h1 class="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">Past Colorfle Answers</h1>
          <p class="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Browse {allEntries.length} archived Colorfle puzzles. Pick a date to inspect the exact source colors and final target hex.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          {#each [30, 90, 365] as option}
            <button
              type="button"
              class={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${days === option ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20' : 'border border-slate-200 text-slate-600 hover:border-pink-300 hover:bg-pink-50'}`}
              onclick={() => (days = option)}
            >
              Last {option} days
            </button>
          {/each}
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <!-- Date List -->
      <article class="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <label for="colorfle-archive-date" class="block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Select date</label>
        <input
          id="colorfle-archive-date"
          class="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-100"
          type="date"
          value={selectedDate}
          min={allEntries[allEntries.length - 1]?.date}
          max={allEntries[0]?.date}
          onchange={(event) => (selectedDate = (event.currentTarget as HTMLInputElement).value)}
        />

        <div class="mt-6 max-h-[28rem] space-y-3 overflow-y-auto pr-1">
          {#each visibleEntries as entry}
            <button
              type="button"
              class={`w-full rounded-2xl border p-4 text-left transition-all ${selectedEntry?.date === entry.date ? 'border-pink-400 bg-pink-50 shadow-sm' : 'border-slate-100 bg-slate-50/50 hover:border-pink-200 hover:bg-white hover:shadow-sm'}`}
              onclick={() => (selectedDate = entry.date)}
            >
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="font-bold text-slate-900">#{entry.puzzleNumber}</p>
                  <p class="text-sm text-slate-500">{entry.date}</p>
                </div>
                <div class="flex items-center gap-1.5">
                  {#each entry.colors as color}
                    <span class="h-8 w-8 rounded-lg shadow-sm ring-2 ring-white" style={`background:${color.hex}`}></span>
                  {/each}
                </div>
              </div>
            </button>
          {/each}
        </div>
      </article>

      <!-- Selected Puzzle Detail -->
      <article class="rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        {#if selectedEntry}
          <p class="text-xs font-bold uppercase tracking-[0.24em] text-pink-500">Selected puzzle</p>
          <h2 class="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Colorfle #{selectedEntry.puzzleNumber}</h2>
          <p class="mt-1 text-sm text-slate-500">{selectedEntry.date}</p>

          <!-- Color Mixing Visualization -->
          <div class="mt-6 flex items-center justify-center gap-3">
            {#each selectedEntry.colors as color, i}
              <div class="flex flex-col items-center gap-2">
                <div class="h-20 w-20 rounded-2xl shadow-lg ring-[3px] ring-white" style={`background:${color.hex}`}></div>
                <p class="text-xs font-bold text-slate-700">{color.name}</p>
                <p class="font-mono text-[10px] text-slate-400">{color.hex}</p>
                {#if color.weight != null}
                  <span class="rounded-full bg-pink-50 px-2.5 py-0.5 text-[10px] font-bold text-pink-600">
                    {Math.round(color.weight * 100)}%
                  </span>
                {/if}
              </div>
              {#if i < selectedEntry.colors.length - 1}
                <span class="text-2xl font-black text-slate-300">+</span>
              {/if}
            {/each}
            <span class="text-2xl font-black text-slate-300">=</span>
            <div class="flex flex-col items-center gap-2">
              <div class="h-20 w-20 rounded-full shadow-lg ring-[3px] ring-white" style={`background:${selectedEntry.targetColor.hex}`}></div>
              <p class="text-xs font-bold text-slate-700">Target</p>
              <p class="font-mono text-[10px] text-slate-400">{selectedEntry.targetColor.hex}</p>
            </div>
          </div>

          <!-- Target Color Large Preview -->
          <div class="mt-8 rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <div class="h-40" style={`background:${selectedEntry.targetColor.hex}`}></div>
            <div class="p-5 bg-white">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Target Color</p>
              <p class="mt-2 text-3xl font-black text-slate-900">{selectedEntry.targetColor.hex}</p>
              <p class="mt-1 font-mono text-sm text-slate-400">
                RGB({selectedEntry.targetColor.rgb.r}, {selectedEntry.targetColor.rgb.g}, {selectedEntry.targetColor.rgb.b})
              </p>
            </div>
          </div>
        {/if}
      </article>
    </section>

    <!-- SEO Article Section -->
    <article class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
      <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 mb-6">Why the Colorfle Archive Matters</h2>
      <div class="prose prose-slate dark:prose-invert max-w-none">
        <p>
          The Colorfle archive is an essential resource for players who want to understand the science and art behind daily color puzzles. Unlike word-based games that rely on vocabulary and language skills, Colorfle challenges players to understand color theory, hexadecimal notation, and the relationships between different hues, saturations, and brightness levels. The archive provides a complete record of every past puzzle, including the source colors, intermediate blending steps, and final target hex codes that players were asked to identify.
        </p>
        <p>
          Studying the Colorfle archive reveals important patterns in how the game constructs its daily challenges. You can observe which regions of the color space appear more frequently as targets, how source colors are selected to create varying difficulty levels, and which color transitions tend to confuse players the most. This kind of pattern analysis is invaluable for improving your color perception skills and developing more systematic approaches to each daily puzzle.
        </p>
        <p>
          The archive is also a fascinating resource for designers, artists, and anyone who works with color professionally. Each archived puzzle represents a carefully constructed color challenge that tests understanding of the RGB color model and hex notation. Over time, regular archive review can sharpen your ability to estimate hex values mentally, recognize subtle color differences, and understand how different color channels combine to create the final result.
        </p>

        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Colorfle Answers Work</h3>
        <p>
          Colorfle presents players with a daily color-mixing challenge. Each puzzle provides source colors in hex format and asks players to determine or blend toward a specific target color. The game operates on the RGB color model, where every color is expressed as a six-character hexadecimal code representing the intensity of red, green, and blue channels. Understanding this system is key to solving Colorfle puzzles efficiently.
        </p>
        <p>
          Each daily puzzle in the archive includes the initial source colors and the target hex code that players needed to reach. The difficulty of a given puzzle depends on several factors: the distance between source and target in the color space, whether the transition involves primarily hue shifts or brightness changes, and whether the target falls in a region of the color spectrum that is harder to distinguish visually. Some puzzles present subtle shifts between similar colors, while others require dramatic transformations across the entire color wheel.
        </p>
        <p>
          The Colorfle answer system is deterministic, meaning each date maps to a specific set of colors. This makes the archive a perfect historical record that can be used for study, practice, or simply satisfying curiosity about past puzzles. The archive preserves both the visual color data and the precise hex values for every puzzle.
        </p>

        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Notable Past Colorfle Answers</h3>
        <p>
          The Colorfle archive contains many memorable puzzles that challenged players in creative ways. Particularly difficult entries often involve colors in the teal-to-cyan range, where the green and blue channels are closely balanced, making it harder to distinguish the exact hex values. Past puzzles featuring neon-bright colors, deep jewel tones, and near-grayscale neutrals have all generated discussion in the Colorfle community.
        </p>
        <p>
          Seasonal color themes are visible throughout the archive. Puzzle difficulty and color choices tend to shift subtly with the calendar, with warmer tones appearing more frequently during certain periods and cooler tones during others. Recognizing these broader patterns can help players develop expectations about the types of challenges they might face on any given day.
        </p>

        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How to Use the Colorfle Archive</h3>
        <p>
          Navigate the Colorfle archive using the date picker and list view above. Select any past date to view the complete puzzle data, including source colors, target hex code, and the puzzle number. Use the filter buttons to view the last 30, 90, or 365 days of puzzles. The visual color swatches displayed for each entry make it easy to scan and compare past challenges at a glance.
        </p>

        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">What is a hex code in Colorfle?</h4>
        <p>
          A hex code is a six-character alphanumeric code used in web design and digital graphics to represent colors. In the RGB model, the first two characters represent red intensity, the middle two represent green, and the last two represent blue, each ranging from 00 (none) to FF (maximum).
        </p>

        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How often does Colorfle update?</h4>
        <p>
          Colorfle releases a new color puzzle every day, typically refreshing at midnight based on a set time zone. Each new puzzle appears in the archive as it becomes available.
        </p>

        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can the archive help me improve at Colorfle?</h4>
        <p>
          Yes. Studying past puzzles helps you develop a better intuitive sense of hex values and color relationships. Regular review of archived puzzles trains your eye to recognize color patterns and estimate hex codes more accurately over time.
        </p>

        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How many Colorfle puzzles are in the archive?</h4>
        <p>
          The archive currently contains up to 365 past Colorfle puzzles, with new entries added daily. The complete history is searchable and viewable through the calendar and list interface on this page.
        </p>
      </div>
    </article>
  </div>
</div>
