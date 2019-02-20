from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import NaturalLanguageClassifierV1


if IBMCloudEnv.getString('watson_natural_language_classifier_apikey'):
    iam_url = 'https://iam.stage1.bluemix.net/identity/token' if 'staging' in IBMCloudEnv.getString('watson_natural_language_classifier_iam_serviceid_crn') else 'https://iam.bluemix.net/identity/token'
    natural_language_classifier = NaturalLanguageClassifierV1(
        url=IBMCloudEnv.getString('watson_natural_language_classifier_url'),
        iam_apikey=IBMCloudEnv.getString('watson_natural_language_classifier_apikey'),
        iam_url=iam_url)
else:
    natural_language_classifier = NaturalLanguageClassifierV1(
        username=IBMCloudEnv.getString('watson_natural_language_classifier_username'),
        password=IBMCloudEnv.getString('watson_natural_language_classifier_password'))
{{#ifCond backendPlatform '===' 'python'}}
def getService(app):
    return 'watson-natural-language-classifier', natural_language_classifier
{{else}}
def getService():
    return 'watson-natural-language-classifier', natural_language_classifier
{{/ifCond}}
