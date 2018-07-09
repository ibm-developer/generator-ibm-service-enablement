os = None
@app.route('/cloud-object-storage-test')
def testCloudObjectStorage():
	new_bucket = 'NewBucket'
	messages = []
	workspace_id = '7fa12afa-a4b0-4646-8510-deda95f4a640'
	cos = service_manager.get('cloud_object_storage')

	# workspace_id is not a supplied credential from service_manager,
	# as each conversation service can have several workspaces.
	# thus exposing the credential, while not ideal, in this case is okay

	messages.append('test container was created')
	try:
		os.get_container('test')
		cos.create_bucket(Bucket=new_bucket)
		messages.append('bucket was created')
	except Exception as e:
		os.get_container('test')
		cos.create_bucket(Bucket=new_bucket)
		messages.append('bucket was created')
	return jsonify(messages)
