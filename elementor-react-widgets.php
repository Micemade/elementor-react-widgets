<?php
/**
 * Plugin Name: Elementor React Widgets (Starter)
 * Description: Minimal starter blueprint demonstrating a React-based Elementor widget with live settings updates.
 * Version: 0.1.0
 * Author: Micemade
 */

if ( ! defined( 'ABSPATH' ) ) exit;

final class Elementor_React_Widgets_Starter {
    public function __construct() {
        add_action('init', [ $this, 'register_assets' ]);
        add_action('elementor/widgets/register', [ $this, 'register_widgets' ]);
        add_action('wp_enqueue_scripts', [ $this, 'enqueue_frontend_assets' ]);
        add_action('elementor/editor/before_enqueue_scripts', [ $this, 'enqueue_editor_assets' ]);
    }

    public function register_assets() {
        // Register built assets (Vite build -> assets/js/main.js, assets/css/style.css)
        wp_register_script('elementor-react-widgets-main', plugins_url('assets/js/main.js', __FILE__), ['jquery'], null, true );
        wp_register_style('elementor-react-widgets-style', plugins_url('assets/css/style.css', __FILE__));
    }

    public function enqueue_frontend_assets() {
        wp_enqueue_script('elementor-react-widgets-main');
        wp_enqueue_style('elementor-react-widgets-style');
    }

    public function enqueue_editor_assets() {
        // Editor shares the same JS/CSS for this starter
        wp_enqueue_script('elementor-react-widgets-main');
        wp_enqueue_style('elementor-react-widgets-style');
    }

    public function register_widgets($widgets_manager) {
        require_once __DIR__ . '/widgets/hello-widget.php';
        $widgets_manager->register(new \Elementor_Hello_Widget());
    }
}

new Elementor_React_Widgets_Starter();
