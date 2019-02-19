//https://github.com/yeoman/yeoman-assert

'use strict';
const path = require('path');
const yassert = require('yeoman-assert');
const helpers = require('yeoman-test');
const fs = require('fs');

const GENERATOR_PATH = '../generators/app/index.js';
const SERVER_MAPPINGS_JSON = "config/mappings.json";
const SERVER_LOCALDEV_CONFIG_JSON = "config/localdev-config.json";

describe('swift-kitura', function() {
	this.timeout(10 * 1000); // 10 seconds, Travis CI might be slow

	describe('all services', function() {
		const optionsBluemix = JSON.parse(fs.readFileSync(require.resolve('./resources/bluemix.json')));
		const codeForServices = [];
		const dependencies = [];
		const modules = [];
		let runContext;

		before(() => {
			optionsBluemix.backendPlatform = "SWIFT";
			runContext = helpers
				.run(path.join(__dirname, GENERATOR_PATH))
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
				});
			return runContext.toPromise();
		});

		after(() => {
			runContext.cleanTestDirectory();
		});

		it('Can run successful generation and create files', () => {
			// Composing generator is responsible for writing
			// Application.swift and Package.swift. Here we can test
			// that the local subgenerators are correctly injecting
			// the dependencies and instrumentation to the composing
			// generator.
			yassert(codeForServices.length > 0, "expected instrumentation");
			yassert(dependencies.length > 0, "expected dependencies");

			yassert.file('.gitignore');
			yassert.file('config');
			yassert.file(SERVER_MAPPINGS_JSON);
			yassert.file('Sources/Application/Services');
			yassert.file(SERVER_LOCALDEV_CONFIG_JSON);
			yassert.fileContent('.gitignore', SERVER_LOCALDEV_CONFIG_JSON);
		});

		it('Can add AppID instrumentation', () => {
			testAll('service-appid', 'appid', optionsBluemix.appid.serviceInfo.name, {
				[optionsBluemix.appid.serviceInfo.name]: {
					tenantId: optionsBluemix.appid.tenantId,
					clientId: optionsBluemix.appid.clientId,
					secret: optionsBluemix.appid.secret,
					oauthServerUrl: optionsBluemix.appid.oauthServerUrl,
					profilesUrl: optionsBluemix.appid.profilesUrl
				}
			}, dependencies, modules, codeForServices);
		});

		it('Can add Cloudant instrumentation', () => {
			testAll('service-cloudant', 'cloudant', optionsBluemix.cloudant[0].serviceInfo.name, {
				[optionsBluemix.cloudant[0].serviceInfo.name]: {
					username: optionsBluemix.cloudant[0].username,
					password: optionsBluemix.cloudant[0].password,
					url: optionsBluemix.cloudant[0].url
				}
			}, dependencies, modules, codeForServices);
		});

		it('Can add Object Storage instrumentation', () => {
			testAll('service-object-storage', 'object_storage', optionsBluemix.objectStorage[0].serviceInfo.name, {
				[optionsBluemix.objectStorage[0].serviceInfo.name]: {
					projectId: optionsBluemix.objectStorage[0].projectId,
					userId: optionsBluemix.objectStorage[0].userId,
					password: optionsBluemix.objectStorage[0].password,
					region: optionsBluemix.objectStorage[0].region
				}
			}, dependencies, modules, codeForServices);
		});
		it('Can add Redis instrumentation', () => {
			testAll('service-redis', 'redis', optionsBluemix.redis.serviceInfo.name, {
				[optionsBluemix.redis.serviceInfo.name]: {
					uri: optionsBluemix.redis.uri
				}
			}, dependencies, modules, codeForServices);
		});

		it('Can add MongoDB instrumentation', () => {
			testAll('service-mongodb', 'mongodb', optionsBluemix.mongodb.serviceInfo.name, {
				[optionsBluemix.mongodb.serviceInfo.name]: {
					uri: optionsBluemix.mongodb.uri
				}
			}, dependencies, modules, codeForServices);
		});

		it('Can add Push Notifications instrumentation', () => {
			testAll('service-push', 'push', optionsBluemix.push.serviceInfo.name, {
				[optionsBluemix.push.serviceInfo.name]: {
					appGuid: optionsBluemix.push.appGuid,
					apikey: optionsBluemix.push.apikey,
					clientSecret: optionsBluemix.push.clientSecret,
					url: optionsBluemix.push.url
				}
			}, dependencies, modules, codeForServices);
		});

		it('Can add Alert Notification instrumentation', () => {
			testAll('service-alert-notification', 'alert_notification', optionsBluemix.alertNotification.serviceInfo.name, {
				[optionsBluemix.alertNotification.serviceInfo.name]: {
					name: optionsBluemix.alertNotification.name,
					password: optionsBluemix.alertNotification.password,
					url: optionsBluemix.alertNotification.url
				}
			}, dependencies, modules, codeForServices);
		});

		it('Can add PostgreSQL instrumentation', () => {
			testAll('service-postgre', 'postgre', optionsBluemix.postgresql.serviceInfo.name, {
				[optionsBluemix.postgresql.serviceInfo.name]: {
					uri: optionsBluemix.postgresql.uri
				}
			}, dependencies, modules, codeForServices);
		});

		it('Can add ElephantSQL instrumentation', () => {
			testAll('service-elephant-sql', 'elephant_sql', optionsBluemix.elephantsql.serviceInfo.name, {
				[optionsBluemix.elephantsql.serviceInfo.name]: {
					uri: optionsBluemix.elephantsql.uri
				}
			}, dependencies, modules, codeForServices);
		});

		it('Can add HypersecureDBaaS instrumentation', () => {
			testAll('service-hypersecure-dbaas-mongodb', 'hypersecure_dbaas_mongodb', optionsBluemix.hypersecuredb.serviceInfo.name, {
				[optionsBluemix.hypersecuredb.serviceInfo.name]: {
					uri: optionsBluemix.hypersecuredb.uri
				}
			}, dependencies, modules, codeForServices);
		});

		it('Can add Autoscale instrumentation', () => {
			testAll('service-autoscaling', 'swiftMetrics', optionsBluemix.autoscaling.serviceInfo.name, {
				[optionsBluemix.autoscaling.serviceInfo.name]: {
					uri: optionsBluemix.autoscaling.key
				}
			}, dependencies, modules, codeForServices);
		});
	});

	describe('no services', function() {
		const optionsBluemix = JSON.parse(fs.readFileSync(require.resolve('./resources/bluemix.json')));
		const codeForServices = [];
		const dependencies = [];
		const modules = [];
		let runContext;

		before(() => {
			optionsBluemix.backendPlatform = "SWIFT";
			for (let key in optionsBluemix) {
				if (key !== 'name' && key !== 'backendPlatform' && key !== 'server') {
					delete optionsBluemix[key];
				}
			}
			runContext = helpers
				.run(path.join(__dirname, GENERATOR_PATH))
				.withOptions({
					bluemix: JSON.stringify(optionsBluemix),
					parentContext: {
						injectIntoApplication: function(options) {
							codeForServices.push(options.service);
						},
						injectDependency: function(dependency) {
							dependencies.push(dependency);
						},
						injectModules: function (module) {
							modules.push(module);
						}
					}
				})
			return runContext.toPromise();
		});

		after(() => {
			runContext.cleanTestDirectory();
		});

		it('Can run successful generation', () => {
			yassert.equal(0, dependencies.length, "expected no injected dependencies");
			yassert.noFile(SERVER_LOCALDEV_CONFIG_JSON);
		});
	})

	describe('push notifications with non-default region', function () {
		const sdkRegions = {
			'ng.bluemix.net': 'US_SOUTH',
			'eu-gb.bluemix.net': 'UK',
			'au-syd.bluemix.net': 'SYDNEY'
		};
		const regionsToTest = Object.keys(sdkRegions);
		regionsToTest.forEach(region => {
			describe(region, function () {
				const optionsBluemix = JSON.parse(fs.readFileSync(require.resolve('./resources/bluemix.json')));
				const codeForServices = [];
				const dependencies = [];
				const modules = [];
				let runContext;

				before(() => {
					optionsBluemix.backendPlatform = "SWIFT";
					optionsBluemix.push.url = "http://imfpush." + region
					runContext = helpers
						.run(path.join(__dirname, GENERATOR_PATH))
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
					return runContext.toPromise();
				});

				it('Can add Push Notifications instrumentation', () => {
					testAll('service-push', 'push', optionsBluemix.push.serviceInfo.name, {
						[optionsBluemix.push.serviceInfo.name]: {
							appGuid: optionsBluemix.push.appGuid,
							apikey: optionsBluemix.push.apikey,
							clientSecret: optionsBluemix.push.clientSecret,
							url: ("http://imfpush." + region)
						}
					}, dependencies, modules, codeForServices);
				});
			})
		})
	})
});

