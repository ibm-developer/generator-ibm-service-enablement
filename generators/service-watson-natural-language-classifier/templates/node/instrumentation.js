const IBMCloudEnv = require('ibm-cloud-env');
const NaturalLanguageClassifierV1 = require('watson-developer-cloud/natural-language-classifier/v1');

module.exports = function(app, serviceManager){
	let params = {
		url: IBMCloudEnv.getString('watson_natural_language_classifier_url')
	};

	if (IBMCloudEnv.getString('watson_natural_language_classifier_apikey')) {
		Object.assign(params, {
			iam_apikey: IBMCloudEnv.getString('watson_natural_language_classifier_apikey')
		});
	}
	else {
		Object.assign(params, {
			username: IBMCloudEnv.getString('watson_natural_language_classifier_username'),
			password: IBMCloudEnv.getString('watson_natural_language_classifier_password')
		});
	}

	const naturalLanguageClassifier = new NaturalLanguageClassifierV1(params);
	serviceManager.set("watson-natural-language-classifier", naturalLanguageClassifier);
};
