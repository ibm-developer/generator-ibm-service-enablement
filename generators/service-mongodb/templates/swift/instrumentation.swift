import LoggerAPI
import MongoKitten

var mongodb: Database!

func initializeServiceMongodb() throws {
    guard let mongodbCredentials = cloudEnv.getMongoDBCredentials(name: "{{servLookupKey}}") else {
        throw InitializationError("Could not load credentials for MongoDB.")
    }
    mongodb = try Database(mongodbCredentials.uri)
    Log.info("Found and loaded credentials for MongoDB.")
}
