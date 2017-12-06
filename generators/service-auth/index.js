'use strict';
const BaseGenerator = require('../lib/generatorbase');
const SCAFFOLDER_PROJECT_PROPERTY_NAME = "auth";
const CLOUD_FOUNDRY_SERVICE_NAME = "AppID";
const CUSTOM_SERVICE_KEY = 'appid';

const config = {
	cloudFoundryIsArray: true,
	mappingVersion: 2
};

module.exports = class extends BaseGenerator {
	constructor(args, opts) {
		super(args, opts, SCAFFOLDER_PROJECT_PROPERTY_NAME, CLOUD_FOUNDRY_SERVICE_NAME, CUSTOM_SERVICE_KEY);
	}

	initializing(){
		return super.initializing();
	}

	configuring(){
		return super.configuring(config);
	}

	writing(){
		return super.writing();
	}
};
