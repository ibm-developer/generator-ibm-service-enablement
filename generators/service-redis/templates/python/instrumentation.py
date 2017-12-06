import redis
from ibmcloudenv import IBMCloudEnv

uri = IBMCloudEnv.getDictionary('redis')['uri']
<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    return 'redis', redis.from_url(uri)
<% } else { %>
def getService():
    return 'redis', redis.from_url(uri)
<% } %>
