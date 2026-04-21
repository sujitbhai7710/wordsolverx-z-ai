<script lang="ts">
        import AuthorCard from '$lib/components/AuthorCard.svelte';
        import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
        import FAQSection from '$lib/components/FAQSection.svelte';
        import {
                PRESTON_HAYES_AUTHOR_DESCRIPTION,
                PRESTON_HAYES_AUTHOR_IMAGE,
                PRESTON_HAYES_AUTHOR_NAME
        } from '$lib/authors';
        import type { SpotleAnswer, SpotleArtist } from '$lib/spotle';

        let { data }: {
                data: {
                        todayFormatted: string;
                        todayAnswer: SpotleAnswer | null;
                        todayArtist: SpotleArtist | null;
                        last30Days: {
                                date: string;
                                dayNumber: number;
                                artistName: string;
                                track: string | null;
                                soundcloudUrl: string | null;
                                artist: SpotleArtist | null;
                        }[];
                        faqItems: { question: string; answer: string }[];
                        schemaJson: string;
                        meta: { title: string; description: string; keywords?: string };
                        stats: { totalArtists: number; totalAnswers: number; lastSyncedAt: string | null };
                        labels: { countryNames: Record<string, string>; genderNames: Record<string, string> };
                };
        } = $props();

        const todayFormatted = $derived(data.todayFormatted);
        const todayAnswer = $derived(data.todayAnswer);
        const todayArtist = $derived(data.todayArtist);
        const last30Days = $derived(data.last30Days);
        const faqItems = $derived(data.faqItems);
        const schemaJson = $derived(data.schemaJson);
        const meta = $derived(data.meta);
        const stats = $derived(data.stats);
        const labels = $derived(data.labels);

        function toSpotifyArtistUrl(uri?: string): string | null {
                if (!uri?.startsWith('spotify:artist:')) {
                        return null;
                }

                return `https://open.spotify.com/artist/${uri.replace('spotify:artist:', '')}`;
        }
</script>

<svelte:head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords ?? 'spotle answer today, spotle answer, spotle hint, spotle artist today'} />
        <link rel="canonical" href="https://wordsolver.tech/spotle-answer-today" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wordsolver.tech/spotle-answer-today" />
        <meta property="og:site_name" content="WordSolverX" />
        <meta property="og:image" content="https://wordsolver.tech/images/spotle-answer-today.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        {@html `<script type="application/ld+json">${schemaJson}</script>`}
</svelte:head>

