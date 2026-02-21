<script lang="ts">
  import { Q_DAT_D, Q_DAT_C, Q_DAT_E, Q_DAT_B, Q_DAT_W } from '$lib/data/QuordleObfuscatedData';
  import { format } from 'date-fns';

  // Obfuscated RNG and Generation Logic
  class _M {
    private N = 624; private M = 397; private A = 2567483615;
    private U = 2147483648; private L = 2147483647;
    private m: number[]; private i: number;
    constructor(s: any) { this.m = new Array(this.N); this.i = this.N + 1; if (Array.isArray(s)) this.ia(s, s.length); else this.is(s); }
    is(s: any) { this.m[0] = s >>> 0; for (this.i = 1; this.i < this.N; this.i++) { let x = this.m[this.i - 1] ^ this.m[this.i - 1] >>> 30; this.m[this.i] = (((x & 4294901760) >>> 16) * 1812433253 << 16) + (x & 65535) * 1812433253 + this.i; this.m[this.i] >>>= 0; } }
    ia(s: any, l: any) { this.is(19650218); let i = 1, j = 0, k = this.N > l ? this.N : l; for (; k; k--) { let x = this.m[i - 1] ^ this.m[i - 1] >>> 30; this.m[i] = (this.m[i] ^ (((x & 4294901760) >>> 16) * 1664525 << 16) + (x & 65535) * 1664525) + s[j] + j; this.m[i] >>>= 0; i++; j++; if (i >= this.N) { this.m[0] = this.m[this.N - 1]; i = 1; } if (j >= l) j = 0; } for (k = this.N - 1; k; k--) { let x = this.m[i - 1] ^ this.m[i - 1] >>> 30; this.m[i] = (this.m[i] ^ (((x & 4294901760) >>> 16) * 1566083941 << 16) + (x & 65535) * 1566083941) - i; this.m[i] >>>= 0; i++; if (i >= this.N) { this.m[0] = this.m[this.N - 1]; i = 1; } } this.m[0] = 2147483648; }
    r() { let y, m = new Array(0, this.A); if (this.i >= this.N) { let k; for (this.i == this.N + 1 && this.is(5489), k = 0; k < this.N - this.M; k++)y = this.m[k] & this.U | this.m[k + 1] & this.L, this.m[k] = this.m[k + this.M] ^ y >>> 1 ^ m[y & 1]; for (; k < this.N - 1; k++)y = this.m[k] & this.U | this.m[k + 1] & this.L, this.m[k] = this.m[k + (this.M - this.N)] ^ y >>> 1 ^ m[y & 1]; y = this.m[this.N - 1] & this.U | this.m[0] & this.L, this.m[this.N - 1] = this.m[this.M - 1] ^ y >>> 1 ^ m[y & 1], this.i = 0; } y = this.m[this.i++]; y ^= y >>> 11; y ^= y << 7 & 2636928640; y ^= y << 15 & 4022730752; y ^= y >>> 18; return y >>> 0; }
    r31() { return this.r() >>> 1; }
  }

  const _G = (seed: number, wb: string[], bl: Set<string>) => {
    let r: string[]; const rng = new _M(seed);
    rng.r31(); rng.r31(); rng.r31(); rng.r31();
    do r = [wb[rng.r31() % wb.length], wb[rng.r31() % wb.length], wb[rng.r31() % wb.length], wb[rng.r31() % wb.length]];
    while (r[0] === r[1] || r[0] === r[2] || r[0] === r[3] || r[1] === r[2] || r[1] === r[3] || r[2] === r[3] || bl.has(r[0]) || bl.has(r[1]) || bl.has(r[2]) || bl.has(r[3]));
    return r;
  };

  let { date }: { date: Date } = $props();

  let data = $state<{
    d: string[], c: string[], e: string[], s: string[], r: string[], w: string[],
    dN: number, cN: number, eN: number, sN: number, rN: number, wN: number
  } | null>(null);
  let viewAnswers = $state<Record<string, boolean>>({});
  let mounted = $state(false);

  $effect(() => {
    mounted = true;
    try {
      const _wd = atob(Q_DAT_D).split(' ');
      const _wc = atob(Q_DAT_C).split(' ');
      const _we = atob(Q_DAT_E).split(' ');
      const _bl = new Set(atob(Q_DAT_B).split(' '));
      const _wl = JSON.parse(atob(Q_DAT_W));

      const e_d = new Date(2022, 0, 24, 12, 0, 0);
      const e_c = new Date(2024, 6, 29, 12, 0, 0);
      const e_r = new Date(2025, 10, 10, 12, 0, 0);
      const e_w = new Date(2023, 5, 26, 12, 0, 0);

      const sd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
      const dN = Math.floor((sd.getTime() - e_d.getTime()) / 86400000);
      const cN = Math.floor((sd.getTime() - e_c.getTime()) / 86400000);
      const rN = Math.floor((sd.getTime() - e_r.getTime()) / 86400000);
      const wDays = Math.floor((sd.getTime() - e_w.getTime()) / 86400000);
      const wN = Math.ceil((1 + wDays) / 7);
      const _ws = [..._wd].reverse();

      let weeklyAns: string[] = [];
      if (wN >= 0 && wN < _wl.length) weeklyAns = _wl[wN];
      else if (wN >= 0) { const rng = new _M(wN); weeklyAns = _wl[rng.r31() % _wl.length]; }

      data = {
        d: dN >= 0 ? _G(dN, _wd, _bl) : [],
        s: dN >= 0 ? _G(dN, _ws, _bl) : [],
        c: cN >= 0 ? _G(cN, _wc, _bl) : [],
        e: cN >= 0 ? _G(cN, _we, _bl) : [],
        r: rN >= 0 ? _G(rN, _wd, _bl) : [],
        w: weeklyAns,
        dN, cN, eN: cN, sN: dN, rN, wN
      };
    } catch (err) {
      console.error("Error decoding Quordle data", err);
    }
  });

  function countVowels(word: string) { return (word.match(/[AEIOU]/gi) || []).length; }
  function hasDoubleLetters(word: string) {
    for (let i = 0; i < word.length - 1; i++) {
      if (word[i] === word[i + 1]) return true;
    }
    return false;
  }

  const colorMap: Record<string, string> = {
    classic: 'bg-emerald-500', sequence: 'bg-violet-500', chill: 'bg-blue-500',
    extreme: 'bg-red-500', rescue: 'bg-amber-500', weekly: 'bg-pink-500'
  };
