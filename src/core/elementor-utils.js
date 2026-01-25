export const isElementorEditor = () => {
  try {
    return (typeof elementor !== 'undefined' && !!elementor.config && !!elementor.config.document); // simple heuristic
  } catch (e) { return false; }
};

export const updateElementorSetting = (widgetType, widgetId, settingName, value) => {
  // For editor mode, delegate to widget manager to update setting on model
  if (window.ReactElementorWidgets) {
    window.ReactElementorWidgets.updateModelSetting(widgetType, widgetId, settingName, value);
  }
};
