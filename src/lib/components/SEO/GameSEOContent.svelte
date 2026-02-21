<script lang="ts">
  import FAQSection, { type FAQItem } from '../FAQSection.svelte';
  import InternalLinkSection from '../InternalLinkSection.svelte';

  let {
    wordLength,
  }: {
    wordLength: number;
  } = $props();

  let faqs = $derived<FAQItem[]>([
    {
      question: `What is ${wordLength} Letter Wordle?`,
      answer: `It's a daily word puzzle game where you have 6 attempts to guess a hidden ${wordLength}-letter word using color-coded clues.`
    },
    {
      question: `Is ${wordLength} Letter Wordle free to play?`,
      answer: `Yes, completely free! You can play our daily puzzle or try the infinite mode for endless challenges.`
    },
    {
      question: `What do the colors mean?`,
      answer: `Green means the letter is correct and in the right spot. Yellow means it's in the word but in the wrong spot. Gray means the letter is not in the word.`
    }
  ]);

</script>

<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose dark:prose-invert prose-green lg:prose-lg">
  <section class="mb-12">
    <h1 class="text-4xl font-black text-gray-900 dark:text-white mb-6">Play {wordLength} Letter Wordle Daily</h1>
    <p class="lead text-xl text-gray-600 dark:text-gray-300">
      Challenge your vocabulary and logic skills with our free <strong>{wordLength}-letter word puzzle</strong>. 
      Whether you are a wordsmith or just looking for a fun daily brain teaser, our {wordLength}-letter variant offers the perfect level of difficulty!
    </p>
  </section>

  <section class="mb-12 bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-100 dark:border-gray-700">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
      <span class="text-3xl">🎮</span> How to Play
    </h2>
    <ul class="space-y-3 text-gray-700 dark:text-gray-300 list-disc pl-5">
      <li>Guess the hidden <strong>{wordLength}-letter word</strong> in 6 attempts or less.</li>
      <li>Each guess must be a valid {wordLength}-letter word in the dictionary.</li>
      <li>Hit the enter button to submit your guess.</li>
      <li>After each guess, the color of the tiles will change to show how close your guess was to the word.</li>
    </ul>
    
    <div class="mt-6 flex flex-col gap-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 flex items-center justify-center bg-green-500 text-white font-bold rounded">W</div>
        <p class="text-sm dark:text-gray-300"><strong>W</strong> is in the word and in the correct spot.</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 flex items-center justify-center bg-yellow-500 text-white font-bold rounded">O</div>
        <p class="text-sm dark:text-gray-300"><strong>O</strong> is in the word but in the wrong spot.</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 flex items-center justify-center bg-gray-500 text-white font-bold rounded">R</div>
        <p class="text-sm dark:text-gray-300"><strong>R</strong> is not in the word in any spot.</p>
      </div>
    </div>
  </section>

  <section class="mb-12">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
      <span class="text-3xl">💡</span> Strategy and Tips
    </h2>
    <p class="text-gray-700 dark:text-gray-300 mb-4">
      Mastering the {wordLength}-letter Wordle requires a mix of strategy and a good vocabulary. Here are some tips to help you maintain your winning streak:
    </p>
    <ul class="space-y-2 text-gray-700 dark:text-gray-300">
      <li><strong>Start strong:</strong> Begin with a word that has many vowels (A, E, I, O, U) and common consonants (R, S, T, L, N).</li>
      <li><strong>Eliminate efficiently:</strong> Unless you are playing on Hard Mode, use your second guess to eliminate as many new letters as possible.</li>
      <li><strong>Watch for duplicates:</strong> Remember that letters can appear more than once!</li>
      <li><strong>Take your time:</strong> There is no literal timer for the game, so think through your possible letter combinations carefully.</li>
    </ul>
  </section>

  <FAQSection {faqs} class="mb-12 -mx-4 sm:mx-0" />
  
  <InternalLinkSection currentGame="Wordle" />
</article>
