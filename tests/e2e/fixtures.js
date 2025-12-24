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

	// Wait for WordPress stores to be fully initialized and data to be available
	await page.evaluate(() => {
		return new Promise((resolve) => {
			const maxAttempts = 50; // Max 10 seconds (50 * 200ms)
			let attempts = 0;
			
			const checkStoresReady = () => {
				attempts++;
				
				// Check if wp.data is available and stores are accessible
				if (window.wp && window.wp.data) {
					const { select } = window.wp.data;
					
					try {
						// Check if editor store has initialized with post data
						const editorStore = select('core/editor');
						if (!editorStore) {
							if (attempts < maxAttempts) {
								setTimeout(checkStoresReady, 200);
							} else {
								resolve();
							}
							return;
						}
						
						// Verify we can get basic post information
						const postType = editorStore.getCurrentPostType();
						const postStatus = editorStore.getCurrentPostAttribute('status');
						
						// If we have valid post data, stores are ready
						if (postType && postStatus) {
							resolve();
						} else if (attempts < maxAttempts) {
							setTimeout(checkStoresReady, 200);
						} else {
							resolve();
						}
					} catch (error) {
						// If there's an error, keep trying
						if (attempts < maxAttempts) {
							setTimeout(checkStoresReady, 200);
						} else {
							resolve();
						}
					}
				} else if (attempts < maxAttempts) {
					setTimeout(checkStoresReady, 200);
				} else {
					resolve();
				}
			};
			
			checkStoresReady();
		});
	});
	
	// Additional brief wait to ensure plugin components have mounted
	// This is necessary as plugins register after stores are ready
	await page.waitForTimeout(1000);
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
