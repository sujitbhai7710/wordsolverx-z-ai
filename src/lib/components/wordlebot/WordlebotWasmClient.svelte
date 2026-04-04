<script lang="ts">
	import { onMount } from 'svelte';
	import rawStyles from '$lib/wordlebot-wasm/styles.css?raw';
	import { mountWordlebotApp } from '$lib/wordlebot-wasm/app';
	import type { WordlebotAppPageConfig } from '$lib/wordlebot-wasm/types';

	let { config }: { config: WordlebotAppPageConfig } = $props();

	let host: HTMLDivElement | null = null;

	function buildShadowStyles(css: string) {
		return (
			css
				.replace(':root {', ':host {')
				.replace(/html,\s*body\s*\{/, ':host {')
				.replace(/body\s*\{/, '.shadow-body {') +
			`
:host {
  display: block;
  width: 100%;
}
`
		);
	}

	onMount(() => {
		if (!host) {
			return;
		}

		const shadowRoot = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
		shadowRoot.innerHTML = '';

		const style = document.createElement('style');
		style.textContent = buildShadowStyles(rawStyles);

		const body = document.createElement('div');
		body.className = 'shadow-body';

		const appTarget = document.createElement('div');
		body.appendChild(appTarget);

		shadowRoot.append(style, body);

		return mountWordlebotApp(appTarget, config);
	});
</script>

<div bind:this={host} class="block w-full"></div>
