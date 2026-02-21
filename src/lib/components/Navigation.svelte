<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  
  let isOpen = $state(false);
  let scrolled = $state(false);

  // navLinks are constant
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Play Wordle', href: '/multidle' },
    { name: 'Today', href: '/today' },
    { name: 'Yesterday', href: '/yesterday' },
    { name: 'Archive', href: '/archive' },
    { name: 'Solver', href: '/solver' },
    { name: 'Guides', href: '/guides' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  onMount(() => {
    const handleScroll = () => scrolled = window.scrollY > 10;
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

</script>

<nav class={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50' : 'bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800'}`}>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <!-- Logo -->
      <div class="flex items-center gap-2">
        <a
          href="/"
          class="flex items-center gap-2.5 group"
        >
          <div class="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-green-500/20 group-hover:shadow-green-500/40 transition-shadow">
            <span class="text-white font-extrabold text-lg leading-none">W</span>
          </div>
          <span class="text-xl font-extrabold tracking-tight">
            <span class="text-gray-900 dark:text-white">Word</span>
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600">SolverX</span>
          </span>
        </a>
      </div>

      <!-- Desktop Nav -->
      <div class="hidden lg:flex lg:items-center lg:gap-1">
        {#each navLinks as link}
          {@const isActive = $page.url.pathname === link.href || (link.href !== '/' && $page.url.pathname?.startsWith(link.href))}
          <a
            href={link.href}
            class={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
              ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
          >
            {link.name}
            {#if isActive}
              <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-green-500 rounded-full"></span>
            {/if}
          </a>
        {/each}
      </div>

      <!-- Mobile toggle -->
      <div class="flex items-center gap-2 lg:hidden">
        <button
          type="button"
          class="p-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors"
          aria-controls="mobile-menu"
          aria-expanded={isOpen}
          onclick={() => isOpen = !isOpen}
        >
          <span class="sr-only">Open main menu</span>
          <svg class={`w-6 h-6 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            {#if isOpen}
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            {:else}
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            {/if}
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile menu -->
  <div
    class={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
    id="mobile-menu"
  >
    <div class="px-4 pt-2 pb-4 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      {#each navLinks as link}
        {@const isActive = $page.url.pathname === link.href || (link.href !== '/' && $page.url.pathname?.startsWith(link.href))}
        <a
          href={link.href}
          class={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
            ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          onclick={() => isOpen = false}
        >
          {link.name}
        </a>
      {/each}
    </div>
  </div>
</nav>
