@app.route('/alert-notification-test')
def alert():
	messages = []

	alertMessage = {
		'What': 'sample alert',
		'Where': 'someserver.ibm.com',
		'Severity': 'Critical'
	}

	alert = service_manager.get('alert-notification')
	res = alert.sendAlert(alertMessage)

	if res and 'ShortId' in res:
		messages.append('alert sent')
		alertID = res['ShortId']
		confirmation = alert.getAlert(alertID)
		if res == confirmation:
			messages.append('tracked alert')

	return jsonify(messages)
