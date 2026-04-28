<script lang="ts">
  let {
    name,
    description,
    url,
    image = 'https://wordsolverx.com/wordsolverx.webp',
    authorName = 'Wordle Solver',
    datePublished = '2026-01-01',
    genre = ['Puzzle', 'Word Game'],
  }: {
    name: string;
    description: string;
    url: string;
    image?: string;
    authorName?: string;
    datePublished?: string;
    genre?: string[];
  } = $props();

  let schemaJson = $derived(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": name,
    "description": description,
    "url": url,
    "image": image,
    "author": { "@type": "Organization", "name": authorName },
    "datePublished": datePublished,
    "genre": genre,
    "applicationCategory": "Game",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  }));
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${schemaJson}</script>`}
</svelte:head>
