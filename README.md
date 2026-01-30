# Elementor React Widgets — Starter Blueprint

This repository contains a minimal, functional blueprint showing how to integrate React-based widgets with Elementor.

Features:

- Single React-based widget (`hello-widget`) with two Elementor controls: text and styling (color + font-size)
- Live settings synchronization in the editor via `widgetManager` and `elementor` hooks — updates applied without React remounts
- Vite-based build producing `assets/js/main.js` and `assets/css/style.css`

Quickstart:

1. cd into this folder and run `npm install`.
2. Run `npm run build` or `npm run watch` to produce `assets/` files.
3. Run `npm run build:prod` for optimized build (no sourcemaps)
4. Run `npm run dev` for local dev server (requires Vite config changes, according to your setup).
5. Activate the plugin in WordPress and add the "Hello (React) Widget" in Elementor.


Notes: This plugin is intentionally small — use it as a starting point and copy useful patterns back into your main plugin,
or build on top of this codebase.

[Use the documentation in docs/elementor-react-integration.md](https://github.com/Micemade/elementor-react-widgets/blob/main/docs/elementor-react-integration.md)

## Resources

- [Author: Micemade Website](https://micemade.com)
- [Elementor Developer Documentation](https://developers.elementor.com/docs/)
- [Elementor GitHub Repository](https://github.com/elementor/elementor)
- [React.dev Learn](https://react.dev/learn)
- [React Documentation](https://devdocs.io/react/)
- [Vite build tool](https://vite.dev/)
- [NodeJS](https://nodejs.org/en)
- [ESLint](https://eslint.org/)
- [ESLint VS Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
