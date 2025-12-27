/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';

/**
 * Styles
 */
import './index.css';

/**
 * Internal dependencies
 */
import SpecificPostTypeComponent from './components/SpecificPostTypeComponent';
import ExcludePostTypesComponent from './components/ExcludePostTypesComponent';
import ViewablePostTypeComponent from './components/ViewablePostTypeComponent';
import PostStatusComponent from './components/PostStatusComponent';
import PageTemplateComponent from './components/PageTemplateComponent';
import UserCapabilityComponent from './components/UserCapabilityComponent';
import ExcludeDesignPostTypesComponent from './components/ExcludeDesignPostTypesComponent';
import CombinedConditionsComponent from './components/CombinedConditionsComponent';


/**
 * Main plugin component that displays all examples
 *
 * Uses PluginDocumentSettingPanel from `@wordpress/editor` to add a panel
 * in the document sidebar of  both post and site editors.
 *
 * @see https://make.wordpress.org/core/2024/06/18/editor-unified-extensibility-apis-in-6-6/
 */
 
const ConditionalRenderingExamples = () => {
	return (
		<PluginDocumentSettingPanel
			name="conditional-rendering-examples"
			title="Conditional Rendering Examples"
			className="conditional-rendering-examples"
			initialOpen={true}
		>
			<div style={{ padding: '16px 0' }}>
				<SpecificPostTypeComponent />
				<ExcludePostTypesComponent />
				<ViewablePostTypeComponent />
				<PostStatusComponent />
				<PageTemplateComponent />
				<UserCapabilityComponent />
				<ExcludeDesignPostTypesComponent />
				<CombinedConditionsComponent />
			</div>
		</PluginDocumentSettingPanel>
	);
};

registerPlugin( 'conditional-rendering-examples', {
	render: ConditionalRenderingExamples,
	icon: null,
} );
