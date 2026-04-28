<script lang="ts">
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import FAQSection from '$lib/components/FAQSection.svelte';
  import WorldleCountryCard from '$lib/components/worldle/WorldleCountryCard.svelte';
  import {
    PRESTON_HAYES_AUTHOR_DESCRIPTION,
    PRESTON_HAYES_AUTHOR_IMAGE,
    PRESTON_HAYES_AUTHOR_NAME
  } from '$lib/authors';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <meta
    name="keywords"
    content={data.meta.keywords ?? 'worldle answer today, worldle answer, worldle hint, worldle hint today'}
  />
  <link rel="canonical" href={data.meta.canonical} />
  <meta property="og:title" content={data.meta.title} />
  <meta property="og:description" content={data.meta.description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={data.meta.canonical} />
  <meta property="og:image" content="https://wordsolverx.com/images/worldle-answer-today.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.meta.title} />
  <meta name="twitter:description" content={data.meta.description} />
  <meta name="twitter:image" content="https://wordsolverx.com/images/worldle-answer-today.webp" />
  {@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

<main class="min-h-screen bg-slate-50">
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
    <Breadcrumbs />

    <section class="mt-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-700 via-blue-800 to-indigo-900 px-6 py-8 text-white shadow-2xl shadow-sky-500/20 sm:px-8 sm:py-10">
      <div class="max-w-4xl">
        <p class="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
          Server-rendered Worldle answer page
        </p>
        <h1 class="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
          Worldle Answer Today ({data.formattedTodayDate})
        </h1>
        <p class="mt-4 max-w-3xl text-base leading-7 text-sky-50/90 sm:text-lg">
          Check the verified Worldle country for {data.formattedTodayDate}, then jump to the dedicated archive page if you need an older Worldle answer.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <div class="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white">
            <img
              alt={`Flag of ${data.todayAnswer.country.name}`}
              class="h-6 w-8 rounded-md border border-white/20 object-cover"
              height="24"
              loading="lazy"
              src={`https://flagcdn.com/w40/${data.todayAnswer.country.code.toLowerCase()}.png`}
              width="32"
            />
            <span>{data.todayAnswer.country.name}</span>
          </div>
          <div class="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white">
            <span>Worldle #{data.todayAnswer.worldleNumber}</span>
          </div>
          <div class="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white">
            <span>Updates at 00:00 UTC</span>
          </div>
        </div>
      </div>
    </section>

    <div class="mt-8">
      <WorldleCountryCard
        answer={data.todayAnswer}
        headline="Today's Worldle answer"
        subheadline={`This page is refreshed automatically for the active Worldle day. Today is ${data.formattedTodayDate}.`}
      />
    </div>

    <section class="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">More Worldle tools</p>
          <h2 class="mt-1 text-3xl font-black tracking-tight text-slate-900">Open the archive or solve first</h2>
          <p class="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Older Worldle answers now live on the dedicated archive page, so this today page stays focused on the current country only.
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <a
            class="inline-flex items-center justify-center rounded-2xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-500  "
            href="/worldle-archive"
          >
            Browse Worldle Archive
          </a>
          <a
            class="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
            href="/worldle-solver"
          >
            Open Worldle Solver
          </a>
        </div>
      </div>
    </section>

    <div class="mt-10 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/60">
      <FAQSection faqs={data.faqEntries} title="Worldle Answers For The Last 10 Days" />
    </div>

    <article class="mt-10 space-y-8">
      <section class="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xl shadow-slate-200/60">
        <h2 class="text-3xl font-black tracking-tight text-slate-900">What is Worldle?</h2>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          Worldle is a daily geography puzzle where you guess a hidden country based on its outline shape. Each day, the game presents a silhouette and gives you six attempts to name the correct country. After every wrong guess, Worldle returns three pieces of feedback: the distance in kilometers between your guess and the target, a directional arrow pointing toward the answer, and a proximity percentage that shows how close you are.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          Those three data points make each guess progressively more informative, turning a seemingly impossible task into a solvable logic puzzle.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          The game was created in early 2022 by a French developer and quickly went viral among geography enthusiasts and casual players alike. It capitalized on the same daily-puzzle format that made Wordle a household name, but swapped words for maps. The concept is simple enough that anyone can play — even people who haven't looked at a map in years — but challenging enough that perfect scores feel genuinely earned.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          You do not need to be a geography expert to enjoy Worldle, but knowing your continents, major countries, and rough locations gives you a serious advantage.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          Worldle draws from a database of every internationally recognized country and territory. That means the answer pool is enormous — over 190 possible answers — which keeps the game fresh for months of daily play. Unlike word games where you might see the same answer within a year, Worldle's rotation is large enough that repeat encounters are rare.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          The daily puzzle resets at midnight UTC, and each puzzle is assigned a sequential Worldle number that players use to track their progress and discuss answers online.
        </p>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xl shadow-slate-200/60">
        <h2 class="text-3xl font-black tracking-tight text-slate-900">How Worldle Works</h2>
        <div class="mt-6 space-y-6">
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-xl font-bold text-slate-900 mb-2">The Silhouette</h3>
            <p class="text-base leading-7 text-slate-600">
          Each puzzle starts with a country silhouette — just the outline shape with no labels, no borders with neighbors, and no geographic context. The silhouette is oriented in its standard map position, so you can use cardinal direction to narrow down possibilities.
        </p>
        <p class="text-base leading-7 text-slate-600">
          Countries with highly distinctive shapes (like Italy, Chile, or Japan) are significantly easier to identify than countries with more generic or irregular outlines.
        </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-xl font-bold text-slate-900 mb-2">Distance, Direction, and Proximity</h3>
            <p class="text-base leading-7 text-slate-600">
          Every incorrect guess triggers a feedback triple. The distance tells you the straight-line kilometers between your guess and the target. The arrow tells you which direction the target sits relative to your guess — north, south, east, west, or any diagonal.
        </p>
        <p class="text-base leading-7 text-slate-600">
          The proximity percentage shows how close you are on a 0-100 scale, where 100 means you have found the answer. If you guess Brazil and the target is Argentina, you might see "1,200 km → 85%." That tells you you are very close and heading south.
        </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-xl font-bold text-slate-900 mb-2">Six Guesses</h3>
            <p class="text-base leading-7 text-slate-600">
          You get six attempts per puzzle, the same number Wordle grants. With smart guessing — starting broad with a continental guess, then narrowing based on the distance and direction feedback — most puzzles can be solved in 3 to 4 guesses.
        </p>
        <p class="text-base leading-7 text-slate-600">
          The difficulty spikes when the answer is a small country in a region with many neighbors, like a microstate in Europe or a small African nation surrounded by similarly-sized countries.
        </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-xl font-bold text-slate-900 mb-2">Daily Reset at Midnight UTC</h3>
            <p class="text-base leading-7 text-slate-600">
          Worldle resets at 00:00 UTC every day. The hero section of this page shows "Updates at 00:00 UTC" to keep that timing clear. Unlike some games that use local midnight, Worldle uses a single global reset, which means the puzzle changes at the same instant for every player on Earth.
        </p>
        <p class="text-base leading-7 text-slate-600">
          This page tracks that schedule and always displays the current day's answer.
        </p>
          </div>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xl shadow-slate-200/60">
        <h2 class="text-3xl font-black tracking-tight text-slate-900">Today's Worldle Answer — What This Page Shows</h2>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          This page displays the verified answer for Worldle #{data.todayAnswer.worldleNumber}, dated {data.formattedTodayDate}. The country card above shows the country name, its flag, and geographic details pulled directly from our database.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          You can verify the answer against the official game at any time — the data on this page stays synchronized with the active Worldle puzzle.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          If you want to solve the puzzle yourself before seeing the answer, scroll down to use the Worldle Solver. It runs entirely in your browser and lets you filter countries by continent, population, and other attributes to narrow down possibilities without revealing the answer.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          The solver and the answer page use the same country dataset, so the filtering results always align with the actual answer pool.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          The FAQ section below covers the last 10 days of Worldle answers, which is useful if you missed a day and want to catch up quickly. For a complete historical record, the Worldle Archive page stores every past answer with dates, country names, and Worldle numbers.
        </p>
        <p class="mt-4 text-lg leading-8 text-slate-600">
          The archive is searchable and filterable, so you can find any specific puzzle by number or date.
        </p>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xl shadow-slate-200/60">
        <h2 class="text-3xl font-black tracking-tight text-slate-900">Strategy Tips for Worldle</h2>
        <div class="mt-6 grid gap-6 sm:grid-cols-2">
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-lg font-bold text-slate-900">Start with a continental guess</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
          Your first guess should identify the continent, not the country. Guess a large country in the region where you think the silhouette belongs — Brazil for South America, Russia for Asia, DR Congo for Africa.
        </p>
        <p class="mt-2 text-base leading-7 text-slate-600">
          The distance feedback will tell you whether you are on the right continent or need to pivot. A wrong continent wastes a guess, so aim wide first.
        </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-lg font-bold text-slate-900">Use the proximity percentage aggressively</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
          The proximity percentage is your most precise tool. A reading above 80% means you are very close — usually within one or two countries. Between 50% and 80% means you are in the right region but not adjacent.
        </p>
        <p class="mt-2 text-base leading-7 text-slate-600">
          Below 50% means you are probably on the wrong continent or hemisphere. Let the percentage guide every subsequent guess.
        </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-lg font-bold text-slate-900">Learn country shapes by region</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
          Silhouette recognition improves fast with practice. After a week of daily play, you will start recognizing the outlines of major countries automatically. Focus on the tricky ones: small African nations, Central Asian countries, Caribbean islands, and European microstates.
        </p>
        <p class="mt-2 text-base leading-7 text-slate-600">
          These are the ones that cost players extra guesses.
        </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-lg font-bold text-slate-900">Pay attention to scale</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
          Worldle displays every silhouette at the same zoom level, which means you can compare sizes directly. If the silhouette is tiny, the answer is likely a small country or island nation.
        </p>
        <p class="mt-2 text-base leading-7 text-slate-600">
          If it spans most of the frame, you are looking at a large country like Russia, Canada, or Brazil. Size is one of the most underrated clues in the game.
        </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-lg font-bold text-slate-900">Follow the direction arrow literally</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
          The direction arrow points from your guess toward the target country. If it points southwest, the answer is southwest of wherever you guessed. This is straightforward for landlocked guesses but gets trickier across oceans.
        </p>
        <p class="mt-2 text-base leading-7 text-slate-600">
          If you guess Australia and the arrow points northeast, the answer could be in Southeast Asia or the Pacific Islands.
        </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-lg font-bold text-slate-900">Use the Worldle Solver for tough puzzles</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
              When you are down to your last two guesses and cannot decide between neighboring countries, open the Worldle Solver. Filter by continent, then sort by bordering countries. Cross-referencing the solver's filters with the distance and direction feedback usually isolates the correct answer quickly.
            </p>
          </div>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xl shadow-slate-200/60">
        <h2 class="text-3xl font-black tracking-tight text-slate-900">Worldle vs Other Geography Games</h2>
        <div class="mt-6 grid gap-6 sm:grid-cols-2">
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-lg font-bold text-slate-900">Worldle vs Globle</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
          Globle shows a full world map and colors countries based on proximity as you guess. Worldle shows only a silhouette and returns numeric distance data. Globle is more visual and intuitive.
        </p>
        <p class="mt-2 text-base leading-7 text-slate-600">
          Worldle is more analytical and requires you to interpret numbers. Both test geography knowledge, but Worldle demands stronger spatial reasoning.
        </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-lg font-bold text-slate-900">Worldle vs Flagle</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
              Flagle shows a country's flag and you guess the country. Worldle shows a silhouette and you guess the country. Flagle tests flag recognition. Worldle tests shape recognition. They sound similar but exercise completely different knowledge. Some players are excellent at one and terrible at the other.
            </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-lg font-bold text-slate-900">Worldle vs Geodle</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
              Geodle combines word-game and geography elements. Worldle is pure geography. Geodle might ask you to guess a capital city or a landmark. Worldle always asks for a country. If you want focused country-identification practice, Worldle is the more consistent choice.
            </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-6">
            <h3 class="text-lg font-bold text-slate-900">Who is Worldle best for?</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
          Travelers, geography teachers, map enthusiasts, and anyone who enjoys learning about the world. Worldle has broad appeal because it does not require specialist knowledge — just a rough sense of where countries are.
        </p>
        <p class="mt-2 text-base leading-7 text-slate-600">
          It is also an excellent teaching tool. Many teachers use Worldle in classrooms to build basic geographic literacy in students of all ages.
        </p>
          </div>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xl shadow-slate-200/60">
        <h2 class="text-3xl font-black tracking-tight text-slate-900">Frequently Asked Questions About Worldle</h2>
        <div class="mt-6 space-y-6">
          <div>
            <h3 class="text-lg font-bold text-slate-900">What time does Worldle reset?</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
          Worldle resets at midnight UTC (Coordinated Universal Time). That is 7:00 PM Eastern, 4:00 PM Pacific, and 5:30 AM IST the next day. Because it uses a single global timezone, every player in the world sees the new puzzle at exactly the same moment.
        </p>
        <p class="mt-2 text-base leading-7 text-slate-600">
          This page tracks the UTC schedule and always displays the current day's answer.
        </p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900">How many countries are in the Worldle answer pool?</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
          Worldle uses every internationally recognized country and territory — over 190 possible answers. That makes the rotation significantly larger than most word games. With 190+ answers and one puzzle per day, it takes well over six months for the full cycle to complete.
        </p>
        <p class="mt-2 text-base leading-7 text-slate-600">
          You can play daily for a year and still encounter mostly fresh answers.
        </p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900">Does Worldle include overseas territories?</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
          The answer pool focuses on sovereign nations, but some versions include dependent territories like Greenland, French Guiana, or Puerto Rico. If the silhouette looks unfamiliar and does not match any country you know, consider that it might be a territory rather than an independent nation.
        </p>
        <p class="mt-2 text-base leading-7 text-slate-600">
          This page lists the exact answer name so there is never ambiguity.
        </p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900">What counts as a good Worldle score?</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
          Solving in 1 or 2 guesses is exceptional and usually means the silhouette was unmistakable. Solving in 3 guesses is strong. Most players average 3 to 4 guesses per puzzle. If you are consistently solving in 4 or fewer, you are above average.
        </p>
        <p class="mt-2 text-base leading-7 text-slate-600">
          Needing all 6 guesses usually means the answer was a small, oddly-shaped country in a crowded region like West Africa or Central Europe.
        </p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900">Can I use this page to cheat?</h3>
            <p class="mt-2 text-base leading-7 text-slate-600">
          Technically, yes. The answer is visible on this page without any gate. But most people who visit this page have already tried the puzzle and either failed or want to verify their answer.
        </p>
        <p class="mt-2 text-base leading-7 text-slate-600">
          If you have not played yet, close this tab, open Worldle, and give it an honest attempt first. The game is more satisfying when you earn the answer yourself.
        </p>
          </div>
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
</main>
