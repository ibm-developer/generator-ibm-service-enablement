const IBMCloudEnv = require('ibm-cloud-env');
const AppIdAPIStrategy = require('ibmcloud-appid').APIStrategy;
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;
const userProfileManager = require("ibmcloud-appid").UserProfileManager;
const session = require('express-session')
const passport = require('passport');
const fs = require('fs-extra');

module.exports = function (app, serviceManager) {

	// Below URLs will be used for App ID OAuth flows
	const LANDING_PAGE_URL = "/";
	const LOGIN_URL = "/ibm/bluemix/appid/login";
	const CALLBACK_URL = "/ibm/bluemix/appid/callback";
	const LOGOUT_URL = "/ibm/bluemix/appid/logout";

	let apiStrategy = new AppIdAPIStrategy({
		oauthServerUrl: IBMCloudEnv.getString('appid_oauth_server_url')
	});

	const PORT = process.env.PORT || 3000;
	const defaultRedirectUri = `http://localhost:${PORT}/ibm/bluemix/appid/callback`;

	// Setup express application to use express-session middleware
	// Must be configured with proper session storage for production
	// environments. See https://github.com/expressjs/session for
	// additional documentation
	app.use(session({
		secret: '123456',
		resave: true,
		saveUninitialized: true
	}));

	// Configure express application to use passportjs
	app.use(passport.initialize());
	app.use(passport.session());

	// Below configuration can be obtained from Service Credentials
	// tab in the App ID Dashboard. You're not required to manually provide below
	// configuration if your node.js application runs on IBM Cloud and is bound to the
	// App ID service instance.
	let webStrategy = new WebAppStrategy({
		tenantId: IBMCloudEnv.getString('appid_tenant_id'),
		clientId: IBMCloudEnv.getString('appid_client_id'),
		secret: IBMCloudEnv.getString('appid_secret'),
		oauthServerUrl: IBMCloudEnv.getString('appid_oauth_server_url'),
		redirectUri: serviceManager.get('appid-redirect-uri') || defaultRedirectUri
	});

	passport.use(webStrategy);

	// Configure passportjs with user serialization/deserialization. This is required
	// for authenticated session persistence across HTTP requests. See passportjs docs
	// for additional information http://passportjs.org/docs.
	passport.serializeUser(function (user, cb) {
		cb(null, user);
	});

	passport.deserializeUser(function (obj, cb) {
		cb(null, obj);
	});

	// Explicit login endpoint. Will always redirect browser to login widget due to {forceLogin: true}. 
	// If forceLogin is set to false the redirect to login widget will not occur if user is already authenticated
	app.get(LOGIN_URL, passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
		successRedirect: LANDING_PAGE_URL,
		forceLogin: true
	}));

	// Callback to finish the authorization process. Will retrieve access and identity tokens
	// from App ID service and redirect to either (in below order)
	// 1. the original URL of the request that triggered authentication, as persisted in HTTP session under WebAppStrategy.ORIGINAL_URL key.
	// 2. successRedirect as specified in passport.authenticate(name, {successRedirect: "...."}) invocation
	// 3. application root ("/")
	app.get(CALLBACK_URL, passport.authenticate(WebAppStrategy.STRATEGY_NAME));

	// Logout endpoint. Clears authentication information from session
	app.get(LOGOUT_URL, function (req, res) {
		WebAppStrategy.logout(req);
		res.redirect(LANDING_PAGE_URL);
	});

	// Protected area. If current user is not authenticated - redirect to the login widget will be returned.
	// In case user is authenticated - a page with current user information will be returned.
	app.get("/protected", passport.authenticate(WebAppStrategy.STRATEGY_NAME), function (req, res) {
		res.json(req.user);
	});

	if (fs.existsSync("public/index.html")) {
		app.get('/', function (req, res) {
			var indexData = fs.readFileSync("public/index.html", 'utf8');
			try {
				var appidData = fs.readFileSync("public/appid.html", 'utf8');
				var result = indexData.replace(/<!-- placeholder appid login -->/g, appidData);
				res.send(result);
			}
			catch (err) { // if appid.html is not found, return the origin index.html
				res.send(indexData.valueOf());
			}
		});
	}

	userProfileManager.init({
		profilesUrl: IBMCloudEnv.getString('appid_profiles_url'),
		oauthServerUrl: IBMCloudEnv.getString('appid_oauth_server_url')
	});

	serviceManager.set('auth-web-strategy', webStrategy);
	serviceManager.set('auth-web-strategy-name', WebAppStrategy.STRATEGY_NAME);
	serviceManager.set('auth-web-auth-context', WebAppStrategy.AUTH_CONTEXT);
	serviceManager.set('auth-api-strategy', apiStrategy);
	serviceManager.set('auth-api-strategy-name', AppIdAPIStrategy.STRATEGY_NAME);
	serviceManager.set('auth-user-attribute-manager', userProfileManager);

};
