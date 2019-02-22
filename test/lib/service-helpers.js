/*
 * © Copyright IBM Corp. 2017, 2018
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
 * json mappings to ensure consistency between languages
 */

'use strict';

const assert = require('assert');
const lodash = require('lodash/string');

function serviceCloudant(optionsBluemix) {
	return {
		location: 'service-cloudant',
		bluemixName: 'cloudant',
		localDevConfig: {
			cloudant_username: optionsBluemix.cloudant[0].username,
			cloudant_password: optionsBluemix.cloudant[0].password,
			cloudant_url: optionsBluemix.cloudant[0].url
		},
		instrumentation: {
			java_liberty: [{name : "src/main/java/application/cloudant/Cloudant.java", contents : "@ConfigProperty"},
				{name : "src/main/java/application/cloudant/CloudantCredentials.java"}],
			java_spring: []
		}
	};
}

function serviceCloudObjectStorage(optionsBluemix) {
	return {
		location: `service-cloud-object-storage`,
		bluemixName: `cloudObjectStorage`,
		localDevConfig: {
			cloud_object_storage_apikey: optionsBluemix.cloudObjectStorage.apikey,
			cloud_object_storage_endpoints: optionsBluemix.cloudObjectStorage.endpoints,
			cloud_object_storage_iam_apikey_description: optionsBluemix.cloudObjectStorage.iam_apikey_description,
			cloud_object_storage_iam_apikey_name: optionsBluemix.cloudObjectStorage.iam_apikey_name,
			cloud_object_storage_iam_role_crn: optionsBluemix.cloudObjectStorage.iam_role_crn,
			cloud_object_storage_iam_serviceid_crn: optionsBluemix.cloudObjectStorage.iam_serviceid_crn,
			cloud_object_storage_resource_instance_id: optionsBluemix.cloudObjectStorage.resource_instance_id
		},
		instrumentation: {
			java_liberty: [{
				name: "src/main/java/application/cloudobjectstorage/CloudObjectStorage.java",
				contents: "@ConfigProperty"
			}],
			java_spring: []
		}
	}
}

function serviceObjectStorage(optionsBluemix) {
	return {
		location: 'service-object-storage',
		bluemixName: 'objectStorage',
		localDevConfig: {
			object_storage_projectId: optionsBluemix.objectStorage[0].projectId,
			object_storage_project: optionsBluemix.objectStorage[0].project,
			object_storage_userId: optionsBluemix.objectStorage[0].userId,
			object_storage_password: optionsBluemix.objectStorage[0].password,
			object_storage_region: optionsBluemix.objectStorage[0].region,
			object_storage_auth_url: optionsBluemix.objectStorage[0].auth_url,
			object_storage_domainName: optionsBluemix.objectStorage[0].domainName
		},
		instrumentation: {
			java_liberty: [{name : "src/main/java/application/objectstorage/ObjectStorage.java", contents : "@ConfigProperty"},
				{name : "src/main/java/application/objectstorage/ObjectStorageCredentials.java"}],
			java_spring: []
		}
	};
}

function serviceMongodb(optionsBluemix) {
	return {
		location: 'service-mongodb',
		bluemixName: 'mongodb',
		localDevConfig: {
			mongodb_uri: optionsBluemix.mongodb.uri,
			mongodb_ca_certificate_base64: optionsBluemix.mongodb.ca_certificate_base64
		},
		instrumentation: {
			java_liberty: [],
			java_spring: [{name : "src/main/java/application/mongodb/MongoClientConfig.java"}]
		}
	};
}

function serviceWatson(serviceName, optionsBluemix) {
	const bluemixName = serviceName.replace('service-watson-', '');
	const camelCase = lodash.camelCase(bluemixName);
	const snakeName = bluemixName.replace(/-/g,'_');
	const localDevConfig = {};
	localDevConfig[`watson_${snakeName}_url`] = optionsBluemix[camelCase].url;
	if (bluemixName === 'visual-recognition') {
		localDevConfig[`watson_${snakeName}_apikey`] = optionsBluemix[camelCase].apikey;
	} else {
		localDevConfig[`watson_${snakeName}_username`] = optionsBluemix[camelCase].username;
		localDevConfig[`watson_${snakeName}_password`] = optionsBluemix[camelCase].password;
	}

	return {
		location: serviceName,
		bluemixName: camelCase,
		localDevConfig,
		instrumentation: {
			java_liberty: [],
			java_spring: []
		}
	};
}

function servicePush(optionsBluemix) {
	return {
		location: 'service-push',
		bluemixName: 'push',
		localDevConfig: {
			push_appGuid: optionsBluemix.push.appGuid,
			push_apikey: optionsBluemix.push.apikey,
			push_clientSecret: optionsBluemix.push.clientSecret
		},
		instrumentation: {
			java_liberty: [],
			java_spring: []
		}
	};
}

function serviceAlertNotification(optionsBluemix) {
	return {
		location: 'service-alert-notification',
		bluemixName: 'alertNotification',
		localDevConfig: {
			alert_notification_url: optionsBluemix.alertNotification.url,
			alert_notification_name: optionsBluemix.alertNotification.name,
			alert_notification_password: optionsBluemix.alertNotification.password
		},
		instrumentation: {
			java_liberty: [],
			java_spring: []
		}
	};
}


function serviceRedis() {
	return {
		location: 'service-redis',
		bluemixName: 'redis',
		localDevConfig: {},
		instrumentation: {
			java_liberty: [],
			java_spring: []
		}
	}
}

function servicePostgre(optionsBluemix) {
	return {
		location: 'service-postgre',
		bluemixName: 'postgresql',
		localDevConfig: {
			postgre_uri: optionsBluemix.postgresql.uri,
			postgre_ca_certificate_base64: optionsBluemix.postgresql.ca_certificate_base64,
			postgre_deployment_id: optionsBluemix.postgresql.deployment_id
		},
		instrumentation: {
			java_liberty: [],
			java_spring: []
		}
	}
}

function serviceTest(optionsBluemix) {
	return {
		location: 'service-test',
		bluemixName: 'test',
		localDevConfig: {
			test_url: optionsBluemix.test.url
		}
	};
}

function fromDirName(name, optionsBluemix) {
	if (lodash.camelCase(name) in module.exports) {
		return module.exports[lodash.camelCase(name)](optionsBluemix);
	} else if (name.includes('watson')) {
		return serviceWatson(name,optionsBluemix);
	} else {
		assert(false, "YOU MUST HAVE A TEST METHOD NAMED: " + lodash.camelCase(name));
	}
}

module.exports = {
	fromDirName: fromDirName,
	serviceCloudant: serviceCloudant,
	serviceCloudObjectStorage: serviceCloudObjectStorage,
	serviceObjectStorage: serviceObjectStorage,
	serviceMongodb: serviceMongodb,
	servicePush: servicePush,
	serviceAlertNotification: serviceAlertNotification,
	serviceRedis: serviceRedis,
	servicePostgre: servicePostgre,
	serviceTest: serviceTest
};
