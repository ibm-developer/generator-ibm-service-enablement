const IBMCloudEnv = require('ibm-cloud-env');
const PushNotifications = require('bluemix-push-notifications').PushNotifications;
const Notification = require('bluemix-push-notifications').Notification;

module.exports = function(app, serviceManager){
	let region = IBMCloudEnv.getString("push_region") || "us_south";
	switch (region){
		case "us_south": region = PushNotifications.Region.US_SOUTH; break;
		case "uk": region = PushNotifications.Region.LONDON; break;
		case "sydney": region = PushNotifications.Region.SYDNEY; break;
		default: throw "Invalid Push Service Region: " + region
	}

	const appGuid = IBMCloudEnv.getString("push_app_guid");
	const appSecret = IBMCloudEnv.getString("push_app_secret");

	let PushNotificationInstance = new PushNotifications(region, appGuid, appSecret);

	serviceManager.set("push-notifications", PushNotificationInstance);
	serviceManager.set("notifications-module", Notification);
};


