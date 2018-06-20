from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import VisualRecognitionV3

if IBMCloudEnv.getString('watson_visual_recognition_api_key'):
    iam_url = 'https://iam.stage1.bluemix.net/identity/token' if 'gateway-s.' in paramx.url else 'https://iam.bluemix.net/identity/token'
    visual_recognition = VisualRecognitionV3(
        url=IBMCloudEnv.getString('watson_visual_recognition_url'),
        iam_api_key=IBMCloudEnv.getString('watson_visual_recognition_api_key'),
        version='2016-05-20',
        iam_url=iam_url)
else:
    visual_recognition = VisualRecognitionV3(
        api_key=IBMCloudEnv.getString('watson_visual_recognition_api_key'),
        version='2016-05-20')
<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    return 'watson-visual-recognition', visual_recognition
<% } else { %>
def getService():
    return 'watson-visual-recognition', visual_recognition
<% } %>
