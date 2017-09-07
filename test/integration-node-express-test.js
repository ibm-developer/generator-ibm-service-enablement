const optionsBluemix = Object.assign({}, require('./resources/bluemix.int.json'));
const assert = require('chai').assert;
const path = require('path');
const helpers = require('yeoman-test');
const PLATFORM = 'NODE';
const GENERATOR_PATH = '../generators/app/index.js';
const fork = require('child_process').fork;
const execRun = require('child_process').exec;
const htmlparser = require('htmlparser');
let proxy;
let rawHTML = '';
let serverJs;
let server;

const fs = require('fs-extra');
const axios = require('axios');
const request = require('request-promise');

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
			this.timeout(10000);
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
			this.timeout(10000);
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

	describe('AppID', function() {
		it('should login anon to web strategy', function() {
			this.timeout(10000);
			var expectedMessage = {
				points : "1337"
			};

			let options = {
				'method': 'GET',
				'url': 'http://localhost:3000/login-web',
				'withCredentials': true,
				withCredentials: true,
				mode: 'no-cors'
			};
			axios.defaults.withCredentials = true;
			console.log('axios ' + JSON.stringify(axios.defaults));
			return axios(options)
				.then(function(response){
					assert.deepEqual(response.data, expectedMessage);
				})
				.catch(function(err){
					if (err.response) {
						assert.isNotOk(err.response.data, 'This should not happen');
					} else {
						assert.isNotOk(err.toString(), 'This should not happen');
					}
				})
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
				execRun('npm install', {cwd: tmpDir}, function (error, stdout) {
					if (error) {
						assert.isOk('Could not install dependencies ' + error);
					} else {
						console.log(stdout);
						execRun('npm install --save express express-session cors', {cmd: tmpDir}, function (error, stdout) {
							if (error) {
								assert.isOk('Could not install express, cors and express-session', error);
								cb();
							} else {
								console.info("tmpDir", tmpDir);
								console.info("install " + stdout);
								server = fork(tmpDir + '/server/server.js');
								server.on('message', function (msg) {
									if (msg === 'listening') {
										var http = require('http'),
									    httpProxy = require('http-proxy');
//
// Create your proxy server and set the target in the options.
//
										proxy = httpProxy.createProxyServer({target:'http://localhost:3000'}).listen(8000); // See (†)
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
	if(proxy){
		proxy.close();
	}
	fs.writeFileSync(path.join(__dirname, '/app/server.js'), serverJs);
	cb();
};

let _generateApplication = function (cb) {
	const serviceNames = ['cloudant', 'object-storage', 'appId'];
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



