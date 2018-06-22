const IBMCloudEnv = require('ibm-cloud-env');
const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');

module.exports = function(app, serviceManager){
	let params = {
		url: IBMCloudEnv.getString('watson_text_to_speech_url')
	};

	if (IBMCloudEnv.getString('watson_text_to_speech_apikey')) {
		Object.assign(params, {
			iam_apikey: IBMCloudEnv.getString('watson_text_to_speech_apikey')
		});
	}
	else {
		Object.assign(params, {
			username: IBMCloudEnv.getString('watson_text_to_speech_username'),
			password: IBMCloudEnv.getString('watson_text_to_speech_password')
		});
	}

	const textToSpeech = new TextToSpeechV1(params);
	serviceManager.set('watson-text-to-speech', textToSpeech);
};
