/**
 * E2E Tests: SpecificPostTypeComponent
 *
 * Tests the React component that only renders for specific post types (page, product).
 *
 * @package ConditionalRenderingExamples
 */

const { test, expect } = require("@wordpress/e2e-test-utils-playwright");
const { waitForEditorReady } = require("./utils");

test.describe("SpecificPostTypeComponent - Client-Side Rendering", () => {
  test("should render component for page post type", async ({
    page,
    admin,
    editor,
  }) => {
    // Create a new page - Opens the editor for a new post of the specified post type
    await admin.createNewPost({ postType: "page" });

    // Wait for editor to be ready
    await waitForEditorReady(editor, page);

    // Open settings sidebar
    await editor.openDocumentSettingsSidebar();

    // Check if panel needs to be expanded
    const panelButton = page.locator('button:has-text("Conditional Rendering Examples")');
    await panelButton.waitFor({ state: 'visible' });

    // Check if the specific post type component is visible
    const component = page.locator('[data-testid="specific-post-type"]');
    const isVisible = await component.isVisible().catch(() => false);

    if (!isVisible) {
      await panelButton.click();
      await page.waitForTimeout(500);
    }

    await expect(component).toBeVisible();

    // Verify the text content
    await expect(component.locator("h3")).toContainText("Specific Post Type");
    await expect(component).toContainText("Current post type: page");
  });

  test("should render component for product post type", async ({
    page,
    admin,
    editor,
  }) => {
    // Create a new product (custom post type)
    await admin.createNewPost({ postType: "product" });

    // Wait for editor to be ready
    await waitForEditorReady(editor, page);

    // Open settings sidebar
    await editor.openDocumentSettingsSidebar();

    // Check if panel needs to be expanded
    const panelButton = page.locator('button:has-text("Conditional Rendering Examples")');
    await panelButton.waitFor({ state: 'visible' });

    // Check if the component is visible
    const component = page.locator('[data-testid="specific-post-type"]');
    const isVisible = await component.isVisible().catch(() => false);

    if (!isVisible) {
      await panelButton.click();
      await page.waitForTimeout(500);
    }

    await expect(component).toBeVisible();

    // Verify the text content
    await expect(component).toContainText("Current post type: product");
  });

  test("should NOT render component for post post type", async ({
    page,
    admin,
    editor,
  }) => {
    // Create a new post
    await admin.createNewPost({ postType: "post" });

    // Wait for editor to be ready
    await waitForEditorReady(editor, page);

    // Open settings sidebar
    await editor.openDocumentSettingsSidebar();

    // Check if panel needs to be expanded
    const panelButton = page.locator('button:has-text("Conditional Rendering Examples")');
    await panelButton.waitFor({ state: 'visible' });

    // The specific post type component should NOT be visible
    const component = page.locator('[data-testid="specific-post-type"]');

    // Open panel to check if component is not rendered
    const isVisible = await component.isVisible().catch(() => false);
    if (!isVisible) {
      await panelButton.click();
      await page.waitForTimeout(500);
    }

    await expect(component).not.toBeVisible();
  });

});
