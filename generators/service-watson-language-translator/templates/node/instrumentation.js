const IBMCloudEnv = require('ibm-cloud-env');
const LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2');

module.exports = function(app, serviceManager){
	let params = {
		url: IBMCloudEnv.getString('watson_language_translator_url'),
	};

	if (IBMCloudEnv.getString('watson_language_translator_apikey')) {
		Object.assign(params, {
			iam_apikey: IBMCloudEnv.getString('watson_language_translator_apikey')
		});
	}
	else {
		Object.assign(params, {
			username: IBMCloudEnv.getString('watson_language_translator_username'),
			password: IBMCloudEnv.getString('watson_language_translator_password')
		});
	}

	const languageTranslator = new LanguageTranslatorV2(params);
	serviceManager.set("watson-language-translator", languageTranslator);
};
