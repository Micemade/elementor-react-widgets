/**
 * Widget Registry
 * 
 * Central registry mapping widget names to their React components and settings mappers.
 * Add new widgets here to make them available throughout the system.
 */

import HelloWidget from '../widgets/hello-widget/hello-widget';
import { mapHelloWidgetSettings } from '../widgets/settings-mappers';

// Registry mapping widget types to their configurations
export const WIDGET_REGISTRY = {
	'hello-widget': {
		component: HelloWidget,
		settingsMapper: mapHelloWidgetSettings
	}
};

// Get list of all registered widget types
export const getRegisteredWidgets = () => Object.keys(WIDGET_REGISTRY);

// Check if a widget type is registered
export const isWidgetRegistered = (widgetType) => !!WIDGET_REGISTRY[widgetType];

// Get widget configuration
export const getWidgetConfig = (widgetType) => WIDGET_REGISTRY[widgetType];
