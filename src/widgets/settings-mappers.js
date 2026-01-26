export const mapHelloWidgetSettings = (model) => {
    const settings = model.get('settings');

    return {
        heading: settings.get('heading'),
        heading_color: settings.get('heading_color'),
        heading_font_size: settings.get('heading_font_size') || {
            size: 24,
            unit: 'px',
        },
    };
};
