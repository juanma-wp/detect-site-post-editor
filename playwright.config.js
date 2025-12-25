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
	timeout: 100000, // 100 seconds per test
	use: {
		...wpScriptsPlaywrightConfig.use,
		baseURL: process.env.WP_BASE_URL || 'http://localhost:8888',
		storageState: path.join(process.cwd(), 'artifacts/storage-state.json'),
		actionTimeout: 30000, // 30 seconds for actions like clicks, fills, etc.
	},
});
