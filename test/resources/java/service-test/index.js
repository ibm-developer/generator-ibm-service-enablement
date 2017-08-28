const BaseGenerator = require('../../../../generators/lib/generatorbase');

const SCAFFOLDER_PROJECT_PROPERTY_NAME = "test";
const SERVICE_NAME = "service-test";
const localDevConfig = ['url'];

module.exports = class extends BaseGenerator {
	constructor(args, opts) {
        opts.context = opts.parentContext;
        console.log('***opts.context._addDependencies : ' + opts.context._addDependencies)
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