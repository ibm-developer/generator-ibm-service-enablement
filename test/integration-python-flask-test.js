const optionsBluemix = Object.assign({}, require('./resources/bluemix.int.json'));
const assert = require('chai').assert;
const path = require('path');
const helpers = require('yeoman-test');
const PLATFORM = 'PYTHON';
const GENERATOR_PATH = '../generators/app/index.js';
const execRun = require('child_process').exec;
const spawn = require('child_process').spawn;
let server;

const fs = require('fs-extra');
const axios = require('axios');

describe('integration test for services', function() {
	describe('Cloudant', function() {
		before(function(done) {
			this.timeout(15000);
			_setUpApplication(done);
		});

		after(function(done){
			_destroyApplication(done);
		});

		it('should create a database `test` and add data', function() {
			this.timeout(5000);
			let expectedMessages = [
				'test destroyed',
				'test created',
				'document added'
			];
			let options = {
				'method': 'get',
				'url': 'http://localhost:5000/cloudant-test'
			};
			return axios(options)
				.then(function(response) {
					assert.deepEqual(response.data, expectedMessages);
				})
				.catch(function(err){
					console.log(err);
					if(err.response){
						assert.isNotOk(err.response.data, 'This should not happen');
					} else {
						assert.isNotOk(err, 'This should not happen');
					}
				});
		});
	});
	/*
	describe('ObjectStorage', function() {
		it('should create a container `test` and write content', function() {
			this.timeout(5000);
			var expectedMessages = [
				'test container was created',
				'ninpocho object was added'
			];

			var options = {
				'method': 'get',
				'url': 'http://localhost:5000/objectstorage-test'
			};

			return axios(options)
				.then(function(response) {
					assert.deepEqual(response.data, expectedMessages);
				})
				.catch(function(err){
					if(err.response){
						assert.isNotOk(err.response.data, 'This should not happen');
					} else {
						assert.isNotOk(err, 'This should not happen');
					}

				});
		});
	});
	*/
});

let _setUpApplication = function(cb){
	optionsBluemix.backendPlatform = PLATFORM;
	helpers
		.run(path.join(__dirname, GENERATOR_PATH))
		.inTmpDir(function (dir) {
			console.log('file ' + dir);
			fs.copySync(path.join(__dirname, '/app/__init__.py'), dir + '/server/__init__.py');
		})
		.withOptions({
			bluemix: JSON.stringify(optionsBluemix)
		})
		.then((tmpDir) => {
			execRun('pip install -r requirements.txt', {cwd: tmpDir}, function(error, stdout){
				if(error){
					assert.isOk('Could not install dependencies ' + error);
				} else {
					console.log(stdout);
					server = spawn('flask', ['run'], {cmd: tmpDir, env: {PATH: process.env.PATH,
						'FLASK_APP': 'server/__init__.py'}});
					setTimeout(function(){
						cb();
					},3000);
					server.stderr.on('data', function(err) {
						console.error(err.toString('utf-8'));
						//assert.isNotOk(err.toString('utf-8'), 'This should not happen');
					});
					server.stdout.on('data', function(data){
						console.log(data.toString('utf-8'));
					});
				}
			});

		});
};


let _destroyApplication = function(cb){
	if(server){
		server.kill();
	}
	cb();
};



