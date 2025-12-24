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
	timeout: 60000, // Increase overall test timeout to 60 seconds
	use: {
		...wpScriptsPlaywrightConfig.use,
		baseURL: process.env.WP_BASE_URL || 'http://localhost:8888',
		storageState: path.join(process.cwd(), 'artifacts/storage-state.json'),
		actionTimeout: 30000, // Increase action timeout to 30 seconds
	},
	expect: {
		timeout: 30000, // Increase expect timeout to 30 seconds
	},
	webServer: {
		command: 'npm run wp-env:start',
		port: 8888,
		timeout: 120000,
		reuseExistingServer: true,
	},
});
