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
	// Close the "Choose a pattern" modal if it appears
	const modal = page.locator('.components-modal__frame');
	try {
		await modal.waitFor({ state: 'visible', timeout: 5000 });
		await modal.locator('button[aria-label="Close"]').click();
		await modal.waitFor({ state: 'hidden' });
	} catch {
		// Modal didn't appear - continue
	}

	// Wait for editor layout to be ready
	await editor.canvas.locator('.block-editor-block-list__layout').waitFor({ state: 'visible', timeout: 10000 });
	await page.waitForTimeout(3000);

	// Wait for WordPress data stores to initialize
	await page.waitForFunction(() => {
		if (!window.wp?.data?.select) return false;
		try {
			const core = window.wp.data.select('core');
			const editor = window.wp.data.select('core/editor');
			return core?.canUser && editor?.getCurrentPostType;
		} catch {
			return false;
		}
	}, { timeout: 10000 });

	// Prefetch permissions to prevent timing issues in CI
	await page.evaluate(async () => {
		const { resolveSelect } = window.wp.data;
		await Promise.all([
			resolveSelect('core').canUser('create', { kind: 'postType', name: 'page' }),
			resolveSelect('core').canUser('update', { kind: 'postType', name: 'page' })
		]).catch(() => {});
	});

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
