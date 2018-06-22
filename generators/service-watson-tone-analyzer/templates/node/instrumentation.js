const IBMCloudEnv = require('ibm-cloud-env');
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

module.exports = function(app, serviceManager){
	let params = {
		url: IBMCloudEnv.getString('watson_tone_analyzer_url'),
		version: '2017-09-21'
	};

	if (IBMCloudEnv.getString('watson_tone_analyzer_apikey')) {
		Object.assign(params, {
			iam_apikey: IBMCloudEnv.getString('watson_tone_analyzer_apikey')
		});
	}
	else {
		Object.assign(params, {
			username: IBMCloudEnv.getString('watson_tone_analyzer_username'),
			password: IBMCloudEnv.getString('watson_tone_analyzer_password')
		});
	}

	const toneAnalyzer = new ToneAnalyzerV3(params);
	serviceManager.set("watson-tone-analyzer", toneAnalyzer);
};
