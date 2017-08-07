var IBMCloudEnv = require('ibm-cloud-env');
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');

module.exports = function(app, serviceManager){
    var speechToText = new SpeechToTextV1({
	    url: IBMCloudEnv.getString('watson_speech_to_text_url'),
	    username: IBMCloudEnv.getString('watson_speech_to_text_username'),
        password: IBMCloudEnv.getString('watson_speech_to_text_password')
    });
    serviceManager.set("watson-speech-to-text", speechToText);
};