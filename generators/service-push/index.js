'use strict'
const BaseGenerator = require('../lib/generatorbase');

const SCAFFOLDER_PROJECT_PROPERTY_NAME = "push";
const SERVICE_NAME = "service-push";
const localDevConfig = ['appGuid', 'appSecret', 'clientSecret', 'url'];


module.exports = class extends BaseGenerator {
	constructor(args, opts) {
		super(args, opts, SERVICE_NAME, SCAFFOLDER_PROJECT_PROPERTY_NAME, localDevConfig);
	}

	initializing(){
		this.context.pushNotifications = { region: this._getRegion() };
		return super.initializing();
	}

	configuring(){
		return super.configuring();
	}

	writing(){
		return super.writing();
	}

	_getRegion() {
		if (this.context.bluemix.server) {
			switch (this.context.bluemix.server.domain) {
				case 'ng.bluemix.net': return 'US_SOUTH';
				case 'eu-gb.bluemix.net': return 'UK';
				case 'au-syd.bluemix.net': return 'SYDNEY';
			}
		}
		return 'US_SOUTH';
	}
};

