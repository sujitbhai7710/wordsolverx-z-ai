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

	const featuredImage = $derived(data.meta?.featuredImage ?? '/canuckle-answer-today.webp');
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
	<div class="min-h-screen flex items-center justify-center p-4 bg-gray-50">
		<div class="max-w-2xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-lg">
			<p class="text-sm font-semibold uppercase tracking-[0.24em] text-rose-600">Canuckle</p>
			<h1 class="mt-3 text-3xl font-black text-gray-900">Canuckle data is temporarily unavailable</h1>
			<p class="mt-4 text-base leading-7 text-gray-600">
				We could not load a verified Canuckle answer for {formattedDate} right now. You can still browse the archive or use the solver while the latest data refreshes.
			</p>
			<div class="mt-6 flex flex-wrap justify-center gap-3">
				<a
					href="/canuckle-archive"
					class="inline-flex items-center justify-center rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-rose-500/20 transition hover:bg-rose-700"
				>
					Browse Canuckle Archive
				</a>
				<a
					href="/canuckle-solver"
					class="inline-flex items-center justify-center rounded-full border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
				>
					Open Canuckle Solver
				</a>
			</div>
		</div>
	</div>
{:else}
	<div class="bg-[linear-gradient(180deg,#fff8f7_0%,#ffffff_42%,#f8fafc_100%)] min-h-screen font-sans">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<header class="text-center mb-10">
				<h1 class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 bg-clip-text text-transparent mb-4">
					Canuckle Answer Today ({formattedDate})
				</h1>
				<p class="mx-auto max-w-3xl text-lg leading-8 text-gray-600">
					Verified Canuckle word, puzzle number, and Canadian fact for <span class="font-semibold text-rose-600">{formattedDate}</span>.
				</p>
			</header>

			<div class="mb-12 rounded-3xl border border-rose-100 bg-white p-6 shadow-lg">
				<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<p class="text-sm font-semibold uppercase tracking-[0.24em] text-rose-600">Today&apos;s puzzle</p>
						<h2 class="mt-2 text-2xl font-bold text-gray-900">Puzzle #{data.todayPuzzle.index}</h2>
						<p class="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
							Today&apos;s verified Canuckle entry is ready, but the answer stays hidden until you open the reveal card below. The Canadian fact and answer now live in one place so the page stays spoiler-safe.
						</p>
					</div>
					<div class="flex flex-wrap gap-3">
						<a
							href="#today-answer-reveal"
							class="inline-flex items-center justify-center rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-rose-500/25 transition hover:bg-rose-700 hover:shadow-lg"
						>
							Reveal Answer
						</a>
						<a
							href="/canuckle-solver"
							class="inline-flex items-center justify-center rounded-full border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
						>
							Open Solver
						</a>
						<a
							href="/canuckle-archive"
							class="inline-flex items-center justify-center rounded-full border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
						>
							Browse Archive
						</a>
					</div>
				</div>
			</div>

			<div class="mb-12" id="today-answer-reveal">
				<WordlebotWasmClient config={{ pageType: 'canuckle-daily', visibleDateKey: data.visibleDateKey }} />
			</div>

			<article class="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
				<h2 class="text-2xl font-bold text-gray-900 mb-4">About today&apos;s Canuckle puzzle</h2>

				<p class="text-gray-600 mb-4 leading-7">
					We verify the Canuckle puzzle every day and keep this page updated with the correct puzzle number, fact, and archive links. For today, that is puzzle <strong class="text-gray-900">#{data.todayPuzzle.index}</strong>. The answer itself now stays hidden inside the reveal card above, so you can land on this page for hints and navigation without getting spoiled immediately.
				</p>
				{#if data.yesterdayData}
					<p class="text-gray-600 mb-4 leading-7">
						Yesterday&apos;s word was <strong class="text-gray-900">{data.yesterdayData.answer.toUpperCase()}</strong> (puzzle #{data.yesterdayData.index}).
					</p>
				{/if}

				<nav class="mt-10 rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-md" aria-label="Table of Contents">
					<div class="bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 px-6 py-4">
						<p class="text-sm font-bold uppercase tracking-[0.25em] text-white/90">Jump to section</p>
					</div>
					<div class="p-5">
						<ol class="grid gap-1 sm:grid-cols-2">
							<li>
								<a href="#frequently-asked-questions" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition-all group">
									<span class="flex items-center justify-center w-7 h-7 rounded-lg bg-rose-100 text-rose-600 text-xs font-bold group-hover:bg-rose-600 group-hover:text-white transition-colors">1</span>
									<span class="text-sm font-medium">FAQs</span>
								</a>
							</li>
							<li>
								<a href="#what-is-canuckle" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all group">
									<span class="flex items-center justify-center w-7 h-7 rounded-lg bg-red-100 text-red-600 text-xs font-bold group-hover:bg-red-600 group-hover:text-white transition-colors">2</span>
									<span class="text-sm font-medium">What is Canuckle?</span>
								</a>
							</li>
							<li>
								<a href="#how-to-play-canuckle" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-all group">
									<span class="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-100 text-amber-600 text-xs font-bold group-hover:bg-amber-600 group-hover:text-white transition-colors">3</span>
									<span class="text-sm font-medium">How to play</span>
								</a>
							</li>
							<li>
								<a href="#canuckle-tips" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all group">
									<span class="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 text-xs font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">4</span>
									<span class="text-sm font-medium">Tips & Strategy</span>
								</a>
							</li>
							<li>
								<a href="#canuckle-vs-wordle" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all group">
									<span class="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-600 text-xs font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">5</span>
									<span class="text-sm font-medium">Canuckle vs Wordle</span>
								</a>
							</li>
							<li>
								<a href="#recent-answers" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all group">
									<span class="flex items-center justify-center w-7 h-7 rounded-lg bg-purple-100 text-purple-600 text-xs font-bold group-hover:bg-purple-600 group-hover:text-white transition-colors">6</span>
									<span class="text-sm font-medium">Recent answers</span>
								</a>
							</li>
						</ol>
					</div>
				</nav>

				<section class="mt-10" id="frequently-asked-questions">
					<h2 class="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
					<div class="space-y-4">
						<details class="group bg-gradient-to-r from-rose-50 to-red-50 rounded-2xl border border-rose-100 overflow-hidden">
							<summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900">
								<span>Where can I reveal the Canuckle answer for today, {formattedDate}?</span>
								<FiChevronDown class="text-rose-600 group-open:rotate-180 transition-transform" />
							</summary>
							<div class="p-5 pt-0 text-gray-600 leading-7">
								Use the reveal card near the top of this page. It keeps today&apos;s Canuckle answer hidden until you choose to open it, and it also shows the verified Canadian fact for puzzle #{data.todayPuzzle.index}.
							</div>
						</details>

						{#if data.yesterdayData}
							<details class="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
								<summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
									<span>What was yesterday&apos;s Canuckle answer?</span>
									<FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
								</summary>
								<div class="p-5 pt-0 text-gray-600 leading-7">
									The previous Canuckle answer was <span class="font-bold text-gray-900">{data.yesterdayData.answer.toUpperCase()}</span> (puzzle #{data.yesterdayData.index}).
								</div>
							</details>
						{/if}

						<details class="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
							<summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
								<span>How do you play Canuckle?</span>
								<FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
							</summary>
							<div class="p-5 pt-0 text-gray-600 leading-7">
								Canuckle is a Wordle-style game with a Canadian twist. You guess 5-letter words and get color feedback - green for correct position, yellow for wrong position, red for not in the word. The answer pool uses Canadian-themed words, and each puzzle comes with a Canadian fact.
							</div>
						</details>

						<details class="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
							<summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
								<span>What makes Canuckle different from Wordle?</span>
								<FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
							</summary>
							<div class="p-5 pt-0 text-gray-600 leading-7">
								Canuckle uses a Canadian-focused answer list, so words like MAPLE, TOQUE, and MOOSE are fair game. It also includes a Canadian fact with each daily answer, and the feedback colors are red instead of gray for absent letters.
							</div>
						</details>

						<details class="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
							<summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
								<span>When does the new Canuckle puzzle release?</span>
								<FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
							</summary>
							<div class="p-5 pt-0 text-gray-600 leading-7">
								A new Canuckle puzzle goes live every day at midnight Eastern Time (ET). That is the same schedule as Wordle for most North American players.
							</div>
						</details>

						<details class="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
							<summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
								<span>What does the red feedback mean in Canuckle?</span>
								<FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
							</summary>
							<div class="p-5 pt-0 text-gray-600 leading-7">
								Red tiles in Canuckle work the same way as gray tiles in Wordle - the letter is not in the answer at all. Yellow means the letter is in the word but in a different position, and green means the correct letter in the correct position.
							</div>
						</details>

						<details class="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
							<summary class="cursor-pointer p-5 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
								<span>How can I browse earlier Canuckle answers?</span>
								<FiChevronDown class="text-gray-500 group-open:rotate-180 transition-transform" />
							</summary>
							<div class="p-5 pt-0 text-gray-600 leading-7">
								Use the recent answers table on this page to scan the last 30 days, or visit the full Canuckle archive for a searchable history of all past puzzles.
							</div>
						</details>
					</div>
				</section>
			</article>

			<article class="mt-12 space-y-8">
				<section id="what-is-canuckle" class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
					<h2 class="text-3xl font-bold text-gray-900 mb-6">What is Canuckle?</h2>
					<p class="text-lg text-gray-600 mb-6 leading-relaxed">
						Canuckle is a daily word-guessing game made by Canadian developers, hosted at canucklegame.github.io. It follows the same basic format as Wordle - you get six attempts to guess a hidden 5-letter word, and each guess reveals which letters are in the right spot, which are in the word but misplaced, and which are not in the word at all.
					</p>
					<p class="text-lg text-gray-600 mb-6 leading-relaxed">
						The twist is that every answer has a Canadian connection. Some are obviously Canadian - TOQUE, MAPLE, LOONIE - while others are more subtle. The game also includes a short Canadian fact after each puzzle, which is a nice touch that sets it apart from the dozens of other Wordle clones. If you grew up in Canada or have spent any time there, you will have a real edge because you can guess words that a purely American or British player might never think of.
					</p>
					<p class="text-lg text-gray-600 leading-relaxed">
						Another difference you will notice immediately: the feedback colors. Instead of the gray/yellow/green scheme Wordle uses, Canuckle goes with red/yellow/green. Red means the letter is not in the word (same as Wordle&apos;s gray), yellow means the letter is there but in a different position, and green means correct letter, correct spot. It takes a game or two to adjust if you are used to Wordle&apos;s colors, but after that it feels natural.
					</p>
				</section>

				<section id="how-to-play-canuckle" class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
					<h2 class="text-3xl font-bold text-gray-900 mb-6">How to play Canuckle</h2>
					<p class="text-lg text-gray-600 mb-6 leading-relaxed">
						The gameplay is straightforward if you have played any Wordle variant before, but there are a few Canuckle-specific things worth knowing before you start.
					</p>
					<ol class="list-decimal list-inside space-y-5 text-lg text-gray-600 mb-6">
						<li>
							<strong class="text-gray-900">Open the game and look at the empty grid.</strong>
							You will see six rows of five empty tiles, just like Wordle. The goal is to fill in the correct 5-letter word before you run out of rows.
						</li>
						<li>
							<strong class="text-gray-900">Type your first guess.</strong>
							Use a strong starter word with common vowels and consonants. CRANE, SLATE, and TRACE are popular choices. Do not forget that the answer might be a Canadian-specific word, so if you have a hunch about something like IGLOO or LOONIE, that is worth considering early on.
						</li>
						<li>
							<strong class="text-gray-900">Read the color feedback.</strong>
							Green means the letter is in the right spot - lock it in. Yellow means the letter is in the word but somewhere else. Red means the letter is not in the word at all, so cross it off your mental list.
						</li>
						<li>
							<strong class="text-gray-900">Narrow it down with each guess.</strong>
							Use the letters you have confirmed (green and yellow) to construct your next guess. Try to avoid letters that came back red. If you have a yellow letter, shuffle it into a different position.
						</li>
						<li>
							<strong class="text-gray-900">Think Canadian.</strong>
							Once you have a few letters confirmed, start thinking about Canadian words that fit. If you have _O_IE, think MOOSE... wait, no, that has too many letters. LOONIE? TOQUE? POUTINE? The Canadian answer pool is smaller than Wordle&apos;s, which actually makes it easier to narrow things down once you get going.
						</li>
						<li>
							<strong class="text-gray-900">Read the fact after you finish.</strong>
							Every Canuckle answer comes with a Canadian fact. It is a small reward for solving the puzzle and a fun way to learn something new about Canada each day.
						</li>
					</ol>
				</section>

				<section id="canuckle-tips" class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
					<h2 class="text-3xl font-bold text-gray-900 mb-6">Canuckle tips and strategy</h2>
					<p class="text-lg text-gray-600 mb-6 leading-relaxed">
						Beyond the basics, a few Canuckle-specific strategies can shave a guess or two off your daily average.
					</p>
					<div class="mb-8">
						<h3 class="text-xl font-bold text-gray-900 mb-3">Use a vowel-heavy opener</h3>
						<p class="text-lg text-gray-600 leading-relaxed">
							Words like ADIEU, AUDIO, or ABOUT are strong openers because they test four of the five vowels in one guess. In Canuckle specifically, ABOUT is a great choice because it also tests B and T, which show up in many Canadian answers (TOQUE, BACON, OTTER, CABIN).
						</p>
					</div>
					<div class="mb-8">
						<h3 class="text-xl font-bold text-gray-900 mb-3">Keep a mental list of Canadian words</h3>
						<p class="text-lg text-gray-600 leading-relaxed">
							After playing for a few weeks, you will start noticing that Canuckle draws from a specific vocabulary: hockey terms (PUCK, ICE, RINK), geography (BAYOU, DELTA, CREEK), food (MAPLE, BACON, POUTINE - well, that is seven letters), animals (MOOSE, OTTER, GOOSE, BISON), and culture (LOONIE, TOQUE, ESKER). Keeping these categories in mind helps when you are stuck with a few letters and need inspiration.
						</p>
					</div>
					<div class="mb-8">
						<h3 class="text-xl font-bold text-gray-900 mb-3">Use the solver when you are stuck</h3>
						<p class="text-lg text-gray-600 leading-relaxed">
							If you have burned four or five guesses and still cannot figure it out, the Canuckle solver on WordSolverX lets you enter your guesses and the feedback you received, then filters the answer list to show only matching candidates. It is a learning tool - use it a few times and you will start recognizing patterns faster on your own.
						</p>
					</div>
					<div>
						<h3 class="text-xl font-bold text-gray-900 mb-3">Avoid assuming American spelling</h3>
						<p class="text-lg text-gray-600 leading-relaxed">
							Canadian English uses British spelling for some words (COLOUR, FLAVOUR, HONOUR), but Canuckle&apos;s answer list sticks to standard 5-letter words that work in both dialects. You will not usually run into spelling-variant traps, but it is worth remembering that the game is built from a Canadian perspective.
						</p>
					</div>
				</section>

				<section id="canuckle-vs-wordle" class="bg-gradient-to-r from-rose-50 to-red-50 rounded-3xl p-8 border border-rose-100">
					<h2 class="text-3xl font-bold text-gray-900 mb-6">Canuckle vs Wordle</h2>
					<p class="text-lg text-gray-600 mb-6 leading-relaxed">
						Both games share the same core mechanic, but the differences matter more than you might expect once you start playing both daily.
					</p>
					<div class="grid gap-4 md:grid-cols-2">
						<div class="bg-white rounded-2xl p-6 border border-rose-100">
							<h3 class="text-lg font-bold text-gray-900 mb-2">Answer pool</h3>
							<p class="text-gray-600 leading-relaxed">Wordle pulls from roughly 2,300 possible answers across general English. Canuckle uses a smaller, curated list of Canadian-themed words. This means repeat answers are more likely in Canuckle, and the pool of likely guesses is narrower - which can work in your favor once you learn the patterns.</p>
						</div>
						<div class="bg-white rounded-2xl p-6 border border-rose-100">
							<h3 class="text-lg font-bold text-gray-900 mb-2">Feedback colors</h3>
							<p class="text-gray-600 leading-relaxed">Wordle uses gray (absent), yellow (misplaced), green (correct). Canuckle replaces gray with red. Functionally identical, but the red-yellow-green scheme can be confusing if you switch between the two games regularly.</p>
						</div>
						<div class="bg-white rounded-2xl p-6 border border-rose-100">
							<h3 class="text-lg font-bold text-gray-900 mb-2">Canadian facts</h3>
							<p class="text-gray-600 leading-relaxed">The biggest differentiator. After each Canuckle puzzle, you get a short fact about Canada related to the answer. It is educational and makes the game feel more purposeful than a straight Wordle clone. Wordle has no equivalent feature.</p>
						</div>
						<div class="bg-white rounded-2xl p-6 border border-rose-100">
							<h3 class="text-lg font-bold text-gray-900 mb-2">Skill transfer</h3>
							<p class="text-gray-600 leading-relaxed">If you are good at Wordle, you will be decent at Canuckle from day one. The deduction logic is identical. The main adjustment is learning to think Canadian - once you have absorbed the answer pool tendencies, your solve rate should be similar or better than Wordle.</p>
						</div>
					</div>
				</section>

				<section id="recent-answers" class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
					<h2 class="text-3xl font-bold text-gray-900 mb-6">Recent Canuckle answers</h2>
					<p class="text-lg text-gray-600 mb-6 leading-relaxed">The last 30 daily words, newest first. Today&apos;s live answer stays hidden here until you use the reveal card above.</p>
					<div class="grid gap-3 md:grid-cols-2">
						{#each data.last30 as entry}
							<div class="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm transition hover:border-rose-200 hover:bg-rose-50/60">
								<div class="min-w-0">
									<p class="text-sm font-semibold text-gray-900">{entry.date}</p>
									<p class="text-xs text-gray-500">Puzzle #{entry.index}</p>
								</div>
								<div class="text-right">
									{#if entry.index === data.todayPuzzle.index}
										<p class="font-semibold text-gray-500">Hidden until reveal</p>
									{:else}
										<p class="font-bold text-rose-600">{entry.answer.toUpperCase()}</p>
									{/if}
								</div>
							</div>
						{/each}
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

			<div class="mt-16">
				<InternalLinkSection currentGame="Canuckle" />
			</div>
		</div>
	</div>
{/if}
