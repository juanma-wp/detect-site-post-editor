import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';

/**
 * Component that only renders when 'full-width' template is selected
 */
const PageTemplateComponent = () => {
	const { template, postType } = useSelect( ( select ) => {
		return {
			template: select( editorStore ).getEditedPostAttribute( 'template' ),
			postType: select( editorStore ).getCurrentPostType(),
		};
	}, [] );

	// Only show for pages
	if ( postType !== 'page' ) {
		return null;
	}

	if ( template !== 'full-width' ) {
		return null;
	}

	return (
		<div className="example-section" data-testid="page-template">
			<h3>✓ Page Template</h3>
			<p>This component only renders when the 'full-width' template is active.</p>
			<p><strong>Current template:</strong> {template || 'default'}</p>
		</div>
	);
};

export default PageTemplateComponent;
