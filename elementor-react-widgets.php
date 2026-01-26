<?php

/**
 * Plugin Name: Elementor React Widgets (Starter)
 * Description: Minimal starter blueprint demonstrating a React-based Elementor widget with live settings updates.
 * Version:     0.1.0
 * Author:      Micemade
 */

defined( 'ABSPATH' ) || exit;

/**
 * Main plugin bootstrap class.
 *
 * Registers assets, enqueues scripts/styles and registers widgets with Elementor.
 */
final class Elementor_React_Widgets_Starter {

	/**
	 * Constructor.
	 *
	 * Adds WordPress and Elementor hooks.
	 */
	public function __construct() {
		add_action( 'init', [ $this, 'register_assets' ] );
		add_action( 'elementor/widgets/register', [ $this, 'register_widgets' ] );
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_frontend_assets' ] );
		add_action( 'elementor/editor/before_enqueue_scripts', [ $this, 'enqueue_editor_assets' ] );
	}

	/**
	 * Register plugin assets built by Vite.
	 *
	 * Registers `assets/js/main.js` and `assets/css/style.css` for later enqueue.
	 *
	 * @return void
	 */
	public function register_assets() {
		// Register built assets (Vite outputs to assets/)
		wp_register_script( 'elementor-react-widgets-main', plugins_url( 'assets/js/main.js', __FILE__ ), [ 'jquery' ], null, true );
		wp_register_style( 'elementor-react-widgets-style', plugins_url( 'assets/css/style.css', __FILE__ ) );
	}

	/**
	 * Enqueue frontend assets.
	 *
	 * @return void
	 */
	public function enqueue_frontend_assets() {
		wp_enqueue_script( 'elementor-react-widgets-main' );
		wp_enqueue_style( 'elementor-react-widgets-style' );
	}

	/**
	 * Enqueue editor assets for Elementor editor preview.
	 *
	 * @return void
	 */
	public function enqueue_editor_assets() {
		// Editor shares the same JS/CSS for this starter
		wp_enqueue_script( 'elementor-react-widgets-main' );
		wp_enqueue_style( 'elementor-react-widgets-style' );
	}

	/**
	 * Register Elementor widgets.
	 *
	 * @param \Elementor\Widgets_Manager $widgets_manager Widgets manager.
	 * @return void
	 */
	public function register_widgets( $widgets_manager ) {
		require_once __DIR__ . '/widgets/hello-widget.php';

		$widgets_manager->register( new \Elementor_Hello_Widget() );
	}

}

// Initialize plugin.
new Elementor_React_Widgets_Starter();