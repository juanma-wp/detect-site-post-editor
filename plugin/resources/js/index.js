/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';

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
