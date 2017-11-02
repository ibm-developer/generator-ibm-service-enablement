from ibmcloudenv import IBMCloudEnv
from ibmdbpy import IdaDataBase
from ibmdbpy import IdaDataFrame


def getService(app):

   idadb=IdaDataBase(dsn=IBMCloudEnv.getString('db2_jdbcurl'))

   content = {
        'idadb': idadb,
        'idadf': IdaDataFrame
   }

   return 'db2-json', content
