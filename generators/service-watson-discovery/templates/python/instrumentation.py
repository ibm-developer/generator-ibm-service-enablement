from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import DiscoveryV1

if IBMCloudEnv.getString('watson_discovery_apikey'):
    iam_url = 'https://iam.stage1.bluemix.net/identity/token' if 'gateway-s.' in IBMCloudEnv.getString('watson_discovery_url') else 'https://iam.bluemix.net/identity/token'
    discovery = DiscoveryV1(
        url=IBMCloudEnv.getString('watson_discovery_url'),
        iam_api_key=IBMCloudEnv.getString('watson_discovery_apikey'),
        version='2018-03-05',
        iam_url=iam_url)
else:
    discovery = DiscoveryV1(
        username=IBMCloudEnv.getString('watson_discovery_username'),
        password=IBMCloudEnv.getString('watson_discovery_password'),
        version='2018-02-16')

<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    return 'watson-discovery', discovery
<% } else { %>
def getService():
    return 'watson-discovery', discovery
<% } %>
