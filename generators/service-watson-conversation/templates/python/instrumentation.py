from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import ConversationV1


params = {
    version: '2018-02-16',
    url: IBMCloudEnv.getString('watson_conversation_url')
}

if IBMCloudEnv.getString('watson_conversation_apikey'):

    iam_apikey = api_key=IBMCloudEnv.getString('watson_conversation_apikey')
    visual_recognition = VisualRecognitionV3(
        iam_url,
        iam_apikey)
else:
    conversation = ConversationV1(
        username=IBMCloudEnv.getString('watson_conversation_username'),
        password=IBMCloudEnv.getString('watson_conversation_password'),
        version='2017-05-26')

<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    return'watson-conversation', conversation
<% } else { %>
def getService():
    return 'watson-conversation', conversation
<% } %>
