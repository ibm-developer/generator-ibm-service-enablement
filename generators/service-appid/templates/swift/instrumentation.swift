import LoggerAPI
import CloudEnvironment
import BluemixAppID
import class Credentials.Credentials

// For more details on AppID/Auth usage, see
// https://github.com/ibm-cloud-security/appid-serversdk-swift#protecting-web-applications-using-webappkituracredentialsplugin
// Use kituraCredentials to protect your endpoints/routes

func initializeServiceAppid(cloudEnv: CloudEnv) throws -> Credentials {
    guard let appidCredentials = cloudEnv.getAppIDCredentials(name: "{{servLookupKey}}") else {
        throw InitializationError("Could not load credentials for AppID.")
    }
    // Load credentials for Bluemix AppID using CloudEnvironment
    // See https://github.com/ibm-cloud-security/appid-serversdk-swift
    let options: [String:Any] = [
        "clientId": appidCredentials.clientId,
        "secret": appidCredentials.secret,
        "tenantId": appidCredentials.tenantId,
        "oauthServerUrl": appidCredentials.oauthServerUrl,
        "profilesUrl": appidCredentials.profilesUrl,
        "redirectUri": cloudEnv.url + "/api/appid/callback"
    ]
    let webappKituraCredentialsPlugin = WebAppKituraCredentialsPlugin(options: options)
    let kituraCredentials = Credentials()
    kituraCredentials.register(plugin: webappKituraCredentialsPlugin)
    Log.info("Found and loaded credentials for AppID.")
    return kituraCredentials
}
