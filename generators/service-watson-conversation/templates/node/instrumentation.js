const IBMCloudEnv = require('ibm-cloud-env');
const ConversationV1 = require('watson-developer-cloud/conversation/v1');

'url'
'username'
'password'
module.exports = function(app, serviceManager){
	const conversation = new ConversationV1({
		url: IBMCloudEnv.getString('watson_conversation_url'),
		username: IBMCloudEnv.getString('watson_conversation_username'),
		password: IBMCloudEnv.getString('watson_conversation_password'),
		version_date: ConversationV1.VERSION_DATE_2017_04_21
	});
	serviceManager.set("watson-conversation", conversation);
};
