from ibmcloudenv import IBMCloudEnv
from cloudant.client import Cloudant

username = IBMCloudEnv.getDictionary('cloudant')['username']
password = IBMCloudEnv.getDictionary('cloudant')['password']
url = IBMCloudEnv.getDictionary('cloudant')['url']

cloudant = Cloudant(username, password, url=url, connect=True, auto_renew=True)

<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    return 'cloudant', cloudant
<% } else { %>
def getService():
    return 'cloudant', cloudant
<% } %>
