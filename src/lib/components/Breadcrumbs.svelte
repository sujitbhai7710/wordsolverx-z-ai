<script lang="ts">
  import { page } from '$app/stores';
  import FiHome from '$lib/components/icons/FiHome.svelte';
  import FiChevronRight from '$lib/components/icons/FiChevronRight.svelte';

  // Use store value directly - $page gives reactive access in Svelte 5
  let pathname = $derived($page.url.pathname);

  // Split the pathname into segments
  let pathSegments = $derived(pathname.split('/').filter((segment: string) => segment !== ''));

  // Generate breadcrumb items
  let breadcrumbItems = $derived(
    pathSegments.map((segment: string, index: number) => {
      const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
      let name = segment
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      if (name === 'All Wordle Solver') name = 'All Wordle Solver';
      if (name.includes('Wordle Answer For')) {
        name = name.replace('Wordle Answer For', 'Wordle Answer');
      }

      return { name, href, isLast: index === pathSegments.length - 1 };
    })
  );

  let schemaJson = $derived(JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://wordsolver.tech',
      },
      ...breadcrumbItems.map((item: { name: string; href: string }, index: number) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.name,
        item: `https://wordsolver.tech${item.href}`,
      })),
    ],
  }));
</script>

<svelte:head>
  {#if pathname !== '/'}
    {@html `<script type="application/ld+json">${schemaJson}</script>`}
  {/if}
</svelte:head>

{#if pathname !== '/'}
  <nav class="flex mb-6 text-sm font-medium overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-2">
      <li class="inline-flex items-center">
        <a
          href="/"
          class="inline-flex items-center text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500 transition-colors"
        >
          <FiHome class="mr-2 h-4 w-4" />
          Home
        </a>
      </li>
      {#each breadcrumbItems as item}
        <li class="flex items-center">
          <FiChevronRight class="h-4 w-4 text-gray-400 mx-1" />
          {#if item.isLast}
            <span class="text-gray-900 dark:text-gray-100 font-bold ml-1 md:ml-2">
              {item.name}
            </span>
          {:else}
            <a
              href={item.href}
              class="text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500 transition-colors ml-1 md:ml-2"
            >
              {item.name}
            </a>
          {/if}
        </li>
      {/each}
    </ol>
  </nav>
{/if}
