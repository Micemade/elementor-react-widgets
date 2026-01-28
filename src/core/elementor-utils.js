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
