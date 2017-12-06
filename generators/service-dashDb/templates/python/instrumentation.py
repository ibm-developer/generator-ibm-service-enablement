from ibmcloudenv import IBMCloudEnv
from ibmdbpy import IdaDataBase
from ibmdbpy import IdaDataFrame


<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):

   idadb=IdaDataBase(dsn=IBMCloudEnv.getDictionary('dashdb')['jdbcurl'])

   content = {
        'idadb': idadb,
        'idadf': IdaDataFrame
   }

   return 'dashdb-json', content
<% } else { %>
def getService(app):
    
    idadb=IdaDataBase(dsn=IBMCloudEnv.getString('dashdb_jdbcurl'))
        
    content = {
        'idadb': idadb,
        'idadf': IdaDataFrame
            }
                
    return 'dashdb-json', content
<% } %>
