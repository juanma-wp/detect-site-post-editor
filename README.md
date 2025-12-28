# WordPress Block Editor Conditional Rendering - Demo & Tests

[![E2E Tests](https://github.com/juanma-wp/detect-site-post-editor/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/juanma-wp/detect-site-post-editor/actions/workflows/e2e-tests.yml)
[![Integration Tests](https://github.com/juanma-wp/detect-site-post-editor/actions/workflows/integration-tests.yml/badge.svg)](https://github.com/juanma-wp/detect-site-post-editor/actions/workflows/integration-tests.yml)

This repository demonstrates conditional code execution patterns in the WordPress Block Editor, with complete E2E tests validating each approach. All examples are executable, testable, and based on real-world patterns from WordPress core.

## 📋 What This Demonstrates

This project provides working examples and tests for conditionally executing code in different WordPress Block Editor contexts:

### Client-Side Detection (React/JavaScript)
- ✅ **Specific Post Types** - Only run code for certain post types (pages, products, etc.)
  - Component: `SpecificPostTypeComponent.js` - Renders only for 'page' and 'product' post types
- ✅ **Exclude Post Types** - Prevent code from running on specific post types
  - Component: `ExcludePostTypesComponent.js` - Excludes 'attachment' and 'wp_block' post types
- ✅ **Viewable Post Types** - Only execute for public-facing content (excludes Site Editor)
  - Component: `ViewablePostTypeComponent.js` - Uses `postTypeObject.viewable` to exclude Site Editor contexts
- ✅ **Post Status** - Conditional execution based on draft/publish status
  - Component: `PostStatusComponent.js` - Only renders for draft posts (including auto-draft)
- ✅ **Page Templates** - Detect when specific page templates are active
  - Component: `PageTemplateComponent.js` - Only renders when 'full-width' template is selected on pages
- ✅ **User Capabilities** - Restrict features based on user permissions
  - Component: `UserCapabilityComponent.js` - Only renders for users who can publish posts
- ✅ **Exclude Design Post Types** - Skip Site Editor contexts (templates, navigation, etc.)
  - Component: `ExcludeDesignPostTypesComponent.js` - Excludes wp_template, wp_template_part, wp_block, and wp_navigation
- ✅ **Combined Conditions** - Multiple conditions working together
  - Component: `CombinedConditionsComponent.js` - Requires post type = 'page', status = 'draft', and user has edit permissions

### Server-Side Detection (PHP)
- ✅ **Block Editor Detection** - `cre_is_block_editor()` - Check if block editor is active
- ✅ **Post Type Filtering** - `cre_is_post_type()` - Server-side post type checks (single or array)
- ✅ **Post Type Exclusion** - `cre_is_not_post_type()` - Exclude specific post types
- ✅ **Site Editor Exclusion** - `cre_is_site_editor()` - Detect and exclude Site Editor before JS loads
- ✅ **Post Edit Screen** - `cre_is_post_edit_screen()` - Check if on post edit screen
- ✅ **Viewable Post Types** - `cre_is_viewable_post_type()` - Check if post type is publicly queryable
- ✅ **Design Post Types** - `cre_is_design_post_type()` - Check if post type is a Site Editor design type
- ✅ **User Capabilities** - Multiple functions for permission verification:
  - `cre_user_can_publish_posts()` - Check if user can publish posts
  - `cre_user_can_edit_posts()` - Check if user can edit posts
  - `cre_user_can_edit_pages()` - Check if user can edit pages
- ✅ **Post Status** - `cre_is_post_status()` - Check if post has specific status
- ✅ **Template Detection** - `cre_is_template()` - Check if post uses specific template
- ✅ **Combined Conditions** - `cre_check_conditions()` - Check multiple conditions with AND logic
- ✅ **Any Condition** - `cre_check_any_condition()` - Check if any condition passes with OR logic
- ✅ **Performance Optimization** - Prevent unnecessary script loading by checking conditions server-side

## 🎯 Why This Matters

When building WordPress Block Editor plugins, you often need to:
- Register SlotFills that only appear in the Post Editor or Site Editor
- Add editor commands available only in certain contexts
- Display custom UI based on post status or user capabilities
- Prevent functionality from running where it doesn't belong

This repo shows you how to do it correctly, with **zero mocks** and **real tests**.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PHP 7.4+ (for running tests locally)
- Composer (for PHP dependencies)
- Docker (for @wordpress/env)
- npm or yarn

### Installation

#### Quick Setup (Recommended)

```bash
git clone https://github.com/juanma-wp/detect-site-post-editor.git
cd detect-site-post-editor
npm run setup
```

This single command will:
- Install Node.js dependencies
- Install PHP dependencies (Composer)
- Build the plugin
- Start WordPress environment

#### Manual Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/juanma-wp/detect-site-post-editor.git
   cd detect-site-post-editor
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Install PHP dependencies:
   ```bash
   composer install
   ```

4. Build the plugin:
   ```bash
   npm run build
   ```

5. Start the WordPress environment:
   ```bash
   npm run wp-env:start
   ```

   This will start WordPress at http://localhost:8888
   - **Username:** admin
   - **Password:** password

6. Run the tests:
   ```bash
   # Run E2E tests
   npm run test:e2e

   # Run PHP unit tests
   npm run test:php

   # Run all tests
   npm test
   ```

## 📁 Project Structure

```
.
├── plugin/                          # WordPress plugin
│   ├── plugin.php                   # Main plugin file
│   ├── includes/
│   │   └── server-side-detection.php # Server-side detection functions
│   └── resources/js/
│       ├── index.js                 # Plugin entry point
│       ├── components/              # React components demonstrating patterns
│       │   ├── SpecificPostTypeComponent.js
│       │   ├── ExcludePostTypesComponent.js
│       │   ├── ViewablePostTypeComponent.js
│       │   ├── PostStatusComponent.js
│       │   ├── PageTemplateComponent.js
│       │   ├── UserCapabilityComponent.js
│       │   ├── ExcludeDesignPostTypesComponent.js
│       │   └── CombinedConditionsComponent.js
│       └── server-conditionals/      # Server-side conditional examples
│           ├── editor-only.js
│           ├── page-only.js
│           ├── publisher-only.js
│           ├── no-site-editor.js
│           └── post-edit-only.js
├── tests/
│   ├── e2e/                        # Playwright E2E tests
│   │   ├── utils.js                # Test utilities
│   │   ├── specific-post-type.spec.js
│   │   ├── exclude-post-types.spec.js
│   │   ├── viewable-post-type.spec.js
│   │   ├── post-status.spec.js
│   │   ├── page-template.spec.js
│   │   ├── user-capability.spec.js
│   │   ├── exclude-design-post-types.spec.js
│   │   └── combined-conditions.spec.js
│   └── php/                        # PHP unit tests
│       ├── bootstrap.php
│       └── ServerSideDetectionTest.php
├── .wp-env.json                    # WordPress environment config
├── playwright.config.js            # Playwright configuration
├── phpunit.xml.dist                # PHPUnit configuration
└── package.json                    # Dependencies and scripts
```

## 🧪 Testing Strategy

### Why E2E Tests?

This project uses **End-to-End (E2E) tests with Playwright** because:

- ✅ **No Mocks** - Tests run against a real WordPress instance
- ✅ **Real Behavior** - Validates actual editor store data and React rendering
- ✅ **WordPress Core Pattern** - Same approach used by WordPress/Gutenberg
- ✅ **Confidence** - Proves the patterns work in production-like environments

### Running Tests

```bash
# Run all tests
npm run test:e2e

# Run tests in headed mode (see the browser)
npm run test:e2e:headed

# Debug a specific test
npm run test:e2e:debug
```

### Test Coverage

Each test file validates specific conditional rendering patterns:

| Test File | What It Verifies |
|-----------|------------------|
| `specific-post-type.spec.js` | Components render only for allowed post types (page, product) |
| `exclude-post-types.spec.js` | Components exclude specific post types (attachment, wp_block) |
| `viewable-post-type.spec.js` | Components exclude Site Editor contexts |
| `post-status.spec.js` | Components respect draft/publish status |
| `page-template.spec.js` | Template-specific rendering works (full-width template) |
| `user-capability.spec.js` | Components render based on user permissions (publish_posts capability) |
| `exclude-design-post-types.spec.js` | Design post types are properly excluded (wp_template, wp_template_part, wp_block, wp_navigation) |
| `combined-conditions.spec.js` | Multiple conditions work together (page + draft + can edit) |

## 💻 Development

### Start Development Mode

```bash
# Start WordPress environment
npm run wp-env:start

# Start development build (watch mode)
npm run start

# Visit http://localhost:8888/wp-admin
# Login with admin/password
```

### View the Examples

1. Log into WordPress (http://localhost:8888/wp-admin)
2. Create a new Post or Page
3. Open the **Document Settings** sidebar (top right)
4. Look for the **"Conditional Rendering Examples"** panel
5. Components will appear/disappear based on the current context

### Stop the Environment

```bash
npm run wp-env:stop
```

### Destroy the Environment

```bash
npm run wp-env:destroy
```

## 📚 Code Examples

### Client-Side Examples (React/JavaScript)

#### Example 1: Detect Specific Post Types

```javascript
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';

const MyComponent = () => {
    const { postTypeName } = useSelect((select) => ({
        postTypeName: select(editorStore).getCurrentPostType(),
    }), []);

    const allowedPostTypes = ['page', 'product'];
    if (!allowedPostTypes.includes(postTypeName)) {
        return null;
    }

    return <div>Only visible for pages and products!</div>;
};
```

### Example 2: Exclude Site Editor

```javascript
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { store as coreStore } from '@wordpress/core-data';

const MyComponent = () => {
    const { isViewable } = useSelect((select) => {
        const postType = select(editorStore).getCurrentPostType();
        const postTypeObject = select(coreStore).getPostType(postType);
        return {
            isViewable: postTypeObject?.viewable,
        };
    }, []);

    if (!isViewable) {
        return null; // Excludes Site Editor
    }

    return <div>Only in Post Editor!</div>;
};
```

### Example 3: Combined Conditions

```javascript
const MyComponent = () => {
    const { postTypeName, postStatus, canEdit } = useSelect((select) => {
        const postType = select(editorStore).getCurrentPostType();
        return {
            postTypeName: postType,
            postStatus: select(editorStore).getCurrentPostAttribute('status'),
            canEdit: select(coreStore).canUser('update', postType),
        };
    }, []);

    // Only run for draft pages that the user can edit
    if (postTypeName !== 'page' || postStatus !== 'draft' || !canEdit) {
        return null;
    }

    return <div>Draft page editor only!</div>;
};
```

### Server-Side Examples (PHP)

#### Example 1: Conditionally Enqueue for Specific Post Type

```php
function my_plugin_enqueue_page_script() {
    // Only load for page post type
    if ( cre_is_post_type( 'page' ) ) {
        wp_enqueue_script(
            'my-page-script',
            plugins_url( 'page-script.js', __FILE__ ),
            array( 'wp-blocks', 'wp-element' ),
            '1.0.0'
        );
    }
}
add_action( 'admin_enqueue_scripts', 'my_plugin_enqueue_page_script' );
```

#### Example 2: Exclude Site Editor

```php
function my_plugin_enqueue_post_editor_only() {
    // Load everywhere except Site Editor
    if ( cre_is_block_editor() && ! cre_is_site_editor() ) {
        wp_enqueue_script(
            'my-post-editor-script',
            plugins_url( 'post-editor.js', __FILE__ ),
            array( 'wp-blocks' ),
            '1.0.0'
        );
    }
}
add_action( 'enqueue_block_editor_assets', 'my_plugin_enqueue_post_editor_only' );
```

#### Example 3: Check User Capabilities

```php
function my_plugin_enqueue_for_publishers() {
    // Only load for users who can publish posts
    if ( cre_user_can_publish_posts() && cre_is_block_editor() ) {
        wp_enqueue_script(
            'my-publisher-features',
            plugins_url( 'publisher.js', __FILE__ ),
            array( 'wp-editor' ),
            '1.0.0'
        );
    }
}
add_action( 'admin_enqueue_scripts', 'my_plugin_enqueue_for_publishers' );
```

#### Example 4: Combined Conditions with AND Logic

```php
function my_plugin_enqueue_draft_pages() {
    // Only load for draft pages
    $conditions = array(
        fn() => cre_is_post_type( 'page' ),
        fn() => cre_is_post_status( array( 'draft', 'auto-draft' ) ),
        fn() => cre_user_can_edit_pages(),
    );

    if ( cre_check_conditions( $conditions ) ) {
        wp_enqueue_script(
            'my-draft-page-script',
            plugins_url( 'draft-page.js', __FILE__ ),
            array( 'wp-editor' ),
            '1.0.0'
        );
    }
}
add_action( 'admin_enqueue_scripts', 'my_plugin_enqueue_draft_pages' );
```

#### Example 5: Exclude Design Post Types

```php
function my_plugin_enqueue_content_only() {
    // Don't load in Site Editor design contexts
    if ( ! cre_is_design_post_type() ) {
        wp_enqueue_script(
            'my-content-script',
            plugins_url( 'content-only.js', __FILE__ ),
            array( 'wp-blocks' ),
            '1.0.0'
        );
    }
}
add_action( 'enqueue_block_editor_assets', 'my_plugin_enqueue_content_only' );
```

## 🤝 Contributing

Found a bug or want to add more examples? Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Add tests for new patterns
4. Submit a pull request

## 📄 License

MIT

## 🙏 Credits

All patterns are based on real-world usage in [WordPress/Gutenberg](https://github.com/WordPress/gutenberg) core.

---

**Questions?** Open an issue or reach out on Twitter.
