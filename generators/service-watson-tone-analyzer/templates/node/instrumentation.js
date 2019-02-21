const IBMCloudEnv = require('ibm-cloud-env');
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

module.exports = function(app, serviceManager) {
	const serviceid_crn = IBMCloudEnv.getString('watson_tone_analyzer_iam_serviceid_crn') || '';
	const iam_url = serviceid_crn.indexOf('staging') > 0 ? 'https://iam.stage1.bluemix.net/identity/token' : 'https://iam.bluemix.net/identity/token';

	const toneAnalyzer = new ToneAnalyzerV3({
		iam_url,
		iam_apikey: IBMCloudEnv.getString('watson_tone_analyzer_apikey'),
		username: IBMCloudEnv.getString('watson_tone_analyzer_username'),
		password: IBMCloudEnv.getString('watson_tone_analyzer_password'),
		url: IBMCloudEnv.getString('watson_tone_analyzer_url'),
		version: '2017-09-21',
	});

	serviceManager.set('watson-tone-analyzer', toneAnalyzer);
};
