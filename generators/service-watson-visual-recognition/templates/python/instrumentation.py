from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import VisualRecognitionV3

iam_url = 'https://iam.stage1.bluemix.net/identity/token' if 'staging' in IBMCloudEnv.getString('watson_visual_recognition_iam_serviceid_crn') else 'https://iam.bluemix.net/identity/token'
visual_recognition = VisualRecognitionV3(
    url=IBMCloudEnv.getString('watson_visual_recognition_url'),
    iam_apikey=IBMCloudEnv.getString('watson_visual_recognition_apikey'),
    version='2018-03-19',
    iam_url=iam_url)
{{#ifCond backendPlatform '===' 'python'}}
def getService(app):
    return 'watson-visual-recognition', visual_recognition
{{else}}
def getService():
    return 'watson-visual-recognition', visual_recognition
{{/ifCond}}
