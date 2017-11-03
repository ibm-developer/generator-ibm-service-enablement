const path = require('path');
const yassert = require('yeoman-assert');
const assert = require('assert');
const helpers = require('yeoman-test');
const Log4js = require('log4js');
const logger = Log4js.getLogger("generator-ibm-service-enablement:app-generatorbase-test");
const fs = require('fs');
const optionsBluemix = Object.assign({}, require('./resources/bluemix.json'));

const APP_NAME = 'AcmeProject'.toLowerCase();
const GENERATOR_NODE_PATH = '../generators/language-node-express/index.js';

const RESOURCES_PATH = path.join(__dirname, './resources');
const DEPLOYMENT_FILE_PATH =  `/chart/${APP_NAME}/templates/deployment.yaml`;


describe('app-services-with-deployment', function () {
	this.timeout(10 * 1000); // 10 seconds, Travis might be slow

	let lang = 'NODE';
	let generatorPath = GENERATOR_NODE_PATH;

	describe(`app-services-with-deployment ${lang}`, () => {
		before(() => {
			let context = {};
			context.bluemix = JSON.parse(JSON.stringify(optionsBluemix));
			context.loggerLevel = logger.level;
			context.sanitizedAppName = context.bluemix.name.toLowerCase();

			context.bluemix.backendPlatform = lang;
			context.language = context.bluemix.backendPlatform.toLowerCase();

			return helpers
				.run(path.join(__dirname, generatorPath))
				.inTmpDir((dir) => {
					// `dir` is the path to the new temporary directory
					let deployFile = fs.readFileSync(path.join(RESOURCES_PATH, '/deployment.yaml'));
					fs.mkdirSync(path.join(dir, `/chart`));
					fs.mkdirSync(path.join(dir, `/chart/${APP_NAME}`));
					fs.mkdirSync(path.join(dir, `/chart/${APP_NAME}/templates`));
					fs.writeFileSync(path.join(dir, DEPLOYMENT_FILE_PATH), deployFile);
				})
				.withOptions({
					context: context
				})
				.then((tmpDir) => {
					console.info("tmpDir", tmpDir);
				});
		});

		it('appended env for each service to deployment.yaml', () => {
			let generatedFilePath = path.join('.', DEPLOYMENT_FILE_PATH);
			yassert.file(generatedFilePath);

			let expected = fs.readFileSync(path.join(RESOURCES_PATH, `/deployment-result-${lang.toLowerCase()}.yaml`), 'utf-8');
			let actual = fs.readFileSync(generatedFilePath, 'utf-8');

			assert.equal(actual, expected);
		});
	});

	describe(`app-services-with-deployment ${lang}, chart folder different from app name`, () => {
		const chartFolderName = 'mychart';
		before(() => {
			let context = {};
			context.bluemix = JSON.parse(JSON.stringify(optionsBluemix));
			context.loggerLevel = logger.level;
			context.sanitizedAppName = context.bluemix.name.toLowerCase();

			context.bluemix.backendPlatform = lang;
			context.language = context.bluemix.backendPlatform.toLowerCase();

			return helpers
				.run(path.join(__dirname, generatorPath))
				.inTmpDir((dir) => {
					// `dir` is the path to the new temporary directory
					let deployFile = fs.readFileSync(path.join(RESOURCES_PATH, '/deployment.yaml'));
					fs.mkdirSync(path.join(dir, `/chart`));
					fs.mkdirSync(path.join(dir, `/chart/${chartFolderName}`));
					fs.mkdirSync(path.join(dir, `/chart/${chartFolderName}/templates`));
					fs.writeFileSync(path.join(dir, `/chart/${chartFolderName}/templates/deployment.yaml`), deployFile);
				})
				.withOptions({
					context: context
				})
				.then((tmpDir) => {
					console.info("tmpDir", tmpDir);
				});
		});

		it('appended env for each service to deployment.yaml', () => {
			let generatedFilePath = path.join('.', `chart/${chartFolderName}/templates/deployment.yaml`);
			yassert.file(generatedFilePath);

			let expected = fs.readFileSync(path.join(RESOURCES_PATH, `/deployment-result-${lang.toLowerCase()}.yaml`), 'utf-8');
			let actual = fs.readFileSync(generatedFilePath, 'utf-8');

			assert.equal(actual, expected);
		});
	});
});
