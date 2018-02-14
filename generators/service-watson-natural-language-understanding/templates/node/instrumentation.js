const IBMCloudEnv = require('ibm-cloud-env');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

module.exports = function(app, serviceManager){
	const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
		url: IBMCloudEnv.getString('watson_natural_language_understanding_url'),
		username: IBMCloudEnv.getString('watson_natural_language_understanding_username'),
		password: IBMCloudEnv.getString('watson_natural_language_understanding_password'),
		version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27
	});
	serviceManager.set("watson-natural-language-understanding", naturalLanguageUnderstanding);
};
