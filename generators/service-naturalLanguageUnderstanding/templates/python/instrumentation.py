from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import NaturalLanguageUnderstandingV1

natural_language_understanding = NaturalLanguageUnderstandingV1(
    username=IBMCloudEnv.getDictionary('watson-natural-language-understanding')['username'],
    password=IBMCloudEnv.getDictionary('watson-natural-language-understanding')['password'],
    version='2017-02-27')
<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    return 'watson-natural-language-understanding', natural_language_understanding
<% } else { %>
def getService():
    return 'watson-natural-language-understanding', natural_language_understanding
<% } %>
