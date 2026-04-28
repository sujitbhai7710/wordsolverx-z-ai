<script lang="ts">
        import { browser } from '$app/environment';
        import { onMount } from 'svelte';
        import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
        import { fetchArchivePayload } from '$lib/archive-client';

        interface WorgleArchivePayload {
                availableDateStrings: string[];
                selectedDateKey: string | null;
                selectedWorgle: {
                        date: string;
                        word: string;
                        puzzle: number;
                        formattedDate: string;
                } | null;
        }

        let data = $state<WorgleArchivePayload>({
                availableDateStrings: [],
                selectedDateKey: null,
                selectedWorgle: null
        });
        let isLoading = $state(false);
        let loadError = $state<string | null>(null);
        let selectedDateParam = $state<string | null>(
                browser ? new URL(window.location.href).searchParams.get('date') : null
        );

        const startDate = new Date('2021-06-19T12:00:00Z');
        let availableDates = $derived(
                (data.availableDateStrings ?? []).map((dateString) => new Date(`${dateString}T12:00:00`))
        );

        onMount(() => {
                if (window.location.search || window.location.hash) {
                        window.history.replaceState(window.history.state, '', window.location.pathname);
                }
        });

        function handleDateSelect(dateKey: string): void {
                selectedDateParam = dateKey;
        }

        async function loadArchive(dateKey: string | null): Promise<void> {
                if (!dateKey) {
                        data.selectedDateKey = null;
                        data.selectedWorgle = null;
                        isLoading = false;
                        loadError = null;
                        return;
                }

                const requestDateKey = dateKey;
                isLoading = true;
                loadError = null;

                try {
                        const payload = await fetchArchivePayload<WorgleArchivePayload>('worgle', requestDateKey);

                        if (selectedDateParam !== requestDateKey) {
                                return;
                        }

                        data = payload;
                } catch (error) {
                        if (selectedDateParam !== requestDateKey) {
                                return;
                        }

                        data.selectedDateKey = requestDateKey;
                        data.selectedWorgle = null;
                        loadError = error instanceof Error ? error.message : 'Failed to load the Worgle archive entry.';
                } finally {
                        if (selectedDateParam === requestDateKey) {
                                isLoading = false;
                        }
                }
        }

        $effect(() => {
                if (!browser) {
                        return;
                }

                void loadArchive(selectedDateParam);
        });
</script>

<svelte:head>
        <title>Worgle Archive - All Past Answers | WordSolverX</title>
        <meta name="description" content="Browse the Worgle archive by date with puzzle numbers and direct answer lookups." />
        <link rel="canonical" href="https://wordsolverx.com/worgle-archive" />
</svelte:head>

<ArchiveCalendar
        gameName="Worgle"
        gameColor="teal"
        gameIcon="Wo"
        {startDate}
        {availableDates}
        basePath="/worgle-archive"
        selectedDate={data.selectedDateKey}
        description="Every stored Worgle answer with the matching puzzle number."
        onSelectDate={handleDateSelect}
/>

