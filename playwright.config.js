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
	use: {
		...wpScriptsPlaywrightConfig.use,
		baseURL: process.env.WP_BASE_URL || 'http://localhost:8888',
		// Let WordPress handle authentication via its default config
		// Don't override storageState as it breaks WordPress's built-in auth
	},
	webServer: {
		command: 'npm run wp-env:start',
		port: 8888,
		timeout: 120000,
		reuseExistingServer: true,
	},
});
