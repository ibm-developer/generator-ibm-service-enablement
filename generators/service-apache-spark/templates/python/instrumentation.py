from ibmcloudenv import IBMCloudEnv

# Apache Spark Python SDK is not available yet
# Docs - https://www.ng.bluemix.net/docs/services/AnalyticsforApacheSpark


<% if (bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
    return 'apache-spark', "n/a"
<% } else { %>
def getService():
    return 'apache-spark', "n/a"
<% } %>
