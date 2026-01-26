import React, { useMemo } from 'react';
import './hello-widget.scss';

const HelloWidget = ({ widgetData = {}, widgetId = null }) => {
	// Generate scoped CSS variables from widgetData
	const cssVars = useMemo(() => {
		const vars = {};
		if (widgetData.heading_color)
			vars['--hello-heading-color'] = widgetData.heading_color;
		if (
			widgetData.heading_font_size &&
			widgetData.heading_font_size.size !== undefined
		) {
			vars['--hello-heading-font-size'] =
				`${widgetData.heading_font_size.size}${widgetData.heading_font_size.unit || 'px'}`;
		}
		return vars;
	}, [widgetData]);

	return (
		<div className="hello-widget" style={cssVars} data-widget-id={widgetId}>
			<h2 className="hello-widget__heading">
				{widgetData.heading || 'Hello from React!'}
			</h2>
		</div>
	);
};

export default HelloWidget;
