var IBMCloudEnv = require('ibm-cloud-env');
var NaturalLanguageClassifierV1 = require('watson-developer-cloud/natural-language-classifier/v1');

module.exports = function(app, serviceManager){
    var naturalLanguageClassifier = new NaturalLanguageClassifierV1({
	    url: IBMCloudEnv.getDictionary('watson-natural-language-classifier').url,
	    username: IBMCloudEnv.getDictionary('watson-natural-language-classifier').username,
        password: IBMCloudEnv.getDictionary('watson-natural-language-classifier').password
    });
    serviceManager.set("watson-natural-language-classifier", naturalLanguageClassifier);
};