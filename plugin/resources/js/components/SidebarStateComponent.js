/**
 * SidebarStateComponent
 *
 * Demonstrates checking sidebar visibility state.
 * Only renders when the document settings sidebar is open.
 *
 * @package ConditionalRenderingExamples
 */

import { useSelect } from '@wordpress/data';
import { store as editPostStore } from '@wordpress/edit-post';
import { store as editorStore } from '@wordpress/editor';

const SidebarStateComponent = () => {
	const isSidebarOpened = useSelect( ( select ) => {
		// Try edit-post store first (legacy post editor)
		const editPostSelect = select( editPostStore );
		if ( editPostSelect && editPostSelect.isEditorSidebarOpened ) {
			return editPostSelect.isEditorSidebarOpened();
		}

		// Try core/interface store (unified editor) - check if edit-post/document sidebar is active
		// Access the store by string name since we don't have the package
		const interfaceSelect = select( 'core/interface' );
		if ( interfaceSelect && interfaceSelect.getActiveComplementaryArea ) {
			// Check multiple possible scopes for the complementary area
			const editPostArea = interfaceSelect.getActiveComplementaryArea( 'core/edit-post' );
			const editSiteArea = interfaceSelect.getActiveComplementaryArea( 'core/edit-site' );

			// The document settings sidebar is active when the complementary area ends with '/document'
			return editPostArea === 'edit-post/document' || editSiteArea === 'edit-site/document';
		}

		return false;
	}, [] );

	// Only show when sidebar is open
	if ( ! isSidebarOpened ) {
		return null;
	}

	return (
		<div className="example-section" data-testid="sidebar-state">
			<h3>✓ Sidebar State</h3>
			<p>This component only renders when the sidebar is open.</p>
			<p><strong>Sidebar opened:</strong> {isSidebarOpened ? 'Yes' : 'No'}</p>
		</div>
	);
};

export default SidebarStateComponent;
