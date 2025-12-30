/**
 * E2E Tests: SelectedBlockTypeComponent
 *
 * Tests the React component that detects the currently selected block type.
 * Should only render when a paragraph block is selected.
 *
 * @package ConditionalRenderingExamples
 */

const { test, expect } = require('@wordpress/e2e-test-utils-playwright');
const { waitForEditorReady } = require('./utils');

test.describe('SelectedBlockTypeComponent - Selected Block Type Detection', () => {
	test('should render component when paragraph block is selected', async ({ page, admin, editor }) => {
		// Create a new post
		await admin.createNewPost({ postType: 'post' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Insert a paragraph block
		await editor.insertBlock({ name: 'core/paragraph' });
		await page.keyboard.type('This is a paragraph');

		// Explicitly click the paragraph block to ensure selection
		await editor.canvas.locator('[data-type="core/paragraph"]').click();

		// Wait for block selection to be registered in the store
		await page.waitForFunction(() => {
			return wp.data.select('core/block-editor').getSelectedBlock()?.name === 'core/paragraph';
		});

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Switch to Post tab (plugin panels are in document settings)
		const postTab = page.locator('button[role="tab"]:has-text("Post")');
		await postTab.click();

		// Wait for panel to be present (it should be open by default with initialOpen={true})
		await page.waitForSelector('button:has-text("Conditional Rendering Examples")', { state: 'visible' });

		// Component should be visible when paragraph is selected
		const component = page.locator('[data-testid="selected-block-type"]');
		await expect(component).toBeVisible({ timeout: 10000 });
	});

	test('should NOT render when heading block is selected', async ({ page, admin, editor }) => {
		// Create a new post
		await admin.createNewPost({ postType: 'post' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Insert a heading block
		await editor.insertBlock({ name: 'core/heading' });
		await page.keyboard.type('This is a heading');

		// Explicitly click the heading block to ensure selection
		await editor.canvas.locator('h2:has-text("This is a heading")').click();

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Switch to Post tab (plugin panels are in document settings)
		const postTab = page.locator('button[role="tab"]:has-text("Post")');
		await postTab.click();

		// Expand the panel - it's collapsed by default
		const panelButton = page.locator('button:has-text("Conditional Rendering Examples")');
		await panelButton.scrollIntoViewIfNeeded();
		await panelButton.click();

		// Wait for React state to update and panel to expand
		await page.waitForTimeout(500);

		// Component should NOT be visible when heading is selected
		const component = page.locator('[data-testid="selected-block-type"]');
		await expect(component).not.toBeVisible();
	});

	test('should NOT render when no block is selected', async ({ page, admin, editor }) => {
		// Create a new post
		await admin.createNewPost({ postType: 'post' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Click on the post title to deselect any block
		await editor.canvas.locator('role=textbox[name="Add title"i]').click();

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Switch to Post tab (plugin panels are in document settings)
		const postTab = page.locator('button[role="tab"]:has-text("Post")');
		await postTab.click();

		// Expand the panel - it's collapsed by default
		const panelButton = page.locator('button:has-text("Conditional Rendering Examples")');
		await panelButton.scrollIntoViewIfNeeded();
		await panelButton.click();

		// Wait for React state to update and panel to expand
		await page.waitForTimeout(500);

		// Component should NOT be visible when no block is selected
		const component = page.locator('[data-testid="selected-block-type"]');
		await expect(component).not.toBeVisible();
	});

	test('should toggle visibility when switching between blocks', async ({ page, admin, editor }) => {
		// Create a new post
		await admin.createNewPost({ postType: 'post' });

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Insert a paragraph block
		await editor.insertBlock({ name: 'core/paragraph' });
		await page.keyboard.type('This is a paragraph');

		// Open settings sidebar first
		await editor.openDocumentSettingsSidebar();

		// Explicitly click the paragraph block to ensure selection AFTER sidebar is open
		await editor.canvas.locator('[data-type="core/paragraph"]').click();

		// Wait for block selection to be registered in the store
		await page.waitForFunction(() => {
			return wp.data.select('core/block-editor').getSelectedBlock()?.name === 'core/paragraph';
		});

		// Switch to Post tab (plugin panels are in document settings)
		const postTab = page.locator('button[role="tab"]:has-text("Post")');
		await postTab.click();

		// Check if panel needs to be expanded
		const panelButton = page.locator('button:has-text("Conditional Rendering Examples")');
		await panelButton.scrollIntoViewIfNeeded();

		// Check if the component is already visible (panel is open)
		const component = page.locator('[data-testid="selected-block-type"]');
		const isVisible = await component.isVisible().catch(() => false);

		if (!isVisible) {
			// Panel is collapsed, need to open it
			await panelButton.click();
			// Wait for React state to update and panel to expand
			await page.waitForTimeout(500);
		}

		// Component should be visible when paragraph is selected
		await expect(component).toBeVisible({ timeout: 10000 });

		// Now insert a heading block
		await editor.insertBlock({ name: 'core/heading' });
		await page.keyboard.type('This is a heading');

		// Explicitly click the heading block to ensure selection
		await editor.canvas.locator('h2:has-text("This is a heading")').click();

		// Component should NOT be visible when heading is selected
		await expect(component).not.toBeVisible();

		// Close any open popovers/dialogs (like link editor)
		await page.keyboard.press('Escape');
		await page.waitForTimeout(300);

		// Switch back to paragraph block
		await editor.canvas.locator('[data-type="core/paragraph"]').click();

		// Wait for block selection to be registered in the store
		await page.waitForFunction(() => {
			return wp.data.select('core/block-editor').getSelectedBlock()?.name === 'core/paragraph';
		});

		// Component should be visible again when paragraph is selected
		await expect(component).toBeVisible();
	});
});
