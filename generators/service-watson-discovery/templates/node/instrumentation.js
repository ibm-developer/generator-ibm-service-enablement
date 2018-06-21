const IBMCloudEnv = require('ibm-cloud-env');
const DiscoveryV1 = require('watson-developer-cloud/discovery/v1');

module.exports = function(app, serviceManager){
	let params = {
		version: '2018-03-05',
		url: IBMCloudEnv.getString('watson_discovery_url'),
	};

	if (IBMCloudEnv.getString('watson_discovery_apikey')) {
		Object.assign(params, {
			iam_apikey: IBMCloudEnv.getString('watson_discovery_apikey')
		});
	}
	else {
		Object.assign(params, {
			username: IBMCloudEnv.getString('watson_discovery_username'),
			password: IBMCloudEnv.getString('watson_discovery_password')
		});
	}

	const discovery = new DiscoveryV1(params);
	serviceManager.set("watson-discovery", discovery);
};
