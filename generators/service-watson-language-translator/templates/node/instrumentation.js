var IBMCloudEnv = require('ibm-cloud-env');
var LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2');

module.exports = function(app, serviceManager){
    var languageTranslator = new LanguageTranslatorV2({
	    url: IBMCloudEnv.getString('watson_language_translator_url'),
	    username: IBMCloudEnv.getString('watson_language_translator_username'),
        password: IBMCloudEnv.getString('watson_language_translator_password')
    });
    serviceManager.set("watson-language-translator", languageTranslator);
};