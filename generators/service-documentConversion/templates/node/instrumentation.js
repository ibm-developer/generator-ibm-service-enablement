var IBMCloudEnv = require('ibm-cloud-env');
var DocumentConversionV1 = require('watson-developer-cloud/document-conversion/v1');

module.exports = function(app, serviceManager){
    var documentConversion = new DocumentConversionV1({
	    url: IBMCloudEnv.getString('watson_document_conversion').url,
	    username: IBMCloudEnv.getString('watson_document_conversion').username,
        password: IBMCloudEnv.getString('watson_document_conversion').password,
        version_date: '2015-12-01'
    });
    serviceManager.set("watson-document-conversion", documentConversion);
};