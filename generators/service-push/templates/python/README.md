# Push-Notifications

The Push Notifications service provides a unified push service to send real-time notifications to mobile and web applications. The service provides the ability to personalize and send notifications to a segment of users, single user or broadcast to all users. Push Notifications are a universally accepted communication channel across enterprises or for a wide spectrum of audience. You can deliver these notifications as an onscreen banner alert or to a device's locked screen, thus providing information updates that are quickly and easily accessible.

##  Credentials

###  LocalDevConfig

This is where your local configuration is stored for Push-Notifications.
```
{
  "push_appGuid": "{{appGuid}}",
  "push_appSecret": "{{appSecret}}",
  "push_clientSecret": "{{clientSecret}}",
  "push_url": "{{url}}"
}

```

## Usage

There is no official python SDK for working with Push-Notifications. Instead, [there is a RESTful API library for working with the service](https://console-regional.stage1.ng.bluemix.net/apidocs/800-push-notifications?&language=shell_curl#introduction). We have provided a basic python class to simplify the process of using the API:

```python
class Push:
	def __init__(self, url, appSecret, clientSecret):
		self.url = url
		self.appSecret = appSecret
		self.clientSecret = clientSecret
		self.headers = {
			'accept': 'application/json',
			'appSecret': appSecret,
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
```

The `service_manager` will return an initialized `Push` object pre-populated with the credentials provided that are necessary to work with Push-Notifications. [By referencing the API](https://console-regional.stage1.ng.bluemix.net/apidocs/800-push-notifications?&language=shell_curl#introduction), this object can be used to specify the the type of request, API endpoint, and data payload to make it simpler to work with the API:

```python
from flask import Flask
from flask import abort, session, request, redirect
from bson.objectid import ObjectId

app = Flask(__name__, template_folder="../public", static_folder="../public", static_url_path='')

from server.services import *

initServices(app) # Initialize Services

# Returns a Push class initialized with the secrets and url necessary to compose
# API requests to the Push-Notifications API
push = service_manager.get('push-notifications')

# Get device registration information
# https://console-regional.stage1.ng.bluemix.net/apidocs/800-push-notifications?&language=shell_curl#getdevices
devicesJSON = push.get('/devices', {})

# Send a push notification to all devices
# https://console-regional.stage1.ng.bluemix.net/apidocs/800-push-notifications?&language=shell_curl#sendmessage
response = push.post('/messages', {
  "message": {
    "alert": "Push Notification"
  }
})
```

(If you prefer, you can also extract `url`, `appSecret`, and `clientSecret` from the `push` object and manually write your own requests using the python `requests` package)
