import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	plugins: [react()],
	root: path.resolve(__dirname),
	build: {
		// Enable source maps when VITE_SOURCEMAP env var is set (false by default)
		// Accept both 'true' and '1' (string) for cross-platform env vars
		sourcemap:
			process.env.VITE_SOURCEMAP === 'true' ||
			process.env.VITE_SOURCEMAP === '1' ||
			false,
		outDir: 'assets',
		emptyOutDir: true,
		// Ensure CSS is emitted as a single file so post-build extraction works
		cssCodeSplit: false,
		// Watch configuration for `vite build --watch` (rebuild on these file changes)
		watch: {
			include: ['src/**/*.{js,ts,jsx,tsx,scss}'],
		},
		rollupOptions: {
			input: path.resolve(__dirname, 'src/main.jsx'),
			output: {
				// Force a single IIFE bundle and inline dynamic imports so React internals are not duplicated
				format: 'iife',
				name: 'ElementorReactWidgets',
				entryFileNames: 'js/main.js',

				assetFileNames: (assetInfo) => {
					const name = (assetInfo && (assetInfo.name || assetInfo.fileName)) || '';
					const ext = path.extname(name).toLowerCase();
					if (ext === '.css') return 'css/style.css';
					return 'assets/[name]-[hash][extname]';
				},
			},
		},
	},
	optimizeDeps: {
		include: ['react', 'react-dom'],
	},
});
