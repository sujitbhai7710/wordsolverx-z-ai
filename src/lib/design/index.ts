/**
 * Design System Module
 * Exports design tokens and utilities
 */

export { designTokens } from './tokens';
export type {
	DesignTokens,
	ColorPalette,
	TypographyScale,
	SpacingScale,
	AnimationTokens
} from './tokens';

export {
	getColor,
	getColorVar,
	getDuration,
	getEasing,
	getSpacing,
	getFontFamily,
	getFontSize,
	getFontWeight,
	getLineHeight,
	createTransition
} from './utils';
