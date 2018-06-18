'use strict';
const BaseGenerator = require('../lib/generatorbase');
const SCAFFOLDER_PROJECT_PROPERTY_NAME = 'cloudobjectstorage';
const CLOUD_FOUNDRY_SERVICE_NAME = '8106946b-99ba-493a-929e-0c97ead623d3';
const CUSTOM_SERVICE_KEY = 'cos';
const CUSTOM_CRED_KEYS = ['apikey', 'endpoints', 'iam_apikey_description', 'iam_apikey_name', 'iam_role_crn', 'iam_serviceid_crn', 'resource_instance_id'];
const config = {
	cloudFoundryIsArray: true,
	mappingVersion: 1
};

module.exports = class extends BaseGenerator {
	constructor(args, opts) {
		super(args, opts, SCAFFOLDER_PROJECT_PROPERTY_NAME, CLOUD_FOUNDRY_SERVICE_NAME, CUSTOM_SERVICE_KEY, CUSTOM_CRED_KEYS);
	}

	initializing() {
		return super.initializing();
	}

	configuring() {
		return super.configuring(config);
	}

	writing() {
		return super.writing();
	}
};
