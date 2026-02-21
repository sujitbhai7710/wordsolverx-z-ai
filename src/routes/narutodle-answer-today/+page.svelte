<script lang="ts">
  import GameDleAnswerPage from '$lib/components/GameDleAnswerPage.svelte';

  const modeConfig = {
    classic: { name: 'Narutodle Classic Answer', icon: '👑', color: 'border-yellow-400', bg: 'bg-yellow-50' },
    quote: { name: 'Narutodle Quote Answer', icon: '💬', color: 'border-green-400', bg: 'bg-green-50' },
    eye: { name: 'Narutodle Eye Answer', icon: '👁️', color: 'border-purple-400', bg: 'bg-purple-50' },
    jutsu: { name: 'Narutodle Jutsu Answer', icon: '🔥', color: 'border-orange-400', bg: 'bg-orange-50' },
  };
  const modes = ['quote', 'classic', 'eye', 'jutsu'];
  const crossLinks = [
    { href: '/dotadle-answer-today', icon: '🛡️', label: 'Dotadle' },
    { href: '/loldle-answer-today', icon: '⚔️', label: 'LoLdle' },
    { href: '/pokedle-answer-today', icon: '⚡', label: 'Pokedle' },
    { href: '/smashdle-answer-today', icon: '🎮', label: 'Smashdle' },
  ];
  const schemas = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: 'When does Narutodle reset?', acceptedAnswer: { '@type': 'Answer', text: 'Narutodle resets daily at midnight UTC.' } },
      { '@type': 'Question', name: 'What is Narutodle?', acceptedAnswer: { '@type': 'Answer', text: 'Narutodle is a daily Naruto-themed guessing game with modes for quotes, eye techniques, jutsu, and classical character trivia.' } },
    ]},
    { '@type': 'NewsArticle', headline: 'Narutodle Answer Today', description: 'Get the confirmed Narutodle answer for today.', mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://wordsolverx.com/narutodle-answer-today' }, author: { '@type': 'Organization', name: 'WordSolverX' }, publisher: { '@type': 'Organization', name: 'WordSolverX', logo: { '@type': 'ImageObject', url: 'https://wordsolverx.com/logo.png' } } },
  ]};
</script>

<GameDleAnswerPage gameKey="narutodle" gameTitle="Narutodle" apiGame="narutodle" {modes} {modeConfig} {crossLinks} {schemas}>
  {#snippet seoContent()}
    <h2 class="text-3xl font-bold text-gray-900 mb-6">Daily Narutodle Solutions for Anime Fans</h2>
    <div class="prose prose-orange max-w-none text-gray-600">
      <p class="mb-4">Believe it! Get the latest <strong>Narutodle answers today</strong> for every game mode. Test your knowledge of the Hidden Leaf and beyond.</p>
      <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Ninja Guessing Modes</h3>
      <ul class="grid md:grid-cols-2 gap-4 list-none pl-0">
        <li class="bg-yellow-50 p-4 rounded-xl border border-yellow-100"><strong class="text-yellow-700 block mb-1">👑 Classic</strong>Guess the character using Village, Clan, Rank, Nature Type, and Debut.</li>
        <li class="bg-green-50 p-4 rounded-xl border border-green-100"><strong class="text-green-700 block mb-1">💬 Quote</strong>Identify the character from a famous quote or dialogue.</li>
        <li class="bg-purple-50 p-4 rounded-xl border border-purple-100"><strong class="text-purple-700 block mb-1">👁️ Eye</strong>Recognize the Dōjutsu or eye technique shown.</li>
        <li class="bg-orange-50 p-4 rounded-xl border border-orange-100"><strong class="text-orange-700 block mb-1">🔥 Jutsu</strong>Name the jutsu from its visual description or animation.</li>
      </ul>
    </div>
  {/snippet}
</GameDleAnswerPage>
