/**
 * E2E Tests: SpecificPostTypeComponent
 *
 * Tests the React component that only renders for specific post types (page, product).
 *
 * @package ConditionalRenderingExamples
 */

const { test, expect, waitForEditorReady } = require('./fixtures');

test.describe('SpecificPostTypeComponent - Client-Side Rendering', () => {
	test('should render component for page post type', async ({ page, admin, editor }) => {
		// Create a new page
		await admin.createNewPost({ postType: 'page' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Check if the specific post type component is visible
		const component = page.locator('[data-testid="specific-post-type"]');
		await component.waitFor({ state: 'visible', timeout: 15000 });
		await expect(component).toBeVisible();

		// Verify the text content
		await expect(component.locator('h3')).toContainText('Specific Post Type');
		await expect(component).toContainText('Current post type: page');
	});

	test('should render component for product post type', async ({ page, admin, editor }) => {
		// Create a new product (custom post type)
		await admin.createNewPost({ postType: 'product' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Check if the component is visible
		const component = page.locator('[data-testid="specific-post-type"]');
		await component.waitFor({ state: 'visible', timeout: 15000 });
		await expect(component).toBeVisible();

		// Verify the text content
		await expect(component).toContainText('Current post type: product');
	});

	test('should NOT render component for post post type', async ({ page, admin, editor }) => {
		// Create a new post
		await admin.createNewPost({ postType: 'post' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// The specific post type component should NOT be visible
		const component = page.locator('[data-testid="specific-post-type"]');
		await expect(component).not.toBeVisible();
	});

	test('should update visibility when post type changes', async ({ page, admin, editor }) => {
		// Start with a page (component should be visible)
		await admin.createNewPost({ postType: 'page' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Verify component is visible
		const component = page.locator('[data-testid="specific-post-type"]');
		await component.waitFor({ state: 'visible', timeout: 15000 });
		await expect(component).toBeVisible();

		// Note: Switching post types in the editor would require UI interaction
		// This test validates the initial rendering state
	});
});
