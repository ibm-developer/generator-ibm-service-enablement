const IBMCloudEnv = require('ibm-cloud-env');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

module.exports = function(app, serviceManager) {
	const serviceid_crn = IBMCloudEnv.getString('watson_natural_language_understanding_iam_serviceid_crn') || '';
	const iam_url = serviceid_crn.indexOf('staging') > 0 ? 'https://iam.stage1.bluemix.net/identity/token' : 'https://iam.bluemix.net/identity/token';

	const nlu = new NaturalLanguageUnderstandingV1({
		iam_url,
		iam_apikey: IBMCloudEnv.getString('watson_natural_language_understanding_apikey'),
		username: IBMCloudEnv.getString('watson_natural_language_understanding_username'),
		password: IBMCloudEnv.getString('watson_natural_language_understanding_password'),
		url: IBMCloudEnv.getString('watson_natural_language_understanding_url'),
		version: '2018-11-16',
	});

	serviceManager.set('watson-natural-language-understanding', nlu);
};
