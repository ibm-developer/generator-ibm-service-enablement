var IBMCloudEnv = require('ibm-cloud-env');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

module.exports = function(app, serviceManager){
    var toneAnalyzer = new ToneAnalyzerV3({
	    url: IBMCloudEnv.getDictionary('watson_tone_analyzer').url,
	    username: IBMCloudEnv.getDictionary('watson_tone_analyzer').username,
        password: IBMCloudEnv.getDictionary('watson_tone_analyzer').password,
        version_date: '2016-05-19'
    });
    serviceManager.set("watson-tone-analyzer", toneAnalyzer);
};