import LoggerAPI
import CloudEnvironment
import SwiftRedis

let redis = Redis()

func initializeServiceRedis(cloudEnv: CloudEnv) throws -> RedisCredentials {
    guard let redisCredentials = cloudEnv.getRedisCredentials(name: "{{servLookupKey}}") else {
        throw InitializationError("Could not load credentials for Redis.")
    }
    Log.info("Found and loaded credentials for Redis.")
    return redisCredentials
}
