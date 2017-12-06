
const IBMCloudEnv = require('ibm-cloud-env');

module.exports = function(app, serviceManager){
	const config = {
		url : IBMCloudEnv.getDictionary('alert_notification').url ||  'https://ibmnotifybm.mybluemix.net/api/alerts/v1',
		username : IBMCloudEnv.getDictionary('alert_notification').name || '',
		password : IBMCloudEnv.getDictionary('alert_notification').password || ''
	};

	serviceManager.set('alert-notification', config);
};

