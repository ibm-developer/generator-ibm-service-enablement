const IBMCloudEnv = require('ibm-cloud-env');
const DocumentConversionV1 = require('watson-developer-cloud/document-conversion/v1');

module.exports = function(app, serviceManager){
	const documentConversion = new DocumentConversionV1({
		url: IBMCloudEnv.getString('watson_document_conversion_url'),
		username: IBMCloudEnv.getString('watson_document_conversion_username'),
		password: IBMCloudEnv.getString('watson_document_conversion_password'),
		version_date: '2015-12-01'
	});
	serviceManager.set('watson-document-conversion', documentConversion);
};
