from ibmcloudenv import IBMCloudEnv
from ibmdbpy import IdaDataBase
from ibmdbpy import IdaDataFrame


def getService(app):

   idadb=IdaDataBase(dsn=IBMCloudEnv.getString('dashdb_jdbcurl'))

   content = {
        'idadb': idadb,
        'idadf': IdaDataFrame
   }

   return 'dashdb-json', content
