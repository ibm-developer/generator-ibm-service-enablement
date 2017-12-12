from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import LanguageTranslatorV2

language_translator = LanguageTranslatorV2(
    username=IBMCloudEnv.getString('watson_language_translator_username'),
    password=IBMCloudEnv.getString('watson_language_translator_password'))
<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    return 'watson-language-translator', language_translator
<% } else { %>
def getService():
    return 'watson-language-translator', language_translator
<% } %>
