'use strict';
const path = require('path');
const yassert = require('yeoman-assert');
const intersection = require('lodash/intersection');
const helpers = require('yeoman-test');
const fs = require('fs');
const optionsBluemix = Object.assign({}, require('./resources/bluemix.json'));

const GENERATOR_PATH = '../generators/app/index.js';
const NODE_SERVER_MAPPINGS_JSON = 'server/config/mappings.json';
const NODE_SERVER_LOCALDEV_CONFIG_JSON = 'server/localdev-config.json';
const SWIFT_SERVER_MAPPINGS_JSON = 'config/mappings.json';
const SWIFT_SERVER_LOCALDEV_CONFIG_JSON = 'config/localdev-config.json';

describe('mappings', function() {
	const mappingDir = path.join(__dirname, 'resources', 'mapping');
	const serviceLabels = fs.readdirSync(mappingDir);
	let testDir = '';
	describe('V1 - node', function () {
		this.timeout(10 * 1000); // 10 seconds, Travis might be slow
		const lang = 'node';

		before(() => {
			optionsBluemix.backendPlatform = "NODE";
			return helpers
				.run(path.join(__dirname, GENERATOR_PATH))
				.inTmpDir()
				.withOptions({
					bluemix: JSON.stringify(optionsBluemix)
				})
				.then((tmpDir) => {
					console.info("tmpDir", tmpDir);
					testDir = tmpDir;
				});
		});
	
		it('Can run successful generated mappings.json', () => {
			yassert.file(NODE_SERVER_MAPPINGS_JSON);
			yassert.file(NODE_SERVER_LOCALDEV_CONFIG_JSON);
		});

		let expectedServiceMapping = '';
		let actualServiceMapping = '';
		let serviceKeys = [];
		const SEARCH_PATTERN = 'searchPatterns';
		serviceLabels.forEach(serviceLabel=> {
			const hasServices = fs.existsSync(path.join(__dirname, '..', 'generators', `service-${serviceLabel}`, 'templates', lang));
			if(hasServices){
				it(`Generated ${serviceLabel} mapping.json matches with standalone mapping.json`, () => {
					expectedServiceMapping =  JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'test', 'resources', 'mapping', serviceLabel, 'mappings.json'), 'utf-8'));
					actualServiceMapping = JSON.parse(fs.readFileSync(path.join(testDir, 'server', 'config', 'mappings.json'), 'utf-8'));
					serviceKeys = Object.keys(expectedServiceMapping);
					serviceKeys.forEach(serviceKey => {
						yassert.ok(actualServiceMapping[serviceKey], `${serviceKey} is not a valid service key in mapping.json`);
						yassert.ok(actualServiceMapping[serviceKey][SEARCH_PATTERN], `search patterns do not exist for ${serviceKey}`);
						yassert.equal(intersection(actualServiceMapping[serviceKey][SEARCH_PATTERN], expectedServiceMapping[serviceKey][SEARCH_PATTERN]).length, 4, `${serviceKey} 
						contains ${JSON.stringify(actualServiceMapping[serviceKey][SEARCH_PATTERN], null, 2)} but expected ${JSON.stringify(expectedServiceMapping[serviceKey][SEARCH_PATTERN], null, 2)}`);
					});
				});
			}
		});
	});
	describe('V1 - swift', function () {
		this.timeout(10 * 1000); // 10 seconds, Travis might be slow
		const lang = 'swift';
		const codeForServices = [];
		const dependencies = [];
		const modules = [];

		before(() => {
			optionsBluemix.backendPlatform = 'SWIFT';
			return helpers
				.run(path.join(__dirname, GENERATOR_PATH))
				.inTmpDir()
				.withOptions({
					bluemix: JSON.stringify(optionsBluemix),
					parentContext: {
						injectIntoApplication: function(options) {
							codeForServices.push(options.service);
						},
						injectDependency: function(dependency) {
							dependencies.push(dependency);
						},
						injectModules: function(module) {
							modules.push(module);
						}
					}
				})
				.then((tmpDir) => {
					console.info("tmpDir", tmpDir);
					testDir = tmpDir;
				});
		});
	
		it('Can run successful generated mappings.json', () => {
			yassert.file(SWIFT_SERVER_MAPPINGS_JSON);
			yassert.file(SWIFT_SERVER_LOCALDEV_CONFIG_JSON);
		});

		let expectedServiceMapping = '';
		let actualServiceMapping = '';
		let serviceKeys = [];
		const SEARCH_PATTERN = 'searchPatterns';
		const CREDENTIALS = 'credentials';
		serviceLabels.forEach(serviceLabel=> {
			const hasServices = fs.existsSync(path.join(__dirname, '..', 'generators', `service-${serviceLabel}`, 'templates', lang));
			if(hasServices){
				it(`Generated ${serviceLabel} mapping.json matches with standalone mapping.json`, () => {
					expectedServiceMapping =  JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'test', 'resources', 'mapping', serviceLabel, `mappings.${lang}.json`), 'utf-8'));
					actualServiceMapping = JSON.parse(fs.readFileSync(path.join(testDir, 'config', 'mappings.json'), 'utf-8'));
					serviceKeys = Object.keys(expectedServiceMapping);
					serviceKeys.forEach(serviceKey => {
						yassert.ok(actualServiceMapping[serviceLabel], `${serviceLabel} is not a valid service key in mapping.json`);
						yassert.ok(actualServiceMapping[serviceLabel][CREDENTIALS][SEARCH_PATTERN], `search patterns do not exist for ${serviceKey}`);
						yassert.equal(intersection(actualServiceMapping[serviceLabel][CREDENTIALS][SEARCH_PATTERN], expectedServiceMapping[serviceLabel][CREDENTIALS][SEARCH_PATTERN]).length, 3, `${serviceKey} 
						contains ${JSON.stringify(actualServiceMapping[serviceLabel][CREDENTIALS][SEARCH_PATTERN], null, 2)} but expected ${JSON.stringify(expectedServiceMapping[serviceLabel][CREDENTIALS][SEARCH_PATTERN], null, 2)}`);
					});
				});
			}
		});
	});
});
