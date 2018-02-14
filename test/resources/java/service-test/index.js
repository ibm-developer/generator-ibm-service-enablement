'use strict';
const BaseGenerator = require('../../../../generators/lib/generatorbase');
const SCAFFOLDER_PROJECT_PROPERTY_NAME = "test";
const CLOUD_FOUNDRY_SERVICE_NAME = "test";
const config = {
	cloudFoundryIsArray: true,
	mappingVersion: 1
};

module.exports = class extends BaseGenerator {
	constructor(args, opts) {
		opts.context = opts.parentContext;
		super(args, opts, SCAFFOLDER_PROJECT_PROPERTY_NAME, CLOUD_FOUNDRY_SERVICE_NAME);
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
