const IBMCloudEnv = require('ibm-cloud-env');
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

module.exports = function(app, serviceManager){
	const toneAnalyzer = new ToneAnalyzerV3({
		url: IBMCloudEnv.getString('watson_tone_analyzer_url'),
		username: IBMCloudEnv.getString('watson_tone_analyzer_url'),
		password: IBMCloudEnv.getString('watson_tone_analyzer_password'),
		version_date: '2016-05-19'
	});
	serviceManager.set("watson-tone-analyzer", toneAnalyzer);
};
