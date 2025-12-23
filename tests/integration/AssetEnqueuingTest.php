<?php
/**
 * Integration tests for plugin asset enqueuing
 *
 * @package ConditionalRenderingExamples
 */
class AssetEnqueuingTest extends WP_UnitTestCase {

	/**
	 * Set up the test environment.
	 */
	public function set_up() {
		parent::set_up();
		// Reset enqueued scripts and styles.
		global $wp_scripts, $wp_styles;
		$wp_scripts = null;
		$wp_styles  = null;
	}

	/**
	 * Test that main assets are enqueued on block editor screens
	 */
	public function test_main_assets_enqueued_on_block_editor() {
		// Simulate block editor screen.
		set_current_screen( 'post' );

		// Trigger the action.
		do_action( 'enqueue_block_editor_assets' );

		// Check if main script is enqueued.
		$this->assertTrue( wp_script_is( 'conditional-rendering-examples', 'enqueued' ) );

		// Check if main style is enqueued.
		$this->assertTrue( wp_style_is( 'conditional-rendering-examples', 'enqueued' ) );
	}

	/**
	 * Test that editor-only script is enqueued when in block editor
	 */
	public function test_editor_only_script_enqueued() {

		// Simulate block editor screen.
		set_current_screen( 'post' );
		$screen                  = get_current_screen();
		$screen->is_block_editor = true;

		// Trigger the action.
		do_action( 'admin_enqueue_scripts', 'post.php' );

		// Check if editor-only script is enqueued.
		$this->assertTrue( wp_script_is( 'cre-editor-only', 'enqueued' ) );
	}

	/**
	 * Test that editor-only script is NOT enqueued when not in block editor
	 */
	public function test_editor_only_script_not_enqueued() {
		// Simulate non-block editor screen.
		set_current_screen( 'dashboard' );

		// Trigger the action.
		do_action( 'admin_enqueue_scripts', 'index.php' );

		// Check if editor-only script is NOT enqueued.
		$this->assertFalse( wp_script_is( 'cre-editor-only', 'enqueued' ) );
	}

	/**
	 * Test that page-only script is enqueued for page post type
	 */
	public function test_page_only_script_enqueued() {

		// Simulate page edit screen.
		set_current_screen( 'page' );
		$screen            = get_current_screen();
		$screen->post_type = 'page';

		// Trigger the action.
		do_action( 'admin_enqueue_scripts', 'post.php' );

		// Check if page-only script is enqueued.
		$this->assertTrue( wp_script_is( 'cre-page-only', 'enqueued' ) );
	}

	/**
	 * Test that page-only script is NOT enqueued for post post type
	 */
	public function test_page_only_script_not_enqueued_for_post() {

		// Simulate post edit screen.
		set_current_screen( 'post' );
		$screen            = get_current_screen();
		$screen->post_type = 'post';

		// Trigger the action.
		do_action( 'admin_enqueue_scripts', 'post.php' );

		// Check if page-only script is NOT enqueued.
		$this->assertFalse( wp_script_is( 'cre-page-only', 'enqueued' ) );
	}

	/**
	 * Test that publisher-only script is enqueued for users with publish_posts capability
	 */
	public function test_publisher_only_script_enqueued() {
		// Create editor user.
		$editor_id = static::factory()->user->create( array( 'role' => 'editor' ) );
		wp_set_current_user( $editor_id );

		// Simulate post edit screen.
		set_current_screen( 'post' );

		// Trigger the action.
		do_action( 'admin_enqueue_scripts', 'post.php' );

		// Check if publisher-only script is enqueued.
		$this->assertTrue( wp_script_is( 'cre-publisher-only', 'enqueued' ) );
	}

	/**
	 * Test that publisher-only script is NOT enqueued for users without publish_posts capability
	 */
	public function test_publisher_only_script_not_enqueued() {
		// Create subscriber user.
		$subscriber_id = static::factory()->user->create( array( 'role' => 'subscriber' ) );
		wp_set_current_user( $subscriber_id );

		// Simulate dashboard screen.
		set_current_screen( 'dashboard' );

		// Trigger the action.
		do_action( 'admin_enqueue_scripts', 'index.php' );

		// Check if publisher-only script is NOT enqueued.
		$this->assertFalse( wp_script_is( 'cre-publisher-only', 'enqueued' ) );
	}

