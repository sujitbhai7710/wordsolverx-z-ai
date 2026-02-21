<script lang="ts">
    import Modal from './Modal.svelte';
    import PuzzlePieceIcon from '$lib/components/icons/PuzzlePieceIcon.svelte';
    import SunIcon from '$lib/components/icons/SunIcon.svelte';

    let { isOpen = false, onClose, wordLength = 5, maxGuesses = 6, colorblindMode = false } = $props<{
        isOpen: boolean;
        onClose: () => void;
        wordLength: number;
        maxGuesses: number;
        colorblindMode?: boolean;
    }>();
</script>

<Modal {isOpen} {onClose} title="">
    {#snippet children()}
    <div class="p-2">
        <div class="text-center mb-6">
            <div class="mx-auto w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mb-3">
                <PuzzlePieceIcon class="w-7 h-7 text-white" />
            </div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-1 tracking-tight">How To Play</h2>
            <p class="text-gray-500 dark:text-gray-400 font-medium text-sm">Guess the word in {maxGuesses} tries</p>
        </div>

        <ul class="space-y-4 mb-8">
            <li class="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                <span class="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs mt-0.5">1</span>
                <span>Each guess must be a valid <strong>{wordLength}-letter word</strong>.</span>
            </li>
            <li class="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                <span class="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs mt-0.5">2</span>
                <span>The color of the tiles will change to show how close your guess was to the word.</span>
            </li>
            <li class="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                <span class="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs mt-0.5">3</span>
                <span>Hit the enter button to submit your guess.</span>
            </li>
        </ul>

        <!-- Examples -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-100 dark:border-gray-700/50">
            <h3 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Examples</h3>

            <div class="space-y-4">
                <!-- Correct -->
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 flex items-center justify-center font-bold text-xl rounded-lg text-white shadow-sm {colorblindMode ? 'bg-orange-500' : 'bg-green-500'}">
                        W
                    </div>
                    <div>
                        <p class="text-sm font-bold text-gray-900 dark:text-white">Correct</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400"><strong>W</strong> is in the correct spot.</p>
                    </div>
                </div>

                <!-- Present -->
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 flex items-center justify-center font-bold text-xl rounded-lg text-white shadow-sm {colorblindMode ? 'bg-blue-400' : 'bg-yellow-500'}">
                        I
                    </div>
                    <div>
                        <p class="text-sm font-bold text-gray-900 dark:text-white">Present</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400"><strong>I</strong> is in the word but wrong spot.</p>
                    </div>
                </div>

                <!-- Absent -->
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 flex items-center justify-center font-bold text-xl rounded-lg bg-gray-500 text-white shadow-sm">
                        N
                    </div>
                    <div>
                        <p class="text-sm font-bold text-gray-900 dark:text-white">Absent</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400"><strong>N</strong> is not in the word.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-center pt-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-yellow-900/20 dark:to-orange-900/20 text-yellow-700 dark:text-yellow-400 text-xs font-semibold">
                <SunIcon class="w-4 h-4" />
                <span>New puzzles released daily at midnight!</span>
            </div>
        </div>
    </div>
    {/snippet}
</Modal>
