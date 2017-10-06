from ibmcloudenv import IBMCloudEnv
from pymongo import MongoClient


def getService(app):
    mongoConnect = IBMCloudEnv.getString('mongodb_uri')

    client = MongoClient(mongoConnect)

    return 'mongodb', client
