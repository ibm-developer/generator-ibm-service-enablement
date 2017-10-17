import LoggerAPI
import CloudEnvironment
import AlertNotifications

func initializeServiceAlertNotification(cloudEnv: CloudEnv) throws -> ServiceCredentials {
    guard let alertNotificationCredentials = cloudEnv.getAlertNotificationCredentials(name: "{{servLookupKey}}") else {
        throw InitializationError("Could not load credentials for Alert Notifications.")
    }
    let serviceCredentials = ServiceCredentials(
        url: alertNotificationCredentials.url,
        name: alertNotificationCredentials.name,
        password: alertNotificationCredentials.password
    )
    Log.info("Found and loaded credentials for Alert Notifications.")
    return serviceCredentials
}
