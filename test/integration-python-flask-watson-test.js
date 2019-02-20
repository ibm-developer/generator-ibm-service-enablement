'use strict';
const path = require('path');
const helpers = require('yeoman-test');
const spawn = require('child_process').spawn;
const execRun = require('child_process').exec;
const fs = require('fs-extra');
const axios = require('axios');

const PLATFORM = 'PYTHON';
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

describeIfCreds('Watson Services Python integration test', function () {
	let server = null;
	before(function (done) {
		this.timeout(TEN_SECONDS * 3);
		helpers.run(GENERATOR_PATH)
			.inTmpDir((tempDir) => {
				fs.copySync(path.join(__dirname, '/app/__init__watson_test.py'), path.join(tempDir, 'server/__init__.py'));
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
						execRun('pip install -r requirements.txt pip==19.0.2 Flask==0.11 --upgrade', {
							cmd: tmpDir
						}, (error) => {
							if (error) {
								return done(error);
							} else {
								server = spawn('python', ['-m', 'flask', 'run'], {
									cmd: tmpDir,
									env: {
										PATH: process.env.PATH,
										FLASK_RUN_PORT: 3000,
										FLASK_APP: 'server/__init__.py',
										LC_ALL: 'en_US.UTF-8',
										LANG: 'en_US.UTF-8'
									}
								});
								setTimeout(() => done(), 5000);
								server.stderr.on('data', function (err) {
									console.error(err.toString('utf-8'));
								});
								server.stdout.on('data', function (data) {
									console.log(data.toString('utf-8'));
								});
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
