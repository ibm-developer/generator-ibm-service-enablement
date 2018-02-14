'use strict';
const path = require('path');
const yassert = require('yeoman-assert');
const intersection = require('lodash/intersection');
const helpers = require('yeoman-test');
const fs = require('fs');
const optionsBluemix = Object.assign({}, require('./resources/bluemix.json'));

const GENERATOR_PATH = '../generators/app/index.js';
const PACKAGE_JSON = 'package.json';
const SERVER_MAPPINGS_JSON = 'server/config/mappings.json';
const SERVER_LOCALDEV_CONFIG_JSON = 'server/localdev-config.json';

describe('mappings', function() {
	const mappingDir = path.join(__dirname, 'resources', 'mapping');
	const serviceLabels = fs.readdirSync(mappingDir);
	let testDir = '';
	describe('V1 - node', function () {
		this.timeout(10 * 1000); // 10 seconds, Travis might be slow

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
			yassert.file(SERVER_MAPPINGS_JSON);
			yassert.file(SERVER_LOCALDEV_CONFIG_JSON);
		});

		let expectedServiceMapping = '';
		let actualServiceMapping = '';
		let serviceKeys = [];
		const SEARCH_PATTERN = 'searchPatterns';
		serviceLabels.forEach(serviceLabel=> {
			it(`Generated ${serviceLabel} mapping.json matches with standalone mapping.json`, () => {
				expectedServiceMapping =  JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'test', 'resources', 'mapping', serviceLabel, 'mappings.json'), 'utf-8'));
				actualServiceMapping = JSON.parse(fs.readFileSync(path.join(testDir, 'server', 'config', 'mappings.json'), 'utf-8'));
				serviceKeys = Object.keys(expectedServiceMapping);
				serviceKeys.forEach(serviceKey => {
					yassert.ok(actualServiceMapping[serviceKey], `${serviceKey} is not a valid service key in mapping.json`);
					yassert.ok(actualServiceMapping[serviceKey][SEARCH_PATTERN], `search patterns do not exist for ${serviceKey}`);
					yassert.equal(intersection(actualServiceMapping[serviceKey][SEARCH_PATTERN], expectedServiceMapping[serviceKey][SEARCH_PATTERN]).length, 3, `${serviceKey} 
					contains ${JSON.stringify(actualServiceMapping[serviceKey][SEARCH_PATTERN], null, 2)} but expected ${JSON.stringify(expectedServiceMapping[serviceKey][SEARCH_PATTERN], null, 2)}`);
				});
			});
		});

		it('Can run generation with no services', (done) => {
			for (let key in optionsBluemix) {
				if (key !== 'name' && key !== 'backendPlatform' && key !== 'server') {
					delete optionsBluemix[key];
				}
			}

			helpers
				.run(path.join(__dirname, GENERATOR_PATH))
				.inTmpDir()
				.withOptions({
					bluemix: JSON.stringify(optionsBluemix)
				})
				.then((tmpDir) => {
					console.info(tmpDir);

					// package.json doesn't have any SDKs
					yassert.noFileContent(PACKAGE_JSON, 'appid');
					yassert.noFileContent(PACKAGE_JSON, 'cloudant');
					yassert.noFileContent(PACKAGE_JSON, 'dashdb');
					yassert.noFileContent(PACKAGE_JSON, 'watson-developer-cloud');

					yassert.noFile(SERVER_LOCALDEV_CONFIG_JSON);

					done();
				});
		});
	});
});
