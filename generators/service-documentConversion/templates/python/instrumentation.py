from ibmcloudenv import IBMCloudEnv
from watson_developer_cloud import DocumentConversionV1

document_conversion = DocumentConversionV1(
    username=IBMCloudEnv.getString('watson_document_conversion')['username'],
    password=IBMCloudEnv.getString('watson_document_conversion')['password'],
    version='2016-02-10')

def getService(app):
    return 'watson-document-conversion', document_conversion