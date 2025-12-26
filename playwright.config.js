// Set WP_BASE_URL environment variable BEFORE loading wp-scripts config
// This ensures globalSetup creates storage state for the correct URL
process.env.WP_BASE_URL = process.env.WP_BASE_URL || 'http://localhost:8888';

const { defineConfig } = require('@playwright/test');
const wpScriptsPlaywrightConfig = require('@wordpress/scripts/config/playwright.config.js');

/**
 * WordPress E2E Tests Configuration
 * Extends @wordpress/scripts config for proper fixture and authentication handling
 *
 * IMPORTANT: We set WP_BASE_URL before loading wpScriptsPlaywrightConfig so that
 * the globalSetup creates storage state for the correct WordPress instance (port 8888).
 * Without this, auth cookies are created for the wrong domain and REST API fails.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
	...wpScriptsPlaywrightConfig,
	testDir: './tests/e2e',
	use: {
		...wpScriptsPlaywrightConfig.use,
		// baseURL already set via WP_BASE_URL environment variable above
	},
	webServer: {
		command: 'npm run wp-env:start',
		port: 8888,
		timeout: 120000,
		reuseExistingServer: true,
	},
});
