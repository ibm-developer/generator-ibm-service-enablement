import LoggerAPI
import CloudEnvironment
import BluemixPushNotifications

func initializeServicePush(cloudEnv: CloudEnv) throws -> PushNotifications {
    guard let pushNotificationsCredentials = cloudEnv.getPushSDKCredentials(name: "{{servLookupKey}}") else {
        throw InitializationError("Could not load credentials for Push Notifications.")
    }
    let pushNotifications = PushNotifications(
        bluemixRegion: pushNotificationsCredentials.region,
        bluemixAppGuid: pushNotificationsCredentials.appGuid,
        bluemixAppSecret: pushNotificationsCredentials.appSecret
    )
    Log.info("Found and loaded credentials for Push Notifications.")
    return pushNotifications
}
