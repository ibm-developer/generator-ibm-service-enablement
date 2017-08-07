var IBMCloudEnv = require('ibm-cloud-env');
var CloudantSDK = require('cloudant');

module.exports = function(app, serviceManager){
	var cloudant = new CloudantSDK(IBMCloudEnv.getString('cloudant_url'));
	serviceManager.set("cloudant", cloudant);
};


