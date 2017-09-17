/* eslint-disable */
const LOGIN_URL = "/ibm/bluemix/appid/login";

app.use(session({
  secret: "ninpocho",
  resave: false,
  saveUninitialized: true,
	cookie: {
		httpOnly: false,
		secure: false,
		maxAge : (4 * 60 * 60 * 1000)
	}
}));

app.use(passport.initialize());
app.use(passport.session());

let webStrategy = serviceManager.get('appid-web-strategy');

passport.serializeUser(function(user, cb) {
	cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
	cb(null, obj);
});

passport.use(webStrategy);

app.get(LOGIN_URL, passport.authenticate(serviceManager.get('appid-web-strategy-name'), {
	forceLogin: true
}));

app.get(CALLBACK_URL, passport.authenticate(serviceManager.get('appid-web-strategy-name'), {allowAnonymousLogin: true}));

app.get("/login-web", passport.authenticate(serviceManager.get('appid-web-strategy-name'), {allowAnonymousLogin: true, successRedirect : '/protected-web', forceLogin: true}));


app.get('/protected-web', passport.authenticate(serviceManager.get('appid-web-strategy-name')), (req, res) => {
	let accessToken = req.session[serviceManager.get('appid-web-auth-context')].accessToken;
	if(!accessToken){
		res.status(500).send('accessToken is undefined');
	}
	
	let userAttributeManager = serviceManager.get('appid-user-attribute-manager');
	userAttributeManager.setAttribute(accessToken, "points", "1337")
		.then((attr) => {
			return userAttributeManager.getAllAttributes(accessToken);
		})
		.then((attr) => {
			res.status(200).json(attr);
		})
		.catch( (err) => {
			res.status(500).send(err);
		});
});