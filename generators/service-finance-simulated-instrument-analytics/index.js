'use strict';
const BaseGenerator = require('../lib/generatorbase');
const SCAFFOLDER_PROJECT_PROPERTY_NAME = 'simulatedInstrumentAnalytics';
const CLOUD_FOUNDRY_SERVICE_NAME = 'fss-scenario-analytics-service';
const CUSTOM_SERVICE_KEY = 'finance-simulated-instrument-analytics';
const CUSTOM_CRED_KEYS = ['uri', 'accesstoken'];
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
