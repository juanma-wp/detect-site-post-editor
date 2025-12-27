/**
 * E2E Tests: UserCapabilityComponent
 *
 * Tests the React component that only renders for users who can publish posts.
 *
 * @package ConditionalRenderingExamples
 */

const { test, expect } = require('@wordpress/e2e-test-utils-playwright');
const { waitForEditorReady } = require('./utils');

test.describe('UserCapabilityComponent - Client-Side Rendering', () => {
	test('should render component for users with publish capability', async ({ page, admin, editor }) => {
		// Create a new post (admin user by default has publish capability)
		await admin.createNewPost();

		// Wait for editor to be ready
		await waitForEditorReady(editor, page);

		// Open settings sidebar
		await editor.openDocumentSettingsSidebar();

		// Check if the user capability component is visible
		const component = page.locator('[data-testid="user-capability"]');
		await expect(component).toBeVisible();

		// Verify the content
		await expect(component.locator('h3')).toContainText('User Capability');
		await expect(component).toContainText('This component only renders for users who can publish posts');
		await expect(component).toContainText('Can publish: Yes');
	});

	test.describe('Without publish capability', () => {
		test.beforeAll(async ({ requestUtils }) => {
			// Create a contributor user (can create posts but cannot publish posts)
			await requestUtils.createUser({
				username: 'testcontributor',
				email: 'testcontributor@example.com',
				firstName: 'Test',
				lastName: 'Contributor',
				roles: ['contributor'],
				password: 'testpassword123',
			});
		});

		test('should NOT render component for users without publish capability', async ({ page }) => {
			// Login as contributor
			await page.goto('/wp-login.php');
			await page.fill('#user_login', 'testcontributor');
			await page.fill('#user_pass', 'testpassword123');
			await page.click('#wp-submit');
			await page.waitForLoadState('networkidle');

			// Navigate to create new post
			await page.goto('/wp-admin/post-new.php');

			// Wait for editor to load
			await page.waitForSelector('.edit-post-layout, .editor-layout', { timeout: 30000 });

			// Open settings sidebar
			const settingsButton = page.locator('button[aria-label="Settings"]').first();
			const isPressed = await settingsButton.getAttribute('aria-pressed');
			if (isPressed !== 'true') {
				await settingsButton.click();
				await page.waitForTimeout(500);
			}

			// Verify the user capability component is NOT visible
			const component = page.locator('[data-testid="user-capability"]');
			await expect(component).not.toBeVisible();
		});

		test.afterAll(async ({ requestUtils }) => {
			// Cleanup: Delete all test users
			await requestUtils.deleteAllUsers();
		});
	});
});
