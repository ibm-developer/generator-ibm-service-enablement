var IBMCloudEnv = require('ibm-cloud-env');
var LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2');

module.exports = function(app, serviceManager){
    var languageTranslator = new LanguageTranslatorV2({
	    url: IBMCloudEnv.getString('watson-language-translator').url,
	    username: IBMCloudEnv.getString('watson-language-translator').username,
        password: IBMCloudEnv.getString('watson-language-translator').password
    });
    serviceManager.set("watson-language-translator", languageTranslator);
};