/**
 * SelectedBlockTypeComponent
 *
 * Demonstrates detecting the currently selected block type.
 * Only renders when a paragraph block is selected.
 *
 * @package ConditionalRenderingExamples
 */

import { useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

const SelectedBlockTypeComponent = () => {
	const selectedBlockName = useSelect( ( select ) => {
		const selectedBlock = select( blockEditorStore ).getSelectedBlock();
		return selectedBlock?.name;
	}, [] );

	// Only show when a paragraph block is selected
	// Note: selectedBlockName can be undefined (no selection) or null, both are falsy
	if ( selectedBlockName !== 'core/paragraph' ) {
		return null;
	}

	return (
		<div className="example-section" data-testid="selected-block-type">
			<h3>✓ Selected Block Type</h3>
			<p>This component only renders when a paragraph block is selected.</p>
			<p><strong>Selected block:</strong> {selectedBlockName}</p>
		</div>
	);
};

export default SelectedBlockTypeComponent;
