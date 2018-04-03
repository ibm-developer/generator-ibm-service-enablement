from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import VisualRecognitionV3

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
