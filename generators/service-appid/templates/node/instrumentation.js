const IBMCloudEnv = require('ibm-cloud-env');
const passport = require('passport');
const AppIdAPIStrategy = require('bluemix-appid').APIStrategy;

module.exports = function(app, serviceManager){
	var strategy = new AppIdAPIStrategy({
		oauthServerUrl: IBMCloudEnv.getString("appid_oauth_server_url")
	});

	passport.use(strategy);
	app.use(passport.initialize());

	// Protect your APIs with AppIdAPIStrategy
	// app.use("/protected", passport.authenticate(AppIdAPIStrategy.STRATEGY_NAME, {
	// 	session: false
	// }));

	serviceManager.set("appid-api-strategy", strategy);
};
