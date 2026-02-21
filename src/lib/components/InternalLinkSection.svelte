<script lang="ts">
  interface GameLink {
    name: string;
    href: string;
    icon: string;
  }

  let { currentGame = '' }: { currentGame?: string } = $props();

  const answerTodayLinks: GameLink[] = [
    { name: 'Wordle Today', href: '/wordle-answer-today', icon: '📝' },
    { name: 'Quordle Today', href: '/quordle-answer-today', icon: '🧩' },
    { name: 'Colordle Today', href: '/colordle-answer-today', icon: '🎨' },
    { name: 'Semantle Today', href: '/semantle-answer-today', icon: '🔍' },
    { name: 'Phoodle Today', href: '/phoodle-answer-today', icon: '🍕' },
  ];

  const archiveLinks: GameLink[] = [
    { name: 'Wordle Archive', href: '/wordle-answer-archive', icon: '📅' },
    { name: 'Quordle Archive', href: '/quordle-archive', icon: '📅' },
    { name: 'Colordle Archive', href: '/colordle-archive', icon: '📅' },
    { name: 'Semantle Archive', href: '/semantle-archive', icon: '📅' },
    { name: 'Phoodle Archive', href: '/phoodle-archive', icon: '📅' },
  ];
</script>

<section class="mt-16 border-t border-gray-200 dark:border-gray-700 pt-12 max-w-4xl mx-auto px-4">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
    <!-- Daily Answer Pages -->
    <div>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <span class="text-2xl">🔥</span> Today's Game Answers
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {#each answerTodayLinks as link}
          <a
            href={link.href}
            class="flex items-center gap-3 p-3 rounded-xl border transition-all {currentGame === link.name.split(' ')[0]
              ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 pointer-events-none'
              : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 hover:shadow-sm'}"
          >
            <span class="text-lg">{link.icon}</span>
            <span class="font-medium {currentGame === link.name.split(' ')[0] ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}">
              {link.name}
            </span>
          </a>
        {/each}
      </div>
    </div>

    <!-- Archive Pages -->
    <div>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <span class="text-2xl">📚</span> Past Solutions Archive
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {#each archiveLinks as link}
          <a
            href={link.href}
            class="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:shadow-sm"
          >
            <span class="text-lg">{link.icon}</span>
            <span class="text-gray-700 dark:text-gray-300 font-medium">{link.name}</span>
          </a>
        {/each}
      </div>
    </div>
  </div>

  <div class="mt-12 text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
    <p class="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
      Stuck on a tricky puzzle?
      <a href="/all-wordle-solver" class="text-blue-600 dark:text-blue-400 hover:underline mx-1 font-bold">Try our All Wordle Solver</a>
      to solve any letter wordle within seconds. Supports 4 to 12 letter words!
    </p>
  </div>
</section>
