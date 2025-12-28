/**
 * E2E Tests: ExcludeDesignPostTypesComponent
 *
 * Tests the React component that excludes design post types (Site Editor contexts).
 * Excluded types: wp_template, wp_template_part, wp_block, wp_navigation
 *
 * @package ConditionalRenderingExamples
 */

const { test, expect } = require('@wordpress/e2e-test-utils-playwright');
const { waitForEditorReady } = require('./utils');

test.describe('ExcludeDesignPostTypesComponent - Client-Side Rendering', () => {
	test('should render component for post (not excluded)', async ({ page, admin, editor }) => {
		// Create a new post
		await admin.createNewPost({ postType: 'post' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Check if the exclude design post types component is visible
		const component = page.locator('[data-testid="exclude-design-post-types"]');
		await expect(component).toBeVisible();

		// Verify the content
		await expect(component.locator('h3')).toContainText('Exclude Design Post Types');
		await expect(component).toContainText('Current post type: post');
		await expect(component).toContainText('Excluded types: wp_template, wp_template_part, wp_block, wp_navigation');
	});

	test('should render component for page (not excluded)', async ({ page, admin, editor }) => {
		// Create a new page
		await admin.createNewPost({ postType: 'page' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Check if the component is visible
		const component = page.locator('[data-testid="exclude-design-post-types"]');
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
		const component = page.locator('[data-testid="exclude-design-post-types"]');
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

    // Dismiss the "Create pattern" modal that appears for wp_block post type
    try {
      await page
        .getByRole("dialog", { name: "Create pattern" })
        .getByRole("button", { name: "Close" })
        .click({ timeout: 2000 });
    } catch {
      // Modal didn't appear or already dismissed
    }

    // Open settings sidebar
    await editor.openDocumentSettingsSidebar();

    // The component should NOT be visible for wp_block post type
    const component = page.locator('[data-testid="exclude-design-post-types"]');
    await expect(component).not.toBeVisible();
  });

	test('should NOT render in Site Editor', async ({ page, admin, editor }) => {
    // Navigate to Site Editor with a template in edit mode
    await admin.visitSiteEditor({
      postType: 'wp_template',
      canvas: 'edit',
    });

    // Open settings sidebar
    await editor.openDocumentSettingsSidebar();

    // The component should NOT be visible in Site Editor
    const component = page.locator('[data-testid="exclude-design-post-types"]');
    await expect(component).not.toBeVisible();
  });
});
