const path = require('path');
const yassert = require('yeoman-assert');
const helpers = require('yeoman-test');
const Log4js = require('log4js');
const includes = require('lodash/includes');
const yml = require('js-yaml');
const logger = Log4js.getLogger("generator-ibm-service-enablement:app-generatorbase-test");
const fs = require('fs');
const optionsBluemix = Object.assign({}, require('./resources/bluemix.json'));

const APP_NAME = 'AcmeProject'.toLowerCase();
const GENERATOR_NODE_PATH = '../generators/language-node-express/index.js';

const RESOURCES_PATH = path.join(__dirname, './resources');
const DEPLOYMENT_FILE_PATH =  `/chart/${APP_NAME}/templates/deployment.yaml`;

let serviceNames = [];
let keyRefNames = [];
const scaffolderMapping = require('../generators/resources/scaffolderMapping.json');

const generatorFolderNames = fs.readdirSync(path.join(__dirname, '..', 'generators'));
generatorFolderNames.forEach(folder => {
	if(folder.startsWith('service-')){
		serviceNames.push(folder.replace(/-/g,'_'));
	}
});


const serviceKeys = Object.keys(scaffolderMapping);
serviceKeys.forEach(serviceKey => {
	let scaffolderKey = scaffolderMapping[serviceKey];
	let service = Array.isArray(optionsBluemix[scaffolderKey]) ? optionsBluemix[scaffolderKey][0] : optionsBluemix[scaffolderKey];
	if(service.hasOwnProperty('serviceInfo')){
		keyRefNames.push(`binding-${service.serviceInfo.name}`);
	}
});

describe('app-services-with-deployment', function () {
	this.timeout(10 * 1000); // 10 seconds, Travis might be slow

	let lang = 'NODE';
	let generatorPath = GENERATOR_NODE_PATH;
	
	describe(`app-services-with-deployment ${lang}`, () => {
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
			const generatedFilePath = path.join('.', DEPLOYMENT_FILE_PATH);
			yassert.file(generatedFilePath);

			const rawdeploymentyml = fs.readFileSync(generatedFilePath, 'utf-8');
			// escape double quotes and comment out helm conditionals so it can be parsed by js-yaml
			const newdeploymentyml = rawdeploymentyml.replace('"+" "_"', '\\"+\\" \\"_\\"')
				.replace('{{ if', '#').replace('{{ else', '#').replace('{{ end', '#');

			const deployment = yml.safeLoad(newdeploymentyml);
			const envs = deployment.spec.template.spec.containers[0].env;

			envs.forEach(env => {
				if(env.name === 'PORT') return;
				yassert.ok(env.name, 'env.name does not exist');
				yassert.ok(includes(serviceNames, env.name), `${env.name} is not a valid service within the following available services ${serviceNames.toString()}`);
				yassert.ok(env.valueFrom, 'env.valueFrom does not exist');
				yassert.ok(env.valueFrom.secretKeyRef, 'env.valueFrom.secretKeyRef does not exist');
				yassert.ok(env.valueFrom.secretKeyRef, 'env.valueFrom.secretKeyRef does not exist');
				yassert.ok(includes(keyRefNames, env.valueFrom.secretKeyRef.name),
					`${env.valueFrom.secretKeyRef.name} is not a valid secretKeyRef within the following test service secrets ${keyRefNames.toString()}`);
			});
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
			
			const generatedFilePath = path.join('.', `chart/${chartFolderName}/templates/deployment.yaml`);
			yassert.file(generatedFilePath);

			const rawdeploymentyml = fs.readFileSync(generatedFilePath, 'utf-8');
			// escape double quotes and comment out helm conditionals so it can be parsed by js-yaml
			const newdeploymentyml = rawdeploymentyml.replace('"+" "_"', '\\"+\\" \\"_\\"')
				.replace('{{ if', '#').replace('{{ else', '#').replace('{{ end', '#');
			const deployment = yml.safeLoad(newdeploymentyml);

			const envs = deployment.spec.template.spec.containers[0].env;
			
			envs.forEach(env => {
				if(env.name === 'PORT') return;
				yassert.ok(env.name, 'env.name does not exist');
				yassert.ok(includes(serviceNames, env.name), `${env.name} is not a valid service within the following available services ${serviceNames.toString()}`);
				yassert.ok(env.valueFrom, 'env.valueFrom does not exist');
				yassert.ok(env.valueFrom.secretKeyRef, 'env.valueFrom.secretKeyRef does not exist');
				yassert.ok(includes(keyRefNames, env.valueFrom.secretKeyRef.name),
					`${env.valueFrom.secretKeyRef} is not a valid secretKeyRef within the following test service secrets ${keyRefNames.toString()}`);
			});
		});
	});
});
