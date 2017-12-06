from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import LanguageTranslatorV2

language_translator = LanguageTranslatorV2(
    username=IBMCloudEnv.getString('watson-language-translator')['username'],
    password=IBMCloudEnv.getString('watson-language-translator')['password'])

def getService(app):
    return 'watson-language-translator', language_translator