import "./globalStyles.scss";

import { initializeElementorHooks } from "./core/elementor-hooks";
import { getRegisteredWidgets } from "./core/widget-registry";
import { createWidgetInitializer } from "./core/widget-initializer";

// Initialize when Elementor frontend is ready
if (typeof jQuery !== "undefined") {
  jQuery(window).on("elementor/frontend/init", function () {
    initializeElementorHooks();
  });
}

// Simple frontend bootstrap for non-Elementor pages
window.addEventListener("DOMContentLoaded", () => {
  if (typeof elementor === "undefined" && typeof jQuery !== "undefined") {
    getRegisteredWidgets().forEach((widgetType) => {
      jQuery(`.elementor-widget-${widgetType}`).each(function () {
        createWidgetInitializer(widgetType)(jQuery(this));
      });
    });
  }
});
