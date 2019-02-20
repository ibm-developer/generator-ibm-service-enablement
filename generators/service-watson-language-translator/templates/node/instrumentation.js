const IBMCloudEnv = require('ibm-cloud-env');
const LanguageTranslatorV3 = require('watson-developer-cloud/language-translator/v3');

module.exports = function(app, serviceManager) {
	const serviceid_crn = IBMCloudEnv.getString('watson_language_translator_iam_serviceid_crn') || '';
	const iam_url = serviceid_crn.indexOf('staging') > 0 ? 'https://iam.stage1.bluemix.net/identity/token' : 'https://iam.bluemix.net/identity/token';

	const languageTranslatorV3 = new LanguageTranslatorV3({
		iam_url,
		iam_apikey: IBMCloudEnv.getString('watson_language_translator_apikey'),
		username: IBMCloudEnv.getString('watson_language_translator_username'),
		password: IBMCloudEnv.getString('watson_language_translator_password'),
		url: IBMCloudEnv.getString('watson_language_translator_url'),
		version: '2018-05-01',
	});

	serviceManager.set('watson-language-translator', languageTranslatorV3);
};
