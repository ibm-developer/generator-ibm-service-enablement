from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import NaturalLanguageUnderstandingV1

natural_language_understanding = NaturalLanguageUnderstandingV1(
    username=IBMCloudEnv.getString('watson_natural_language_understanding_username'),
    password=IBMCloudEnv.getString('watson_natural_language_understanding_password'),
    version='2017-02-27')
<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    return 'watson-natural-language-understanding', natural_language_understanding
<% } else { %>
def getService():
    return 'watson-natural-language-understanding', natural_language_understanding
<% } %>
