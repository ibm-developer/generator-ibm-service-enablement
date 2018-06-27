from flask import Flask
from flask.json import jsonify
from flask import session, redirect, request, abort
from requests.auth import HTTPBasicAuth
import requests
import jwt
import atexit

app = Flask(__name__, template_folder="../public", static_folder="../public", static_url_path='')

from server.services import *

initServices(app)

@app.route('/cloud-object-storage-test')
def testPushNotifications():
	messages = []

	push = service_manager.get('cos')

	response = push.post('/messages', {
		"message": {
			"alert": "Cloud Object Storage"
		}
	})

	if 'message' in response:
		messages.append('message sent')

	if 'messageId' in response:
		messages.append('message id received')

	return jsonify(messages)




@atexit.register
def shutdown():
	pass
	

