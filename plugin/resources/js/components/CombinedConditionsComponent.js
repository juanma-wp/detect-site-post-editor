import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Component demonstrating multiple combined conditions:
 * - Post type must be 'page'
 * - Post status must be 'draft'
 * - User must have edit capabilities
 */
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
	// Note: canEdit can be undefined while permissions are loading, so we check for explicit true
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

export default CombinedConditionsComponent;
