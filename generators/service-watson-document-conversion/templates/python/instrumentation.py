from ibm_cloud_env import IBMCloudEnv
from watson_developer_cloud import DocumentConversionV1

document_conversion = DocumentConversionV1(
    username=IBMCloudEnv.getString('watson_document_conversion_username'),
    password=IBMCloudEnv.getString('watson_document_conversion_password'),
    version='2016-02-10')

def getService():
    return 'watson-document-conversion', document_conversion