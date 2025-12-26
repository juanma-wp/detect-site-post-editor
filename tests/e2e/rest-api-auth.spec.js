/**
 * E2E Test: REST API Authentication Verification
 *
 * This test verifies that REST API authentication is working correctly in CI.
 * It checks if wp.data.select('core').canUser() resolves properly.
 *
 * @package ConditionalRenderingExamples
 */

const { test, expect } = require('@wordpress/e2e-test-utils-playwright');

test.describe('REST API Authentication', () => {
	test('should have working REST API authentication', async ({ page, admin }) => {
		// Create a new page
		await admin.createNewPost({ postType: 'page' });

		// Wait for page to load
		await page.waitForLoadState('domcontentloaded');
		await page.waitForTimeout(5000); // Give time for scripts to load

		// Check if REST API authentication is working
		const authStatus = await page.evaluate(async () => {
			if (typeof wp === 'undefined' || !wp.data) {
				return {
					error: 'wp.data not available',
					hasWp: typeof wp !== 'undefined',
					hasData: typeof wp !== 'undefined' && !!wp.data,
				};
			}

			const coreStore = wp.data.select('core');
			if (!coreStore) {
				return {
					error: 'core store not available',
				};
			}

			// Get current user
			const currentUser = coreStore.getCurrentUser();

			// Try to check permissions
			const canCreatePage = coreStore.canUser('create', { kind: 'postType', name: 'page' });
			const canUpdatePage = coreStore.canUser('update', { kind: 'postType', name: 'page' });

			// Wait a bit and check again
			await new Promise(resolve => setTimeout(resolve, 5000));

			const canCreatePageAfterWait = coreStore.canUser('create', { kind: 'postType', name: 'page' });
			const canUpdatePageAfterWait = coreStore.canUser('update', { kind: 'postType', name: 'page' });

			return {
				currentUser: currentUser ? {
					id: currentUser.id,
					name: currentUser.name,
					capabilities: currentUser.capabilities,
				} : null,
				canCreatePage,
				canUpdatePage,
				canCreatePageAfterWait,
				canUpdatePageAfterWait,
				wpApiSettings: typeof wpApiSettings !== 'undefined' ? {
					root: wpApiSettings.root,
					nonce: wpApiSettings.nonce ? '***' : undefined,
				} : 'not available',
			};
		});

		console.log('REST API Auth Status:', JSON.stringify(authStatus, null, 2));

		// Assertions
		expect(authStatus.error).toBeUndefined();
		expect(authStatus.currentUser).not.toBeNull();
		expect(authStatus.currentUser?.id).toBeTruthy();

		// The key assertion - canUser should eventually resolve to true or false, not undefined
		const permissionResolved = authStatus.canCreatePageAfterWait !== undefined;

		if (!permissionResolved) {
			console.error('❌ REST API permission check failed to resolve!');
			console.error('This indicates authentication is not working properly.');
			console.error('Full status:', JSON.stringify(authStatus, null, 2));
		}

		expect(permissionResolved, 'REST API permissions should resolve (not be undefined)').toBe(true);
		expect(authStatus.canCreatePageAfterWait, 'User should have permission to create pages').toBe(true);
	});
});
