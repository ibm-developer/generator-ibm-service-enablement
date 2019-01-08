import Foundation
import Dispatch
import LoggerAPI
import CloudEnvironment
import SwiftKueryPostgreSQL
import SwiftKueryORM

func initializeServicePostgre(cloudEnv: CloudEnv) throws {
    // Load credentials for PostgreSQL db using CloudEnvironment
    guard let credentials = cloudEnv.getPostgreSQLCredentials(name: "{{servLookupKey}}") else {
        throw InitializationError("Could not load credentials for PostgreSQL.")
    }
    Log.info("Found and loaded credentials for PostgreSQL.")

    let connOptions: [ConnectionOptions] = [.userName(credentials.username), .password(credentials.password), .databaseName(credentials.database)]
    let poolOptions = ConnectionPoolOptions(initialCapacity: 10, maxCapacity: 50)
    let pool = PostgreSQLConnection.createPool(host: credentials.host, port: Int32(credentials.port), options: connOptions, poolOptions: poolOptions)
    let database = Database(pool)

    Database.default = database
}
