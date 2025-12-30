/**
 * EditorModeComponent
 *
 * Demonstrates detecting the current editor mode (visual vs code).
 * Only renders when the editor is in visual mode.
 *
 * @package ConditionalRenderingExamples
 */

import { useSelect } from '@wordpress/data';
import { store as editPostStore } from '@wordpress/edit-post';

const EditorModeComponent = () => {
	const { editorMode } = useSelect( ( select ) => {
		return {
			editorMode: select( editPostStore ).getEditorMode(),
		};
	}, [] );

	// Only show in visual editor mode
	if ( editorMode !== 'visual' ) {
		return null;
	}

	return (
		<div className="example-section" data-testid="editor-mode">
			<h3>✓ Editor Mode (Visual)</h3>
			<p>This component only renders in visual editor mode.</p>
			<p><strong>Current mode:</strong> {editorMode}</p>
		</div>
	);
};

export default EditorModeComponent;
