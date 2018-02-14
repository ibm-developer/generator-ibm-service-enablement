const IBMCloudEnv = require('ibm-cloud-env');
const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

module.exports = function(app, serviceManager){
	const personalityInsights = new PersonalityInsightsV3({
		url: IBMCloudEnv.getString('watson_personality_insights_url'),
		username: IBMCloudEnv.getString('watson_personality_insights_username'),
		password: IBMCloudEnv.getString('watson_personality_insights_password'),
		version_date: '2016-10-19'
	});
	serviceManager.set("watson-personality-insights", personalityInsights);
};
