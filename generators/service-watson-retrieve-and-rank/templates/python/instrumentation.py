from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import RetrieveAndRankV1

retrieve_and_rank = RetrieveAndRankV1(
    username=IBMCloudEnv.getString('watson_retrieve_and_rank_username'),
    password=IBMCloudEnv.getString('watson_retrieve_and_rank_password'))
<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    return 'watson-retrieve-and-rank', retrieve_and_rank
<% } else { %>
def getService():
    return 'watson-retrieve-and-rank', retrieve_and_rank
<% } %>
