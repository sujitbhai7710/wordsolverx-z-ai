<script lang="ts">
    import Modal from './Modal.svelte';
    import type { Settings, GameMode } from '$lib/wordle/types';
    import { format } from 'date-fns';
    import MoonIcon from '$lib/components/icons/MoonIcon.svelte';
    import SunIcon from '$lib/components/icons/SunIcon.svelte';
    import EyeIcon from '$lib/components/icons/EyeIcon.svelte';
    import EyeSlashIcon from '$lib/components/icons/EyeSlashIcon.svelte';
    import FireIcon from '$lib/components/icons/FireIcon.svelte';
    import ClockIcon from '$lib/components/icons/ClockIcon.svelte';
    import CalendarIcon from '$lib/components/icons/CalendarIcon.svelte';
    import SparklesIcon from '$lib/components/icons/SparklesIcon.svelte';
    import TrashIcon from '$lib/components/icons/TrashIcon.svelte';
    import PencilSquareIcon from '$lib/components/icons/PencilSquareIcon.svelte';

    let {
        isOpen = false,
        onClose,
        settings,
        onSettingsChange,
        archiveDate = null,
        onArchiveDateChange,
        gameEpoch = null,
        onClearGameState
    } = $props<{
        isOpen: boolean;
        onClose: () => void;
        settings: Settings;
        onSettingsChange: (setting: keyof Settings, value: any) => void;
        archiveDate: Date | null;
        onArchiveDateChange: (date: Date | null) => void;
        gameEpoch: Date | null;
        onClearGameState: () => void;
    }>();

    function formatDateForInput(date: Date | null): string {
        if (!date) return '';
        return format(date, 'yyyy-MM-dd');
    }

    function handleDateChange(e: Event) {
        const target = e.target as HTMLInputElement;
        if (target.value) {
            const [y, m, d] = target.value.split('-').map(Number);
            onArchiveDateChange(new Date(y, m - 1, d));
        } else {
            onArchiveDateChange(null);
        }
    }

    function handleReset() {
        if (confirm('Are you sure you want to reset your progress for this puzzle?')) {
            onClearGameState();
            onClose();
        }
    }

    const wordLengths = [4, 5, 6, 7, 8, 9, 10, 11, 12];
</script>

