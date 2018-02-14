from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import TextToSpeechV1

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
