/* eslint-disable */
const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const CALLBACK_URL = "/ibm/bluemix/appid/callback";
const axios = require('axios');
const bodyParser = require('body-parser');

var serviceManager = require('./services/service-manager');
serviceManager.set('appid-redirect-uri', 'http://localhost:3000' + CALLBACK_URL);
require('./services/index')(app);

// GENERATE HERE

app.get('/push-test', (req, res) => {
	const push = serviceManager.get('push-notifications');
	const Notification = serviceManager.get('notifications-module');

	if(!Notification){
		res.status(500).send('Notification is not defined in serviceManager');
		return;
	}
	const notification = new Notification("Testing BluemixPushNotifications");

	push.send(notification, (err, resp, body) => {
		if(err) {
			res.status(500).json(err);
		} else {
			res.send(body);
		}
	});
});

const port = 3000;
app.listen(port, function(){
	console.info(`Hayata Shin listening on http://localhost:${port}`);
	if(process.send){
		process.send('listening');
	}
});