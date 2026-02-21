/**
 * Theme Storage
 * Handles localStorage persistence for theme preferences
 */

import type { ThemePreferences } from './types';
import { DEFAULT_THEME_PREFERENCES } from './types';

const STORAGE_KEY = 'theme-preferences';

/**
 * Load theme preferences from localStorage
 */
export function loadThemePreferences(): ThemePreferences {
	if (typeof window === 'undefined') {
		return DEFAULT_THEME_PREFERENCES;
	}

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) {
			return DEFAULT_THEME_PREFERENCES;
		}

		const parsed = JSON.parse(stored);
		return {
			...DEFAULT_THEME_PREFERENCES,
			...parsed
		};
	} catch (error) {
		console.warn('Failed to load theme preferences:', error);
		return DEFAULT_THEME_PREFERENCES;
	}
}

/**
 * Save theme preferences to localStorage
 */
export function saveThemePreferences(preferences: ThemePreferences): boolean {
	if (typeof window === 'undefined') {
		return false;
	}

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
		return true;
	} catch (error) {
		console.error('Failed to save theme preferences:', error);
		return false;
	}
}

/**
 * Clear theme preferences from localStorage
 */
export function clearThemePreferences(): void {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch (error) {
		console.error('Failed to clear theme preferences:', error);
	}
}
