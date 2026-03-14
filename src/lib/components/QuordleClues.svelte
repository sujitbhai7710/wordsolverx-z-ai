<script lang="ts">
  import FiHash from '$lib/components/icons/FiHash.svelte';
  import FiType from '$lib/components/icons/FiType.svelte';
  import FiChevronDown from '$lib/components/icons/FiChevronDown.svelte';
  import FiChevronUp from '$lib/components/icons/FiChevronUp.svelte';

  interface DatamuseWord { word: string; defs?: string[]; }

  let { words, mode }: { words: string[]; mode: string } = $props();

  let showAnswers = $state(false);
  let wordData = $state<{ [key: string]: { definition?: string; rhymes?: string[] } }>({});
  let loading = $state(true);

  let totalLetters = $derived(words.reduce((sum, w) => sum + w.length, 0));
  let totalVowels = $derived(words.reduce((sum, w) => sum + (w.toLowerCase().match(/[aeiou]/g) || []).length, 0));
  let startingLetters = $derived(words.map(w => w[0].toUpperCase()));
  let endingLetters = $derived(words.map(w => w[w.length - 1].toUpperCase()));

  function getModeColor() {
    switch (mode.toLowerCase()) {
      case 'classic': return 'from-emerald-500 to-green-600';
      case 'chill': return 'from-blue-500 to-cyan-600';
      case 'extreme': return 'from-red-500 to-rose-600';
      case 'sequence': return 'from-violet-500 to-purple-600';
      case 'rescue': return 'from-amber-500 to-orange-600';
      case 'weekly': return 'from-pink-500 to-rose-600';
      default: return 'from-indigo-500 to-blue-600';
    }
  }

  $effect(() => {
    const fetchWordData = async () => {
      const data: { [key: string]: { definition?: string; rhymes?: string[] } } = {};
      for (const word of words) {
        const lowerWord = word.toLowerCase();
        try {
          const defResponse = await fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(lowerWord)}&md=d&max=1`);
          const defData: DatamuseWord[] = await defResponse.json();
          let definition: string | undefined;
          if (defData.length > 0 && defData[0].defs && defData[0].defs.length > 0) {
            definition = defData[0].defs[0].split('\t')[1];
          }
          const rhymeResponse = await fetch(`https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(lowerWord)}&max=3`);
          const rhymeData = await rhymeResponse.json();
          const rhymes = rhymeData.slice(0, 3).map((r: { word: string }) => r.word);
          data[word] = { definition, rhymes };
        } catch (error) {
          console.error(`Failed to fetch data for ${word}:`, error);
          data[word] = {};
        }
      }
      wordData = data;
      loading = false;
    };
    fetchWordData();
  });

  let modeColor = $derived(getModeColor());
</script>

<div class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-xl overflow-hidden border border-blue-100 dark:border-blue-900/30">
  <div class="p-6 space-y-4">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-700/50 rounded-2xl p-4 shadow-sm border border-blue-100 dark:border-blue-800/30">
        <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2"><FiHash class="text-lg" /><span class="text-xs font-semibold uppercase tracking-wider">Total Letters</span></div>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{totalLetters}</p>
      </div>
      <div class="bg-white dark:bg-gray-700/50 rounded-2xl p-4 shadow-sm border border-indigo-100 dark:border-indigo-800/30">
        <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2"><FiType class="text-lg" /><span class="text-xs font-semibold uppercase tracking-wider">Total Vowels</span></div>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{totalVowels}</p>
      </div>
      <div class="bg-white dark:bg-gray-700/50 rounded-2xl p-4 shadow-sm border border-purple-100 dark:border-purple-800/30">
        <div class="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2"><span class="text-xs font-semibold uppercase tracking-wider">Starts With</span></div>
        <p class="text-xl font-bold text-gray-900 dark:text-white tracking-widest">{startingLetters.join(' ')}</p>
      </div>
      <div class="bg-white dark:bg-gray-700/50 rounded-2xl p-4 shadow-sm border border-pink-100 dark:border-pink-800/30">
        <div class="flex items-center gap-2 text-pink-600 dark:text-pink-400 mb-2"><span class="text-xs font-semibold uppercase tracking-wider">Ends With</span></div>
        <p class="text-xl font-bold text-gray-900 dark:text-white tracking-widest">{endingLetters.join(' ')}</p>
      </div>
    </div>

    {#if !loading}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {#each words as word, i}
          {@const data = wordData[word] || {}}
          {@const vowelCount = (word.toLowerCase().match(/[aeiou]/g) || []).length}
          <div class="bg-white dark:bg-gray-700/50 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-600/50">
            <div class="flex items-center gap-2 mb-3">
              <span class="w-8 h-8 rounded-lg bg-gradient-to-r {modeColor} text-white flex items-center justify-center font-bold text-sm">{i + 1}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {word.length} letters • {vowelCount} vowels • Starts: {word[0].toUpperCase()} • Ends: {word[word.length - 1].toUpperCase()}
              </span>
            </div>
            {#if data.definition}
              <div class="mb-2">
                <span class="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase">Hint: </span>
                <span class="text-sm text-gray-600 dark:text-gray-300 italic">"{data.definition}"</span>
              </div>
            {/if}
            {#if data.rhymes && data.rhymes.length > 0}
              <div class="flex flex-wrap gap-1">
                <span class="text-xs text-pink-600 dark:text-pink-400 font-semibold uppercase mr-1">Rhymes: </span>
                {#each data.rhymes as rhyme}
                  <span class="px-2 py-0.5 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 rounded-full text-xs">{rhyme}</span>
                {/each}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}

    <button
      onclick={() => (showAnswers = !showAnswers)}
      class="w-full bg-gradient-to-r {modeColor} hover:opacity-90 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mt-6"
    >
      {#if showAnswers}<FiChevronUp class="text-xl" /> Hide Answers{:else}<FiChevronDown class="text-xl" /> Reveal All 4 Answers{/if}
    </button>

    {#if showAnswers}
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800/50">
        <p class="text-sm text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider mb-4 text-center">{mode} Mode Answers</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          {#each words as word, i}
            <div class="text-center">
              <span class="text-xs text-gray-500 dark:text-gray-400">Word {i + 1}</span>
              <p class="text-xl font-extrabold text-gray-900 dark:text-white uppercase tracking-widest">{word}</p>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>
