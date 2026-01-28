import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { getWidgetConfig } from './widget-registry';

/**
 * WidgetManager
 *
 * Manages React widget instances mounted into Elementor widget wrappers.
 * Provides methods to init, update and interact with Elementor models.
 */
class WidgetManager {
	constructor() {
		/** @type {Object<string,any>} Mounted instance records */
		this.instances = {};

		/** @type {Object<string,Function>} Model getter functions (editor only) */
		this.modelGetters = {};

		/** @type {Object<string,Object>} Elementor model references */
		this.models = {};
	}

	/**
	 * Initialize or update a widget instance.
	 *
	 * If the widget DOM was replaced (Elementor re-render), the old React root
	 * is unmounted and a new root is created. If the DOM is still connected,
	 * the existing instance is updated via its exposed setter.
	 *
	 * @param {string} widgetType
	 * @param {string} widgetId
	 * @param {HTMLElement} rootElement
	 * @param {Object} initialSettings
	 * @return void
	 */
	init(widgetType, widgetId, rootElement, initialSettings) {
		const widgetConfig = getWidgetConfig(widgetType);
		if (!widgetConfig) {
			return;
		}

		const instanceKey = `${widgetType}_${widgetId}`;
		const existingInstance = this.instances[instanceKey];

		// If DOM was replaced, unmount safely
		if (existingInstance && !existingInstance.rootElement.isConnected) {
			try {
				existingInstance.root.unmount();
			} catch (e) {
				// ignore
			}
		}

		// If instance exists and DOM is still connected, update settings only
		if (existingInstance && existingInstance.rootElement.isConnected) {
			existingInstance.updateSettings(initialSettings);
			return;
		}

		// Create new React root for this widget instance
		const root = createRoot(rootElement);
		let setSettings;
		let currentSettingsRef = initialSettings;

		// Wrapper component that manages widget settings state
		const App = () => {
			const [settings, _setSettings] = useState(initialSettings);

			// Expose setter function to external code
			setSettings = (newSettings) => {
				_setSettings((prev) => {
					// Merge new settings with previous ones
					const merged = { ...prev, ...newSettings };
					currentSettingsRef = merged;
					return merged;
				});
			};

			// Dynamically render the correct widget component from registry
			const WidgetComponent = widgetConfig.component;
			return (
				<WidgetComponent widgetData={settings} widgetId={widgetId} />
			);
		};

		root.render(<App />);

		// Store instance data for future updates
		this.instances[instanceKey] = {
			root: root, // React root for unmounting
			rootElement: rootElement, // DOM element to check connection
			widgetType: widgetType, // Widget type for reference
			currentSettings: currentSettingsRef, // Current settings reference
			// Update settings without remounting
			updateSettings: (newSettings) => {
				currentSettingsRef = { ...currentSettingsRef, ...newSettings };
				if (setSettings) {
					setSettings(newSettings);
				}
			},
		};
	}

	/**
	 * Update an existing instance with new settings.
	 *
	 * @param {string} widgetType
	 * @param {string} widgetId
	 * @param {Object} newSettings
	 * @return void
	 */
	updateInstance(widgetType, widgetId, newSettings) {
		const instanceKey = `${widgetType}_${widgetId}`;
		if (this.instances[instanceKey]) {
			this.instances[instanceKey].updateSettings(newSettings);
		}
	}

	/**
	 * Update a setting on the Elementor model from React.
	 *
	 * @param {string} widgetType
	 * @param {string} widgetId
	 * @param {string} settingName
	 * @param {*} value
	 * @return void
	 */
	updateModelSetting(widgetType, widgetId, settingName, value) {
		const modelKey = `${widgetType}_${widgetId}`;
		const model = this.models[modelKey];
		if (model && model.setSetting) {
			model.setSetting(settingName, value);

			// Mark document as changed to enable Update/Publish button
			if (typeof elementor !== 'undefined' && elementor.saver) {
				elementor.saver.setFlagEditorChange(true);
			}
		}
		
	}

	/**
	 * Get current Elementor model for a widget (editor only).
	 *
	 * @param {string} widgetType
	 * @param {string} widgetId
	 * @return {Object|null}
	 */
	getModel(widgetType, widgetId) {
		const modelKey = `${widgetType}_${widgetId}`;
		return this.models[modelKey] || null;
	}
}

// Create singleton instance
const widgetManager = new WidgetManager();

// Expose globally for React components to access
window.ReactElementorWidgets = widgetManager;

export default widgetManager;
