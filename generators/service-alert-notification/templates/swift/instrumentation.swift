import LoggerAPI
import CloudEnvironment
import AlertNotifications

func initializeServiceAlertNotification(cloudEnv: CloudEnv) throws -> AlertNotificationCredentials {
    guard let alertNotificationCredentials = cloudEnv.getAlertNotificationCredentials(name: "{{servLookupKey}}") else {
        throw InitializationError("Could not load credentials for Alert Notifications.")
    }
    Log.info("Found and loaded credentials for Alert Notifications.")
    return alertNotificationCredentials
}
