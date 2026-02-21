/**
 * Theme Initialization Script
 * This should be run as early as possible to prevent flash of unstyled content
 */

/**
 * Initialize theme before page renders to prevent FOUC (Flash of Unstyled Content)
 * This function should be called in a blocking script tag in the HTML head
 */
export function initThemeBeforeRender(): void {
	if (typeof window === 'undefined' || typeof document === 'undefined') {
		return;
	}

	try {
		// Load theme preference from localStorage
		const stored = localStorage.getItem('theme-preferences');
		let mode: 'light' | 'dark' | 'system' = 'system';

		if (stored) {
			const parsed = JSON.parse(stored);
			mode = parsed.mode || 'system';
		}

		// Determine the actual theme to apply
		let theme: 'light' | 'dark' = 'light';

		if (mode === 'system') {
			// Check system preference
			theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		} else {
			theme = mode;
		}

		// Apply theme immediately
		document.documentElement.setAttribute('data-theme', theme);
	} catch (error) {
		// Silently fail and use default light theme
		console.warn('Failed to initialize theme:', error);
	}
}

/**
 * Get inline script content for theme initialization
 * This can be used in svelte:head to inject the script
 */
export function getThemeInitScript(): string {
	return `
(function() {
	try {
		var stored = localStorage.getItem('theme-preferences');
		var mode = 'system';
		
		if (stored) {
			var parsed = JSON.parse(stored);
			mode = parsed.mode || 'system';
		}
		
		var theme = 'light';
		
		if (mode === 'system') {
			theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		} else {
			theme = mode;
		}
		
		document.documentElement.setAttribute('data-theme', theme);
	} catch (e) {
		console.warn('Failed to initialize theme:', e);
	}
})();
`.trim();
}
