'use strict'
const BaseGenerator = require('../lib/generatorbase');

const SCAFFOLDER_PROJECT_PROPERTY_NAME = "objectStorage";
const SERVICE_NAME = "service-object-storage";
const localDevConfig = ['projectId', 'userId', 'password', 'region', "auth_url", 'domainName', 'project'];

module.exports = class extends BaseGenerator {
	constructor(args, opts) {
		super(args, opts, SERVICE_NAME, SCAFFOLDER_PROJECT_PROPERTY_NAME, localDevConfig);
	}

	initializing(){
		return super.initializing();
	}

	configuring(){
		return super.configuring();
	}
	
	writing(){
		return super.writing();
	}
}
