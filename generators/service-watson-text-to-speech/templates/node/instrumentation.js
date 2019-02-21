const IBMCloudEnv = require('ibm-cloud-env');
const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');

module.exports = function(app, serviceManager) {
	const serviceid_crn = IBMCloudEnv.getString('watson_text_to_speech_iam_serviceid_crn') || '';
	const iam_url = serviceid_crn.indexOf('staging') > 0 ? 'https://iam.stage1.bluemix.net/identity/token' : 'https://iam.bluemix.net/identity/token';

	const textToSpeech = new TextToSpeechV1({
		iam_url,
		iam_apikey: IBMCloudEnv.getString('watson_text_to_speech_apikey'),
		username: IBMCloudEnv.getString('watson_text_to_speech_username'),
		password: IBMCloudEnv.getString('watson_text_to_speech_password'),
		url: IBMCloudEnv.getString('watson_text_to_speech_url'),
	});

	serviceManager.set('watson-text-to-speech', textToSpeech);
};
