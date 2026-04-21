<script lang="ts">
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import GlobleCluesSection from '$lib/components/GlobleCluesSection.svelte';
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
  <meta name="news_keywords" content={data.meta.keywords ?? 'globle answer today, globle answer, globle hint, globle hint today'} />
  <link rel="canonical" href="https://wordsolver.tech/globle-answer-today" />
  <meta property="og:title" content={data.meta.title} />
  <meta property="og:description" content={data.meta.description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://wordsolver.tech/globle-answer-today" />
  <meta property="og:image" content={data.meta.featuredImage ?? 'https://wordsolver.tech/wordsolverx.webp'} />
  <meta property="og:image:alt" content={`Globle hints and answer for ${data.formattedDate}`} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.meta.title} />
  <meta name="twitter:description" content={data.meta.description} />
  <meta name="twitter:image" content={data.meta.featuredImage ?? 'https://wordsolver.tech/wordsolverx.webp'} />
  {@html `<script type="application/ld+json">${data.schemas}</script>`}
</svelte:head>

<div class="bg-slate-50 dark:bg-slate-800/30 min-h-screen font-sans">
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-extrabold text-slate-900 dark:text-slate-50 mb-4">{data.meta.title}</h1>
      <p class="text-lg text-slate-600 dark:text-slate-400">Verified Globle hints and the solution for {data.formattedDate}</p>
    </div>

    <GlobleCluesSection country={data.country} date={data.formattedDate}>
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-[0_1px_3px_rgb(0_0_0/0.04)] overflow-hidden">
        <div class="p-8 text-center">
          <div class="mb-6">
            <span class="inline-block px-4 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-sm font-medium tracking-wide">
              TODAY'S ANSWER
            </span>
          </div>

          <h2 class="text-5xl font-black text-slate-900 dark:text-slate-50 mb-8 tracking-tight">{data.country.name}</h2>

          <div class="flex justify-center mb-8">
            <div class="relative">
              <img
                src="https://flagcdn.com/w320/{data.country.code.toLowerCase()}.png"
                srcset="https://flagcdn.com/w640/{data.country.code.toLowerCase()}.png 2x"
                width="200"
                alt="Flag of {data.country.name}"
                class="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm shadow-lg">
                {data.country.latitude.toFixed(2)}°, {data.country.longitude.toFixed(2)}°
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 text-left">
            <div class="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-200 dark:border-teal-800/40">
              <div class="text-sm font-medium text-slate-600 dark:text-slate-400">Continent</div>
              <div class="text-lg font-bold text-slate-900 dark:text-slate-100">{data.country.continent}</div>
            </div>
            <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800/40">
              <div class="text-sm font-medium text-slate-600 dark:text-slate-400">Subregion</div>
              <div class="text-lg font-bold text-slate-900 dark:text-slate-100">{data.country.subregion}</div>
            </div>
            <div class="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <div class="text-sm font-medium text-slate-600 dark:text-slate-400">Country Code</div>
              <div class="text-lg font-bold text-slate-900 dark:text-slate-100">{data.country.code}</div>
            </div>
            <div class="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <div class="text-sm font-medium text-slate-600 dark:text-slate-400">Name Length</div>
              <div class="text-lg font-bold text-slate-900 dark:text-slate-100">{data.country.name.length} letters</div>
            </div>
          </div>

          <div class="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <a href="/globle-archive" class="inline-flex items-center justify-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors group">
              View All Past Answers
              <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </GlobleCluesSection>

    <!-- Comprehensive SEO Article -->
    <article class="mt-12 space-y-8">
      <!-- What is Globle? -->
      <section class="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          What Is Globle?
        </h2>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Globle is a daily geography game that presents you with a blank 3D globe and challenges you to identify a mystery country. There are no letter clues, no word lists, no spelling requirements — just a spinning globe and a text input where you type country names. Each guess lights up a country on the globe with a color that indicates how close you are. The game launched in early 2022 and has maintained a steady player base of geography enthusiasts and casual puzzle solvers alike.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          The game uses Haversine distance — the shortest distance between two points on a sphere — to calculate proximity. When you guess a country, Globle measures the distance between the center of your guessed country and the center of the mystery country. The color scale runs from deep red (within ~500 km) through orange, yellow, and beige to pale white (on the opposite side of the world). This color system is intuitive in a way that pure numbers aren't — you can see at a glance whether you're "hot" or "cold."
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Globle teaches geography through repetition. You might start the game barely able to point to Mongolia on a map, but after a few weeks of daily play, you'll have an intuitive sense of where hundreds of countries are located. The game covers all 195 UN-recognized sovereign states, so you'll encounter countries you've never heard of. Players regularly report learning the locations of countries like Burundi, Timor-Leste, and Suriname — places they might never have thought about otherwise.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          The game was created by an independent developer and runs entirely in the browser. There's no app to download, no account to create, and no paywall. The daily puzzle resets at midnight based on the server's timezone, and each day's mystery country is randomly selected from the full list of world countries.
        </p>
      </section>

      <!-- How Globle Works -->
      <section class="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          How Globle Works: Rules, Hints, and the Daily Cycle
        </h2>
        <div class="space-y-6 text-base sm:text-lg text-slate-600 dark:text-slate-400">
          <p class="leading-relaxed">
            Globle's rules are minimal, which is part of its appeal:
          </p>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Step 1: Make your first guess</h3>
            <p class="leading-relaxed">
              Type any country name into the search box. Globle accepts common names, formal names, and most alternate names (e.g., both "United States" and "USA" work, both "Burma" and "Myanmar" work). Many experienced players start with a large country in a central location — the United States, Russia, Brazil, or China — because these give you useful distance information no matter where the actual answer is.
            </p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Step 2: Read the color-coded distance</h3>
            <p class="leading-relaxed">
              After each guess, the country lights up on the globe. Deep red means very close (typically under 500 km). Orange means you're within a few thousand kilometers. Yellow means moderate distance. Pale beige or white means you're far away — potentially on the wrong continent entirely. The color scale is continuous, so slight shade differences between guesses can tell you if you're moving in the right direction.
            </p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Step 3: Triangulate the region</h3>
            <p class="leading-relaxed">
              Use 2-3 strategic guesses to narrow down the continent and region. If a guess in Western Europe lights up orange but a guess in East Asia lights up white, the answer is almost certainly in Europe or nearby. Once you know the general area, start guessing countries within that region. Each subsequent guess refines your search.
            </p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Step 4: Identify the country</h3>
            <p class="leading-relaxed">
              Once you've isolated the region, systematically guess countries within it. If you're getting red results in West Africa, start with Nigeria, Ghana, Ivory Coast, Senegal — the better-known countries first, then the smaller ones. When you guess correctly, the game confirms it and shows your guess count. There's no guess limit, so you can take as many attempts as you need.
            </p>
          </div>
        </div>
      </section>

      <!-- Today's Globle Answer -->
      <section class="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/40 rounded-xl p-6 sm:p-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Today's Globle Answer: How to Find It
        </h2>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Today's Globle answer is displayed above in the clues section. Use the "Reveal Answer" button to see the country name, flag, coordinates, continent, and subregion. The answer card also shows the country's two-letter code and the number of letters in its name — all useful hints if you want to guess before revealing.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          We fetch the daily answer from our internal database, which is synchronized with Globle's official puzzle schedule. The data includes the country's geographic coordinates, continent, subregion, and ISO country code. If you want to try the puzzle yourself before seeing the answer, use the clue cards above — they give you hints like the continent, name length, first letter, and subregion without revealing the specific country.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          For past Globle answers, our archive page covers every daily puzzle. You can browse by date and see the country, flag, and coordinates for each day. The archive is useful for studying patterns — for example, which continents appear most frequently as answers (Africa and Asia tend to appear more often than North America or Oceania, simply because they have more countries).
        </p>
      </section>

      <!-- Past Globle Answers -->
      <section class="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Past Globle Answers: Patterns in the Country Selection
        </h2>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Globle selects its daily mystery country from all 195 UN-recognized sovereign states. The selection appears random — there's no discernible pattern linking consecutive days or favoring particular regions. However, because Africa has 54 countries and Asia has 49, these continents naturally appear as answers more frequently than Oceania (14 countries) or North America (23 countries).
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Small countries appear as mystery answers more often than you'd expect. Nations like San Marino, Liechtenstein, and Singapore show up regularly, which makes the game challenging — these countries are easy to overlook on a globe. If you're systematically guessing and keep getting "warm" results in a region but can't find the exact country, try the small ones first.
        </p>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          Our Globle archive tracks every daily answer with full geographic metadata. You can use it to study which countries have appeared as answers, how frequently each continent shows up, and which countries are the most common "stumpers" — the ones that take the most guesses on average.
        </p>
      </section>

      <!-- Tips for Globle -->
      <section class="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Globle Strategy: Tips from Experienced Players
        </h2>
        <div class="grid md:grid-cols-2 gap-6 text-base sm:text-lg text-slate-600 dark:text-slate-400">
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Start with spread-out guesses</h3>
            <p class="leading-relaxed">
              Your first 2-3 guesses should cover different continents. Guess one country in Africa, one in Europe, and one in Asia. This immediately tells you which hemisphere and which continent the answer is on. From there, you can focus your remaining guesses on that region.
            </p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Learn your small countries</h3>
            <p class="leading-relaxed">
              The smallest countries by area — Vatican City, Monaco, Nauru, Tuvalu, San Marino — appear as mystery answers regularly. These are the hardest to find because they're nearly invisible on a globe. Spend time memorizing where they are and you'll save yourself dozens of wasted guesses over time.
            </p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Use borders as clues</h3>
            <p class="leading-relaxed">
              If you guess a country and it lights up deep red, the mystery country borders it or is very nearby. Think about which countries border your red guess and try those next. For example, if Brazil is red, try Uruguay, Paraguay, Bolivia, Colombia, Venezuela, Guyana, Suriname, or French Guiana.
            </p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Watch color shade changes</h3>
            <p class="leading-relaxed">
              Don't just look at the color category — pay attention to the exact shade. If one guess is dark orange and another is light orange, the dark orange guess is closer. These subtle differences help you triangulate more precisely than the broad color categories alone.
            </p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Know your island nations</h3>
            <p class="leading-relaxed">
              Island countries are particularly tricky because there's nothing nearby to triangulate against. Learn the major island groups: the Caribbean, Pacific Islands, Southeast Asian archipelagos, and the Mediterranean islands. When the game gives you a red result near an ocean, think islands.
            </p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Don't guess the same country twice</h3>
            <p class="leading-relaxed">
              Globle won't accept duplicate guesses for the same puzzle. Plan your guesses strategically — each one should give you new information. If you've already tested a country in a region, move to the next one rather than re-guessing the same spot.
            </p>
          </div>
        </div>
      </section>

      <!-- Globle Statistics -->
      <section class="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Globle Statistics: Geography by the Numbers
        </h2>
        <div class="space-y-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
          <div class="grid sm:grid-cols-2 gap-6 my-6">
            <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-800/40">
              <p class="text-3xl font-black text-teal-700 dark:text-teal-300 mb-1">195</p>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Possible mystery countries</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">All UN-recognized sovereign states</p>
            </div>
            <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-800/40">
              <p class="text-3xl font-black text-teal-700 dark:text-teal-300 mb-1">~6-12</p>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Average guesses to solve</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Varies widely by geographic knowledge</p>
            </div>
            <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-800/40">
              <p class="text-3xl font-black text-teal-700 dark:text-teal-300 mb-1">54</p>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">African countries</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">The continent with the most countries — appears often</p>
            </div>
            <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-200 dark:border-teal-800/40">
              <p class="text-3xl font-black text-teal-700 dark:text-teal-300 mb-1">Unlimited</p>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Guesses per puzzle</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">No guess limit — take your time</p>
            </div>
          </div>
          <p class="leading-relaxed">
            By continent, Africa has the most countries (54), followed by Asia (49), Europe (44), North America (23), South America (12), and Oceania (14). This distribution means African and Asian countries appear as mystery answers more frequently than countries from smaller continents. Russia is the largest country by area (17.1 million km²) while Vatican City is the smallest (0.44 km²).
          </p>
          <p class="leading-relaxed">
            Experienced Globle players typically solve each puzzle in 6-12 guesses. New players often need 15-25 guesses, especially when the mystery country is a small nation in Africa or the Pacific Islands. The most commonly missed countries are small island nations (e.g., São Tomé and Príncipe, Comoros, Tonga) and landlocked countries in Central Asia (e.g., Tajikistan, Kyrgyzstan).
          </p>
        </div>
      </section>

      <!-- FAQ -->
      <section class="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-[0_1px_3px_rgb(0_0_0/0.04)] border border-slate-200 dark:border-slate-700">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Globle FAQ: Questions Geography Fans Ask
        </h2>
        <div class="space-y-6 text-base text-slate-600 dark:text-slate-400">
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Does Globle use all countries?</h3>
            <p class="leading-relaxed">
              Yes. Globle draws from all 195 UN-recognized sovereign states. This includes microstates like Monaco and Vatican City, large nations like Russia and Canada, and every country in between. Dependent territories and territories with disputed status (like Taiwan or Kosovo) may or may not appear depending on how Globle classifies them.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">How does Globle calculate distance?</h3>
            <p class="leading-relaxed">
              Globle uses the Haversine formula to calculate the great-circle distance between the geographic centers of two countries. The distance is measured in kilometers, then mapped to a color scale. This means the distance is "as the crow flies" — it doesn't account for political borders, bodies of water, or travel routes.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Can I play Globle on my phone?</h3>
            <p class="leading-relaxed">
              Yes. Globle works in any mobile browser and is fully responsive. The 3D globe renders well on both iOS and Android devices. There is no official Globle app — the game runs entirely on the web. Bookmark the Globle website for easy daily access.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">What time does Globle reset?</h3>
            <p class="leading-relaxed">
              Globle resets at midnight based on its server's timezone. The exact local time depends on where you are. Check the date displayed on the game to confirm which day's puzzle you're currently solving. Our answer page synchronizes with Globle's server schedule.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Why does the same country keep appearing?</h3>
            <p class="leading-relaxed">
              It doesn't — or at least, it shouldn't. Globle's daily country selection is random from the full pool. If you feel like you're seeing the same continent repeatedly, that's because some continents have more countries (Africa: 54, Asia: 49) and thus statistically appear more often. The specific countries should not repeat within any reasonable timeframe.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">What are the hardest Globle countries?</h3>
            <p class="leading-relaxed">
              The hardest countries are the smallest ones: Vatican City, Monaco, Nauru, Tuvalu, San Marino, Liechtenstein, Marshall Islands, and Saint Kitts and Nevis. These are so small on the globe that even neighboring countries light up as only moderately warm. Players who can identify these countries quickly are in the top tier of Globle solvers.
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
</div>
