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
 *
 * @param {Editor} editor - Editor utility object
 * @param {Page} page - Playwright page object
 */
async function waitForEditorReady(editor, page) {
	// Close the pattern selector modal if it appears (WordPress shows this for new pages)
	const closeButton = page.locator('button[aria-label="Close"]').first();
	if (await closeButton.isVisible().catch(() => false)) {
		await closeButton.click();
		await page.waitForTimeout(500);
	}

	// Wait for the editor canvas to be visible
	await editor.canvas.locator('body').waitFor({ state: 'visible', timeout: 30000 });

	// Wait for WordPress stores to be fully initialized
	// This includes editor store, core data store, and permissions
	await page.waitForTimeout(3000);
	
	// Wait for the plugin panel to be registered and rendered
	// This ensures our custom components have had time to mount
	await page.evaluate(() => {
		return new Promise((resolve) => {
			// Check if wp.data is available
			if (window.wp && window.wp.data) {
				// Wait for stores to be ready with a small delay
				setTimeout(resolve, 500);
			} else {
				resolve();
			}
		});
	});
	
	// Additional wait to ensure async store subscriptions have settled
	await page.waitForTimeout(2000);
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
