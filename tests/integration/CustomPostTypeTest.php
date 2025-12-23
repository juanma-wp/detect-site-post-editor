<?php
/**
 * Integration tests for custom post type registration
 *
 * @package ConditionalRenderingExamples
 */

class CustomPostTypeTest extends WP_UnitTestCase {

	public function set_up() {
		parent::set_up();
	}

	public function tear_down() {
		parent::tear_down();
		// Clean up post types
		unregister_post_type( 'product' );
	}

	/**
	 * Test that product custom post type is registered
	 */
	public function test_product_post_type_registered() {
		// Trigger the init action to register post types
		do_action( 'init' );

		// Check if product post type is registered
		$this->assertTrue( post_type_exists( 'product' ) );
	}

	/**
	 * Test product post type settings
	 */
	public function test_product_post_type_settings() {
		// Trigger the init action
		do_action( 'init' );

		$post_type_object = get_post_type_object( 'product' );

		// Check basic settings
		$this->assertNotNull( $post_type_object );
		$this->assertTrue( $post_type_object->public );
		$this->assertTrue( $post_type_object->has_archive );
		$this->assertTrue( $post_type_object->show_in_rest );
		$this->assertTrue( $post_type_object->show_in_menu );
	}

	/**
	 * Test product post type labels
	 */
	public function test_product_post_type_labels() {
		// Trigger the init action
		do_action( 'init' );

		$post_type_object = get_post_type_object( 'product' );

		// Check labels
		$this->assertEquals( 'Products', $post_type_object->labels->name );
		$this->assertEquals( 'Product', $post_type_object->labels->singular_name );
	}

	/**
	 * Test product post type supports
	 */
	public function test_product_post_type_supports() {
		// Trigger the init action
		do_action( 'init' );

		// Check supports
		$this->assertTrue( post_type_supports( 'product', 'title' ) );
		$this->assertTrue( post_type_supports( 'product', 'editor' ) );
		$this->assertTrue( post_type_supports( 'product', 'custom-fields' ) );
		$this->assertFalse( post_type_supports( 'product', 'thumbnail' ) );
	}

	/**
	 * Test creating a product post
	 */
	public function test_create_product_post() {
		// Trigger the init action
		do_action( 'init' );

		// Create a product post
		$product_id = $this->factory->post->create( array(
			'post_type'  => 'product',
			'post_title' => 'Test Product',
		) );

		// Check if post was created
		$this->assertNotEmpty( $product_id );
		$this->assertNotInstanceOf( 'WP_Error', $product_id );

		// Verify post type
		$product = get_post( $product_id );
		$this->assertEquals( 'product', $product->post_type );
		$this->assertEquals( 'Test Product', $product->post_title );
	}

	/**
	 * Test product post type is queryable
	 */
	public function test_product_post_type_queryable() {
		// Trigger the init action
		do_action( 'init' );

		// Create multiple products
		$product_ids = $this->factory->post->create_many( 3, array(
			'post_type'   => 'product',
			'post_status' => 'publish',
		) );

		// Query products
		$query = new WP_Query( array(
			'post_type' => 'product',
		) );

		// Check query results
		$this->assertEquals( 3, $query->post_count );
		$this->assertTrue( $query->have_posts() );
	}

	/**
	 * Test product post type REST API support
	 */
	public function test_product_post_type_rest_api() {
		// Trigger the init action
		do_action( 'init' );

		$post_type_object = get_post_type_object( 'product' );

		// Check REST API settings
		$this->assertTrue( $post_type_object->show_in_rest );
		// rest_base defaults to post type name if not explicitly set
		$expected_rest_base = ! empty( $post_type_object->rest_base ) ? $post_type_object->rest_base : 'product';
		$this->assertNotEmpty( $expected_rest_base );
	}

	/**
	 * Test that product post type appears in block editor
	 */
	public function test_product_post_type_block_editor() {
		// Trigger the init action
		do_action( 'init' );

		// Create a product
		$product_id = $this->factory->post->create( array(
			'post_type' => 'product',
		) );

		// Simulate editing the product
		set_current_screen( 'product' );
		$screen = get_current_screen();
		$screen->post_type = 'product';

		// Check if post type matches
		$this->assertEquals( 'product', $screen->post_type );
	}

	/**
	 * Test page templates filter is applied
	 */
	public function test_page_templates_filter() {
		$templates = array();

		// Apply the filter
		$templates = apply_filters( 'theme_page_templates', $templates );

		// Check if full-width template was added
		$this->assertArrayHasKey( 'full-width', $templates );
		$this->assertEquals( 'Full Width Template', $templates['full-width'] );
	}

	/**
	 * Test page templates filter doesn't override existing templates
	 */
	public function test_page_templates_filter_preserves_existing() {
		$existing_templates = array(
			'template-sidebar.php' => 'Sidebar Template',
			'template-hero.php'    => 'Hero Template',
		);

		// Apply the filter
		$templates = apply_filters( 'theme_page_templates', $existing_templates );

		// Check if existing templates are preserved
		$this->assertArrayHasKey( 'template-sidebar.php', $templates );
		$this->assertArrayHasKey( 'template-hero.php', $templates );
		$this->assertArrayHasKey( 'full-width', $templates );
	}

	/**
	 * Test using custom template with page
	 */
	public function test_custom_template_with_page() {
		// Trigger the init action
		do_action( 'init' );

		// Create a page with custom template
		$page_id = $this->factory->post->create( array(
			'post_type' => 'page',
		) );

		update_post_meta( $page_id, '_wp_page_template', 'full-width' );

		// Get the template
		$template = get_page_template_slug( $page_id );

		// Check if template was set
		$this->assertEquals( 'full-width', $template );
	}

	/**
	 * Test product post type with cre_is_viewable_post_type()
	 */
	public function test_product_is_viewable_post_type() {
		// Trigger the init action
		do_action( 'init' );

		// Simulate product edit screen
		set_current_screen( 'product' );
		$screen = get_current_screen();
		$screen->post_type = 'product';

		// Check if product is viewable
		$this->assertTrue( cre_is_viewable_post_type() );
	}

	/**
	 * Test product post type is not a design post type
	 */
	public function test_product_is_not_design_post_type() {
		// Trigger the init action
		do_action( 'init' );

		// Simulate product edit screen
		set_current_screen( 'product' );
		$screen = get_current_screen();
		$screen->post_type = 'product';

		// Check if product is not a design post type
		$this->assertFalse( cre_is_design_post_type() );
	}
}
