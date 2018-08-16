const IBMCloudEnv = require('ibm-cloud-env');
const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

module.exports = function(app, serviceManager){
	let params = {
		version: '2018-03-19',
		url: IBMCloudEnv.getString('watson_visual_recognition_url'),
	};

	if (IBMCloudEnv.getString('watson_visual_recognition_apikey')) {
		Object.assign(params, {
			iam_apikey: IBMCloudEnv.getString('watson_visual_recognition_apikey')
		});
	}
	else {
		Object.assign(params, {
			api_key: IBMCloudEnv.getString('watson_visual_recognition_api_key')
		});
	}

	const visualRecognition = new VisualRecognitionV3(params);
	serviceManager.set('watson-visual-recognition', visualRecognition);
};
