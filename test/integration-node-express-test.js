'use strict';
const optionsBluemix = Object.assign({}, require('./resources/bluemix.int.json'));
const assert = require('chai').assert;
const path = require('path');
const helpers = require('yeoman-test');
const PLATFORM = 'NODE';
const GENERATOR_PATH = '../generators/app/index.js';
const fork = require('child_process').fork;
const execRun = require('child_process').exec;
const request = require('request');

let serverJs;
let server;

const fs = require('fs-extra');
const axios = require('axios');

describe('integration test for services', function () {
	before(function (done) {
		this.timeout(25000);
		_setUpApplication(done);
	});

	after(function (done) {
		_destroyApplication(done);
	});
	describe('Cloudant', function () {
		it('should create a database `test` and add data', function () {
			this.timeout(12000);
			let expectedMessages = [
				'test destroyed',
				'test created',
				'ninpocho was added'
			];
			let options = {
				'method': 'get',
				'url': 'http://localhost:3000/cloudant-test'
			};
			return axios(options)
				.then(function (response) {
					assert.deepEqual(response.data, expectedMessages);
				})
				.catch(function (err) {
					if (err.response) {
						assert.isNotOk(err.response.data, 'This should not happen');
					} else {
						assert.isNotOk(err, 'This should not happen');
					}

				});
		});
	});

	describe('ObjectStorage', function () {
		it('should create a container `test` and write content', function () {
			this.timeout(30000);
			let expectedMessages = [
				'test container was created',
				'ninpocho object was added'
			];

			let options = {
				'method': 'get',
				'url': 'http://localhost:3000/objectstorage-test'
			};

			return axios(options)
				.then(function (response) {
					assert.deepEqual(response.data, expectedMessages);
				})
				.catch(function (err) {
					if (err.response) {
						assert.isNotOk(err.response.data, 'This should not happen');
					} else {
						assert.isNotOk(JSON.stringify(err), 'This should not happen');
					}

				});
		});
	});

	describe('Push', function () {
		it('should create a push notification', function () {
			this.timeout(30000);
			let expectedMessages = {
				alert: 'Testing BluemixPushNotifications'
			};


			let options = {
				'method': 'get',
				'url': 'http://localhost:3000/push-test'
			};

			return axios(options)
				.then(function (response) {
					assert.deepEqual(response.data.message, expectedMessages);
				})
				.catch(function (err) {
					if (err.response) {
						assert.isNotOk(err.response.data, 'This should not happen');
					} else {
						assert.isNotOk(JSON.stringify(err), 'This should not happen');
					}

				});
		});
	});
	describe('AppID', function () {
		it('should login anon to web strategy', function (done) {
			this.timeout(12000);
			let expectedMessage = {
				points: "1337"
			};

			let options = {
				method: 'GET',
				uri: 'http://localhost:3000/login-web',
				followRedirect: false //handle redirects manually
			};
			let j = request.jar();
			let cookie;
			request(options, function (error, response) {
				if (error) {
					assert.isNotOk(error, 'This should not happen - login web');
					done();

				} else {
					//redirect to authorization
					options.method = 'GET';
					options.uri = response.headers.location;
					cookie = request.cookie(response.headers['set-cookie'][0]);
					j.setCookie(cookie, options.uri);
					options.jar = j;
					request(options, function (error, response) {
						if (error) {
							assert.isNotOk(error.toString(), 'This should not happen - authorization');
							done();
						} else {
							//redirect to callback
							options.method = 'GET';
							options.uri = response.headers.location;
							options.headers = response.request.headers;
							request(options, function (error, response) {
								if (error) {
									assert.isNotOk(error.toString(), 'This should not happen - callback');
									done();
								} else {
									//redirect to protected resource
									options.method = 'GET';
									options.uri = response.headers.location.indexOf('http') > -1 ? response.headers.location : 'http://localhost:3000' + response.headers.location;
									options.headers = response.request.headers;
									request(options, function (error, response) {
										if (error) {
											assert.isNotOk(error.toString(), 'This should not happen - protected-web');
											done();
										} else {
											assert.deepEqual(JSON.parse(response.body), expectedMessage);
											done();
										}
									});
								}

							});
						}
					});
				}

			});
		});
	});

	describe('MongoDB', function () {
		it('should create a collection `test` and write and fetch data from it', function () {
			this.timeout(10000);
			let expectedMessage = [
				'test document removed',
				'test document added',
				'test document found'
			];
			let options = {
				'method': 'get',
				'url': 'http://localhost:3000/mongodb-test'
			};

			return axios(options)
				.then(function (response) {
					assert.deepEqual(response.data, expectedMessage);
				})
				.catch(function (err) {
					if (err.response) {
						assert.isNotOk(err.response.data, 'This should not happen');
					} else {
						console.log('ERR ' + err.toString());
						assert.isNotOk(err, 'This should not happen');
					}
				});
		});
	});

	describe('Alert-Notification', function () {
		it('should send a sample alert', function () {
			this.timeout(30000);
			let expectedMessages = [
				'alert sent'
			];

			let options = {
				'method': 'get',
				'url': 'http://localhost:3000/alert-notification-test'
			};

			return axios(options)
				.then(function (response) {
					assert.deepEqual(response.data, expectedMessages);
				})
				.catch(function (err) {
					if (err.response) {
						assert.isNotOk(err.response.data, 'This should not happen');
					} else {
						assert.isNotOk(JSON.stringify(err), 'This should not happen');
					}

				});
		});
	});

	describe('Watson-Conversation', function () {
		it('should be able to send input and receive a response', function () {
			this.timeout(30000);

			let expectedMessage = ['received response for conversation'];
			let options = {
				'method': 'get',
				'url': 'http://localhost:3000/watson-conversation-test'
			};
			return axios(options)
				.then(function (response) {
					assert.deepEqual(response.data, expectedMessage);
				})
				.catch(function (err) {
					if (err.response) {
						assert.isNotOk(err.response.data, 'This should not happen');
					} else {
						console.log('ERR ' + err.toString());
						assert.isNotOk(err, 'This should not happen');
					}
				});
		});
	});

	describe('Redis', function () {
		it('should be able to set and get data', function () {
			this.timeout(30000);
			let expectedMessage = ['set data', 'got data'];
			let options = {
				'method': 'get',
				'url': 'http://localhost:3000/redis-test'
			};

			return axios(options)
				.then(function (response) {
					assert.deepEqual(response.data, expectedMessage);
				})
				.catch(function (err) {
					if (err.response) {
						assert.isNotOk(err.response.data, 'This should not happen');
					} else {
						console.log('ERR ' + err.toString());
						assert.isNotOk(err, 'This should not happen');
					}
				});
		});
	});

	describe('Postgre', function () {
		it('should be able to set and get data', function () {
			this.timeout(30000);
			let expectedMessage = ['created and fetched data'];
			let options = {
				'method': 'get',
				'url': 'http://localhost:3000/postgre-test'
			};

			return axios(options)
				.then(function (response) {
					assert.deepEqual(response.data, expectedMessage);
				})
				.catch(function (err) {
					if (err.response) {
						assert.isNotOk(err.response.data, 'This should not happen');
					} else {
						assert.isNotOk(err, 'This should not happen');
					}
				});
		});
	});

});

