/**
 * E2E Test Fixtures and Utilities
 *
 * Provides common setup and helper functions for E2E tests.
 *
 * @package ConditionalRenderingExamples
 */

const { test, expect } = require('@wordpress/e2e-test-utils-playwright');

// Configuration constants for store readiness polling
const STORE_READY_MAX_ATTEMPTS = 50; // Maximum polling attempts
const STORE_READY_POLL_INTERVAL = 200; // Milliseconds between polls
const PLUGIN_MOUNT_DELAY = 1000; // Delay to ensure plugins have mounted

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
	await page.evaluate(({ maxAttempts, pollInterval }) => {
		return new Promise((resolve) => {
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
								setTimeout(checkStoresReady, pollInterval);
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
							setTimeout(checkStoresReady, pollInterval);
						} else {
							resolve();
						}
					} catch (error) {
						// If there's an error, keep trying
						if (attempts < maxAttempts) {
							setTimeout(checkStoresReady, pollInterval);
						} else {
							resolve();
						}
					}
				} else if (attempts < maxAttempts) {
					setTimeout(checkStoresReady, pollInterval);
				} else {
					resolve();
				}
			};
			
			checkStoresReady();
		});
	}, { maxAttempts: STORE_READY_MAX_ATTEMPTS, pollInterval: STORE_READY_POLL_INTERVAL });
	
	// Additional brief wait to ensure plugin components have mounted
	// This is necessary as plugins register after stores are ready
	await page.waitForTimeout(PLUGIN_MOUNT_DELAY);
}

/**
 * Wait for post status to change to expected value
 *
 * @param {Page} page - Playwright page object
 * @param {string} expectedStatus - Expected post status (e.g., 'publish', 'draft')
 * @param {number} timeout - Maximum time to wait in milliseconds (default: 10000)
 */
async function waitForPostStatus(page, expectedStatus, timeout = 10000) {
	const maxAttempts = timeout / STORE_READY_POLL_INTERVAL;
	
	await page.evaluate(({ status, maxAttempts, pollInterval }) => {
		return new Promise((resolve) => {
			let attempts = 0;
			
			const checkStatus = () => {
				attempts++;
				
				if (window.wp && window.wp.data) {
					const { select } = window.wp.data;
					
					try {
						const editorStore = select('core/editor');
						if (editorStore) {
							const currentStatus = editorStore.getCurrentPostAttribute('status');
							
							if (currentStatus === status) {
								resolve();
								return;
							}
						}
					} catch (error) {
						// Continue polling on error
					}
				}
				
				if (attempts < maxAttempts) {
					setTimeout(checkStatus, pollInterval);
				} else {
					resolve();
				}
			};
			
			checkStatus();
		});
	}, { status: expectedStatus, maxAttempts, pollInterval: STORE_READY_POLL_INTERVAL });
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
	waitForPostStatus,
	hasConsoleMessage,
	setupConsoleCapture,
};
