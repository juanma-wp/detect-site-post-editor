import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Component that only renders for viewable post types
 */
const ViewablePostTypeComponent = () => {
	const { isViewable, postTypeName, postTypeObject } = useSelect( ( select ) => {
		const postType = select( editorStore ).getCurrentPostType();
		const typeObject = select( coreStore ).getPostType( postType );
		return {
			isViewable: typeObject?.viewable,
			postTypeName: postType,
			postTypeObject: typeObject,
		};
	}, [] );

	// Wait for data to load - both postTypeName and postTypeObject should be available
	if ( ! postTypeName || ! postTypeObject ) {
		return null;
	}

	if ( ! isViewable ) {
		return null;
	}

	return (
		<div className="example-section" data-testid="viewable-post-type">
			<h3>✓ Viewable Post Type</h3>
			<p>This component only renders for viewable post types (excludes Site Editor).</p>
			<p><strong>Current post type:</strong> {postTypeName}</p>
			<p><strong>Is viewable:</strong> {isViewable ? 'Yes' : 'No'}</p>
		</div>
	);
};

export default ViewablePostTypeComponent;
