var IBMCloudEnv = require('ibm-cloud-env');
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');

module.exports = function(app, serviceManager){
    var speechToText = new SpeechToTextV1({
	    url: IBMCloudEnv.getDictionary('watson_speech_to_text').url,
	    username: IBMCloudEnv.getDictionary('watson_speech_to_text').username,
        password: IBMCloudEnv.getDictionary('watson_speech_to_text').password
    });
    serviceManager.set("watson-speech-to-text", speechToText);
};