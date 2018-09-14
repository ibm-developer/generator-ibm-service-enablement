from ibmcloudenv import IBMCloudEnv
import ibm_boto3
from ibm_botocore.client import Config

api_key = IBMCloudEnv.getString('cloud_object_storage_apikey')
service_instance_id = IBMCloudEnv.getString('cloud_object_storage_resource_instance_id')
auth_endpoint = 'https://iam.bluemix.net/oidc/token'
service_endpoint = 'https://s3-api.us-geo.objectstorage.softlayer.net'

cloud_object_storage = ibm_boto3.resource('s3',
ibm_api_key_id=api_key,
ibm_service_instance_id=service_instance_id,
ibm_auth_endpoint=auth_endpoint,
config=Config(signature_version='oauth'),
endpoint_url=service_endpoint)


{{#ifCond backendPlatform '===' 'python'}}
def getService(app):
    return 'cloud_object_storage', cloud_object_storage
{{else}}
def getService():
    return 'cloud_object_storage', cloud_object_storage
{{/ifCond}}