	/**
	 * Test that no-site-editor script is enqueued when not in site editor
	 */
	public function test_no_site_editor_script_enqueued() {
		global $pagenow;
		$pagenow = 'post.php';

		// Simulate post edit screen.
		set_current_screen( 'post' );

		// Trigger the action.
		do_action( 'admin_enqueue_scripts', 'post.php' );

		// Check if no-site-editor script is enqueued.
		$this->assertTrue( wp_script_is( 'cre-no-site-editor', 'enqueued' ) );
	}

	/**
	 * Test that no-site-editor script is NOT enqueued in site editor
	 */
	public function test_no_site_editor_script_not_enqueued() {
		global $pagenow;
		$pagenow = 'site-editor.php';

		// Simulate site editor screen.
		set_current_screen( 'site-editor' );

		// Trigger the action.
		do_action( 'admin_enqueue_scripts', 'site-editor.php' );

		// Check if no-site-editor script is NOT enqueued.
		$this->assertFalse( wp_script_is( 'cre-no-site-editor', 'enqueued' ) );
	}

	/**
	 * Test that post-edit-only script is enqueued on post edit screens
	 */
	public function test_post_edit_only_script_enqueued() {
		// Simulate post edit screen.
		set_current_screen( 'post' );

		// Trigger the action.
		do_action( 'admin_enqueue_scripts', 'post.php' );

		// Check if post-edit-only script is enqueued.
		$this->assertTrue( wp_script_is( 'cre-post-edit-only', 'enqueued' ) );
	}

	/**
	 * Test that post-edit-only script is NOT enqueued on other screens
	 */
	public function test_post_edit_only_script_not_enqueued() {
		// Simulate dashboard screen.
		set_current_screen( 'dashboard' );

		// Trigger the action.
		do_action( 'admin_enqueue_scripts', 'index.php' );

		// Check if post-edit-only script is NOT enqueued.
		$this->assertFalse( wp_script_is( 'cre-post-edit-only', 'enqueued' ) );
	}

	/**
	 * Test inline scripts are added with correct messages.
	 */
	public function test_inline_scripts_added() {
		global $wp_scripts;

		// Create editor user.
		$editor_id = static::factory()->user->create( array( 'role' => 'editor' ) );
		wp_set_current_user( $editor_id );

		// Simulate block editor screen.
		set_current_screen( 'post' );
		$screen                  = get_current_screen();
		$screen->is_block_editor = true;

		// Trigger the action.
		do_action( 'admin_enqueue_scripts', 'post.php' );

		// Get the inline scripts.
		if ( isset( $wp_scripts->registered['cre-editor-only'] ) ) {
			$extra = $wp_scripts->registered['cre-editor-only']->extra;

			// Check if inline script was added.
			$this->assertArrayHasKey( 'after', $extra );
			$this->assertStringContainsString( 'Block Editor detected', $extra['after'][1] );
		}
	}

	/**
	 * Test multiple conditional scripts enqueued together.
	 */
	public function test_multiple_conditional_scripts_enqueued() {
		global $pagenow;
		$pagenow = 'post.php';

		// Create editor user.
		$editor_id = static::factory()->user->create( array( 'role' => 'editor' ) );
		wp_set_current_user( $editor_id );

		// Simulate post edit screen with block editor.
		set_current_screen( 'post' );
		$screen                  = get_current_screen();
		$screen->is_block_editor = true;
		$screen->post_type       = 'post';

		// Trigger the action.
		do_action( 'admin_enqueue_scripts', 'post.php' );

		// Check if multiple scripts are enqueued.
		$this->assertTrue( wp_script_is( 'cre-editor-only', 'enqueued' ) );
		$this->assertTrue( wp_script_is( 'cre-publisher-only', 'enqueued' ) );
		$this->assertTrue( wp_script_is( 'cre-no-site-editor', 'enqueued' ) );
		$this->assertTrue( wp_script_is( 'cre-post-edit-only', 'enqueued' ) );
	}
}
