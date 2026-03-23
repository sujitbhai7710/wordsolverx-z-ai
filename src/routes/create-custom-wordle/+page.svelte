<script lang="ts">
    import { encodeWord } from '$lib/wordle/challengeUtils';
    import ClipboardIcon from '$lib/components/icons/ClipboardIcon.svelte';
    import CheckIcon from '$lib/components/icons/CheckIcon.svelte';
    import FiChevronDown from '$lib/components/icons/FiChevronDown.svelte';

    const faqs = [
        {
            q: "How does the Custom Wordle Creator work?",
            a: "Simply type any word between 4 and 12 letters into the input field. We'll validate it against our dictionary, encode it securely, and generate a unique link you can share with anyone. The recipient won't see the answer - they'll just get a Wordle puzzle to solve!"
        },
        {
            q: "Can my friends see the answer in the link?",
            a: "No! The word is encoded using a secure cipher so it's not visible in the URL. Your friends will only see a puzzle to solve - the answer stays hidden until they guess correctly or run out of tries."
        },
        {
            q: "What word lengths are supported?",
            a: "You can create puzzles with any word from 4 to 12 letters long. Shorter words (4-5 letters) are easier, while longer words (8-12 letters) provide a much tougher challenge."
        },
        {
            q: "Does the word need to be a real English word?",
            a: "Yes, the word must exist in our validated dictionary. This ensures that the puzzle is solvable and that your friends can actually guess the word using valid English words."
        },
        {
            q: "Is there a limit to how many puzzles I can create?",
            a: "No limits at all! Create as many custom Wordle puzzles as you want. Each puzzle generates a unique link, so you can challenge different friends with different words."
        },
        {
            q: "Can I play the puzzle I created?",
            a: "Technically yes - you can open your own link - but since you already know the answer, it won't be much fun! Custom puzzles are best shared with friends and family."
        },
    ];

    let word = $state('');
    let customHint = $state('');
    let isValidWord = $state<boolean | null>(null);
    let generatedLink = $state<string | null>(null);
    let error = $state<string | null>(null);
    let isCopied = $state(false);
    let isLoading = $state(false);
    let openFaq = $state<number | null>(null);
    let canWebShare = $state(false);
    let validationRequestId = $state(0);

    type WordProcessingModule = typeof import('$lib/wordle/words_processing');
    let wordProcessingModulePromise: Promise<WordProcessingModule> | null = null;

    function getWordProcessingModule() {
        if (!wordProcessingModulePromise) {
            wordProcessingModulePromise = import('$lib/wordle/words_processing');
        }
        return wordProcessingModulePromise;
    }

    $effect(() => {
        canWebShare = typeof navigator !== 'undefined' && !!navigator.share;
    });

    function handleWordChange(e: Event) {
        const target = e.target as HTMLInputElement;
        const val = target.value.toUpperCase().replace(/[^A-Z]/g, '');
        if (val.length <= 12) word = val;
        generatedLink = null;
        error = null;
        isCopied = false;

        validateCurrentWord();
    }

    async function validateCurrentWord() {
        if (word.length < 4 || word.length > 12) {
            isValidWord = null;
            return;
        }

        const requestId = ++validationRequestId;
        const currentWord = word;
        const module = await getWordProcessingModule();
        const valid = await module.isValidGuess(currentWord, currentWord.length);

        if (requestId === validationRequestId && word === currentWord) {
            isValidWord = valid;
        }
    }

    async function generateRandomWord() {
        // More heavily weight 5-7 letter words to match typical difficulty
        const lengths = [4, 5, 5, 6, 6, 7, 8];
        const rt = lengths[Math.floor(Math.random() * lengths.length)];
        const module = await getWordProcessingModule();
        const rd = await module.getRandomWord(rt);
        if (rd) {
            word = rd;
            isValidWord = true;
            generatedLink = null;
            error = null;
            isCopied = false;
        }
    }

    function nativeShare() {
        if (navigator.share && generatedLink) {
            navigator.share({
                title: 'Custom Wordle Puzzle',
                text: 'I created a custom Wordle puzzle for you! Can you guess my secret word?',
                url: generatedLink
            }).catch(() => {});
        }
    }

    async function generateLink() {
        if (word.length < 4 || word.length > 12) {
            error = 'Word must be between 4 and 12 letters long.';
            return;
        }
        isLoading = true;
        error = null;
        try {
            const module = await getWordProcessingModule();
            const valid = await module.isValidGuess(word, word.length);
            if (!valid) {
                error = `"${word}" is not in our dictionary. Please enter a real word.`;
                isLoading = false;
                return;
            }
            const encoded = encodeWord(word);
            const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
            let link = `${baseUrl}/${word.length}-letter-wordle?challenge=${encoded}`;
            if (customHint.trim()) {
                link += `&hint=${encodeURIComponent(customHint.trim())}`;
            }
            generatedLink = link;
        } catch {
            error = 'Failed to generate link. Please try again.';
        } finally {
            isLoading = false;
        }
    }

    function copyToClipboard() {
        if (generatedLink) {
            navigator.clipboard.writeText(generatedLink);
            isCopied = true;
            setTimeout(() => isCopied = false, 2000);
        }
    }

    function resetForm() {
        generatedLink = null;
        word = '';
        customHint = '';
        isValidWord = null;
    }
