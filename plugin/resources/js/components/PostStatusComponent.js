import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';

/**
 * Component that only renders for draft posts
 */
const PostStatusComponent = () => {
	const { postStatus } = useSelect( ( select ) => {
		return {
			postStatus: select( editorStore ).getCurrentPostAttribute( 'status' ),
		};
	}, [] );

	// Only show for draft posts (including auto-draft for new unsaved posts)
	if ( postStatus !== 'draft' && postStatus !== 'auto-draft' ) {
		return null;
	}

	return (
		<div className="example-section" data-testid="post-status-draft">
			<h3>✓ Post Status (Draft)</h3>
			<p>This component only renders for draft posts.</p>
			<p><strong>Current status:</strong> {postStatus}</p>
		</div>
	);
};

export default PostStatusComponent;
