from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import TextToSpeechV1

if IBMCloudEnv.getString('watson_text_to_speech_apikey'):
    iam_url = 'https://iam.stage1.bluemix.net/identity/token' if 'staging' in IBMCloudEnv.getString('watson_text_to_speech_iam_role_crn') else 'https://iam.bluemix.net/identity/token'
    text_to_speech = TextToSpeechV1(
        url=IBMCloudEnv.getString('watson_text_to_speech_url'),
        iam_apikey=IBMCloudEnv.getString('watson_text_to_speech_apikey'),
        iam_url=iam_url)
else:
    text_to_speech = TextToSpeechV1(
        username=IBMCloudEnv.getString('watson_text_to_speech_username'),
        password=IBMCloudEnv.getString('watson_text_to_speech_password'),
        x_watson_learning_opt_out=True)
{{#ifCond backendPlatform '===' 'python'}}
def getService(app):
    return 'watson-text-to-speech', text_to_speech
{{else}}
def getService():
    return 'watson-text-to-speech', text_to_speech
{{/ifCond}}
