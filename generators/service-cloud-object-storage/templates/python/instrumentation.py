from ibmcloudenv import IBMCloudEnv
import ibm_boto3
from ibm_botocore.client import Config

api_key = IBMCloudEnv.getString('cos_apikey')
service_instance_id = IBMCloudEnv.getString('cos_resource_instance_id')
auth_endpoint = 'https://iam.bluemix.net/oidc/token'
service_endpoint = 'https://s3-api.us-geo.objectstorage.softlayer.net'

cos = ibm_boto3.resource('s3',
ibm_api_key_id=api_key,
ibm_service_instance_id=service_instance_id,
ibm_auth_endpoint=auth_endpoint,
config=Config(signature_version='oauth'),
endpoint_url=service_endpoint)


<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    return 'cos', cos
<% } else { %>
def getService():
    return 'cos', cos
<% } %>
