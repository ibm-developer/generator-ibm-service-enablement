const express = require('express');
const app = express();
require('./services/index')(app);
const serviceManager = require('./services/service-manager');

//const auth = serviceManager.get('appid-api-strategy-middleware');

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

// app.get('/appid-test', auth, (req, res) => {
// 	let messages = [];
//
// 	const appId = serviceManager.get('appid-api-strategy');
//
// 	if(!appId){
// 		res.status(500).send('appId is not defined in serviceManager');
// 		return;
// 	}
//
// 	// Get full appIdAuthorizationContext from request object
// 	let appIdAuthContext = req.appIdAuthorizationContext,
// 	appIdAuthContext.accessToken, // Raw access_token
// 	appIdAuthContext.accessTokenPayload, // Decoded access_token JSON
// 	appIdAuthContext.identityToken, // Raw identity_token
// 	appIdAuthContext.identityTokenPayload; // Decoded identity_token JSON
//
//         // Or use user object provided by passport.js
//         // var username = req.user.name || "Anonymous";
//         // res.send("Hello from protected resource " + username);
//
//
// });

const port = 3000;
app.listen(port, function(){
	console.info(`shin listening on http://localhost:${port}`);
	if(process.send){
		process.send('listening');
	}
});
