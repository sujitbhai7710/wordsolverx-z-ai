<script lang="ts">
  import GameDleAnswerPage from '$lib/components/GameDleAnswerPage.svelte';

  let { data }: { data: { answers: any[]; dateStr: string; error: string | null; } } = $props();

  const modeConfig = {
    classic: { name: 'Pokédle Classic Answer', icon: '👑', color: 'border-yellow-400', bg: 'bg-yellow-50' },
    silhouette: { name: 'Pokédle Silhouette Answer', icon: '👤', color: 'border-purple-400', bg: 'bg-purple-50' },
    flavor: { name: 'Pokédle Flavor Text Answer', icon: '📖', color: 'border-green-400', bg: 'bg-green-50' },
    card: { name: 'Pokédle Card Answer', icon: '🃏', color: 'border-blue-400', bg: 'bg-blue-50' },
  };
  const modes = ['classic', 'silhouette', 'flavor', 'card'];
  const regions = [
    { key: 'america', label: 'America', flag: '🇺🇸', accent: 'bg-yellow-500' },
    { key: 'europe', label: 'Europe', flag: '🇪🇺', accent: 'bg-red-500' },
  ];
  const crossLinks = [
    { href: '/narutodle-answer-today', icon: '🍥', label: 'Narutodle' },
    { href: '/loldle-answer-today', icon: '⚔️', label: 'LoLdle' },
    { href: '/smashdle-answer-today', icon: '🎮', label: 'Smashdle' },
    { href: '/dotadle-answer-today', icon: '🛡️', label: 'Dotadle' },
  ];
  const schemas = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: 'What is Pokedle?', acceptedAnswer: { '@type': 'Answer', text: 'Pokedle is a Pokémon-themed daily guessing game inspired by Wordle.' } },
      { '@type': 'Question', name: 'What are the Pokedle game modes?', acceptedAnswer: { '@type': 'Answer', text: 'Modes include Classic, Silhouette, Flavor Text, and Card.' } },
    ]},
    { '@type': 'NewsArticle', headline: 'Pokedle Answer Today', description: 'Get the confirmed Pokedle answer for today.', mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://wordsolverx.com/pokedle-answer-today' }, author: { '@type': 'Organization', name: 'WordSolverX' }, publisher: { '@type': 'Organization', name: 'WordSolverX', logo: { '@type': 'ImageObject', url: 'https://wordsolverx.com/logo.png' } } },
  ]};
</script>

