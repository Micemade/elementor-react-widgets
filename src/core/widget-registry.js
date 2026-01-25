import HelloWidget from '../widgets/hello-widget/hello-widget';
import { mapHelloWidgetSettings } from '../widgets/settings-mappers';

export const WIDGET_REGISTRY = {
  'hello-widget': {
    component: HelloWidget,
    settingsMapper: mapHelloWidgetSettings
  }
};

export const getRegisteredWidgets = () => Object.keys(WIDGET_REGISTRY);
export const getWidgetConfig = (widgetType) => WIDGET_REGISTRY[widgetType];
export const isWidgetRegistered = (widgetType) => !!WIDGET_REGISTRY[widgetType];
