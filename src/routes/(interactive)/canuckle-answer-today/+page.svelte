<script lang="ts">
        import AuthorCard from '$lib/components/AuthorCard.svelte';
        import InternalLinkSection from '$lib/components/InternalLinkSection.svelte';
        import FiChevronDown from '$lib/components/icons/FiChevronDown.svelte';
        import WordlebotWasmClient from '$lib/components/wordlebot/WordlebotWasmClient.svelte';
        import {
                PRESTON_HAYES_AUTHOR_DESCRIPTION,
                PRESTON_HAYES_AUTHOR_IMAGE,
                PRESTON_HAYES_AUTHOR_NAME
        } from '$lib/authors';

        let { data } = $props();

        const featuredImage = $derived(data.meta?.featuredImage ?? '/images/canuckle-answer-today.webp');
        const formattedDate = $derived(data.formattedDate ?? 'today');
</script>

<svelte:head>
        <title>{data.meta?.title ?? 'Canuckle Answer Today'}</title>
        <meta name="description" content={data.meta?.description ?? ''} />
        <meta name="robots" content="index, follow, max-snippet:-1" />
        <meta
                name="news_keywords"
                content={data.meta?.keywords ?? 'canuckle answer today, canuckle hint, daily canadian puzzle'}
        />
        <link rel="canonical" href="https://wordsolver.tech/canuckle-answer-today" />
        <meta property="og:title" content={data.meta?.title ?? 'Canuckle Answer Today'} />
        <meta property="og:description" content={data.meta?.description ?? ''} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://wordsolver.tech/canuckle-answer-today" />
        <meta property="og:image" content={featuredImage} />
        <meta property="og:image:alt" content={`Canuckle daily word solution for ${formattedDate}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.meta?.title ?? 'Canuckle Answer Today'} />
        <meta name="twitter:description" content={data.meta?.description ?? ''} />
        <meta name="twitter:image" content={featuredImage} />
        {#if data.schemas}
                {@html `<script type="application/ld+json">${data.schemas}</script>`}
        {/if}
</svelte:head>

{#if data.error || !data.todayPuzzle}
        <div class="min-h-screen flex items-center justify-center p-4" style="background-color:#FFFBF0">
                <div class="max-w-2xl border border-stone-200 bg-white p-8 text-center shadow-lg">
                        <p class="text-sm font-semibold uppercase tracking-[0.3em]" style="color:#991B1B">Canuckle</p>
                        <h1 class="mt-3 text-3xl font-black" style="font-family:Georgia,'Times New Roman',serif;color:#1C1917">Canuckle data is temporarily unavailable</h1>
                        <p class="mt-4 text-base leading-7" style="color:#57534e">
                                We could not load a verified Canuckle answer for {formattedDate} right now. You can still browse the archive or use the solver while the latest data refreshes.
                        </p>
                        <div class="mt-6 flex flex-wrap justify-center gap-3">
                                <a
                                        href="/canuckle-archive"
                                        class="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                                        style="background-color:#991B1B"
                                >
                                        Browse Canuckle Archive
                                </a>
                                <a
                                        href="/canuckle-solver"
                                        class="inline-flex items-center justify-center border-2 px-5 py-3 text-sm font-semibold transition hover:bg-stone-50"
                                        style="border-color:#991B1B;color:#991B1B"
                                >
                                        Open Canuckle Solver
                                </a>
                        </div>
                </div>
        </div>
{:else}
        <!-- ═══════════════════════════════════════════════════════════════
             PREMIUM EDITORIAL MAGAZINE DESIGN — CANUCKLE ANSWER TODAY
             ═══════════════════════════════════════════════════════════════ -->
        <div class="min-h-screen" style="background-color:#FFFBF0;font-family:system-ui,-apple-system,sans-serif">

                <!-- ─── HERO SECTION: Full-width crimson bar ─── -->
                <header class="relative overflow-hidden" style="background:linear-gradient(135deg,#7F1D1D 0%,#991B1B 30%,#B91C1C 60%,#991B1B 100%)">
                        <!-- Subtle maple-leaf pattern overlay -->
                        <div class="absolute inset-0 opacity-[0.04]" style="background-image:url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22><text x=%2210%22 y=%2240%22 font-size=%2232%22 fill=%22white%22>&#127811;</text></svg>');background-repeat:repeat"></div>
                        <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-16">
                                <div class="flex flex-wrap items-center gap-3 mb-4">
                                        <span class="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-white/90 backdrop-blur-sm">
                                                &#127811; Daily Canuckle
                                        </span>
                                        <span class="px-3 py-1 text-xs font-bold text-white" style="background-color:#D97706">Puzzle #{data.todayPuzzle.index}</span>
                                </div>

                                <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-[0.08em] sm:tracking-[0.12em] text-white leading-none sm:leading-none">
                                        Canuckle Answer
                                        <span class="block mt-1 sm:mt-2" style="color:#F59E0B">Today</span>
                                </h1>

                                <p class="mt-4 max-w-2xl text-base sm:text-lg leading-7 text-white/75">
                                        Verified answer, puzzle number, and Canadian fact for <span class="font-semibold text-white">{formattedDate}</span>. The answer stays hidden until you choose to reveal it.
                                </p>

                                <div class="mt-8 flex flex-wrap gap-3">
                                        <a
                                                href="#today-answer-reveal"
                                                class="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white transition hover:brightness-110"
                                                style="background-color:#D97706"
                                        >
                                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                                Reveal Answer
                                        </a>
                                        <a
                                                href="/canuckle-solver"
                                                class="inline-flex items-center gap-2 border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                                        >
                                                Open Solver
                                        </a>
                                        <a
                                                href="/canuckle-archive"
                                                class="inline-flex items-center gap-2 border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                                        >
                                                Browse Archive
                                        </a>
                                </div>
                        </div>
                        <!-- Bottom accent line -->
                        <div class="h-1" style="background:linear-gradient(90deg,#D97706,#F59E0B,#D97706)"></div>
                </header>

                <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

                        <!-- ─── FEATURED IMAGE: Cinematic aspect ratio ─── -->
                        <div class="mt-0 mb-10 overflow-hidden border-2 border-stone-200 shadow-lg" style="aspect-ratio:21/9;background-color:#1C1917">
                                <img
                                        src={featuredImage}
                                        alt={`Canuckle daily word solution for ${formattedDate}`}
                                        class="h-full w-full object-cover"
                                        loading="eager"
                                />
                        </div>

                        <!-- ─── REVEAL SECTION ─── -->
                        <div class="mb-12" id="today-answer-reveal">
                                <WordlebotWasmClient config={{ pageType: 'canuckle-daily', visibleDateKey: data.visibleDateKey }} />
                        </div>

                        <!-- ─── E-E-A-T TRUST BOX ─── -->
                        <div class="mb-12 grid grid-cols-2 md:grid-cols-4 divide-x divide-stone-200 border border-stone-200 bg-white shadow-sm">
                                <div class="flex items-center gap-3 px-4 py-4 sm:px-5 sm:py-5">
                                        <svg class="h-5 w-5 flex-shrink-0" style="color:#16A34A" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                                        <div>
                                                <p class="text-xs font-bold uppercase tracking-wider" style="color:#991B1B">Verified Daily</p>
                                                <p class="text-xs mt-0.5" style="color:#78716c">Answers checked each day</p>
                                        </div>
                                </div>
                                <div class="flex items-center gap-3 px-4 py-4 sm:px-5 sm:py-5">
                                        <svg class="h-5 w-5 flex-shrink-0" style="color:#991B1B" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        <div>
                                                <p class="text-xs font-bold uppercase tracking-wider" style="color:#991B1B">Updated Midnight ET</p>
                                                <p class="text-xs mt-0.5" style="color:#78716c">Synced with game clock</p>
                                        </div>
                                </div>
                                <div class="flex items-center gap-3 px-4 py-4 sm:px-5 sm:py-5">
                                        <svg class="h-5 w-5 flex-shrink-0" style="color:#D97706" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>
                                        <div>
                                                <p class="text-xs font-bold uppercase tracking-wider" style="color:#991B1B">1,500+ Puzzles</p>
                                                <p class="text-xs mt-0.5" style="color:#78716c">Historical archive tracked</p>
                                        </div>
                                </div>
                                <div class="flex items-center gap-3 px-4 py-4 sm:px-5 sm:py-5">
                                        <svg class="h-5 w-5 flex-shrink-0" style="color:#991B1B" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                        <div>
                                                <p class="text-xs font-bold uppercase tracking-wider" style="color:#991B1B">{PRESTON_HAYES_AUTHOR_NAME}</p>
                                                <p class="text-xs mt-0.5" style="color:#78716c">Word Puzzle Expert</p>
                                        </div>
                                </div>
                        </div>

                        <!-- ─── YESTERDAY'S ANSWER CALLOUT ─── -->
                        {#if data.yesterdayData}
                                <div class="mb-12 flex items-stretch border-l-4 bg-white p-5 sm:p-6 shadow-sm" style="border-left-color:#D97706">
                                        <span class="mr-4 text-3xl leading-none flex-shrink-0">&#127811;</span>
                                        <div>
                                                <p class="text-xs font-bold uppercase tracking-[0.2em] mb-1" style="color:#D97706">Yesterday&apos;s Answer</p>
                                                <p class="text-base sm:text-lg" style="color:#1C1917">
                                                        Yesterday&apos;s word was <strong style="color:#991B1B;font-family:Georgia,'Times New Roman',serif;font-size:1.15em">{data.yesterdayData.answer.toUpperCase()}</strong>
                                                        <span class="ml-2 text-sm" style="color:#78716c">(Puzzle #{data.yesterdayData.index})</span>
                                                </p>
                                        </div>
                                </div>
                        {/if}

                        <!-- ═══════════════════════════════════════════════
                             ARTICLE CONTENT
                             ═══════════════════════════════════════════════ -->
                        <article>
                                <!-- About today's puzzle -->
                                <section class="mb-12">
                                        <div class="border-l-4 bg-white p-6 sm:p-8 shadow-sm" style="border-left-color:#991B1B">
                                                <h2 class="text-2xl sm:text-3xl font-bold mb-4" style="font-family:Georgia,'Times New Roman',serif;color:#1C1917">
                                                        About today&apos;s Canuckle puzzle
                                                </h2>
                                                <p class="mb-4 leading-7" style="color:#44403c">
                                                        We verify the Canuckle puzzle every day and keep this page updated with the correct puzzle number, fact, and archive links. For today, that is puzzle <strong style="color:#1C1917">#{data.todayPuzzle.index}</strong>. The answer itself now stays hidden inside the reveal card above, so you can land on this page for hints and navigation without getting spoiled immediately.
                                                </p>
                                        </div>
                                </section>

                                <!-- Table of Contents -->
                                <nav class="mb-12 overflow-hidden border border-stone-300 bg-white shadow-sm" aria-label="Table of Contents">
                                        <div class="px-6 py-4" style="background-color:#1C1917">
                                                <p class="text-xs font-bold uppercase tracking-[0.3em] text-white/80">Table of Contents</p>
                                        </div>
                                        <div class="p-4 sm:p-5">
                                                <ol class="grid gap-0 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
                                                        <li>
                                                                <a href="#frequently-asked-questions" class="flex items-center gap-3 px-3 py-3 transition text-stone-600 hover:text-red-800 hover:bg-amber-50">
                                                                        <span class="flex items-center justify-center w-7 h-7 text-xs font-black bg-red-800 text-white">1</span>
                                                                        <span class="text-sm font-medium">FAQs</span>
                                                                </a>
                                                        </li>
                                                        <li>
                                                                <a href="#what-is-canuckle" class="flex items-center gap-3 px-3 py-3 transition text-stone-600 hover:text-red-800 hover:bg-amber-50">
                                                                        <span class="flex items-center justify-center w-7 h-7 text-xs font-black bg-red-800 text-white">2</span>
                                                                        <span class="text-sm font-medium">What is Canuckle?</span>
                                                                </a>
                                                        </li>
                                                        <li>
                                                                <a href="#how-to-play-canuckle" class="flex items-center gap-3 px-3 py-3 transition text-stone-600 hover:text-amber-700 hover:bg-amber-50">
                                                                        <span class="flex items-center justify-center w-7 h-7 text-xs font-black bg-amber-600 text-white">3</span>
                                                                        <span class="text-sm font-medium">How to play</span>
                                                                </a>
                                                        </li>
                                                        <li>
                                                                <a href="#canuckle-tips" class="flex items-center gap-3 px-3 py-3 transition text-stone-600 hover:text-red-800 hover:bg-amber-50">
                                                                        <span class="flex items-center justify-center w-7 h-7 text-xs font-black bg-red-800 text-white">4</span>
                                                                        <span class="text-sm font-medium">Tips &amp; Strategy</span>
                                                                </a>
                                                        </li>
                                                        <li>
                                                                <a href="#canuckle-vs-wordle" class="flex items-center gap-3 px-3 py-3 transition text-stone-600 hover:text-amber-700 hover:bg-amber-50">
                                                                        <span class="flex items-center justify-center w-7 h-7 text-xs font-black bg-amber-600 text-white">5</span>
                                                                        <span class="text-sm font-medium">Canuckle vs Wordle</span>
                                                                </a>
                                                        </li>
                                                        <li>
                                                                <a href="#recent-answers" class="flex items-center gap-3 px-3 py-3 transition text-stone-600 hover:text-red-800 hover:bg-amber-50">
                                                                        <span class="flex items-center justify-center w-7 h-7 text-xs font-black bg-red-800 text-white">6</span>
                                                                        <span class="text-sm font-medium">Recent answers</span>
                                                                </a>
                                                        </li>
                                                </ol>
                                        </div>
                                </nav>

                                <!-- ─── DECORATIVE DIVIDER ─── -->
                                <div class="flex items-center gap-4 mb-12">
                                        <div class="flex-1 h-px" style="background-color:#D6D3D1"></div>
                                        <span class="text-xl">&#127811;</span>
                                        <div class="flex-1 h-px" style="background-color:#D6D3D1"></div>
                                </div>

                                <!-- ─── FAQ SECTION ─── -->
                                <section class="mb-12" id="frequently-asked-questions">
                                        <h2 class="text-2xl sm:text-3xl font-bold mb-2" style="font-family:Georgia,'Times New Roman',serif;color:#1C1917">Frequently Asked Questions</h2>
                                        <p class="mb-6 text-sm uppercase tracking-[0.2em] font-semibold" style="color:#991B1B">Everything you need to know</p>

                                        <div class="space-y-0 divide-y divide-stone-200 border-t border-b border-stone-200 bg-white">
                                                <details class="group">
                                                        <summary class="cursor-pointer flex items-center justify-between p-5 font-semibold transition-colors text-stone-900 hover:bg-amber-50">
                                                                <span>Where can I reveal the Canuckle answer for today, {formattedDate}?</span>
                                                                <FiChevronDown class="flex-shrink-0 ml-4 transition-transform group-open:rotate-180 text-red-800" />
                                                        </summary>
                                                        <div class="px-5 pb-5 leading-7 text-stone-600">
                                                                Use the reveal card near the top of this page. It keeps today&apos;s Canuckle answer hidden until you choose to open it, and it also shows the verified Canadian fact for puzzle #{data.todayPuzzle.index}.
                                                        </div>
                                                </details>

                                                {#if data.yesterdayData}
                                                        <details class="group">
                                                                <summary class="cursor-pointer flex items-center justify-between p-5 font-semibold transition-colors text-stone-900 hover:bg-amber-50">
                                                                        <span>What was yesterday&apos;s Canuckle answer?</span>
                                                                        <FiChevronDown class="flex-shrink-0 ml-4 transition-transform group-open:rotate-180 text-red-800" />
                                                                </summary>
                                                                <div class="px-5 pb-5 leading-7 text-stone-600">
                                                                        The previous Canuckle answer was <span class="font-bold text-stone-900">{data.yesterdayData.answer.toUpperCase()}</span> (puzzle #{data.yesterdayData.index}).
                                                                </div>
                                                        </details>
                                                {/if}

                                                <details class="group">
                                                        <summary class="cursor-pointer flex items-center justify-between p-5 font-semibold transition-colors text-stone-900 hover:bg-amber-50">
                                                                <span>How do you play Canuckle?</span>
                                                                <FiChevronDown class="flex-shrink-0 ml-4 transition-transform group-open:rotate-180 text-red-800" />
                                                        </summary>
                                                        <div class="px-5 pb-5 leading-7 text-stone-600">
                                                                Canuckle is a Wordle-style game with a Canadian twist. You guess 5-letter words and get color feedback - green for correct position, yellow for wrong position, red for not in the word. The answer pool uses Canadian-themed words, and each puzzle comes with a Canadian fact.
                                                        </div>
                                                </details>

                                                <details class="group">
                                                        <summary class="cursor-pointer flex items-center justify-between p-5 font-semibold transition-colors text-stone-900 hover:bg-amber-50">
                                                                <span>How is Canuckle different from Wordle?</span>
                                                                <FiChevronDown class="flex-shrink-0 ml-4 transition-transform group-open:rotate-180 text-red-800" />
                                                        </summary>
                                                        <div class="px-5 pb-5 leading-7 text-stone-600">
                                                                Canuckle uses a Canadian-focused answer list, so words like MAPLE, TOQUE, and MOOSE are fair game. It also includes a Canadian fact with each daily answer, and the feedback colors are red instead of gray for absent letters.
                                                        </div>
                                                </details>

                                                <details class="group">
                                                        <summary class="cursor-pointer flex items-center justify-between p-5 font-semibold transition-colors text-stone-900 hover:bg-amber-50">
                                                                <span>When does the new Canuckle puzzle release?</span>
                                                                <FiChevronDown class="flex-shrink-0 ml-4 transition-transform group-open:rotate-180 text-red-800" />
                                                        </summary>
                                                        <div class="px-5 pb-5 leading-7 text-stone-600">
                                                                A new Canuckle puzzle goes live every day at midnight Eastern Time (ET). That is the same schedule as Wordle for most North American players.
                                                        </div>
                                                </details>

                                                <details class="group">
                                                        <summary class="cursor-pointer flex items-center justify-between p-5 font-semibold transition-colors text-stone-900 hover:bg-amber-50">
                                                                <span>What does the red feedback mean in Canuckle?</span>
                                                                <FiChevronDown class="flex-shrink-0 ml-4 transition-transform group-open:rotate-180 text-red-800" />
                                                        </summary>
                                                        <div class="px-5 pb-5 leading-7 text-stone-600">
                                                                Red tiles in Canuckle work the same way as gray tiles in Wordle - the letter is not in the answer at all. Yellow means the letter is in the word but in a different position, and green means the correct letter in the correct position.
                                                        </div>
                                                </details>

                                                <details class="group">
                                                        <summary class="cursor-pointer flex items-center justify-between p-5 font-semibold transition-colors text-stone-900 hover:bg-amber-50">
                                                                <span>How can I browse earlier Canuckle answers?</span>
                                                                <FiChevronDown class="flex-shrink-0 ml-4 transition-transform group-open:rotate-180 text-red-800" />
                                                        </summary>
                                                        <div class="px-5 pb-5 leading-7 text-stone-600">
                                                                Use the recent answers table on this page to scan the last 30 days, or visit the full Canuckle archive for a searchable history of all past puzzles.
                                                        </div>
                                                </details>
                                        </div>
                                </section>

                                <!-- ─── DECORATIVE DIVIDER ─── -->
                                <div class="flex items-center gap-4 mb-12">
                                        <div class="flex-1 h-px" style="background-color:#D6D3D1"></div>
                                        <span class="text-2xl font-bold" style="font-family:Georgia,'Times New Roman',serif;color:#991B1B">|</span>
                                        <div class="flex-1 h-px" style="background-color:#D6D3D1"></div>
                                </div>

                                <!-- ─── WHAT IS CANUCKLE ─── -->
                                <section id="what-is-canuckle" class="mb-12">
                                        <div class="border-l-4 bg-white p-6 sm:p-8 shadow-sm" style="border-left-color:#991B1B">
                                                <div class="flex items-baseline gap-3 mb-6">
                                                        <span class="text-xs font-bold uppercase tracking-[0.25em]" style="color:#D97706">Section 01</span>
                                                </div>
                                                <h2 class="text-2xl sm:text-3xl font-bold mb-6" style="font-family:Georgia,'Times New Roman',serif;color:#1C1917">What is Canuckle?</h2>
                                                <div class="space-y-5 text-base sm:text-lg leading-relaxed" style="color:#44403c">
                                                        <p>Canuckle is a daily word-guessing game made by Canadian developers, hosted at canucklegame.github.io. It follows the same basic format as Wordle - you get six attempts to guess a hidden 5-letter word, and each guess reveals which letters are in the right spot, which are in the word but misplaced, and which are not in the word at all.</p>
                                                        <p>The twist is that every answer has a Canadian connection. Some are obviously Canadian - TOQUE, MAPLE, LOONIE - while others are more subtle. The game also includes a short Canadian fact after each puzzle, which is a nice touch that sets it apart from the dozens of other Wordle clones. If you grew up in Canada or have spent any time there, you will have a real edge because you can guess words that a purely American or British player might never think of.</p>
                                                        <p>Another difference you will notice immediately: the feedback colors. Instead of the gray/yellow/green scheme Wordle uses, Canuckle goes with red/yellow/green. Red means the letter is not in the word (same as Wordle&apos;s gray), yellow means the letter is there but in a different position, and green means correct letter, correct spot. It takes a game or two to adjust if you are used to Wordle&apos;s colors, but after that it feels natural.</p>
                                                </div>
                                        </div>
                                </section>

                                <!-- ─── HOW TO PLAY ─── -->
                                <section id="how-to-play-canuckle" class="mb-12">
                                        <div class="border-l-4 bg-white p-6 sm:p-8 shadow-sm" style="border-left-color:#D97706">
                                                <div class="flex items-baseline gap-3 mb-6">
                                                        <span class="text-xs font-bold uppercase tracking-[0.25em]" style="color:#D97706">Section 02</span>
                                                </div>
                                                <h2 class="text-2xl sm:text-3xl font-bold mb-6" style="font-family:Georgia,'Times New Roman',serif;color:#1C1917">How to play Canuckle</h2>
                                                <p class="mb-6 text-base sm:text-lg leading-relaxed" style="color:#44403c">
                                                        The gameplay is straightforward if you have played any Wordle variant before, but there are a few Canuckle-specific things worth knowing before you start.
                                                </p>
                                                <ol class="space-y-6 mb-6">
                                                        {#each [
                                                                { num: '01', title: 'Open the game and look at the empty grid.', body: 'You will see six rows of five empty tiles, just like Wordle. The goal is to fill in the correct 5-letter word before you run out of rows.' },
                                                                { num: '02', title: 'Type your first guess.', body: 'Use a strong starter word with common vowels and consonants. CRANE, SLATE, and TRACE are popular choices. Do not forget that the answer might be a Canadian-specific word, so if you have a hunch about something like IGLOO or LOONIE, that is worth considering early on.' },
                                                                { num: '03', title: 'Read the color feedback.', body: 'Green means the letter is in the right spot - lock it in. Yellow means the letter is in the word but somewhere else. Red means the letter is not in the word at all, so cross it off your mental list.' },
                                                                { num: '04', title: 'Narrow it down with each guess.', body: 'Use the letters you have confirmed (green and yellow) to construct your next guess. Try to avoid letters that came back red. If you have a yellow letter, shuffle it into a different position.' },
                                                                { num: '05', title: 'Think Canadian.', body: 'Once you have a few letters confirmed, start thinking about Canadian words that fit. If you have _O_IE, think MOOSE... wait, no, that has too many letters. LOONIE? TOQUE? POUTINE? The Canadian answer pool is smaller than Wordle\'s, which actually makes it easier to narrow things down once you get going.' },
                                                                { num: '06', title: 'Read the fact after you finish.', body: 'Every Canuckle answer comes with a Canadian fact. It is a small reward for solving the puzzle and a fun way to learn something new about Canada each day.' }
                                                        ] as step}
                                                                <li class="flex gap-4 sm:gap-6">
                                                                        <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center text-sm font-black" style="background-color:#991B1B;color:white">{step.num}</div>
                                                                        <div class="pt-1">
                                                                                <strong style="color:#1C1917">{step.title}</strong>
                                                                                <span class="mt-1 block text-base leading-relaxed" style="color:#44403c">{step.body}</span>
                                                                        </div>
                                                                </li>
                                                        {/each}
                                                </ol>
                                        </div>
                                </section>

                                <!-- ─── TIPS & STRATEGY ─── -->
                                <section id="canuckle-tips" class="mb-12">
                                        <div class="border-l-4 bg-white p-6 sm:p-8 shadow-sm" style="border-left-color:#991B1B">
                                                <div class="flex items-baseline gap-3 mb-6">
                                                        <span class="text-xs font-bold uppercase tracking-[0.25em]" style="color:#D97706">Section 03</span>
                                                </div>
                                                <h2 class="text-2xl sm:text-3xl font-bold mb-6" style="font-family:Georgia,'Times New Roman',serif;color:#1C1917">Canuckle tips and strategy</h2>
                                                <p class="mb-8 text-base sm:text-lg leading-relaxed" style="color:#44403c">
                                                        Beyond the basics, a few Canuckle-specific strategies can shave a guess or two off your daily average.
                                                </p>

                                                <div class="space-y-8">
                                                        <div class="border-l-2 pl-5 py-1" style="border-left-color:#E7E5E4">
                                                                <h3 class="text-lg sm:text-xl font-bold mb-2" style="font-family:Georgia,'Times New Roman',serif;color:#1C1917">Use a vowel-heavy opener</h3>
                                                                <p class="text-base leading-relaxed" style="color:#44403c">Words like ADIEU, AUDIO, or ABOUT are strong openers because they test four of the five vowels in one guess. In Canuckle specifically, ABOUT is a great choice because it also tests B and T, which show up in many Canadian answers (TOQUE, BACON, OTTER, CABIN).</p>
                                                        </div>

                                                        <div class="border-l-2 pl-5 py-1" style="border-left-color:#E7E5E4">
                                                                <h3 class="text-lg sm:text-xl font-bold mb-2" style="font-family:Georgia,'Times New Roman',serif;color:#1C1917">Keep a mental list of Canadian words</h3>
                                                                <p class="text-base leading-relaxed" style="color:#44403c">After playing for a few weeks, you will start noticing that Canuckle draws from a specific vocabulary: hockey terms (PUCK, ICE, RINK), geography (BAYOU, DELTA, CREEK), food (MAPLE, BACON, POUTINE - well, that is seven letters), animals (MOOSE, OTTER, GOOSE, BISON), and culture (LOONIE, TOQUE, ESKER). Keeping these categories in mind helps when you are stuck with a few letters and need inspiration.</p>
                                                        </div>

                                                        <div class="border-l-2 pl-5 py-1" style="border-left-color:#E7E5E4">
                                                                <h3 class="text-lg sm:text-xl font-bold mb-2" style="font-family:Georgia,'Times New Roman',serif;color:#1C1917">Use the solver when you are stuck</h3>
                                                                <p class="text-base leading-relaxed" style="color:#44403c">If you have burned four or five guesses and still cannot figure it out, the Canuckle solver on WordSolverX lets you enter your guesses and the feedback you received, then filters the answer list to show only matching candidates. It is a learning tool - use it a few times and you will start recognizing patterns faster on your own.</p>
                                                        </div>

                                                        <div class="border-l-2 pl-5 py-1" style="border-left-color:#E7E5E4">
                                                                <h3 class="text-lg sm:text-xl font-bold mb-2" style="font-family:Georgia,'Times New Roman',serif;color:#1C1917">Avoid assuming American spelling</h3>
                                                                <p class="text-base leading-relaxed" style="color:#44403c">Canadian English uses British spelling for some words (COLOUR, FLAVOUR, HONOUR), but Canuckle&apos;s answer list sticks to standard 5-letter words that work in both dialects. You will not usually run into spelling-variant traps, but it is worth remembering that the game is built from a Canadian perspective.</p>
                                                        </div>

                                                        <div class="border-l-2 pl-5 py-1" style="border-left-color:#E7E5E4">
                                                                <h3 class="text-lg sm:text-xl font-bold mb-2" style="font-family:Georgia,'Times New Roman',serif;color:#1C1917">Eliminate consonants efficiently on guess two</h3>
                                                                <p class="text-base leading-relaxed" style="color:#44403c">If your vowel-heavy opener like ADIEU or AUDIO does not produce any green matches, your second guess should focus on testing common consonants that your opener missed. Words like CRISP, PLUMB, or STUNG cover high-frequency consonants including C, R, S, P, T, N, G, and L in a single guess. The tighter Canuckle answer pool means fewer edge-case words, so broad consonant coverage on guess two will eliminate most of the wrong answers quickly and leave you with a manageable set of candidates by guess three.</p>
                                                        </div>

                                                        <div class="border-l-2 pl-5 py-1" style="border-left-color:#E7E5E4">
                                                                <h3 class="text-lg sm:text-xl font-bold mb-2" style="font-family:Georgia,'Times New Roman',serif;color:#1C1917">Track which words have already appeared</h3>
                                                                <p class="text-base leading-relaxed" style="color:#44403c">Canuckle&apos;s answer pool is smaller than Wordle&apos;s, which means repeat answers happen more often. The recent answers table on this page shows the last 30 daily words. If you see that the answer three days ago was HOARSE and today&apos;s clues look like they could match it again, a repeat is worth considering — especially later in the month when the pool has been picked through. Checking the archive before you guess saves you from wasting a row on a word that already appeared this week.</p>
                                                        </div>
                                                </div>
                                        </div>
                                </section>

                                <!-- ─── CANUCKLE VS WORDLE ─── -->
                                <section id="canuckle-vs-wordle" class="mb-12">
                                        <div class="border-l-4 bg-white p-6 sm:p-8 shadow-sm" style="border-left-color:#D97706">
                                                <div class="flex items-baseline gap-3 mb-6">
                                                        <span class="text-xs font-bold uppercase tracking-[0.25em]" style="color:#D97706">Section 04</span>
                                                </div>
                                                <h2 class="text-2xl sm:text-3xl font-bold mb-6" style="font-family:Georgia,'Times New Roman',serif;color:#1C1917">Canuckle vs Wordle</h2>
                                                <p class="mb-8 text-base sm:text-lg leading-relaxed" style="color:#44403c">
                                                        Both games share the same core mechanic, but the differences matter more than you might expect once you start playing both daily.
                                                </p>

                                                <!-- Comparison grid: editorial two-column -->
                                                <div class="grid gap-0 md:grid-cols-2 border border-stone-200 divide-y md:divide-y-0 md:divide-x divide-stone-200">
                                                        <div class="p-5 sm:p-6" style="background-color:#FFFBF0">
                                                                <div class="flex items-center gap-2 mb-3">
                                                                        <div class="h-2 w-2" style="background-color:#991B1B"></div>
                                                                        <h3 class="text-base sm:text-lg font-bold" style="font-family:Georgia,'Times New Roman',serif;color:#1C1917">Answer pool</h3>
                                                                </div>
                                                                <p class="text-sm leading-relaxed" style="color:#44403c">Wordle pulls from roughly 2,300 possible answers across general English. Canuckle uses a smaller, curated list of Canadian-themed words. This means repeat answers are more likely in Canuckle, and the pool of likely guesses is narrower - which can work in your favor once you learn the patterns.</p>
                                                        </div>
                                                        <div class="p-5 sm:p-6">
                                                                <div class="flex items-center gap-2 mb-3">
                                                                        <div class="h-2 w-2" style="background-color:#D97706"></div>
                                                                        <h3 class="text-base sm:text-lg font-bold" style="font-family:Georgia,'Times New Roman',serif;color:#1C1917">Feedback colors</h3>
                                                                </div>
                                                                <p class="text-sm leading-relaxed" style="color:#44403c">Wordle uses gray (absent), yellow (misplaced), green (correct). Canuckle replaces gray with red. Functionally identical, but the red-yellow-green scheme can be confusing if you switch between the two games regularly.</p>
                                                        </div>
                                                        <div class="p-5 sm:p-6 border-t md:border-t-0" style="border-top-color:#D6D3D1">
                                                                <div class="flex items-center gap-2 mb-3">
                                                                        <div class="h-2 w-2" style="background-color:#991B1B"></div>
                                                                        <h3 class="text-base sm:text-lg font-bold" style="font-family:Georgia,'Times New Roman',serif;color:#1C1917">Canadian facts</h3>
                                                                </div>
                                                                <p class="text-sm leading-relaxed" style="color:#44403c">The biggest differentiator. After each Canuckle puzzle, you get a short fact about Canada related to the answer. It is educational and makes the game feel more purposeful than a straight Wordle clone. Wordle has no equivalent feature.</p>
                                                        </div>
                                                        <div class="p-5 sm:p-6 border-t md:border-t-0" style="border-top-color:#D6D3D1">
                                                                <div class="flex items-center gap-2 mb-3">
                                                                        <div class="h-2 w-2" style="background-color:#D97706"></div>
                                                                        <h3 class="text-base sm:text-lg font-bold" style="font-family:Georgia,'Times New Roman',serif;color:#1C1917">Skill transfer</h3>
                                                                </div>
                                                                <p class="text-sm leading-relaxed" style="color:#44403c">If you are good at Wordle, you will be decent at Canuckle from day one. The deduction logic is identical. The main adjustment is learning to think Canadian - once you have absorbed the answer pool tendencies, your solve rate should be similar or better than Wordle.</p>
                                                        </div>
                                                </div>
                                        </div>
                                </section>

                                <!-- ─── DECORATIVE DIVIDER ─── -->
                                <div class="flex items-center gap-4 mb-12">
                                        <div class="flex-1 h-px" style="background-color:#D6D3D1"></div>
                                        <span class="text-2xl font-bold" style="font-family:Georgia,'Times New Roman',serif;color:#991B1B">&#9632;</span>
                                        <div class="flex-1 h-px" style="background-color:#D6D3D1"></div>
                                </div>

                                <!-- ─── RECENT ANSWERS TABLE ─── -->
                                <section id="recent-answers" class="mb-12">
                                        <div class="border-l-4 bg-white p-6 sm:p-8 shadow-sm" style="border-left-color:#991B1B">
                                                <div class="flex items-baseline gap-3 mb-6">
                                                        <span class="text-xs font-bold uppercase tracking-[0.25em]" style="color:#D97706">Archive</span>
                                                </div>
                                                <h2 class="text-2xl sm:text-3xl font-bold mb-6" style="font-family:Georgia,'Times New Roman',serif;color:#1C1917">Recent Canuckle answers</h2>
                                                <p class="mb-8 text-base sm:text-lg leading-relaxed" style="color:#44403c">The last 30 daily words, newest first. Today&apos;s live answer stays hidden here until you use the reveal card above.</p>

                                                <!-- Table header -->
                                                <div class="grid grid-cols-2 gap-0 border-b-2 px-4 py-2" style="border-bottom-color:#991B1B">
                                                        <p class="text-xs font-bold uppercase tracking-[0.2em]" style="color:#991B1B">Date</p>
                                                        <p class="text-xs font-bold uppercase tracking-[0.2em] text-right" style="color:#991B1B">Answer</p>
                                                </div>

                                                <div class="divide-y divide-stone-100">
                                                        {#each data.last30 as entry}
                                                                <div class="grid grid-cols-2 gap-0 px-4 py-3 transition-colors hover:bg-amber-50">
                                                                        <div class="min-w-0">
                                                                                <p class="text-sm font-semibold" style="color:#1C1917">{entry.date}</p>
                                                                                <p class="text-xs" style="color:#78716c">Puzzle #{entry.index}</p>
                                                                        </div>
                                                                        <div class="text-right">
                                                                                {#if entry.index === data.todayPuzzle.index}
                                                                                        <p class="text-sm font-semibold" style="color:#A8A29E">Hidden until reveal</p>
                                                                                {:else}
                                                                                        <p class="text-sm font-bold" style="font-family:Georgia,'Times New Roman',serif;color:#991B1B;font-size:1.05em;letter-spacing:0.05em">{entry.answer.toUpperCase()}</p>
                                                                                {/if}
                                                                        </div>
                                                                </div>
                                                        {/each}
                                                </div>
                                        </div>
                                </section>
                        </article>

                        <!-- ─── AUTHOR CARD ─── -->
                        <div class="mb-12">
                                <AuthorCard
                                        name={PRESTON_HAYES_AUTHOR_NAME}
                                        image={PRESTON_HAYES_AUTHOR_IMAGE}
                                        description={PRESTON_HAYES_AUTHOR_DESCRIPTION}
                                />
                        </div>

                        <!-- ─── INTERNAL LINKS ─── -->
                        <div class="mb-12">
                                <InternalLinkSection currentGame="Canuckle" />
                        </div>

                        <!-- ─── FOOTER ACCENT ─── -->
                        <div class="h-1 mb-0" style="background:linear-gradient(90deg,#991B1B,#DC2626,#D97706,#F59E0B)"></div>
                </div>
        </div>
{/if}
