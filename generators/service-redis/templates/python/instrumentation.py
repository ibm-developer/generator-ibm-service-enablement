import redis
from ibmcloudenv import IBMCloudEnv

uri = IBMCloudEnv.getString('redis_uri')
<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    return 'redis', redis.from_url(uri)
<% } else { %>
def getService():
    return 'redis', redis.from_url(uri)
<% } %>
