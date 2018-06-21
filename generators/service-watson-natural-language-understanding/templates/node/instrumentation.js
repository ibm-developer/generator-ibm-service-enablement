const IBMCloudEnv = require('ibm-cloud-env');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

module.exports = function(app, serviceManager){
	let params = {
		version_date: '2018-03-16',
		url: IBMCloudEnv.getString('watson_natural_language_understanding_url'),
	};

	if (IBMCloudEnv.getString('watson_natural_language_understanding_apikey')) {
		Object.assign(params, {
			iam_apikey: IBMCloudEnv.getString('watson_natural_language_understanding_apikey')
		});
	}
	else {
		Object.assign(params, {
			username: IBMCloudEnv.getString('watson_natural_language_understanding_username'),
			password: IBMCloudEnv.getString('watson_natural_language_understanding_password')
		});
	}

	const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1(params);
	serviceManager.set("watson-natural-language-understanding", naturalLanguageUnderstanding);
};
