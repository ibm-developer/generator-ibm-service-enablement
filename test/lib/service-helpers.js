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

function serviceObjectStorage(optionsBluemix) {
	return {
		location: 'service-objectStorage',
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
			java_spring: [{name : "src/main/java/application/objectstorage/ObjectStorageConfig.java", contents : "@Autowired"}]
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

function serviceConversation(optionsBluemix) {
	return {
		location: 'service-conversation',
		bluemixName: 'conversation',
		localDevConfig: {
			watson_conversation_url: optionsBluemix.conversation.url,
			watson_conversation_username: optionsBluemix.conversation.username,
			watson_conversation_password: optionsBluemix.conversation.password
		},
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
			push_appSecret: optionsBluemix.push.appSecret,
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
		location: 'service-alertNotification',
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
	}
	else {
		assert(false, "YOU MUST HAVE A TEST METHOD NAMED: " + lodash.camelCase(name));
	}
}

module.exports = {
	fromDirName: fromDirName,
	serviceCloudant: serviceCloudant,
	serviceObjectStorage: serviceObjectStorage,
	serviceMongodb: serviceMongodb,
	serviceConversation: serviceConversation,
	servicePush: servicePush,
	serviceAlertNotification: serviceAlertNotification,
	serviceTest: serviceTest
};
