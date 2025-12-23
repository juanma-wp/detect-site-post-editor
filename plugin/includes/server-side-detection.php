<?php
/**
 * Server-Side Context Detection Functions
 *
 * These functions allow conditional execution on the server side
 * before JavaScript is loaded, improving performance.
 *
 * @package ConditionalRenderingExamples
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get the current screen object if available
 *
 * @return WP_Screen|false Screen object or false if not available
 */
function cre_get_current_screen() {
	if ( ! function_exists( 'get_current_screen' ) ) {
		return false;
	}
	return get_current_screen();
}

/**
 * Check if the current screen is using the block editor
 *
 * @return bool True if block editor is active, false otherwise
 */
function cre_is_block_editor() {
	$screen = cre_get_current_screen();
	return $screen && $screen->is_block_editor();
}

/**
 * Check if we're on a post edit screen
 *
 * @return bool True if on post edit screen, false otherwise
 */
function cre_is_post_edit_screen() {
	$screen = cre_get_current_screen();
	return $screen && $screen->base === 'post';
}

/**
 * Check if we're in the Site Editor
 *
 * @return bool True if in Site Editor, false otherwise
 */
function cre_is_site_editor() {
	global $pagenow;
	return 'site-editor.php' === $pagenow;
}

/**
 * Check if current screen is for a specific post type
 *
 * @param string|array $post_type Single post type or array of post types to check.
 * @return bool True if matches, false otherwise
 */
function cre_is_post_type( $post_type ) {
	$screen = cre_get_current_screen();
	if ( ! $screen ) {
		return false;
	}

	if ( is_array( $post_type ) ) {
		return in_array( $screen->post_type, $post_type, true );
	}

	return $screen->post_type === $post_type;
}

/**
 * Check if current post type is NOT in the excluded list
 *
 * @param array $excluded_post_types Array of post types to exclude.
 * @return bool True if not excluded, false if excluded
 */
function cre_is_not_post_type( $excluded_post_types ) {
	$screen = cre_get_current_screen();
	if ( ! $screen ) {
		return true;
	}

	return ! in_array( $screen->post_type, $excluded_post_types, true );
}

/**
 * Check if current user can publish posts
 *
 * @return bool True if user can publish posts, false otherwise
 */
function cre_user_can_publish_posts() {
	return current_user_can( 'publish_posts' );
}

/**
 * Check if current user can edit posts
 *
 * @return bool True if user can edit posts, false otherwise
 */
function cre_user_can_edit_posts() {
	return current_user_can( 'edit_posts' );
}

/**
 * Check if current user can edit pages
 *
 * @return bool True if user can edit pages, false otherwise
 */
function cre_user_can_edit_pages() {
	return current_user_can( 'edit_pages' );
}

/**
 * Check if current post has a specific template
 *
 * @param string $template Template slug to check.
 * @return bool True if template matches, false otherwise
 */
function cre_is_template( $template ) {
	global $post;

	if ( ! $post ) {
		return false;
	}

	$current_template = get_page_template_slug( $post->ID );
	return $current_template === $template;
}

/**
 * Check if current post has a specific status
 *
 * @param string|array $status Single status or array of statuses to check.
 * @return bool True if status matches, false otherwise
 */
function cre_is_post_status( $status ) {
	global $post;

	if ( ! $post ) {
		return false;
	}

	$current_status = get_post_status( $post->ID );

	if ( is_array( $status ) ) {
		return in_array( $current_status, $status, true );
	}

	return $current_status === $status;
}

/**
 * Check if current post type is viewable (excludes Site Editor post types)
 *
 * @return bool True if viewable, false otherwise
 */
function cre_is_viewable_post_type() {
	$screen = cre_get_current_screen();
	if ( ! $screen || ! $screen->post_type ) {
		return false;
	}

	$post_type_object = get_post_type_object( $screen->post_type );
	return $post_type_object && ! empty( $post_type_object->publicly_queryable );
}

/**
 * Check if current post type is a design post type (Site Editor)
 *
 * @return bool True if design post type, false otherwise
 */
function cre_is_design_post_type() {
	$design_post_types = array(
		'wp_template',
		'wp_template_part',
		'wp_block',
		'wp_navigation',
	);

	$screen = cre_get_current_screen();
	if ( ! $screen ) {
		return false;
	}

	return in_array( $screen->post_type, $design_post_types, true );
}

/**
 * Check multiple conditions (AND logic)
 *
 * @param array $conditions Array of condition callbacks.
 * @return bool True if all conditions pass, false otherwise
 */
function cre_check_conditions( $conditions ) {
	foreach ( $conditions as $condition ) {
		if ( is_callable( $condition ) && ! $condition() ) {
			return false;
		}
	}
	return true;
}

/**
 * Check if any condition passes (OR logic)
 *
 * @param array $conditions Array of condition callbacks.
 * @return bool True if any condition passes, false otherwise
 */
function cre_check_any_condition( $conditions ) {
	foreach ( $conditions as $condition ) {
		if ( is_callable( $condition ) && $condition() ) {
			return true;
		}
	}
	return false;
}
