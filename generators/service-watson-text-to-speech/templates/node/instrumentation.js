var IBMCloudEnv = require('ibm-cloud-env');
var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');

module.exports = function(app, serviceManager){
    var textToSpeech = new TextToSpeechV1({
	    url: IBMCloudEnv.getString('watson_text_to_speech_url'),
	    username: IBMCloudEnv.getString('watson_text_to_speech_username'),
        password: IBMCloudEnv.getString('watson_text_to_speech_password')
    });
    serviceManager.set("watson-text-to-speech", textToSpeech);
};