<Modal {isOpen} {onClose} title="Game Settings">
    {#snippet children()}
    <div class="p-1">
        <!-- Visual Settings -->
        <div class="mb-6">
            <h3 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Appearance</h3>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4">
                <!-- Dark Mode Toggle -->
                <div class="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800">
                    <div class="flex items-center gap-3">
                        {#if settings.darkMode}
                            <MoonIcon class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        {:else}
                            <SunIcon class="w-5 h-5 text-gray-400" />
                        {/if}
                        <label for="darkMode" class="text-base font-medium text-gray-800 dark:text-gray-200">Dark Mode</label>
                    </div>
                    <div class="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                        <input
                            type="checkbox"
                            id="darkMode"
                            checked={settings.darkMode}
                            onchange={(e) => onSettingsChange('darkMode', (e.target as HTMLInputElement).checked)}
                            class="hidden"
                        />
                        <label
                            for="darkMode"
                            class="block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out {settings.darkMode ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}"
                        >
                            <span class="block h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out {settings.darkMode ? 'translate-x-6' : 'translate-x-0'}"></span>
                        </label>
                    </div>
                </div>

                <!-- High Contrast Toggle -->
                <div class="flex items-center justify-between py-4">
                    <div class="flex items-center gap-3">
                        {#if settings.colorblindMode}
                            <EyeIcon class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        {:else}
                            <EyeSlashIcon class="w-5 h-5 text-gray-400" />
                        {/if}
                        <label for="colorblindMode" class="text-base font-medium text-gray-800 dark:text-gray-200">High Contrast</label>
                    </div>
                    <div class="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                        <input
                            type="checkbox"
                            id="colorblindMode"
                            checked={settings.colorblindMode}
                            onchange={(e) => onSettingsChange('colorblindMode', (e.target as HTMLInputElement).checked)}
                            class="hidden"
                        />
                        <label
                            for="colorblindMode"
                            class="block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out {settings.colorblindMode ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}"
                        >
                            <span class="block h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out {settings.colorblindMode ? 'translate-x-6' : 'translate-x-0'}"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <!-- Gameplay Settings -->
        <div class="mb-6">
            <h3 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Gameplay</h3>
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4">
                <div class="flex items-center justify-between py-4">
                    <div class="flex items-center gap-3">
                        <FireIcon class="w-5 h-5 {settings.hardMode ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}" />
                        <label for="hardMode" class="text-base font-medium text-gray-800 dark:text-gray-200">Hard Mode</label>
                    </div>
                    <div class="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                        <input
                            type="checkbox"
                            id="hardMode"
                            checked={settings.hardMode}
                            onchange={(e) => onSettingsChange('hardMode', (e.target as HTMLInputElement).checked)}
                            class="hidden"
                        />
                        <label
                            for="hardMode"
                            class="block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out {settings.hardMode ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}"
                        >
                            <span class="block h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out {settings.hardMode ? 'translate-x-6' : 'translate-x-0'}"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <!-- Game Mode Selection -->
        <div class="mb-6">
            <h3 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Game Mode</h3>
            <div class="grid grid-cols-2 gap-3">
                <!-- Daily Mode -->
                <button
                    onclick={() => onSettingsChange('gameMode', 'daily')}
                    class="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all {settings.gameMode === 'daily' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'border-transparent bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                >
                    <ClockIcon class="w-6 h-6 mb-1" />
                    <span class="font-semibold text-sm">Daily</span>
                </button>

                <!-- Weekly Mode -->
                <button
                    onclick={() => onSettingsChange('gameMode', 'weekly')}
                    class="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all {settings.gameMode === 'weekly' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' : 'border-transparent bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                >
                    <CalendarIcon class="w-6 h-6 mb-1" />
                    <span class="font-semibold text-sm">Weekly</span>
                </button>

                <!-- Infinity Mode -->
                <button
                    onclick={() => onSettingsChange('gameMode', 'infinity')}
                    class="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all {settings.gameMode === 'infinity' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300' : 'border-transparent bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                >
                    <SparklesIcon class="w-6 h-6 mb-1" />
                    <span class="font-semibold text-sm">Infinity</span>
                </button>

                <!-- Archive Mode -->
                <button
                    onclick={() => onSettingsChange('gameMode', 'archive')}
                    class="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all {settings.gameMode === 'archive' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' : 'border-transparent bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                >
                    <CalendarIcon class="w-6 h-6 mb-1" />
                    <span class="font-semibold text-sm">Archive</span>
                </button>
            </div>
        </div>

        <!-- Archive Date Datepicker -->
        {#if settings.gameMode === 'archive'}
            <div class="mb-6 animate-fade-in-down">
                <div class="relative">
                    <input
                        type="date"
                        value={formatDateForInput(archiveDate)}
                        onchange={handleDateChange}
                        min={gameEpoch ? formatDateForInput(gameEpoch) : '2022-01-01'}
                        max={formatDateForInput(new Date())}
                        class="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    />
                </div>
            </div>
        {/if}

        <!-- Word Length -->
        <div class="mb-6">
            <h3 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Word Length</h3>
            <div class="grid grid-cols-4 gap-2">
                {#each wordLengths as len}
                    <a
                        href="/{len}-letter-wordle"
                        class="flex items-center justify-center py-2.5 rounded-lg font-bold text-sm transition-all bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:text-indigo-600 dark:hover:text-indigo-400"
                        onclick={onClose}
                    >
                        {len}
                    </a>
                {/each}
            </div>
        </div>

        <!-- Create Custom Wordle Link -->
        <div class="mb-6">
            <a href="/create-custom-wordle" class="group flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                <div class="flex flex-col">
                    <span class="font-bold text-lg">Create Your Own</span>
                    <span class="text-white/80 text-xs">Challenge friends with a secret word</span>
                </div>
                <PencilSquareIcon class="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </a>
        </div>

        <!-- Footer / Danger Zone -->
        <div class="mt-8 border-t border-gray-100 dark:border-gray-800 pt-6">
            <button
                onclick={handleReset}
                class="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 py-2 transition-colors text-sm font-medium"
            >
                <TrashIcon class="w-4 h-4" />
                Reset Current Puzzle
            </button>
            <p class="text-center text-xs text-gray-400 mt-4">
                Version 2.0.0 &bull; Premium Edition
            </p>
        </div>
    </div>
    {/snippet}
</Modal>
