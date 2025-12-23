<?php
/**
 * PHPUnit bootstrap file for integration tests
 */

// Detect if running in wp-env or traditional test environment
$_tests_dir = getenv( 'WP_TESTS_DIR' );

// Try wp-env path first (this is the standard wp-env location)
if ( ! $_tests_dir && file_exists( '/wordpress-phpunit/includes/functions.php' ) ) {
	$_tests_dir = '/wordpress-phpunit';
}

// Try WP_PHPUNIT__DIR
if ( ! $_tests_dir ) {
	$_wp_phpunit_dir = getenv( 'WP_PHPUNIT__DIR' );
	if ( $_wp_phpunit_dir && file_exists( $_wp_phpunit_dir . '/includes/functions.php' ) ) {
		$_tests_dir = $_wp_phpunit_dir;
	}
}

// Fall back to traditional location
if ( ! $_tests_dir ) {
	$_tests_dir = rtrim( sys_get_temp_dir(), '/\\' ) . '/wordpress-tests-lib';
}

if ( ! file_exists( $_tests_dir . '/includes/functions.php' ) ) {
	echo "Could not find $_tests_dir/includes/functions.php\n";
	echo "Please set WP_TESTS_DIR or WP_PHPUNIT__DIR environment variable.\n";
	exit( 1 );
}

// Give access to tests_add_filter() function
require_once $_tests_dir . '/includes/functions.php';

/**
 * Manually load the plugin being tested
 */
function _manually_load_plugin() {
	// In wp-env, the plugin is mounted at wp-content/plugins/detect-site-post-editor
	// and plugin.php is at the root of that directory
	$plugin_file = dirname( __DIR__ ) . '/plugin.php';

	// Fallback for traditional structure where plugin is in a subdirectory
	if ( ! file_exists( $plugin_file ) ) {
		$plugin_file = dirname( __DIR__ ) . '/plugin/plugin.php';
	}

	require $plugin_file;
}
tests_add_filter( 'muplugins_loaded', '_manually_load_plugin' );

// Start up the WP testing environment
require $_tests_dir . '/includes/bootstrap.php';
