<script lang="ts">
  import type { Snippet } from 'svelte';

  interface GlobleCountry {
    name: string;
    code: string;
    latitude: number;
    longitude: number;
    continent: string;
    subregion: string;
  }

  let {
    country,
    date,
    children,
  }: {
    country: GlobleCountry;
    date: string;
    children?: Snippet;
  } = $props();

  let revealed = $state(false);

  let clues = $derived([
    { question: `What continent is today's Globle country located on?`, answer: `The country is located on the ${country.continent} continent.` },
    { question: `How many letters are in today's Globle country name?`, answer: `The country name has ${country.name.length} letters.` },
    { question: `What is the first letter of today's Globle country?`, answer: `The country name starts with the letter "${country.name[0]}".` },
    { question: `What subregion is today's Globle country in?`, answer: `The country is located in ${country.subregion}.` },
    { question: `What are the coordinates of today's Globle country?`, answer: `The geographic center is at latitude ${country.latitude.toFixed(2)}° and longitude ${country.longitude.toFixed(2)}°.` },
  ]);

</script>

<div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 mb-8">
  <div class="text-center mb-6">
    <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">Globle Clues for {date}</h2>
    <p class="text-slate-600 dark:text-slate-300">Use these hints to guess the country before revealing the answer</p>
  </div>

  <div class="space-y-4 mb-8">
    {#each clues as clue, index}
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 rounded-lg p-5 border border-blue-100 dark:border-slate-600">
        <h3 class="font-semibold text-slate-900 dark:text-white mb-2 flex items-start">
          <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold mr-3 flex-shrink-0 mt-0.5">{index + 1}</span>
          {clue.question}
        </h3>
        <p class="text-slate-700 dark:text-slate-200 ml-9">{clue.answer}</p>
      </div>
    {/each}
  </div>

  {#if !revealed}
    <div class="text-center">
      <button
        onclick={() => (revealed = true)}
        class="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Reveal Answer
      </button>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-3">Click to see the Globle country</p>
    </div>
  {/if}
</div>

<!-- Answer section -->
{#if revealed && children}
  <div>
    {@render children()}
  </div>
{/if}