</script>

{#if !data}
  <div class="text-center p-8">Loading...</div>
{:else}
  <div class="space-y-12">
    <div class="text-center mb-16">
      <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-4">Today&apos;s Quordle Puzzle Hints & Solutions</h2>
      <div class="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
      <p class="mt-4 text-gray-500 font-medium uppercase tracking-[0.2em] text-xs">Scroll down for all game modes</p>
    </div>

    {#each [
      { title: 'Daily Classic', words: data.d, type: 'classic', num: data.dN },
      { title: 'Daily Chill', words: data.c, type: 'chill', num: data.cN },
      { title: 'Daily Extreme', words: data.e, type: 'extreme', num: data.cN },
      { title: 'Sequence', words: data.s, type: 'sequence', num: data.dN },
      { title: 'Rescue', words: data.r, type: 'rescue', num: data.rN },
      { title: 'Weekly', words: data.w, type: 'weekly', num: data.wN }
    ] as mode}
      {#if mode.words && mode.words.length > 0}
        {@const accentColor = colorMap[mode.type] || 'bg-gray-500'}
        {@const textColor = accentColor.replace('bg-', 'text-')}
        {@const vowelCountTotal = mode.words.reduce((acc: number, w: string) => acc + countVowels(w), 0)}
        {@const doubleLetterCount = mode.words.filter(hasDoubleLetters).length}
        {@const startingLetters = mode.words.map((w: string) => w[0]).join(', ')}

        <div class="mb-16 scroll-mt-20" id="mode-{mode.type}">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-3">
            <span class="w-2 h-8 rounded-full {accentColor}"></span>
            {mode.title} Hints for {mode.num}
          </h2>
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <p class="text-gray-600 dark:text-gray-400 mb-8 italic">
              Are you struggling to solve today&apos;s {mode.title.toLowerCase()}? Here are some useful hints.
            </p>
            <div class="space-y-8">
              <div>
                <div class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <span class="{accentColor} text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">Q1</span>
                  How many vowels are in today&apos;s {mode.title.toLowerCase()} words?
                </div>
                <p class="text-gray-600 dark:text-gray-400 pl-10">
                  There are a total of <span class="font-bold {textColor}">{vowelCountTotal} vowels</span> across the four words.
                </p>
              </div>
              <div>
                <div class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <span class="{accentColor} text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">Q2</span>
                  How many double letters are there?
                </div>
                <p class="text-gray-600 dark:text-gray-400 pl-10">
                  {doubleLetterCount === 0 ? "None of today's words contain double letters." : `There are ${doubleLetterCount} words with double letters.`}
                </p>
              </div>
              <div>
                <div class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <span class="{accentColor} text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">Q3</span>
                  Starting letters?
                </div>
                <p class="text-gray-600 dark:text-gray-400 pl-10">
                  The starting letters are: <span class="font-bold tracking-widest {textColor}">{startingLetters}</span>.
                </p>
              </div>
            </div>
          </div>

          <div class="mt-8 text-center">
            <button
              onclick={() => (viewAnswers = { ...viewAnswers, [mode.type]: !viewAnswers[mode.type] })}
              class="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
            >
              {viewAnswers[mode.type] ? 'Hide Answers' : `Show ${mode.title} Answers`}
            </button>
          </div>

          {#if viewAnswers[mode.type]}
            <div class="mt-12">
              <div class="text-center mb-8">
                <div class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{mode.title} Answers for {mode.num}</div>
                <p class="text-gray-500 dark:text-gray-400">
                  {#if mounted}for {format(date, 'EEEE, MMMM d, yyyy')}{/if}
                </p>
              </div>
              <div class="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {#each mode.words as word, i}
                  <div class="{accentColor} text-white p-6 rounded-2xl text-center text-2xl font-black tracking-[0.2em] shadow-xl border-b-4 border-black/20 transform hover:-translate-y-1 transition-transform">
                    {word}
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      {/if}
    {/each}
  </div>
{/if}
