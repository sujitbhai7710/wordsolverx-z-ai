# Theme System

A comprehensive theme switching system with light/dark modes, localStorage persistence, and system preference detection.

## Features

- **Three theme modes**: light, dark, and system (follows OS preference)
- **localStorage persistence**: Theme preference is saved and restored across sessions
- **System preference detection**: Automatically detects `prefers-color-scheme` media query
- **Smooth transitions**: CSS transitions for theme switching
- **Accessibility**: Supports high contrast mode and reduced motion preferences
- **Svelte 5 runes**: Uses modern Svelte 5 reactive state management

## Usage

### Basic Usage

The theme system is automatically initialized in the root layout (`+layout.svelte`). The theme toggle button is available in the navigation component.

### Programmatic Usage

```typescript
import { themeStore } from '$lib/theme';

// Get current theme
const currentTheme = themeStore.resolvedTheme; // 'light' or 'dark'
const preferences = themeStore.preferences;

// Set theme mode
themeStore.setMode('dark'); // 'light', 'dark', or 'system'

// Toggle between light and dark
themeStore.toggle();

// Set preferences
themeStore.setHighContrast(true);
themeStore.setReducedMotion(true);
themeStore.setFontSize('large');
```

### Using the Theme Toggle Component

```svelte
<script>
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<ThemeToggle />
```

## Architecture

### Files

- `types.ts` - TypeScript interfaces for theme preferences
- `storage.ts` - localStorage persistence functions
- `store.ts` - Svelte 5 runes-based reactive store
- `init.ts` - Theme initialization script to prevent FOUC
- `index.ts` - Public API exports

### Components

- `ThemeToggle.svelte` - Toggle button component with sun/moon icons

## CSS Custom Properties

The theme system uses CSS custom properties defined in `app.css`:

```css
:root {
  /* Light theme colors */
  --color-bg-primary: #ffffff;
  --color-text-primary: #111827;
  /* ... */
}

[data-theme='dark'] {
  /* Dark theme colors */
  --color-bg-primary: #111827;
  --color-text-primary: #f9fafb;
  /* ... */
}
```

The theme is applied by setting the `data-theme` attribute on the document root:

```html
<html data-theme="dark">
```

## System Preference Detection

The theme system automatically detects and responds to:

- `prefers-color-scheme: dark` - System dark mode preference
- `prefers-reduced-motion: reduce` - Reduced motion preference
- `prefers-contrast: high` - High contrast mode preference

## FOUC Prevention

To prevent Flash of Unstyled Content (FOUC), the theme is initialized before the page renders using an inline script in the HTML head:

```svelte
<svelte:head>
  {@html `<script>${getThemeInitScript()}</script>`}
</svelte:head>
```

This ensures the correct theme is applied immediately, before any content is rendered.

## Testing

Unit tests are available in `theme.test.ts`:

```bash
npm test src/lib/theme/theme.test.ts
```

Tests cover:
- localStorage persistence
- Theme mode handling (light, dark, system)
- Preference management (high contrast, reduced motion, font size)
- Error handling for corrupted data
- Theme application to document root

## Requirements Validation

This implementation validates **Requirement 1.4**:
- ✅ Supports light and dark themes
- ✅ Smooth transitions when switching themes
- ✅ localStorage persistence
- ✅ System preference detection (prefers-color-scheme)
- ✅ Three modes: 'light', 'dark', 'system'
