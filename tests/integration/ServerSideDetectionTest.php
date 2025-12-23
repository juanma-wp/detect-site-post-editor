<?php
/**
 * Integration tests for server-side detection functions
 *
 * @package ConditionalRenderingExamples
 */

class ServerSideDetectionTest extends WP_UnitTestCase {

	public function set_up() {
		parent::set_up();
		set_current_screen( 'dashboard' );
	}

	public function tear_down() {
		parent::tear_down();
	}

	/**
	 * Test cre_is_block_editor() function
	 */
	public function test_is_block_editor() {
		// Test when screen doesn't exist
		set_current_screen( 'front' );
		$this->assertFalse( cre_is_block_editor() );

		// Test with post editor screen
		$post_id = $this->factory->post->create();
		set_current_screen( 'post' );

		// Mock the screen to return is_block_editor true
		$screen = get_current_screen();
		$screen->is_block_editor = true;
		$this->assertTrue( cre_is_block_editor() );

		// Test when block editor is false
		$screen->is_block_editor = false;
		$this->assertFalse( cre_is_block_editor() );
	}

	/**
	 * Test cre_is_post_edit_screen() function
	 */
	public function test_is_post_edit_screen() {
		// Test with post edit screen
		set_current_screen( 'post' );
		$this->assertTrue( cre_is_post_edit_screen() );

		// Test with dashboard screen
		set_current_screen( 'dashboard' );
		$this->assertFalse( cre_is_post_edit_screen() );

		// Test with edit screen (list view)
		set_current_screen( 'edit' );
		$this->assertFalse( cre_is_post_edit_screen() );
	}

	/**
	 * Test cre_is_site_editor() function
	 */
	public function test_is_site_editor() {
		global $pagenow;

		// Test when in site editor
		$pagenow = 'site-editor.php';
		$this->assertTrue( cre_is_site_editor() );

		// Test when not in site editor
		$pagenow = 'post.php';
		$this->assertFalse( cre_is_site_editor() );

		$pagenow = 'index.php';
		$this->assertFalse( cre_is_site_editor() );
	}

	/**
	 * Test cre_is_post_type() with single post type
	 */
	public function test_is_post_type_single() {
		// Test with post type
		$post_id = $this->factory->post->create();
		set_current_screen( 'post' );
		$screen = get_current_screen();
		$screen->post_type = 'post';
		$this->assertTrue( cre_is_post_type( 'post' ) );
		$this->assertFalse( cre_is_post_type( 'page' ) );

		// Test with page type
		$screen->post_type = 'page';
		$this->assertTrue( cre_is_post_type( 'page' ) );
		$this->assertFalse( cre_is_post_type( 'post' ) );
	}

	/**
	 * Test cre_is_post_type() with array of post types
	 */
	public function test_is_post_type_array() {
		set_current_screen( 'post' );
		$screen = get_current_screen();
		$screen->post_type = 'post';

		$this->assertTrue( cre_is_post_type( array( 'post', 'page' ) ) );
		$this->assertTrue( cre_is_post_type( array( 'post', 'product' ) ) );
		$this->assertFalse( cre_is_post_type( array( 'page', 'product' ) ) );
	}

	/**
	 * Test cre_is_not_post_type() function
	 */
	public function test_is_not_post_type() {
		set_current_screen( 'post' );
		$screen = get_current_screen();
		$screen->post_type = 'post';

		$this->assertTrue( cre_is_not_post_type( array( 'page', 'product' ) ) );
		$this->assertFalse( cre_is_not_post_type( array( 'post', 'page' ) ) );
		$this->assertFalse( cre_is_not_post_type( array( 'post' ) ) );
	}

	/**
	 * Test cre_user_can_publish_posts() function
	 */
	public function test_user_can_publish_posts() {
		// Create user with publish_posts capability
		$editor_id = $this->factory->user->create( array( 'role' => 'editor' ) );
		wp_set_current_user( $editor_id );
		$this->assertTrue( cre_user_can_publish_posts() );

		// Create user without publish_posts capability
		$subscriber_id = $this->factory->user->create( array( 'role' => 'subscriber' ) );
		wp_set_current_user( $subscriber_id );
		$this->assertFalse( cre_user_can_publish_posts() );
	}

	/**
	 * Test cre_user_can_edit_posts() function
	 */
	public function test_user_can_edit_posts() {
		// Create user with edit_posts capability
		$editor_id = $this->factory->user->create( array( 'role' => 'editor' ) );
		wp_set_current_user( $editor_id );
		$this->assertTrue( cre_user_can_edit_posts() );

		// Create user without edit_posts capability
		$subscriber_id = $this->factory->user->create( array( 'role' => 'subscriber' ) );
		wp_set_current_user( $subscriber_id );
		$this->assertFalse( cre_user_can_edit_posts() );
	}

	/**
	 * Test cre_user_can_edit_pages() function
	 */
	public function test_user_can_edit_pages() {
		// Create user with edit_pages capability
		$editor_id = $this->factory->user->create( array( 'role' => 'editor' ) );
		wp_set_current_user( $editor_id );
		$this->assertTrue( cre_user_can_edit_pages() );

		// Create user without edit_pages capability
		$subscriber_id = $this->factory->user->create( array( 'role' => 'subscriber' ) );
		wp_set_current_user( $subscriber_id );
		$this->assertFalse( cre_user_can_edit_pages() );
	}

