/* eslint-disable */
const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const CALLBACK_URL = "/ibm/bluemix/appid/callback";
const axios = require('axios');
const bodyParser = require('body-parser');

var serviceManager = require('./services/service-manager');
serviceManager.set('auth-redirect-uri', 'http://localhost:3000' + CALLBACK_URL);
require('./services/index')(app);

// GENERATE HERE

const port = 3000;
app.listen(port, function(){
	console.info(`Hayata Shin listening on http://localhost:${port}`);
	if(process.send){
		process.send('listening');
	}
});