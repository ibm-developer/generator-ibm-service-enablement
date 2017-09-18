'use strict'
const BaseGenerator = require('../lib/generatorbase');

const SCAFFOLDER_PROJECT_PROPERTY_NAME = "apacheSpark";
const SERVICE_NAME = "service-apache-spark";
const localDevConfig = ['cluster_master_url', 'tenant_id', 'tenant_secret'];

module.exports = class extends BaseGenerator {
	constructor(args, opts) {
		super(args, opts, SERVICE_NAME, SCAFFOLDER_PROJECT_PROPERTY_NAME, localDevConfig);
	}

	initializing() {
		return super.initializing();
	}

	configuring() {
		return super.configuring();
	}

	writing() {
		return super.writing();
	}
}

