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

	def getAlert(self, id):
		res = requests.get(self.url + '/' + str(id), auth=self.auth)
		response = res.json()
		return response

	def deleteAlert(self, id):
		res = requests.delete(self.url + '/' + str(id), auth=self.auth)
		return res

def getService(app):
	url = IBMCloudEnv.getString('alert_notification_url')
	user = IBMCloudEnv.getString('alert_notification_name')
	password = IBMCloudEnv.getString('alert_notification_password')
	return 'alert-notification', Alert(url, user, password)
