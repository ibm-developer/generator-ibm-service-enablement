from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import NaturalLanguageClassifierV1

natural_language_classifier = NaturalLanguageClassifierV1(
:wq
    username=IBMCloudEnv.getString('watson_natural_language_classifier_username'),
    password=IBMCloudEnv.getString('watson_natural_language_classifier_password'))
<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    return 'watson-natural-language-classifier', natural_language_classifier
<% } else { %>
def getService():
    return 'watson-natural-language-classifier', natural_language_classifier
<% } %>
