/**
 * Design Tokens System
 * Centralized design tokens for consistent styling across the application
 */

export interface ColorPalette {
	primary: string[];
	secondary: string[];
	success: string[];
	warning: string[];
	neutral: string[];
	background: string[];
	text: string[];
}

export interface TypographyScale {
	fontFamily: {
		sans: string;
		mono: string;
	};
	fontSize: Record<string, string>;
	fontWeight: Record<string, number>;
	lineHeight: Record<string, string>;
}

export interface SpacingScale {
	[key: string]: string;
}

export interface AnimationTokens {
	duration: {
		fast: string;
		normal: string;
		slow: string;
	};
	easing: {
		easeIn: string;
		easeOut: string;
		easeInOut: string;
	};
}

export interface DesignTokens {
	colors: {
		light: ColorPalette;
		dark: ColorPalette;
	};
	typography: TypographyScale;
	spacing: SpacingScale;
	animations: AnimationTokens;
}

// Light theme color palette
const lightColors: ColorPalette = {
	primary: [
		'#eef2ff', // indigo-50
		'#e0e7ff', // indigo-100
		'#c7d2fe', // indigo-200
		'#a5b4fc', // indigo-300
		'#818cf8', // indigo-400
		'#6366f1', // indigo-500
		'#4f46e5', // indigo-600
		'#4338ca', // indigo-700
		'#3730a3', // indigo-800
		'#312e81' // indigo-900
	],
	secondary: [
		'#faf5ff', // purple-50
		'#f3e8ff', // purple-100
		'#e9d5ff', // purple-200
		'#d8b4fe', // purple-300
		'#c084fc', // purple-400
		'#a855f7', // purple-500
		'#9333ea', // purple-600
		'#7e22ce', // purple-700
		'#6b21a8', // purple-800
		'#581c87' // purple-900
	],
	success: [
		'#f0fdf4', // green-50
		'#dcfce7', // green-100
		'#bbf7d0', // green-200
		'#86efac', // green-300
		'#4ade80', // green-400
		'#22c55e', // green-500 (Wordle correct)
		'#16a34a', // green-600
		'#15803d', // green-700
		'#166534', // green-800
		'#14532d' // green-900
	],
	warning: [
		'#fefce8', // yellow-50
		'#fef9c3', // yellow-100
		'#fef08a', // yellow-200
		'#fde047', // yellow-300
		'#facc15', // yellow-400
		'#eab308', // yellow-500 (Wordle present)
		'#ca8a04', // yellow-600
		'#a16207', // yellow-700
		'#854d0e', // yellow-800
		'#713f12' // yellow-900
	],
	neutral: [
		'#f9fafb', // gray-50
		'#f3f4f6', // gray-100
		'#e5e7eb', // gray-200
		'#d1d5db', // gray-300
		'#9ca3af', // gray-400
		'#6b7280', // gray-500 (Wordle absent)
		'#4b5563', // gray-600
		'#374151', // gray-700
		'#1f2937', // gray-800
		'#111827' // gray-900
	],
	background: ['#ffffff', '#f9fafb', '#f3f4f6', '#e5e7eb'],
	text: ['#111827', '#374151', '#6b7280', '#9ca3af']
};

