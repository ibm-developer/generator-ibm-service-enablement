@app.route('/redis-test')
def testRedis():
	messages = []

	r = service_manager.get('redis')

	if r.set('foo', 'bar'):
		messages.append('set data')
		if r.get('foo').decode("utf-8") == 'bar':
			messages.append('got data')

	return jsonify(messages)
