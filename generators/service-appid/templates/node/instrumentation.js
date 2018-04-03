const IBMCloudEnv = require('ibm-cloud-env');
const AppIdAPIStrategy = require('bluemix-appid').APIStrategy;
const WebAppStrategy = require('bluemix-appid').WebAppStrategy;
const userAttributeManager = require('bluemix-appid').UserAttributeManager;

module.exports = function(app, serviceManager){
	let apiStrategy = new AppIdAPIStrategy({
		oauthServerUrl: IBMCloudEnv.getString('appid_oauth_server_url')
	});

	const PORT = process.env.PORT || 3000;
	const defaultRedirectUri = `http://localhost:${PORT}/ibm/bluemix/appid/callback`;
	
	let webStrategy = new WebAppStrategy({
		tenantId: IBMCloudEnv.getString('appid_tenant_id'),
		clientId: IBMCloudEnv.getString('appid_client_id'),
		secret: IBMCloudEnv.getString('appid_secret'),
		oauthServerUrl: IBMCloudEnv.getString('appid_oauth_server_url'),
		redirectUri: serviceManager.get('auth-redirect-uri') || defaultRedirectUri
	});

	userAttributeManager.init({profilesUrl: IBMCloudEnv.getString('appid_profiles_url')});

	serviceManager.set('auth-web-strategy', webStrategy);
	serviceManager.set('auth-web-strategy-name', WebAppStrategy.STRATEGY_NAME);
	serviceManager.set('auth-web-auth-context', WebAppStrategy.AUTH_CONTEXT);
	serviceManager.set('auth-api-strategy', apiStrategy);
	serviceManager.set('auth-api-strategy-name', AppIdAPIStrategy.STRATEGY_NAME);
	serviceManager.set('auth-user-attribute-manager', userAttributeManager);

};
