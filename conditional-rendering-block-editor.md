# Conditionally Executing Code in Different WordPress Block Editor Contexts

When developing for the WordPress Block Editor, you often need to control when and where your JavaScript code executes. For example, you might want to:

- Register SlotFills that only appear on the Post Editor or on the Site Editor.
- Add editor commands that are only available in certain contexts.
- Display custom UI elements based on post status or user capabilities.
- Prevent functionality from running in the Site Editor vs Post Editor.

Rather than running code everywhere, you can conditionally execute functionality based on the editing context—such as post type, post status, editor mode, or other conditions.

## Client-Side Context Detection

The fundamental approach on the Client-side uses WordPress's [`@wordpress/data`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/) package to access editor information and determine whether to execute your code.

Example ([ViewablePostTypeComponent.js](https://github.com/juanma-wp/detect-site-post-editor/blob/main/plugin/resources/js/components/ViewablePostTypeComponent.js)):

```javascript
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { store as coreStore } from '@wordpress/core-data';

const ViewablePostTypeComponent = () => {
    const { isViewable, postTypeName } = useSelect( ( select ) => {
        const postType = select( editorStore ).getCurrentPostType();
        const postTypeObject = select( coreStore ).getPostType( postType );
        return {
            isViewable: postTypeObject?.viewable,
            postTypeName: postType,
        };
    }, [] );

    // Return null to prevent execution
    if ( ! isViewable ) {
        return null;
    }

    // Your code only executes when conditions are met
    return (
        <div className="example-section" data-testid="viewable-post-type">
            <h3>✓ Viewable Post Type</h3>
            <p>This component only renders for viewable post types (excludes Site Editor).</p>
            <p><strong>Current post type:</strong> {postTypeName}</p>
            <p><strong>Is viewable:</strong> {isViewable ? 'Yes' : 'No'}</p>
        </div>
    );
};
```

The [`useSelect`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/#useselect) hook retrieves data from WordPress stores, and we can get info such as the current post type, post type details (like whether it is viewable), post status, and other relevant editor state.

A key property for distinguishing contexts is `isViewable`, which tells you whether a **post type** can be viewed on the frontend—not which editor you're currently using.

Post types with `isViewable: true` (posts, pages) have a public-facing URL and are edited in the Post Editor, while those with `isViewable: false` (templates, template parts) are edited in the Site Editor

Anyway, this is **indirect detection** — we're inferring the editor context based on the post type's characteristics, not detecting the editor itself. The property describes the post type's nature, and the editor context is a side effect of that.

### Detecting Specific Post Types

Restrict code execution to specific post types using an allow list. Use the [`getCurrentPostType()`](https://developer.wordpress.org/block-editor/reference-guides/data/data-core-editor/#getcurrentposttype) selector from the editor store.

**Example from this project** ([SpecificPostTypeComponent.js](https://github.com/juanma-wp/detect-site-post-editor/blob/main/plugin/resources/js/components/SpecificPostTypeComponent.js)):

```javascript
const SpecificPostTypeComponent = () => {
    const { postTypeName } = useSelect( ( select ) => {
        return {
            postTypeName: select( editorStore ).getCurrentPostType(),
        };
    }, [] );

    const allowedPostTypes = [ 'page', 'product' ];
    if ( ! allowedPostTypes.includes( postTypeName ) ) {
        return null;
    }

    return (
        <div className="example-section" data-testid="specific-post-type">
            <h3>✓ Specific Post Type</h3>
            <p>This component only renders for 'page' and 'product' post types.</p>
            <p><strong>Current post type:</strong> {postTypeName}</p>
        </div>
    );
};
```

### Excluding Certain Post Types

Prevent code from running on specific post types using a blocklist.

**Example from this project** ([ExcludePostTypesComponent.js](https://github.com/juanma-wp/detect-site-post-editor/blob/main/plugin/resources/js/components/ExcludePostTypesComponent.js)):

```javascript
const ExcludePostTypesComponent = () => {
    const { postTypeName } = useSelect( ( select ) => {
        return {
            postTypeName: select( editorStore ).getCurrentPostType(),
        };
    }, [] );

    const excludedPostTypes = [ 'attachment', 'wp_block' ];
    if ( excludedPostTypes.includes( postTypeName ) ) {
        return null;
    }

    return (
        <div className="example-section" data-testid="exclude-post-types">
            <h3>✓ Exclude Post Types</h3>
            <p>This component excludes 'attachment' and 'wp_block' post types.</p>
            <p><strong>Current post type:</strong> {postTypeName}</p>
        </div>
    );
};
```

**Real-world example**: WordPress core uses this pattern in the Query block ([packages/block-library/src/query/utils.js:106](https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/query/utils.js#L106)) to exclude the `attachment` post type from the Query Loop:

```javascript
const excludedPostTypes = [ 'attachment' ];
const filteredPostTypes = getPostTypes( { per_page: -1 } )?.filter(
    ( { viewable, slug } ) =>
        viewable && ! excludedPostTypes.includes( slug )
);
```

### Checking Post Type Visibility

Execute code only for public/viewable post types:

```javascript
const { isViewable } = useSelect( ( select ) => {
    const postType = select( editorStore ).getCurrentPostType();
    const postTypeObject = select( coreStore ).getPostType( postType );
    return {
        isViewable: postTypeObject?.viewable,
    };
}, [] );

if ( ! isViewable ) {
    return null;
}

// Code here only runs for viewable post types
```

The property `isViewable` indicates whether the post type has a publicly accessible frontend URL. Post types like `post` and `page` are viewable (users can visit them on the frontend), while administrative post types like `wp_navigation`, `wp_block` (reusable blocks), or `revision` are not viewable—they exist only in the editor.

When filtering code this is a key property because you typically want editor customizations to run only for content that end users will actually see, preventing your code from executing on internal WordPress data structures or administrative screens where it wouldn't make sense.

**Real-world examples** from Gutenberg core:

1. **Post URL Check** ([packages/editor/src/components/post-url/check.js:24](https://github.com/WordPress/gutenberg/blob/trunk/packages/editor/src/components/post-url/check.js#L24)): Prevents post URL controls from appearing for non-viewable post types:
   ```javascript
   const postType = select( coreStore ).getPostType( postTypeSlug );
   if ( ! postType?.viewable ) {
       return false;
   }
   ```

2. **Post Preview Button** ([packages/editor/src/components/post-preview-button/index.js:132](https://github.com/WordPress/gutenberg/blob/trunk/packages/editor/src/components/post-preview-button/index.js#L132)): Only renders the preview button for viewable post types:
   ```javascript
   const canView = postType?.viewable ?? false;
   if ( ! canView ) {
       return { isViewable: canView };
   }
   ```

3. **Post Template Panel** ([packages/editor/src/components/post-template/panel.js:32](https://github.com/WordPress/gutenberg/blob/trunk/packages/editor/src/components/post-template/panel.js#L32)): Restricts template selection to viewable post types only.

### Detecting Post Status

Run code based on the current post's publication status using [`getCurrentPostAttribute()`](https://developer.wordpress.org/block-editor/reference-guides/data/data-core-editor/#getcurrentpostattribute):

```javascript
const { postStatus } = useSelect( ( select ) => {
    return {
        postStatus: select( editorStore ).getCurrentPostAttribute( 'status' ),
    };
}, [] );

// Only run for draft posts
if ( postStatus !== 'draft' ) {
    return null;
}

// Code here only runs for draft posts
```

Common statuses: `'draft'`, `'publish'`, `'pending'`, `'private'`, `'future'`

### Detecting Page Template

Execute code only when a specific page template is being used with [`getEditedPostAttribute()`](https://developer.wordpress.org/block-editor/reference-guides/data/data-core-editor/#geteditedpostattribute):

```javascript
const { template } = useSelect( ( select ) => {
    return {
        template: select( editorStore ).getEditedPostAttribute( 'template' ),
    };
}, [] );

if ( template !== 'full-width' ) {
    return null;
}

// Code here only runs when the 'full-width' template is active
```

### Checking User Capabilities

Restrict code execution based on current user permissions using [`canUser()`](https://developer.wordpress.org/block-editor/reference-guides/data/data-core/#canuser):

```javascript
const { canPublish } = useSelect( ( select ) => {
    return {
        canPublish: select( coreStore ).canUser( 'create', 'posts' ),
    };
}, [] );

if ( ! canPublish ) {
    return null;
}

// Code here only runs for users who can publish posts
```

### Detecting Editor Mode

Run code only in specific editor modes (visual vs. code):

```javascript
const { editorMode } = useSelect( ( select ) => {
    return {
        editorMode: select( 'core/edit-post' ).getEditorMode(),
    };
}, [] );

if ( editorMode !== 'visual' ) {
    return null;
}

// Code here only runs in visual editor mode
```

### Checking for Site Editor Context

Exclude the Site Editor and other non-viewable post types:

```javascript
const { isViewable } = useSelect( ( select ) => {
    const postType = select( editorStore ).getCurrentPostType();
    const postTypeObject = select( coreStore ).getPostType( postType );
    return {
        isViewable: postTypeObject?.viewable,
    };
}, [] );

if ( ! isViewable ) {
    return null;
}

// Code here only runs for viewable post types (excludes Site Editor)
```

This approach excludes all non-viewable post types like `wp_navigation`, `wp_block` (reusable blocks), and `revision`. This is the [recommended pattern from WordPress core](https://developer.wordpress.org/block-editor/reference-guides/slotfills/#restricting-fills-to-the-side-editor).

### Excluding Design Post Types

WordPress defines a set of "design post types" that are used in the Site Editor. A common pattern in Gutenberg core is to exclude these post types to prevent UI from appearing in contexts where it doesn't belong.

**Example from this project** ([ExcludeDesignPostTypesComponent.js](https://github.com/juanma-wp/detect-site-post-editor/blob/main/plugin/resources/js/components/ExcludeDesignPostTypesComponent.js)):

```javascript
const DESIGN_POST_TYPES = [
    'wp_template',
    'wp_template_part',
    'wp_block',
    'wp_navigation',
];

const ExcludeDesignPostTypesComponent = () => {
    const { postType } = useSelect( ( select ) => {
        return {
            postType: select( editorStore ).getCurrentPostType(),
        };
    }, [] );

    if ( DESIGN_POST_TYPES.includes( postType ) ) {
        return null;
    }

    return (
        <div className="example-section" data-testid="exclude-design-post-types">
            <h3>✓ Exclude Design Post Types</h3>
            <p>This component excludes Site Editor design post types.</p>
            <p><strong>Current post type:</strong> {postType}</p>
            <p><strong>Excluded types:</strong> {DESIGN_POST_TYPES.join( ', ' )}</p>
        </div>
    );
};
```

**Real-world examples** from Gutenberg core:

1. **Visual Editor** ([packages/editor/src/components/visual-editor/index.js:58-63](https://github.com/WordPress/gutenberg/blob/trunk/packages/editor/src/components/visual-editor/index.js#L58-L63)): Uses `DESIGN_POST_TYPES` to determine whether to show the post title and apply layout styles.

2. **Post Status Component** ([packages/editor/src/components/post-status/index.js:77-82](https://github.com/WordPress/gutenberg/blob/trunk/packages/editor/src/components/post-status/index.js#L77-L82)): Excludes the status panel for design post types:
   ```javascript
   const DESIGN_POST_TYPES = [
       TEMPLATE_POST_TYPE,
       TEMPLATE_PART_POST_TYPE,
       PATTERN_POST_TYPE,
       NAVIGATION_POST_TYPE,
   ];

   if ( DESIGN_POST_TYPES.includes( postType ) ) {
       return null;
   }
   ```

### Detecting Selected Block Type

Execute code only when a specific block type is selected using [`getSelectedBlock()`](https://developer.wordpress.org/block-editor/reference-guides/data/data-core-block-editor/#getselectedblock):

```javascript
const { selectedBlockName } = useSelect( ( select ) => {
    const selectedBlock = select( 'core/block-editor' ).getSelectedBlock();
    return {
        selectedBlockName: selectedBlock?.name,
    };
}, [] );

if ( selectedBlockName !== 'core/paragraph' ) {
    return null;
}

// Code here only runs when a paragraph block is selected
```

### Checking Sidebar State

Run code based on sidebar visibility:

```javascript
const { isSidebarOpened } = useSelect( ( select ) => {
    return {
        isSidebarOpened: select( 'core/edit-post' ).isEditorSidebarOpened(),
    };
}, [] );

if ( ! isSidebarOpened ) {
    return null;
}

// Code here only runs when the sidebar is open
```

### Combining Multiple Conditions

Stack multiple conditions for precise control.

**Example from this project** ([CombinedConditionsComponent.js](https://github.com/juanma-wp/detect-site-post-editor/blob/main/plugin/resources/js/components/CombinedConditionsComponent.js)):

```javascript
const CombinedConditionsComponent = () => {
    const { postTypeName, postStatus, canEdit } = useSelect( ( select ) => {
        const { getCurrentPostType, getCurrentPostAttribute } = select( editorStore );
        const { canUser } = select( coreStore );

        const postType = getCurrentPostType();
        const status = getCurrentPostAttribute( 'status' );
        const isNewPost = ! status || status === 'auto-draft';

        const permission = isNewPost
            ? canUser( 'create', { kind: 'postType', name: postType } )
            : canUser( 'update', { kind: 'postType', name: postType } );

        return {
            postTypeName: postType,
            postStatus: status,
            canEdit: permission,
        };
    }, [] );

    // Accept both 'draft' and 'auto-draft' statuses
    const isDraftPage = ( postStatus === 'draft' || postStatus === 'auto-draft' );

    // Only render when ALL conditions are explicitly met
    const shouldRender = postTypeName === 'page' && isDraftPage && canEdit === true;

    if ( ! shouldRender ) {
        return null;
    }

    return (
        <div className="example-section" data-testid="combined-conditions">
            <h3>✓ Combined Conditions</h3>
            <p>This component requires ALL conditions to be met:</p>
            <ul>
                <li><strong>Post type:</strong> page ✓</li>
                <li><strong>Status:</strong> draft ✓</li>
                <li><strong>Can edit:</strong> Yes ✓</li>
            </ul>
        </div>
    );
};
```

### Performance Considerations

- **Empty Dependency Array**: Use `[]` as the second argument to `useSelect` to run the selector only once on mount
- **Early Returns**: Return `null` immediately when conditions aren't met to prevent unnecessary execution
- **Selective Data**: Only retrieve the specific data you need to minimize re-renders

## Server-Side Context Detection

While the examples above use client-side detection with `useSelect`, you can also perform context detection on the server side before your JavaScript is even loaded. This approach is more performant since it prevents unnecessary code from being enqueued at all.

### Detecting the Block Editor

Check if the current screen is using the block editor.

**Example from this project** ([server-side-detection.php#L32-L35](https://github.com/juanma-wp/detect-site-post-editor/blob/main/plugin/includes/server-side-detection.php#L32-L35)):

```php
function cre_is_block_editor() {
    $screen = cre_get_current_screen();
    return $screen && $screen->is_block_editor();
}
```

This function checks if the current admin screen is using the block editor by calling the `is_block_editor()` method on the `WP_Screen` object.

### Detecting Specific Post Types on the Server

Restrict code to specific post types before enqueueing.

**Example from this project** ([server-side-detection.php#L63-L74](https://github.com/juanma-wp/detect-site-post-editor/blob/main/plugin/includes/server-side-detection.php#L63-L74)):

```php
function cre_is_post_type( $post_type ) {
    $screen = cre_get_current_screen();
    if ( ! $screen ) {
        return false;
    }

    if ( is_array( $post_type ) ) {
        return in_array( $screen->post_type, $post_type, true );
    }

    return $screen->post_type === $post_type;
}
```

This function supports both single post types and arrays of post types, making it flexible for different use cases. See a practical example in [page-only.js](https://github.com/juanma-wp/detect-site-post-editor/blob/main/plugin/resources/js/server-conditionals/page-only.js) where it's used to enqueue scripts only for pages.

### Detecting Post Edit Screens

Check if you're on a post edit screen.

**Example from this project** ([server-side-detection.php#L42-L45](https://github.com/juanma-wp/detect-site-post-editor/blob/main/plugin/includes/server-side-detection.php#L42-L45)):

```php
function cre_is_post_edit_screen() {
    $screen = cre_get_current_screen();
    return $screen && $screen->base === 'post';
}
```

This checks the `base` property of the screen object to confirm we're on a post edit screen. See [post-edit-only.js](https://github.com/juanma-wp/detect-site-post-editor/blob/main/plugin/resources/js/server-conditionals/post-edit-only.js) for a working example.

### Detecting Site Editor

Check if you're in the Site Editor (Full Site Editing).

**Example from this project** ([server-side-detection.php#L52-L55](https://github.com/juanma-wp/detect-site-post-editor/blob/main/plugin/includes/server-side-detection.php#L52-L55)):

```php
function cre_is_site_editor() {
    global $pagenow;
    return 'site-editor.php' === $pagenow;
}
```

This uses the global `$pagenow` variable to detect the Site Editor. See [no-site-editor.js](https://github.com/juanma-wp/detect-site-post-editor/blob/main/plugin/resources/js/server-conditionals/no-site-editor.js) for an example that prevents scripts from loading in the Site Editor.

### Checking User Capabilities on the Server

Restrict based on user permissions.

**Example from this project** ([server-side-detection.php#L95-L116](https://github.com/juanma-wp/detect-site-post-editor/blob/main/plugin/includes/server-side-detection.php#L95-L116)):

```php
function cre_user_can_publish_posts() {
    return current_user_can( 'publish_posts' );
}

function cre_user_can_edit_posts() {
    return current_user_can( 'edit_posts' );
}

function cre_user_can_edit_pages() {
    return current_user_can( 'edit_pages' );
}
```

These wrapper functions make capability checks more semantic and reusable. See [publisher-only.js](https://github.com/juanma-wp/detect-site-post-editor/blob/main/plugin/resources/js/server-conditionals/publisher-only.js) for an example that restricts functionality to users who can publish posts.

### Detecting Specific Templates on the Server

Check the page template being used.

**Example from this project** ([server-side-detection.php#L123-L133](https://github.com/juanma-wp/detect-site-post-editor/blob/main/plugin/includes/server-side-detection.php#L123-L133)):

```php
function cre_is_template( $template ) {
    global $post;

    if ( ! $post ) {
        return false;
    }

    $current_template = get_page_template_slug( $post->ID );
    return $current_template === $template;
}
```

This function checks if the current post uses a specific page template by comparing the template slug.

### Checking Post Status on the Server

Only load for specific post statuses.

**Example from this project** ([server-side-detection.php#L140-L155](https://github.com/juanma-wp/detect-site-post-editor/blob/main/plugin/includes/server-side-detection.php#L140-L155)):

```php
function cre_is_post_status( $status ) {
    global $post;

    if ( ! $post ) {
        return false;
    }

    $current_status = get_post_status( $post->ID );

    if ( is_array( $status ) ) {
        return in_array( $current_status, $status, true );
    }

    return $current_status === $status;
}
```

This function supports checking for a single status or an array of statuses, making it flexible for different scenarios like checking for both 'draft' and 'auto-draft'.

### Combining Multiple Server-Side Conditions

Stack multiple server-side checks for precise control.

**Example from this project** ([server-side-detection.php#L198-L206](https://github.com/juanma-wp/detect-site-post-editor/blob/main/plugin/includes/server-side-detection.php#L198-L206)):

```php
function cre_check_conditions( $conditions ) {
    foreach ( $conditions as $condition ) {
        if ( is_callable( $condition ) && ! $condition() ) {
            return false;
        }
    }
    return true;
}
```

This helper function allows you to pass an array of condition callbacks and returns true only if all conditions pass. Here's a practical example:

```php
function my_plugin_enqueue_draft_pages() {
    $conditions = array(
        fn() => cre_is_post_type( 'page' ),
        fn() => cre_is_post_status( array( 'draft', 'auto-draft' ) ),
        fn() => cre_user_can_edit_pages(),
    );

    if ( cre_check_conditions( $conditions ) ) {
        wp_enqueue_script(
            'my-draft-page-script',
            plugin_dir_url( __FILE__ ) . 'draft-page.js',
            array( 'wp-editor' ),
            '1.0.0'
        );
    }
}
add_action( 'admin_enqueue_scripts', 'my_plugin_enqueue_draft_pages' );
```

### Server-Side vs Client-Side Detection

**Server-side advantages:**
- Better performance—prevents unnecessary JavaScript from loading
- Reduces client-side bundle size
- Simpler for basic conditions

**Client-side advantages:**
- More dynamic—can react to editor state changes
- Access to real-time editor data (selected blocks, sidebar state, etc.)
- Better for UI that needs to update based on user interactions

**Best practice**: Use server-side detection for initial script loading decisions, and client-side detection for dynamic UI behavior within the loaded scripts.

## Key Takeaways

Conditional execution in the WordPress Block Editor is about **selecting the right context data** and **returning `null` when conditions aren't met**. This pattern keeps your code performant and contextually aware—ensuring functionality executes exactly where and when it's needed. Combine server-side detection for optimal performance with client-side detection for dynamic behavior.

## Complete Working Example

All the examples in this article are taken from a fully functional WordPress plugin with comprehensive E2E tests. You can explore the complete implementation, run the tests, and see these patterns in action:

**Repository**: [juanma-wp/detect-site-post-editor](https://github.com/juanma-wp/detect-site-post-editor)

The project includes:
- ✅ **8 React components** demonstrating different conditional rendering patterns
- ✅ **12+ PHP helper functions** for server-side detection
- ✅ **Comprehensive E2E tests** using Playwright (no mocks!)
- ✅ **Working examples** you can install and test locally
- ✅ **CI/CD pipeline** with automated testing

Each pattern is thoroughly tested and documented, making it easy to understand how these techniques work in real-world scenarios. The repository serves as both a learning resource and a reference implementation you can adapt for your own projects.
