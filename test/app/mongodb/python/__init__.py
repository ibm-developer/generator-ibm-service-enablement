client = None
@app.route('/mongodb-test')
def testMongo():
	messages = []

	client = service_manager.get('mongodb')
	db = client.test_database
	collection = db.test_collection

	datum = {
		"language": "python",
		"database": "mongo"
	}

	# Clears the collection completely
	collection.remove({})

	# Add new data
	datum_id = collection.insert_one(datum).inserted_id

	# Confirm receipt of data
	if collection.find_one({"_id": datum_id}):
		messages.append('entered and fetched data successfully')

	return jsonify(messages)
