import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';

/**
 * Component that only renders for specific post types (page and product)
 */
const SpecificPostTypeComponent = () => {
	const { postTypeName } = useSelect( ( select ) => {
		return {
			postTypeName: select( editorStore ).getCurrentPostType(),
		};
	}, [] );

	// Wait for data - getCurrentPostType should return a string, not undefined
	if ( ! postTypeName ) {
		return null;
	}

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

export default SpecificPostTypeComponent;
