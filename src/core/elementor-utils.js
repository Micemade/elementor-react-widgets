export const isElementorEditor = () => {
	try {
		// simple heuristic
		return (
			typeof elementor !== 'undefined' &&
			!!elementor.config &&
			!!elementor.config.document
		);
	} catch (e) {
		return false;
	}
};

/**
 * Updates an Elementor widget setting in editor mode by delegating to the widget manager.
 * This function checks if the ReactElementorWidgets object is available on the window and,
 * if so, calls its updateModelSetting method to update the specified setting on the widget model.
 * 
 * @param {string} widgetType - The type of the widget (e.g., a string identifier for the widget category or class).
 * @param {string|number} widgetId - The unique identifier of the widget instance.
 * @param {string} settingName - The name of the setting to update.
 * @param {*} value - The new value to assign to the setting.
 */
export const updateElementorSetting = (
	widgetType,
	widgetId,
	settingName,
	value
) => {
	// For editor mode, delegate to widget manager to update setting on model
	if (window.ReactElementorWidgets) {
		window.ReactElementorWidgets.updateModelSetting(
			widgetType,
			widgetId,
			settingName,
			value
		);
	}
};

/**
 * Get current Elementor model for a widget
 * 
 * @param {string} widgetType - Widget type
 * @param {string} widgetId - Widget ID
 * @returns {Object|null} Elementor model or null
 */
export const getElementorModel = (widgetType, widgetId) => {
	if (typeof window.ReactElementorWidgets === 'undefined') {
		return null;
	}
	return window.ReactElementorWidgets.getModel(widgetType, widgetId);
};
