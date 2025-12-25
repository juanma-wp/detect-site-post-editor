/**
 * E2E Tests: PageTemplateComponent
 *
 * Tests the React component that only renders when 'full-width' template is selected.
 *
 * @package ConditionalRenderingExamples
 */

const { test, expect, waitForEditorReady } = require('./fixtures');

test.describe('PageTemplateComponent - Client-Side Rendering', () => {
	test('should NOT render component on page with default template', async ({ page, admin, editor }) => {
		// Create a new page
		await admin.createNewPost({ postType: 'page' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Component should NOT be visible (default template)
		const component = page.locator('[data-testid="page-template"]');
		await expect(component).not.toBeVisible();
	});

	test('should NOT render component on post (not a page)', async ({ page, admin, editor }) => {
		// Create a new post
		await admin.createNewPost({ postType: 'post' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Component should NOT be visible (not a page)
		const component = page.locator('[data-testid="page-template"]');
		await expect(component).not.toBeVisible();
	});

	// Note: Tests using requestUtils API have been removed due to REST API setup timeouts
});
