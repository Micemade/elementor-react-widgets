import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Check if --watch flag is present (used by npm run watch)
const isWatch = process.argv.includes('--watch');

export default defineConfig({
	plugins: [react()],
	root: path.resolve(__dirname),
	build: {
		// Enable source maps only if explicitly set (e.g., for dev/debugging)
		sourcemap: true,
		outDir: 'assets',
		emptyOutDir: true,
		// Ensure CSS is emitted as a single file so post-build extraction works
		cssCodeSplit: false,
		// Conditionally enable watch only for npm run watch
		watch: isWatch ? {
			include: ['src/**/*.{js,ts,jsx,tsx,scss}'],
		} : undefined,
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
