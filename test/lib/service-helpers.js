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
			java_liberty: ["src/main/java/application/cloudant/Cloudant.java", "src/main/java/application/cloudant/CloudantCredentials.java"],
			java_spring: ["src/main/java/application/cloudant/CloudantClientConfig.java", "src/main/java/application/cloudant/CloudantCredentials.java"]
		}
	};
}

function serviceObjectStorage(optionsBluemix) {
	return {
		location: 'service-object-storage',
		bluemixName: 'objectStorage',
		localDevConfig: {
			object_storage_project_id: optionsBluemix.objectStorage[0].projectId,
			object_storage_project: optionsBluemix.objectStorage[0].project,
			object_storage_user_id: optionsBluemix.objectStorage[0].userId,
			object_storage_password: optionsBluemix.objectStorage[0].password,
			object_storage_region: optionsBluemix.objectStorage[0].region,
			object_storage_authurl: optionsBluemix.objectStorage[0].auth_url,
			object_storage_domainName: optionsBluemix.objectStorage[0].domainName
		},
		instrumentation: {
			java_liberty: ["src/main/java/application/objectstorage/ObjectStorage.java", "src/main/java/application/objectstorage/ObjectStorageCredentials.java"],
			java_spring: ["src/main/java/application/objectstorage/ObjectStorageConfig.java", "src/main/java/application/objectstorage/ObjectStorageCredentials.java"]
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
	return module.exports[lodash.camelCase(name)](optionsBluemix);
}


module.exports = {
	fromDirName: fromDirName,
	serviceCloudant: serviceCloudant,
	serviceObjectStorage: serviceObjectStorage,
	serviceTest: serviceTest
}
