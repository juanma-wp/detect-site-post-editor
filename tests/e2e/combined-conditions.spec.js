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
		await admin.createNewPost({ postType: 'page' });
		await waitForEditorReady(editor, page);
		await editor.openDocumentSettingsSidebar();

		const pluginPanel = page.locator('.conditional-rendering-examples');
		await pluginPanel.waitFor({ state: 'visible', timeout: 20000 });

		// Expand the panel if collapsed
		const panelButton = pluginPanel.locator('button').first();
		const isExpanded = await panelButton.getAttribute('aria-expanded');
		if (isExpanded === 'false') {
			await panelButton.click();
			await page.waitForTimeout(1000);
		}

		await page.waitForTimeout(2000);

		const component = page.locator('[data-testid="combined-conditions"]');
		await expect(component).toBeVisible();
		await expect(component.locator('h3')).toContainText('Combined Conditions');
		await expect(component).toContainText('Post type: page ✓');
		await expect(component).toContainText('Status: draft ✓');
		await expect(component).toContainText('Can edit: Yes ✓');
	});

	test('should NOT render component for draft post (wrong post type)', async ({ page, admin, editor }) => {
		await admin.createNewPost({ postType: 'post' });
		await waitForEditorReady(editor, page);
		await editor.openDocumentSettingsSidebar();

		const pluginPanel = page.locator('.conditional-rendering-examples');
		await pluginPanel.waitFor({ state: 'visible', timeout: 20000 });

		// Expand the panel if collapsed
		const panelButton = pluginPanel.locator('button').first();
		const isExpanded = await panelButton.getAttribute('aria-expanded');
		if (isExpanded === 'false') {
			await panelButton.click();
			await page.waitForTimeout(1000);
		}

		await page.waitForTimeout(1000);

		const component = page.locator('[data-testid="combined-conditions"]');
		await expect(component).not.toBeVisible();
	});

	test('should hide component after publishing page', async ({ page, admin, editor }) => {
		await admin.createNewPost({ postType: 'page' });
		await waitForEditorReady(editor, page);
		await editor.canvas.locator('role=textbox[name="Add title"i]').fill('Test Page for Publishing');
		await editor.openDocumentSettingsSidebar();

		const pluginPanel = page.locator('.conditional-rendering-examples');
		await pluginPanel.waitFor({ state: 'visible', timeout: 20000 });

		// Expand the panel if collapsed
		const panelButton = pluginPanel.locator('button').first();
		const isExpanded = await panelButton.getAttribute('aria-expanded');
		if (isExpanded === 'false') {
			await panelButton.click();
			await page.waitForTimeout(1000);
		}

		await page.waitForTimeout(2000);

		const component = page.locator('[data-testid="combined-conditions"]');
		await expect(component).toBeVisible();

		await editor.publishPost();

		await expect(component).not.toBeVisible();
	});
});
