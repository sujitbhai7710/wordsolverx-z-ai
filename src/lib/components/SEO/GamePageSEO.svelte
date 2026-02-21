<script lang="ts">
  import { page } from '$app/stores';
  import GameSchema from './GameSchema.svelte';

  let {
    wordLength,
  }: {
    wordLength: number;
  } = $props();

  let title = $derived(`${wordLength} Letter Wordle - Play Daily ${wordLength}-Letter Word Puzzles | WordSolverX`);
  let description = $derived(`Play the best ${wordLength}-letter Wordle game for free. Guess the hidden word in 6 tries. Challenge yourself with our daily ${wordLength}-letter word puzzles.`);
  let canonical = $derived(`https://wordsolverx.com/${wordLength}-letter-wordle`);
  let ogTitle = $derived(`${wordLength} Letter Wordle - Free Daily Puzzle`);
  let ogDescription = $derived(`Test your vocabulary with ${wordLength}-letter word puzzles. New challenge every day!`);
  let ogImage = $derived(`https://wordsolverx.com/og-images/${wordLength}-letter-wordle.png`);
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
