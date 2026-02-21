<script lang="ts">
  import ArchiveCalendar from '$lib/components/ArchiveCalendar.svelte';
  import { formatDateForSlug } from '$lib/colordle-date';

  const startDate = new Date(2021, 5, 19); // June 19, 2021 - Wordle launch
  
  function formatWordleSlug(date: Date): string {
    return formatDateForSlug(date); // MMMM-dd-yyyy lowercase
  }
</script>

<svelte:head>
  <title>Wordle Answer Archive - Complete History of All Solutions | WordSolverX</title>
  <meta name="description" content="Browse the complete archive of all Wordle answers by date. Calendar view with search, daily puzzle numbers, and direct links to every past solution since June 2021." />
  <link rel="canonical" href="https://wordsolverx.com/wordle-answer-archive" />
  <meta property="og:title" content="Wordle Answer Archive - All Past Solutions" />
  <meta property="og:description" content="Complete history of every Wordle answer. Browse by calendar or search by date." />
  <meta property="og:url" content="https://wordsolverx.com/wordle-answer-archive" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Wordle Answer Archive - All Past Solutions | WordSolverX" />
  <meta name="twitter:description" content="Complete history of every Wordle answer with calendar view." />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Wordle Answer Archive",
    "description": "Complete archive of all New York Times Wordle answers and solutions from June 2021 to present.",
    "url": "https://wordsolverx.com/wordle-answer-archive",
    "isPartOf": { "@type": "WebSite", "name": "WordSolverX", "url": "https://wordsolverx.com" }
  })}</script>`}
</svelte:head>

<ArchiveCalendar
  gameName="Wordle"
  gameColor="emerald"
  gameIcon="🟩"
  {startDate}
  slugPrefix="wordle-answer-for-"
  formatSlug={formatWordleSlug}
  description="Every NYT Wordle answer since the beginning. Find any past solution instantly."
/>
