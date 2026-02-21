/**
 * Design Token Utilities
 * Helper functions for accessing and using design tokens
 */

import { designTokens } from './tokens';
import type { ColorPalette } from './tokens';

/**
 * Get a color from the palette by theme and shade
 */
export function getColor(
	theme: 'light' | 'dark',
	palette: keyof ColorPalette,
	shade: number
): string {
	const colors = designTokens.colors[theme];
	return colors[palette][shade] || colors[palette][5]; // Default to 500 shade
}

/**
 * Get CSS custom property name for a color
 */
export function getColorVar(palette: string, shade: number): string {
	return `var(--color-${palette}-${shade})`;
}

/**
 * Get animation duration
 */
export function getDuration(speed: 'fast' | 'normal' | 'slow'): string {
	return designTokens.animations.duration[speed];
}

/**
 * Get animation easing function
 */
export function getEasing(type: 'easeIn' | 'easeOut' | 'easeInOut'): string {
	return designTokens.animations.easing[type];
}

/**
 * Get spacing value
 */
export function getSpacing(key: string): string {
	return designTokens.spacing[key] || '0';
}

/**
 * Get font family
 */
export function getFontFamily(type: 'sans' | 'mono'): string {
	return designTokens.typography.fontFamily[type];
}

/**
 * Get font size
 */
export function getFontSize(size: string): string {
	return designTokens.typography.fontSize[size] || designTokens.typography.fontSize.base;
}

/**
 * Get font weight
 */
export function getFontWeight(weight: string): number {
	return designTokens.typography.fontWeight[weight] || designTokens.typography.fontWeight.normal;
}

/**
 * Get line height
 */
export function getLineHeight(height: string): string {
	return designTokens.typography.lineHeight[height] || designTokens.typography.lineHeight.normal;
}

/**
 * Generate transition CSS string
 */
export function createTransition(
	property: string = 'all',
	duration: 'fast' | 'normal' | 'slow' = 'normal',
	easing: 'easeIn' | 'easeOut' | 'easeInOut' = 'easeInOut'
): string {
	return `${property} ${getDuration(duration)} ${getEasing(easing)}`;
}
