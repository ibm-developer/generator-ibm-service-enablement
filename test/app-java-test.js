/*
 * Copyright IBM Corporation 2017
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * core classes for tests
 */

'use strict';
const path = require('path');
const assert = require('assert');
const helpers = require('yeoman-test');
const svcHelpers = require('./lib/service-helpers');
const common = require('./lib/java-test-helpers');
const Handlebars = require('handlebars');
const fs = require('fs');

const assertLiberty = common.test('liberty');
const assertSpring= common.test('spring');

const optionsBluemix = Object.assign({}, require('./resources/bluemix.json'));
const PATH_MAPPINGS_FILE = "./src/main/resources/mappings.json";
const LOCALDEV_CONFIG_JSON = './src/main/resources/localdev-config.json';

class Options {
	constructor(service, backendPlatform) {
		this.values = {
			serviceName: service.bluemixName,
			backendPlatform: backendPlatform
		}
	}

	assertConfig(framework, buildType, service, filePath) {
		if (filePath === undefined) {
			filePath = path.join(__dirname, "..", "generators", service.location, "templates", 'java-' + framework, "config.json.template");
		}
		const template = Handlebars.compile(fs.readFileSync(filePath, 'utf-8'));
		const expected = JSON.parse(template({bluemix: optionsBluemix}));
		let buildTest = common.test(buildType);

		if (expected.dependencies) {
			expected.dependencies.forEach(dep => {
				let scope = dep.scope || 'compile';     //default scope if not set
				buildTest.assertDependency(true, scope, dep.groupId, dep.artifactId, dep.version, dep.exclusions);
			});
		}
		if (expected.properties) {
			expected.properties.forEach(prop => {
				buildTest.assertProperty(prop.name, prop.value);
			});
		}
		this['assert' + framework + 'env'](expected);
		it('should generate mappings.json in ' + PATH_MAPPINGS_FILE, function () {
			assert.file(PATH_MAPPINGS_FILE);
		});
	}

	assertLocalDevConfig(framework, buildType, service) {
		let expected = {envEntries: []};
		Object.getOwnPropertyNames(service.localDevConfig).forEach(prop => {
			let entry = {
				name: prop,
				value: service.localDevConfig[prop]
			};
			expected.envEntries.push(entry);
			it('should generate a local dev entry for ' + entry.name, function() {
				assert.fileContent(LOCALDEV_CONFIG_JSON, '"' + entry.name + '"' + ': ' + '"' + entry.value + '"');
			});
		});
	}

	assertInstrumentation(framework, buildType, service) {
		if (service.instrumentation) {
			it('should not generate a config.json.template file', function () {
				assert.noFile('config.json.template');
			});
			let files = service.instrumentation['java_' + framework];
			files.forEach(file => {
				it('should generate file ' + file.name + ' for service ' + service.location, function () {
					assert.file(file.name);
				});
				if(file.contents) {
					it('should generate file ' + file.name + ' for service ' + service.location + ' with contents ' + file.contents, function () {
						assert.fileContent(file.name, file.contents);
					});
				}
			});
			this['assert' + framework + 'src'](true, buildType);
		} else {
			this['assert' + framework + 'src'](false, buildType);
		}
	}

	assertlibertyenv() {
		//currently no specific env var tests
	}

	assertlibertysrc(exists, buildType) {
		let check = exists ? assert.file : assert.noFile;
		let desc = exists ? 'should ' : 'should not ';
		let checkContent = exists ? assert.fileContent : assert.noFile;
		let buildTest = common.test(buildType);
		buildTest.assertDependency(exists, 'provided', 'javax.json', 'javax.json-api', '1.0');
		buildTest.assertDependency(exists, 'provided', 'com.ibm.websphere.appserver.api', 'com.ibm.websphere.appserver.api.json', '1.0.18');
		buildTest.assertDependency(exists, 'provided', 'javax.enterprise', 'cdi-api', '1.2');
		assertLiberty.assertFeature(exists, 'jsonp-1.0');
		assertLiberty.assertFeature(exists, 'jndi-1.0');
		assertLiberty.assertFeature(exists, 'cdi-1.2');
		it(desc + 'generate CloudCredentials.java file', function () {
			check('src/main/java/application/ibmcloud/CloudCredentials.java');
		});
		it(desc + 'generate CloudServices.java file', function () {
			check('src/main/java/application/ibmcloud/CloudServices.java');
		});
		it(desc + 'generate CloudServicesException.java file', function () {
			check('src/main/java/application/ibmcloud/CloudServicesException.java');
		});
		it(desc + 'generate InvalidCredentialsException.java file', function () {
			check('src/main/java/application/ibmcloud/InvalidCredentialsException.java');
		});
		it(desc + 'generate MappingFileConfigSource.java file', function () {
			check('src/main/java/application/ibmcloud/MappingFileConfigSource.java');
		});
		it('should generate ' + LOCALDEV_CONFIG_JSON, function () {
			assert.file(LOCALDEV_CONFIG_JSON);
		});
		it(desc + 'generate a org.eclipse.microprofile.config.spi.ConfigSource file with contents application.ibmcloud.MappingFileConfigSource', function () {
			checkContent('src/main/resources/META-INF/services/org.eclipse.microprofile.config.spi.ConfigSource', 'application.ibmcloud.MappingFileConfigSource');
		});	
	}

