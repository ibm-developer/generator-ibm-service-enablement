from ibmcloudenv import IBMCloudEnv
from ibmdbpy import IdaDataBase
from ibmdbpy import IdaDataFrame


{{#ifCond backendPlatform '===' 'python'}}
def getService(app):

   idadb=IdaDataBase(dsn=IBMCloudEnv.getString('dashdb_jdbcurl')

   content = {
        'idadb': idadb,
        'idadf': IdaDataFrame
   }

   return 'dashdb-json', content
{{else}}
def getService(app):

    idadb=IdaDataBase(dsn=IBMCloudEnv.getString('dashdb_jdbcurl'))

    content = {
        'idadb': idadb,
        'idadf': IdaDataFrame
            }

    return 'dashdb-json', content
{{/ifCond}}