// Dark theme color palette
const darkColors: ColorPalette = {
	primary: [
		'#312e81', // indigo-900
		'#3730a3', // indigo-800
		'#4338ca', // indigo-700
		'#4f46e5', // indigo-600
		'#6366f1', // indigo-500
		'#818cf8', // indigo-400
		'#a5b4fc', // indigo-300
		'#c7d2fe', // indigo-200
		'#e0e7ff', // indigo-100
		'#eef2ff' // indigo-50
	],
	secondary: [
		'#581c87', // purple-900
		'#6b21a8', // purple-800
		'#7e22ce', // purple-700
		'#9333ea', // purple-600
		'#a855f7', // purple-500
		'#c084fc', // purple-400
		'#d8b4fe', // purple-300
		'#e9d5ff', // purple-200
		'#f3e8ff', // purple-100
		'#faf5ff' // purple-50
	],
	success: [
		'#14532d', // green-900
		'#166534', // green-800
		'#15803d', // green-700
		'#16a34a', // green-600
		'#22c55e', // green-500
		'#4ade80', // green-400
		'#86efac', // green-300
		'#bbf7d0', // green-200
		'#dcfce7', // green-100
		'#f0fdf4' // green-50
	],
	warning: [
		'#713f12', // yellow-900
		'#854d0e', // yellow-800
		'#a16207', // yellow-700
		'#ca8a04', // yellow-600
		'#eab308', // yellow-500
		'#facc15', // yellow-400
		'#fde047', // yellow-300
		'#fef08a', // yellow-200
		'#fef9c3', // yellow-100
		'#fefce8' // yellow-50
	],
	neutral: [
		'#111827', // gray-900
		'#1f2937', // gray-800
		'#374151', // gray-700
		'#4b5563', // gray-600
		'#6b7280', // gray-500
		'#9ca3af', // gray-400
		'#d1d5db', // gray-300
		'#e5e7eb', // gray-200
		'#f3f4f6', // gray-100
		'#f9fafb' // gray-50
	],
	background: ['#111827', '#1f2937', '#374151', '#4b5563'],
	text: ['#f9fafb', '#e5e7eb', '#d1d5db', '#9ca3af']
};

// Typography scale
const typography: TypographyScale = {
	fontFamily: {
		sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
		mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
	},
	fontSize: {
		xs: '0.75rem', // 12px
		sm: '0.875rem', // 14px
		base: '1rem', // 16px
		lg: '1.125rem', // 18px
		xl: '1.25rem', // 20px
		'2xl': '1.5rem', // 24px
		'3xl': '1.875rem', // 30px
		'4xl': '2.25rem', // 36px
		'5xl': '3rem', // 48px
		'6xl': '3.75rem', // 60px
		'7xl': '4.5rem', // 72px
		'8xl': '6rem', // 96px
		'9xl': '8rem' // 128px
	},
	fontWeight: {
		thin: 100,
		extralight: 200,
		light: 300,
		normal: 400,
		medium: 500,
		semibold: 600,
		bold: 700,
		extrabold: 800,
		black: 900
	},
	lineHeight: {
		none: '1',
		tight: '1.25',
		snug: '1.375',
		normal: '1.5',
		relaxed: '1.625',
		loose: '2'
	}
};

// Spacing scale
const spacing: SpacingScale = {
	'0': '0',
	'1': '0.25rem', // 4px
	'2': '0.5rem', // 8px
	'3': '0.75rem', // 12px
	'4': '1rem', // 16px
	'5': '1.25rem', // 20px
	'6': '1.5rem', // 24px
	'7': '1.75rem', // 28px
	'8': '2rem', // 32px
	'9': '2.25rem', // 36px
	'10': '2.5rem', // 40px
	'11': '2.75rem', // 44px
	'12': '3rem', // 48px
	'14': '3.5rem', // 56px
	'16': '4rem', // 64px
	'20': '5rem', // 80px
	'24': '6rem', // 96px
	'28': '7rem', // 112px
	'32': '8rem', // 128px
	'36': '9rem', // 144px
	'40': '10rem', // 160px
	'44': '11rem', // 176px
	'48': '12rem', // 192px
	'52': '13rem', // 208px
	'56': '14rem', // 224px
	'60': '15rem', // 240px
	'64': '16rem', // 256px
	'72': '18rem', // 288px
	'80': '20rem', // 320px
	'96': '24rem' // 384px
};

// Animation tokens
const animations: AnimationTokens = {
	duration: {
		fast: '100ms',
		normal: '200ms',
		slow: '300ms'
	},
	easing: {
		easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
		easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
		easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
	}
};

// Export the complete design tokens
export const designTokens: DesignTokens = {
	colors: {
		light: lightColors,
		dark: darkColors
	},
	typography,
	spacing,
	animations
};
