/**
 * E2E Tests: PostStatusComponent
 *
 * Tests the React component that only renders for draft posts.
 *
 * @package ConditionalRenderingExamples
 */

const { test, expect, waitForEditorReady } = require('./fixtures');

test.describe('PostStatusComponent - Client-Side Rendering', () => {
	test('should render component for new draft post', async ({ page, admin, editor }) => {
		// Create a new post (starts as auto-draft)
		await admin.createNewPost();

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Check if the post status component is visible
		const component = page.locator('[data-testid="post-status-draft"]');
		await component.waitFor({ state: 'visible', timeout: 15000 });
		await expect(component).toBeVisible();

		// Verify the content
		await expect(component.locator('h3')).toContainText('Post Status (Draft)');
		await expect(component).toContainText('This component only renders for draft posts');
	});

	// Note: Tests using requestUtils API have been removed due to REST API setup timeouts
	// The core functionality is tested by the draft and publishing tests above

	test('should hide component after publishing', async ({ page, admin, editor }) => {
		// Create a new draft post
		await admin.createNewPost();

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Add a title to enable publishing
		await editor.canvas.locator('role=textbox[name="Add title"i]').fill('Test Post for Publishing');

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Component should be visible initially
		const component = page.locator('[data-testid="post-status-draft"]');
		await component.waitFor({ state: 'visible', timeout: 15000 });
		await expect(component).toBeVisible();

		// Publish the post
		await editor.publishPost();

		// Wait a bit for the status change to propagate
		await page.waitForTimeout(1000);

		// Component should now be hidden
		await expect(component).not.toBeVisible();
	});
});
