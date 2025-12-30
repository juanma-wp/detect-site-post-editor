/**
 * E2E Tests: SiteEditorContextComponent
 *
 * Tests the React component that checks for Site Editor context.
 * Should only render in Post Editor (viewable post types), not Site Editor.
 *
 * @package ConditionalRenderingExamples
 */

const { test, expect } = require('@wordpress/e2e-test-utils-playwright');
const { waitForEditorReady } = require('./utils');

test.describe('SiteEditorContextComponent - Site Editor Context Detection', () => {
	test('should render component in Post Editor for posts', async ({ page, admin, editor }) => {
		// Create a new post
		await admin.createNewPost({ postType: 'post' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Check if panel needs to be expanded
		const panelButton = page.locator('button:has-text("Conditional Rendering Examples")');
		await panelButton.waitFor({ state: 'visible' });

		// Component should be visible for posts (viewable type)
		const component = page.locator('[data-testid="site-editor-context"]');
		const isVisible = await component.isVisible().catch(() => false);

		if (!isVisible) {
			// Panel is collapsed, need to open it
			await panelButton.click();
			await page.waitForTimeout(500);
		}

		await expect(component).toBeVisible();

		// Verify the content
		await expect(component.locator('h3')).toContainText('Post Editor Context');
		await expect(component).toContainText('Current post type: post');
		await expect(component).toContainText('Is viewable: Yes');
	});

	test('should render component in Post Editor for pages', async ({ page, admin, editor }) => {
		// Create a new page
		await admin.createNewPost({ postType: 'page' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Check if panel needs to be expanded
		const panelButton = page.locator('button:has-text("Conditional Rendering Examples")');
		await panelButton.waitFor({ state: 'visible' });

		// Component should be visible for pages (viewable type)
		const component = page.locator('[data-testid="site-editor-context"]');
		const isVisible = await component.isVisible().catch(() => false);

		if (!isVisible) {
			// Panel is collapsed, need to open it
			await panelButton.click();
			await page.waitForTimeout(500);
		}

		await expect(component).toBeVisible();

		// Verify the content
		await expect(component).toContainText('Current post type: page');
		await expect(component).toContainText('Is viewable: Yes');
	});

	test('should render component for custom viewable post type', async ({ page, admin, editor }) => {
		// Create a product (custom viewable post type)
		await admin.createNewPost({ postType: 'product' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Check if panel needs to be expanded
		const panelButton = page.locator('button:has-text("Conditional Rendering Examples")');
		await panelButton.waitFor({ state: 'visible' });

		// Component should be visible for products (viewable type)
		const component = page.locator('[data-testid="site-editor-context"]');
		const isVisible = await component.isVisible().catch(() => false);

		if (!isVisible) {
			// Panel is collapsed, need to open it
			await panelButton.click();
			await page.waitForTimeout(500);
		}

		await expect(component).toBeVisible();

		// Verify the content
		await expect(component).toContainText('Current post type: product');
	});

	test('should NOT render in Site Editor', async ({ page, admin }) => {
		// Navigate to Site Editor
		await admin.visitSiteEditor();

		// Wait for Site Editor to load
		await page.waitForTimeout(5000);

		// Component should NOT be visible in Site Editor (non-viewable post types)
		const component = page.locator('[data-testid="site-editor-context"]');
		await expect(component).not.toBeVisible();
	});

	test('should NOT render for wp_template_part in Site Editor', async ({ page, admin }) => {
		// Navigate to Site Editor with template parts
		await admin.visitSiteEditor({ path: '/patterns' });

		// Wait for Site Editor to load
		await page.waitForTimeout(3000);

		// Component should NOT be visible
		const component = page.locator('[data-testid="site-editor-context"]');
		await expect(component).not.toBeVisible();
	});
});
