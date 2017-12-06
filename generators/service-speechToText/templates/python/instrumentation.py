from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import SpeechToTextV1

speech_to_text = SpeechToTextV1(
    username=IBMCloudEnv.getDictionary('watson_speech_to_text').username,
    password=IBMCloudEnv.getDictionary('watson_speech_to_text').password,
    x_watson_learning_opt_out=True)
<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    return 'watson-speech-to-text', speech_to_text
<% } else { %>
def getService():
    return 'watson-speech-to-text', speech_to_text
<% } %>
