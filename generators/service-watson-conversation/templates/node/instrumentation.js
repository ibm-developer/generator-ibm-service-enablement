const IBMCloudEnv = require('ibm-cloud-env');
const AssistantV1 = require('watson-developer-cloud/assistant/v1');

module.exports = function(app, serviceManager) {
	const serviceid_crn = IBMCloudEnv.getString('watson_conversation_iam_serviceid_crn') || '';
	const iam_url = serviceid_crn.indexOf('staging') > 0 ? 'https://iam.stage1.bluemix.net/identity/token' : 'https://iam.bluemix.net/identity/token';

	const assistant = new AssistantV1({
		iam_url,
		iam_apikey: IBMCloudEnv.getString('watson_conversation_apikey'),
		username: IBMCloudEnv.getString('watson_conversation_username'),
		password: IBMCloudEnv.getString('watson_conversation_password'),
		url: IBMCloudEnv.getString('watson_conversation_url'),
		version: '2018-09-20',
	});

	serviceManager.set('watson-conversation', assistant);
};
