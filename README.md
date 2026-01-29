# Elementor React Widgets — Starter Blueprint

This folder contains a minimal, functional blueprint showing how to integrate React-based widgets with Elementor.

Features:

- Single React-based widget (`hello-widget`) with two Elementor controls: text and styling (color + font-size)
- Live settings synchronization in the editor via `widgetManager` and `elementor` hooks — updates applied without React remounts
- Vite-based build producing `assets/js/main.js` and `assets/css/style.css`

Quickstart:

1. cd into this folder and run `npm install`.
2. Run `npm run build` or `npm run watch` to produce `assets/` files, or `npm run dev` for local dev server.
3. Activate the plugin in WordPress and add the "Hello (React) Widget" in Elementor.

Sourcemaps:

- To generate sourcemaps that map back to the original `src/` files, run `npm run build:sourcemap`.
- This script relies on `cross-env` for cross-platform support (already added as a devDependency), so it works on macOS, Linux, and Windows shells.

Notes: This is intentionally small — use it as a starting point and copy useful patterns back into your main plugin.
