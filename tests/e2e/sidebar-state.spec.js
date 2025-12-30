/**
 * E2E Tests: SidebarStateComponent
 *
 * Tests the React component that checks sidebar visibility state.
 * Should only render when the document settings sidebar is open.
 *
 * @package ConditionalRenderingExamples
 */

const { test, expect } = require('@wordpress/e2e-test-utils-playwright');
const { waitForEditorReady } = require('./utils');

test.describe('SidebarStateComponent - Sidebar State Detection', () => {
	test('should render component when sidebar is open', async ({ page, admin, editor }) => {
		// Create a new post
		await admin.createNewPost({ postType: 'post' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Check if panel needs to be expanded
		const panelButton = page.locator('button:has-text("Conditional Rendering Examples")');
		await panelButton.waitFor({ state: 'visible' });

		// Check if the component is already visible (panel is open)
		const component = page.locator('[data-testid="sidebar-state"]');
		const isVisible = await component.isVisible().catch(() => false);

		if (!isVisible) {
			// Panel is collapsed, need to open it
			await panelButton.click();
			// Wait for React state to update and panel to expand
			await page.waitForTimeout(500);
		}

		// Component should be visible when sidebar is open
		await expect(component).toBeVisible();

		// Verify the content
		await expect(component.locator('h3')).toContainText('Sidebar State');
		await expect(component).toContainText('Sidebar opened: Yes');
	});

	test('should render component on different post types', async ({ page, admin, editor }) => {
		// Create a product post
		await admin.createNewPost({ postType: 'product' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open sidebar
		await editor.openDocumentSettingsSidebar();

		// Check if panel needs to be expanded
		const panelButton = page.locator('button:has-text("Conditional Rendering Examples")');
		await panelButton.waitFor({ state: 'visible' });

		const component = page.locator('[data-testid="sidebar-state"]');
		const isVisible = await component.isVisible().catch(() => false);

		if (!isVisible) {
			// Panel is collapsed, need to open it
			await panelButton.click();
			await page.waitForTimeout(500);
		}

		// Should be visible when sidebar is open
		await expect(component).toBeVisible();
		await expect(component).toContainText('Sidebar opened: Yes');
	});

	test('should render on pages when sidebar is open', async ({ page, admin, editor }) => {
		// Create a new page
		await admin.createNewPost({ postType: 'page' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Check if panel needs to be expanded
		const panelButton = page.locator('button:has-text("Conditional Rendering Examples")');
		await panelButton.waitFor({ state: 'visible' });

		// Component should be visible on pages too
		const component = page.locator('[data-testid="sidebar-state"]');
		const isVisible = await component.isVisible().catch(() => false);

		if (!isVisible) {
			// Panel is collapsed, need to open it
			await panelButton.click();
			await page.waitForTimeout(500);
		}

		await expect(component).toBeVisible();
		await expect(component).toContainText('Sidebar opened: Yes');
	});

	test('should NOT render in Site Editor', async ({ page, admin }) => {
		// Navigate to Site Editor
		await admin.visitSiteEditor();

		// Wait for Site Editor to load
		await page.waitForTimeout(5000);

		// The component should NOT be visible in Site Editor
		// (because sidebars work differently in Site Editor)
		const component = page.locator('[data-testid="sidebar-state"]');

		// Component might not render at all, or might not be visible
		const exists = await component.count();
		if (exists > 0) {
			// If it exists, verify it's not showing as opened
			const isVisible = await component.isVisible();
			expect(isVisible).toBe(false);
		}
	});
});
