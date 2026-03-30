<script lang="ts">
    import { onMount } from 'svelte';
    import FiChevronDown from '$lib/components/icons/FiChevronDown.svelte';
    import { loadStats, loadGameState } from '$lib/wordle/helpers';

    const wordLengths = [4, 5, 6, 7, 8, 9, 10, 11, 12];

    const faqs = [
        {
            q: "What is Multidle?",
            a: "Multidle is a free Wordle hub that lets you play word puzzles with 4 to 12 letter words. Unlike the standard Wordle which only uses 5-letter words, Multidle gives you the freedom to choose your difficulty level."
        },
        {
            q: "How is Multidle different from the original Wordle?",
            a: "While the original Wordle gives you one 5-letter puzzle per day, Multidle offers daily, weekly, and unlimited puzzles across 9 different word lengths (4-12 letters). You can play as many games as you want!"
        },
        {
            q: "Is Multidle free to play?",
            a: "Yes, Multidle is 100% free to play. You can access daily challenges, weekly puzzles, and unlimited practice games without creating an account or paying anything."
        },
        {
            q: "Can I create my own Wordle puzzle?",
            a: "Absolutely! Use our Custom Wordle Creator to enter any word between 4 and 12 letters, and we'll generate a shareable link. Send it to friends and see who can guess your word!"
        },
        {
            q: "How many guesses do I get in Multidle?",
            a: "You get 6 guesses per puzzle, just like the original Wordle. The tiles turn green for correct letters in the right position, yellow for correct letters in the wrong position, and gray for letters not in the word."
        },
        {
            q: "Are the word dictionaries validated?",
            a: "Yes, every word length uses a curated dictionary of real English words. Your guesses must be valid words from our dictionary, and the daily answers are always common, recognizable words."
        },
    ];

    let openFaq = $state<number | null>(null);

    // stats state
    let totalPlayed = $state(0);
    let totalWon = $state(0);
    let aggregateWinPercent = $state(0);
    let dailyCompletions = $state<Record<number, boolean>>({});

    onMount(() => {
        let played = 0;
        let won = 0;
        const todayStr = new Date().toDateString();
        
        for (const len of wordLengths) {
            try {
                // aggregate daily stats
                const stats = loadStats(len, 'daily');
                played += stats.gamesPlayed;
                won += stats.gamesWon;
                
                // check daily completion
                const state = loadGameState(len, 'daily', todayStr);
                if (state && (state.gameStatus === 'WIN' || state.gameStatus === 'FAIL')) {
                    dailyCompletions[len] = true;
                } else {
                    dailyCompletions[len] = false;
                }
            } catch (e) {
                dailyCompletions[len] = false;
            }
        }
        
        totalPlayed = played;
        totalWon = won;
        aggregateWinPercent = played > 0 ? Math.round((won / played) * 100) : 0;
    });
</script>

