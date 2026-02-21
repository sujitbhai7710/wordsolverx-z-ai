<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Modal from './Modal.svelte';
    import type { Stats, GameStatus, GameMode } from '$lib/wordle/types';
    import ShareIcon from '$lib/components/icons/ShareIcon.svelte';
    import TrophyIcon from '$lib/components/icons/TrophyIcon.svelte';
    import ArrowPathIcon from '$lib/components/icons/ArrowPathIcon.svelte';
    import FireIcon from '$lib/components/icons/FireIcon.svelte';
    import LinkIcon from '$lib/components/icons/LinkIcon.svelte';
    import { encodeWord } from '$lib/wordle/challengeUtils';

    let { 
        isOpen = false, 
        onClose, 
        stats, 
        gameStatus, 
        shareTextGenerator, 
        wordLength = 5, 
        maxGuesses = 6,
        lastGameGuesses = null,
        gameMode = 'daily',
        gameNumber = null,
        colorblindMode = false,
        isChallenge = false,
        solution = ''
    } = $props<{
        isOpen: boolean;
        onClose: () => void;
        stats: Stats;
        gameStatus: GameStatus;
        shareTextGenerator: () => string;
        wordLength: number;
        maxGuesses: number;
        lastGameGuesses: number | null;
        gameMode: GameMode;
        gameNumber: number | null;
        colorblindMode: boolean;
        isChallenge?: boolean;
        solution?: string;
    }>();

    let timeLeft = $state('');
    let showShareData = $state(false);
    let challengeLinkCopied = $state(false);
    let timer: ReturnType<typeof setInterval> | null = null;

    const gamesPlayed = $derived(stats.gamesPlayed || 0);
    const winPercentage = $derived(gamesPlayed > 0 ? Math.round((stats.gamesWon / gamesPlayed) * 100) : 0);
    const isWin = $derived(gameStatus === 'WIN');
    const isFail = $derived(gameStatus === 'FAIL');
    const isGameOver = $derived(isWin || isFail);

    const guessDistribution = $derived(
        Array.from({ length: maxGuesses }, (_, i) => i + 1).map(num => ({
            guessCount: num,
            count: (stats.guessDistribution && stats.guessDistribution[num as keyof typeof stats.guessDistribution]) || 0
        }))
    );
    const maxDistributionCount = $derived(Math.max(...guessDistribution.map(d => d.count), 1));

    function calculateTimeLeft(): string {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setHours(24, 0, 0, 0);
        const diff = tomorrow.getTime() - now.getTime();

        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);

        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    onMount(() => {
        timeLeft = calculateTimeLeft();
        timer = setInterval(() => {
            timeLeft = calculateTimeLeft();
        }, 1000);
    });

    onDestroy(() => {
        if (timer) clearInterval(timer);
    });

    function handleShare() {
        showShareData = !showShareData;
    }

    function copyShareText() {
        const shareText = shareTextGenerator();
        navigator.clipboard.writeText(shareText).then(() => {
            const btn = document.getElementById('copy-results-btn');
            if (btn) {
                const originalText = btn.innerText;
                btn.innerText = 'Copied!';
                setTimeout(() => btn.innerText = originalText, 2000);
            }
        }).catch(err => console.error('Error copying:', err));
    }

    function handleChallengeShare() {
        if (!solution) return;
        const encoded = encodeWord(solution);
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const link = `${baseUrl}/${wordLength}-letter-wordle?challenge=${encoded}`;
        navigator.clipboard.writeText(link).then(() => {
            challengeLinkCopied = true;
            setTimeout(() => challengeLinkCopied = false, 2000);
        });
    }

    function getBarWidth(count: number, max: number): number {
        return max > 0 ? Math.max(8, Math.round((count / max) * 100)) : 8;
    }
</script>

