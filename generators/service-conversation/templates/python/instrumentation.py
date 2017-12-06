from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import ConversationV1

conversation = ConversationV1(
    username=IBMCloudEnv.getDictionary('watson_conversation')['username'],
    password=IBMCloudEnv.getDictionary('watson_conversation')['password'],
    version='2017-05-26')

def getService(app):
    return 'watson-conversation', conversation