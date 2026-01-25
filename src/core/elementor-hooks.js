/**
 * Elementor Hooks Registration
 * 
 * Registers all Elementor frontend and editor hooks for widgets.
 * Handles widget initialization, settings synchronization, and editor interactions.
 */

import { getRegisteredWidgets, getWidgetConfig } from './widget-registry';
import { createWidgetInitializer } from './widget-initializer';
import widgetManager from './widget-manager';

/**
 * Register frontend hooks for all widgets
 * Initializes widgets when they're rendered on the frontend
 */
export const registerFrontendHooks = () => {
  if (typeof elementorFrontend === 'undefined') return;
  getRegisteredWidgets().forEach(widgetType => {
    elementorFrontend.hooks.addAction(
      `frontend/element_ready/${widgetType}.default`,
      createWidgetInitializer(widgetType)
    );
  });
};

export const registerEditorHooks = () => {
  if (typeof elementor === 'undefined') return;

  elementor.hooks.addFilter('editor/widget/renderOnChange', function (renderOnChange, widgetType) {
    if (getRegisteredWidgets().includes(widgetType)) return false;
    return renderOnChange;
  });

  getRegisteredWidgets().forEach(widgetType => {
    elementor.hooks.addAction(`panel/open_editor/widget/${widgetType}`, (panel, model, view) => {
      const widgetId = model.id;
      const modelKey = `${widgetType}_${widgetId}`;
      const widgetConfig = getWidgetConfig(widgetType);
      const getSettingsFromModel = () => widgetConfig.settingsMapper(model);

      // Prevent the editor view from re-rendering the widget DOM
      // React will update UI via state instead
      if (view && typeof view.renderOnChange === 'function') {
        view.renderOnChange = () => false;
      }

      widgetManager.modelGetters[modelKey] = getSettingsFromModel;
      widgetManager.models[modelKey] = model;

      // Push initial settings immediately so React mounts with correct data
      widgetManager.updateInstance(widgetType, widgetId, getSettingsFromModel());

      // Update React component whenever Elementor model settings change
      model.get('settings').on('change', () => {
        widgetManager.updateInstance(widgetType, widgetId, getSettingsFromModel());
      });
    });
  });
};

export const setupEditorObserver = () => {
  if (typeof elementor === 'undefined') return;

  const previewFrame = document.querySelector('#elementor-preview-iframe');
  if (!previewFrame) return;

  const initPreview = () => {
    const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    if (!previewDoc?.body) {
      setTimeout(initPreview, 100);
      return;
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            getRegisteredWidgets().forEach(widgetType => {
              const wrapperClass = `${widgetType}-wrapper`;
              const elementorClass = `elementor-widget-${widgetType}`;

              const widgets = node.classList?.contains(wrapperClass)
                ? [node]
                : (node.querySelectorAll ? node.querySelectorAll(`.${wrapperClass}`) : []);

              widgets.forEach((wrapper) => {
                const $wrapper = jQuery(wrapper).closest(`.${elementorClass}`);
                if ($wrapper.length) {
                  const widgetId = $wrapper.data('id') || $wrapper.data('widget-id');
                  const instanceKey = `${widgetType}_${widgetId}`;
                  if (!widgetManager.instances[instanceKey]) {
                    createWidgetInitializer(widgetType)($wrapper);
                  }
                }
              });
            });
          }
        });
      });
    });

    observer.observe(previewDoc.body, { childList: true, subtree: true });

    getRegisteredWidgets().forEach(widgetType => {
      const wrapperClass = `${widgetType}-wrapper`;
      const elementorClass = `elementor-widget-${widgetType}`;

      previewDoc.querySelectorAll(`.${wrapperClass}`).forEach((wrapper) => {
        const $wrapper = jQuery(wrapper).closest(`.${elementorClass}`);
        if ($wrapper.length) {
          const instanceKey = `${widgetType}_${$wrapper.data('id')}`;
          if (!widgetManager.instances[instanceKey]) {
            createWidgetInitializer(widgetType)($wrapper);
          }
        }
      });
    });
  };

  if (previewFrame.contentDocument?.readyState === 'complete') {
    initPreview();
  } else {
    previewFrame.addEventListener('load', initPreview);
  }
};

export const initializeElementorHooks = () => {
  registerFrontendHooks();
  registerEditorHooks();
  setupEditorObserver();
};
