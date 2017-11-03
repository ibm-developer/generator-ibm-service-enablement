const IBMCloudEnv = require('ibm-cloud-env');
const passport = require('passport');
const AppIdAPIStrategy = require('bluemix-appid').APIStrategy;
const WebAppStrategy = require("bluemix-appid").WebAppStrategy;
const userAttributeManager = require("bluemix-appid").UserAttributeManager;


module.exports = function(app, serviceManager){
	let apiStrategy = new AppIdAPIStrategy({
		oauthServerUrl: IBMCloudEnv.getString("appid_oauth_server_url")
	});
	
	let webStrategy = new WebAppStrategy({
		tenantId: IBMCloudEnv.getString('appid_tenant_id'),
		clientId: IBMCloudEnv.getString('appid_client_id'),
		secret: IBMCloudEnv.getString('appid_secret'),
		oauthServerUrl: IBMCloudEnv.getString("appid_oauth_server_url"),
		redirectUri: serviceManager.get('appid-redirect-uri')
	});

	userAttributeManager.init({profilesUrl: IBMCloudEnv.getString('appid_profiles_url')});

	serviceManager.set('appid-web-strategy', webStrategy);
	serviceManager.set('appid-web-strategy-name', WebAppStrategy.STRATEGY_NAME);
	serviceManager.set('appid-web-auth-context', WebAppStrategy.AUTH_CONTEXT);
	serviceManager.set("appid-api-strategy", apiStrategy);
	serviceManager.set('appid-api-strategy-name', AppIdAPIStrategy.STRATEGY_NAME);
	serviceManager.set('appid-user-attribute-manager', userAttributeManager);

};
