<?php
/**
 * Hello Widget
 *
 * Minimal Elementor widget that provides a React render root and exposes
 * widget settings via a hidden JSON input so the frontend and editor
 * can initialize the React component with the same data.
 *
 * @package ElementorReactWidgets
 */

defined( 'ABSPATH' ) || exit;

use Elementor\Controls_Manager;

/**
 * Elementor Hello (React) Widget
 *
 * Registers controls and outputs the wrapper used by the React app.
 */
class Elementor_Hello_Widget extends \Elementor\Widget_Base {

	/**
	 * Widget slug name.
	 *
	 * @return string
	 */
	public function get_name() {
		return 'hello-widget';
	}

	/**
	 * Widget title displayed in the editor.
	 *
	 * @return string
	 */
	public function get_title() {
		return __( 'Hello (React) Widget', 'elementor-react-widgets' );
	}

	/**
	 * Widget icon.
	 *
	 * @return string
	 */
	public function get_icon() {
		return 'eicon-nerd';
	}

	/**
	 * Widget categories.
	 *
	 * @return array
	 */
	public function get_categories() {
		return [ 'general' ];
	}

	/**
	 * Register widget controls.
	 *
	 * @return void
	 */
	protected function register_controls() {
		$this->start_controls_section(
			'content_section',
			[
				'label' => __( 'Content', 'elementor-react-widgets' ),
			]
		);

		$this->add_control(
			'heading',
			[
				'label'   => __( 'Heading', 'elementor-react-widgets' ),
				'type'    => Controls_Manager::TEXT,
				'default' => __( 'Hello from React!', 'elementor-react-widgets' ),
			]
		);

		$this->end_controls_section();

		$this->start_controls_section(
			'style_section',
			[
				'label' => __( 'Style', 'elementor-react-widgets' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'heading_color',
			[
				'label' => __( 'Heading Color', 'elementor-react-widgets' ),
				'type'  => Controls_Manager::COLOR,
				'default' => '#FF7070',
			]
		);

		$this->add_control(
			'heading_font_size',
			[
				'label'      => __( 'Heading Size', 'elementor-react-widgets' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => [ 'px' ],
				'range'      => [ 'px' => [ 'min' => 18, 'max' => 120 ] ],
				'default'    => [ 'size' => 24, 'unit' => 'px' ],
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Render the widget output in the frontend.
	 *
	 * Outputs a wrapper element containing a hidden input with JSON-encoded
	 * settings and a div for the React root.
	 *
	 * @return void
	 */
	protected function render() {
		$settings = [
			'heading'           => $this->get_settings( 'heading' ) ?: 'Hello from React!',
			'heading_color'     => $this->get_settings( 'heading_color' ),
			'heading_font_size' => $this->get_settings( 'heading_font_size' ) ?: [ 'size' => 24, 'unit' => 'px' ],
		];

		$json_data = wp_json_encode( $settings );
		$widget_id  = $this->get_id();
		?>
<div class="hello-widget-wrapper" data-widget-id="<?php echo esc_attr( $widget_id ); ?>">
	<input type="hidden" class="elementor-settings-data" value="<?php echo esc_attr( $json_data ); ?>" />
	<div class="hello-widget-react-root"></div>
</div>
<?php
	}

	/**
	 * Render the editor template used by Elementor's live preview.
	 *
	 * Outputs the same structure as `render()` but using Underscore templates
	 * so the editor preview has initial settings available.
	 *
	 * @return void
	 */
	protected function content_template() {
		?>
<# const data={ heading: settings.heading || 'Hello from React!' , heading_color: settings.heading_color,
	heading_font_size: settings.heading_font_size || { size: 24, unit: 'px' } }; const jsonData=JSON.stringify( data );
	#>
	<div class="hello-widget-wrapper" data-widget-id="{{ view.model.id }}">
		<input type="hidden" class="elementor-settings-data" value="{{ jsonData }}" />
		<div class="hello-widget-react-root"></div>
	</div>
	<?php
	}

}