<script lang="ts">
  import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isAfter } from 'date-fns';

  let {
    gameName,
    gameColor = 'emerald',
    gameIcon = '📅',
    startDate,
    slugPrefix,
    formatSlug,
    description = '',
  }: {
    gameName: string;
    gameColor?: string;
    gameIcon?: string;
    startDate: Date;
    slugPrefix: string;
    formatSlug: (date: Date) => string;
    description?: string;
  } = $props();

  const today = new Date();
  let currentMonth = $state(new Date(today.getFullYear(), today.getMonth(), 1));
  let viewMode: 'calendar' | 'list' = $state('calendar');
  let searchQuery = $state('');

  // All puzzles from start to today
  let allPuzzles = $derived.by(() => {
    const result: { date: Date; dayNum: number; slug: string; formatted: string }[] = [];
    let d = new Date(startDate);
    let num = 1;
    while (d <= today) {
      result.push({
        date: new Date(d),
        dayNum: num,
        slug: `/${slugPrefix}${formatSlug(d)}`,
        formatted: format(d, 'MMMM d, yyyy'),
      });
      d = addDays(d, 1);
      num++;
    }
    return result.reverse();
  });

  // Calendar grid dates for current month
  let calendarDays = $derived.by(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const days: Date[] = [];
    let d = calStart;
    while (d <= calEnd) {
      days.push(new Date(d));
      d = addDays(d, 1);
    }
    return days;
  });

  // Lookup set for puzzle dates
  let puzzleDateSet = $derived.by(() => {
    const set = new Map<string, { dayNum: number; slug: string }>();
    for (const p of allPuzzles) {
      set.set(format(p.date, 'yyyy-MM-dd'), { dayNum: p.dayNum, slug: p.slug });
    }
    return set;
  });

  // Filtered list for search
  let filteredPuzzles = $derived.by(() => {
    if (!searchQuery.trim()) return allPuzzles.slice(0, 50);
    const q = searchQuery.toLowerCase();
    return allPuzzles.filter(p => 
      p.formatted.toLowerCase().includes(q) || 
      String(p.dayNum).includes(q)
    ).slice(0, 50);
  });

  // Months with puzzles (for quick nav)
  let availableMonths = $derived.by(() => {
    const months: { label: string; date: Date }[] = [];
    let d = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const endMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
    while (d <= endMonthDate) {
      months.push({ label: format(d, 'MMM yyyy'), date: new Date(d) });
      d = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    }
    return months.reverse();
  });

  function prevMonth() {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  }
  function nextMonth() {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    if (next <= new Date(today.getFullYear(), today.getMonth(), 1)) {
      currentMonth = next;
    }
  }
  function goToMonth(date: Date) {
    currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  }

  const colorMap: Record<string, { bg: string; text: string; border: string; ring: string; gradient: string; hover: string; badge: string }> = {
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', ring: 'ring-emerald-500', gradient: 'from-emerald-500 to-teal-600', hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/40', badge: 'bg-emerald-500' },
    blue: { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', ring: 'ring-blue-500', gradient: 'from-blue-500 to-indigo-600', hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/40', badge: 'bg-blue-500' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800', ring: 'ring-purple-500', gradient: 'from-purple-500 to-violet-600', hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/40', badge: 'bg-purple-500' },
    orange: { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800', ring: 'ring-orange-500', gradient: 'from-orange-500 to-amber-600', hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/40', badge: 'bg-orange-500' },
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950/30', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800', ring: 'ring-indigo-500', gradient: 'from-indigo-500 to-purple-600', hover: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/40', badge: 'bg-indigo-500' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', ring: 'ring-amber-500', gradient: 'from-amber-500 to-orange-600', hover: 'hover:bg-amber-100 dark:hover:bg-amber-900/40', badge: 'bg-amber-500' },
    sky: { bg: 'bg-sky-50 dark:bg-sky-950/30', text: 'text-sky-600 dark:text-sky-400', border: 'border-sky-200 dark:border-sky-800', ring: 'ring-sky-500', gradient: 'from-sky-500 to-cyan-600', hover: 'hover:bg-sky-100 dark:hover:bg-sky-900/40', badge: 'bg-sky-500' },
  };

  let colors = $derived(colorMap[gameColor] || colorMap.emerald);
  let isNextDisabled = $derived(
    currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() === today.getMonth()
  );
  let isPrevDisabled = $derived(
    currentMonth.getFullYear() === startDate.getFullYear() && currentMonth.getMonth() === startDate.getMonth()
  );
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    <!-- Hero Header -->
    <header class="text-center mb-10">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br {colors.gradient} text-white text-3xl mb-4 shadow-lg shadow-{gameColor}-500/20">
        {gameIcon}
      </div>
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r {colors.gradient} bg-clip-text text-transparent mb-3 tracking-tight">
        {gameName} Archive
      </h1>
      <p class="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
        {description || `Browse the complete history of all ${gameName} answers`}
      </p>
      <div class="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full {colors.bg} {colors.text} text-sm font-semibold">
        <span class="w-2 h-2 rounded-full {colors.badge} animate-pulse"></span>
        {allPuzzles.length} puzzles archived
      </div>
    </header>

    <!-- Controls Bar -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      <!-- View Toggle -->
      <div class="inline-flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-700">
        <button
          onclick={() => viewMode = 'calendar'}
          class="px-4 py-2 rounded-lg text-sm font-semibold transition-all {viewMode === 'calendar' ? `bg-gradient-to-r ${colors.gradient} text-white shadow-md` : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}"
        >
          📅 Calendar
        </button>
        <button
          onclick={() => viewMode = 'list'}
          class="px-4 py-2 rounded-lg text-sm font-semibold transition-all {viewMode === 'list' ? `bg-gradient-to-r ${colors.gradient} text-white shadow-md` : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}"
        >
          📋 List
        </button>
      </div>

      <!-- Search -->
      <div class="relative w-full sm:w-72">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search by date or puzzle #..."
          class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 {colors.ring}/50 transition-shadow"
        />
      </div>
    </div>

    <!-- Calendar View -->
    {#if viewMode === 'calendar' && !searchQuery.trim()}
      <div class="bg-white dark:bg-gray-800/80 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
        <!-- Month Navigation -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r {colors.bg}">
          <button
            aria-label="Previous Month"
            onclick={prevMonth}
            disabled={isPrevDisabled}
            class="p-2 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div class="text-center">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">{format(currentMonth, 'MMMM yyyy')}</h2>
          </div>
          <button
            aria-label="Next Month"
            onclick={nextMonth}
            disabled={isNextDisabled}
            class="p-2 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

        <!-- Quick Month Jump -->
        <div class="px-6 py-3 border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
          <div class="flex gap-1.5 min-w-max">
            {#each availableMonths.slice(0, 12) as m}
              <button
                onclick={() => goToMonth(m.date)}
                class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all {
                  m.date.getMonth() === currentMonth.getMonth() && m.date.getFullYear() === currentMonth.getFullYear()
                    ? `bg-gradient-to-r ${colors.gradient} text-white shadow-sm`
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                }"
              >
                {m.label}
              </button>
            {/each}
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="p-4 sm:p-6">
          <!-- Day Headers -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            {#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
              <div class="text-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider py-2">{day}</div>
            {/each}
          </div>

          <!-- Date Cells -->
          <div class="grid grid-cols-7 gap-1">
            {#each calendarDays as day}
              {@const key = format(day, 'yyyy-MM-dd')}
              {@const puzzle = puzzleDateSet.get(key)}
              {@const isCurrentMonth = isSameMonth(day, currentMonth)}
              {@const isToday = isSameDay(day, today)}
              {@const isFuture = isAfter(day, today)}
              
              {#if puzzle && isCurrentMonth}
                <a
                  href={puzzle.slug}
                  class="relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 {colors.hover} {colors.border} border group cursor-pointer"
                  title="{gameName} #{puzzle.dayNum} - {format(day, 'MMMM d, yyyy')}"
                >
                  <span class="text-gray-900 dark:text-white text-base">{format(day, 'd')}</span>
                  <span class="text-[10px] {colors.text} font-bold opacity-70 group-hover:opacity-100">#{puzzle.dayNum}</span>
                  {#if isToday}
                    <span class="absolute top-1 right-1 w-2 h-2 rounded-full {colors.badge} animate-pulse"></span>
                  {/if}
                </a>
              {:else}
                <div class="aspect-square flex items-center justify-center rounded-xl text-sm {
                  isCurrentMonth ? (isFuture ? 'text-gray-300 dark:text-gray-600' : 'text-gray-400 dark:text-gray-600') : 'text-gray-200 dark:text-gray-700'
                }">
                  {format(day, 'd')}
                </div>
              {/if}
            {/each}
          </div>
        </div>

        <!-- Legend -->
        <div class="px-6 py-3 border-t border-gray-100 dark:border-gray-700 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div class="flex items-center gap-1.5">
            <div class="w-4 h-4 rounded {colors.bg} {colors.border} border"></div>
            <span>Has answer</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-2 h-2 rounded-full {colors.badge} animate-pulse"></div>
            <span>Today</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800"></div>
            <span>No data</span>
          </div>
        </div>
      </div>

    <!-- List View / Search Results -->
    {:else}
      <div class="bg-white dark:bg-gray-800/80 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r {colors.bg}">
          <h2 class="font-bold text-gray-900 dark:text-white">
            {#if searchQuery.trim()}
              Search Results ({filteredPuzzles.length}{filteredPuzzles.length === 50 ? '+' : ''})
            {:else}
              Recent Puzzles
            {/if}
          </h2>
        </div>
        <div class="divide-y divide-gray-100 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
          {#each filteredPuzzles as puzzle}
            <a
              href={puzzle.slug}
              class="flex items-center justify-between px-6 py-3.5 {colors.hover} transition-colors group"
            >
              <div class="flex items-center gap-3">
                <span class="inline-flex items-center justify-center w-10 h-10 rounded-xl {colors.bg} {colors.text} font-bold text-sm">
                  #{puzzle.dayNum}
                </span>
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white text-sm group-hover:underline">{gameName} #{puzzle.dayNum}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{puzzle.formatted}</p>
                </div>
              </div>
              <svg class="w-4 h-4 text-gray-400 group-hover:{colors.text} transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          {/each}
          {#if filteredPuzzles.length === 0}
            <div class="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <p class="font-medium">No puzzles found</p>
              <p class="text-sm mt-1">Try a different search term</p>
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Back to Archives -->
    <div class="mt-8 text-center">
      <a href="/archive" class="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        Back to All Archives
      </a>
    </div>
  </div>
</div>
