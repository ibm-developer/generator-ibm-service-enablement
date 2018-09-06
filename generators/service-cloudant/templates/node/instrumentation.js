const IBMCloudEnv = require('ibm-cloud-env');
const CloudantSDK = require('@cloudant/cloudant');

module.exports = function(app, serviceManager){
	const cloudant = new CloudantSDK(IBMCloudEnv.getString('cloudant_url'));
	serviceManager.set('cloudant', cloudant);
};
