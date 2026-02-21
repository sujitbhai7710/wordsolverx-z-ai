<script lang="ts">
  import GameDleAnswerPage from '$lib/components/GameDleAnswerPage.svelte';

  const modeConfig = {
    classic: { name: 'Smashdle Classic Answer', icon: '👑', color: 'border-yellow-400', bg: 'bg-yellow-50' },
    emoji: { name: 'Smashdle Emoji Answer', icon: '😀', color: 'border-pink-400', bg: 'bg-pink-50' },
    silhouette: { name: 'Smashdle Silhouette Answer', icon: '👤', color: 'border-purple-400', bg: 'bg-purple-50' },
    finalSmash: { name: 'Smashdle Final Smash Answer', icon: '💥', color: 'border-red-400', bg: 'bg-red-50' },
    kirby: { name: 'Smashdle Kirby Copy Answer', icon: '🩷', color: 'border-pink-400', bg: 'bg-pink-50' },
  };
  const modes = ['classic', 'emoji', 'silhouette', 'finalSmash', 'kirby'];
  const gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  const regions = [
    { key: 'america', label: 'America', flag: '🇺🇸', accent: 'bg-red-500' },
    { key: 'europe', label: 'Europe', flag: '🇪🇺', accent: 'bg-pink-500' },
  ];
  const crossLinks = [
    { href: '/narutodle-answer-today', icon: '🍥', label: 'Narutodle' },
    { href: '/loldle-answer-today', icon: '⚔️', label: 'LoLdle' },
    { href: '/pokedle-answer-today', icon: '⚡', label: 'Pokedle' },
    { href: '/dotadle-answer-today', icon: '🛡️', label: 'Dotadle' },
  ];
  const schemas = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: 'What is Smashdle?', acceptedAnswer: { '@type': 'Answer', text: 'Smashdle is a daily trivia game based on Super Smash Bros Ultimate characters.' } },
      { '@type': 'Question', name: 'What are the Smashdle modes?', acceptedAnswer: { '@type': 'Answer', text: 'Classic, Emoji, Silhouette, Final Smash, and Kirby Copy.' } },
    ]},
    { '@type': 'NewsArticle', headline: 'Smashdle Answer Today', description: 'Get the confirmed Smashdle answer for today.', mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://wordsolverx.com/smashdle-answer-today' }, author: { '@type': 'Organization', name: 'WordSolverX' }, publisher: { '@type': 'Organization', name: 'WordSolverX', logo: { '@type': 'ImageObject', url: 'https://wordsolverx.com/logo.png' } } },
  ]};
</script>

<GameDleAnswerPage gameKey="smashdle" gameTitle="Smashdle" apiGame="smashdle" {modes} {modeConfig} {gridCols} {regions} {crossLinks} {schemas}>
  {#snippet seoContent()}
    <h2 class="text-3xl font-bold text-gray-900 mb-6">Smashdle Solutions: Daily Smash Bros Trivia</h2>
    <div class="prose prose-red max-w-none text-gray-600">
      <p class="mb-4">Welcome to the arena! Find all <strong>Smashdle answers today</strong> right here.</p>
      <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Fighter Modes Breakdown</h3>
      <ul class="grid md:grid-cols-2 gap-4 list-none pl-0">
        <li class="bg-red-50 p-4 rounded-xl border border-red-100"><strong class="text-red-700 block mb-1">👑 Classic</strong>Guess the fighter by Series, Release date, Weight, Speed.</li>
        <li class="bg-pink-50 p-4 rounded-xl border border-pink-100"><strong class="text-pink-700 block mb-1">😀 Emoji</strong>Decipher the character from representative emojis.</li>
        <li class="bg-purple-50 p-4 rounded-xl border border-purple-100"><strong class="text-purple-700 block mb-1">👤 Silhouette</strong>Identify the character from their shadow.</li>
        <li class="bg-red-50 p-4 rounded-xl border border-red-100"><strong class="text-red-700 block mb-1">💥 Final Smash</strong>Recognize the character's ultimate move.</li>
        <li class="bg-pink-50 p-4 rounded-xl border border-pink-100"><strong class="text-pink-700 block mb-1">🩷 Kirby Copy</strong>Guess which fighter Kirby inhaled!</li>
      </ul>
    </div>
  {/snippet}
</GameDleAnswerPage>
