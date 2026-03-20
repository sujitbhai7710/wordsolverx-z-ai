<script lang="ts">
  import { onMount } from 'svelte';

  const HANGMAN_API = 'https://hangman-solver.wordapi.workers.dev';

  interface SolverResult {
    suggestedLetter: string;
    possibleWords: string[];
    wordFrequencies: { word: string; frequency: number }[];
    letterProbabilities: { letter: string; probability: number; count: number; infoGain: number }[];
    totalMatches: number;
    pattern: string;
    entropy: number;
    topWord: string | null;
    elapsed?: number;
  }

  interface WordStats {
    totalWords: number;
    wordsByLength: { length: number; count: number }[];
  }

  let pattern = '';
  let excludedLetters = '';
  let includedLetters = '';
  let result: SolverResult | null = null;
  let stats: WordStats | null = null;
  let loading = false;
  let copiedWord: string | null = null;
  let errorMessage = '';
  let helperMessage = '';
  let statsLoading = true;

  const examples = [
    { pattern: 'h_ll_', excludedLetters: '', includedLetters: '' },
    { pattern: '_pp__', excludedLetters: '', includedLetters: '' },
    { pattern: 'b__n_n_', excludedLetters: '', includedLetters: '' },
    { pattern: '?r?te?', excludedLetters: '', includedLetters: '' }
  ];

  onMount(async () => {
    try {
      const response = await fetch(`${HANGMAN_API}/stats`);
      if (!response.ok) {
        throw new Error('Could not load word stats');
      }
      const data = await response.json();
      stats = {
        totalWords: data.totalWords,
        wordsByLength: data.wordsByLength
      };
    } catch {
      helperMessage = 'Word stats are temporarily unavailable, but the solver can still run.';
    } finally {
      statsLoading = false;
    }
  });

  function loadExample(example: (typeof examples)[number]) {
    pattern = example.pattern;
    excludedLetters = example.excludedLetters;
    includedLetters = example.includedLetters;
    result = null;
    errorMessage = '';
    helperMessage = '';
  }

  function clearAll() {
    pattern = '';
    excludedLetters = '';
    includedLetters = '';
    result = null;
    errorMessage = '';
    helperMessage = '';
  }

  async function solve() {
    if (!pattern.trim()) {
      errorMessage = 'Please enter a pattern with letters and blanks before solving.';
      return;
    }

    loading = true;
    errorMessage = '';
    helperMessage = '';

    try {
      const response = await fetch(`${HANGMAN_API}/solve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pattern,
          excludedLetters,
          includedLetters
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to solve hangman pattern');
      }

      result = data;
      helperMessage =
        data.totalMatches === 0
          ? 'No exact matches found. Try relaxing your wrong-letter list or pattern.'
          : `Solved in ${data.elapsed ?? 0} ms using the worker dictionary.`;
    } catch (error) {
      result = null;
      errorMessage = error instanceof Error ? error.message : 'Could not solve this pattern right now.';
    } finally {
      loading = false;
    }
  }

  async function copyWord(word: string) {
    try {
      await navigator.clipboard.writeText(word);
      copiedWord = word;
      helperMessage = `"${word}" copied to your clipboard.`;
      window.setTimeout(() => {
        if (copiedWord === word) {
          copiedWord = null;
        }
      }, 1800);
    } catch {
      errorMessage = 'Clipboard copy failed on this browser.';
    }
  }

  function copyRandomWord() {
    if (!result?.possibleWords.length) {
      return;
    }
    const randomWord =
      result.possibleWords[Math.floor(Math.random() * result.possibleWords.length)];
    void copyWord(randomWord);
  }
</script>

<section class="bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.18),_transparent_35%),linear-gradient(180deg,#fff7ed_0%,#ffffff_40%,#fffaf3_100%)] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
  <div class="mx-auto max-w-6xl">
    <div class="rounded-[2rem] border border-orange-100 bg-white/90 p-6 shadow-[0_24px_80px_rgba(249,115,22,0.12)] backdrop-blur sm:p-8">
      <div class="flex flex-wrap items-start justify-between gap-6">
        <div class="max-w-3xl">
          <p class="inline-flex rounded-full bg-orange-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
            Worker-powered word finder
          </p>
          <h2 class="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Hangman Solver</h2>
          <p class="mt-4 text-base leading-8 text-slate-600">
            Enter your known pattern, wrong letters, and included letters. The same entropy-based Hangman logic from the original project runs inside a separate worker so the dictionary never has to load in the browser.
          </p>
        </div>

        <div class="min-w-[240px] rounded-3xl border border-orange-100 bg-orange-50/70 p-4 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">Dictionary status</p>
          {#if statsLoading}
            <p class="mt-3 text-sm font-medium text-slate-600">Loading worker stats...</p>
          {:else if stats}
            <p class="mt-3 text-2xl font-black text-slate-900">{stats.totalWords.toLocaleString()}</p>
            <p class="mt-1 text-sm text-slate-600">words available across {stats.wordsByLength.length} word lengths</p>
          {:else}
            <p class="mt-3 text-sm font-medium text-slate-600">Stats unavailable</p>
          {/if}
        </div>
      </div>
    </div>

    <div class="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
      <div class="space-y-8">
        <form
          class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(148,163,184,0.12)] sm:p-8"
          onsubmit={(event) => {
            event.preventDefault();
            void solve();
          }}
        >
          <div class="grid gap-5">
            <label class="grid gap-2">
              <span class="text-base font-semibold text-slate-900">Word pattern</span>
              <input
                bind:value={pattern}
                class="h-12 rounded-2xl border-2 border-slate-200 px-4 font-mono text-base text-slate-900 outline-none transition focus:border-orange-400"
                placeholder="e.g. h_ll_ or ?pp?e"
                spellcheck="false"
              />
              <span class="text-sm text-slate-500">Use letters for known spots and `_`, `?`, `-`, or `*` for unknown letters.</span>
            </label>

            <label class="grid gap-2">
              <span class="text-base font-semibold text-slate-900">Wrong letters</span>
              <input
                bind:value={excludedLetters}
                class="h-12 rounded-2xl border-2 border-slate-200 px-4 font-mono text-base text-slate-900 outline-none transition focus:border-rose-400"
                oninput={() => (excludedLetters = excludedLetters.toLowerCase().replace(/[^a-z]/g, ''))}
                placeholder="e.g. abcxyz"
                spellcheck="false"
              />
            </label>

            <label class="grid gap-2">
              <span class="text-base font-semibold text-slate-900">Letters in word, unknown position</span>
              <input
                bind:value={includedLetters}
                class="h-12 rounded-2xl border-2 border-slate-200 px-4 font-mono text-base text-slate-900 outline-none transition focus:border-emerald-400"
                oninput={() => (includedLetters = includedLetters.toLowerCase().replace(/[^a-z]/g, ''))}
                placeholder="e.g. ae"
                spellcheck="false"
              />
            </label>
          </div>

          <div class="mt-6 flex flex-wrap gap-3">
            <button
              class="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:translate-y-[-1px] disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              {loading ? 'Solving...' : 'Find words'}
            </button>
            <button
              class="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
              onclick={clearAll}
              type="button"
            >
              Clear all
            </button>
          </div>

          <div class="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p class="text-sm font-semibold text-slate-700">Quick examples</p>
            <div class="mt-3 flex flex-wrap gap-2">
              {#each examples as example}
                <button
                  class="rounded-full border border-slate-200 bg-white px-3 py-2 font-mono text-xs font-semibold text-slate-700 transition hover:border-orange-200 hover:text-orange-700"
                  onclick={() => loadExample(example)}
                  type="button"
                >
                  {example.pattern}
                </button>
              {/each}
            </div>
          </div>

          {#if errorMessage}
            <div class="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {errorMessage}
            </div>
          {/if}

          {#if helperMessage}
            <div class="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              {helperMessage}
            </div>
          {/if}
        </form>

        {#if result}
          <div class="space-y-6">
            {#if result.topWord}
              <section class="rounded-[2rem] bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 p-6 text-white shadow-[0_24px_80px_rgba(79,70,229,0.22)]">
                <p class="text-sm font-semibold uppercase tracking-[0.18em] text-violet-100">Most likely answer</p>
                <div class="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 class="text-4xl font-black uppercase tracking-[0.22em] sm:text-5xl">{result.topWord}</h3>
                    <p class="mt-2 text-sm text-violet-100">
                      Ranked first by popularity among {result.totalMatches.toLocaleString()} matches
                    </p>
                  </div>
                  <button
                    class="inline-flex h-11 items-center justify-center rounded-2xl border border-white/30 bg-white/15 px-4 text-sm font-semibold text-white transition hover:bg-white/25"
                    onclick={() => result?.topWord && copyWord(result.topWord)}
                    type="button"
                  >
                    {copiedWord === result.topWord ? 'Copied' : 'Copy word'}
                  </button>
                </div>
              </section>
            {/if}

            <section class="grid gap-6 md:grid-cols-2">
              <article class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
                <h3 class="text-lg font-bold text-slate-900">Best next guess</h3>
                <div class="mt-4 flex items-center justify-between gap-4 rounded-3xl bg-orange-50 p-4">
                  <div>
                    <p class="text-sm font-medium text-orange-700">Suggested letter</p>
                    <p class="mt-1 text-4xl font-black uppercase text-slate-900">{result.suggestedLetter || '—'}</p>
                  </div>
                  <div class="text-right text-sm text-slate-600">
                    <p>Entropy: {result.entropy.toFixed(2)}</p>
                    <p class="mt-1">Matches: {result.totalMatches.toLocaleString()}</p>
                  </div>
                </div>
              </article>

              <article class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
                <div class="flex items-center justify-between gap-3">
                  <h3 class="text-lg font-bold text-slate-900">Top answers</h3>
                  {#if result.possibleWords.length > 0}
                    <button
                      class="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-orange-200 hover:text-orange-700"
                      onclick={copyRandomWord}
                      type="button"
                    >
                      Copy random
                    </button>
                  {/if}
                </div>

                {#if result.wordFrequencies.length > 0}
                  <div class="mt-4 flex max-h-72 flex-wrap gap-2 overflow-y-auto pr-1">
                    {#each result.wordFrequencies as wordFreq, index}
                      <button
                        class={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-mono font-semibold transition ${index === 0 ? 'bg-violet-100 text-violet-700' : copiedWord === wordFreq.word ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-orange-100 hover:text-orange-700'}`}
                        onclick={() => copyWord(wordFreq.word)}
                        type="button"
                      >
                        <span>{wordFreq.word}</span>
                        <span class="text-[11px] opacity-70">{wordFreq.frequency.toLocaleString()}</span>
                      </button>
                    {/each}
                  </div>
                {:else}
                  <div class="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                    No matching words found for this pattern.
                  </div>
                {/if}
              </article>
            </section>

            <section class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
              <h3 class="text-lg font-bold text-slate-900">Entropy-ranked letter suggestions</h3>
              <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {#each result.letterProbabilities as entry}
                  <div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{entry.letter}</p>
                    <p class="mt-2 text-2xl font-black text-slate-900">{Math.round(entry.probability * 100)}%</p>
                    <p class="mt-1 text-xs text-slate-500">{entry.count} words</p>
                    <p class="mt-2 text-xs font-medium text-indigo-600">info gain {entry.infoGain.toFixed(3)}</p>
                  </div>
                {/each}
              </div>
            </section>
          </div>
        {/if}
      </div>

      <aside class="space-y-6">
        <section class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
          <h3 class="text-xl font-bold text-slate-900">How it works</h3>
          <div class="mt-5 space-y-4">
            <div class="rounded-2xl bg-orange-50 p-4">
              <p class="text-sm font-semibold text-orange-700">1. Match the pattern</p>
              <p class="mt-2 text-sm leading-7 text-slate-600">Known letters stay fixed. Unknown spots can be written as `_`, `?`, `-`, or `*`.</p>
            </div>
            <div class="rounded-2xl bg-rose-50 p-4">
              <p class="text-sm font-semibold text-rose-700">2. Exclude wrong letters</p>
              <p class="mt-2 text-sm leading-7 text-slate-600">Wrong guesses are removed from all blank positions so the candidate list narrows quickly.</p>
            </div>
            <div class="rounded-2xl bg-emerald-50 p-4">
              <p class="text-sm font-semibold text-emerald-700">3. Use included letters</p>
              <p class="mt-2 text-sm leading-7 text-slate-600">If you know a letter exists but not its position, add it here so the solver keeps only valid words.</p>
            </div>
          </div>
        </section>

        {#if stats}
          <section class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
            <h3 class="text-xl font-bold text-slate-900">Word lengths covered</h3>
            <div class="mt-4 flex flex-wrap gap-2">
              {#each stats.wordsByLength as entry}
                <span class="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                  {entry.length} letters: {entry.count.toLocaleString()}
                </span>
              {/each}
            </div>
          </section>
        {/if}
      </aside>
    </div>
  </div>
</section>
