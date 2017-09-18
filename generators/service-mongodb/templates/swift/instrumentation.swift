import LoggerAPI
import MongoKitten

var mongodb: Database!

func initializeServiceMongodb() throws {
    guard let mongodbCredentials = cloudEnv.getDictionary(name: "{{servLookupKey}}"),
          let mongodbURI = mongodbCredentials["uri"] as? String else {
        throw InitializationError("Could not load credentials for MongoDB.")
    }
    mongodb = try Database(mongodbURI)
    Log.info("Found and loaded credentials for MongoDB.")
}
