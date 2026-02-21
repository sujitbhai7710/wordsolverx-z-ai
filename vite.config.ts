import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		target: 'esnext',
		sourcemap: false,
		reportCompressedSize: true,
		minify: 'esbuild',
		// Warn if chunks exceed 500KB
		chunkSizeWarningLimit: 500,
	},
	esbuild: {
		drop: ['console', 'debugger'],
	},
	optimizeDeps: {
		include: ['svelte', 'date-fns']
	}
});
