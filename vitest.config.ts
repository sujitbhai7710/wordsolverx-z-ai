import { defineConfig } from 'vitest/config';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
	plugins: [
		svelte({
			hot: !process.env.VITEST,
			preprocess: vitePreprocess()
		})
	],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/test/setup.ts']
	},
	resolve: {
		alias: {
			$lib: resolve('./src/lib')
		},
		conditions: ['browser']
	}
});
