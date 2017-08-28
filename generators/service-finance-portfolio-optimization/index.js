const BaseGenerator = require('../lib/generatorbase');

const SCAFFOLDER_PROJECT_PROPERTY_NAME = "portfolioOptimization";
const SERVICE_NAME = "service-finance-portfolio-optimization";
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