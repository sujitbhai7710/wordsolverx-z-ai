<script lang="ts">
  import GameDleAnswerPage from '$lib/components/GameDleAnswerPage.svelte';

  const modeConfig = {
    classic: { name: 'LoLdle Classic Answer', icon: '👑', color: 'border-yellow-400', bg: 'bg-yellow-50' },
    splash: { name: 'LoLdle Splash Art Answer', icon: '🎨', color: 'border-pink-400', bg: 'bg-pink-50' },
    ability: { name: 'LoLdle Ability Answer', icon: '⚡', color: 'border-blue-400', bg: 'bg-blue-50' },
    quote: { name: 'LoLdle Quote Answer', icon: '💬', color: 'border-green-400', bg: 'bg-green-50' },
  };
  const modes = ['splash', 'ability', 'quote', 'classic'];
  const regions = [
    { key: 'america', label: 'America', flag: '🇺🇸', accent: 'bg-blue-500' },
    { key: 'europe', label: 'Europe', flag: '🇪🇺', accent: 'bg-purple-500' },
  ];
  const crossLinks = [
    { href: '/narutodle-answer-today', icon: '🍥', label: 'Narutodle' },
    { href: '/pokedle-answer-today', icon: '⚡', label: 'Pokedle' },
    { href: '/smashdle-answer-today', icon: '🎮', label: 'Smashdle' },
    { href: '/dotadle-answer-today', icon: '🛡️', label: 'Dotadle' },
  ];
  const schemas = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: 'What is LoLdle?', acceptedAnswer: { '@type': 'Answer', text: 'LoLdle is a daily guessing game based on League of Legends champions.' } },
      { '@type': 'Question', name: 'How often does LoLdle reset?', acceptedAnswer: { '@type': 'Answer', text: 'The game resets every 24 hours with a new champion to guess in each mode.' } },
      { '@type': 'Question', name: 'What are the LoLdle game modes?', acceptedAnswer: { '@type': 'Answer', text: 'Classic, Quote, Ability, and Splash.' } },
    ]},
    { '@type': 'NewsArticle', headline: 'LoLdle Answer Today', description: 'Get the confirmed LoLdle answer for today.', mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://wordsolverx.com/loldle-answer-today' }, author: { '@type': 'Organization', name: 'WordSolverX' }, publisher: { '@type': 'Organization', name: 'WordSolverX', logo: { '@type': 'ImageObject', url: 'https://wordsolverx.com/logo.png' } } },
  ]};
</script>

<GameDleAnswerPage gameKey="loldle" gameTitle="LoLdle" apiGame="loldle" {modes} {modeConfig} {regions} {crossLinks} {schemas}>
  {#snippet seoContent()}
    <h2 class="text-3xl font-bold text-gray-900 mb-6">LoLdle Answers Today: Your Daily League Assistant</h2>
    <div class="prose prose-blue max-w-none text-gray-600">
      <p class="mb-4">Stuck on today's <strong>LoLdle</strong>? We've got you covered with solutions for all game modes.</p>
      <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Mastering the Modes</h3>
      <ul class="grid md:grid-cols-2 gap-4 list-none pl-0">
        <li class="bg-yellow-50 p-4 rounded-xl border border-yellow-100"><strong class="text-yellow-700 block mb-1">👑 Classic</strong>Uses clues like Gender, Position, Species, Resource, Range type, and Release year.</li>
        <li class="bg-green-50 p-4 rounded-xl border border-green-100"><strong class="text-green-700 block mb-1">💬 Quote</strong>A random voice line from a champion.</li>
        <li class="bg-blue-50 p-4 rounded-xl border border-blue-100"><strong class="text-blue-700 block mb-1">⚡ Ability</strong>Identifies a champion by one of their spell icons.</li>
        <li class="bg-pink-50 p-4 rounded-xl border border-pink-100"><strong class="text-pink-700 block mb-1">🎨 Splash</strong>Shows a zoomed-in section of a champion's skin splash art.</li>
      </ul>
      <div class="border-t border-gray-100 mt-8 pt-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Common Questions</h3>
        <div class="grid md:grid-cols-2 gap-8">
          <div><h4 class="font-bold text-gray-900 mb-2">Can I play previous days?</h4><p class="text-sm">Yes, LoLdle has an archive feature, but our page focuses on today's solutions.</p></div>
          <div><h4 class="font-bold text-gray-900 mb-2">Why are there regions?</h4><p class="text-sm">The puzzle resets based on timezone, which can lead to different answers for US and EU players.</p></div>
        </div>
      </div>
    </div>
  {/snippet}
</GameDleAnswerPage>