	assertspringenv() {
		//currently no specific env var tests
	}

	assertspringsrc(exists) {
		let check = exists ? assert.file : assert.noFile;
		let desc = exists ? 'should ' : 'should not ';
		it(desc + 'generate CloudServices.java file', function () {
			check('src/main/java/application/ibmcloud/CloudServices.java');
		});
		it(desc + 'generate CloudServicesException.java file', function () {
			check('src/main/java/application/ibmcloud/CloudServicesException.java');
		});
		it(desc + 'generate Mappings.java file', function () {
			check('src/main/java/application/ibmcloud/Mappings.java');
		});
		it('should generate ServiceMappings.java file', function () {
			check('src/main/java/application/ibmcloud/ServiceMappings.java');
		});
		it('should generate ' + LOCALDEV_CONFIG_JSON, function () {
			assert.file(LOCALDEV_CONFIG_JSON);
		});
	}

	before() {
		const filePath = path.join(__dirname, "resources", "java", "index.js");
		return helpers.run(filePath)
			.withOptions(this.values)
			.toPromise();
	}
}

const BUILD_TYPES = ['maven', 'gradle'];
let spring_services = getServices('java-spring');
let liberty_services = getServices('java-liberty');

testServices(spring_services, 'spring', 'SPRING');
testServices(liberty_services, 'liberty', 'JAVA');
testTestService();

//find all services that have been enabled for Java
function getServices(subFolder) {
	let root = path.join(__dirname, "..", 'generators');
	let folders = fs.readdirSync(root);
	let services = [];
	folders.forEach(folder => {
		if (folder.startsWith('service-')) {
			let svcpath = path.join(root, folder, 'templates', subFolder);
			if (fs.existsSync(svcpath)) {
				services.push(path.basename(folder));
			}
		}
	});
	return services;
}

function testServices(services, framework, backendPlatform) {
	BUILD_TYPES.forEach(buildType => {
		services.forEach(dirname => {
			describe(`java generator : test ${framework}, ${buildType}, ${dirname}`, function () {
				this.timeout(25000);
				let service = svcHelpers.fromDirName(dirname, optionsBluemix);
				let options = new Options(service, backendPlatform);
				before(options.before.bind(options));
				options.assertConfig(framework, buildType, service, undefined);
				options.assertLocalDevConfig(framework, buildType, service);
				options.assertInstrumentation(framework, buildType, service);
			})
		})
	})
}

function testTestService() {
	describe('java generator : test liberty, maven, test service', function () {
		this.timeout(25000);
		let testService = {
			"url": "https://account.test.com",
			"serviceInfo": {
				"label": "test-label",
				"name": "test-name",
				"plan": "test-plan"
			}
		};
		let bluemixJson = optionsBluemix;
		bluemixJson.test = testService;
		let service = svcHelpers.serviceTest(bluemixJson);
		let options = new Options(service, 'JAVA');
		before(options.before.bind(options));
		let configPath = path.join(__dirname, "..", "test", "resources", "java", "service-test", "templates", 'java-liberty', "config.json.template");
		options.assertConfig('liberty', 'maven', service, configPath);
		options.assertLocalDevConfig('liberty', 'maven', service);
		options.assertInstrumentation('liberty', 'maven', service);
		assertSpring.assertEnv('testenvname', 'testenvvalue');
		assertLiberty.assertEnv('testenvname', 'testenvvalue');
		assertLiberty.assertJNDI('testjndiname', 'testjndivalue');
	});
}
