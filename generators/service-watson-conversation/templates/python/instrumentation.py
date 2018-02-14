from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import ConversationV1

conversation = ConversationV1(
    username=IBMCloudEnv.getString('watson_conversation_username'),
    password=IBMCloudEnv.getString('watson_conversation_password'),
    version='2017-05-26')

def getService(app):
    return 'watson-conversation', conversation
