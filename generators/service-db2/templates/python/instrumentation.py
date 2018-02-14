from ibmcloudenv import IBMCloudEnv
from ibmdbpy import IdaDataBase
from ibmdbpy import IdaDataFrame

<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):

   idadb=IdaDataBase(dsn=IBMCloudEnv.getDictionary('db2')['jdbcurl'])

   content = {
        'idadb': idadb,
        'idadf': IdaDataFrame
   }

   return 'db2-json', content
<% } else { %>
def getService():
    
    idadb=IdaDataBase(dsn=IBMCloudEnv.getString('db2_jdbcurl'))
        
    content = {
        'idadb': idadb,
        'idadf': IdaDataFrame
            }
                
    return 'db2-json', content
<% } %>