<div class="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-6xl">
                <Breadcrumbs />

                <header class="relative overflow-hidden rounded-[2rem] border border-teal-100 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.16),transparent_30%),linear-gradient(135deg,#ffffff_0%,#ecfdf5_55%,#f0fdfa_100%)] p-8 shadow-[0_28px_80px_rgba(16,185,129,0.10)] sm:p-10">
                        <div class="absolute -right-10 top-0 h-32 w-32 rounded-full bg-teal-200/40 blur-3xl"></div>
                        <div class="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-teal-200/40 blur-3xl"></div>
                        <div class="relative">
                                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-teal-600">Daily Spotle</p>
                                <h1 class="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                                        Spotle Answer Today
                                </h1>
                                <p class="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                                        Today&apos;s verified artist, music details, and archive context for <span class="font-semibold text-teal-700">{todayFormatted}</span>.
                                </p>

                                <div class="mt-7 flex flex-wrap gap-3">
                                        <a
                                                href="#spotle-answer-card"
                                                class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-teal-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                                        >
                                                View Today&apos;s Artist
                                        </a>
                                        <a
                                                href="/spotle-archive"
                                                class="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-5 py-3 text-sm font-bold text-teal-700 shadow-sm transition hover:bg-teal-50"
                                        >
                                                Open Spotle Archive
                                        </a>
                                        <a
                                                href="/spotle-solver"
                                                class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
                                        >
                                                Use Spotle Solver
                                        </a>
                                </div>
                        </div>
                </header>

                <section id="spotle-answer-card" class="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
                        <div class="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg">
                                <h2 class="text-2xl font-black text-slate-900">Today&apos;s Spotle artist</h2>

                                {#if todayArtist && todayAnswer}
                                        <p class="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">
                                                Day #{todayAnswer.dayNumber}
                                        </p>
                                        <h3 class="mt-2 text-4xl font-black text-slate-900">{todayArtist.artist}</h3>
                                        <p class="mt-3 text-lg text-slate-600">
                                                {labels.countryNames[todayArtist.country] ?? todayArtist.country.toUpperCase()} · {todayArtist.genre}
                                        </p>

                                        <div class="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                                        <p class="text-xs uppercase tracking-[0.16em] text-slate-500">Rank</p>
                                                        <p class="mt-2 text-xl font-bold text-slate-900">#{todayArtist.index + 1}</p>
                                                </div>
                                                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                                        <p class="text-xs uppercase tracking-[0.16em] text-slate-500">Debut Year</p>
                                                        <p class="mt-2 text-xl font-bold text-slate-900">{todayArtist.debut_album_year}</p>
                                                </div>
                                                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                                        <p class="text-xs uppercase tracking-[0.16em] text-slate-500">Group Size</p>
                                                        <p class="mt-2 text-xl font-bold text-slate-900">
                                                                {todayArtist.group_size === 1 ? 'Solo' : `${todayArtist.group_size} members`}
                                                        </p>
                                                </div>
                                                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                                        <p class="text-xs uppercase tracking-[0.16em] text-slate-500">Gender</p>
                                                        <p class="mt-2 text-xl font-bold text-slate-900">
                                                                {labels.genderNames[todayArtist.gender] ?? todayArtist.gender}
                                                        </p>
                                                </div>
                                                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                                                        <p class="text-xs uppercase tracking-[0.16em] text-slate-500">Featured Track</p>
                                                        <p class="mt-2 text-xl font-bold text-slate-900">
                                                                {todayAnswer.track || todayArtist.track_name || 'Track info not stored yet'}
                                                        </p>
                                                </div>
                                        </div>

                                        <div class="mt-6 flex flex-wrap gap-3">
                                                {#if todayAnswer.soundcloudUrl}
                                                        <a
                                                                href={todayAnswer.soundcloudUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                class="inline-flex items-center rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
                                                        >
                                                                Listen on SoundCloud
                                                        </a>
                                                {/if}
                                                {#if toSpotifyArtistUrl(todayArtist.uri)}
                                                        <a
                                                                href={toSpotifyArtistUrl(todayArtist.uri) ?? '#'}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                class="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                                        >
                                                                Open Artist Profile
                                                        </a>
                                                {/if}
                                        </div>
                                {:else}
                                        <p class="mt-4 text-base leading-7 text-slate-600">
                                                Today&apos;s Spotle artist is not available in the stored dataset yet. The archive page will still help you browse older dates while the next refresh lands.
                                        </p>
                                {/if}
                        </div>

                        <div class="space-y-6">
                                <div class="rounded-[2rem] bg-gradient-to-br from-teal-600 to-teal-700 p-6 text-white shadow-lg shadow-teal-500/25">
                                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-teal-100">Dataset status</p>
                                        <div class="mt-5 space-y-3 text-sm">
                                                <div class="flex items-center justify-between gap-4">
                                                        <span>Total Artists</span>
                                                        <span class="font-bold">{stats.totalArtists}</span>
                                                </div>
                                                <div class="flex items-center justify-between gap-4">
                                                        <span>Total Stored Answers</span>
                                                        <span class="font-bold">{stats.totalAnswers}</span>
                                                </div>
                                                <div class="flex items-center justify-between gap-4">
                                                        <span>Last Sync</span>
                                                        <span class="text-right font-bold">
                                                                {stats.lastSyncedAt ? new Date(stats.lastSyncedAt).toLocaleString('en-US') : 'Not recorded'}
                                                        </span>
                                                </div>
                                        </div>
                                </div>

                                <div class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                                        <h3 class="text-xl font-black text-slate-900">What changed here</h3>
                                        <p class="mt-3 text-sm leading-7 text-slate-600">
                                                This page now carries the richer Spotle source details when they are available, including the featured track and music links, while still keeping the layout image-free.
                                        </p>
                                </div>
                        </div>
                </section>

                <section class="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                        <h2 class="text-2xl font-black text-slate-900">Recent Spotle answers</h2>
                        <p class="mt-3 text-base leading-7 text-slate-600">
                                The newest 30 stored Spotle answers, with extra music details shown when the source has them.
                        </p>

                        <div class="mt-6 grid gap-3 md:grid-cols-2">
                                {#each last30Days as entry}
                                        <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                                                <div class="flex items-start justify-between gap-4">
                                                        <div class="min-w-0">
                                                                <p class="text-sm font-semibold text-slate-500">{entry.date}</p>
                                                                <p class="mt-1 text-xl font-black text-slate-900">{entry.artistName}</p>
                                                                <p class="mt-1 text-sm text-slate-600">
                                                                        Day #{entry.dayNumber}
                                                                        {#if entry.artist}
                                                                                · {labels.countryNames[entry.artist.country] ?? entry.artist.country.toUpperCase()}
                                                                        {/if}
                                                                </p>
                                                                {#if entry.track}
                                                                        <p class="mt-3 text-sm text-slate-700">Track: <span class="font-semibold">{entry.track}</span></p>
                                                                {/if}
                                                        </div>
                                                        {#if entry.soundcloudUrl}
                                                                <a
                                                                        href={entry.soundcloudUrl}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        class="shrink-0 rounded-full border border-teal-200 px-3 py-1 text-xs font-semibold text-teal-700 transition hover:bg-teal-50"
                                                                >
                                                                        Play
                                                                </a>
                                                        {/if}
                                                </div>
                                        </div>
                                {/each}
                        </div>
                </section>

                <div class="mt-10">
                        <FAQSection title="Spotle Answer FAQ" faqs={faqItems} />
                </div>

                <div class="mt-12">
                        <AuthorCard
                                name={PRESTON_HAYES_AUTHOR_NAME}
                                image={PRESTON_HAYES_AUTHOR_IMAGE}
                                description={PRESTON_HAYES_AUTHOR_DESCRIPTION}
                        />
                </div>

                <article class="mt-10 space-y-8">
                        <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                                <h2 class="text-3xl font-black tracking-tight text-slate-900">What is Spotle?</h2>
                                <p class="mt-4 text-lg leading-8 text-slate-600">
                                        Spotle is a daily music guessing game where the answer is always a musical artist or band. Each day, the game selects an artist from its database — currently {stats.totalArtists} artists spanning {stats.totalAnswers} puzzle days — and you have a limited number of guesses to identify them. Unlike word-based daily games, Spotle tests your knowledge of the music landscape: genres, countries, debut years, and popular tracks.
                                </p>
                                <p class="mt-4 text-lg leading-8 text-slate-600">
                                        The game was inspired by Heardle, which became a viral hit after The New York Times acquired it. Spotle takes the same core concept but builds its own artist database with richer metadata. Each artist entry includes country of origin, genre, debut album year, group size, gender, and a featured track. That data enables a much more informative gameplay experience — you are not just guessing names, you are narrowing down based on real biographical information.
                                </p>
                                <p class="mt-4 text-lg leading-8 text-slate-600">
                                        Spotle has a smaller player base than Heardle but a more dedicated one. Music fans — particularly people who follow charts, discover new artists on Spotify, or watch live music — tend to stick with Spotle because the game rewards real music knowledge rather than surface-level familiarity. If you know which country an artist is from or what decade they debuted, you can solve most puzzles in two or three guesses.
                                </p>
                                <p class="mt-4 text-lg leading-8 text-slate-600">
                                        What makes Spotle unique among daily puzzle games is its structured metadata approach. Most music games give you audio clips or images. Spotle gives you data points — country, genre, debut year, group size, gender. That structure makes the game feel more like a detective investigation than a pop quiz. You start with broad categories and narrow down systematically, which is deeply satisfying for players who enjoy logical deduction applied to a subject they care about.
                                </p>
                        </section>

                        <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                                <h2 class="text-3xl font-black tracking-tight text-slate-900">How Spotle Works</h2>
                                <p class="mt-4 text-lg leading-8 text-slate-600">
                                        Each day, Spotle selects one artist from its ranked database. The artist appears at a specific rank in the database (this page shows the rank), and your job is to identify them before you run out of guesses. The game progressively reveals clues — first the country, then the genre, then more specific details like group size and debut year.
                                </p>
                                <p class="mt-4 text-lg leading-8 text-slate-600">
                                        The daily cycle resets at midnight. Each puzzle is assigned a sequential day number. Today is Day #{todayAnswer?.dayNumber}, and the answer is <strong class="text-slate-900">{todayArtist?.artist ?? 'not available'}</strong>. This page tracks the current day&apos;s answer and shows the artist&apos;s full profile: country, genre, debut year, group size, gender, and featured track. When available, links to SoundCloud and Spotify profiles are included so you can listen to the artist&apos;s music directly from the answer page.
                                </p>
                                <p class="mt-4 text-lg leading-8 text-slate-600">
                                        The dataset is synced periodically from the source, so the last-sync timestamp shown in the stats card tells you how fresh the data is. With {stats.totalArtists} artists in the database, the answer pool is large enough that repeat answers are infrequent, which keeps the game interesting over long play sessions. The database covers artists from every continent and every major genre, so the daily variety is substantial.
                                </p>
                                <p class="mt-4 text-lg leading-8 text-slate-600">
                                        After identifying the artist (or using this page to check the answer), you can listen to their featured track via the SoundCloud link when available. This adds a musical discovery element that most other daily puzzle games lack — even if you already knew the artist, you might discover a track you had never heard. That combination of trivia and music discovery is what keeps Spotle players coming back every day.
                                </p>
                        </section>

                        <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                                <h2 class="text-3xl font-black tracking-tight text-slate-900">Spotle Answer Today: {todayFormatted}</h2>
                                <p class="mt-4 text-lg leading-8 text-slate-600">
                                        The Spotle answer for {todayFormatted} is <strong class="text-slate-900">{todayArtist?.artist ?? 'not available'}</strong>, appearing as Day #{todayAnswer?.dayNumber} in the Spotle database. The artist ranks #{todayArtist?.index !== undefined ? todayArtist.index + 1 : 'N/A'} overall and hails from {todayArtist ? (labels.countryNames[todayArtist.country] ?? todayArtist.country.toUpperCase()) : 'N/A'}, performing in the {todayArtist?.genre ?? 'N/A'} genre.
                                </p>
                                <p class="mt-4 text-lg leading-8 text-slate-600">
                                        {todayArtist ? `The artist ${todayArtist.group_size === 1 ? 'is a solo act' : `has ${todayArtist.group_size} members`} and debuted with their first album in ${todayArtist.debut_album_year}.` : ''} The full profile with all metadata is shown in the answer card at the top of this page. If a SoundCloud link is available, you can listen to the featured track directly. The Spotify profile link lets you explore the artist&apos;s full discography.
                                </p>
                                <p class="mt-4 text-lg leading-8 text-slate-600">
                                        For previous Spotle answers, scroll through the recent answers list above or visit the Spotle archive page. The archive contains the complete history of Spotle answers with full artist metadata, searchable by date and day number. It is also an excellent tool for studying artist metadata — after a few days of browsing, you will start recognizing which countries and genres dominate the database.
                                </p>
                        </section>

                        <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                                <h2 class="text-3xl font-black tracking-tight text-slate-900">Strategy Tips for Spotle</h2>
                                <div class="mt-6 space-y-6">
                                        <div class="rounded-2xl bg-slate-50 p-6">
                                                <h3 class="text-xl font-bold text-slate-900">Start with country and continent</h3>
                                                <p class="mt-2 text-base leading-7 text-slate-600">
                                                        The country clue is usually the first major hint you get. If the country is revealed as Japan, you can immediately eliminate artists from the United States, United Kingdom, Brazil, and other non-Japanese markets. With roughly 195 countries in the world, the continent clue alone eliminates 80% of the database. Pay attention to the country flags and country names in the clues — Spotle sometimes uses unexpected national associations for artists who became famous in a different country than they were born in.
                                                </p>
                                        </div>
                                        <div class="rounded-2xl bg-slate-50 p-6">
                                                <h3 class="text-xl font-bold text-slate-900">Use genre to narrow further</h3>
                                                <p class="mt-2 text-base leading-7 text-slate-600">
                                                        Once you know the country, the genre clue is the next most powerful filter. If the artist is from South Korea and the genre is K-pop, your guess list narrows to maybe 20-30 artists instead of hundreds. If the genre is indie rock from Australia, you are looking at an even smaller pool. Genre familiarity — knowing which artists belong to which genres — is the single most valuable skill for Spotle.
                                                </p>
                                        </div>
                                        <div class="rounded-2xl bg-slate-50 p-6">
                                                <h3 class="text-xl font-bold text-slate-900">Check the debut year</h3>
                                                <p class="mt-2 text-base leading-7 text-slate-600">
                                                        The debut year tells you the era the artist started in. If the debut is 2015 or later, you are looking at relatively recent artists. If it is 2000-2010, you are in the indie/MySpace era. Before 2000 is classic territory — think classic rock, early hip-hop, and legendary pop acts. Combining country, genre, and debut year usually narrows the field to fewer than 10 candidates.
                                                </p>
                                        </div>
                                        <div class="rounded-2xl bg-slate-50 p-6">
                                                <h3 class="text-xl font-bold text-slate-900">Solo vs group matters</h3>
                                                <p class="mt-2 text-base leading-7 text-slate-600">
                                                        The group size clue tells you whether you are looking for a solo artist or a band. Solo artists with one member tend to be easier to identify because the name is a person&apos;s name. Groups can be trickier because band names are more varied — they might be abstract (COLDPLAY), geographic (ARCTIC MONKEYS), or unrelated words (FOO FIGHTERS). If the answer is a group, think about iconic bands from the country and genre you have identified.
                                                </p>
                                        </div>
                                        <div class="rounded-2xl bg-slate-50 p-6">
                                                <h3 class="text-xl font-bold text-slate-900">Listen to the featured track</h3>
                                                <p class="mt-2 text-base leading-7 text-slate-600">
                                                        When this page includes a SoundCloud link, use it. Listening to 30 seconds of the artist&apos;s music is often enough to recognize them, even if you cannot place the name. The featured track is usually one of their most popular songs — the one Spotify puts first on their artist page. Audio recognition is faster and more reliable than trying to recall an artist from metadata alone.
                                                </p>
                                        </div>
                                        <div class="rounded-2xl bg-slate-50 p-6">
                                                <h3 class="text-xl font-bold text-slate-900">Pay attention to gender clues</h3>
                                                <p class="mt-2 text-base leading-7 text-slate-600">
                                                        The gender metadata can eliminate half the candidates in some genres. If the clue indicates a female artist in country music from the United States, your list narrows from hundreds to maybe 30-40 names. In K-pop, gender classification is especially useful because boy groups and girl groups are separate categories with entirely different artist pools. Always factor gender into your deduction process.
                                                </p>
                                        </div>
                                </div>
                        </section>

                        <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                                <h2 class="text-3xl font-black tracking-tight text-slate-900">Spotle vs Similar Music Games</h2>
                                <div class="mt-6 grid gap-6 sm:grid-cols-2">
                                        <div class="rounded-2xl bg-slate-50 p-6">
                                                <h3 class="text-lg font-bold text-slate-900">Spotle vs Heardle</h3>
                                                <p class="mt-2 text-base leading-7 text-slate-600">
                                                        Heardle plays a short audio clip and you guess the song. Spotle reveals biographical clues about the artist. Heardle tests song recognition; Spotle tests artist identification. Heardle rewards people who listen to a lot of music; Spotle rewards people who know artist biographies and music industry details. Both are great for music fans, but they exercise completely different types of musical knowledge.
                                                </p>
                                        </div>
                                        <div class="rounded-2xl bg-slate-50 p-6">
                                                <h3 class="text-lg font-bold text-slate-900">Spotle vs Framed</h3>
                                                <p class="mt-2 text-base leading-7 text-slate-600">
                                                        Framed shows you a movie frame and you guess the film. Spotle reveals artist details and you guess the musician. Both are identification games applied to entertainment, but Framed covers cinema while Spotle covers music. The deduction process is similar — start broad, use clues to narrow, make an educated guess — but the domain knowledge required is completely different.
                                                </p>
                                        </div>
                                        <div class="rounded-2xl bg-slate-50 p-6">
                                                <h3 class="text-lg font-bold text-slate-900">Spotle vs Globle</h3>
                                                <p class="mt-2 text-base leading-7 text-slate-600">
                                                        Globle covers all countries and topics. Spotle focuses specifically on music artists. Globle is broader but shallower; Spotle is narrower but deeper. If you are a music specialist, Spotle will feel more satisfying because it draws from your area of expertise rather than the entire knowledge base. Globle tests general knowledge; Spotle tests specialized knowledge.
                                                </p>
                                        </div>
                                        <div class="rounded-2xl bg-slate-50 p-6">
                                                <h3 class="text-lg font-bold text-slate-900">Why Spotle works well for music fans</h3>
                                                <p class="mt-2 text-base leading-7 text-slate-600">
                                                        The game rewards deep music knowledge rather than surface-level familiarity. Knowing an artist&apos;s country, genre, debut year, and group size means you are the kind of person who reads artist bios, follows music blogs, and knows the difference between indie pop and dream pop. That specificity is what makes Spotle more engaging for serious music fans than broader trivia games.
                                                </p>
                                        </div>
                                </div>
                        </section>

                        <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                                <h2 class="text-3xl font-black tracking-tight text-slate-900">What Makes Spotle Challenging</h2>
                                <div class="mt-6 space-y-6">
                                        <div class="rounded-2xl bg-slate-50 p-6">
                                                <h3 class="text-xl font-bold text-slate-900">The database is enormous</h3>
                                                <p class="mt-2 text-base leading-7 text-slate-600">
                                                        With {stats.totalArtists} artists, Spotle&apos;s answer pool is much larger than most daily puzzle games. Wordle has about 2,300 answers. Nerdle has maybe a few thousand valid equations. Spotle has {stats.totalArtists} possible answers across every genre, country, and era. That scale means you cannot brute-force your way to a solution — you need genuine music knowledge to narrow the field efficiently.
                                                </p>
                                        </div>
                                        <div class="rounded-2xl bg-slate-50 p-6">
                                                <h3 class="text-xl font-bold text-slate-900">Artists from unfamiliar genres and countries</h3>
                                                <p class="mt-2 text-base leading-7 text-slate-600">
                                                        Spotle does not limit itself to mainstream Western pop. The database includes artists from Africa, Asia, South America, and Eastern Europe — genres and markets that many English-speaking players know nothing about. On days when the answer is a Japanese rock band or a Nigerian Afrobeats artist, players who only know Western pop will struggle. That global scope is what makes Spotle educational — you learn about music from cultures you might never encounter otherwise.
                                                </p>
                                        </div>
                                        <div class="rounded-2xl bg-slate-50 p-6">
                                                <h3 class="text-xl font-bold text-slate-900">Metadata can be misleading</h3>
                                                <p class="mt-2 text-base leading-7 text-slate-600">
                                                        Some artists have genre classifications that do not match public perception. An artist you think of as rock might be classified as alternative or indie. An artist from one country might have debuted in another. These metadata surprises can throw off your deduction if you rely too heavily on assumptions. Always consider that the database might classify an artist differently than you would expect.
                                                </p>
                                        </div>
                                        <div class="rounded-2xl bg-slate-50 p-6">
                                                <h3 class="text-xl font-bold text-slate-900">Multiple valid guesses at each stage</h3>
                                                <p class="mt-2 text-base leading-7 text-slate-600">
                                                        Even after narrowing by country, genre, and debut year, you might still have 5-10 candidates. At that point, the game becomes a test of how many artists you actually know in that specific niche. Players with broad but shallow music knowledge often get stuck at this stage because they can narrow the field but cannot make the final identification. Deep, specialized knowledge of specific genres is what separates good Spotle players from great ones.
                                                </p>
                                        </div>
                                </div>
                        </section>
                </article>
        </div>
</div>
