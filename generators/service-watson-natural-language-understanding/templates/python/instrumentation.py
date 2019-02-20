from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import NaturalLanguageUnderstandingV1

if IBMCloudEnv.getString('watson_natural_language_understanding_apikey'):
    iam_url = 'https://iam.stage1.bluemix.net/identity/token' if 'staging' in IBMCloudEnv.getString('watson_natural_language_understanding_iam_serviceid_crn') else 'https://iam.bluemix.net/identity/token'
    natural_language_understanding = NaturalLanguageUnderstandingV1(
        url=IBMCloudEnv.getString('watson_natural_language_understanding_url'),
        iam_apikey=IBMCloudEnv.getString('watson_natural_language_understanding_apikey'),
        version='2018-11-16',
        iam_url=iam_url)
else:
    natural_language_understanding = NaturalLanguageUnderstandingV1(
        username=IBMCloudEnv.getString('watson_natural_language_understanding_username'),
        password=IBMCloudEnv.getString('watson_natural_language_understanding_password'),
        version='2018-11-16')
{{#ifCond backendPlatform '===' 'python'}}
def getService(app):
    return 'watson-natural-language-understanding', natural_language_understanding
{{else}}
def getService():
    return 'watson-natural-language-understanding', natural_language_understanding
{{/ifCond}}
