# WordPress Block Editor Conditional Rendering - Demo & Tests

This repository demonstrates conditional code execution patterns in the WordPress Block Editor, with complete E2E tests validating each approach. All examples are executable, testable, and based on real-world patterns from WordPress core.

## 📋 What This Demonstrates

This project provides working examples and tests for conditionally executing code in different WordPress Block Editor contexts:

### Client-Side Detection (React/JavaScript)
- ✅ **Specific Post Types** - Only run code for certain post types (pages, products, etc.)
- ✅ **Exclude Post Types** - Prevent code from running on specific post types
- ✅ **Viewable Post Types** - Only execute for public-facing content (excludes Site Editor)
- ✅ **Post Status** - Conditional execution based on draft/publish status
- ✅ **Page Templates** - Detect when specific page templates are active
- ✅ **User Capabilities** - Restrict features based on user permissions
- ✅ **Exclude Design Post Types** - Skip Site Editor contexts (templates, navigation, etc.)
- ✅ **Combined Conditions** - Multiple conditions working together

### Server-Side Detection (PHP)
- ✅ **Block Editor Detection** - Check if block editor is active
- ✅ **Post Type Filtering** - Server-side post type checks
- ✅ **Site Editor Exclusion** - Detect and exclude Site Editor before JS loads
- ✅ **Capability Checks** - User permission verification
- ✅ **Performance Optimization** - Prevent unnecessary script loading

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

\`\`\`bash
git clone https://github.com/yourusername/wp-block-editor-conditional-rendering.git
cd wp-block-editor-conditional-rendering
npm run setup
\`\`\`

This single command will:
- Install Node.js dependencies
- Install PHP dependencies (Composer)
- Build the plugin
- Start WordPress environment

#### Manual Setup

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/wp-block-editor-conditional-rendering.git
   cd wp-block-editor-conditional-rendering
   \`\`\`

2. Install Node.js dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Install PHP dependencies:
   \`\`\`bash
   composer install
   \`\`\`

4. Build the plugin:
   \`\`\`bash
   npm run build
   \`\`\`

5. Start the WordPress environment:
   \`\`\`bash
   npm run wp-env:start
   \`\`\`

   This will start WordPress at http://localhost:8888
   - **Username:** admin
   - **Password:** password

6. Run the tests:
   \`\`\`bash
   # Run E2E tests
   npm run test:e2e

   # Run PHP unit tests
   npm run test:php

   # Run all tests
   npm test
   \`\`\`

## 📁 Project Structure

\`\`\`
.
├── plugin/                          # WordPress plugin
│   ├── plugin.php                   # Main plugin file
│   ├── includes/
│   │   └── server-side-detection.php # Server-side detection functions
│   └── src/
│       ├── index.js                 # Plugin entry point
│       └── components/              # React components demonstrating patterns
│           ├── SpecificPostTypeComponent.js
│           ├── ExcludePostTypesComponent.js
│           ├── ViewablePostTypeComponent.js
│           ├── PostStatusComponent.js
│           ├── PageTemplateComponent.js
│           ├── UserCapabilityComponent.js
│           ├── ExcludeDesignPostTypesComponent.js
│           └── CombinedConditionsComponent.js
├── tests/
│   ├── e2e/                        # Playwright E2E tests
│   │   ├── fixtures.js             # Test utilities
│   │   ├── specific-post-type.spec.js
│   │   ├── viewable-post-type.spec.js
│   │   ├── post-status.spec.js
│   │   ├── page-template.spec.js
│   │   ├── exclude-design-post-types.spec.js
│   │   ├── combined-conditions.spec.js
│   │   └── server-side-detection.spec.js
│   └── php/                        # PHP unit tests
│       ├── bootstrap.php
│       └── ServerSideDetectionTest.php
├── .wp-env.json                    # WordPress environment config
├── playwright.config.js            # Playwright configuration
├── phpunit.xml.dist                # PHPUnit configuration
└── package.json                    # Dependencies and scripts
\`\`\`

## 🧪 Testing Strategy

### Why E2E Tests?

This project uses **End-to-End (E2E) tests with Playwright** because:

- ✅ **No Mocks** - Tests run against a real WordPress instance
- ✅ **Real Behavior** - Validates actual editor store data and React rendering
- ✅ **WordPress Core Pattern** - Same approach used by WordPress/Gutenberg
- ✅ **Confidence** - Proves the patterns work in production-like environments

### Running Tests

\`\`\`bash
# Run all tests
npm run test:e2e

# Run tests in headed mode (see the browser)
npm run test:e2e:headed

# Debug a specific test
npm run test:e2e:debug
\`\`\`

### Test Coverage

Each test file validates specific conditional rendering patterns:

| Test File | What It Verifies |
|-----------|------------------|
| \`specific-post-type.spec.js\` | Components render only for allowed post types |
| \`viewable-post-type.spec.js\` | Components exclude Site Editor contexts |
| \`post-status.spec.js\` | Components respect draft/publish status |
| \`page-template.spec.js\` | Template-specific rendering works |
| \`exclude-design-post-types.spec.js\` | Design post types are properly excluded |
| \`combined-conditions.spec.js\` | Multiple conditions work together |

## 💻 Development

### Start Development Mode

\`\`\`bash
# Start WordPress environment
npm run wp-env:start

# Start development build (watch mode)
npm run start

# Visit http://localhost:8888/wp-admin
# Login with admin/password
\`\`\`

### View the Examples

1. Log into WordPress (http://localhost:8888/wp-admin)
2. Create a new Post or Page
3. Open the **Document Settings** sidebar (top right)
4. Look for the **"Conditional Rendering Examples"** panel
5. Components will appear/disappear based on the current context

### Stop the Environment

\`\`\`bash
npm run wp-env:stop
\`\`\`

### Destroy the Environment

\`\`\`bash
npm run wp-env:destroy
\`\`\`

## 📚 Code Examples

### Client-Side Examples (React/JavaScript)

#### Example 1: Detect Specific Post Types

\`\`\`javascript
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
\`\`\`

### Example 2: Exclude Site Editor

\`\`\`javascript
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
\`\`\`

### Example 3: Combined Conditions

\`\`\`javascript
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
\`\`\`

### Server-Side Examples (PHP)

#### Example 1: Conditionally Enqueue for Specific Post Type

\`\`\`php
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
\`\`\`

#### Example 2: Exclude Site Editor

\`\`\`php
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
\`\`\`

#### Example 3: Check User Capabilities

\`\`\`php
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
\`\`\`

**📖 Full Server-Side Guide:** See [SERVER_SIDE_GUIDE.md](./SERVER_SIDE_GUIDE.md) for complete documentation with 14+ detection functions.

## 🔍 Related Documentation

- **[Main Article](./conditional-rendering-block-editor.md)** - "Conditionally Executing Code in Different WordPress Block Editor Contexts"
- **[Server-Side Guide](./SERVER_SIDE_GUIDE.md)** - Complete PHP detection functions guide
- **[Quick Reference](./QUICK_REFERENCE.md)** - Cheat sheet for common patterns
- **[Architecture](./ARCHITECTURE.md)** - System design and data flow
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[Project Summary](./PROJECT_SUMMARY.md)** - Complete overview

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
