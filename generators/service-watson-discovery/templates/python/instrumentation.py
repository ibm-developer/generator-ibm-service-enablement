from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import DiscoveryV1

if IBMCloudEnv.getString('watson_discovery_apikey'):
    iam_url = 'https://iam.stage1.bluemix.net/identity/token' if 'staging' in IBMCloudEnv.getString('watson_discovery_iam_serviceid_crn') else 'https://iam.bluemix.net/identity/token'
    discovery = DiscoveryV1(
        url=IBMCloudEnv.getString('watson_discovery_url'),
        iam_apikey=IBMCloudEnv.getString('watson_discovery_apikey'),
        version='2018-12-03',
        iam_url=iam_url)
else:
    discovery = DiscoveryV1(
        username=IBMCloudEnv.getString('watson_discovery_username'),
        password=IBMCloudEnv.getString('watson_discovery_password'),
        version='2018-12-03')

{{#ifCond backendPlatform '===' 'python'}}
def getService(app):
    return 'watson-discovery', discovery
{{else}}
def getService():
    return 'watson-discovery', discovery
{{/ifCond}}
