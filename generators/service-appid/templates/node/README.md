# AppID / Auth
 
 
 AppID / Auth is an authentication and profiles service that makes it easy for developers to add authentication to their mobile and web apps, and secure access to cloud native apps and services on IBM Cloud. It also helps manage end-user data that developers can use to build personalized app experiences.
##  Credentials

###  LocalDevConfig

This is where your local configuration is stored for AppID.
```
{
  "appid_tenantId": "{{tenantId}}", // tenant ID
  "appid_clientId": "{{clientId}}", // client ID
  "appid_secret": "{{secret}}", // secret
  "appid_oauthServerUrl": "{{oauthServerUrl}}", // Oauth Server Url
  "appid_profilesUrl": "{{profilesUrl}}" // Profile URL
}
```

## Usages

```javascript
    var session = require('express-session');
    var serviceManager = require('./services/service-manager');
    /**
        Note: You will need to see the appid-redirect-ui property prior to requring the service module.
        This will ensure that your redirect url will be correct prior to initalizing the AppID SDK.
		If it is not set 'http://localhost:$PORT/ibm/bluemix/appid/callback will be used. $PORT is the 
		environment variable set but if is is not set the port used will be 3000.
    */
    serviceManager.set('auth-redirect-uri', 'http://localhost:3000' + CALLBACK_URL);
   
    require('./services/index')(app);
    
    const CALLBACK_URL = "/ibm/bluemix/appid/callback";
    const LOGIN_URL = "/ibm/bluemix/appid/login";

    // Setup express application to use express-session middleware. Must be configured with proper session 
    // storage for production environments. See https://github.com/expressjs/session for additional
    // documentation
    app.use(session({
        secret: "******",
        resave: false,
        saveUninitialized: true,
	    cookie: {
		    httpOnly: false,
		    secure: false,
		    maxAge : (4 * 60 * 60 * 1000)
    	}
    }));

    // Initialize passport and session
    app.use(passport.initialize());
    app.use(passport.session());

    let webStrategy = serviceManager.get('auth-web-strategy');
    
    //To get apiStrategy
    let apiStrategy = serviceManager.get('auth-api-strategy');


    // Configure passportjs with user serialization/deserialization. This is required
    // for authenticated session persistence accross HTTP requests. See passportjs docs
    // for additional information http://passportjs.org/docs
    passport.serializeUser(function(user, cb) {
	    cb(null, user);
    });

    passport.deserializeUser(function(obj, cb) {    
	    cb(null, obj);
    });

    passport.use(webStrategy);
    
    //passport.use(apiStrategy);

    app.get(LOGIN_URL, passport.authenticate(serviceManager.get('auth-web-strategy-name'), {
	    forceLogin: true
    }));

    app.get(CALLBACK_URL, passport.authenticate(serviceManager.get('auth-web-strategy-name'), 
        {allowAnonymousLogin: true}));

    app.get("/login-web", passport.authenticate(serviceManager.get('auth-web-strategy-name'), 
        {allowAnonymousLogin: true, successRedirect : '/protected-web', forceLogin: true}));


    app.get('/protected-web', passport.authenticate(serviceManager.get('auth-web-strategy-name')),
        (req, res) => {
	        let accessToken = req.session[serviceManager.get('auth-web-auth-context')].accessToken;
	        if(!accessToken){
		        res.status(500).send('accessToken is undefined');
	        }
	
	        let userAttributeManager = serviceManager.get('auth-user-attribute-manager');
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
    
    
  // Declare the API you want to protect
  app.get("/api/protected",
 
    passport.authenticate(serviceManager.get('auth-api-strategy-name'), {
        session: false
    }),
    function(req, res) {
        // Get full appIdAuthorizationContext from request object
        var appIdAuthContext = req.appIdAuthorizationContext;
 
        appIdAuthContext.accessToken; // Raw access_token
        appIdAuthContext.accessTokenPayload; // Decoded access_token JSON
        appIdAuthContext.identityToken; // Raw identity_token
        appIdAuthContext.identityTokenPayload; // Decoded identity_token JSON
 
        // Or use user object provided by passport.js
        var username = req.user.name || "Anonymous";
        res.send("Hello from protected resource " + username);
    }
);
 
    
```

## Documentation

Other related documentation can be found [here](https://www.npmjs.com/package/bluemix-appid)
