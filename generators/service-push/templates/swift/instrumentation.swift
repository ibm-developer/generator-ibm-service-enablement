import LoggerAPI
import CloudEnvironment
import IBMPushNotifications

func initializeServicePush(cloudEnv: CloudEnv) throws -> PushNotifications {
    guard let pushNotificationsCredentials = cloudEnv.getPushSDKCredentials(name: "{{servLookupKey}}") else {
        throw InitializationError("Could not load credentials for Push Notifications.")
    }
    let pushNotifications = PushNotifications(
        pushApiKey: pushNotificationsCredentials.apiKey,
        pushAppGuid: pushNotificationsCredentials.appGuid,
        pushRegion: pushNotificationsCredentials.region
    )
    Log.info("Found and loaded credentials for Push Notifications.")
    return pushNotifications
}
