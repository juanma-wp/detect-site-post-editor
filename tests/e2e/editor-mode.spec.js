/**
 * E2E Tests: EditorModeComponent
 *
 * Tests the React component that detects editor mode (visual vs code).
 *
 * @package ConditionalRenderingExamples
 */

const { test, expect } = require('@wordpress/e2e-test-utils-playwright');
const { waitForEditorReady } = require('./utils');

test.describe('EditorModeComponent - Editor Mode Detection', () => {
	test('should render component in visual editor mode', async ({ page, admin, editor }) => {
		// Create a new post
		await admin.createNewPost({ postType: 'post' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Component should be visible in visual mode (default)
		const component = page.locator('[data-testid="editor-mode"]');
		await expect(component).toBeVisible();

		// Verify the content
		await expect(component.locator('h3')).toContainText('Editor Mode (Visual)');
		await expect(component).toContainText('Current mode: visual');
	});

	test('should not render component in code editor mode', async ({ page, admin, editor }) => {
		// Create a new page
		await admin.createNewPost({ postType: 'page' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Switch to code editor mode
		await page.click('button[aria-label="Options"]');
		await page.click('button:has-text("Code editor")');

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Component should not be visible in code editor mode
		const component = page.locator('[data-testid="editor-mode"]');
		await expect(component).not.toBeVisible();
	});
});
