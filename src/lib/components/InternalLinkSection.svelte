<script lang="ts">
  import { ARCHIVE_STATIC_ROUTES, TODAY_STATIC_ROUTES } from '$lib/route-registry';

  interface GameLink {
    name: string;
    href: string;
    icon: string;
  }

  let { currentGame = '' }: { currentGame?: string } = $props();

  const todayIconMap: Record<string, string> = {
    Wordle: 'Wd',
    Worldle: 'Wr',
    Betweenle: 'Bt',
    Colorfle: 'Cf',
    Nerdle: 'Nd',
    Phoodle: 'Ph',
    Quordle: 'Qd',
    Colordle: 'Cd',
    Countryle: 'Cy',
    Framed: 'Fr',
    Semantle: 'Se',
    Waffle: 'Wf',
    Globle: 'Gb',
    Contexto: 'Cx',
    Searchle: 'Sr',
    Phrazle: 'Pz',
    Spotle: 'Sp'
  };

  const archiveIconMap: Record<string, string> = {
    Wordle: 'Wd',
    Quordle: 'Qd',
    Colorfle: 'Cf',
    Colordle: 'Cd',
    Countryle: 'Cy',
    Framed: 'Fr',
    Semantle: 'Se',
    Phoodle: 'Ph',
    Globle: 'Gb',
    Waffle: 'Wf',
    Worldle: 'Wr',
    Nerdle: 'Nd',
    Searchle: 'Sr',
    Contexto: 'Cx',
    Phrazle: 'Pz',
    Spotle: 'Sp'
  };

  function prettifyRoute(route: string) {
    return route
      .replace(/^\//, '')
      .replace(/-answer-today$/, '')
      .replace(/-archive$/, '')
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  function buildLinkName(route: string, suffix: 'Today' | 'Archive') {
    const baseName = prettifyRoute(route);
    return `${baseName} ${suffix}`;
  }

  const answerTodayLinks: GameLink[] = TODAY_STATIC_ROUTES
    .filter((route) => route !== '/today')
    .map((route) => {
      const baseName = prettifyRoute(route);
      return {
        name: buildLinkName(route, 'Today'),
        href: route,
        icon: todayIconMap[baseName] ?? baseName.slice(0, 2)
      };
    })
    .filter((link) => link.name.split(' ')[0] !== currentGame)
    .slice(0, 10);

  const archiveLinks: GameLink[] = ARCHIVE_STATIC_ROUTES
    .map((route) => {
      const baseName = prettifyRoute(route);
      return {
        name: buildLinkName(route, 'Archive'),
        href: route,
        icon: archiveIconMap[baseName] ?? baseName.slice(0, 2)
      };
    })
    .filter((link) => link.name.split(' ')[0] !== currentGame)
    .slice(0, 10);
</script>

<section class="mt-16 border-t border-gray-200 dark:border-gray-700 pt-12 max-w-4xl mx-auto px-4">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
    <div>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <span class="text-2xl">TD</span> Today's Game Answers
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {#each answerTodayLinks as link}
          <a
            href={link.href}
            class="flex items-center gap-3 p-3 rounded-xl border transition-all {currentGame === link.name.split(' ')[0]
              ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 pointer-events-none'
              : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 hover:shadow-sm'}"
          >
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-200">{link.icon}</span>
            <span class="font-medium {currentGame === link.name.split(' ')[0] ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}">
              {link.name}
            </span>
          </a>
        {/each}
      </div>
    </div>

    <div>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <span class="text-2xl">AR</span> Past Solutions Archive
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {#each archiveLinks as link}
          <a
            href={link.href}
            class="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:shadow-sm"
          >
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-200">{link.icon}</span>
            <span class="text-gray-700 dark:text-gray-300 font-medium">{link.name}</span>
          </a>
        {/each}
      </div>
    </div>
  </div>

  <div class="mt-12 text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
    <p class="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
      Stuck on a tricky puzzle?
      <a href="/wordle-solver" class="text-blue-700 dark:text-blue-300 hover:underline mx-1 font-bold">Try our All Wordle Solver</a>
      to solve any letter wordle within seconds. Supports 4 to 12 letter words!
    </p>
  </div>
</section>
