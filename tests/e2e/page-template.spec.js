/**
 * E2E Tests: PageTemplateComponent
 *
 * Tests the React component that only renders when 'full-width' template is selected.
 *
 * @package ConditionalRenderingExamples
 */

const { test, expect } = require('@wordpress/e2e-test-utils-playwright');
const { waitForEditorReady } = require('./utils');

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

	// Add tests for page with "full-width" template
	test('should render component on page with "full-width" template', async ({ page, admin, editor, requestUtils }) => {
		// Create a page with the full-width template already assigned
		const newPage = await requestUtils.createPage({
			title: 'Test Full Width Page',
			status: 'draft',
			template: 'full-width',
		});

		// Edit the page
		await admin.editPost(newPage.id);

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Check if the component is visible
		const component = page.locator('[data-testid="page-template"]');
		await expect(component).toBeVisible();

		// Verify the content
		await expect(component).toContainText('Current template: full-width');

		// Verify the text content
		await expect(component.locator('h3')).toContainText('Page Template');
		await expect(component).toContainText("This component only renders when the 'full-width' template is active.");
	});

});
