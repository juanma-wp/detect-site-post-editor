import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Component that only renders for users who can publish posts
 */
const UserCapabilityComponent = () => {
	const { canPublish } = useSelect( ( select ) => {
		return {
			canPublish: select( coreStore ).canUser( 'publish', 'posts' ),
		};
	}, [] );

	// canUser returns undefined while loading, null/false when user cannot, true when they can
	// Only hide component when explicitly false (not just falsy)
	if ( canPublish === false ) {
		return null;
	}

	return (
		<div className="example-section" data-testid="user-capability">
			<h3>✓ User Capability</h3>
			<p>This component only renders for users who can publish posts.</p>
			<p><strong>Can publish:</strong> {canPublish ? 'Yes' : 'No'}</p>
		</div>
	);
};

export default UserCapabilityComponent;