<svelte:head>
    <title>Multidle - Play 4 to 12 Letter Wordle Puzzles | WordSolverX</title>
    <meta name="description" content="Play Multidle, the free Wordle hub for 4 to 12 letter puzzles with daily games, weekly challenges, unlimited practice, and custom word creation on WordSolverX." />
    <link rel="canonical" href="https://wordsolver.tech/multidle" />
    <meta property="og:title" content="Multidle - Play 4 to 12 Letter Wordle Puzzles | WordSolverX" />
    <meta property="og:description" content="Play free 4 to 12 letter Wordle-style puzzles with daily, weekly, and unlimited modes in one hub." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://wordsolver.tech/multidle" />
    <meta property="og:site_name" content="WordSolverX" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Multidle - Play 4 to 12 Letter Wordle Puzzles | WordSolverX" />
    <meta name="twitter:description" content="Play Wordle variants from 4 to 12 letters with daily, weekly, and unlimited puzzle modes." />
    <meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
    {@html `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          name: 'Multidle',
          description: 'Wordle hub for 4 to 12 letter daily, weekly, and unlimited puzzle play.',
          url: 'https://wordsolver.tech/multidle'
        },
        {
          '@type': 'WebApplication',
          name: 'Multidle',
          description: 'Play multiple Wordle variants with different word lengths.',
          applicationCategory: 'Game',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
        }
      ]
    })}</script>`}
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-purple-900 to-gray-900 pt-16 pb-20">
        <div class="absolute inset-0">
            <div class="absolute top-0 left-1/3 w-[400px] h-[400px] rounded-full bg-indigo-500/15 blur-[120px]"></div>
            <div class="absolute bottom-0 right-1/3 w-[300px] h-[300px] rounded-full bg-purple-500/15 blur-[100px]"></div>
            <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 24px 24px;"></div>
        </div>
        <div class="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-6">
                <span class="text-sm font-medium text-purple-300">9 Word Lengths Available</span>
            </div>
            <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight">
                <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Multidle</span>
            </h1>
            <p class="max-w-2xl mx-auto text-lg text-gray-300 mb-8">
                The ultimate word puzzle experience. Play daily challenges, weekly puzzles, or unlimited practice across <strong class="text-white">4 to 12 letter</strong> Wordle variants.
            </p>
            <a href="/create-custom-wordle" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all backdrop-blur-sm">
                Create Custom Challenge
            </a>
        </div>
    </section>

    <!-- Aggregate Stats Dashboard -->
    <section class="max-w-4xl mx-auto px-4 mt-6 mb-4">
        <h2 class="sr-only">Multidle Stats Overview</h2>
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-wrap items-center justify-around gap-6">
            <div class="text-center">
                <p class="text-3xl font-black text-indigo-600 dark:text-indigo-400">{totalPlayed}</p>
                <h3 class="text-xs tracking-widest uppercase font-bold text-gray-500 dark:text-gray-400 mt-1">Total Played</h3>
            </div>
            <div class="w-px h-12 bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
            <div class="text-center">
                <p class="text-3xl font-black text-green-600 dark:text-green-400">{totalWon}</p>
                <h3 class="text-xs tracking-widest uppercase font-bold text-gray-500 dark:text-gray-400 mt-1">Total Won</h3>
            </div>
            <div class="w-px h-12 bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
            <div class="text-center">
                <p class="text-3xl font-black text-purple-600 dark:text-purple-400">{aggregateWinPercent}%</p>
                <h3 class="text-xs tracking-widest uppercase font-bold text-gray-500 dark:text-gray-400 mt-1">Win Rate</h3>
            </div>
        </div>
    </section>

    <!-- Game Grid -->
    <section class="max-w-6xl mx-auto px-4 pb-14 pt-8">
        <div class="text-center mb-10">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Choose Your Word Length</h2>
            <p class="text-gray-500 dark:text-gray-400">Pick a length and start playing - daily, weekly, or unlimited.</p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {#each wordLengths as len}
                <a
                    href="/{len}-letter-wordle"
                    class="group relative flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 p-6 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                    {#if dailyCompletions[len]}
                        <div class="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" title="Daily puzzle completed!"></div>
                    {/if}
                    <div class="z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-black text-white mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/20">
                        {len}
                    </div>
                    <h3 class="z-10 font-bold text-gray-800 dark:text-white text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {len} Letters
                    </h3>
                    <span class="z-10 text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">Daily / Weekly / Unlimited</span>

                    <!-- Hover overlay for quick Play -->
                    <div class="absolute inset-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto px-4 z-20">
                        <span class="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg w-full text-center text-sm shadow-indigo-500/25">
                            {dailyCompletions[len] ? 'Play Unlimited ↗' : 'Play Daily ↗'}
                        </span>
                    </div>
                </a>
            {/each}
        </div>
    </section>

    <!-- How It Works -->
    <section class="bg-white dark:bg-gray-800/50 border-y border-gray-200 dark:border-gray-700/50 py-14">
        <div class="max-w-5xl mx-auto px-4">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">How Multidle Works</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="text-center">
                    <div class="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mx-auto mb-4 text-2xl">&#127919;</div>
                    <h3 class="font-bold text-gray-900 dark:text-white mb-2">1. Pick a Length</h3>
                    <p class="text-gray-500 dark:text-gray-400 text-sm">Choose from 4 to 12 letter puzzles. Longer words are harder!</p>
                </div>
                <div class="text-center">
                    <div class="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto mb-4 text-2xl">&#128154;</div>
                    <h3 class="font-bold text-gray-900 dark:text-white mb-2">2. Guess the Word</h3>
                    <p class="text-gray-500 dark:text-gray-400 text-sm">Type valid words and use the color clues - green, yellow, or gray.</p>
                </div>
                <div class="text-center">
                    <div class="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mx-auto mb-4 text-2xl">&#127942;</div>
                    <h3 class="font-bold text-gray-900 dark:text-white mb-2">3. Solve in 6 Tries</h3>
                    <p class="text-gray-500 dark:text-gray-400 text-sm">You have 6 guesses to find the secret word. Can you do it?</p>
                </div>
            </div>
        </div>
    </section>

    <!-- About Text -->
    <section class="max-w-4xl mx-auto px-4 py-14">
        <div class="prose prose-lg dark:prose-invert max-w-none">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">About Multidle on WordSolverX</h2>
            <p class="text-gray-600 dark:text-gray-300">
                Multidle is your go-to destination for playing Wordle-style puzzles beyond the original 5-letter format. Whether you want a quick 4-letter warm-up or a brain-bending 12-letter challenge, Multidle has it all. Each word length features its own <strong>daily puzzle</strong> that refreshes at midnight, a <strong>weekly challenge</strong> for longer play, and an <strong>unlimited mode</strong> so you never run out of puzzles.
            </p>
            <p class="text-gray-600 dark:text-gray-300">
                All puzzles use curated dictionaries of real English words, ensuring every guess and answer is valid. The game follows the classic Wordle rules - green tiles for correct letters in the right spot, yellow for correct letters in the wrong spot, and gray for letters not in the word. You get 6 attempts to solve each puzzle.
            </p>
            <p class="text-gray-600 dark:text-gray-300">
                Looking for an extra challenge? Try our <a href="/create-custom-wordle" class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Custom Wordle Creator</a> to make your own puzzle and share it with friends. You can also use our <a href="/wordle-solver" class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Wordle Solver</a> when you get stuck on any puzzle.
            </p>
        </div>
    </section>

    <!-- FAQs -->
    <section class="bg-white dark:bg-gray-800/50 border-y border-gray-200 dark:border-gray-700/50 py-14">
        <div class="max-w-3xl mx-auto px-4">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">Frequently Asked Questions</h2>
            <div class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                {#each faqs as faq, i}
                    <div class="{i < faqs.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}">
                        <button
                            onclick={() => openFaq = openFaq === i ? null : i}
                            class="w-full flex items-center justify-between px-5 py-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                        >
                            <span class="font-semibold text-gray-900 dark:text-white pr-4">{faq.q}</span>
                            <FiChevronDown class="w-5 h-5 flex-shrink-0 text-gray-400 transition-transform duration-200 {openFaq === i ? 'rotate-180' : ''}" />
                        </button>
                        <div class="overflow-hidden transition-all duration-300 {openFaq === i ? 'max-h-40' : 'max-h-0'}">
                            <p class="px-5 pb-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </section>
</div>
