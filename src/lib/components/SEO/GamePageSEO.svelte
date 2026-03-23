<script lang="ts">
  import { page } from '$app/stores';
  import GameSchema from './GameSchema.svelte';

  let {
    wordLength,
  }: {
    wordLength: number;
  } = $props();

  let title = $derived(`${wordLength} Letter Wordle - Play Daily ${wordLength}-Letter Word Puzzles | WordSolverX`);
  let description = $derived(`Play free ${wordLength}-letter Wordle puzzles on WordSolverX. Guess the hidden ${wordLength}-letter word in 6 tries with a fresh daily challenge, instant feedback, and unlimited replay support.`);
  let canonical = $derived(`https://wordsolver.tech/${wordLength}-letter-wordle`);
  let ogTitle = $derived(`${wordLength} Letter Wordle - Free Daily Puzzle`);
  let ogDescription = $derived(`Play a free daily ${wordLength}-letter Wordle puzzle with instant clues, clean feedback, and unlimited replay on WordSolverX.`);
  let ogImage = $derived('https://wordsolver.tech/wordsolverx.webp');
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:title" content={ogTitle} />
  <meta property="og:description" content={ogDescription} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonical} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={ogTitle} />
  <meta name="twitter:description" content={ogDescription} />
  <meta name="twitter:image" content={ogImage} />
</svelte:head>

<GameSchema 
  name={`${wordLength} Letter Wordle`}
  description={description}
  url={canonical}
  image={ogImage}
/>