<Modal {isOpen} {onClose} title="Statistics">
    {#snippet children()}
    <div class="p-1">
        <!-- Header Hero Section for Game Over -->
        {#if isWin}
            <div class="mb-6 text-center animate-fade-in-up">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
                    <TrophyIcon class="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Splendid!</h3>
            </div>
        {/if}

        {#if isFail}
            <div class="mb-6 text-center animate-fade-in-up">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
                    <span class="text-2xl">&#128532;</span>
                </div>
                <h3 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Next Time!</h3>
                {#if solution}
                    <div class="mt-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p class="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">The word was</p>
                        <p class="text-2xl font-black text-gray-900 dark:text-white tracking-widest uppercase">{solution}</p>
                    </div>
                {/if}
            </div>
        {/if}

        <!-- Key Stats Grid -->
        <div class="grid grid-cols-4 gap-2 mb-8">
            <div class="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                <ArrowPathIcon class="w-5 h-5 text-indigo-500 mb-1 opacity-80" />
                <span class="text-2xl font-black text-gray-900 dark:text-white">{gamesPlayed}</span>
                <span class="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wide">Played</span>
            </div>
            <div class="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                <TrophyIcon class="w-5 h-5 text-indigo-500 mb-1 opacity-80" />
                <span class="text-2xl font-black text-gray-900 dark:text-white">{winPercentage}</span>
                <span class="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wide">Win %</span>
            </div>
            <div class="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                <FireIcon class="w-5 h-5 text-indigo-500 mb-1 opacity-80" />
                <span class="text-2xl font-black text-gray-900 dark:text-white">{stats.currentStreak}</span>
                <span class="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wide">Streak</span>
            </div>
            <div class="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                <TrophyIcon class="w-5 h-5 text-indigo-500 mb-1 opacity-80" />
                <span class="text-2xl font-black text-gray-900 dark:text-white">{stats.maxStreak}</span>
                <span class="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wide">Max</span>
            </div>
        </div>

        <!-- Guess Distribution -->
        <div class="mb-8">
            <h4 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Guess Distribution</h4>
            <div class="pr-2">
                {#each guessDistribution as item}
                    <div class="flex items-center gap-2 mb-2 w-full">
                        <div class="w-4 text-xs font-bold text-gray-400">{item.guessCount}</div>
                        <div class="flex-grow bg-gray-100 dark:bg-gray-800 rounded-full h-5 overflow-hidden">
                            <div
                                class="h-full flex items-center justify-end px-2 text-xs font-bold text-white transition-all duration-700 ease-out {isWin && lastGameGuesses === item.guessCount ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : item.count > 0 ? 'bg-gray-500 dark:bg-gray-600' : 'bg-transparent'}"
                                style="width: {getBarWidth(item.count, maxDistributionCount)}%"
                            >
                                {#if item.count > 0}{item.count}{/if}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Footer / Actions -->
        {#if isGameOver || gameMode === 'daily'}
            <div class="pt-6 border-t border-gray-100 dark:border-gray-800">
                <div class="flex gap-4">
                    <div class="flex items-center justify-center border-r border-gray-100 dark:border-gray-800 pr-4 flex-1">
                        {#if gameMode === 'daily'}
                            <div class="flex flex-col items-center">
                                <span class="text-xs uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">Next Daily Puzzle</span>
                                <div class="text-2xl font-mono font-bold text-gray-800 dark:text-gray-200 tracking-wider">
                                    {timeLeft}
                                </div>
                            </div>
                        {:else}
                            <div class="text-center w-full">
                                {#if gameMode === 'infinity' && isWin}
                                    <button
                                        onclick={handleChallengeShare}
                                        class="w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 mb-2 {challengeLinkCopied ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:hover:bg-indigo-900/40'}"
                                    >
                                        <LinkIcon class="w-4 h-4" />
                                        {challengeLinkCopied ? 'Link Copied!' : 'Challenge Friend'}
                                    </button>
                                {:else}
                                    <span class="text-xs uppercase font-bold text-gray-400 dark:text-gray-500 mb-1 block">Play Again</span>
                                {/if}
                                <button onclick={onClose} class="block w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300">
                                    Close
                                </button>
                            </div>
                        {/if}
                    </div>
                    <div class="flex flex-col items-center justify-center pl-2 flex-1">
                        {#if isGameOver}
                            <button
                                onclick={handleShare}
                                class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95"
                            >
                                <ShareIcon class="w-5 h-5" />
                                <span>{showShareData ? 'Hide Share' : 'Share'}</span>
                            </button>
                        {:else}
                            <button
                                onclick={onClose}
                                class="w-full py-3 px-4 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                            >
                                Continue
                            </button>
                        {/if}
                    </div>
                </div>

                <!-- Expanded Share Area -->
                {#if isGameOver && showShareData}
                    <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                        <p class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Copy to share</p>
                        <textarea
                            class="w-full h-24 p-2 text-xs font-mono bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                            readonly
                            value={shareTextGenerator()}
                            onclick={(e) => (e.target as HTMLTextAreaElement).select()}
                        ></textarea>
                        <button
                            id="copy-results-btn"
                            onclick={copyShareText}
                            class="mt-2 w-full py-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-bold transition-all"
                        >
                            Copy Results
                        </button>
                    </div>
                {/if}
            </div>
        {/if}
    </div>
    {/snippet}
</Modal>
