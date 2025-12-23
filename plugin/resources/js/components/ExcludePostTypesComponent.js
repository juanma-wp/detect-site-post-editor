import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';

/**
 * Component that excludes specific post types (attachment and wp_block)
 */
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

export default ExcludePostTypesComponent;
