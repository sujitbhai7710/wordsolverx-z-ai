import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { PAGES_FUNCTION_INCLUDE_ROUTES, PRERENDER_ENTRIES } from './src/lib/route-registry.js';

const isPagesBuild = Boolean(process.env.CF_PAGES || process.env.BUILD_TARGET === 'pages');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			config: isPagesBuild ? 'wrangler.pages.jsonc' : 'wrangler.jsonc',
			...(isPagesBuild
				? {
						routes: {
							include: PAGES_FUNCTION_INCLUDE_ROUTES,
							exclude: []
						}
					}
				: {})
		}),
		inlineStyleThreshold: 100000,
		prerender: {
			crawl: false,
			entries: PRERENDER_ENTRIES
		}
	}
};

export default config;
