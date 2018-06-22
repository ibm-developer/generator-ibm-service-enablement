const IBMCloudEnv = require('ibm-cloud-env');
const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

module.exports = function(app, serviceManager){
	let params = {
		version_date: '2017-10-13',
		url: IBMCloudEnv.getString('watson_personality_insights_url'),
	};

	if (IBMCloudEnv.getString('watson_personality_insights_apikey')) {
		Object.assign(params, {
			iam_apikey: IBMCloudEnv.getString('watson_personality_insights_apikey')
		});
	}
	else {
		Object.assign(params, {
			username: IBMCloudEnv.getString('watson_personality_insights_username'),
			password: IBMCloudEnv.getString('watson_personality_insights_password')
		});
	}

	const personalityInsights = new PersonalityInsightsV3(params);
	serviceManager.set("watson-personality-insights", personalityInsights);
};
