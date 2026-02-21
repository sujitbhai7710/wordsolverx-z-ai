import { designTokens } from './src/lib/design/tokens.js';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					50: designTokens.colors.light.primary[0],
					100: designTokens.colors.light.primary[1],
					200: designTokens.colors.light.primary[2],
					300: designTokens.colors.light.primary[3],
					400: designTokens.colors.light.primary[4],
					500: designTokens.colors.light.primary[5],
					600: designTokens.colors.light.primary[6],
					700: designTokens.colors.light.primary[7],
					800: designTokens.colors.light.primary[8],
					900: designTokens.colors.light.primary[9]
				},
				secondary: {
					50: designTokens.colors.light.secondary[0],
					100: designTokens.colors.light.secondary[1],
					200: designTokens.colors.light.secondary[2],
					300: designTokens.colors.light.secondary[3],
					400: designTokens.colors.light.secondary[4],
					500: designTokens.colors.light.secondary[5],
					600: designTokens.colors.light.secondary[6],
					700: designTokens.colors.light.secondary[7],
					800: designTokens.colors.light.secondary[8],
					900: designTokens.colors.light.secondary[9]
				},
				success: {
					50: designTokens.colors.light.success[0],
					100: designTokens.colors.light.success[1],
					200: designTokens.colors.light.success[2],
					300: designTokens.colors.light.success[3],
					400: designTokens.colors.light.success[4],
					500: designTokens.colors.light.success[5],
					600: designTokens.colors.light.success[6],
					700: designTokens.colors.light.success[7],
					800: designTokens.colors.light.success[8],
					900: designTokens.colors.light.success[9]
				},
				warning: {
					50: designTokens.colors.light.warning[0],
					100: designTokens.colors.light.warning[1],
					200: designTokens.colors.light.warning[2],
					300: designTokens.colors.light.warning[3],
					400: designTokens.colors.light.warning[4],
					500: designTokens.colors.light.warning[5],
					600: designTokens.colors.light.warning[6],
					700: designTokens.colors.light.warning[7],
					800: designTokens.colors.light.warning[8],
					900: designTokens.colors.light.warning[9]
				}
			},
			fontFamily: {
				sans: designTokens.typography.fontFamily.sans.split(', '),
				mono: designTokens.typography.fontFamily.mono.split(', ')
			},
			spacing: designTokens.spacing,
			transitionDuration: {
				fast: designTokens.animations.duration.fast,
				normal: designTokens.animations.duration.normal,
				slow: designTokens.animations.duration.slow
			},
			transitionTimingFunction: {
				'ease-in': designTokens.animations.easing.easeIn,
				'ease-out': designTokens.animations.easing.easeOut,
				'ease-in-out': designTokens.animations.easing.easeInOut
			}
		}
	},
	// Tailwind CSS 4.x automatically purges unused styles in production
	// Content paths above define where to look for class usage
	plugins: []
};