function testAll(serviceName, servLookupKey, servInstanceName, localDevConfigJson, dependencies, modules, codeForServices) {
	testServiceDependencies(serviceName, dependencies);
	testServiceInstrumentation(serviceName, servLookupKey, codeForServices);
	if (serviceName !== "service-autoscaling") {
		testServiceModules(serviceName, modules);
		testMappings(servLookupKey, servInstanceName);
		testLocalDevConfig(localDevConfigJson || {});
	}
}

function testServiceDependencies(serviceName, dependencies) {
	const filePath = path.join(__dirname, "..", "generators", serviceName, "templates", "swift", "dependencies.txt");
	const fileContent = fs.readFileSync(filePath, 'utf8');
	fileContent.split('\n').map(line => line.trim()).filter(line => !!line).forEach(dep => {
		yassert(dependencies.indexOf(dep) !== -1, 'expected dependency ' + dep);
	});
}

function testServiceModules(serviceName, modules) {
	let serviceVariable = {
		"service-alert-notification": "AlertNotifications",
		"service-appid": "BluemixAppID",
		"service-autoscaling": "",
		"service-cloudant": "CouchDB",
		"service-object-storage": "BluemixObjectStorage",
		"service-redis": "SwiftRedis",
		"service-mongodb": "MongoKitten",
		"service-postgre": "SwiftKueryPostgreSQL",
		"service-push": "IBMPushNotifications",
		"service-watson-assistant": "AssistantV1",
		"service-hypersecure-dbaas-mongodb": "MongoKitten",
		"service-elephant-sql": "SwiftKueryPostgreSQL",
	};
	const module = "\"" + `${serviceVariable[serviceName]}` + "\"";
	yassert(modules.indexOf(module) !== -1, 'expected module ' + module);
}

