'use strict'
const BaseGenerator = require('../lib/generatorbase');

const SCAFFOLDER_PROJECT_PROPERTY_NAME = "visualRecognition";
const SERVICE_NAME = "service-watson-visual-recognition";
const localDevConfig = ['url', 'api_key'];

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

