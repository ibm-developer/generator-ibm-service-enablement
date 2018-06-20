from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import TextToSpeechV1

if IBMCloudEnv.getString('watson-text-to-speech_apikey'):
    iam_url = 'https://iam.stage1.bluemix.net/identity/token' if 'gateway-s.' in params.url else 'https://iam.bluemix.net/identity/token'
    text_to_speech = TextToSpeechV1(
        url=IBMCloudEnv.getString('watson_text_to_speech_url'),
        iam_api_key=IBMCloudEnv.getString('watson-text-to-speech_apikey'),
        iam_url=iam_url)
else:
    text_to_speech = TextToSpeechV1(
        username=IBMCloudEnv.getString('watson_text_to_speech_username'),
        password=IBMCloudEnv.getString('watson_text_to_speech_password'),
        x_watson_learning_opt_out=True)
<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    return 'watson-text-to-speech', text_to_speech
<% } else { %>
def getService():
    return 'watson-text-to-speech', text_to_speech
<% } %>