	/**
	 * Test cre_is_template() function
	 */
	public function test_is_template() {
		// Create a page with a template
		$page_id = $this->factory->post->create( array(
			'post_type' => 'page',
		) );
		update_post_meta( $page_id, '_wp_page_template', 'full-width' );

		global $post;
		$post = get_post( $page_id );

		$this->assertTrue( cre_is_template( 'full-width' ) );
		$this->assertFalse( cre_is_template( 'sidebar' ) );

		// Test with no post
		$post = null;
		$this->assertFalse( cre_is_template( 'full-width' ) );
	}

	/**
	 * Test cre_is_post_status() with single status
	 */
	public function test_is_post_status_single() {
		$post_id = $this->factory->post->create( array(
			'post_status' => 'publish',
		) );

		global $post;
		$post = get_post( $post_id );

		$this->assertTrue( cre_is_post_status( 'publish' ) );
		$this->assertFalse( cre_is_post_status( 'draft' ) );
	}

	/**
	 * Test cre_is_post_status() with array of statuses
	 */
	public function test_is_post_status_array() {
		$post_id = $this->factory->post->create( array(
			'post_status' => 'draft',
		) );

		global $post;
		$post = get_post( $post_id );

		$this->assertTrue( cre_is_post_status( array( 'draft', 'pending' ) ) );
		$this->assertFalse( cre_is_post_status( array( 'publish', 'private' ) ) );
	}

	/**
	 * Test cre_is_viewable_post_type() function
	 */
	public function test_is_viewable_post_type() {
		// Test with viewable post type (post)
		set_current_screen( 'post' );
		$screen = get_current_screen();
		$screen->post_type = 'post';
		$this->assertTrue( cre_is_viewable_post_type() );

		// Test with viewable post type (page) - need to verify publicly_queryable
		$screen->post_type = 'page';
		$page_type = get_post_type_object( 'page' );
		// Pages are public but not publicly_queryable in some WP configurations
		if ( $page_type && $page_type->publicly_queryable ) {
			$this->assertTrue( cre_is_viewable_post_type() );
		} else {
			// If page is not publicly_queryable, the function should return false
			$this->assertFalse( cre_is_viewable_post_type() );
		}

		// Test with non-viewable post type (wp_template)
		$screen->post_type = 'wp_template';
		$this->assertFalse( cre_is_viewable_post_type() );
	}

	/**
	 * Test cre_is_design_post_type() function
	 */
	public function test_is_design_post_type() {
		set_current_screen( 'post' );
		$screen = get_current_screen();

		// Test with design post types
		$design_types = array( 'wp_template', 'wp_template_part', 'wp_block', 'wp_navigation' );
		foreach ( $design_types as $type ) {
			$screen->post_type = $type;
			$this->assertTrue( cre_is_design_post_type(), "Failed for post type: $type" );
		}

		// Test with regular post types
		$screen->post_type = 'post';
		$this->assertFalse( cre_is_design_post_type() );

		$screen->post_type = 'page';
		$this->assertFalse( cre_is_design_post_type() );
	}

	/**
	 * Test cre_check_conditions() with all true conditions
	 */
	public function test_check_conditions_all_true() {
		$conditions = array(
			function() { return true; },
			function() { return true; },
			function() { return true; },
		);
		$this->assertTrue( cre_check_conditions( $conditions ) );
	}

	/**
	 * Test cre_check_conditions() with mixed conditions
	 */
	public function test_check_conditions_mixed() {
		$conditions = array(
			function() { return true; },
			function() { return false; },
			function() { return true; },
		);
		$this->assertFalse( cre_check_conditions( $conditions ) );
	}

	/**
	 * Test cre_check_conditions() with empty array
	 */
	public function test_check_conditions_empty() {
		$this->assertTrue( cre_check_conditions( array() ) );
	}

	/**
	 * Test cre_check_any_condition() with at least one true
	 */
	public function test_check_any_condition_with_true() {
		$conditions = array(
			function() { return false; },
			function() { return true; },
			function() { return false; },
		);
		$this->assertTrue( cre_check_any_condition( $conditions ) );
	}

	/**
	 * Test cre_check_any_condition() with all false
	 */
	public function test_check_any_condition_all_false() {
		$conditions = array(
			function() { return false; },
			function() { return false; },
			function() { return false; },
		);
		$this->assertFalse( cre_check_any_condition( $conditions ) );
	}

	/**
	 * Test cre_check_any_condition() with empty array
	 */
	public function test_check_any_condition_empty() {
		$this->assertFalse( cre_check_any_condition( array() ) );
	}

	/**
	 * Test complex condition checking
	 */
	public function test_complex_conditions() {
		// Setup: Create editor user and post edit screen
		$editor_id = $this->factory->user->create( array( 'role' => 'editor' ) );
		wp_set_current_user( $editor_id );

		set_current_screen( 'post' );
		$screen = get_current_screen();
		$screen->post_type = 'post';

		// Test: User can edit posts AND is on post type
		$conditions = array(
			'cre_user_can_edit_posts',
			function() { return cre_is_post_type( 'post' ); },
		);
		$this->assertTrue( cre_check_conditions( $conditions ) );

		// Test: User can edit posts OR is on page type
		$conditions = array(
			'cre_user_can_edit_posts',
			function() { return cre_is_post_type( 'page' ); },
		);
		$this->assertTrue( cre_check_any_condition( $conditions ) );
	}
}
