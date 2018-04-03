from ibmcloudenv import IBMCloudEnv
from pymongo import MongoClient
import os, base64

<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
	mongoConnect = IBMCloudEnv.getString('mongodb_uri')
	mongoCert = IBMCloudEnv.getString('mongodb_ca')

	fileDir = os.path.dirname(os.path.realpath(__file__))
	certDir = fileDir + '/certificates'
	if not os.path.exists(certDir):
		os.makedirs(certDir)

	certPath = certDir + '/mongo-ssl-cert.pem'
	with open(certPath, 'wb') as out:
		out.write(base64.b64decode(mongoCert))

	client = MongoClient(mongoConnect, ssl=True, ssl_ca_certs=certPath)

	return 'mongodb', client
<% } else { %>
def getService():
    mongoConnect = IBMCloudEnv.getString('mongodb_uri')
    mongoCert = IBMCloudEnv.getString('mongodb_ca')
        
    fileDir = os.path.dirname(os.path.realpath(__file__))
    certDir = fileDir + '/certificates'
    if not os.path.exists(certDir):
        os.makedirs(certDir)
    
    certPath = certDir + '/mongo-ssl-cert.pem'
    with open(certPath, 'wb') as out:
        out.write(base64.b64decode(mongoCert))
        
    client = MongoClient(mongoConnect, ssl=True, ssl_ca_certs=certPath)
        
    return 'mongodb', client
<% } %>
