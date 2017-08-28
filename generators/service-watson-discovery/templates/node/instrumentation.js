var IBMCloudEnv = require('ibm-cloud-env');
var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');

module.exports = function(app, serviceManager){
    var discovery = new DiscoveryV1({
	    url: IBMCloudEnv.getString('watson_discovery_url'),
	    username: IBMCloudEnv.getString('watson_discovery_username'),
        password: IBMCloudEnv.getString('watson_discovery_password'),
		version_date: DiscoveryV1.VERSION_DATE_2017_08_01
    });
    serviceManager.set("watson-discovery", discovery);
};