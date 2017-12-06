const IBMCloudEnv = require('ibm-cloud-env');
const passport = require('passport');
const AppIdAPIStrategy = require('bluemix-appid').APIStrategy;
const WebAppStrategy = require("bluemix-appid").WebAppStrategy;
const userAttributeManager = require("bluemix-appid").UserAttributeManager;


module.exports = function(app, serviceManager){
	let apiStrategy = new AppIdAPIStrategy({
		oauthServerUrl: IBMCloudEnv.getDictionary("appid").oauthServerUrl
	});

	let webStrategy = new WebAppStrategy({
		tenantId: IBMCloudEnv.getDictionary('appid').tenantId,
		clientId: IBMCloudEnv.getDictionary('appid').clientId,
		secret: IBMCloudEnv.getDictionary('appid').secret,
		oauthServerUrl: IBMCloudEnv.getDictionary("appid").oauthServerUrl,
		redirectUri: serviceManager.get('auth-redirect-uri')
	});

	userAttributeManager.init({profilesUrl: IBMCloudEnv.getDictionary('appid').profilesUrl});

	serviceManager.set('auth-web-strategy', webStrategy);
	serviceManager.set('auth-web-strategy-name', WebAppStrategy.STRATEGY_NAME);
	serviceManager.set('auth-web-auth-context', WebAppStrategy.AUTH_CONTEXT);
	serviceManager.set("auth-api-strategy", apiStrategy);
	serviceManager.set('auth-api-strategy-name', AppIdAPIStrategy.STRATEGY_NAME);
	serviceManager.set('auth-user-attribute-manager', userAttributeManager);

};
