/**
 * E2E Test Utilities
 *
 * Provides common helper functions for E2E tests.
 *
 * @package ConditionalRenderingExamples
 */

/**
 * Dismiss the "Choose a pattern" modal if it appears
 * Uses semantic selectors following Gutenberg's pattern
 *
 * @param {Page} page - Playwright page object
 */
async function waitForEditorReady(editor, page) {
	try {
		await page
			.getByRole('dialog', { name: 'Choose a pattern' })
			.getByRole('button', { name: 'Close' })
			.click({ timeout: 2000 });
	} catch {
		// Modal didn't appear - continue
	}
}

module.exports = {
	waitForEditorReady,
};
