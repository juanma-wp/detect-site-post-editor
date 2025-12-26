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
	// This modal blocks interaction with the editor until dismissed
	const modal = page.locator('.components-modal__frame');
	try {
		// Wait up to 5 seconds for the modal to appear (CI can be slow)
		await modal.waitFor({ state: 'visible', timeout: 5000 });
		
		// Modal appeared - close it by clicking the X button (more reliable than Escape in CI)
		const closeButton = modal.locator('button[aria-label="Close"]');
		await closeButton.click({ timeout: 5000 });
		
		// Wait for modal to fully close
		await modal.waitFor({ state: 'hidden', timeout: 5000 });
		
		// Extra wait after modal closes for editor to stabilize
		await page.waitForTimeout(500);
	} catch {
		// Modal didn't appear within timeout - that's fine, continue
	}

	// Wait for the editor canvas to be visible (editor.canvas handles iframe automatically)
	await editor.canvas.locator('body').waitFor({ state: 'visible', timeout: 10000 });

	// Wait for the actual editor layout to be ready (critical for plugin registration)
	await editor.canvas.locator('.block-editor-block-list__layout').waitFor({ state: 'visible', timeout: 10000 });

	// Wait for plugins and scripts to initialize (longer for CI)
	await page.waitForTimeout(3000);
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
