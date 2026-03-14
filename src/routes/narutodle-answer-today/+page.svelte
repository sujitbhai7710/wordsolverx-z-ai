<script lang="ts">
  import GameDleAnswerPage from '$lib/components/GameDleAnswerPage.svelte';

  let { data }: { data: { answers: any[]; dateStr: string; error: string | null; } } = $props();

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
    { '@type': 'Article', headline: 'Narutodle Answer Today', description: 'Get the confirmed Narutodle answer for today.', mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://wordsolverx.com/narutodle-answer-today' }, author: { '@type': 'Organization', name: 'WordSolverX' }, publisher: { '@type': 'Organization', name: 'WordSolverX', logo: { '@type': 'ImageObject', url: 'https://wordsolverx.com/wordsolverx.webp' } } },
  ]};
</script>

<GameDleAnswerPage gameKey="narutodle" gameTitle="Narutodle" apiGame="narutodle" {modes} {modeConfig} {crossLinks} {schemas} {data}>
  {#snippet seoContent()}
    <article class="space-y-8">
      <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">What is Narutodle?</h2>
        <p class="text-lg text-gray-600 mb-6 leading-relaxed">
          Narutodle is a daily guessing game for fans of the Naruto anime and manga series. Think of it like Wordle, but instead of guessing words, you're guessing Naruto characters. Each day brings a new mystery character, and you have to figure out who it is using clues about their village, clan, rank, and abilities.
        </p>
        <p class="text-lg text-gray-600 mb-6 leading-relaxed">
          The game has multiple modes that test different aspects of your Naruto knowledge. Classic mode gives you character attributes to work with. Quote mode challenges you to identify who said a particular line. Eye mode tests your knowledge of the various dōjutsu (eye techniques) in the series. Jutsu mode asks you to name techniques from their descriptions. Each mode offers a different way to engage with the Naruto universe.
        </p>
        <p class="text-lg text-gray-600 leading-relaxed">
          What makes Narutodle special is how it connects with the fandom. If you've watched Naruto, read the manga, or played the games, you have knowledge that can help you succeed. The game rewards deep familiarity with the series — knowing which characters come from which villages, which clans have which kekkei genkai, and which jutsu belong to which characters.
        </p>
      </section>

      <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Narutodle Game Modes Explained</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
            <h3 class="text-xl font-bold text-yellow-700 mb-3 flex items-center gap-2">👑 Classic Mode</h3>
            <p class="text-gray-600">
              The traditional guessing experience. You're shown attributes like Village (Hidden Leaf, Sand, Mist, etc.), Clan (Uchiha, Hyuga, Uzumaki, etc.), Rank (Genin, Chunin, Jonin, Kage), Nature Type, and Debut. Use these clues to narrow down the possibilities.
            </p>
          </div>
          <div class="bg-green-50 p-6 rounded-2xl border border-green-100">
            <h3 class="text-xl font-bold text-green-700 mb-3 flex items-center gap-2">💬 Quote Mode</h3>
            <p class="text-gray-600">
              Read a famous line from the series and guess who said it. This mode tests your memory of iconic moments and character personalities. Some quotes are obvious, others will really make you think.
            </p>
          </div>
          <div class="bg-purple-50 p-6 rounded-2xl border border-purple-100">
            <h3 class="text-xl font-bold text-purple-700 mb-3 flex items-center gap-2">👁️ Eye Mode</h3>
            <p class="text-gray-600">
              Identify characters by their dōjutsu — the special eye techniques like Sharingan, Byakugan, and Rinnegan. You'll see an image of the eyes and need to figure out whose they are.
            </p>
          </div>
          <div class="bg-orange-50 p-6 rounded-2xl border border-orange-100">
            <h3 class="text-xl font-bold text-orange-700 mb-3 flex items-center gap-2">🔥 Jutsu Mode</h3>
            <p class="text-gray-600">
              Given a description or visual of a jutsu (ninja technique), name the character associated with it. From Rasengan to Chidori to Amaterasu, test your knowledge of the ninja arts.
            </p>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Tips for Getting Better at Narutodle</h2>
        <div class="space-y-4 text-lg text-gray-600">
          <p class="leading-relaxed">
            Want to improve your Narutodle game? Here are some strategies that actually help:
          </p>
          <ul class="list-disc list-inside space-y-3 ml-4">
            <li><strong class="text-gray-900">Know your villages</strong> — Understanding which characters come from which hidden villages is fundamental. The five great nations (Leaf, Sand, Mist, Cloud, Stone) have distinct rosters of characters.</li>
            <li><strong class="text-gray-900">Learn the clans</strong> — Clans like Uchiha, Hyuga, Uzumaki, and Senju have unique abilities. If you see a Sharingan reference, think Uchiha. Byakugan? Think Hyuga.</li>
            <li><strong class="text-gray-900">Remember the ranks</strong> — Most main characters are Genin or Chunin early in the series but become Jonin or higher later. Consider the timeline when guessing.</li>
            <li><strong class="text-gray-900">Study the jutsu</strong> — Signature moves are tied to specific characters. Rasengan is Naruto's (and Jiraiya's and Minato's), Chidori is Sasuke's (and Kakashi's).</li>
            <li><strong class="text-gray-900">Watch for debut info</strong> — The "Debut" clue tells you when the character first appeared. Early debut usually means a more central character.</li>
          </ul>
        </div>
      </section>

      <section class="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-3xl p-8 border border-orange-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Why Naruto Fans Love Narutodle</h2>
        <div class="space-y-4 text-lg text-gray-600">
          <p class="leading-relaxed">
            There's something special about a game that rewards you for being a fan. Every episode you've watched, every chapter you've read, every discussion you've had about power levels and character backstories — all of that knowledge becomes useful in Narutodle.
          </p>
          <p class="leading-relaxed">
            The game also keeps the fandom active between new releases. Whether you're waiting for Boruto episodes or just feeling nostalgic about the original series, Narutodle gives you a daily reason to think about the Naruto universe.
          </p>
          <p class="leading-relaxed">
            Plus, the multiple game modes mean you're never doing the same thing every day. One day you might ace Quote mode because you remember a specific scene, while the next day Jutsu mode challenges you to recall techniques you haven't thought about in years. It keeps things fresh while staying true to the source material.
          </p>
        </div>
      </section>
    </article>
  {/snippet}
</GameDleAnswerPage>
