import Foundation
import Dispatch
import LoggerAPI
import CloudEnvironment
import SwiftKueryPostgreSQL

func initializeServicePostgre(cloudEnv: CloudEnv) throws -> PostgreSQLConnection {
    // Load credentials for PostgreSQL db using CloudEnvironment
    guard let credentials = cloudEnv.getPostgreSQLCredentials(name: "{{servLookupKey}}") else {
        throw InitializationError("Could not load credentials for PostgreSQL.")
    }
    Log.info("Found and loaded credentials for PostgreSQL.")

    let connOptions: [ConnectionOptions] = [.userName(credentials.username), .password(credentials.password), .databaseName(credentials.database)]
    let postgreSQLConn = PostgreSQLConnection(host: credentials.host, port: Int32(credentials.port), options: connOptions)

    // Establish connection to PostgreSQL database
    try connect(conn: postgreSQLConn)
    return postgreSQLConn
}

private func connect(conn: PostgreSQLConnection) throws {
    // Making network call synchronous since we need to know the result before proceeding...
    let semaphore = DispatchSemaphore(value: 0)
    Log.verbose("Making network call synchronous...")
    var connected: Bool = false
    conn.connect { error in
        if let error = error {
            Log.error("Could not establish connection to PostgreSQL: \(error)")
            connected = false
        } else {
            Log.info("Successfully established connection to PostgreSQL.")
            connected = true
        }
        semaphore.signal()
    }

    let _ = semaphore.wait(timeout: DispatchTime.distantFuture)
    if !connected {
        throw InitializationError("Failed to establish connection to PostgreSQL.")
    }
}
