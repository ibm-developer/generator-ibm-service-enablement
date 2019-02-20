'use strict';
const path = require('path');
const helpers = require('yeoman-test');
const fork = require('child_process').fork;
const execRun = require('child_process').exec;
const fs = require('fs-extra');
const axios = require('axios');

const PLATFORM = 'NODE';
const TEN_SECONDS = 10000;
const GENERATOR_PATH = path.join(__dirname, '../generators/app/index.js');
const CREDENTIALS_PATH = path.join(__dirname, 'resources/bluemix-watson-iam.int.json');
const SERVICES = [
	'conversation',
	'visual-recognition',
	'discovery',
	'language-translator',
	'natural-language-classifier',
	'natural-language-understanding',
	'personality-insights',
	'speech-to-text',
	'text-to-speech',
	'tone-analyzer',
];

let optionsBluemix = {};
let describeIfCreds = describe.skip;
if (fs.pathExistsSync(CREDENTIALS_PATH)) {
	optionsBluemix = require(CREDENTIALS_PATH);
	describeIfCreds = describe;
} else {
	console.log(`Watson credential file not found: ${CREDENTIALS_PATH}`);
}

describeIfCreds('Watson Services Node.js integration test', function () {
	let server = null;
	before(function (done) {
		this.timeout(TEN_SECONDS * 3);
		helpers.run(GENERATOR_PATH)
			.inTmpDir((tempDir) => {
				fs.copySync(path.join(__dirname, '/app/watson-server-test.js'), path.join(tempDir, 'server/server.js'));
				console.log(`Integration test temp Dir: ${tempDir}`);
			})
			.withOptions({
				bluemix: JSON.stringify(Object.assign(optionsBluemix, {
					backendPlatform: PLATFORM
				})),
			})
			.then((tmpDir) => {
				execRun('npm install', {
					cwd: tmpDir
				}, (error) => {
					if (error) {
						return done(error);
					} else {
						execRun('npm install --save express', {
							cmd: tmpDir
						}, (error) => {
							if (error) {
								return done(error);
							} else {
								server = fork(path.join(tmpDir, 'server/server.js'));
								server.on('message', (msg) => {
									if (msg === 'listening') {
										done()
									}
								});
								server.on('error', done);
							}
						});
					}
				});
			});
	});

	after(() => {
		if (server) {
			server.kill();
		}
	});

	describe('Should test each Watson service', function () {
		SERVICES.forEach((name) => {
			it(`${name} should return HTTP 200`, function (done) {
				this.timeout(TEN_SECONDS);
				axios.get(`http://localhost:3000/${name}`)
					.then((response) => {
						if (response.status !== 200) {
							throw new Error(response.data);
						}
						done();
					})
					.catch(done);
			})
		})
	});
});
