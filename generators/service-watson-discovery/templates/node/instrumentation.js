const IBMCloudEnv = require('ibm-cloud-env');
const DiscoveryV1 = require('watson-developer-cloud/discovery/v1');

module.exports = function(app, serviceManager) {
	const serviceid_crn = IBMCloudEnv.getString('watson_discovery_iam_serviceid_crn') || '';
	const iam_url = serviceid_crn.indexOf('staging') > 0 ? 'https://iam.stage1.bluemix.net/identity/token' : 'https://iam.bluemix.net/identity/token';

	const discoveryV1 = new DiscoveryV1({
		iam_url,
		iam_apikey: IBMCloudEnv.getString('watson_discovery_apikey'),
		username: IBMCloudEnv.getString('watson_discovery_username'),
		password: IBMCloudEnv.getString('watson_discovery_password'),
		url: IBMCloudEnv.getString('watson_discovery_url'),
		version: '2018-12-03',
	});

	serviceManager.set('watson-discovery', discoveryV1);
};
