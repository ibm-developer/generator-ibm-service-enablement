const IBMCloudEnv = require('ibm-cloud-env');
const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');

module.exports = function(app, serviceManager){
	let params = {
		url: IBMCloudEnv.getString('watson_speech_to_text_url'),
	};

	if (IBMCloudEnv.getString('watson_speech_to_text_apikey')) {
		Object.assign(params, {
			iam_apikey: IBMCloudEnv.getString('watson_speech_to_text_apikey')
		});
	}
	else {
		Object.assign(params, {
			username: IBMCloudEnv.getString('watson_speech_to_text_username'),
			password: IBMCloudEnv.getString('watson_speech_to_text_password')
		});
	}

	const speechToText = new SpeechToTextV1(params);
	serviceManager.set('watson-speech-to-text', speechToText);
};
