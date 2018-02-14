'use strict';

const BaseGenerator = require('../lib/generatorbase');
const SCAFFOLDER_PROJECT_PROPERTY_NAME = 'dashDb';
const CLOUD_FOUNDRY_SERVICE_NAME = 'dashDB';
const CUSTOM_SERVICE_KEY = 'dashdb';
const CUSTOM_CRED_KEYS = [];

const config = {
	cloudFoundryIsArray: true,
	mappingVersion: 1 
};


module.exports = class extends BaseGenerator {
	constructor(args, opts) {
		super(args, opts, SCAFFOLDER_PROJECT_PROPERTY_NAME, CLOUD_FOUNDRY_SERVICE_NAME, CUSTOM_SERVICE_KEY, CUSTOM_CRED_KEYS);
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
