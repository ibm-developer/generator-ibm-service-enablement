from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import DiscoveryV1

params = {
    version: '2018-02-16',
    url: IBMCloudEnv.getString('watson_discovery_url')
}
if IBMCloudEnv.getString('watson_discovery_apikey'):
    iam_url = 'https://iam.stage1.bluemix.net/identity/token' if 'gateway-s.' in params.url else 'https://iam.bluemix.net/identity/token'
    iam_apikey = api_key=IBMCloudEnv.getString('watson_discovery_apikey')
    visual_recognition = VisualRecognitionV3(
        iam_url,
        iam_apikey)
else:
    discovery = DiscoveryV1(
        username=IBMCloudEnv.getString('watson_discovery_username'),
        password=IBMCloudEnv.getString('watson_discovery_password'),
        version='2016-12-01')

<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    return 'watson-discovery', discovery
<% } else { %>
def getService():
    return 'watson-discovery', discovery
<% } %>
