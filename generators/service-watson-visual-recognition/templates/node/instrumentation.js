const IBMCloudEnv = require('ibm-cloud-env');
const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

module.exports = function(app, serviceManager){
	let params = {
		version: '2018-03-19'
	};

	if (IBMCloudEnv.getString('watson_viusal_recognition_apikey')) {
		const iam_url = params.url.includes('gateway-s.') ?
			'https://iam.stage1.bluemix.net/identity/token' :
			'https://iam.bluemix.net/identity/token';
		Object.assign(params, {
			iam_apikey: IBMCloudEnv.getString('watson_viusal_recognition_apikey'),
			iam_url,
		});
	}
	else {
		Object.assign(params, {
			api_key: IBMCloudEnv.getString('watson_viusal_recognition_api_key'),
		});
	}


	const visualRecognition = new VisualRecognitionV3(params);
	serviceManager.set('watson-visual-recognition', visualRecognition);
};
