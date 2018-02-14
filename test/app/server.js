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

/* eslint-disable */
app.get('/cloudant-test', (req, res) => {
	let messages = [];

	const cloudant = serviceManager.get('cloudant');

	if(!cloudant){
		res.status(500).send('cloudant is not defined in serviceManager');
		return;
	}

	cloudant.db.destroy('test', (err) => {
		if(err && err.statusCode !== 404){
			res.status(500).send(err.message);
		} else {
			messages.push('test destroyed');
			cloudant.db.create('test', (err) => {
				if(err){
					res.status(500).send(err.message);
				} else {
					messages.push('test created');
					const test = cloudant.db.use('test');
					test.insert({shinobi: true}, 'ninpocho', (err) => {
						if(err){
							res.status(500).send(err.message);
						} else {
							messages.push('ninpocho was added');
							res.status(202).json(messages);
						}
					});

				}
			});

		}
	});
});
	/* eslint-disable */
app.get('/objectstorage-test', (req, res) => {
	let messages = [];

	const objectStorage = serviceManager.get('object-storage');
	messages.push('test container was created');
	objectStorage.getContainer('test')
		.then((container) => {
			container.createObject('ninpocho', 'shin')
				.then(() => {
					messages.push('ninpocho object was added');
					res.status(200).json(messages);
				})
				.catch((err) => {
					res.status(500).json(err);
				})
		})
		.catch((err) => {
			if(err.name === 'ResourceNotFoundError'){
				objectStorage.createContainer('test')
					.then((container) => {
						container.createObject('ninpocho', 'shin')
							.then(() => {
								messages.push('ninpocho object was added');
								res.status(200).json(messages);
							})
							.catch((err) => {
								res.status(500).json(err);
							})
					})

			} else {
				res.status(500).json(err);
			}
		});
});


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

let webStrategy = serviceManager.get('auth-web-strategy');

passport.serializeUser(function(user, cb) {
	cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
	cb(null, obj);
});

passport.use(webStrategy);

app.get(LOGIN_URL, passport.authenticate(serviceManager.get('auth-web-strategy-name'), {
	forceLogin: true
}));

app.get(CALLBACK_URL, passport.authenticate(serviceManager.get('auth-web-strategy-name'), {allowAnonymousLogin: true}));

app.get("/login-web", passport.authenticate(serviceManager.get('auth-web-strategy-name'), {allowAnonymousLogin: true, successRedirect : '/protected-web', forceLogin: true}));


