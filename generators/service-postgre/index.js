const BaseGenerator = require('../lib/generatorbase');
const localDevConfig = ['uri'];
const SCAFFOLDER_PROJECT_PROPERTY_NAME = "postgresql";
const SERVICE_NAME = "service-postgre";

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
