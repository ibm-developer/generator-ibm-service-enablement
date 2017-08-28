const BaseGenerator = require('../lib/generatorbase');

const SCAFFOLDER_PROJECT_PROPERTY_NAME = "textToSpeech";
const SERVICE_NAME = "service-watson-text-to-speech";
const localDevConfig = ['url', 'username', 'password'];

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
