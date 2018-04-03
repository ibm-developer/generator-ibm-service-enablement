const IBMCloudEnv = require('ibm-cloud-env');
const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

module.exports = function(app, serviceManager){
	const visualRecognition = new VisualRecognitionV3({
		url: IBMCloudEnv.getString('watson_visual_recognition_url'),
		api_key: IBMCloudEnv.getString('watson_visual_recognition_api_key'),
		version_date: VisualRecognitionV3.VERSION_DATE_2016_05_20
	});
	serviceManager.set('watson-visual-recognition', visualRecognition);
};
