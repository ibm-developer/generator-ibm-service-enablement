import LoggerAPI
import CouchDB

var couchDBClient: CouchDBClient!

func initializeServiceCloudant() throws {
    // Load credentials for Cloudant/CouchDB using CloudEnvironment
    guard let cloudantCredentials = cloudEnv.getCloudantCredentials(name: "{{servLookupKey}}") else {
        throw InitializationError("Could not load credentials for Cloudant.")
    }
    let connectionProperties = ConnectionProperties(
        host: cloudantCredentials.host,
        port: Int16(cloudantCredentials.port),
        secured: cloudantCredentials.secured,
        username: cloudantCredentials.username,
        password: cloudantCredentials.password
    )
    couchDBClient = CouchDBClient(connectionProperties: connectionProperties)
    Log.info("Found and loaded credentials for Cloudant.")
}
