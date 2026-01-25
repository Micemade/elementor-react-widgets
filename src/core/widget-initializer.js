import widgetManager from './widget-manager';
import { getWidgetConfig } from './widget-registry';

export const createWidgetInitializer = (widgetType) => {
  return ($scope) => {
    const wrapperClass = `.${widgetType}-wrapper`;
    const rootClass = `.${widgetType}-react-root`;

    const wrapper = $scope.find(wrapperClass)[0] || $scope[0]?.querySelector(wrapperClass);
    const rootElement = wrapper?.querySelector(rootClass);

    if (!rootElement) return;

    let widgetId = wrapper?.dataset?.widgetId || $scope.data('id') || $scope.data('widget-id');
    if (!widgetId) return;

    let settings = {};
    const settingsInput = wrapper.querySelector('.elementor-settings-data');
    if (settingsInput?.value) {
      try { settings = JSON.parse(settingsInput.value); } catch(e) { console.error('Invalid JSON settings for', widgetType); }
    }

    const modelKey = `${widgetType}_${widgetId}`;
    const modelGetter = widgetManager.modelGetters[modelKey];
    if (modelGetter && !settingsInput) settings = modelGetter();

    widgetManager.init(widgetType, widgetId, rootElement, settings);

    if (!settingsInput && !modelGetter) {
      setTimeout(() => {
        const delayed = widgetManager.modelGetters[modelKey];
        if (delayed) widgetManager.updateInstance(widgetType, widgetId, delayed());
      }, 50);
    }
  };
};
