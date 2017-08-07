from ibm_cloud_env import IBMCloudEnv
from watson_developer_cloud import DiscoveryV1

discovery = DiscoveryV1(
    username=IBMCloudEnv.getString('watson_discovery_username'),
    password=IBMCloudEnv.getString('watson_discovery_password'),
    version='2016-12-01')

def getService():
    return 'watson-discovery', discovery