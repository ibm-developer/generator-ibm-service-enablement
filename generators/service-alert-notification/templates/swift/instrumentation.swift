import LoggerAPI
import AlertNotifications

var serviceCredentials: ServiceCredentials!

func initializeServiceAlertNotification() throws {
    guard let alertNotificationCredentials = cloudEnv.getAlertNotificationCredentials(name: "{{servLookupKey}}") else {
        throw InitializationError("Could not load credentials for Alert Notifications.")
    }
    serviceCredentials = ServiceCredentials(
        url: alertNotificationCredentials.url,
        name: alertNotificationCredentials.name,
        password: alertNotificationCredentials.password
    )
    Log.info("Found and loaded credentials for Alert Notifications.")
}
