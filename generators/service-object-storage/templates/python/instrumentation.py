from ibm_cloud_env import IBMCloudEnv
import swiftclient

credentials = {
    'auth_version': '3',
    'os_options': {
        'project_id': IBMCloudEnv.getString("object_storage_project_id"),
        'user_id': IBMCloudEnv.getString("object_storage_user_id"),
        'region_name': IBMCloudEnv.getString("object_storage_region")
    }
}

def getService(app):
    objectStorage = swiftclient.Connection(credentials)
    return 'object-storage', objectStorage