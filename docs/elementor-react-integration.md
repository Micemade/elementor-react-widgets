# Elementor + React Integration Pattern

This guide explains the integration pattern used in this project to render React widgets inside Elementor widgets, keep settings in sync without remounting, and avoid editor flicker. It's written for developers and agencies building Elementor integrations with React.

## Goals

- Mount React components inside Elementor widget wrappers.
- Apply editor settings live without unmounting or remounting React roots.
- Keep a simple, testable pattern for frontend and editor environments.
- Keep CSS scoped and extracted in build step.

## Key Concepts

- PHP widget: registers Elementor controls and outputs a wrapper containing a hidden JSON input (`.elementor-settings-data`) and a React root element (e.g., `.hello-widget-react-root`). The PHP `content_template()` is used for editor preview and should include the widget id in a data attribute.
- Widget initializer: reads initial settings (hidden input or editor model getter) and asks the `widgetManager` to mount or update the React instance.
- Widget manager: central singleton that mounts React roots with `createRoot`, stores instances by key (`${widgetType}_${widgetId}`), and exposes `updateInstance()` to push new settings into mounted components without remounting.
- Editor hooks: conditionally prevent Elementor from replacing the DOM on settings changes (by overriding `view.renderOnChange` to return `false` for widget-owned settings and `true` for core/advanced settings) and register a model getter to push settings into React.
- MutationObserver: watches the Elementor preview iframe for newly added widget DOM (drag/drop) and initializes React roots for them.

## File/Module Roles (where to look in the repo)

- `widgets/*.php` – PHP widget classes; implement `content_template()` to output the JSON settings input and the React root container.
- `src/core/widget-registry.js` – central registry of widget names, components and a `settingsMapper` for each widget.
- `src/core/widget-initializer.js` – factory that returns a function to initialize a widget from a jQuery scope.
- `src/core/widget-manager.jsx` – mounts roots, stores instances, exposes `init()` and `updateInstance()` for live updates.
- `src/core/elementor-hooks.js` – registers frontend/editor hooks, conditionally overrides `view.renderOnChange` in the panel open hook, and sets up the preview `MutationObserver`.
- `src/widgets/*/` – React components and SCSS. Build extracts CSS to `assets/css/style.css`.

## How updates flow (editor ↔ React)

1. When the editor opens the widget panel, `registerEditorHooks()` runs and:
   - Hooks `panel/open_editor/widget/{widgetType}` to store a `modelGetter` and the `model` reference in `widgetManager`.
   - Conditionally overrides `view.renderOnChange` to return `false` for widget-owned settings (preventing DOM re-render, letting React update in-place) and `true` for core/advanced settings (allowing Elementor to re-render live).

2. The React component is mounted by the `createWidgetInitializer` (used both in the frontend and the editor preview). The initializer:
   - Finds the wrapper and React root.
   - Parses the JSON settings input (`.elementor-settings-data`) if present.
   - If in editor mode and no hidden JSON is present, uses the `modelGetter` from `widgetManager`.
   - Calls `widgetManager.init(widgetType, widgetId, rootElement, settings)` to mount.

3. When Elementor model settings change (editor → React), the registered handler calls `widgetManager.updateInstance(widgetType, widgetId, newSettings)`.
   - `updateInstance` should update the mounted React component's state/props (via an instance API or React context) instead of unmounting and remounting the root.

4. For React → Elementor updates (e.g., a control inside React wants to update the editor model), the `widgetManager` stores the `model` reference and provides a helper `updateElementorSetting(modelKey, key, value)` which calls the model setter. This enables two-way syncing.

## Why avoid remounts?

- Elementor's default editor behavior re-renders the widget DOM when settings change. That causes React roots to unmount and remount, causing a visible flicker in the editor and lost internal state.
- Keeping the React root mounted and pushing new settings to the mounted component maintains state (e.g., local UI state, animation state) and provides a smooth UX in the editor.

## Adding a new widget (cheat-sheet)

