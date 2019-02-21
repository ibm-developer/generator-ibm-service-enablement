const IBMCloudEnv = require('ibm-cloud-env');
const NaturalLanguageClassifierV1 = require('watson-developer-cloud/natural-language-classifier/v1');

module.exports = function(app, serviceManager) {
	const serviceid_crn = IBMCloudEnv.getString('watson_natural_language_classifier_iam_serviceid_crn') || '';
	const iam_url = serviceid_crn.indexOf('staging') > 0 ? 'https://iam.stage1.bluemix.net/identity/token' : 'https://iam.bluemix.net/identity/token';

	const nlc = new NaturalLanguageClassifierV1({
		iam_url,
		iam_apikey: IBMCloudEnv.getString('watson_natural_language_classifier_apikey'),
		username: IBMCloudEnv.getString('watson_natural_language_classifier_username'),
		password: IBMCloudEnv.getString('watson_natural_language_classifier_password'),
		url: IBMCloudEnv.getString('watson_natural_language_classifier_url'),
	});

	serviceManager.set('watson-natural-language-classifier', nlc);
};
