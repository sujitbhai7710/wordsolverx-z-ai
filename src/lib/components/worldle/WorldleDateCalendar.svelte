<script lang="ts">
  import {
    addDays,
    endOfMonth,
    endOfWeek,
    format,
    isAfter,
    isBefore,
    isSameMonth,
    startOfMonth,
    startOfWeek,
    subMonths,
    addMonths,
  } from 'date-fns';

  let {
    displayMonth,
    todayDate,
    selectedDate = null,
    minDate = '2022-01-21',
    onSelectDate,
    onSelectMonth,
  }: {
    displayMonth: Date;
    todayDate: string;
    selectedDate?: string | null;
    minDate?: string;
    onSelectDate?: (date: string) => void | Promise<void>;
    onSelectMonth?: (month: Date) => void;
  } = $props();

  function stringToDate(value: string): Date {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  let days = $derived.by(() => {
    const monthStart = startOfMonth(displayMonth);
    const monthEnd = endOfMonth(displayMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const result: Date[] = [];

    let cursor = calendarStart;

    while (cursor <= calendarEnd) {
      result.push(new Date(cursor));
      cursor = addDays(cursor, 1);
    }

    return result;
  });

  let minimumDate = $derived(stringToDate(minDate));
  let maximumDate = $derived(stringToDate(todayDate));
  let previousMonth = $derived(subMonths(displayMonth, 1));
  let nextMonth = $derived(addMonths(displayMonth, 1));
  let canGoPrev = $derived(!isBefore(endOfMonth(previousMonth), minimumDate));
  let canGoNext = $derived(!isAfter(startOfMonth(nextMonth), maximumDate));

  function toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function handleMonthClick(date: Date): void {
    onSelectMonth?.(date);
  }

  function handleDateClick(date: Date): void {
    onSelectMonth?.(new Date(date.getFullYear(), date.getMonth(), 1));
    onSelectDate?.(toDateKey(date));
  }
</script>

<section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none">
  <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-900/60">
    {#if canGoPrev}
      <button
        class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        onclick={() => handleMonthClick(previousMonth)}
        type="button"
      >
        <span aria-hidden="true">&lt;</span>
        <span class="sr-only">Previous month</span>
      </button>
    {:else}
      <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-600">
        <span aria-hidden="true">&lt;</span>
      </span>
    {/if}

    <div class="text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Browse archive</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">{format(displayMonth, 'MMMM yyyy')}</h3>
    </div>

    {#if canGoNext}
      <button
        class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        onclick={() => handleMonthClick(nextMonth)}
        type="button"
      >
        <span aria-hidden="true">&gt;</span>
        <span class="sr-only">Next month</span>
      </button>
    {:else}
      <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-600">
        <span aria-hidden="true">&gt;</span>
      </span>
    {/if}
  </div>

  <div class="p-5">
    <div class="grid grid-cols-7 gap-2">
      {#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as dayName}
        <div class="pb-1 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
          {dayName}
        </div>
      {/each}

      {#each days as day}
        {@const dateKey = toDateKey(day)}
        {@const isDisabled = !isSameMonth(day, displayMonth) || isBefore(day, minimumDate) || isAfter(day, maximumDate)}
        {@const isToday = dateKey === todayDate}
        {@const isSelected = selectedDate === dateKey}

        {#if isDisabled}
          <div class="flex aspect-square items-center justify-center rounded-2xl text-sm font-medium text-slate-300 dark:text-slate-600">
            {format(day, 'd')}
          </div>
        {:else}
          <button
            class={`relative flex aspect-square items-center justify-center rounded-2xl border text-sm font-semibold transition ${
              isSelected
                ? 'border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-sky-400 dark:hover:bg-sky-900/20 dark:hover:text-sky-200'
            }`}
            onclick={() => handleDateClick(day)}
            title={dateKey}
            type="button"
          >
            {format(day, 'd')}
            {#if isToday}
              <span class={`absolute right-2 top-2 h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-sky-500'}`}></span>
            {/if}
          </button>
        {/if}
      {/each}
    </div>
  </div>
</section>
