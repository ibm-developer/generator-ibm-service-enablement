const IBMCloudEnv = require('ibm-cloud-env');
const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');

module.exports = function(app, serviceManager) {
	const serviceid_crn = IBMCloudEnv.getString('watson_speech_to_text_iam_serviceid_crn') || '';
	const iam_url = serviceid_crn.indexOf('staging') > 0 ? 'https://iam.stage1.bluemix.net/identity/token' : 'https://iam.bluemix.net/identity/token';

	const speechToText = new SpeechToTextV1({
		iam_url,
		iam_apikey: IBMCloudEnv.getString('watson_speech_to_text_apikey'),
		username: IBMCloudEnv.getString('watson_speech_to_text_username'),
		password: IBMCloudEnv.getString('watson_speech_to_text_password'),
		url: IBMCloudEnv.getString('watson_speech_to_text_url'),
	});

	serviceManager.set('watson-speech-to-text', speechToText);
};
