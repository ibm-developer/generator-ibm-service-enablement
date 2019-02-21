from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import PersonalityInsightsV3

if IBMCloudEnv.getString('watson_personality_insights_apikey'):
    iam_url = 'https://iam.stage1.bluemix.net/identity/token' if 'staging' in IBMCloudEnv.getString('watson_personality_insights_iam_serviceid_crn') else 'https://iam.bluemix.net/identity/token'
    personality_insights = PersonalityInsightsV3(
        url=IBMCloudEnv.getString('watson_personality_insights_url'),
        iam_apikey=IBMCloudEnv.getString('watson_personality_insights_apikey'),
        version='2017-10-13',
        iam_url=iam_url)
else:
    personality_insights = PersonalityInsightsV3(
        username=IBMCloudEnv.getString('watson_personality_insights_username'),
        password=IBMCloudEnv.getString('watson_personality_insights_password'),
        version='2017-10-13')
{{#ifCond backendPlatform '===' 'python'}}
def getService(app):
    return 'watson-personality-insights', personality_insights
{{else}}
def getService():
    return 'watson-personality-insights', personality_insights
{{/ifCond}}
