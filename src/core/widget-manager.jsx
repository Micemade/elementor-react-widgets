import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { getWidgetConfig } from './widget-registry';

class WidgetManager {
  constructor() {
    this.instances = {};
    this.modelGetters = {};
    this.models = {};
  }

  init(widgetType, widgetId, rootElement, initialSettings) {
    const widgetConfig = getWidgetConfig(widgetType);
    if (!widgetConfig) return;

    const instanceKey = `${widgetType}_${widgetId}`;
    const existing = this.instances[instanceKey];

    // If DOM was replaced, unmount safely
    if (existing && !existing.rootElement.isConnected) {
      try { existing.root.unmount(); } catch(e) {}
    }

    if (existing && existing.rootElement.isConnected) {
      existing.updateSettings(initialSettings);
      return;
    }

    const root = createRoot(rootElement);
    let setSettings;
    let currentSettingsRef = initialSettings;

    const App = () => {
      const [settings, _setSettings] = useState(initialSettings);
      setSettings = (newSettings) => {
        _setSettings(prev => {
          const merged = { ...prev, ...newSettings };
          currentSettingsRef = merged;
          return merged;
        });
      };

      const WidgetComponent = widgetConfig.component;
      return <WidgetComponent widgetData={settings} widgetId={widgetId} />;
    };

    root.render(<App />);

    this.instances[instanceKey] = {
      root,
      rootElement,
      widgetType,
      currentSettings: currentSettingsRef,
      updateSettings: (newSettings) => {
        currentSettingsRef = { ...currentSettingsRef, ...newSettings };
        if (setSettings) setSettings(newSettings);
      }
    };
  }

  updateInstance(widgetType, widgetId, newSettings) {
    const instanceKey = `${widgetType}_${widgetId}`;
    if (this.instances[instanceKey]) {
      this.instances[instanceKey].updateSettings(newSettings);
    }
  }

  updateModelSetting(widgetType, widgetId, settingName, value) {
    const modelKey = `${widgetType}_${widgetId}`;
    const model = this.models[modelKey];
    if (model && model.setSetting) {
      model.setSetting(settingName, value);
    }
  }

  getModel(widgetType, widgetId) {
    const modelKey = `${widgetType}_${widgetId}`;
    return this.models[modelKey] || null;
  }
}

const widgetManager = new WidgetManager();
window.ReactElementorWidgets = widgetManager;
export default widgetManager;
