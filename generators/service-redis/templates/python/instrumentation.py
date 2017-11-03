import redis
from ibmcloudenv import IBMCloudEnv

uri = IBMCloudEnv.getString('redis_uri')

def getService(app):
    return 'redis', redis.from_url(uri)