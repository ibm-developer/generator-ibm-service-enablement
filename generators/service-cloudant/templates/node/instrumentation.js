var IBMCloudEnv = require('ibm-cloud-env');
var CloudantSDK = require('cloudant');

module.exports = function(app, serviceManager){
	var cloudant = new CloudantSDK(IBMCloudEnv.getDictionary('cloudant').url);
	serviceManager.set("cloudant", cloudant);
};


