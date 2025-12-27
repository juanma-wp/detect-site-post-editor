/**
 * E2E Tests: ExcludePostTypesComponent
 *
 * Tests the React component that excludes 'attachment' and 'wp_block' post types.
 *
 * @package ConditionalRenderingExamples
 */

const { test, expect } = require('@wordpress/e2e-test-utils-playwright');
const { waitForEditorReady } = require('./utils');

test.describe('ExcludePostTypesComponent - Client-Side Rendering', () => {
	test('should render component for post (not excluded)', async ({ page, admin, editor }) => {
		// Create a new post
		await admin.createNewPost({ postType: 'post' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Check if the exclude post types component is visible
		const component = page.locator('[data-testid="exclude-post-types"]');
		await expect(component).toBeVisible();

		// Verify the content
		await expect(component.locator('h3')).toContainText('Exclude Post Types');
		await expect(component).toContainText('Current post type: post');
		await expect(component).toContainText("excludes 'attachment' and 'wp_block' post types");
	});

	test('should render component for page (not excluded)', async ({ page, admin, editor }) => {
		// Create a new page
		await admin.createNewPost({ postType: 'page' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Check if the component is visible
		const component = page.locator('[data-testid="exclude-post-types"]');
		await expect(component).toBeVisible();

		// Verify the content
		await expect(component).toContainText('Current post type: page');
	});

	test('should render component for product (not excluded)', async ({ page, admin, editor }) => {
		// Create a new product (custom post type registered in plugin.php)
		await admin.createNewPost({ postType: 'product' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Check if the component is visible
		const component = page.locator('[data-testid="exclude-post-types"]');
		await expect(component).toBeVisible();

		// Verify the content
		await expect(component).toContainText('Current post type: product');
	});

	test('should NOT render component for patterns - (excluded "wp_block" post type)', async ({
    page,
    admin,
    editor,
  }) => {
    // Create a new reusable block (wp_block post type)
    await admin.createNewPost({ postType: "wp_block" });

    // Wait for editor to be ready
    await waitForEditorReady(editor, page);

    // Open settings sidebar
    await editor.openDocumentSettingsSidebar();

    // The component should NOT be visible for wp_block post type
    const component = page.locator('[data-testid="exclude-post-types"]');
    await expect(component).not.toBeVisible();
  });

	test('should NOT render in Site Editor', async ({ page, admin }) => {
		// Navigate to Site Editor
		await admin.visitSiteEditor();

		// Wait for Site Editor to load
		await page.waitForTimeout(5000);

		// The component should NOT be visible in Site Editor
		const component = page.locator('[data-testid="exclude-post-types"]');
		await expect(component).not.toBeVisible();
	});
});
