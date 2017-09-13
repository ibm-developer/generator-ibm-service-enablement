import LoggerAPI
import CloudEnvironment
import SwiftRedis

let redis = Redis()
var redisCredentials: RedisCredentials!

func initializeServiceRedis() throws {
    guard let redisCredentialsLocal = cloudEnv.getRedisCredentials(name: "{{servLookupKey}}") else {
        throw InitializationError("Could not load credentials for Redis.")
    }
    redisCredentials = redisCredentialsLocal
    Log.info("Found and loaded credentials for Redis.")
}
