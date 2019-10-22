<?php
/*
Plugin Name: Taffy
Plugin URI: https://www.tropicalseo.it
Description: A better Affiliate Links plugin to cloak and manage your affiliate links.
Version: 1.0.0
Author: Francesco Pepe
Author URI: https://www.francescopepe.com
License: GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: taffy
Domain Path: /languages
*/

/**
 * Copyright (c) YEAR Your Name (email: Email). All rights reserved.
 *
 * Released under the GPL license
 * http://www.opensource.org/licenses/gpl-license.php
 *
 * This is an add-on for WordPress
 * http://wordpress.org/
 *
 * **********************************************************************
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 * **********************************************************************
 */


if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

// Define most essential constants.
define( 'TAFFY_VERSION', '1.0.0' );
define( 'TAFFY_FILE', __FILE__ );
define( 'TAFFY_PATH', dirname( TAFFY_FILE ) );

/**
 * Handles plugin activation.
 *
 * Throws an error if the plugin is activated on an older version than PHP 5.4.
 *
 * @access private
 *
 * @param bool $network_wide Whether to activate network-wide.
 */
function taffy_activate_plugin( $network_wide ) {
    if ( version_compare( PHP_VERSION, '5.4.0', '<' ) ) {
        wp_die(
            esc_html__( 'Site Kit requires PHP version 5.4.', 'google-site-kit' ),
            esc_html__( 'Error Activating', 'google-site-kit' )
        );
    }
    $installed = get_option( 'taffy_installed' );

    if ( ! $installed ) {
        update_option( 'taffy_installed', time() );
        update_option( 'taffy_prefix', '' );
        update_option( 'taffy_redirect_type', '' );
    }

    update_option( 'taffy_version', TAFFY_VERSION );

}

register_activation_hook( __FILE__, 'taffy_activate_plugin' );

/**
 * Handles plugin deactivation.
 *
 * @access private
 *
 * @param bool $network_wide Whether to deactivate network-wide.
 */
function taffy_deactivate_plugin( $network_wide ) {
    if ( version_compare( PHP_VERSION, '5.4.0', '<' ) ) {
        return;
    }
}

register_deactivation_hook( __FILE__, 'taffy_deactivate_plugin' );

/**
 * Handles plugin uninstall.
 *
 * @access private
 */
function taffy_uninstall_plugin() {
    if ( version_compare( PHP_VERSION, '5.4.0', '<' ) ) {
        return;
    }
    delete_option('taffy_installed');
    delete_option('taffy_prefix');
    delete_option('taffy_redirect_type');
    delete_option('taffy_version');
}

register_uninstall_hook( __FILE__, 'taffy_uninstall_plugin' );

if ( version_compare( PHP_VERSION, '5.4.0', '>=' ) ) {
    require_once plugin_dir_path( __FILE__ ) . 'includes/loader.php';
}
