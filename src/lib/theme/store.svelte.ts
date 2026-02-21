/**
 * Theme Store
 * Svelte 5 runes-based store for theme state management
 */

import type { ThemePreferences, ThemeMode } from './types';
import { DEFAULT_THEME_PREFERENCES } from './types';
import { loadThemePreferences, saveThemePreferences } from './storage';

/**
 * Get the resolved theme based on mode and system preference
 */
function getResolvedTheme(mode: ThemeMode): 'light' | 'dark' {
	if (mode === 'system') {
		if (typeof window === 'undefined') {
			return 'light';
		}
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}
	return mode;
}

/**
 * Apply theme to the document
 */
function applyTheme(theme: 'light' | 'dark'): void {
	if (typeof document === 'undefined') {
		return;
	}

	document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Create theme store with Svelte 5 runes
 */
function createThemeStore() {
	let preferences = $state<ThemePreferences>(DEFAULT_THEME_PREFERENCES);
	let resolvedTheme = $state<'light' | 'dark'>('light');

	return {
		get preferences() {
			return preferences;
		},
		get resolvedTheme() {
			return resolvedTheme;
		},

		/**
		 * Initialize theme from localStorage and system preferences
		 */
		init() {
			if (typeof window === 'undefined') {
				return;
			}

			// Load saved preferences
			preferences = loadThemePreferences();

			// Set initial resolved theme
			resolvedTheme = getResolvedTheme(preferences.mode);
			applyTheme(resolvedTheme);

			// Listen for system theme changes
			const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			const handleChange = (e: MediaQueryListEvent) => {
				if (preferences.mode === 'system') {
					resolvedTheme = e.matches ? 'dark' : 'light';
					applyTheme(resolvedTheme);
				}
			};

			mediaQuery.addEventListener('change', handleChange);

			// Listen for reduced motion preference
			const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
			if (motionQuery.matches) {
				preferences.reducedMotion = true;
			}

			// Listen for high contrast preference
			const contrastQuery = window.matchMedia('(prefers-contrast: high)');
			if (contrastQuery.matches) {
				preferences.highContrast = true;
			}

			// Cleanup function
			return () => {
				mediaQuery.removeEventListener('change', handleChange);
			};
		},

		/**
		 * Set theme mode
		 */
		setMode(mode: ThemeMode) {
			preferences.mode = mode;
			resolvedTheme = getResolvedTheme(mode);
			applyTheme(resolvedTheme);
			saveThemePreferences(preferences);
		},

		/**
		 * Toggle between light and dark modes
		 */
		toggle() {
			const newMode = resolvedTheme === 'light' ? 'dark' : 'light';
			this.setMode(newMode);
		},

		/**
		 * Set high contrast mode
		 */
		setHighContrast(enabled: boolean) {
			preferences.highContrast = enabled;
			saveThemePreferences(preferences);
		},

		/**
		 * Set reduced motion preference
		 */
		setReducedMotion(enabled: boolean) {
			preferences.reducedMotion = enabled;
			saveThemePreferences(preferences);
		},

		/**
		 * Set font size
		 */
		setFontSize(size: 'small' | 'medium' | 'large') {
			preferences.fontSize = size;
			saveThemePreferences(preferences);
		}
	};
}

export const themeStore = createThemeStore();
