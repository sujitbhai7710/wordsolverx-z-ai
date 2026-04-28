<script lang="ts">
        import { browser } from '$app/environment';
        import { onMount } from 'svelte';
        import { fetchArchivePayload } from '$lib/archive-client';
        import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
        import {
                COUNTRY_NAMES,
                GENDER_NAMES,
                formatSpotleDate,
                type SpotleArtist,
                type SpotleData
        } from '$lib/spotle';
        import spotleData from '../../../../static/spotle_data.json';
        import { getPuzzleDateForGame } from '$lib/puzzle-window';

        interface SelectedSpotle {
                date: string;
                formattedDate: string;
                dayNumber: number;
                artistName: string;
                track: string | null;
                soundcloudUrl: string | null;
                artist: SpotleArtist | null;
        }

        interface SpotleArchivePayload {
                availableDateStrings: string[];
                selectedDateKey: string | null;
                selectedSpotle: SelectedSpotle | null;
        }

        const localSpotleData = spotleData as SpotleData;
        const todayKey = formatSpotleDate(getPuzzleDateForGame('spotle'));
        const localAvailableDateStrings = (localSpotleData.answers ?? [])
                .map((entry) => entry.date)
                .filter((dateString) => dateString <= todayKey)
                .sort();

        let data = $state<SpotleArchivePayload>({
                availableDateStrings: localAvailableDateStrings,
                selectedDateKey: null,
                selectedSpotle: null
        });
        let isLoading = $state(false);
        let loadError = $state<string | null>(null);

        let availableDates = $derived(
                (data.availableDateStrings ?? []).map((dateString: string) => new Date(`${dateString}T12:00:00`))
        );
        let startDate = $derived(availableDates[0] ?? new Date());
        let selectedDateParam = $state<string | null>(
                browser ? new URL(window.location.href).searchParams.get('date') : null
        );

        function toSpotifyArtistUrl(uri?: string): string | null {
                if (!uri?.startsWith('spotify:artist:')) {
                        return null;
                }

                return `https://open.spotify.com/artist/${uri.replace('spotify:artist:', '')}`;
        }

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
                        data.selectedSpotle = null;
                        isLoading = false;
                        loadError = null;
                        return;
                }

                const requestDateKey = dateKey;
                isLoading = true;
                loadError = null;

                try {
                        const payload = await fetchArchivePayload<SpotleArchivePayload>('spotle', requestDateKey);

                        if (selectedDateParam !== requestDateKey) {
                                return;
                        }

                        data.availableDateStrings = payload.availableDateStrings ?? localAvailableDateStrings;
                        data.selectedDateKey = payload.selectedDateKey;
                        data.selectedSpotle = payload.selectedSpotle;
                } catch (error) {
                        if (selectedDateParam !== requestDateKey) {
                                return;
                        }

                        data.selectedDateKey = requestDateKey;
                        data.selectedSpotle = null;
                        loadError = error instanceof Error ? error.message : 'Failed to load the Spotle archive entry.';
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
        <title>Spotle Archive - Complete Artist Answer History | WordSolverX</title>
        <meta name="description" content="Browse the full Spotle archive by date, with artist details and stored music metadata for past answers." />
        <link rel="canonical" href="https://wordsolverx.com/spotle-archive" />
        <meta property="og:title" content="Spotle Archive - All Past Artist Answers" />
        <meta property="og:description" content="Complete history of Spotle answers with artist details, music metadata, and date-based browsing." />
        <meta property="og:url" content="https://wordsolverx.com/spotle-archive" />
        <meta property="og:type" content="website" />
        {@html `<script type="application/ld+json">${JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: 'Spotle Archive',
                description: 'Complete archive of all Spotle daily artist answers.',
                url: 'https://wordsolverx.com/spotle-archive',
                isPartOf: { '@type': 'WebSite', name: 'WordSolverX', url: 'https://wordsolverx.com' }
        })}</script>`}
</svelte:head>

<ArchiveCalendar
        gameName="Spotle"
        gameColor="teal"
        gameIcon="Sp"
        {startDate}
        {availableDates}
        basePath="/spotle-archive"
        selectedDate={data.selectedDateKey}
        description="Every Spotle artist answer with richer profile data when the source provides it."
        onSelectDate={handleDateSelect}
/>

<section id="archive-answer" class="mx-auto max-w-4xl scroll-mt-28 px-4 pb-14 sm:px-6 lg:px-8">
        {#if data.selectedSpotle}
                <div class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
                        <div class="mb-8 text-center">
                                <p class="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-400">Selected archive date</p>
                                <h2 class="mt-3 text-3xl font-black text-slate-900 dark:text-slate-50">
                                        Spotle answer for {data.selectedSpotle.formattedDate}
                                </h2>
                        </div>

                        <div class="grid gap-6 lg:grid-cols-[1.3fr_0.8fr]">
                                <div class="rounded-xl border border-teal-200 bg-teal-50/70 p-8 dark:border-teal-800/40 dark:bg-teal-950/20">
                                        <p class="text-sm font-semibold text-teal-700 dark:text-teal-300">Day #{data.selectedSpotle.dayNumber}</p>
                                        <p class="mt-3 text-4xl font-black text-slate-900 dark:text-white">{data.selectedSpotle.artistName}</p>

                                        {#if data.selectedSpotle.track}
                                                <p class="mt-4 text-base text-slate-700 dark:text-slate-200">
                                                        Featured track: <span class="font-semibold">{data.selectedSpotle.track}</span>
                                                </p>
                                        {/if}

                                        {#if data.selectedSpotle.artist}
                                                <div class="mt-6 grid gap-3 sm:grid-cols-2">
                                                        <div class="rounded-lg bg-white/80 p-4 dark:bg-slate-900/60">
                                                                <p class="text-xs text-slate-500 dark:text-slate-400">Country</p>
                                                                <p class="mt-2 font-semibold text-slate-900 dark:text-white">
                                                                        {COUNTRY_NAMES[data.selectedSpotle.artist.country] ??
                                                                                data.selectedSpotle.artist.country.toUpperCase()}
                                                                </p>
                                                        </div>
                                                        <div class="rounded-lg bg-white/80 p-4 dark:bg-slate-900/60">
                                                                <p class="text-xs text-slate-500 dark:text-slate-400">Genre</p>
                                                                <p class="mt-2 font-semibold text-slate-900 dark:text-white">{data.selectedSpotle.artist.genre}</p>
                                                        </div>
                                                        <div class="rounded-lg bg-white/80 p-4 dark:bg-slate-900/60">
                                                                <p class="text-xs text-slate-500 dark:text-slate-400">Debut</p>
                                                                <p class="mt-2 font-semibold text-slate-900 dark:text-white">{data.selectedSpotle.artist.debut_album_year}</p>
                                                        </div>
                                                        <div class="rounded-lg bg-white/80 p-4 dark:bg-slate-900/60">
                                                                <p class="text-xs text-slate-500 dark:text-slate-400">Gender</p>
                                                                <p class="mt-2 font-semibold text-slate-900 dark:text-white">
                                                                        {GENDER_NAMES[data.selectedSpotle.artist.gender] ?? data.selectedSpotle.artist.gender}
                                                                </p>
                                                        </div>
                                                </div>
                                        {/if}
                                </div>

                                <div class="rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 p-6 text-white">
                                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-teal-100">Music profile</p>
                                        {#if data.selectedSpotle.soundcloudUrl}
                                                <a
                                                        href={data.selectedSpotle.soundcloudUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        class="mt-4 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
                                                >
                                                        Listen on SoundCloud
                                                </a>
                                        {/if}
                                        {#if toSpotifyArtistUrl(data.selectedSpotle.artist?.uri)}
                                                <a
                                                        href={toSpotifyArtistUrl(data.selectedSpotle.artist?.uri) ?? '#'}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        class="mt-3 inline-flex items-center rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                                                >
                                                        Open artist profile
                                                </a>
                                        {/if}
                                        <p class="mt-5 text-sm leading-6 text-teal-50">
                                                No images are rendered on this archive page. The focus stays on the answer, the date, and the music metadata we can safely display.
                                        </p>
                                </div>
                        </div>
                </div>
        {:else if loadError}
                <div class="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-800/40 dark:bg-rose-950/20">
                        <h2 class="text-2xl font-bold text-rose-900 dark:text-rose-100">We couldn't load that Spotle date</h2>
                        <p class="mt-3 text-rose-700 dark:text-rose-200">{loadError}</p>
                </div>
        {:else if isLoading && data.selectedDateKey}
                <div class="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
                        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Loading Spotle archive entry...</h2>
                        <p class="mt-3 text-slate-600 dark:text-slate-300">
                                Pulling the selected artist answer into this archive page now.
                        </p>
                </div>
        {:else}
                <div class="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
                        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">Choose a Spotle date above</h2>
                        <p class="mt-3 text-slate-600 dark:text-slate-300">
                                The selected artist answer and the stored music details will render here.
                        </p>
                </div>
        {/if}
</section>

<!-- SEO Article Section -->
<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-700 dark:bg-slate-800">
                <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 mb-6">Why the Spotle Archive Matters</h2>
                <div class="prose prose-slate dark:prose-invert max-w-none">
                        <p>
                                The Spotle archive is a comprehensive database of music artist answers from the daily Spotle puzzle game, complete with rich metadata including genre, country of origin, debut year, and featured tracks. For music enthusiasts, the archive serves as both a practical puzzle reference and a curated journey through the world of popular music, spanning genres, eras, and global regions.
                        </p>
                        <p>
                                What sets the Spotle archive apart from simpler puzzle answer databases is the depth of metadata preserved for each entry. Every archived artist includes their genre classification, country of origin, debut album year, gender, and when available, links to their music on streaming platforms. This makes the archive a genuine music discovery tool where browsing past answers can introduce you to new artists, genres, and musical traditions you might not have encountered otherwise.
                        </p>
                        <p>
                                Studying the archive reveals patterns in how Spotle selects its daily artists. You can observe which genres appear most frequently, which countries are well-represented in the answer pool, and how the game balances mainstream global superstars with independent and regional artists. This pattern analysis not only improves your puzzle performance but also broadens your musical knowledge and appreciation for the diversity of the global music landscape.
                        </p>

                        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How Spotle Answers Work</h3>
                        <p>
                                Spotle challenges players to identify a mystery music artist based on a series of clues revealed with each guess. The game draws from a curated pool of artists that spans multiple genres, countries, and eras. Each daily puzzle selects one artist, and players receive progressively more revealing clues as they make incorrect guesses, including hints about the artist's genre, nationality, debut decade, and other characteristics.
                        </p>
                        <p>
                                The answer for each date is predetermined and stored in the game's dataset. Each entry includes the artist's name, a featured track when available, and detailed metadata covering genre, country, debut year, and gender. The deterministic selection process means the archive is perfectly reliable, and every answer displayed here matches exactly what players encountered on that date in the official game.
                        </p>
                        <p>
                                Spotle's curated approach means that the answer pool reflects a thoughtful selection of artists from across the music spectrum. The game avoids obscure artists that no reasonable player would know while still including enough variety to keep the puzzles challenging. The archive captures this balanced approach, with entries spanning pop, rock, hip-hop, electronic, classical, country, R&B, and many other genres from artists around the world.
                        </p>

                        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Notable Past Spotle Answers</h3>
                        <p>
                                The Spotle archive contains answers from some of the world's most recognizable music artists alongside lesser-known performers who provide genuinely challenging puzzles. Particularly memorable entries include artists whose genre classification might surprise players, artists from countries with thriving but internationally overlooked music scenes, and veteran performers whose debut years might not match their widespread fame.
                        </p>
                        <p>
                                Genre diversity is a hallmark of the Spotle archive, with entries spanning virtually every major musical genre and many niche traditions. Players who study the archive develop a broader understanding of how genres are defined and how artists cross genre boundaries, which directly improves their ability to deduce artist identities from the clue categories that Spotle provides.
                        </p>

                        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">How to Use the Spotle Archive</h3>
                        <p>
                                Navigate the archive using the calendar above to view any past Spotle artist answer. Each entry displays the artist name, day number, featured track, and detailed metadata including genre, country, debut year, and gender. When available, streaming platform links allow you to listen to the artist's music directly from the archive page.
                        </p>

                        <h3 class="text-xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-4">Frequently Asked Questions</h3>
                        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">What genres of artists appear in Spotle?</h4>
                        <p>
                                Spotle draws from a wide range of musical genres including pop, rock, hip-hop, electronic, R&B, country, jazz, classical, metal, indie, folk, and many others. The archive reflects this genre diversity, with entries spanning virtually every major musical tradition from around the world.
                        </p>

                        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Does the archive include streaming links?</h4>
                        <p>
                                When available, the archive includes links to the artist's SoundCloud and Spotify profiles. These links allow you to listen to the featured track and explore the artist's full catalog directly from the archive page.
                        </p>

                        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Can the archive help me discover new music?</h4>
                        <p>
                                Absolutely. Browsing past Spotle answers is an excellent way to discover new artists and genres. Each entry includes enough metadata to understand the artist's background, and the streaming links make it easy to sample their music immediately.
                        </p>

                        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">Are Spotle artists from all countries represented?</h4>
                        <p>
                                Spotle draws artists from many countries around the world, though the distribution naturally reflects the global popularity of different music markets. The archive includes country metadata for every entry, allowing you to see which nations are represented and explore artists from different musical traditions.
                        </p>

                        <h4 class="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-6 mb-2">How can I use the archive to improve at Spotle?</h4>
                        <p>
                                Study the metadata patterns to develop intuition about which genres, countries, and debut eras are most common. Pay attention to artists you didn't recognize and learn about their music. Over time, this broadens your musical knowledge and directly improves your ability to identify mystery artists from limited clues.
                        </p>
                </div>
        </div>
</article>
