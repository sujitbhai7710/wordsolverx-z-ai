<script lang="ts">
  import FiEye from '$lib/components/icons/FiEye.svelte';
  import FiHash from '$lib/components/icons/FiHash.svelte';
  import FiType from '$lib/components/icons/FiType.svelte';
  import FiBookOpen from '$lib/components/icons/FiBookOpen.svelte';
  import FiChevronDown from '$lib/components/icons/FiChevronDown.svelte';
  import FiChevronUp from '$lib/components/icons/FiChevronUp.svelte';
  import FiMusic from '$lib/components/icons/FiMusic.svelte';

  interface DatamuseWord { word: string; defs?: string[]; }

  let {
    word,
    puzzleNumber,
    definition: initialDefinition = null,
    rhymes: initialRhymes = [],
    synonyms: initialSynonyms = [],
    disableClientFetch = false
  }: {
    word: string;
    puzzleNumber: number;
    definition?: string | null;
    rhymes?: string[];
    synonyms?: string[];
    disableClientFetch?: boolean;
  } = $props();

  let showAnswer = $state(false);
  let definition = $state<string | null>(null);
  let rhymes = $state<string[]>([]);
  let synonyms = $state<string[]>([]);
  let loading = $state(true);

  let lowerWord = $derived(word.toLowerCase());
  let vowelCount = $derived((lowerWord.match(/[aeiou]/gi) || []).length);
  let startLetter = $derived(lowerWord.charAt(0).toUpperCase());
  let endLetter = $derived(lowerWord.charAt(lowerWord.length - 1).toUpperCase());
  let letterCount = $derived(lowerWord.length);

  $effect(() => {
    let cancelled = false;

    definition = initialDefinition;
    rhymes = [...initialRhymes];
    synonyms = [...initialSynonyms];

    if (initialDefinition || initialRhymes.length || initialSynonyms.length) {
      loading = false;
      return;
    }

    if (disableClientFetch) {
      loading = false;
      return;
    }

    loading = true;

    const fetchWordData = async () => {
      try {
        const defResponse = await fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(lowerWord)}&md=d&max=1`);
        const defData: DatamuseWord[] = await defResponse.json();
        if (!cancelled && defData.length > 0 && defData[0].defs && defData[0].defs.length > 0) {
          definition = defData[0].defs[0].split('\t')[1];
        }
        const rhymeResponse = await fetch(`https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(lowerWord)}&max=5`);
        const rhymeData = await rhymeResponse.json();
        if (!cancelled && rhymeData.length > 0) rhymes = rhymeData.slice(0, 5).map((r: { word: string }) => r.word);
        const synResponse = await fetch(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(lowerWord)}&max=5`);
        const synData = await synResponse.json();
        if (!cancelled && synData.length > 0) synonyms = synData.slice(0, 5).map((s: { word: string }) => s.word);
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to fetch word data:', error);
        }
      } finally {
        if (!cancelled) {
          loading = false;
        }
      }
    };
    fetchWordData();

    return () => {
      cancelled = true;
    };
  });
</script>

<div class="bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-xl overflow-hidden border border-purple-100 dark:border-purple-900/30 max-w-lg mx-auto">
  <div class="bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 p-6 text-white">
    <div class="flex items-center gap-3 mb-2"><FiEye class="text-2xl" /><h2 class="text-xl font-bold">Hints & Clues</h2></div>
    <p class="text-purple-100 text-sm">Use these clues to guess before revealing the answer!</p>
  </div>

  <div class="p-6 space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white dark:bg-gray-700/50 rounded-2xl p-4 shadow-sm border border-purple-100 dark:border-purple-800/30">
        <div class="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2"><FiHash class="text-lg" /><span class="text-xs font-semibold uppercase tracking-wider">Letters</span></div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white">{letterCount}</p>
      </div>
      <div class="bg-white dark:bg-gray-700/50 rounded-2xl p-4 shadow-sm border border-indigo-100 dark:border-indigo-800/30">
        <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2"><FiType class="text-lg" /><span class="text-xs font-semibold uppercase tracking-wider">Vowels</span></div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white">{vowelCount}</p>
      </div>
      <div class="bg-white dark:bg-gray-700/50 rounded-2xl p-4 shadow-sm border border-violet-100 dark:border-violet-800/30">
        <div class="flex items-center gap-2 text-violet-600 dark:text-violet-400 mb-2"><span class="text-xs font-semibold uppercase tracking-wider">Starts With</span></div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white">{startLetter}</p>
      </div>
      <div class="bg-white dark:bg-gray-700/50 rounded-2xl p-4 shadow-sm border border-fuchsia-100 dark:border-fuchsia-800/30">
        <div class="flex items-center gap-2 text-fuchsia-600 dark:text-fuchsia-400 mb-2"><span class="text-xs font-semibold uppercase tracking-wider">Ends With</span></div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white">{endLetter}</p>
      </div>
    </div>

    {#if !loading && definition}
      <div class="bg-white dark:bg-gray-700/50 rounded-2xl p-4 shadow-sm border border-amber-100 dark:border-amber-800/30">
        <div class="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2"><FiBookOpen class="text-lg" /><span class="text-xs font-semibold uppercase tracking-wider">Definition Hint</span></div>
        <p class="text-gray-700 dark:text-gray-300 text-sm italic">"{definition}"</p>
      </div>
    {/if}

    {#if !loading && rhymes.length > 0}
      <div class="bg-white dark:bg-gray-700/50 rounded-2xl p-4 shadow-sm border border-pink-100 dark:border-pink-800/30">
        <div class="flex items-center gap-2 text-pink-600 dark:text-pink-400 mb-2"><FiMusic class="text-lg" /><span class="text-xs font-semibold uppercase tracking-wider">Rhymes With</span></div>
        <div class="flex flex-wrap gap-2">
          {#each rhymes as rhyme}
            <span class="px-3 py-1 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 rounded-full text-sm font-medium">{rhyme}</span>
          {/each}
        </div>
      </div>
    {/if}

    {#if !loading && synonyms.length > 0}
      <div class="bg-white dark:bg-gray-700/50 rounded-2xl p-4 shadow-sm border border-emerald-100 dark:border-emerald-800/30">
        <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2"><span class="text-xs font-semibold uppercase tracking-wider">Similar Words</span></div>
        <div class="flex flex-wrap gap-2">
          {#each synonyms as syn}
            <span class="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">{syn}</span>
          {/each}
        </div>
      </div>
    {/if}

    <button onclick={() => (showAnswer = !showAnswer)} class="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 hover:from-purple-700 hover:via-indigo-700 hover:to-violet-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
      {#if showAnswer}<FiChevronUp class="text-xl" /> Hide Answer{:else}<FiChevronDown class="text-xl" /> Reveal Answer{/if}
    </button>

    {#if showAnswer}
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800/50">
        <div class="text-center">
          <p class="text-sm text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider mb-2">Puzzle #{puzzleNumber} Answer</p>
          <h3 class="text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-widest">{word}</h3>
        </div>
      </div>
    {/if}
  </div>
</div>
