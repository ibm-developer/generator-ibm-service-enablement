from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import SpeechToTextV1

if IBMCloudEnv.getString('watson_speech_to_text_apikey'):
    iam_url = 'https://iam.stage1.bluemix.net/identity/token' if 'staging' in IBMCloudEnv.getString('watson_speech_to_text_iam_serviceid_crn') else 'https://iam.bluemix.net/identity/token'
    speech_to_text = SpeechToTextV1(
        url=IBMCloudEnv.getString('watson_speech_to_text_url'),
        iam_apikey=IBMCloudEnv.getString('watson_speech_to_text_apikey'),
        iam_url=iam_url)
else:
    speech_to_text = SpeechToTextV1(
        username=IBMCloudEnv.getString('watson_speech_to_text_username'),
        password=IBMCloudEnv.getString('watson_speech_to_text_password'),
        x_watson_learning_opt_out=True)

{{#ifCond backendPlatform '===' 'python'}}
def getService(app):
    return 'watson-speech-to-text', speech_to_text
{{else}}
def getService():
    return 'watson-speech-to-text', speech_to_text
{{/ifCond}}
