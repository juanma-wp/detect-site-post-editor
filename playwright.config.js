const { defineConfig } = require('@playwright/test');
const wpScriptsPlaywrightConfig = require('@wordpress/scripts/config/playwright.config.js');

/**
 * WordPress E2E Tests Configuration
 * Extends @wordpress/scripts config for proper fixture and authentication handling
 *
 * Note: @wordpress/scripts sets up WP_ARTIFACTS_PATH and STORAGE_STATE_PATH
 * pointing to artifacts/storage-states/admin.json - we use those values
 *
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
	...wpScriptsPlaywrightConfig,
	testDir: './tests/e2e',
	use: {
		...wpScriptsPlaywrightConfig.use,
		baseURL: process.env.WP_BASE_URL || 'http://localhost:8888',
		// Use the storage state created by @wordpress/scripts global-setup
		// This is critical for authenticated tests (canUser API, REST API calls)
		storageState: process.env.STORAGE_STATE_PATH,
	},
	webServer: {
		command: 'npm run wp-env:start',
		port: 8888,
		timeout: 120000,
		reuseExistingServer: true,
	},
});
