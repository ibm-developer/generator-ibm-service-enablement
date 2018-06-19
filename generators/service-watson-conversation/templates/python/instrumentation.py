from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import AssistantV1


params = {
    'version': '2018-02-16',
    'url': IBMCloudEnv.getString('watson_conversation_url')
}

if IBMCloudEnv.getString('watson_conversation_apikey'):
    iam_url = 'https://iam.stage1.bluemix.net/identity/token' if 'gateway-s.' in params['url'] else 'https://iam.bluemix.net/identity/token'
    iam_apikey = IBMCloudEnv.getString('watson_conversation_apikey')
    conversation = AssistantV1(
        url=IBMCloudEnv.getString('watson_conversation_url'),
        iam_api_key=iam_apikey,
        version='2018-02-16')
else:
    conversation = AssistantV1(
    version='2018-02-16',
    url=IBMCloudEnv.getString('watson_conversation_url')
        
<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    return'watson-conversation', conversation
<% } else { %>
def getService():
    return 'watson-conversation', conversation
<% } %>
