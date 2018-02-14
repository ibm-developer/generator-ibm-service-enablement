const IBMCloudEnv = require('ibm-cloud-env');

module.exports = function(app, serviceManager){
	const config = {
		url : IBMCloudEnv.getString('alert_notification_url') ||  'https://ibmnotifybm.mybluemix.net/api/alerts/v1',
		username : IBMCloudEnv.getString('alert_notification_name') || '',
		password : IBMCloudEnv.getString('alert_notification_password') || ''
	};

	serviceManager.set('alert-notification', config);
};
