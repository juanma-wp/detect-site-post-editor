<?php
/**
 * Plugin Name: Conditional Rendering Examples
 * Plugin URI: https://github.com/yourusername/wp-block-editor-conditional-rendering
 * Description: Demonstrates conditional code execution in WordPress Block Editor contexts
 * Version: 1.0.0
 * Author: Your Name
 * License: MIT
 * Text Domain: conditional-rendering-examples
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Load server-side detection functions
require_once plugin_dir_path( __FILE__ ) . 'includes/server-side-detection.php';

/**
 * Enqueue block editor assets
 */
function conditional_rendering_examples_enqueue_assets() {
	$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	wp_enqueue_script(
		'conditional-rendering-examples',
		plugins_url( 'build/index.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version'],
		false
	);

	wp_enqueue_style(
		'conditional-rendering-examples',
		plugins_url( 'build/index.css', __FILE__ ),
		array(),
		$asset_file['version']
	);
}
add_action( 'enqueue_block_editor_assets', 'conditional_rendering_examples_enqueue_assets' );

/**
 * Conditionally enqueue assets based on server-side detection
 */
function conditional_rendering_examples_enqueue_conditional_assets() {
	// Example 1: Only load on block editor screens
	if ( cre_is_block_editor() ) {
		wp_enqueue_script(
			'cre-editor-only',
			plugins_url( 'build/editor-only.js', __FILE__ ),
			array(),
			'1.0.0',
			true
		);
		wp_add_inline_script(
			'cre-editor-only',
			'console.log("✓ Server-side: Block Editor detected");'
		);
	}

	// Example 2: Only load for specific post types
	if ( cre_is_post_type( 'page' ) ) {
		wp_enqueue_script(
			'cre-page-only',
			plugins_url( 'build/page-only.js', __FILE__ ),
			array(),
			'1.0.0',
			true
		);
		wp_add_inline_script(
			'cre-page-only',
			'console.log("✓ Server-side: Page post type detected");'
		);
	}

	// Example 3: Only load for users with specific capabilities
	if ( cre_user_can_publish_posts() ) {
		wp_enqueue_script(
			'cre-publisher-only',
			plugins_url( 'build/publisher-only.js', __FILE__ ),
			array(),
			'1.0.0',
			true
		);
		wp_add_inline_script(
			'cre-publisher-only',
			'console.log("✓ Server-side: User can publish posts");'
		);
	}

	// Example 4: Exclude Site Editor
	if ( ! cre_is_site_editor() ) {
		wp_enqueue_script(
			'cre-no-site-editor',
			plugins_url( 'build/no-site-editor.js', __FILE__ ),
			array(),
			'1.0.0',
			true
		);
		wp_add_inline_script(
			'cre-no-site-editor',
			'console.log("✓ Server-side: Not in Site Editor");'
		);
	}

	// Example 5: Only on post edit screens
	if ( cre_is_post_edit_screen() ) {
		wp_enqueue_script(
			'cre-post-edit-only',
			plugins_url( 'build/post-edit-only.js', __FILE__ ),
			array(),
			'1.0.0',
			true
		);
		wp_add_inline_script(
			'cre-post-edit-only',
			'console.log("✓ Server-side: Post edit screen detected");'
		);
	}
}
add_action( 'admin_enqueue_scripts', 'conditional_rendering_examples_enqueue_conditional_assets' );

/**
 * Register custom post type for testing
 */
function conditional_rendering_examples_register_post_types() {
	// Register a viewable custom post type
	register_post_type(
		'product',
		array(
			'labels'              => array(
				'name'          => 'Products',
				'singular_name' => 'Product',
			),
			'public'              => true,
			'has_archive'         => true,
			'show_in_rest'        => true,
			'supports'            => array( 'title', 'editor', 'custom-fields' ),
			'show_in_menu'        => true,
			'menu_icon'           => 'dashicons-products',
		)
	);
}
add_action( 'init', 'conditional_rendering_examples_register_post_types' );

/**
 * Register page templates for testing
 */
function conditional_rendering_examples_register_templates( $templates ) {
	$templates['full-width'] = 'Full Width Template';
	return $templates;
}
add_filter( 'theme_page_templates', 'conditional_rendering_examples_register_templates' );
