import React, { useMemo, useState, useEffect } from 'react';
import './hello-widget.scss';
import {
	isElementorEditor,
	updateElementorSetting,
} from '../../core/elementor-utils';

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

	// Local editor-only state for instant UI feedback when resizing
	const initialSize = widgetData?.heading_font_size?.size || 24;
	const [localSize, setLocalSize] = useState(initialSize);

	useEffect(() => {
		// keep localSize in sync when settings come from model updates
		if (
			widgetData?.heading_font_size?.size &&
			widgetData.heading_font_size.size !== localSize
		) {
			setLocalSize(widgetData.heading_font_size.size);
		}
	}, [widgetData, localSize]);

	const onSizeChange = (newSize) => {
		setLocalSize(newSize);
		// Persist into Elementor model (editor mode) so changes are saved
		if (widgetId != null) {
			updateElementorSetting(
				'hello-widget',
				widgetId,
				'heading_font_size',
				{
					size: newSize,
					unit: 'px',
				}
			);
		}
	};

	return (
		<div className="hello-widget" style={cssVars} data-widget-id={widgetId}>
			<h2 className="hello-widget__heading">
				{widgetData.heading || 'Hello from React!'}
			</h2>

			{isElementorEditor() && (
				<div className="hello-widget__controls">
					<label className="hello-widget__label">Title size</label>
					<div className="hello-widget__controls-row">
						<button
							type="button"
							className="hello-widget__btn"
							onClick={() =>
								onSizeChange(Math.max(8, localSize - 1))
							}
						>
							−
						</button>
						<input
							type="range"
							min="8"
							max="120"
							value={localSize}
							onChange={(e) =>
								onSizeChange(Number(e.target.value))
							}
							className="hello-widget__range"
						/>
						<button
							type="button"
							className="hello-widget__btn"
							onClick={() => onSizeChange(localSize + 1)}
						>
							+
						</button>
						<span className="hello-widget__size">
							{localSize}px
						</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default HelloWidget;
