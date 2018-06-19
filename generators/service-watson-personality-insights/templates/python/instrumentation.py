from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import PersonalityInsightsV3

if IBMCloudEnv.getString('watson_personality_insights_apikey')
    iam_url = 'https://iam.stage1.bluemix.net/identity/token' if 'gateway-s.' in params.url else 'https://iam.bluemix.net/identity/token'
    iam_apikey = api_key = IBMCloudEnv.getString('watson_personality_insights_apikey')

    personality_insights = PersonalityInsightsV3(
        url=IBMCloudEnv.getString('watson_personality_insights_url'),
        iam_api_key=iam_apikey,
        version='2017-10-13')
    
else:
    personality_insights = PersonalityInsightsV3(
        username=IBMCloudEnv.getString('watson_personality_insights_username')['username'],
        password=IBMCloudEnv.getString('watson_personality_insights_password')['password'],
        version='2017-10-13')

<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    return 'watson-personality-insights', personality_insights
<% } else { %>
def getService():
    return 'watson-personality-insights', personality_insights
<% } %>
