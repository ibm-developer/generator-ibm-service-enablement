from ibmcloudenv import IBMCloudEnv
from requests import get, post, put, delete

class Push:
	def __init__(self, url, apikey, clientSecret):
		self.url = url
		self.apikey = apikey
		self.clientSecret = clientSecret
		self.headers = {
			'accept': 'application/json',
			'apikey': apikey,
			'clientSecret': clientSecret,
			'content-type': 'application/json',
		}

	def sendPush(self, payload):
		return self.post('/messages', payload)

	def get(self, endpoint, payload):
		r = get(self.url + endpoint, headers=self.headers, json=payload)
		response = r.json()
		return response

	def post(self, endpoint, payload):
		r = post(self.url + endpoint, headers=self.headers, json=payload)
		response = r.json()
		return response

	def put(self, endpoint, payload):
		r = put(self.url + endpoint, headers=self.headers, json=payload)
		response = r.json()
		return response

	def delete(self, endpoint, payload):
		r = delete(self.url + endpoint, headers=self.headers, json=payload)
		response = r.json()
		return response
{{#ifCond backendPlatform '===' 'python'}}
def getService(app):
	url = IBMCloudEnv.getString('push_url')
	apikey = IBMCloudEnv.getString('push_apikey')
	clientSecret = IBMCloudEnv.getString('push_client_secret')
	return 'push-notifications', Push(url, apikey, clientSecret)
{{else}}
def getService():
    url = IBMCloudEnv.getString('push_url')
    apikey = IBMCloudEnv.getString('push_apikey')
    clientSecret = IBMCloudEnv.getString('push_client_secret')
    return 'push-notifications', Push(url, apikey, clientSecret)
{{/ifCond}}
