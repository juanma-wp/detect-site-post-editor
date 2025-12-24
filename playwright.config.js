const path = require('path');
const { defineConfig } = require('@playwright/test');
const wpScriptsPlaywrightConfig = require('@wordpress/scripts/config/playwright.config.js');

/**
 * WordPress E2E Tests Configuration
 * Extends @wordpress/scripts config for proper fixture and authentication handling
 *
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
	...wpScriptsPlaywrightConfig,
	testDir: './tests/e2e',
	timeout: 120000, // Increase overall test timeout to 120 seconds for CI stability
	use: {
		...wpScriptsPlaywrightConfig.use,
		baseURL: process.env.WP_BASE_URL || 'http://localhost:8888',
		storageState: path.join(process.cwd(), 'artifacts/storage-state.json'),
		actionTimeout: 45000, // Increase action timeout to 45 seconds for slow CI environments
		navigationTimeout: 45000, // Add navigation timeout
	},
	expect: {
		timeout: 45000, // Increase expect timeout to 45 seconds
	},
	webServer: {
		command: 'npm run wp-env:start',
		port: 8888,
		timeout: 120000,
		reuseExistingServer: true,
	},
});
