@app.route('/push-notifications-test')
def testPushNotifications():
	messages = []

	push = service_manager.get('push-notifications')

	response = push.post('/messages', {
		"message": {
			"alert": "Push Notification"
		}
	})

	if 'message' in response:
		messages.append('message sent')

	if 'messageId' in response:
		messages.append('message id received')

	return jsonify(messages)
