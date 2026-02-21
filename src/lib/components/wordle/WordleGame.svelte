<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores';
    import HelpModal from './modals/HelpModal.svelte';
    import StatsModal from './modals/StatsModal.svelte';
    import SettingsModal from './modals/SettingsModal.svelte';
    import type { GameState, GuessRow, GameStatus, Stats, Settings, LetterState, GameMode } from '$lib/wordle/types';
    import {
        REVEAL_TIME_MS,
        NOTIFICATION_TIME_MS,
        DEFAULT_STATS,
        DEFAULT_SETTINGS,
    } from '$lib/wordle/config';
    import {
        evaluateGuess,
        loadGameState,
        saveGameState,
        initializeNewGameState,
        getLetterStatesFromGuesses,
        clearGameState,
        loadStats,
        updateStatsOnGameEnd,
        loadSettings,
        saveSettings,
        getGameEpoch,
        getGameNumber
    } from '$lib/wordle/helpers';
    import { getSolution, isValidGuess as isValidGuessForLength } from '$lib/wordle/words_processing';
    import { startOfWeek, format, isValid as isValidDate } from 'date-fns';
    import { decodeWord, encodeWord } from '$lib/wordle/challengeUtils';
    import ChartBarIcon from '$lib/components/icons/ChartBarIcon.svelte';
    import Cog6ToothIcon from '$lib/components/icons/Cog6ToothIcon.svelte';
    import XMarkIcon from '$lib/components/icons/XMarkIcon.svelte';
    import LinkIcon from '$lib/components/icons/LinkIcon.svelte';
    import ClipboardDocumentIcon from '$lib/components/icons/ClipboardDocumentIcon.svelte';
    
    // New atomic components
    import GameBoard from './GameBoard.svelte';
    import Keyboard from './Keyboard.svelte';
    import WordleHints from '$lib/components/WordleHints.svelte';
    import type { LetterEvaluation } from './GameBoard.types';
    import type { LetterState as KeyboardLetterState } from './Keyboard.types';

    let { wordLength = 5, maxGuesses = 6, customTitle = '' } = $props<{
        wordLength: number;
        maxGuesses: number;
        customTitle?: string;
    }>();

    // State
    let gameState = $state<GameState | null>(null);
    let currentGuess = $state<string[]>([]);
    let isRevealing = $state(false);
    let shakeRowIndex = $state<number | null>(null);
    let toastMessage = $state<string | null>(null);
    let isHelpModalOpen = $state(false);
    let isStatsModalOpen = $state(false);
    let isSettingsModalOpen = $state(false);
    let isChallengeModalOpen = $state(false);
    let isHintModalOpen = $state(false);
    let stats = $state<Stats>(DEFAULT_STATS);
    let settings = $state<Settings>(DEFAULT_SETTINGS);
    let lastGuessCountForStats = $state<number | null>(null);
    let archiveDate = $state<Date | null>(null);
    let gameEpoch = $state<Date | null>(null);
    let currentGameNumber = $state<number | null>(null);
    let challengeLinkCopied = $state(false);
    let challengeParam = $state<string | null>(null);
    let challengeHint = $state<string | null>(null);

    const KeyboardLayout = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
    ];

    // Transformed state for GameBoard
    const boardGuesses = $derived(
        gameState ? gameState.board.slice(0, gameState.currentRowIndex).map(row => row.guess.join('')) : []
    );

    const boardEvaluations = $derived(() => {
        if (!gameState) return [];
        return gameState.board.slice(0, gameState.currentRowIndex).map(row => {
            return row.states.map((state, i) => ({
                letter: row.guess[i],
                state: state as 'correct' | 'present' | 'absent'
            }));
        }) as LetterEvaluation[][];
    });

    const keyboardLetterStates = $derived(() => {
        const states = new Map<string, KeyboardLetterState>();
        // Get raw letter states (correct/present/absent) from helper
        const computed = getLetterStatesFromGuesses(
            gameState ? gameState.board.slice(0, gameState.currentRowIndex) : [],
            gameState?.solution || '',
            wordLength
        );
        
        Object.entries(computed).forEach(([letter, state]) => {
            // Map 'tbd' or 'empty' to 'unused' for keyboard
            const kState = (state === 'correct' || state === 'present' || state === 'absent') 
                ? state 
                : 'unused';
            states.set(letter.toUpperCase(), kState as KeyboardLetterState);
        });
        
        return states;
    });

    const gameMode = $derived(settings.gameMode);
    const gameWon = $derived(gameState?.gameStatus === 'WIN');
    const gameLost = $derived(gameState?.gameStatus === 'FAIL');

    const validateHardModeInternal = (guessChars: string[], board: GuessRow[], currentRowIndex: number, solution: string, activeHardMode: boolean, wLength: number): { valid: boolean; message?: string } => {
        if (!activeHardMode || currentRowIndex === 0) return { valid: true };
        const previousSubmittedGuesses = board.slice(0, currentRowIndex).filter(row => row.guess.some(g => g !== ''));
        if (previousSubmittedGuesses.length === 0) return { valid: true };
        const letterKnowledge = getLetterStatesFromGuesses(previousSubmittedGuesses, solution, wLength);
        for (let i = 0; i < wLength; i++) {
            let requiredChar: string | null = null;
            for (const prevGuessRow of previousSubmittedGuesses) {
                if (prevGuessRow.states[i] === 'correct') { requiredChar = prevGuessRow.guess[i]; break; }
            }
            if (requiredChar && guessChars[i] && guessChars[i].toUpperCase() !== requiredChar.toUpperCase()) {
                return { valid: false, message: `Letter ${requiredChar.toUpperCase()} must be in position ${i + 1}` };
            }
        }
        const presentLetters = Object.entries(letterKnowledge).filter(([, state]) => state === 'present').map(([letter]) => letter.toUpperCase());
        for (const pLetter of presentLetters) {
            let presentLetterUsed = false;
            for (let i = 0; i < wLength; i++) {
                if (guessChars[i] && guessChars[i].toUpperCase() === pLetter) {
                    let isPreviouslyCorrectSpotForThisLetter = false;
                    for (const prevGuessRow of previousSubmittedGuesses) {
                        if (prevGuessRow.guess[i] === pLetter && prevGuessRow.states[i] === 'correct') { isPreviouslyCorrectSpotForThisLetter = true; break; }
                    }
                    if (evaluateGuess(guessChars.join(''), solution, wLength)[i] === 'correct' || !isPreviouslyCorrectSpotForThisLetter) { presentLetterUsed = true; break; }
                }
            }
            if (!presentLetterUsed) return { valid: false, message: `Guess must contain ${pLetter}` };
        }
        return { valid: true };
    };

    function showToast(message: string, duration: number = NOTIFICATION_TIME_MS) {
        toastMessage = message;
        setTimeout(() => toastMessage = null, duration);
    }

    function handleSettingsChange(setting: keyof Settings, value: any) {
        settings = { ...settings, [setting]: value };
        saveSettings(settings);
        if (setting === 'gameMode') {
            if (value === 'archive' && !archiveDate) {
                const t = new Date();
                t.setHours(0, 0, 0, 0);
                archiveDate = t;
            } else if (value !== 'archive') {
                archiveDate = null;
            }
        }
        if (setting === 'darkMode') {
            if (value) document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
        }
    }

    const isInputDisabled = $derived(
        !gameState || gameState.gameStatus !== 'IN_PROGRESS' || isRevealing || isHelpModalOpen || isStatsModalOpen || isSettingsModalOpen
    );

    function handleChar(char: string) {
        if (isInputDisabled) return;
        if (currentGuess.length < wordLength) {
            currentGuess = [...currentGuess, char.toUpperCase()];
        }
    }

    function handleDelete() {
        if (isInputDisabled) return;
        currentGuess = currentGuess.slice(0, -1);
    }

    async function handleEnter() {
        if (isInputDisabled || !gameState) return;
        const guessToEvaluate = [...currentGuess];
        const guessStr = guessToEvaluate.join('');

        if (guessStr.length !== wordLength) {
            shakeRowIndex = gameState.currentRowIndex;
            showToast('Not enough letters');
            setTimeout(() => shakeRowIndex = null, 600);
            return;
        }

        const isDuplicate = gameState.board.some(row => row.guess.join('') === guessStr);
        if (isDuplicate) {
            shakeRowIndex = gameState.currentRowIndex;
            showToast('Already guessed');
            setTimeout(() => shakeRowIndex = null, 600);
            return;
        }

        const hardModeValidation = validateHardModeInternal(guessToEvaluate, gameState.board, gameState.currentRowIndex, gameState.solution, settings.hardMode, wordLength);
        if (!hardModeValidation.valid) {
            shakeRowIndex = gameState.currentRowIndex;
            showToast(hardModeValidation.message || 'Hard mode violation', 2500);
            setTimeout(() => shakeRowIndex = null, 600);
            return;
        }

        const isValid = await isValidGuessForLength(guessStr, wordLength);
        if (!isValid) {
            shakeRowIndex = gameState.currentRowIndex;
            showToast('Not in word list');
            setTimeout(() => shakeRowIndex = null, 600);
            return;
        }

        isRevealing = true;
        const evaluation = evaluateGuess(guessStr, gameState.solution, wordLength);
        const newBoard = [...gameState.board];
        const guessCount = gameState.currentRowIndex + 1;
        newBoard[gameState.currentRowIndex] = { guess: guessToEvaluate, states: evaluation };

        let statusAfterGuess: GameStatus = 'IN_PROGRESS';
        if (guessStr === gameState.solution) statusAfterGuess = 'WIN';
        else if (guessCount === maxGuesses) statusAfterGuess = 'FAIL';

        const updatedGameState: GameState = {
            ...gameState,
            board: newBoard,
            evaluations: [...gameState.evaluations.slice(0, gameState.currentRowIndex), evaluation],
            currentRowIndex: guessCount,
            gameStatus: statusAfterGuess,
            lastPlayedTs: Date.now(),
            lastCompletedTs: (statusAfterGuess === 'WIN' || statusAfterGuess === 'FAIL') ? Date.now() : gameState.lastCompletedTs
        };

        gameState = updatedGameState;
        currentGuess = [];
        saveGameState(updatedGameState, wordLength, settings.gameMode, settings.gameMode === 'infinity' ? null : updatedGameState.solutionDate);
        lastGuessCountForStats = guessCount;

        if (statusAfterGuess === 'WIN' || statusAfterGuess === 'FAIL') {
            const newStats = updateStatsOnGameEnd(stats, statusAfterGuess, guessCount, wordLength, settings.gameMode, maxGuesses);
            stats = newStats;
        }

        setTimeout(() => {
            isRevealing = false;
            if (updatedGameState.gameStatus === 'WIN') {
                showToast('Congratulations!', 3000);
                isStatsModalOpen = true;
            } else if (updatedGameState.gameStatus === 'FAIL') {
                showToast(`The word was ${updatedGameState.solution}`, 5000);
                isStatsModalOpen = true;
            }
        }, REVEAL_TIME_MS * wordLength * 0.6);
    }

    function onClearGameState() {
        if (gameState) {
            clearGameState(wordLength, settings.gameMode, settings.gameMode === 'infinity' ? null : (settings.gameMode === 'daily' ? new Date().toDateString() : (settings.gameMode === 'weekly' ? format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd') : archiveDate)));
            initializeGame();
            lastGuessCountForStats = null;
        }
    }

    function handleArchiveDateChange(date: Date | null) {
        archiveDate = date;
    }

    function initializeRegularGame(loadedSettings: Settings, gameWordLength: number) {
        const currentStats = loadStats(gameWordLength, loadedSettings.gameMode);
        stats = currentStats;
        const today = new Date();
        let solutionToInitialize: string;
        let gameStateToSet: GameState | null = null;
        let gameDateForSolution = today;
        let effectiveDateStringForState = today.toDateString();

        if (challengeParam) {
            const decoded = decodeWord(challengeParam);
            if (decoded && decoded.length === gameWordLength) {
                const challengeModeSettings: Settings = { ...loadedSettings, gameMode: 'challenge' };
                settings = challengeModeSettings;
                solutionToInitialize = decoded.toUpperCase();
                const challengeKey = `challenge-${challengeParam}`;
                gameStateToSet = loadGameState(gameWordLength, 'challenge', challengeKey);

                if (!gameStateToSet || gameStateToSet.solution !== solutionToInitialize) {
                    if (gameStateToSet) clearGameState(gameWordLength, 'challenge', challengeKey);
                    gameStateToSet = initializeNewGameState(solutionToInitialize, gameWordLength);
                    gameStateToSet.solutionDate = challengeKey;
                }

                if (gameStateToSet) {
                    gameState = gameStateToSet;
                    saveGameState(gameStateToSet, gameWordLength, 'challenge', challengeKey);
                    currentGuess = [];
                    if (gameStateToSet.gameStatus !== 'IN_PROGRESS') lastGuessCountForStats = gameStateToSet.currentRowIndex;
                }
                return;
            }
        }

        switch (loadedSettings.gameMode) {
            case 'infinity':
                gameDateForSolution = new Date(Math.random() * Date.now());
                solutionToInitialize = getSolution(gameDateForSolution, gameWordLength, 'infinity');
                if (solutionToInitialize === 'ERROR') { showToast('Error', 5000); gameState = null; return; }
                gameStateToSet = initializeNewGameState(solutionToInitialize, gameWordLength);
                gameStateToSet.solutionDate = gameDateForSolution.toISOString();
                break;
            case 'archive':
                if (archiveDate && isValidDate(archiveDate)) {
                    gameDateForSolution = archiveDate;
                    effectiveDateStringForState = archiveDate.toDateString();
                    solutionToInitialize = getSolution(gameDateForSolution, gameWordLength, 'archive');
                    if (solutionToInitialize === 'ERROR') { showToast('Error', 5000); gameState = null; return; }
                    gameStateToSet = loadGameState(gameWordLength, 'archive', effectiveDateStringForState);
                    if (!gameStateToSet || gameStateToSet.solution !== solutionToInitialize) {
                        if (gameStateToSet) clearGameState(gameWordLength, 'archive', effectiveDateStringForState);
                        gameStateToSet = initializeNewGameState(solutionToInitialize, gameWordLength);
                        gameStateToSet.solutionDate = effectiveDateStringForState;
                    }
                } else {
                    showToast("Select date", 5000);
                    gameState = null;
                    return;
                }
                break;
            case 'weekly':
                gameDateForSolution = startOfWeek(today, { weekStartsOn: 1 });
                effectiveDateStringForState = format(gameDateForSolution, 'yyyy-MM-dd');
                solutionToInitialize = getSolution(gameDateForSolution, gameWordLength, 'weekly');
                if (solutionToInitialize === 'ERROR') { showToast('Error', 5000); gameState = null; return; }
                gameStateToSet = loadGameState(gameWordLength, 'weekly', effectiveDateStringForState);
                if (!gameStateToSet || gameStateToSet.solution !== solutionToInitialize) {
                    if (gameStateToSet) clearGameState(gameWordLength, 'weekly', effectiveDateStringForState);
                    gameStateToSet = initializeNewGameState(solutionToInitialize, gameWordLength);
                    gameStateToSet.solutionDate = effectiveDateStringForState;
                }
                break;
            default:
                solutionToInitialize = getSolution(today, gameWordLength, 'daily');
                if (solutionToInitialize === 'ERROR') { showToast('Error', 5000); gameState = null; return; }
                gameStateToSet = loadGameState(gameWordLength, 'daily', effectiveDateStringForState);
                if (!gameStateToSet || gameStateToSet.solution !== solutionToInitialize) {
                    if (gameStateToSet) clearGameState(gameWordLength, 'daily', effectiveDateStringForState);
                    gameStateToSet = initializeNewGameState(solutionToInitialize, gameWordLength);
                    gameStateToSet.solutionDate = effectiveDateStringForState;
                }
                break;
        }

        if (gameStateToSet) {
            gameState = gameStateToSet;
            saveGameState(gameStateToSet, gameWordLength, loadedSettings.gameMode, loadedSettings.gameMode === 'infinity' ? null : effectiveDateStringForState);
            currentGuess = [];
            if (gameStateToSet.gameStatus !== 'IN_PROGRESS') lastGuessCountForStats = gameStateToSet.currentRowIndex;
        }
    }

    function initializeGame() {
        const loadedSettings = loadSettings();
        settings = loadedSettings;
        initializeRegularGame(loadedSettings, wordLength);
    }

    function copyChallengeLink() {
        if (!gameState?.solution) return;
        const encoded = encodeWord(gameState.solution);
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const link = `${baseUrl}/${wordLength}-letter-wordle?challenge=${encoded}`;
        navigator.clipboard.writeText(link).then(() => {
            challengeLinkCopied = true;
            setTimeout(() => challengeLinkCopied = false, 2000);
        });
    }

    function generateShareText(): string {
        return `Wordle ${wordLength}-Letter`;
    }

    onMount(() => {
        // Get challenge param from URL
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            challengeParam = urlParams.get('challenge');
            const urlHint = urlParams.get('hint');
            if (urlHint) {
                challengeHint = urlHint;
            }
        }

        const s = loadSettings();
        settings = s;
        if (s.gameMode === 'archive' && !archiveDate) {
            const t = new Date();
            t.setHours(0, 0, 0, 0);
            archiveDate = t;
        }

        if (s.darkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');

        gameEpoch = getGameEpoch();
        if (s.gameMode === 'daily' || s.gameMode === 'weekly') {
            currentGameNumber = getGameNumber(new Date(), s.gameMode);
        }

        initializeGame();
    });

    onDestroy(() => {
    });

    // Reactive effects
    $effect(() => {
        if (settings.gameMode === 'daily' || settings.gameMode === 'weekly') {
            currentGameNumber = getGameNumber(new Date(), settings.gameMode);
        }
    });

    // Get game mode title and subtitle
    const gameModeTitle = $derived(() => {
        if (settings.gameMode === 'daily') return `DAILY PUZZLE #${currentGameNumber || ''}`;
        if (settings.gameMode === 'weekly') return `WEEKLY PUZZLE ${currentGameNumber || ''}`;
        if (settings.gameMode === 'archive') return archiveDate ? `ARCHIVE PUZZLE #${getGameNumber(archiveDate, 'daily')}` : 'ARCHIVE PUZZLE';
        if (settings.gameMode === 'infinity') return "INFINITY MODE";
        if (settings.gameMode === 'challenge') return "CUSTOM CHALLENGE";
        return '';
    });

    const gameModeSubtitle = $derived(() => {
        if (settings.gameMode === 'daily') return format(new Date(), 'MMM d, yyyy');
        if (settings.gameMode === 'weekly') return format(new Date(), 'MMM d, yyyy');
        if (settings.gameMode === 'archive') return archiveDate ? format(archiveDate, 'MMM d, yyyy') : '';
        if (settings.gameMode === 'infinity') return "UNLIMITED PLAY";
        if (settings.gameMode === 'challenge') return "CAN YOU SOLVE IT?";
        return '';
    });
</script>

<svelte:head>
    <title>{customTitle || `${wordLength} Letter Wordle`} | WordSolverX</title>
</svelte:head>

{#if !gameState}
    <div class="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent shadow-lg"></div>
            <p class="mt-4 text-slate-500 dark:text-slate-400 font-medium tracking-wide">Loading puzzle...</p>
        </div>
    </div>
{:else}
    <div class="h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 dark:from-slate-900 dark:via-slate-800/90 dark:to-slate-900 flex flex-col overflow-hidden transition-colors duration-500">
        <!-- Header -->
        <header class="flex items-center justify-between px-4 py-2 border-b border-indigo-100/50 dark:border-white/5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30 shadow-sm h-14 shrink-0 transition-colors duration-300">
            <div class="flex items-center space-x-2">
                <button onclick={() => isHelpModalOpen = true} class="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="How to play">
                    <span class="flex items-center justify-center w-5 h-5 border-2 border-gray-600 dark:border-gray-300 rounded-full font-bold text-xs text-gray-600 dark:text-gray-300">?</span>
                </button>
                <button onclick={() => isStatsModalOpen = true} class="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ChartBarIcon class="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
            </div>

            <div class="flex flex-col items-center">
                <h1 class="text-xl md:text-2xl font-black tracking-tight text-slate-800 dark:text-white font-sans drop-shadow-sm">
                    {#if customTitle}
                        {customTitle}
                    {:else}
                        Multidle <span class="text-indigo-500 dark:text-indigo-400 ml-1 text-base align-top font-bold">({wordLength})</span>
                    {/if}
                </h1>
            </div>

            <div class="flex items-center space-x-2">
                {#if !gameWon && !gameLost && gameState?.currentRowIndex > 0}
                    <button 
                        onclick={() => isHintModalOpen = true} 
                        class="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 active:scale-95 text-amber-500 hover:text-amber-600 dark:hover:text-amber-400"
                        title="Stuck? Get a Hint"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 drop-shadow-sm">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.82 1.508-2.316a7.5 7.5 0 10-7.516 0c.85.496 1.508 1.333 1.508 2.316V18" />
                        </svg>
                    </button>
                {/if}
                <button onclick={() => isSettingsModalOpen = true} class="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 active:scale-95">
                    <Cog6ToothIcon class="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </button>
            </div>
        </header>

        <!-- SubHeader -->
        <div class="text-center py-2 shrink-0 relative z-20">
            <div class="inline-flex flex-col items-center justify-center relative">
                <div class="flex items-center gap-2">
                    <span class="text-xs md:text-sm font-bold tracking-widest text-slate-800 dark:text-slate-200 uppercase drop-shadow-sm">
                        {gameModeTitle()}
                    </span>
                    {#if settings.gameMode === 'infinity'}
                        <button
                            onclick={() => isChallengeModalOpen = true}
                            class="text-slate-400 hover:text-indigo-500 dark:text-slate-500 dark:hover:text-indigo-400 transition-colors duration-200"
                            title="Share this puzzle"
                        >
                            <LinkIcon class="w-4 h-4" />
                        </button>
                    {/if}
                </div>
                <span class="text-[10px] md:text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase">
                    {gameModeSubtitle()}
                </span>
                {#if challengeHint}
                    <div class="mt-1 flex items-center gap-1.5 text-[11px] md:text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-white/50 backdrop-blur-sm dark:bg-indigo-900/30 px-3 py-1 rounded-full border border-indigo-100/50 dark:border-indigo-500/30 max-w-xs md:max-w-sm truncate mx-auto shadow-sm">
                        <span aria-hidden="true">💡</span>
                        <span class="truncate" title={challengeHint}>"{challengeHint}"</span>
                    </div>
                {/if}
            </div>

            <!-- Challenge Link Modal/Popup -->
            {#if isChallengeModalOpen && settings.gameMode === 'infinity'}
                <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-4 animate-fade-in-up">
                    <div class="flex justify-between items-center mb-3">
                        <h4 class="text-sm font-bold text-gray-900 dark:text-white">Challenge a Friend</h4>
                        <button onclick={() => isChallengeModalOpen = false} class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <XMarkIcon class="w-4 h-4" />
                        </button>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-3 text-left">
                        Share this link to let a friend play this exact puzzle!
                    </p>
                    <div class="flex items-center bg-gray-100 dark:bg-gray-900 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                        <div class="flex-1 overflow-hidden">
                            <p class="text-xs text-gray-600 dark:text-gray-300 truncate font-mono select-all">
                                {`${typeof window !== 'undefined' ? window.location.origin : ''}/${wordLength}-letter-wordle?challenge=${gameState?.solution ? encodeWord(gameState.solution) : ''}`}
                            </p>
                        </div>
                        <button
                            onclick={copyChallengeLink}
                            class="ml-2 p-1.5 rounded-md transition-all {challengeLinkCopied ? 'bg-green-100 text-green-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-indigo-600'}"
                        >
                            {#if challengeLinkCopied}
                                <span class="text-xs font-bold">Copied</span>
                            {:else}
                                <ClipboardDocumentIcon class="w-4 h-4" />
                            {/if}
                        </button>
                    </div>
                </div>
                <button class="fixed inset-0 z-40 bg-transparent" onclick={() => isChallengeModalOpen = false} aria-label="Close"></button>
            {/if}
        </div>

        <!-- Game Board -->
        <main class="flex-grow flex flex-col items-center justify-center px-4 pb-2 overflow-y-auto min-h-0">
            <div class="w-full max-w-lg mx-auto flex flex-col items-center">
                <GameBoard 
                    {wordLength} 
                    {maxGuesses} 
                    guesses={boardGuesses} 
                    currentGuess={currentGuess.join('')} 
                    evaluations={boardEvaluations()} 
                    {isRevealing}
                    invalidGuess={shakeRowIndex !== null}
                    {gameWon}
                    {gameLost}
                />
            </div>

            <!-- Progressive Hints moved to Modal -->
        </main>

        <!-- Keyboard -->
        <footer class="bg-white/60 backdrop-blur-md border-t border-slate-200/50 dark:bg-slate-900/60 dark:border-white/5 py-4 px-2 sticky bottom-0 shrink-0 z-20 shadow-[0_-4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_30px_rgba(0,0,0,0.2)]">
            <div class="max-w-2xl mx-auto">
                <Keyboard 
                    onKeyPress={(key) => {
                        if (key === 'ENTER') handleEnter();
                        else if (key === 'BACKSPACE') handleDelete();
                        else handleChar(key);
                    }}
                    letterStates={keyboardLetterStates()}
                    disabled={isInputDisabled}
                />
            </div>
        </footer>

        <!-- Modals -->
        <HelpModal isOpen={isHelpModalOpen} onClose={() => isHelpModalOpen = false} {wordLength} {maxGuesses} colorblindMode={settings.colorblindMode} />
        <StatsModal 
            isOpen={isStatsModalOpen} 
            onClose={() => isStatsModalOpen = false} 
            {stats} 
            gameStatus={gameState.gameStatus} 
            shareTextGenerator={generateShareText} 
            lastGameGuesses={lastGuessCountForStats} 
            {wordLength} 
            {maxGuesses} 
            colorblindMode={settings.colorblindMode} 
            gameMode={settings.gameMode} 
            gameNumber={currentGameNumber}
            isChallenge={settings.gameMode === 'challenge'}
            solution={gameState.solution}
        />
        <SettingsModal 
            isOpen={isSettingsModalOpen} 
            onClose={() => isSettingsModalOpen = false} 
            {settings} 
            onSettingsChange={handleSettingsChange} 
            onClearGameState={onClearGameState} 
            {archiveDate} 
            onArchiveDateChange={handleArchiveDateChange} 
            {gameEpoch}
        />

        {#if isHintModalOpen && !gameWon && !gameLost}
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity" onclick={() => isHintModalOpen = false}>
                <div class="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] border border-gray-200 dark:border-gray-700" onclick={(e) => e.stopPropagation()}>
                    <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-yellow-500">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.82 1.508-2.316a7.5 7.5 0 10-7.516 0c.85.496 1.508 1.333 1.508 2.316V18" />
                            </svg>
                            <h2 class="text-xl font-bold dark:text-white">Puzzle Hints</h2>
                        </div>
                        <button onclick={() => isHintModalOpen = false} class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                            <XMarkIcon class="w-6 h-6" />
                        </button>
                    </div>
                    <div class="p-2 overflow-y-auto">
                        <WordleHints word={gameState.solution!} />
                    </div>
                </div>
            </div>
        {/if}

        <!-- Toast -->
        {#if toastMessage}
            <div class="fixed top-24 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-bounce-in font-medium">
                {toastMessage}
            </div>
        {/if}
    </div>
{/if}

<style>
    @keyframes fade-in-up {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
    }

    :global(.animate-fade-in-up) {
        animation: fade-in-up 0.3s ease-out;
    }

    @keyframes bounce-in {
        0% { opacity: 0; transform: translate(-50%, -10px) scale(0.95); }
        100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
    }

    :global(.animate-bounce-in) {
        animation: bounce-in 0.3s ease-out;
    }

    /* Accessibility: Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
        :global(.animate-bounce-in),
        :global(.animate-fade-in-up) {
            animation: none !important;
            transform: none !important;
        }
    }
</style>