<GameDleAnswerPage gameKey="pokedle" gameTitle="Pokedle" apiGame="pokedle" {modes} {modeConfig} {regions} {crossLinks} {schemas} {data}>
  {#snippet seoContent()}
    <article class="space-y-8">
      <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">What is Pokedle?</h2>
        <p class="text-lg text-gray-600 mb-6 leading-relaxed">
          Pokedle is a daily guessing game that challenges your Pokémon knowledge. Inspired by Wordle but built for Pokémon fans, it asks you to identify a mystery Pokémon each day using clues. With over 1,000 Pokémon now in existence, there's plenty of variety to keep you guessing.
        </p>
        <p class="text-lg text-gray-600 mb-6 leading-relaxed">
          The game taps into decades of Pokémon history. Whether you started with Red and Blue in the 90s or picked up Pokémon Scarlet and Violet recently, your knowledge matters. Every Pokémon you've caught, every type matchup you've memorized, every Pokédex entry you've read — all of it helps you succeed.
        </p>
        <p class="text-lg text-gray-600 leading-relaxed">
          What makes Pokedle special is how it celebrates the franchise's depth. The Pokémon world has always been about discovery and learning, and this game captures that spirit perfectly. Each day brings a new opportunity to test your expertise and maybe learn something new along the way.
        </p>
      </section>

      <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Pokedle Game Modes Explained</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
            <h3 class="text-xl font-bold text-yellow-700 mb-3 flex items-center gap-2">👑 Classic Mode</h3>
            <p class="text-gray-600">
              The traditional guessing experience. You get clues about the Pokémon's type, generation, height, weight, and evolution stage. Use these to narrow down possibilities. Green means correct, yellow means close, and red means wrong.
            </p>
          </div>
          <div class="bg-purple-50 p-6 rounded-2xl border border-purple-100">
            <h3 class="text-xl font-bold text-purple-700 mb-3 flex items-center gap-2">👤 Silhouette Mode</h3>
            <p class="text-gray-600">
              Remember "Who's that Pokémon?" from the anime? This mode shows you a black silhouette, and you need to identify which Pokémon it is. Some are instantly recognizable, others are surprisingly tricky.
            </p>
          </div>
          <div class="bg-green-50 p-6 rounded-2xl border border-green-100">
            <h3 class="text-xl font-bold text-green-700 mb-3 flex items-center gap-2">📖 Flavor Text Mode</h3>
            <p class="text-gray-600">
              Read a Pokédex entry and guess which Pokémon it describes. These descriptions often contain hints about the Pokémon's behavior, habitat, or abilities. It tests your knowledge of Pokémon lore.
            </p>
          </div>
          <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h3 class="text-xl font-bold text-blue-700 mb-3 flex items-center gap-2">🃏 Card Mode</h3>
            <p class="text-gray-600">
              A cropped section of a Pokémon Trading Card is shown. You need to identify which Pokémon appears on the card. This mode rewards collectors and players familiar with the TCG artwork.
            </p>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Tips for Getting Better at Pokedle</h2>
        <div class="space-y-4 text-lg text-gray-600">
          <p class="leading-relaxed">
            Want to improve your Pokedle game? Here are strategies that actually help:
          </p>
          <ul class="list-disc list-inside space-y-3 ml-4">
            <li><strong class="text-gray-900">Know your types</strong> — Understanding type combinations is crucial. A Fire/Ground Pokémon like Numel is very different from a pure Fire type like Growlithe. Dual types narrow down possibilities significantly.</li>
            <li><strong class="text-gray-900">Learn generation patterns</strong> — Each generation has its own style and themes. Gen 1 introduced the original 151, Gen 2 added baby Pokémon and evolutions, Gen 5 had all-new Pokémon with no previous evolutions. Knowing these patterns helps.</li>
            <li><strong class="text-gray-900">Memorize evolution stages</strong> — Is it a basic Pokémon, stage 1, or stage 2? This clue alone can eliminate hundreds of options. Legendaries and mythicals are always basic Pokémon.</li>
            <li><strong class="text-gray-900">Study silhouettes</strong> — For Silhouette mode, pay attention to distinctive shapes. Pikachu's ears, Charizard's wings, Gengar's spikes — many Pokémon have instantly recognizable outlines.</li>
            <li><strong class="text-gray-900">Read Pokédex entries</strong> — For Flavor Text mode, familiarity with Pokédex descriptions is key. Many entries mention specific behaviors, habitats, or abilities that point to the answer.</li>
          </ul>
        </div>
      </section>

      <section class="bg-gradient-to-r from-yellow-50 to-red-50 rounded-3xl p-8 border border-yellow-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Why Pokémon Fans Love Pokedle</h2>
        <div class="space-y-4 text-lg text-gray-600">
          <p class="leading-relaxed">
            Pokedle connects with Pokémon fans because it rewards the knowledge you've built through playing the games. Every Pokémon you've caught, every type you've memorized, every card you've collected — it all contributes to your Pokedle skills.
          </p>
          <p class="leading-relaxed">
            The game also keeps fans engaged with the franchise even when they're not actively playing a Pokémon game. It's a quick daily activity that takes just a few minutes but keeps you thinking about the world of Pokémon. Many trainers make it part of their daily routine.
          </p>
          <p class="leading-relaxed">
            Plus, with over 1,000 Pokémon spanning nine generations, there's always more to learn. Even veteran players encounter Pokémon they're less familiar with, making every day's puzzle a genuine challenge. The game grows with the franchise, staying fresh as new Pokémon are introduced.
          </p>
        </div>
      </section>
    </article>
  {/snippet}
</GameDleAnswerPage>
