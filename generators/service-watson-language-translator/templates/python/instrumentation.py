from ibm_cloud_env import IBMCloudEnv
from watson_developer_cloud import LanguageTranslatorV2

language_translator = LanguageTranslatorV2(
    username=IBMCloudEnv.getString('watson_language_translator_username'),
    password=IBMCloudEnv.getString('watson_language_translator_password'))

def getService():
    return 'watson-language-translator', language_translator