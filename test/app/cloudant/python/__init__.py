cloudant = None
@app.route('/cloudant-test')
def testCloudant():
	messages = []
	cloudant = service_manager.get('cloudant')
	if 'test' in cloudant:
	    cloudant.delete_database('test')
	messages.append('test destroyed')


	data = {
		'age': 1337
	}

	db = cloudant.create_database('test')

	if not db.exists():
		abort(500, 'Database does not exist')
	else:
		messages.append('test created')
		document = db.create_document(data)

		if not document.exists():
			abort(500, 'Document does not exist')
		else:
			messages.append('document added')
			return jsonify(messages)