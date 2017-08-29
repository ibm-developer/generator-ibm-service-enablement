import BluemixPushNotifications

var pushNotifications: PushNotifications!

func initializeServicePush() throws {
    guard let pushNotificationsCredentials = cloudEnv.getPushSDKCredentials(name: "{{servLookupKey}}") else {
        throw InitializationError("Could not load credentials for Push Notifications.")
    }
    pushNotifications = PushNotifications(
        bluemixRegion: PushNotifications.Region.{{context.pushNotifications.region}},
        bluemixAppGuid: pushNotificationsCredentials.appGuid,
        bluemixAppSecret: pushNotificationsCredentials.appSecret
    )
    Log.info("Found and loaded credentials for Push Notifications.")
}
