'use strict'
const BaseGenerator = require('../lib/generatorbase');

const SCAFFOLDER_PROJECT_PROPERTY_NAME = "simulatedHistoricalInstrumentAnalytics";
const SERVICE_NAME = "service-finance-simulated-historical-instrument-analytics";
const localDevConfig = ['uri', 'accessToken'];

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
