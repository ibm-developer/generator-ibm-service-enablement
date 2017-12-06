from ibmcloudenv import IBMCloudEnv
import swiftclient

authurl = IBMCloudEnv.getDictionary('object_storage')['auth_url']
if not '/v3' in authurl:
    authurl+='/v3'
user = IBMCloudEnv.getDictionary('object_storage')['userId']
key = IBMCloudEnv.getDictionary('object_storage')['password']
os_options = {
    'project_id': IBMCloudEnv.getDictionary('object_storage')['projectId'],
    'user_id': IBMCloudEnv.getDictionary('object_storage')['userId'],
    'region_name': IBMCloudEnv.getDictionary('object_storage')['region']
}

def getService(app):
    objectStorage = swiftclient.Connection(authurl=authurl,user=user,key=key,os_options=os_options, auth_version='3')

    return 'object-storage', objectStorage
