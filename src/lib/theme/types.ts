/**
 * Theme System Types
 * Defines interfaces for theme preferences and management
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemePreferences {
	mode: ThemeMode;
	highContrast: boolean;
	reducedMotion: boolean;
	fontSize: 'small' | 'medium' | 'large';
}

export const DEFAULT_THEME_PREFERENCES: ThemePreferences = {
	mode: 'system',
	highContrast: false,
	reducedMotion: false,
	fontSize: 'medium'
};
