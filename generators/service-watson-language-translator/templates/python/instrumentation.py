from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import LanguageTranslatorV2

if IBMCloudEnv.getString('watson_language_translator_apikey'):
    iam_url = 'https://iam.stage1.bluemix.net/identity/token' if 'gateway-s.' in params.url else 'https://iam.bluemix.net/identity/token'
    iam_apikey = api_key=IBMCloudEnv.getString('watson_language_translator_apikey')
    language_translator = LanguageTranslatorV2(
        url=IBMCloudEnv.getString('watson_language_translator_url'),
        iam_api_key=iam_apikey)
else:
    language_translator = LanguageTranslatorV2(
        username=IBMCloudEnv.getString('watson_language_translator_username'),
        password=IBMCloudEnv.getString('watson_language_translator_password')

<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    return 'watson-language-translator', language_translator
<% } else { %>
def getService():
    return 'watson-language-translator', language_translator
<% } %>
