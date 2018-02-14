const IBMCloudEnv = require('ibm-cloud-env');
const NaturalLanguageClassifierV1 = require('watson-developer-cloud/natural-language-classifier/v1');

module.exports = function(app, serviceManager){
	const naturalLanguageClassifier = new NaturalLanguageClassifierV1({
		url: IBMCloudEnv.getString('watson_natural_language_classifier_url'),
		username: IBMCloudEnv.getString('watson_natural_language_classifier_usrname'),
		password: IBMCloudEnv.getString('watson_natural_language_classifier_password')
	});
	serviceManager.set("watson-natural-language-classifier", naturalLanguageClassifier);
};
