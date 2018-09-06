const IBMCloudEnv = require('ibm-cloud-env');
const PushNotifications = require('ibm-push-notifications').PushNotifications;
const Notification = require('ibm-push-notifications').Notification;
const PushMessageBuilder = require('ibm-push-notifications').PushMessageBuilder;
const PushNotificationsApiKey = require('ibm-push-notifications').PushNotificationsWithApiKey;
const appName = require('./../../package').name;
const log4js = require('log4js');
const logger = log4js.getLogger(appName);

module.exports = function(app, serviceManager){
	let push_url = IBMCloudEnv.getString('push_url');
	const regionRegex = /\/\/imfpush(.+)\/imfpush\//;
	const executedRegionExpression = regionRegex.exec(push_url);
	const region = executedRegionExpression && executedRegionExpression.length > 1 && executedRegionExpression[1];
	if(!region || region.indexOf('.bluemix.net') < 0) {
		throw 'Invalid Push Service Region: ' + region;
	}

	const appGuid = IBMCloudEnv.getString('push_app_guid');
	const apiKey = IBMCloudEnv.getString('push_apikey');

	let PushNotificationInstance = new PushNotificationsApiKey(region, appGuid, apiKey);

	// Get authtoken
	PushNotificationInstance.getAuthToken( function(hastoken, token){
		logger.info('adding Push Notifications request authorization header: ', token);
	})

	serviceManager.set('push-notifications', PushNotificationInstance);
	serviceManager.set('notifications-module', Notification);
	serviceManager.set('message-builder-module', PushMessageBuilder);
};
