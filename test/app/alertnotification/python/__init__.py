@app.route('/alert-notification-test')
def alert():
	messages = []

	alertMessage = {
	    'What': 'sample alert',
	    'Where': 'someserver.ibm.com',
	    'Severity': 'Critical'
	}

	alert = service_manager.get('alert-notification')
	res = requests.post(alert['url'], auth=(alert['user'], alert['password']), json=alertMessage)

	if res and res.text:
            print(res.text)
	    messages.append('alert sent')

        return jsonify(messages)