<section id="archive-answer" class="mx-auto max-w-4xl scroll-mt-28 px-4 pb-14 sm:px-6 lg:px-8">
        {#if data.selectedWorgle}
                <div class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
                        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">Selected archive date</p>
                        <h2 class="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50">
                                Worgle answer for {data.selectedWorgle.formattedDate}
                        </h2>
                        <div class="mt-6 grid gap-6 md:grid-cols-[1fr_0.8fr]">
                                <div class="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
                                        <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Puzzle #{data.selectedWorgle.puzzle}</p>
                                        <div class="mt-4 flex flex-wrap gap-2">
                                                {#each data.selectedWorgle.word.toUpperCase().split('') as letter}
                                                        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900 text-lg font-black text-white dark:bg-white/10 dark:text-slate-100 dark:border dark:border-slate-600">
                                                                {letter}
                                                        </div>
                                                {/each}
                                        </div>
                                </div>
                                <div class="rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 p-6 text-white">
                                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-teal-100">Archive note</p>
                                        <p class="mt-4 text-sm leading-7 text-teal-100">
                                                Worgle is deterministic, so the archive doubles as a date-by-date lookup table and a puzzle-number history.
                                        </p>
                                </div>
                        </div>
                </div>
        {:else if loadError}
                <div class="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-800/40 dark:bg-rose-950/20">
                        <h2 class="text-2xl font-bold text-rose-900 dark:text-rose-100">We couldn't load that Worgle date</h2>
                        <p class="mt-3 text-rose-700 dark:text-rose-200">{loadError}</p>
                </div>
        {:else if isLoading && data.selectedDateKey}
                <div class="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
                        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Loading Worgle archive entry...</h2>
                        <p class="mt-3 text-slate-600 dark:text-slate-300">Pulling the selected answer into the archive view now.</p>
                </div>
        {:else}
                <div class="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
                        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Choose a Worgle date above</h2>
                        <p class="mt-3 text-slate-600 dark:text-slate-300">The selected word and puzzle number will appear here.</p>
                </div>
        {/if}
</section>

<!-- SEO Article Section -->
<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
                <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 mb-6">Why the Worgle Archive Matters</h2>
                <div class="prose prose-slate dark:prose-invert max-w-none">
                        <p>
                                The Worgle archive is a comprehensive record of Welsh-language Wordle-style puzzle answers, preserving every daily solution along with corresponding puzzle numbers since the game's launch. As a Welsh-language variant of the original Wordle, Worgle provides a unique window into the vocabulary and word patterns of the Welsh language, making the archive valuable not only for puzzle enthusiasts but also for Welsh language learners and speakers who want to explore the language through an engaging daily challenge format.
                        </p>
                        <p>
                                Because Worgle is deterministic, each date maps to exactly one answer, and the puzzle number increments sequentially from the game's start date. This makes the archive both a historical record and a practical lookup tool that works in two directions: you can search by date to find the answer, or search by puzzle number to find the corresponding date. This dual-functionality makes the archive particularly useful for players tracking their solve history or verifying streaks across different date ranges.
                        </p>
                        <p>
                                The archive is also an educational resource for anyone interested in the Welsh language. Each past answer represents a Welsh word, and studying the archive exposes readers to common Welsh vocabulary, letter frequency patterns, and the structural conventions of the language. For learners, the archive provides a curated daily word list that builds vocabulary naturally through the context of a familiar and engaging puzzle format.
                        </p>

                        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Worgle Answers Work</h3>
                        <p>
                                Worgle follows the same basic gameplay as the original Wordle but uses Welsh words instead of English. Players have six attempts to guess a Welsh word, receiving color-coded feedback that indicates correct letters in correct positions, correct letters in wrong positions, and absent letters. The answer list is drawn from a curated pool of Welsh words that would be recognizable to Welsh speakers.
                        </p>
                        <p>
                                The deterministic nature of Worgle means that each date since the game's launch on June 19, 2021 maps to exactly one Welsh word. The puzzle number increments by one each day, providing a sequential reference system alongside the calendar date. The archive records both the date and the puzzle number for every entry, allowing for flexible lookup by either reference point.
                        </p>
                        <p>
                                Welsh word patterns differ significantly from English, and the archive reveals these differences clearly. The Welsh language uses different letter frequency distributions, different common word structures, and different spelling conventions than English. Studying the archive helps players and language learners understand these patterns and develop better guessing strategies that account for the unique characteristics of Welsh vocabulary.
                        </p>

                        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Notable Past Worgle Answers</h3>
                        <p>
                                The Worgle archive contains many Welsh words that showcase the beauty and diversity of the language. Words with characteristic Welsh letter combinations, mutations, and diacritical marks appear throughout the archive, providing a natural introduction to the orthographic features that distinguish Welsh from English and other languages.
                        </p>
                        <p>
                                The archive also reveals patterns in letter frequency for Welsh, which differ from English patterns. Letters that are common in Welsh may be rare in English and vice versa, and understanding these differences through archive study directly improves puzzle performance. Over time, regular archive browsers develop an intuitive sense for likely Welsh letter patterns that makes their daily solves faster and more efficient.
                        </p>

                        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How to Use the Worgle Archive</h3>
                        <p>
                                Navigate the archive using the calendar above to view any past Worgle answer. Each entry displays the Welsh word, the puzzle number, and the formatted date. Use the archive to catch up on missed days, study Welsh vocabulary patterns, or verify puzzle numbers for streak tracking purposes.
                        </p>

                        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
                        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">What language does Worgle use?</h4>
                        <p>
                                Worgle is a Welsh-language Wordle variant. All answers are Welsh words that would be recognized by Welsh speakers. The puzzle interface and feedback system follow the same format as the original English Wordle but operate entirely in the Welsh language.
                        </p>

                        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can I use the archive to learn Welsh?</h4>
                        <p>
                                Yes. The archive provides a daily curated list of Welsh words that builds vocabulary naturally over time. Each entry represents a common Welsh word, and regular exposure through the archive helps learners internalize Welsh letter patterns, common word structures, and vocabulary.
                        </p>

                        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How are puzzle numbers calculated?</h4>
                        <p>
                                Puzzle numbers increment sequentially from the game's start date of June 19, 2021. Each subsequent day receives the next puzzle number, making the number system a reliable alternative to calendar dates for referencing specific puzzles.
                        </p>

                        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Is Worgle the same as Welsh Wordle?</h4>
                        <p>
                                Worgle is an independent Welsh-language Wordle-style game. While the gameplay mechanics are similar to the original Wordle, Worgle has its own curated answer list of Welsh words, its own puzzle numbering system, and its own community of players.
                        </p>

                        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How can I improve at Worgle?</h4>
                        <p>
                                Study the archive to understand Welsh letter frequency patterns and common word structures. Pay attention to which letters appear most frequently in solutions and develop opening guesses that maximize information gain using common Welsh letter combinations. Over time, this pattern recognition will dramatically improve your solve rates.
                        </p>
                </div>
        </div>
</article>
