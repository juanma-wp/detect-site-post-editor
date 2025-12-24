/**
 * E2E Tests: ViewablePostTypeComponent
 *
 * Tests the React component that only renders for viewable post types.
 *
 * @package ConditionalRenderingExamples
 */

const { test, expect, waitForEditorReady } = require('./fixtures');

test.describe('ViewablePostTypeComponent - Client-Side Rendering', () => {
	test('should render component for post (viewable type)', async ({ page, admin, editor }) => {
		// Create a new post
		await admin.createNewPost({ postType: 'post' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Check if the viewable post type component is visible
		// Increased timeout for better reliability (core data store needs time to load) in slow CI
		const component = page.locator('[data-testid="viewable-post-type"]');
		await component.waitFor({ state: 'visible', timeout: 45000 });
		await expect(component).toBeVisible();

		// Verify the content
		await expect(component.locator('h3')).toContainText('Viewable Post Type');
		await expect(component).toContainText('Current post type: post');
		await expect(component).toContainText('Is viewable: Yes');
	});

	test('should render component for page (viewable type)', async ({ page, admin, editor }) => {
		// Create a new page
		await admin.createNewPost({ postType: 'page' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Check if the component is visible
		// Increased timeout for better reliability (core data store needs time to load) in slow CI
		const component = page.locator('[data-testid="viewable-post-type"]');
		await component.waitFor({ state: 'visible', timeout: 45000 });
		await expect(component).toBeVisible();

		// Verify the content
		await expect(component).toContainText('Current post type: page');
		await expect(component).toContainText('Is viewable: Yes');
	});

	test('should render component for product (viewable custom type)', async ({ page, admin, editor }) => {
		// Create a new product
		await admin.createNewPost({ postType: 'product' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Check if the component is visible
		// Increased timeout for better reliability (core data store needs time to load) in slow CI
		const component = page.locator('[data-testid="viewable-post-type"]');
		await component.waitFor({ state: 'visible', timeout: 45000 });
		await expect(component).toBeVisible();

		// Verify the content
		await expect(component).toContainText('Current post type: product');
		await expect(component).toContainText('Is viewable: Yes');
	});

	test('should NOT render in Site Editor', async ({ page, admin }) => {
		// Navigate to Site Editor
		await admin.visitSiteEditor();

		// Wait for Site Editor to load (check for canvas instead of specific selector)
		await page.waitForTimeout(5000);

		// The component should NOT be visible in Site Editor
		// (because templates are not viewable post types)
		const component = page.locator('[data-testid="viewable-post-type"]');
		await expect(component).not.toBeVisible();
	});
});
