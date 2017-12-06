var IBMCloudEnv = require('ibm-cloud-env');
var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

module.exports = function(app, serviceManager){
    var personalityInsights = new PersonalityInsightsV3({
	    url: IBMCloudEnv.getString('watson-personality-insights').url,
	    username: IBMCloudEnv.getString('watson-personality-insights').username,
        password: IBMCloudEnv.getString('watson-personality-insights').password,
        version_date: '2016-10-19'
    });
    serviceManager.set("watson-personality-insights", personalityInsights);
};