</script>

<svelte:head>
    <title>Create Custom Wordle - Free Wordle Generator | WordSolverX</title>
    <meta name="description" content="Create your own custom Wordle puzzle with any word from 4 to 12 letters, generate a private challenge link, add an optional hint, and share it instantly with friends." />
    <link rel="canonical" href="https://wordsolver.tech/create-custom-wordle" />
    <meta property="og:title" content="Create Custom Wordle - Free Wordle Generator | WordSolverX" />
    <meta property="og:description" content="Build a custom Wordle challenge, generate a shareable link, and send a private puzzle to your friends in seconds." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://wordsolver.tech/create-custom-wordle" />
    <meta property="og:site_name" content="WordSolverX" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Create Custom Wordle - Free Wordle Generator | WordSolverX" />
    <meta name="twitter:description" content="Create and share your own custom Wordle puzzles with optional hints and secure challenge links." />
    <meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
    {@html `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          name: 'Create Custom Wordle',
          description: 'Custom Wordle generator for building private shareable puzzle links.',
          url: 'https://wordsolver.tech/create-custom-wordle'
        },
        {
          '@type': 'WebApplication',
          name: 'Create Custom Wordle',
          description: 'Generate a custom Wordle puzzle from any supported word length.',
          applicationCategory: 'Game',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
        }
      ]
    })}</script>`}
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-blue-900 to-gray-900 pt-16 pb-20">
        <div class="absolute inset-0">
            <div class="absolute top-0 right-1/4 w-[350px] h-[350px] rounded-full bg-indigo-500/15 blur-[120px]"></div>
            <div class="absolute bottom-0 left-1/4 w-[250px] h-[250px] rounded-full bg-blue-500/15 blur-[100px]"></div>
            <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 24px 24px;"></div>
        </div>
        <div class="relative z-10 max-w-3xl mx-auto px-4 text-center">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-6">
                <span class="text-sm font-medium text-indigo-300">Free Wordle Generator</span>
            </div>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
                Create a
                <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">Custom Wordle</span>
            </h1>
            <p class="max-w-xl mx-auto text-lg text-gray-300">
                Pick any word, generate a unique link, and challenge your friends to guess it in 6 tries!
            </p>
        </div>
    </section>

    <!-- Creator Box -->
    <section class="max-w-lg mx-auto px-4 -mt-8 relative z-20">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white text-center mb-1">Enter Your Secret Word</h2>
            <p class="text-gray-500 dark:text-gray-400 text-sm text-center mb-6">4 to 12 letters. Must be a valid English word.</p>

            <div class="relative mb-3">
                <input
                    type="text"
                    value={word}
                    oninput={handleWordChange}
                    placeholder="TYPE YOUR WORD"
                    class="w-full text-center text-2xl sm:text-3xl font-bold tracking-widest uppercase py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none bg-transparent text-gray-900 dark:text-white transition-all placeholder:text-gray-300 dark:placeholder:text-gray-700 {word.length >= 4 && isValidWord === false ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''}"
                />
                <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {#if isValidWord !== null}
                        <span class="text-xl" title={isValidWord ? "Valid dictionary word" : "Not in dictionary"}>
                            {isValidWord ? '✅' : '❌'}
                        </span>
                    {/if}
                    {#if word.length > 0}
                        <span class="text-sm font-semibold {word.length >= 4 && isValidWord === false ? 'text-red-500' : 'text-indigo-500'}">{word.length}</span>
                    {/if}
                </div>
            </div>

            <div class="flex items-center justify-between mb-6">
                <button onclick={generateRandomWord} class="text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1">
                    🎲 Random Word
                </button>
            </div>

            <div class="mb-6 text-left">
                <label for="hint-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ">
                    Custom Hint (Optional)
                </label>
                <input
                    id="hint-input"
                    type="text"
                    bind:value={customHint}
                    placeholder="e.g. A colorful bird"
                    class="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white transition-all placeholder:text-gray-400"
                />
            </div>

            {#if error}
                <div class="mb-5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2.5 rounded-lg text-sm font-medium">
                    {error}
                </div>
            {/if}

            {#if !generatedLink}
                <button
                    onclick={generateLink}
                    disabled={word.length < 4 || isLoading}
                    class="w-full py-4 rounded-xl font-bold text-lg text-white transition-all {word.length >= 4 && !isLoading ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 active:scale-[0.98]' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'}"
                >
                    {isLoading ? 'Generating...' : 'Generate Challenge Link'}
                </button>
            {:else}
                <div class="space-y-4">
                    <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5 text-center">
                        <p class="text-green-700 dark:text-green-400 font-bold text-lg mb-3">🎉 Link Generated!</p>
                        
                        <div class="flex justify-center mb-5">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(generatedLink)}`} width="128" height="128" loading="lazy" alt="QR Code" class="w-32 h-32 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white" />
                        </div>

                        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400 break-all font-mono mb-4 text-left">
                            {generatedLink}
                        </div>

                        <div class="grid {canWebShare ? 'grid-cols-2' : 'grid-cols-1'} gap-3">
                            <button
                                onclick={copyToClipboard}
                                class="w-full py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 {isCopied ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}"
                            >
                                {#if isCopied}
                                    <CheckIcon class="w-5 h-5" />
                                {:else}
                                    <ClipboardIcon class="w-5 h-5" />
                                {/if}
                                {isCopied ? 'Copied!' : 'Copy'}
                            </button>
                            {#if canWebShare}
                                <button
                                    onclick={nativeShare}
                                    class="w-full py-2.5 rounded-lg font-bold text-sm transition-colors bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                                    Share
                                </button>
                            {/if}
                        </div>
                    </div>
                    <button onclick={resetForm} class="w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium py-2">
                        Create Another Puzzle
                    </button>
                </div>
            {/if}
        </div>
    </section>

    <!-- How It Works -->
    <section class="max-w-5xl mx-auto px-4 py-14">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">How It Works</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
                <div class="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mx-auto mb-4 text-2xl">&#9997;&#65039;</div>
                <h3 class="font-bold text-gray-900 dark:text-white mb-2">1. Enter a Word</h3>
                <p class="text-gray-500 dark:text-gray-400 text-sm">Type any real English word between 4 and 12 letters.</p>
            </div>
            <div class="text-center">
                <div class="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto mb-4 text-2xl">&#128279;</div>
                <h3 class="font-bold text-gray-900 dark:text-white mb-2">2. Get Your Link</h3>
                <p class="text-gray-500 dark:text-gray-400 text-sm">We encode the word securely and generate a shareable URL.</p>
            </div>
            <div class="text-center">
                <div class="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mx-auto mb-4 text-2xl">&#127919;</div>
                <h3 class="font-bold text-gray-900 dark:text-white mb-2">3. Challenge Friends</h3>
                <p class="text-gray-500 dark:text-gray-400 text-sm">Share the link and watch them try to guess your word!</p>
            </div>
        </div>
    </section>

    <!-- About -->
    <section class="bg-white dark:bg-gray-800/50 border-y border-gray-200 dark:border-gray-700/50 py-14">
        <div class="max-w-4xl mx-auto px-4 prose prose-lg dark:prose-invert max-w-none">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">About the Custom Wordle Creator</h2>
            <p class="text-gray-600 dark:text-gray-300">
                The Custom Wordle Creator from WordSolverX lets you go beyond the daily puzzle. Instead of waiting for the official Wordle to reset, you can create your own word puzzle with <strong>any word</strong> from our dictionary. It works with words from 4 to 12 letters, giving you complete control over the difficulty.
            </p>
            <p class="text-gray-600 dark:text-gray-300">
                The word is securely encoded in the URL using a cipher, so your friends cannot cheat by inspecting the link. When they open it, they'll see a standard Wordle game interface and get 6 guesses to find your word. It's perfect for game nights, classroom activities, or just having fun with friends online.
            </p>
            <p class="text-gray-600 dark:text-gray-300">
                Want to play more puzzles yourself? Check out <a href="/multidle" class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Multidle</a> for daily and unlimited Wordle in all word lengths, or use our <a href="/wordle-solver" class="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Wordle Solver</a> when you're stuck.
            </p>
        </div>
    </section>

    <!-- FAQs -->
    <section class="max-w-3xl mx-auto px-4 py-14">
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
    </section>
</div>
