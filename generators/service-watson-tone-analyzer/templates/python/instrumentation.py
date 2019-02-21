from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import ToneAnalyzerV3

if IBMCloudEnv.getString('watson_tone_analyzer_apikey'):
    iam_url = 'https://iam.stage1.bluemix.net/identity/token' if 'staging' in IBMCloudEnv.getString('watson_tone_analyzer_iam_serviceid_crn') else 'https://iam.bluemix.net/identity/token'
    tone_analyzer = ToneAnalyzerV3(
        url=IBMCloudEnv.getString('watson_tone_analyzer_url'),
        iam_apikey=IBMCloudEnv.getString('watson_tone_analyzer_apikey'),
        version='2017-09-21',
        iam_url=iam_url)
else:
    tone_analyzer = ToneAnalyzerV3(
        username=IBMCloudEnv.getString('watson_tone_analyzer_username'),
        password=IBMCloudEnv.getString('watson_tone_analyzer_password'),
        version='2017-09-21')
{{#ifCond backendPlatform '===' 'python'}}
def getService(app):
    return 'watson-tone-analyzer', tone_analyzer
{{else}}
def getService():
    return 'watson-tone-analyzer', tone_analyzer
{{/ifCond}}
