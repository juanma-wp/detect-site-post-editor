/**
 * SiteEditorContextComponent
 *
 * Demonstrates checking for Site Editor context by excluding non-viewable post types.
 * Only renders in the Post Editor (viewable post types), not in the Site Editor.
 *
 * @package ConditionalRenderingExamples
 */

import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { store as coreStore } from '@wordpress/core-data';

const SiteEditorContextComponent = () => {
	const { isViewable, postType, postTypeObject } = useSelect( ( select ) => {
		const currentPostType = select( editorStore ).getCurrentPostType();
		const typeObject = select( coreStore ).getPostType( currentPostType );
		return {
			isViewable: typeObject?.viewable,
			postType: currentPostType,
			postTypeObject: typeObject,
		};
	}, [] );

	// Wait for data to load - both postType and postTypeObject should be available
	if ( ! postType || ! postTypeObject ) {
		return null;
	}

	// Only show for viewable post types (excludes Site Editor)
	if ( ! isViewable ) {
		return null;
	}

	return (
		<div className="example-section" data-testid="site-editor-context">
			<h3>✓ Post Editor Context</h3>
			<p>This component only renders in the Post Editor, not in the Site Editor.</p>
			<p><strong>Current post type:</strong> {postType}</p>
			<p><strong>Is viewable:</strong> Yes (excludes Site Editor templates)</p>
		</div>
	);
};

export default SiteEditorContextComponent;
