from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import RetrieveAndRankV1
'username'
'password'
retrieve_and_rank = RetrieveAndRankV1(
    username=IBMCloudEnv.getString('watson_retrieve_and_rank_username'),
    password=IBMCloudEnv.getString('watson_retrieve_and_rank_password'))

def getService(app):
    return 'watson-retrieve-and-rank', retrieve_and_rank
