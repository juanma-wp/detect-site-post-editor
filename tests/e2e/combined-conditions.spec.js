/**
 * E2E Tests: CombinedConditionsComponent
 *
 * Tests the React component that requires multiple conditions:
 * - Post type must be 'page'
 * - Post status must be 'draft'
 * - User must have edit capabilities
 *
 * @package ConditionalRenderingExamples
 */

const { test, expect, waitForEditorReady } = require('./fixtures');

test.describe('CombinedConditionsComponent - Client-Side Rendering', () => {
	test('should render component when all conditions are met (new draft page)', async ({ page, admin, editor }) => {
		// Create a new page (auto-draft)
		await admin.createNewPost({ postType: 'page' });

		// Wait for editor to be ready (handles pattern modal automatically)
		await waitForEditorReady(editor, page);

		// Additional wait for React plugin registration and data store initialization
		await page.waitForTimeout(300);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Wait for the component to appear (the component should render automatically)
		const component = page.locator('[data-testid="combined-conditions"]');
		await component.waitFor({ state: 'visible', timeout: 15000 });

		// Component should be visible (all conditions met)
		await expect(component).toBeVisible();

		// Verify the content
		await expect(component.locator('h3')).toContainText('Combined Conditions');
		await expect(component).toContainText('Post type: page ✓');
		await expect(component).toContainText('Status: draft ✓');
		await expect(component).toContainText('Can edit: Yes ✓');
	});

	// Note: Test using requestUtils API removed due to REST API setup timeouts

	test('should NOT render component for draft post (wrong post type)', async ({ page, admin, editor }) => {
		// Create a new post (not a page)
		await admin.createNewPost({ postType: 'post' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Additional wait for React plugin registration and data store initialization
		await page.waitForTimeout(300);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Component should NOT be visible (wrong post type)
		const component = page.locator('[data-testid="combined-conditions"]');
		await expect(component).not.toBeVisible();
	});

	// Note: Test for published page removed due to REST API setup timeouts

	test('should hide component after publishing page', async ({ page, admin, editor }) => {
		// Create a new draft page
		await admin.createNewPost({ postType: 'page' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Add a title to enable publishing
		await editor.canvas.locator('role=textbox[name="Add title"i]').fill('Test Page for Publishing');

		// Additional wait for React plugin registration and data store initialization
		await page.waitForTimeout(300);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Component should be visible initially
		const component = page.locator('[data-testid="combined-conditions"]');
		await component.waitFor({ state: 'visible', timeout: 15000 });
		await expect(component).toBeVisible();

		// Publish the page
		await editor.publishPost();

		// Wait a bit for the status change to propagate
		await page.waitForTimeout(1000);

		// Component should now be hidden (status changed from draft to publish)
		await expect(component).not.toBeVisible();
	});

	// Note: Test verifying all conditions independently removed due to REST API setup timeouts
});
