var IBMCloudEnv = require('ibm-cloud-env');
var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');

module.exports = function(app, serviceManager){
    var textToSpeech = new TextToSpeechV1({
	    url: IBMCloudEnv.getDictionary('watson_text_to_speech').url,
	    username: IBMCloudEnv.getDictionary('watson_text_to_speech').username,
        password: IBMCloudEnv.getDictionary('watson_text_to_speech').password
    });
    serviceManager.set("watson-text-to-speech", textToSpeech);
};