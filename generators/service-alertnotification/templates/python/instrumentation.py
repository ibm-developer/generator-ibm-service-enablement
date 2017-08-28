from ibm_cloud_env import IBMCloudEnv

config = {
    'url' : IBMCloudEnv.getString('alert_notification_url') if True else https://ibmnotifybm.mybluemix.net/api/alerts/v1',
    'name': IBMCloudEnv.getString('alert_notification_name') if True else '',
    'password': IBMCloudEnv.getString('alert_notification_password') if True else ''
}

def getService(app):
    return 'alert-notification', config

