/**
 * E2E Test Fixtures and Utilities
 *
 * Provides common setup and helper functions for E2E tests.
 *
 * @package ConditionalRenderingExamples
 */

const { test, expect } = require('@wordpress/e2e-test-utils-playwright');

/**
 * Wait for the WordPress Block Editor to be fully loaded and ready
 * Handles the "Choose a pattern" modal that appears for new pages
 *
 * @param {Editor} editor - Editor utility object
 * @param {Page} page - Playwright page object
 */
async function waitForEditorReady(editor, page) {
	// Close the "Choose a pattern" modal if it appears (WordPress shows this for new pages)
	// Wait for modal to potentially appear, then close it with Escape
	const modal = page.locator('.components-modal__frame');
	try {
		// Wait up to 3 seconds for the modal to appear
		await modal.waitFor({ state: 'visible', timeout: 3000 });
		// Modal appeared - close it with Escape
		await page.keyboard.press('Escape');
		// Wait for modal to close
		await modal.waitFor({ state: 'hidden', timeout: 5000 });
	} catch {
		// Modal didn't appear within timeout - that's fine, continue
	}

	// Wait for the editor canvas to be visible (editor.canvas handles iframe automatically)
	await editor.canvas.locator('body').waitFor({ state: 'visible' });

	// Wait for the actual editor layout to be ready (critical for plugin registration)
	await editor.canvas.locator('.block-editor-block-list__layout').waitFor({ state: 'visible' });

	// Wait for plugins and scripts to initialize
	await page.waitForTimeout(2000);

	// Additional stabilization wait for plugin registration (critical for CI environments)
	await page.waitForTimeout(300);
}

/**
 * Check if a console message contains a specific text
 *
 * @param {Array} messages - Array of console messages
 * @param {string} text - Text to search for
 * @return {boolean} True if message found
 */
function hasConsoleMessage(messages, text) {
	return messages.some(msg => msg.includes(text));
}

/**
 * Collect console messages during page operations
 *
 * @param {Page} page - Playwright page object
 * @return {Array} Array to collect messages
 */
function setupConsoleCapture(page) {
	const messages = [];
	page.on('console', msg => {
		messages.push(msg.text());
	});
	return messages;
}

module.exports = {
	test,
	expect,
	waitForEditorReady,
	hasConsoleMessage,
	setupConsoleCapture,
};
