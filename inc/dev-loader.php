<?php
/**
 * Dev loader for Vite dev server.
 * Injects Vite client and ESM entry when `ERW_DEV` is defined.
 */

defined( 'ABSPATH' ) || exit;

function erw_dev_server_url() {
    return 'http://localhost:5173';
}

function erw_print_vite_dev_scripts() {
    // Only print in dev mode
    if ( ! defined( 'ERW_DEV' ) || ! ERW_DEV ) {
        return;
    }

    $vite = erw_dev_server_url();

    // Probe the dev server before injecting scripts to avoid broken tags when it's down.
    if ( ! erw_is_vite_running( $vite ) ) {
        return;
    }

    // Vite client for HMR
    echo "<script type=\"module\" src=\"{$vite}/@vite/client\"></script>\n";
    // Main entry (ESM)
    echo "<script type=\"module\" src=\"{$vite}/src/main.jsx\"></script>\n";
}


/**
 * Check whether the Vite dev server is responding.
 *
 * @param string $vite_url Base URL of the dev server.
 * @return bool
 */
function erw_is_vite_running( $vite_url ) {
    if ( ! function_exists( 'wp_remote_get' ) ) {
        return false;
    }

    // probe the client endpoint which should be present when Vite serves
    $probe = rtrim( $vite_url, '/' ) . '/@vite/client';

    $response = wp_remote_get( $probe, [ 'timeout' => 1, 'sslverify' => false ] );
    if ( is_wp_error( $response ) ) {
        return false;
    }

    $code = wp_remote_retrieve_response_code( $response );
    return (int) $code === 200;
}

// Hooks: print in frontend and editor preview
add_action( 'wp_head', 'erw_print_vite_dev_scripts', 1 );
add_action( 'admin_print_scripts', 'erw_print_vite_dev_scripts', 1 );
