import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';

const DESIGN_POST_TYPES = [
	'wp_template',
	'wp_template_part',
	'wp_block',
	'wp_navigation',
];

/**
 * Component that excludes design post types (Site Editor contexts)
 */
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

export default ExcludeDesignPostTypesComponent;
