from ibmcloudenv import IBMCloudEnv
import requests

class Alert:
	def __init__(self, url, user, password):
		self.url = url
		self.user = user
		self.password = password
		self.auth = (user, password)

	def sendAlert(self, payload):
		res = requests.post(self.url, auth=self.auth, json=payload)
		response = res.json()
		return response

	def getAlert(self, alertID):
		res = requests.get(self.url + '/' + str(alertID), auth=self.auth)
		response = res.json()
		return response

	def deleteAlert(self, alertID):
		res = requests.delete(self.url + '/' + str(alertID), auth=self.auth)
		return res
<% if(bluemix.backendPlatform.toLowerCase() === 'python') { %>
def getService(app):
	url = IBMCloudEnv.getDictionary('alert_notification')['url']
	user = IBMCloudEnv.getDictionary('alert_notification')['name']
	password = IBMCloudEnv.getDictionary('alert_notification')['password']
	return 'alert-notification', Alert(url, user, password)
<% } else { %>
def getService():
    url = IBMCloudEnv.getDictionary('alert_notification')['url']
	user = IBMCloudEnv.getDictionary('alert_notification')['name']
	password = IBMCloudEnv.getDictionary('alert_notification')['password']
    return 'alert-notification', Alert(url, user, password)
<% } %>
