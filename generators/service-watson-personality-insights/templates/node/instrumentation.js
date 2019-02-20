const IBMCloudEnv = require('ibm-cloud-env');
const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

module.exports = function(app, serviceManager) {
	const serviceid_crn = IBMCloudEnv.getString('watson_personality_insights_iam_serviceid_crn') || '';
	const iam_url = serviceid_crn.indexOf('staging') > 0 ? 'https://iam.stage1.bluemix.net/identity/token' : 'https://iam.bluemix.net/identity/token';

	const personalityInsights = new PersonalityInsightsV3({
		iam_url,
		iam_apikey: IBMCloudEnv.getString('watson_personality_insights_apikey'),
		username: IBMCloudEnv.getString('watson_personality_insights_username'),
		password: IBMCloudEnv.getString('watson_personality_insights_password'),
		url: IBMCloudEnv.getString('watson_personality_insights_url'),
		version: '2017-10-13',
	});

	serviceManager.set('watson-personality-insights', personalityInsights);
};
