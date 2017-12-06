var IBMCloudEnv = require('ibm-cloud-env');
var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');

module.exports = function(app, serviceManager){
    var discovery = new DiscoveryV1({
	    url: IBMCloudEnv.getDictionary('watson_discovery').url,
	    username: IBMCloudEnv.getDictionary('watson_discovery').username,
        password: IBMCloudEnv.getDictionary('watson_discovery').password,
		version_date: DiscoveryV1.VERSION_DATE_2017_08_01
    });
    serviceManager.set("watson-discovery", discovery);
};