1. Create `widgets/my-widget.php` extending `Elementor\\Widget_Base`:
   - Implement `register_controls()` for Elementor controls.
   - Implement `content_template()` to output `data-widget-id`, a hidden input `.elementor-settings-data` with `JSON.stringify({/* mapped settings */})`, and the `.my-widget-react-root` container.
   - Implement `render()` for frontend output (minimal markup; React will hydrate).

2. Create React component at `src/widgets/my-widget/my-widget.jsx` and a `settings-mapper` that maps the `model` to a plain JS object.

3. Register the widget in `src/core/widget-registry.js` with its `component` and `settingsMapper`.

4. Ensure SCSS lives under the widget folder and the build extracts CSS into `assets/css/style.css`.

## Build & Tooling

- Vite is used to bundle frontend assets into `assets/js/main.js` and a post-build step extracts CSS to `assets/css/style.css`.
- Use `sass-embedded` (Dart Sass) for SCSS compilation (`devDependency` in `package.json`).
- Prettier and ESLint are recommended in the workflow for consistent formatting and linting; `lint-staged` + Husky can run Prettier on commit.

## Troubleshooting

- Widget not initializing in editor preview: ensure `content_template()` includes the hidden `.elementor-settings-data` or that `registerEditorHooks()` has run and registered a model getter.
- Editor still flickers: confirm that `view.renderOnChange` is conditionally overridden in `panel/open_editor/widget/{widgetType}` to return `false` for widget-owned settings and `true` for core/advanced settings.
- `jQuery` or `elementor` undefined in linting: these are globals provided by Elementor in the editor/preview; add them to your ESLint `globals` during development.

## Accessibility & Performance

- Keep interactive logic accessible (keyboard, ARIA) inside React.
- Avoid heavy work during `updateInstance` — debounce expensive operations.
- Use code-splitting for large widgets where appropriate.

## Example snippets

Widget registry:

```js
import HelloWidget from '../widgets/hello-widget/hello-widget';
import { mapHelloWidgetSettings } from '../widgets/settings-mappers';
// Registry mapping widget types to their configurations
export const WIDGET_REGISTRY = {
	'hello-widget': {
		component: HelloWidget,
		settingsMapper: mapHelloWidgetSettings,
	},
};
// Get list of all registered widget types
export const getRegisteredWidgets = () => Object.keys(WIDGET_REGISTRY);
// Check if a widget type is registered
export const isWidgetRegistered = (widgetType) => !!WIDGET_REGISTRY[widgetType];
// Get widget configuration
export const getWidgetConfig = (widgetType) => WIDGET_REGISTRY[widgetType];
```

Conditional renderOnChange:

```js
// For full code, view src/core/elementor-hooks.js file.
elementor.hooks.addAction(`panel/open_editor/widget/${widgetType}`, (panel, model, view) => {
  // Conditionally override renderOnChange: false for widget-owned, true for core/advanced
  const originalRenderOnChange = view.renderOnChange.bind(view);
  view.renderOnChange = (settings) => {
    const changed = settings.changedAttributes();
    const hasNonWidgetChange = Object.keys(changed).some(k => !widgetKeys.includes(k));
    if (hasNonWidgetChange) {
      originalRenderOnChange(settings); // Allow re-render for core/advanced
    }
    // Skip re-render for widget-owned changes (React handles it)
  };
  widgetManager.modelGetters['my-widget_'+model.id] = () => mapSettings(model);
});
```

## Files to Adapt When Adding a New Widget

When adding a new widget, adapt or create the following files:

- `widgets/my-widget.php` – PHP widget class extending `Elementor\Widget_Base`; implement controls and `content_template()`.
- `src/widgets/my-widget/my-widget.jsx` – React component for the widget UI.
- `src/widgets/settings-mappers.js` – Add a settings mapper function to map Elementor model to React props.
- `src/core/widget-registry.js` – Register the new widget with its component and settings mapper.
- `src/widgets/my-widget/my-widget.scss` – SCSS styles (optional, extracted to `assets/css/style.css`).


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

---

This document is intended to be a living guide; keep it next to your plugin sources to help future contributors onboard quickly.
