# Alert Notification

IBM Alert Notification instantly delivers notifications of problem occurrences in your IT operations environment using automated communication methods such as email, Short Message Service (SMS), voice and mobile messaging. You can use custom groups to send alerts for a problem or class of problem. Groups can be created based on administrative roles, application names, department names or other criteria. Custom filters can be created for alerting different users based on incident type and severity.

##  Credentials

###  LocalDevConfig

This is where your local configuration is stored for Alert Notification.
```
{
	"alertnotification_url": "{{url}}",
	"alert_notification_name": "{{name}}",
	"alert_notification_password": "{{password}}"
}
```

## Usage
[Alert Notification is accessed through a RESTful API](https://ibmnotifybm.mybluemix.net/docs/alerts/v1/). We provide a simple class for interacting with the three endpoints of the service:

 ```python
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
 ```

 The `service_manager` returns an initialized instance of this object populated with the provided credentials. [Refer to the complete API documentation](https://ibmnotifybm.mybluemix.net/docs/alerts/v1/) for full details on what can be provided in the payload of `sendAlert`:

```python
from flask import Flask
import requests

app = Flask(__name__, template_folder="../public", static_folder="../public", static_url_path='')

from server.services import *

initServices(app) # Initialize Services

alert = service_manager.get('alert-notification')

alertMessage = {
	'What': 'Alert Message',
	'Where': 'myserver.mycompany.com',
	'Severity': 'Critical'
}

res = alert.sendAlert(alertMessage)
if res and 'ShortId' in res:
	messageID = res['ShortId']
	alertInfo = alert.getAlert(messageID)
```
