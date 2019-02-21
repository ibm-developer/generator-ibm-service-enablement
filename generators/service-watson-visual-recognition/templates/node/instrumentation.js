const IBMCloudEnv = require('ibm-cloud-env');
const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

module.exports = function(app, serviceManager){
	const serviceid_crn = IBMCloudEnv.getString('watson_visual_recognition_iam_serviceid_crn') || '';
	const iam_url = serviceid_crn.indexOf('staging') > 0 ? 'https://iam.stage1.bluemix.net/identity/token' : 'https://iam.bluemix.net/identity/token';

	const visualRecognition = new VisualRecognitionV3({
		version: '2018-03-19',
		url: IBMCloudEnv.getString('watson_visual_recognition_url'),
		iam_apikey: IBMCloudEnv.getString('watson_visual_recognition_apikey'),
		iam_url
	});
	serviceManager.set('watson-visual-recognition', visualRecognition);
};
