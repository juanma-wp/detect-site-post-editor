import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useEffect } from '@wordpress/element';

/**
 * Component demonstrating multiple combined conditions:
 * - Post type must be 'page'
 * - Post status must be 'draft'
 * - User must have edit capabilities
 */
const CombinedConditionsComponent = () => {
	const [ hasPermission, setHasPermission ] = useState( undefined );

	const { postTypeName, postStatus } = useSelect( ( select ) => {
		const postType = select( editorStore ).getCurrentPostType();
		const status = select( editorStore ).getCurrentPostAttribute( 'status' );

		return {
			postTypeName: postType,
			postStatus: status,
		};
	} );

	// Use useEffect to poll for permission resolution
	useEffect( () => {
		const checkPermission = () => {
			const { select } = window.wp.data;
			const coreStoreSelect = select( coreStore );
			const editorStoreSelect = select( editorStore );

			const status = editorStoreSelect.getCurrentPostAttribute( 'status' );
			const postType = editorStoreSelect.getCurrentPostType();

			const isNewPost = ! status || status === 'auto-draft';
			const permission = isNewPost
				? coreStoreSelect.canUser( 'create', { kind: 'postType', name: postType } )
				: coreStoreSelect.canUser( 'update', { kind: 'postType', name: postType } );

			if ( permission !== undefined && permission !== hasPermission ) {
				setHasPermission( permission );
			}
		};

		// Check immediately
		checkPermission();

		// Poll every 500ms until permission is resolved
		const interval = setInterval( checkPermission, 500 );

		return () => clearInterval( interval );
	}, [ hasPermission, postTypeName, postStatus ] );

	// Accept both 'draft' and 'auto-draft' statuses
	const isDraftPage = ( postStatus === 'draft' || postStatus === 'auto-draft' );

	// Only render when ALL conditions are explicitly met
	// hasPermission can be: true (has permission), false (no permission), or undefined (still loading)
	const shouldRender = postTypeName === 'page' && isDraftPage && hasPermission === true;

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
