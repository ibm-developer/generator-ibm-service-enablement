const IBMCloudEnv = require('ibm-cloud-env');
const AssistantV1 = require('watson-developer-cloud/assistant/v1');

module.exports = function(app, serviceManager){
	const assistant = new AssistantV1({
		iam_apikey: IBMCloudEnv.getString('watson_conversation_apikey'),
		username: IBMCloudEnv.getString('watson_conversation_username'),
		password: IBMCloudEnv.getString('watson_conversation_password'),
		url: IBMCloudEnv.getString('watson_conversation_url'),
		version: '2018-07-10',
	});

	serviceManager.set('watson-conversation', assistant);
};
