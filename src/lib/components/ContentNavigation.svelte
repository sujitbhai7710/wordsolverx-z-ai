<script lang="ts">
	import { page } from '$app/stores';

	const navLinks = [
		{ name: 'Home', href: '/' },
		{ name: 'Play Wordle', href: '/multidle' },
		{ name: 'Today', href: '/today' },
		{ name: 'Archive', href: '/archive' },
		{ name: 'Solver', href: '/solver' },
		{ name: 'Guides', href: '/guides' },
		{ name: 'About', href: '/about' },
		{ name: 'Contact', href: '/contact' }
	];

	function isActive(pathname: string, href: string) {
		return pathname === href || (href !== '/' && pathname.startsWith(href));
	}
</script>

<nav class="sticky top-0 z-50 relative bg-white/95 dark:bg-gray-900/95 border-b border-gray-200/60 dark:border-gray-700/60 shadow-sm backdrop-blur-xl">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
			<div class="flex items-center gap-2">
				<a href="/" class="flex items-center gap-2.5 group">
					<div class="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-green-500/20 group-hover:shadow-green-500/40 transition-shadow">
						<span class="text-white font-extrabold text-lg leading-none">W</span>
					</div>
					<span class="text-xl font-extrabold tracking-tight">
						<span class="text-gray-900 dark:text-white">Word</span>
						<span class="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600">SolverX</span>
					</span>
				</a>
			</div>

			<div class="hidden lg:flex lg:items-center lg:gap-1">
				{#each navLinks as link}
					{@const active = isActive($page.url.pathname, link.href)}
					<a
						href={link.href}
						class={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
							active
								? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
								: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
						}`}
					>
						{link.name}
						{#if active}
							<span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-green-500 rounded-full"></span>
						{/if}
					</a>
				{/each}
			</div>

			<details class="relative flex items-center lg:hidden">
				<summary class="list-none p-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors cursor-pointer">
					<span class="sr-only">Toggle navigation</span>
					<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</summary>
				<div class="absolute top-full right-0 mt-2 w-72 rounded-2xl bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 shadow-xl backdrop-blur-xl p-3">
					<div class="space-y-1">
						{#each navLinks as link}
							{@const active = isActive($page.url.pathname, link.href)}
							<a
								href={link.href}
								class={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
									active
										? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
										: 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
								}`}
							>
								{link.name}
							</a>
						{/each}
					</div>
				</div>
			</details>
		</div>
	</div>
</nav>

<style>
	details summary::-webkit-details-marker {
		display: none;
	}
</style>
