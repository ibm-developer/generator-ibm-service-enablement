from ibmcloudenv import IBMCloudEnv
from requests import get, post, put, delete
import json

class Push:
	def __init__(self, url, appSecret, clientSecret):
		self.__url = url
		self.__headers = {
			'accept': 'application/json',
			'appSecret': appSecret,
			'clientSecret': clientSecret,
			'content-type': 'application/json',
		}

	def sendPush(self, payload):
		return self.post('/messages', payload)

	def get(self, endpoint, payload):
		data = json.dumps(payload)
		r = get(self.__url + endpoint, headers=self.__headers, data=data)
		response = r.json()
		return response

	def post(self, endpoint, payload):
		data = json.dumps(payload)
		r = post(self.__url + endpoint, headers=self.__headers, data=data)
		response = r.json()
		return response

	def put(self, endpoint, payload):
		data = json.dumps(payload)
		r = put(self.__url + endpoint, headers=self.__headers, data=data)
		response = r.json()
		return response

	def delete(self, endpoint, payload):
		data = json.dumps(payload)
		r = delete(self.__url + endpoint, headers=self.__headers, data=data)
		response = r.json()
		return response

def getService(app):
	url = IBMCloudEnv.getString('push_url')
	appSecret = IBMCloudEnv.getString('push_app_secret')
	clientSecret = IBMCloudEnv.getString('push_client_secret')
	return 'push-notifications', Push(url, appSecret, clientSecret)
