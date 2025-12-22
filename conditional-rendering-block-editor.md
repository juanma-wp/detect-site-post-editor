# Conditionally Executing Code in Different WordPress Block Editor Contexts

When developing for the WordPress Block Editor, you need to control when and where your JavaScript code executes. Rather than running code everywhere, you can conditionally execute functionality based on the editing context—such as post type, post status, editor mode, or other conditions.

## The Core Pattern: Using `useSelect` to Detect Context

The fundamental approach uses WordPress's [`@wordpress/data`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/) package to access editor information and determine whether to execute your code:

```javascript
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { store as coreStore } from '@wordpress/core-data';

const ConditionalComponent = () => {
    const { isViewable, postTypeName } = useSelect( ( select ) => {
        const postType = select( editorStore ).getCurrentPostType();
        const postTypeObject = select( coreStore ).getPostType( postType );
        return {
            isViewable: postTypeObject?.viewable,
            postTypeName: postType,
        };
    }, [] );

    // Define your conditions
    const allowedPostTypes = [ 'page' ];

    // Return null to prevent execution
    if ( ! isViewable || ! allowedPostTypes.includes( postTypeName ) ) {
        return null;
    }

    // Your code only executes when conditions are met
    return (
        <div>Your conditional content here</div>
    );
};
```

**Key mechanism**: The [`useSelect`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/#useselect) hook retrieves data from WordPress stores, and returning `null` prevents component rendering and code execution when conditions aren't met.

The property `isViewable` indicates whether the post type has a publicly accessible frontend URL. Post types like `post` and `page` are viewable (users can visit them on the frontend), while administrative post types like `wp_navigation`, `wp_block` (reusable blocks), or `revision` are not viewable—they exist only in the editor.

When filtering code this is a key property because you typically want editor customizations to run only for content that end users will actually see, preventing your code from executing on internal WordPress data structures or administrative screens where it wouldn't make sense.

## Detecting Specific Post Types

Restrict code execution to specific post types using an allow list. Use the [`getCurrentPostType()`](https://developer.wordpress.org/block-editor/reference-guides/data/data-core-editor/#getcurrentposttype) selector from the editor store:

```javascript
const { postTypeName } = useSelect( ( select ) => {
    return {
        postTypeName: select( editorStore ).getCurrentPostType(),
    };
}, [] );

const allowedPostTypes = [ 'page', 'product' ];
if ( ! allowedPostTypes.includes( postTypeName ) ) {
    return null;
}

// Code here only runs for 'page' and 'product' post types
```

## Excluding Certain Post Types

Prevent code from running on specific post types using a blocklist:

```javascript
const { postTypeName } = useSelect( ( select ) => {
    return {
        postTypeName: select( editorStore ).getCurrentPostType(),
    };
}, [] );

const excludedPostTypes = [ 'attachment', 'wp_block' ];
if ( excludedPostTypes.includes( postTypeName ) ) {
    return null;
}

// Code here runs on all post types except 'attachment' and 'wp_block'
```

## Checking Post Type Visibility

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



## Detecting Post Status

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

## Detecting Page Template

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

## Checking User Capabilities

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

## Detecting Editor Mode

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

## Checking for Site Editor Context

Differentiate between post editor and site editor:

```javascript
const { isSiteEditor } = useSelect( ( select ) => {
    return {
        isSiteEditor: select( editorStore ).getCurrentPostType() === 'wp_template',
    };
}, [] );

if ( isSiteEditor ) {
    return null;
}

// Code here only runs in the post editor, not site editor
```

## Detecting Selected Block Type

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

## Checking Sidebar State

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

## Combining Multiple Conditions

Stack multiple conditions for precise control:

```javascript
const { postTypeName, postStatus, canEdit } = useSelect( ( select ) => {
    const postType = select( editorStore ).getCurrentPostType();
    return {
        postTypeName: postType,
        postStatus: select( editorStore ).getCurrentPostAttribute( 'status' ),
        canEdit: select( coreStore ).canUser( 'update', postType ),
    };
}, [] );

// Only run for draft pages that the user can edit
if ( postTypeName !== 'page' || postStatus !== 'draft' || ! canEdit ) {
    return null;
}

// Code here only runs under all three conditions
```

## Performance Considerations

- **Empty Dependency Array**: Use `[]` as the second argument to `useSelect` to run the selector only once on mount
- **Early Returns**: Return `null` immediately when conditions aren't met to prevent unnecessary execution
- **Selective Data**: Only retrieve the specific data you need to minimize re-renders

## Key Takeaway

Conditional execution in the WordPress Block Editor is about **selecting the right context data** and **returning `null` when conditions aren't met**. This pattern keeps your code performant and contextually aware—ensuring functionality executes exactly where and when it's needed.