function testServiceInstrumentation(serviceName, servLookupKey, codeForServices) {
	let serviceVariable = {
		"service-alert-notification": "alertNotificationService",
		"service-appid": "appidService",
		"service-autoscaling": "autoScalingService",
		"service-cloudant": "couchDBService",
		"service-object-storage": "objectStorageService",
		"service-redis": "redisService",
		"service-mongodb": "mongoDBService",
		"service-postgre": "postgreSQLService",
		"service-push": "pushNotificationService",
		"service-watson-assistant": "watsonAssistantService",
		"service-hypersecure-dbaas-mongodb": "mongoDBService",
		"service-elephant-sql": "elephantSQLService",
	};

	function pascalize(name) {
		return name.split('-').map(part => part.charAt(0).toUpperCase() + part.substring(1).toLowerCase()).join('');
	}
	let expectedInitFunctionDeclaration = `initialize${pascalize(serviceName)}(cloudEnv: cloudEnv)`;
	let expectedInitFunctionTemplate = `initialize${pascalize(serviceName)}(cloudEnv: CloudEnv)`;
	if (serviceName === 'service-postgre' || serviceName === 'service-elephant-sql') {
		yassert(codeForServices.indexOf(`try ${expectedInitFunctionDeclaration}`) !== -1);
	} else {
		yassert(codeForServices.indexOf(`${serviceVariable[serviceName]} = try ${expectedInitFunctionDeclaration}`) !== -1);
	}

	if(serviceName === 'service-autoscaling') {
		yassert.fileContent(`Sources/Application/Services/${pascalize(serviceName)}.swift`, `swiftMetricsInstance: ${servLookupKey}`);
	} else {
		yassert.fileContent(`Sources/Application/Services/${pascalize(serviceName)}.swift`, `name: "${servLookupKey}"`);
	}
	yassert.fileContent(`Sources/Application/Services/${pascalize(serviceName)}.swift`, `func ${expectedInitFunctionTemplate}`);

}

function testMappings(servLookupKey, servInstanceName) {
	const envVariableName = 'service_' + servLookupKey;
	const expectedMappings = {
		[servLookupKey]: {
			credentials: {
				searchPatterns: [
					"cloudfoundry:" + servInstanceName,
					"env:" + envVariableName,
					"file:/config/localdev-config.json:" + servInstanceName
				]
			}
		}
	};

	yassert.jsonFileContent(SERVER_MAPPINGS_JSON, expectedMappings);
}

function testLocalDevConfig(json) {
	yassert.jsonFileContent(SERVER_LOCALDEV_CONFIG_JSON, json);
}
