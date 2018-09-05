import redis
from ibmcloudenv import IBMCloudEnv

uri = IBMCloudEnv.getString('redis_uri')
{{#ifCond backendPlatform '===' 'python'}}
def getService(app):
    return 'redis', redis.from_url(uri)
{{else}}
def getService():
    return 'redis', redis.from_url(uri)
{{/ifCond}}
