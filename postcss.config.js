/** @type {import('postcss-load-config').Config} */
export default {
	plugins: {
		'@tailwindcss/postcss': {},
		autoprefixer: {}
		// Note: CSS minification is handled by Vite's build process
		// No need for additional cssnano plugin
	}
};
