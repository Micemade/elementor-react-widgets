import widgetManager from './widget-manager';

/**
 * Create a widget initializer function for a given widget type.
 *
 * The initializer locates the wrapper and React root, reads initial
 * settings (from a hidden input or model getter) and instructs the
 * widget manager to mount or update the React instance.
 *
 * @param {string} widgetType Widget type slug.
 * @return {Function} Initializer function that accepts a jQuery scope.
 */
export const createWidgetInitializer = (widgetType) => {
	return ($scope) => {
		// Widget-specific class names (e.g., .products-layout-wrapper)
		const wrapperClass = `.${widgetType}-wrapper`;
		const rootClass = `.${widgetType}-react-root`;

		// Find widget wrapper (handles both jQuery and DOM queries)
		const wrapper =
			$scope.find(wrapperClass)[0] ||
			$scope[0]?.querySelector(wrapperClass);
		// Find React root container within wrapper
		const rootElement = wrapper?.querySelector(rootClass);

		if (!rootElement) {
			console.warn(`React root not found for ${widgetType} widget`);
			return;
		}

		// Extract widget ID - prioritize data-widget-id from wrapper (set in content_template)
		// Fallback to $scope data attributes for backwards compatibility
		let widgetId =
			wrapper?.dataset?.widgetId ||
			$scope.data('id') ||
			$scope.data('widget-id');
		if (!widgetId) {
			console.error(
				`Widget ID not found for ${widgetType} widget. Check content_template() includes data-widget-id="{{ view.model.id }}"`
			);
			return;
		}

		// Initialize settings object
		let settings = {};
		// Look for hidden input with JSON settings (from PHP content_template)
		const settingsInput = wrapper.querySelector('.elementor-settings-data');
		if (settingsInput?.value) {
			try {
				// Parse JSON settings from hidden input
				settings = JSON.parse(settingsInput.value);
			} catch (e) {
				console.error('Invalid JSON settings for', widgetType);
			}
		}

		// Check if there's a model getter (in editor mode)
		const modelKey = `${widgetType}_${widgetId}`;
		const modelGetter = widgetManager.modelGetters[modelKey];
		if (modelGetter && !settingsInput) {
			// Use settings from Elementor model if no hidden input
			settings = modelGetter();
		}

		// Initialize or update the React widget
		widgetManager.init(widgetType, widgetId, rootElement, settings);

		// If neither settings input nor model getter were available, wait a
		// short moment for the editor code to register a model getter and then
		// update the instance.
		if (!settingsInput && !modelGetter) {
			setTimeout(() => {
				const delayed = widgetManager.modelGetters[modelKey];
				if (delayed) {
					widgetManager.updateInstance(
						widgetType,
						widgetId,
						delayed()
					);
				}
			}, 50);
		}
	};
};
