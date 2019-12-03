const path = require('path');
const yassert = require('yeoman-assert');
const helpers = require('yeoman-test');

const Log4js = require('log4js');
const includes = require('lodash/includes');
const yml = require('js-yaml');
const logger = Log4js.getLogger("generator-ibm-service-enablement:app-generatorbase-test");
const fs = require('fs');
const exec = require('child_process').exec;

const optionsBluemix = Object.assign({}, require('./resources/bluemix.json'));

const APP_NAME = 'AcmeProject'.toLowerCase();
const GENERATOR_NODE_PATH = '../generators/language-node-express/index.js';

const RESOURCES_PATH = path.join(__dirname, './resources');

let serviceNames = [];
let keyRefNames = [];
const scaffolderMapping = require('../generators/resources/scaffolderMapping.json');

const generatorFolderNames = fs.readdirSync(path.join(__dirname, '..', 'generators'));
generatorFolderNames.forEach(folder => {
	if (folder.startsWith('service-')) {
		serviceNames.push(folder.replace(/-/g, '_'));
	}
});

const serviceKeys = Object.keys(scaffolderMapping);
serviceKeys.forEach(serviceKey => {
	let scaffolderKey = scaffolderMapping[serviceKey];
	let service = Array.isArray(optionsBluemix[scaffolderKey]) ? optionsBluemix[scaffolderKey][0] : optionsBluemix[scaffolderKey];
	if (service && service.hasOwnProperty('serviceInfo')) {
		keyRefNames.push(`binding-${service.serviceInfo.name.toLowerCase}`);
	}
});

let assertYmlContent = function (actual, expected, label) {
	yassert.strictEqual(actual, expected, 'Expected ' + label + ' to be ' + expected + ', found ' + actual);
}

function testServiceKeys(bindings) {
	let found = [];

	bindings.forEach(item => {

		// skip env entries that pre-exist 
		if (item.name.indexOf('MONGO_') === 0 ||
			item.name.indexOf('PORT') === 0 ||
			item.name.indexOf('APPLICATION_NAME') === 0) {
			return;
		}

		found.push(item.name);

		yassert.ok(item.name, 'name should exist: ' + JSON.stringify(item));
		yassert.ok(item.valueFrom, 'valueFrom should exist: ' + JSON.stringify(item));
		yassert.ok(item.valueFrom.secretKeyRef, 'valueFrom.secretKeyRef should exist: ' + JSON.stringify(item));
		yassert.ok(item.valueFrom.secretKeyRef.optional, 'valueFrom.secretKeyRef.optional should exist: ' + JSON.stringify(item));
		yassert.ok(includes(serviceNames, item.name), '${item.name} should exist within the following available services: ' + JSON.stringify(serviceNames));
		yassert.ok(includes(keyRefNames, item.valueFrom.secretKeyRef.name),
			'${item.valueFrom.secretKeyRef.name} should be a valid secretKeyRef within the following test service secrets: ' + JSON.stringify(keyRefNames));
	});
}

function createFiles(dir, name) {
	fs.mkdirSync(path.join(dir, `/chart`));
	fs.mkdirSync(path.join(dir, `/chart/${name}`));
	fs.mkdirSync(path.join(dir, `/chart/${name}/templates`));

	fs.createReadStream(path.join(RESOURCES_PATH, `deployment.yaml`)).pipe(fs.createWriteStream(path.join(dir, `/chart/${name}/templates/deployment.yaml`)));
	fs.createReadStream(path.join(RESOURCES_PATH, `values.yaml`)).pipe(fs.createWriteStream(path.join(dir, `/chart/${name}/values.yaml`)));
	fs.createReadStream(path.join(RESOURCES_PATH, `Chart.yaml`)).pipe(fs.createWriteStream(path.join(dir, `/chart/${name}/Chart.yaml`)));
	fs.createReadStream(path.join(RESOURCES_PATH, `deployment.yaml`)).pipe(fs.createWriteStream(path.join(dir, `/chart/${name}/templates/deployment.yaml`)));
	fs.createReadStream(path.join(RESOURCES_PATH, `service.yaml`)).pipe(fs.createWriteStream(path.join(dir, `/chart/${name}/templates/service.yaml`)));
}

function verifyHelmChart(chartLocation) {
	it(`appending services to ${chartLocation} env results in a valid helm chart`, (done) => {
		exec('helm', (error, stdout, stderr) => {
			if (error) {
				console.log(error);
				done(new Error(stderr))
			} else {
				exec('helm template ' + chartLocation + '/', { maxBuffer: 20 * 1024 * 1024 }, (error, stdout, stderr) => {
					if (error) {
						// console.log(error);
						done(new Error(stderr))
					} else {
						// Uncomment to view locally rendered helm charts
						// console.log(stdout);
						// template command will render two charts: service and Deployment
						let charts = yml.safeLoadAll(stdout);
						assertYmlContent(charts[1].kind, 'Deployment', 'charts[1].kind');
						testServiceKeys(charts[1].spec.template.spec.containers[0].env);
						done();
					}
				});
			}
		});
	});
}

describe('app-services-valid-helm', function () {
	this.timeout(10 * 1000); // 10 seconds, Travis might be slow

	let lang = 'NODE';
	let generatorPath = GENERATOR_NODE_PATH;

	describe(`app-services-valid-helm ${lang}`, () => {
		let context = {};
		before(() => {

			context.bluemix = JSON.parse(JSON.stringify(optionsBluemix));
			context.loggerLevel = logger.level;
			context.sanitizedAppName = context.bluemix.name.toLowerCase();

			context.bluemix.backendPlatform = lang;
			context.language = context.bluemix.backendPlatform.toLowerCase();

			return helpers
				.run(path.join(__dirname, generatorPath))
				.inTmpDir((dir) => {
					// `dir` is the path to the new temporary directory
					createFiles(dir, APP_NAME);
				})
				.withOptions({
					context: context
				})
				.then((tmpDir) => {
					console.info("tmpDir", tmpDir);
				});
		});

		verifyHelmChart(path.join('.', `chart/${APP_NAME}`));
	});

	describe(`app-services-valid-helm ${lang}, chart folder different from app name`, () => {
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
					createFiles(dir, chartFolderName);
				})
				.withOptions({
					context: context
				})
				.then((tmpDir) => {
					console.info("tmpDir", tmpDir);
				});
		});

		verifyHelmChart(path.join('.', `chart/${chartFolderName}`));
	});
});
