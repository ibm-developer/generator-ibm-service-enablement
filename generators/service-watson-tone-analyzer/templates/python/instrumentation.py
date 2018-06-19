from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import ToneAnalyzerV3

if IBMCloudEnv.getString('watson_tone_analyzer_apikey'):
    iam_url = 'https://iam.stage1.bluemix.net/identity/token' if 'gateway-s.' in params.url else 'https://iam.bluemix.net/identity/token'
    iam_apikey = api_key = IBMCloudEnv.getString('watson_tone_analyzer_apikey')
    visual_recognition = VisualRecognitionV3(
        iam_url,
        iam_apikey)
else:
    tone_analyzer = ToneAnalyzerV3(
        username=IBMCloudEnv.getString('watson_tone_analyzer_username'),
        password=IBMCloudEnv.getString('watson_tone_analyzer_password'),
        version='2016-05-19')
<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    return 'watson-tone-analyzer', tone_analyzer
<% } else { %>
def getService():
    return 'watson-tone-analyzer', tone_analyzer
<% } %>
