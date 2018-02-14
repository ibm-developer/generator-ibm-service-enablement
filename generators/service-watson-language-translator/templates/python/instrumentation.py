from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import LanguageTranslatorV2

'username'
'password'
language_translator = LanguageTranslatorV2(
    username=IBMCloudEnv.getString('watson_language_translator_username'),
    password=IBMCloudEnv.getString('watson_language_translator_password')

def getService(app):
    return 'watson-language-translator', language_translator
