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
        // Ensure CSS is extracted into a separate file
        cssCodeSplit: true,
        rollupOptions: {
            input: path.resolve(__dirname, 'src/main.jsx'),
            output: {
                // Force a single IIFE bundle and inline dynamic imports so React internals are not duplicated
                format: 'iife',
                name: 'ElementorReactWidgets',
                entryFileNames: 'js/main.js',

                assetFileNames: (chunkInfo) => {
                    const name =
                        (chunkInfo && (chunkInfo.name || chunkInfo.fileName)) ||
                        '';
                    if (name.endsWith('.css')) return 'css/style.css';
                    return 'assets/[name]-[hash][extname]';
                },
            },
        },
    },
    optimizeDeps: {
        include: ['react', 'react-dom'],
    },
});