let _setUpApplication = function (cb) {
	optionsBluemix.backendPlatform = PLATFORM;
	_generateApplication(function () {
		helpers
			.run(path.join(__dirname, GENERATOR_PATH))
			.inTmpDir(function (dir) {
				console.log('dir ' + dir);
				fs.copySync(path.join(__dirname, '/app/server.js'), dir + '/server/server.js');
			})
			.withOptions({
				bluemix: JSON.stringify(optionsBluemix)
			})
			.then((tmpDir) => {
				execRun('npm install', {cwd: tmpDir}, function (error, stdout, stderr) {
					console.log(stderr)
					if (error) {
						assert.isOk('Could not install dependencies ' + error);
					} else {
						console.log(stdout);
						execRun('npm install --save express express-session axios body-parser', {cmd: tmpDir}, function (error, stdout) {
							if (error) {
								assert.isOk('Could not install express, body-parser, axios and express-session', error);
								cb();
							} else {
								console.info("tmpDir", tmpDir);
								console.info("install " + stdout);
								server = fork(tmpDir + '/server/server.js');
								server.on('message', function (msg) {
									if (msg === 'listening') {
										cb()
									}

								});
							}
						});
					}
				});
			});
	});
};

let _destroyApplication = function (cb) {
	if (server) {
		server.kill();
	}
	fs.writeFileSync(path.join(__dirname, '/app/server.js'), serverJs);
	cb();
};

let _generateApplication = function (cb) {
	const serviceNames = ['cloudant', 'object-storage', 'appId', 'push', 'mongodb', 'alertnotification', 'watson-conversation', 'redis', 'postgre'];
	const REPLACE_CODE_HERE = '// GENERATE HERE';
	let snippetJS;

	serverJs = fs.readFileSync(path.join(__dirname, '/app/server.js'), 'utf-8');
	let copyServerJs = serverJs;


	serviceNames.forEach(function (serviceName) {
		snippetJS = fs.readFileSync(path.join(__dirname, '/app/' + serviceName + '/' + PLATFORM.toLowerCase() + '/server.js'), 'utf-8');
		snippetJS += ('\n\t' + REPLACE_CODE_HERE);
		copyServerJs = copyServerJs.replace(REPLACE_CODE_HERE, snippetJS);
	});

	copyServerJs = copyServerJs.replace(REPLACE_CODE_HERE, "");

	fs.writeFileSync(path.join(__dirname, '/app/server.js'), copyServerJs);
	cb()
};



