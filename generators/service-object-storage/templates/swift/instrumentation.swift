import LoggerAPI
import CloudEnvironment
import BluemixObjectStorage
import Dispatch

func initializeServiceObjectStorage(cloudEnv: CloudEnv) throws -> ObjectStorage {
    // Load credentials for Object Storage using CloudEnvironment
    guard let storageCredentials = cloudEnv.getObjectStorageCredentials(name: "{{servLookupKey}}") else {
        throw InitializationError("Could not load credentials for Object Storage.")
    }
    guard let connectedObjectStorage = createObjectStorageAndConnect(credentials: storageCredentials) else {
        throw InitializationError("Could not connect to Object Storage")
    }
    Log.info("Found and loaded credentials for Object Storage.")
    return connectedObjectStorage
}

private func createObjectStorageAndConnect(credentials: ObjectStorageCredentials) -> ObjectStorage? {
    // Need to make network call synchronous since we need to know the result before proceeding.
    let semaphore = DispatchSemaphore(value: 0)
    var authenticated = false
    let objStorage = ObjectStorage(projectId: credentials.projectID)
    // Object Storage SDK requires region in uppercase
    let region = credentials.region.uppercased()
    Log.verbose("Making network call synchronous...")
    objStorage.connect(userId: credentials.userID, password: credentials.password, region: region) { error in
        if let error = error {
            Log.error("Could not connect to Object Storage. Error was: '\(error)'.")
            authenticated = false
        } else {
            Log.verbose("Successfully obtained authentication token for Object Storage.")
            authenticated = true
        }
        semaphore.signal()
    }
    let _ = semaphore.wait(timeout: DispatchTime.distantFuture)
    return (authenticated) ? objStorage : nil
}
