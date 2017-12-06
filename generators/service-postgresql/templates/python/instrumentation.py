from ibmcloudenv import IBMCloudEnv
import psycopg2

url = IBMCloudEnv.getDictionary('postgre')['uri']
<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    client = psycopg2.connect(url)
    return 'postgre-client', client
<% } else { %>
def getService():
    client = psycopg2.connect(url)
    return 'postgre-client', client
<% } %>
