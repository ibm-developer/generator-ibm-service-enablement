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
