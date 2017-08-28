import redis
from ibm_cloud_env import IBMCloudEnv


uri = IBMCloud.getString('redis_uri')


def getService(app):
    return 'redis', redis.from_url(uri)