app.get('/protected-web', passport.authenticate(serviceManager.get('auth-web-strategy-name')), (req, res) => {
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
	/* eslint-disable */
app.get('/push-test', (req, res) => {
  const push = serviceManager.get('push-notifications');
  const Notification = serviceManager.get('notifications-module');
  const MessageBuilder = serviceManager.get('message-builder-module');

  if(!Notification){
    res.status(500).send('Notification is not defined in serviceManager');
    return;
  }
  const message = MessageBuilder.Message.alert("Testing BluemixPushNotifications").build();
  const notification = Notification.message(message).build();

  push.send(notification, (err, resp, body) => {
    if(err) {
      res.status(500).json(err);
    } else {
      res.send(body);
    }
  });
});
	/* eslint-disable */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const TestModel = mongoose.model('Test',  new Schema({message: 'String'}));

app.get('/mongodb-test', (req, res) => {
	let messages = [];

	TestModel.find({message: 'test'}, function (err, doc) {
		if (err) {
			res.status(400).send(err);
		} else if (!err && !doc) {
			const test = new TestModel({
				message: 'test'
			});
			test.save(function (err) {
				if (err) {
					res.status(400).send(err);
				} else {
					messages.push('test document added');
				}
			})
		} else {
			TestModel.remove({message: 'test'}, function (err, doc) {
				if (err) {
					res.status(400).send(err);
				} else {
					messages.push('test document removed');
					const test = new TestModel({
						message: 'test'
					});
					test.save(function (err) {
						if (err) {
							res.status(400).send(err);
						} else {
							messages.push('test document added');
							TestModel.find({message: 'test'}, function (err, doc) {
								if (err) {
									res.status(400).send(err);
								} else {
									messages.push('test document found');
									res.status(200).send(messages)
								}
							});

						}
					});
				}
			});
		}
	});
});
	/* eslint-disable */
app.get('/alert-notification-test', function(req, res){
	let messages = [];

	const alertnotification = serviceManager.get('alert-notification');


	if(!alertnotification){
		res.status(500).send('alertnotification is not defined in serviceManager');
		return;
	}

	const alert = {
			What: 'Torre Celeste has been attacked!',
			Where: 'ninpocho.com',
			Severity: 'Critical'  // Critical = 5
	};

	const options = {
		method: 'post',
		url: alertnotification.url,
		auth : {
			username: alertnotification.username,
			password: alertnotification.password
		},
		headers: {
			'Content-Type': 'application/json'
		},
		data: alert
	};
	axios(options)
		.then(function(response){
			if(response.status !== 200){
				res.status(400).send(res.statusText);
			} else {
				messages.push('alert sent');
				res.status(200).send(messages);
			}
		})
		.catch(function(err){
			res.status(400).send(err);
		});
});
	/* eslint-disable */
app.get('/watson-conversation-test', function (req, res) {
	let messages = [];

	/* workspace_id is not a supplied credential from service_manager,
	 * as each conversation service can have several workspaces.
	 * thus exposing the credential, while not ideal, in this case is okay
	 */

	var workspace_id = '7fa12afa-a4b0-4646-8510-deda95f4a640';
	var conversation = serviceManager.get('watson-conversation');

	if (!conversation) {
		res.status(500).send('watson-conversation is not defined in serviceManager');
		return;
	}

	messages.push("received response for conversation");

	conversation.message({
		workspace_id: workspace_id,
		input: { 'text': 'Hello' }
	}, function (err, response) {
		if (err) {
			res.status(400).json(err);
		}
		else if (response.output.text) {
			res.status(202).json(messages);
		}
		else {
			res.status(400).json('Error processing response')
		}
	});
});



	/* eslint-disable */
app.get('/redis-test', function (req, res) {

	let messages = [];
	let key = "test-key";
	let val = "test-val";

	var redis = serviceManager.get('redis');

	if (!redis) {
		res.status(500).send('redis is not defined in serviceManager');
		return;
	}

	redis.set(key, val);

	messages.push("set data");

	redis.get(key, function (err, response) {
		if (err) {
			res.status(400).json(err);
		}
		else {
			if (response == val) {
				messages.push("got data");
				res.status(202).json(messages);
			}
			else {
				res.status(400).send('error processing data');
			}
		}
	})
});



	/* eslint-disable */
app.get('/postgre-test', function (req, res) {

    let messages = [];
    var pair = [1, "two"];

    var client = serviceManager.get('postgre-client');

    if (!client) {
        res.status(500).send('postgre-client is not defined in serviceManager');
        return;
    }

    client.query('CREATE TABLE IF NOT EXISTS "sch.test" (num integer NOT NULL, data varchar(256) NOT NULL);', function (err, result) {

        if (err) {
            res.status(400).send(err);
            return;
        }

        client.query('INSERT INTO "sch.test" (num, data) VALUES ($1, $2)', [pair[0], pair[1]], function (err, result) {
            if (err) {
                res.status(400).send(err);
                return;
            }
        });
        client.query('SELECT * FROM "sch.test";', function (err, result) {
            if (err) {
                res.status(400).send(err);
            } else {
                
                if (result.rows[0].num == pair[0] && result.rows[0].data == pair[1]) {
                    messages.push('created and fetched data')
                    client.query('DROP TABLE IF EXISTS "sch.test";');
                    res.status(202).json(messages);
                }
                else {
                    res.status(400).send('error processing data');
                }
            }
        });
    });
});

	

const port = 3000;
app.listen(port, function(){
	console.info(`Hayata Shin listening on http://localhost:${port}`);
	if(process.send){
		process.send('listening');
	}
});
