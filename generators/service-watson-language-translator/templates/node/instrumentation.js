const IBMCloudEnv = require('ibm-cloud-env');
const LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2');

module.exports = function(app, serviceManager){
	const languageTranslator = new LanguageTranslatorV2({
		url: IBMCloudEnv.getString('watson_language_translator_url'),
		username: IBMCloudEnv.getString('watson_language_translator_username'),
		password: IBMCloudEnv.getString('watson-language_translator_password')
	});
	serviceManager.set("watson-language-translator", languageTranslator);
};
