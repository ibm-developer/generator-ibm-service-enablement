from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import NaturalLanguageUnderstandingV1

if IBMCloudEnv.getString('watson-natural-language-understanding_apikey'):
    iam_url = 'https://iam.stage1.bluemix.net/identity/token' if 'gateway-s.' in params.url else 'https://iam.bluemix.net/identity/token'
    iam_apikey = api_key=IBMCloudEnv.getString('watson-natural-language-understanding_apikey')
    visual_recognition = VisualRecognitionV3(
        iam_url,
        iam_apikey)
else:
    natural_language_understanding = NaturalLanguageUnderstandingV1(
        username=IBMCloudEnv.getString('watson_natural_language_understanding_username'),
        password=IBMCloudEnv.getString('watson_natural_language_understanding_password'),
        version='2017-02-27')
<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    return 'watson-natural-language-understanding', natural_language_understanding
<% } else { %>
def getService():
    return 'watson-natural-language-understanding', natural_language_understanding
<% } %>
