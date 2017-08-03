from ibm_cloud_env import IBMCloudEnv
from cloudant.client import Cloudant

cloudant = Cloudant(IBMCloudEnv.getString('cloudant_url')

def getService():
    return 'cloudant', cloudant